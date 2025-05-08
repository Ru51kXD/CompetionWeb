'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaUsers, FaImage, FaInfoCircle } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function CreateTeamPage() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  })
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    image: ''
  })

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin()) {
      router.push('/login')
      return
    }
    
    setIsLoaded(true)
  }, [router, isAdmin])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      name: '',
      description: '',
      image: ''
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Название команды обязательно'
      isValid = false
    } else if (formData.name.length < 3) {
      newErrors.name = 'Название команды должно содержать не менее 3 символов'
      isValid = false
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание команды обязательно'
      isValid = false
    } else if (formData.description.length < 10) {
      newErrors.description = 'Описание должно содержать не менее 10 символов'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true)
      
      // Создаем объект новой команды
      const newTeam = {
        id: Date.now(), // используем timestamp как уникальный id
        name: formData.name,
        description: formData.description,
        memberCount: 1,
        competitionCount: 0,
        image: formData.image || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2069' // дефолтное изображение
      }
      
      // Загружаем существующие команды из localStorage
      let teams = []
      try {
        const storedTeams = localStorage.getItem('teams')
        if (storedTeams) {
          teams = JSON.parse(storedTeams)
        }
      } catch (error) {
        console.error('Ошибка при загрузке команд:', error)
      }
      
      // Добавляем новую команду и сохраняем обратно в localStorage
      teams.push(newTeam)
      localStorage.setItem('teams', JSON.stringify(teams))
      
      setTimeout(() => {
        console.log('Создана команда:', newTeam)
        setIsSubmitting(false)
        
        // Перенаправление на страницу команд
        router.push('/teams')
      }, 1500)
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
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Создание команды</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Создайте свою команду для участия в соревнованиях
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <motion.div 
              variants={formVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <form onSubmit={handleSubmit}>
                <motion.div variants={inputVariants} className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                    Название команды *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUsers className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Введите название команды"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {errors.name}
                    </p>
                  )}
                </motion.div>
                
                <motion.div variants={inputVariants} className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                    Описание команды *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`input ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Опишите вашу команду"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {errors.description}
                    </p>
                  )}
                </motion.div>
                
                <motion.div variants={inputVariants} className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="image">
                    URL изображения
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaImage className="text-gray-400" />
                    </div>
                    <input
                      id="image"
                      name="image"
                      type="text"
                      value={formData.image}
                      onChange={handleChange}
                      className={`input pl-10 ${errors.image ? 'border-red-500' : ''}`}
                      placeholder="Введите URL изображения команды"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Оставьте пустым для использования изображения по умолчанию
                  </p>
                  {errors.image && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {errors.image}
                    </p>
                  )}
                </motion.div>
                
                <motion.div variants={inputVariants} className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    type="submit"
                    className="btn-primary py-3 flex-1 flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Создание...
                      </>
                    ) : (
                      'Создать команду'
                    )}
                  </button>
                  <Link href="/teams" className="btn-outline py-3 flex-1 text-center">
                    Отмена
                  </Link>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 