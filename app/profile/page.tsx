'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaUser, FaEnvelope, FaLock, FaCheck, FaExclamationTriangle, FaEdit, FaSave } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  })

  useEffect(() => {
    // Redirect to login if user is not logged in
    if (!user) {
      router.push('/login')
      return
    }

    // Initialize form data with user info
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      confirmPassword: ''
    })
    
    setIsLoaded(true)
  }, [user, router])

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

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения'
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения'
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email'
      isValid = false
    }

    // Validate password only if provided (since it's optional during update)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true)
      
      try {
        // Get users from localStorage
        const storedUsers = localStorage.getItem('users')
        if (storedUsers && user) {
          const users = JSON.parse(storedUsers)
          const userIndex = users.findIndex((u: any) => u.id === user.id)
          
          if (userIndex !== -1) {
            // Check if email exists for another user
            const emailExists = users.some((u: any, index: number) => 
              index !== userIndex && u.email === formData.email
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
            
            // Update user information
            const updatedUser = {
              ...users[userIndex],
              name: formData.name,
              email: formData.email
            }
            
            // Update password if provided
            if (formData.password) {
              updatedUser.password = formData.password
            }
            
            users[userIndex] = updatedUser
            localStorage.setItem('users', JSON.stringify(users))
            
            // Update user in localStorage (for current session)
            const { password, ...userWithoutPassword } = updatedUser
            localStorage.setItem('user', JSON.stringify(userWithoutPassword))
            
            // Force page reload to update user context
            setSuccessMessage('Профиль успешно обновлен!')
            setIsSubmitting(false)
            setIsEditing(false)
            
            // Clear success message after 3 seconds
            setTimeout(() => {
              setSuccessMessage('')
              window.location.reload()
            }, 3000)
          }
        }
      } catch (error) {
        console.error('Ошибка при обновлении профиля:', error)
        setErrors(prev => ({
          ...prev,
          general: 'Произошла ошибка при обновлении профиля'
        }))
        setIsSubmitting(false)
      }
    }
  }

  // Don't render anything if user is not logged in (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className={`min-h-screen flex flex-col ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Мой профиль</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Управляйте своей учетной записью и личной информацией
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Личная информация</h2>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="btn-outline-primary flex items-center"
                  >
                    <FaEdit className="mr-2" /> Редактировать
                  </button>
                )}
              </div>
              
              {successMessage && (
                <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
                  <FaCheck className="mr-2" />
                  {successMessage}
                </div>
              )}
              
              {errors.general && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  {errors.general}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                    Имя
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input pl-10 ${errors.name ? 'border-red-500' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input pl-10 ${errors.email ? 'border-red-500' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                {isEditing && (
                  <>
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                        Новый пароль (оставьте пустым, чтобы не менять)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`input pl-10 ${errors.password ? 'border-red-500' : ''}`}
                          placeholder="Новый пароль"
                        />
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <FaExclamationTriangle className="mr-1" />
                          {errors.password}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
                        Подтверждение нового пароля
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`input pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          placeholder="Подтвердите новый пароль"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <FaExclamationTriangle className="mr-1" />
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-8">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false)
                          // Reset form to original values
                          setFormData({
                            name: user.name || '',
                            email: user.email || '',
                            password: '',
                            confirmPassword: ''
                          })
                          // Clear errors
                          setErrors({
                            name: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            general: ''
                          })
                        }}
                        className="btn-outline py-2 px-4"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="btn-primary py-2 px-4 flex items-center justify-center"
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
                  </>
                )}
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-2">Информация об аккаунте</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Роль</p>
                      <p className="text-gray-700">
                        {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </p>
                    </div>
                    {isAdmin() && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Административный доступ</p>
                        <p className="text-green-600">Активен</p>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 