'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaSave, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa'

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  })

  useEffect(() => {
    const fetchUser = () => {
      try {
        const storedUsers = localStorage.getItem('users')
        if (storedUsers) {
          const users = JSON.parse(storedUsers)
          const userIdInt = typeof userId === 'string' ? parseInt(userId, 10) : userId
          const user = users.find(u => u.id === userIdInt)
          
          if (user) {
            setFormData({
              name: user.name,
              email: user.email,
              password: '', // Don't load password for security reasons
              confirmPassword: '',
              role: user.role
            })
          } else {
            setNotFound(true)
          }
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: ''
    }

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения'
      isValid = false
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения'
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email'
      isValid = false
    }

    // Validate password only if provided
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Пароль должен содержать не менее 6 символов'
        isValid = false
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают'
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear the error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true)
      
      try {
        // Get existing users from localStorage
        const storedUsers = localStorage.getItem('users')
        if (storedUsers) {
          const users = JSON.parse(storedUsers)
          const userIdInt = typeof userId === 'string' ? parseInt(userId, 10) : userId
          const userIndex = users.findIndex(u => u.id === userIdInt)
          
          if (userIndex !== -1) {
            // Check if email already exists (but skip comparing with the current user)
            const emailExists = users.some((user, index) => 
              index !== userIndex && user.email === formData.email
            )
            
            if (emailExists) {
              setErrors(prev => ({
                ...prev,
                email: 'Пользователь с таким email уже существует',
                general: 'Пользователь с таким email уже существует'
              }))
              setIsSubmitting(false)
              return
            }
            
            // Update user data
            const updatedUser = {
              ...users[userIndex],
              name: formData.name,
              email: formData.email,
              role: formData.role
            }
            
            // Update password only if provided
            if (formData.password) {
              updatedUser.password = formData.password
            }
            
            // Update the user in the array
            users[userIndex] = updatedUser
            
            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users))
            
            // Redirect to users list after successful update
            setTimeout(() => {
              router.push('/admin/users')
            }, 1000)
          } else {
            setErrors(prev => ({
              ...prev,
              general: 'Пользователь не найден'
            }))
            setIsSubmitting(false)
          }
        }
      } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error)
        setErrors(prev => ({
          ...prev,
          general: 'Ошибка при обновлении пользователя'
        }))
        setIsSubmitting(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Пользователь не найден</h1>
        <p className="text-gray-600 mb-6">Запрашиваемый пользователь не существует или был удален.</p>
        <Link 
          href="/admin/users" 
          className="btn-primary"
        >
          Вернуться к списку пользователей
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/admin/users" 
          className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Вернуться к списку пользователей
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Редактирование пользователя</h1>
        
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {errors.general}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Имя *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
                Роль *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Новый пароль (оставьте пустым, чтобы не менять)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                Подтверждение нового пароля
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-3">
            <Link
              href="/admin/users"
              className="btn-outline px-4 py-2"
            >
              Отмена
            </Link>
            <button
              type="submit"
              className="btn-primary px-4 py-2 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Сохранение...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Сохранить изменения
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 