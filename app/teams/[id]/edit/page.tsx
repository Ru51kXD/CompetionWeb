'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { FaUsers, FaImage, FaInfoCircle, FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '../../../context/AuthContext'

export default function EditTeamPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id
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
  const [notFound, setNotFound] = useState(false)
  const { isAdmin } = useAuth()

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin()) {
      router.push('/login')
      return
    }
    
    const fetchTeam = () => {
      try {
        const storedTeams = localStorage.getItem('teams')
        if (storedTeams) {
          const allTeams = JSON.parse(storedTeams)
          const teamId = typeof id === 'string' ? parseInt(id, 10) : id
          const team = allTeams.find(t => t.id === teamId)
          
          if (team) {
            setFormData({
              name: team.name,
              description: team.description,
              image: team.image || ''
            })
          } else {
            setNotFound(true)
          }
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Ошибка при загрузке команды:', error)
        setNotFound(true)
      } finally {
        setIsLoaded(true)
      }
    }

    if (id) {
      fetchTeam()
    }
  }, [id, router, isAdmin])

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
      
      try {
        // Get current teams from localStorage
        const storedTeams = localStorage.getItem('teams')
        if (storedTeams) {
          const teams = JSON.parse(storedTeams)
          const teamId = typeof id === 'string' ? parseInt(id, 10) : id
          const teamIndex = teams.findIndex((t: any) => t.id === teamId)
          
          if (teamIndex !== -1) {
            // Update team with new data, preserving other properties
            teams[teamIndex] = {
              ...teams[teamIndex],
              name: formData.name,
              description: formData.description,
              image: formData.image || teams[teamIndex].image
            }
            
            // Save updated teams back to localStorage
            localStorage.setItem('teams', JSON.stringify(teams))
            
            setTimeout(() => {
              setIsSubmitting(false)
              router.push(`/teams/${id}`)
            }, 1000)
          } else {
            console.error('Команда не найдена')
            setIsSubmitting(false)
          }
        }
      } catch (error) {
        console.error('Ошибка при обновлении команды:', error)
        setIsSubmitting(false)
      }
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-4">Команда не найдена</h1>
              <p className="text-gray-600 mb-8">Команда, которую вы пытаетесь редактировать, не существует или была удалена.</p>
              <Link href="/teams" className="btn-primary inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Вернуться к списку команд
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
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
            className="mb-6"
          >
            <Link href={`/teams/${id}`} className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <FaArrowLeft className="mr-2" /> Вернуться к команде
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Редактирование команды</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Обновите информацию о вашей команде
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
                    Оставьте пустым для использования текущего изображения
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
                        Сохранение...
                      </>
                    ) : (
                      'Сохранить изменения'
                    )}
                  </button>
                  <Link href={`/teams/${id}`} className="btn-outline py-3 flex-1 text-center">
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