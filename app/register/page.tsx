'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaUser, FaEnvelope, FaLock, FaCheck, FaExclamationTriangle } from 'react-icons/fa'

export default function RegisterPage() {
  const [isLoaded, setIsLoaded] = useState(false)
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
    confirmPassword: ''
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
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
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

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен для заполнения'
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать не менее 6 символов'
      isValid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
      isValid = false
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
      setSubmitStatus('loading')
      
      // Simulate API call
      setTimeout(() => {
        // In a real app, we would send data to the server here
        console.log('Registration data:', formData)
        setSubmitStatus('success')
        
        // Reset form after successful registration
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        })
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      }, 1500)
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
            <h1 className="text-4xl font-bold mb-4">Регистрация</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Создайте аккаунт, чтобы получить доступ ко всем возможностям платформы
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
                      className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Ваше имя"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      {errors.name}
                    </p>
                  )}
                </motion.div>
                
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
                      placeholder="Минимум 6 символов"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      {errors.password}
                    </p>
                  )}
                </motion.div>
                
                <motion.div variants={inputVariants} className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
                    Подтверждение пароля
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
                      placeholder="Введите пароль еще раз"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </motion.div>
                
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
                      Регистрация...
                    </span>
                  ) : submitStatus === 'success' ? (
                    <span className="flex items-center justify-center">
                      <FaCheck className="mr-2" />
                      Регистрация успешна!
                    </span>
                  ) : (
                    "Зарегистрироваться"
                  )}
                </motion.button>
                
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm flex items-start"
                  >
                    <FaExclamationTriangle className="mr-2 mt-0.5" />
                    <span>Пожалуйста, исправьте ошибки в форме и попробуйте снова.</span>
                  </motion.div>
                )}
              </form>
              
              <motion.div variants={inputVariants} className="mt-6 text-center text-sm text-gray-600">
                Уже есть аккаунт?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                  Войти
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 