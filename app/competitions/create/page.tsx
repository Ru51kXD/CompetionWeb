'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaTrophy, FaMapMarkerAlt, FaCalendarAlt, FaImage, FaInfoCircle, FaUsers, FaListUl } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function CreateCompetitionPage() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    image: '',
    participantCount: 0,
    status: 'upcoming'
  })
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    image: ''
  })
  const [teams, setTeams] = useState([])
  const [selectedTeams, setSelectedTeams] = useState([])

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin()) {
      router.push('/login')
      return
    }
    
    setIsLoaded(true)
    
    // Load teams for selection
    try {
      const storedTeams = localStorage.getItem('teams')
      if (storedTeams) {
        const parsedTeams = JSON.parse(storedTeams)
        if (Array.isArray(parsedTeams)) {
          setTeams(parsedTeams)
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке команд:', error)
    }
  }, [router, isAdmin])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleTeamSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = parseInt(e.target.value, 10)
    if (teamId && !selectedTeams.includes(teamId)) {
      setSelectedTeams([...selectedTeams, teamId])
    }
  }

  const removeSelectedTeam = (teamId: number) => {
    setSelectedTeams(selectedTeams.filter(id => id !== teamId))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      image: ''
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Название соревнования обязательно'
      isValid = false
    } else if (formData.title.length < 5) {
      newErrors.title = 'Название должно содержать не менее 5 символов'
      isValid = false
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание соревнования обязательно'
      isValid = false
    } else if (formData.description.length < 10) {
      newErrors.description = 'Описание должно содержать не менее 10 символов'
      isValid = false
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Дата начала обязательна'
      isValid = false
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Дата окончания обязательна'
      isValid = false
    } else if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'Дата окончания должна быть позже даты начала'
      isValid = false
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Место проведения обязательно'
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
        // Create competition object
        const newCompetition = {
          id: Date.now(),
          title: formData.title,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          location: formData.location,
          image: formData.image || 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2070',
          participantCount: selectedTeams.length || 0,
          status: formData.status,
          teams: selectedTeams
        }
        
        // Load existing competitions from localStorage
        let competitions = []
        try {
          const storedCompetitions = localStorage.getItem('competitions')
          if (storedCompetitions) {
            competitions = JSON.parse(storedCompetitions)
          }
        } catch (error) {
          console.error('Ошибка при загрузке соревнований:', error)
        }
        
        // Add new competition and save back to localStorage
        competitions.push(newCompetition)
        localStorage.setItem('competitions', JSON.stringify(competitions))
        
        // Update team competition counts
        if (selectedTeams.length > 0) {
          const storedTeams = localStorage.getItem('teams')
          if (storedTeams) {
            const teams = JSON.parse(storedTeams)
            
            selectedTeams.forEach(teamId => {
              const teamIndex = teams.findIndex((t: any) => t.id === teamId)
              if (teamIndex !== -1) {
                teams[teamIndex] = {
                  ...teams[teamIndex],
                  competitionCount: (teams[teamIndex].competitionCount || 0) + 1
                }
              }
            })
            
            localStorage.setItem('teams', JSON.stringify(teams))
          }
        }
        
        setTimeout(() => {
          console.log('Создано соревнование:', newCompetition)
          setIsSubmitting(false)
          router.push('/competitions')
        }, 1500)
      } catch (error) {
        console.error('Ошибка при создании соревнования:', error)
        setIsSubmitting(false)
      }
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Создание соревнования</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Создайте новое соревнование и пригласите команды к участию
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
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                    Название соревнования *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTrophy className="text-gray-400" />
                    </div>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      className={`input pl-10 ${errors.title ? 'border-red-500' : ''}`}
                      placeholder="Введите название соревнования"
                    />
                  </div>
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {errors.title}
                    </p>
                  )}
                </motion.div>
                
                <motion.div variants={inputVariants} className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                    Описание соревнования *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`input ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Опишите ваше соревнование, правила участия и другую важную информацию"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {errors.description}
                    </p>
                  )}
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <motion.div variants={inputVariants}>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="startDate">
                      Дата начала *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="text-gray-400" />
                      </div>
                      <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={`input pl-10 ${errors.startDate ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.startDate && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <FaInfoCircle className="mr-1" />
                        {errors.startDate}
                      </p>
                    )}
                  </motion.div>
                  
                  <motion.div variants={inputVariants}>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="endDate">
                      Дата окончания *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="text-gray-400" />
                      </div>
                      <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        className={`input pl-10 ${errors.endDate ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.endDate && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <FaInfoCircle className="mr-1" />
                        {errors.endDate}
                      </p>
                    )}
                  </motion.div>
                </div>
                
                <motion.div variants={inputVariants} className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="location">
                    Место проведения *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      className={`input pl-10 ${errors.location ? 'border-red-500' : ''}`}
                      placeholder="Укажите место проведения соревнования"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      {errors.location}
                    </p>
                  )}
                </motion.div>
                
                <motion.div variants={inputVariants} className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="status">
                    Статус соревнования
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaListUl className="text-gray-400" />
                    </div>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="input pl-10"
                    >
                      <option value="upcoming">Предстоит</option>
                      <option value="active">Активно</option>
                      <option value="completed">Завершено</option>
                    </select>
                  </div>
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
                      placeholder="Введите URL изображения соревнования"
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
                
                <motion.div variants={inputVariants} className="mb-8">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Выберите команды-участники
                  </label>
                  <div className="flex gap-4 items-center">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUsers className="text-gray-400" />
                      </div>
                      <select
                        className="input pl-10 w-full"
                        onChange={handleTeamSelect}
                        value=""
                      >
                        <option value="" disabled>Выберите команду для добавления</option>
                        {teams.map(team => (
                          <option 
                            key={team.id} 
                            value={team.id}
                            disabled={selectedTeams.includes(team.id)}
                          >
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {selectedTeams.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Выбранные команды:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTeams.map(teamId => {
                          const team = teams.find(t => t.id === teamId)
                          return team ? (
                            <div 
                              key={teamId}
                              className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                            >
                              {team.name}
                              <button 
                                type="button"
                                onClick={() => removeSelectedTeam(teamId)}
                                className="ml-2 text-gray-500 hover:text-red-500"
                              >
                                ×
                              </button>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-500 text-xs mt-3">
                    Вы можете выбрать несколько команд или добавить их позже
                  </p>
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
                      'Создать соревнование'
                    )}
                  </button>
                  <Link href="/competitions" className="btn-outline py-3 flex-1 text-center">
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