'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaEnvelope, FaLock, FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  })
  const [submitStatus, setSubmitStatus] = useState<'none' | 'loading' | 'success' | 'error'>('none')
  const router = useRouter()
  const { login, user } = useAuth()

  useEffect(() => {
    setIsLoaded(true)
    // If user is already logged in, redirect to home
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      email: '',
      password: '',
      general: ''
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения'
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email'
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен для заполнения'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      setSubmitStatus('loading')
      
      try {
        const result = await login(formData.email, formData.password)
        
        if (result.success) {
          setSubmitStatus('success')
          
          // Redirect after successful login
          setTimeout(() => {
            // Redirect admin to admin dashboard
            if (formData.email === 'admin@example.com') {
              router.push('/admin')
            } else {
              router.push('/')
            }
          }, 1000)
        } else {
          setErrors(prev => ({
            ...prev,
            general: result.message
          }))
          setSubmitStatus('error')
        }
      } catch (error) {
        console.error('Login error:', error)
        setErrors(prev => ({
          ...prev,
          general: 'Ошибка при входе. Попробуйте позже.'
        }))
        setSubmitStatus('error')
      }
    } else {
      setSubmitStatus('error')
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  // Don't render the page if the user is already logged in
  if (user) {
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
            <h1 className="text-4xl font-bold mb-4">Вход в систему</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Войдите в свой аккаунт, чтобы получить доступ к платформе
            </p>
          </motion.div>
          
          <div className="max-w-md mx-auto">
            <motion.div 
              variants={formVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <form onSubmit={handleSubmit}>
                {errors.general && (
                  <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    {errors.general}
                  </div>
                )}
                
                {submitStatus === 'success' && (
                  <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
                    <FaCheck className="mr-2" />
                    Вход выполнен успешно. Перенаправление...
                  </div>
                )}
                
                <motion.div variants={inputVariants} className="mb-6">
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
                      className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      {errors.email}
                    </p>
                  )}
                </motion.div>
                
                <motion.div variants={inputVariants} className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                    Пароль
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
                      placeholder="Ваш пароль"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      {errors.password}
                    </p>
                  )}
                </motion.div>
                
                <motion.div variants={inputVariants} className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Запомнить меня
                    </label>
                  </div>
                  
                  <Link href="#" className="text-sm text-primary-600 hover:text-primary-800">
                    Забыли пароль?
                  </Link>
                </motion.div>
                
                <motion.div variants={inputVariants}>
                  <button
                    type="submit"
                    disabled={submitStatus === 'loading' || submitStatus === 'success'}
                    className="btn-primary w-full py-3 flex items-center justify-center"
                  >
                    {submitStatus === 'loading' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Вход...
                      </>
                    ) : (
                      'Войти'
                    )}
                  </button>
                </motion.div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Еще нет аккаунта?{' '}
                    <Link href="/register" className="text-primary-600 hover:text-primary-800 font-medium">
                      Зарегистрироваться
                    </Link>
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
                  <p>Для входа в панель администратора используйте:</p>
                  <p className="mt-1">Email: admin@example.com</p>
                  <p>Пароль: admin123</p>
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