'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaEnvelope, FaUser, FaPaperPlane, FaCheck, FaExclamationTriangle } from 'react-icons/fa'

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
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
      name: '',
      email: '',
      subject: '',
      message: '',
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

    if (!formData.subject.trim()) {
      newErrors.subject = 'Тема обязательна для заполнения'
      isValid = false
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Сообщение обязательно для заполнения'
      isValid = false
    } else if (formData.message.length < 10) {
      newErrors.message = 'Сообщение должно содержать не менее 10 символов'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      
      try {
        // In a real app, you would send the message to a backend
        // For now, we'll simulate a successful submission
        setTimeout(() => {
          // Get existing messages from localStorage or create empty array
          const storedMessages = localStorage.getItem('contactMessages')
          const messages = storedMessages ? JSON.parse(storedMessages) : []
          
          // Add new message with timestamp
          messages.push({
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString(),
            read: false
          })
          
          // Save updated messages
          localStorage.setItem('contactMessages', JSON.stringify(messages))
          
          setSubmitStatus('success')
          
          // Reset form after successful submission
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          })
          
          // Reset status after 5 seconds
          setTimeout(() => {
            setSubmitStatus('none')
          }, 5000)
        }, 1500)
      } catch (error) {
        console.error('Ошибка при отправке сообщения:', error)
        setErrors(prev => ({
          ...prev,
          general: 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте снова.'
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
            <h1 className="text-4xl font-bold mb-4">Свяжитесь с нами</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              У вас есть вопросы или предложения? Заполните форму ниже, и мы свяжемся с вами в ближайшее время.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <motion.div 
              variants={formVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-lg p-8"
              style={{ backgroundColor: 'var(--color-bg-primary)' }}
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
                    Ваше сообщение успешно отправлено! Мы ответим вам в ближайшее время.
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={inputVariants} className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                      Ваше имя *
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
                      Email *
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
                </div>
                
                <motion.div variants={inputVariants} className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="subject">
                    Тема сообщения *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`input ${errors.subject ? 'border-red-500' : ''}`}
                    placeholder="Тема вашего сообщения"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      {errors.subject}
                    </p>
                  )}
                </motion.div>
                
                <motion.div variants={inputVariants} className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="message">
                    Сообщение *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`input ${errors.message ? 'border-red-500' : ''}`}
                    placeholder="Ваше сообщение..."
                    rows={6}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      {errors.message}
                    </p>
                  )}
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
                        Отправка...
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <FaCheck className="mr-2" />
                        Отправлено
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Отправить сообщение
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <h2 className="text-2xl font-semibold mb-4">Другие способы связи</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                  <h3 className="font-semibold text-lg mb-2">Email</h3>
                  <p className="text-gray-600">info@competitionweb.ru</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                  <h3 className="font-semibold text-lg mb-2">Телефон</h3>
                  <p className="text-gray-600">+7 (123) 456-7890</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 