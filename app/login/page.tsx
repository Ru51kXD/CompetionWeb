'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaEnvelope, FaLock, FaCheck, FaExclamationTriangle } from 'react-icons/fa'

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

  useEffect(() => {
    setIsLoaded(true)
  }, [])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setSubmitStatus('loading')
      
      // Simulate API call
      setTimeout(() => {
        // Mock authentication - In a real app, we would validate credentials with the server
        if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
          setSubmitStatus('success')
          
          // Redirect to home page after successful login
          setTimeout(() => {
            window.location.href = '/'
          }, 1000)
        } else {
          setErrors(prev => ({
            ...prev,
            general: 'Неверный email или пароль'
          }))
          setSubmitStatus('error')
        }
      }, 1000)
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
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Запомнить меня
                    </label>
                  </div>
                  
                  <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-800">
                    Забыли пароль?
                  </Link>
                </motion.div>
                
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm flex items-start"
                  >
                    <FaExclamationTriangle className="mr-2 mt-0.5" />
                    <span>{errors.general}</span>
                  </motion.div>
                )}
                
                <motion.button
                  variants={inputVariants}
                  type="submit"
                  className="btn-primary w-full py-3 relative"
                  disabled={submitStatus === 'loading' || submitStatus === 'success'}
                >
                  {submitStatus === 'loading' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Вход...
                    </span>
                  ) : submitStatus === 'success' ? (
                    <span className="flex items-center justify-center">
                      <FaCheck className="mr-2" />
                      Успешный вход!
                    </span>
                  ) : (
                    "Войти"
                  )}
                </motion.button>
              </form>
              
              <motion.div variants={inputVariants} className="mt-6 text-center text-sm text-gray-600">
                Нет аккаунта?{' '}
                <Link href="/register" className="text-primary-600 hover:text-primary-800 font-medium">
                  Зарегистрироваться
                </Link>
              </motion.div>
              
              <motion.div variants={inputVariants} className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center mb-4">
                  Для демонстрации вы можете использовать:
                </p>
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  <p><strong>Email:</strong> admin@example.com</p>
                  <p><strong>Пароль:</strong> admin123</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 