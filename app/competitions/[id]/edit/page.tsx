'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { FaTrophy, FaMapMarkerAlt, FaCalendarAlt, FaImage, FaInfoCircle, FaUsers, FaListUl, FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '../../../context/AuthContext'

export default function EditCompetitionPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id
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
    status: ''
  })
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    image: ''
  })
  const [notFound, setNotFound] = useState(false)
  const [teams, setTeams] = useState([])
  const [selectedTeams, setSelectedTeams] = useState([])

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin()) {
      router.push('/login')
      return
    }
    
    const fetchCompetition = () => {
      try {
        const storedCompetitions = localStorage.getItem('competitions')
        const storedTeams = localStorage.getItem('teams')
        
        if (storedCompetitions) {
          const allCompetitions = JSON.parse(storedCompetitions)
          const competitionId = typeof id === 'string' ? parseInt(id, 10) : id
          const competition = allCompetitions.find(c => c.id === competitionId)
          
          if (competition) {
            setFormData({
              title: competition.title,
              description: competition.description,
              startDate: competition.startDate,
              endDate: competition.endDate,
              location: competition.location,
              image: competition.image || '',
              status: competition.status
            })
            
            if (competition.teams) {
              setSelectedTeams(competition.teams)
            }
            
            // Load available teams
            if (storedTeams) {
              const teams = JSON.parse(storedTeams)
              setTeams(teams)
            }
          } else {
            setNotFound(true)
          }
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Ошибка при загрузке соревнования:', error)
        setNotFound(true)
      } finally {
        setIsLoaded(true)
      }
    }

    if (id) {
      fetchCompetition()
    }
  }, [id, router, isAdmin])

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
        // Get current competitions from localStorage
        const storedCompetitions = localStorage.getItem('competitions')
        if (storedCompetitions) {
          const competitions = JSON.parse(storedCompetitions)
          const competitionId = typeof id === 'string' ? parseInt(id, 10) : id
          const competitionIndex = competitions.findIndex((c: any) => c.id === competitionId)
          
          if (competitionIndex !== -1) {
            const oldTeams = competitions[competitionIndex].teams || []
            
            // Check which teams were removed
            const removedTeams = oldTeams.filter(teamId => !selectedTeams.includes(teamId))
            // Check which teams were added
            const addedTeams = selectedTeams.filter(teamId => !oldTeams.includes(teamId))
            
            // Update competition with new data, preserving other properties
            competitions[competitionIndex] = {
              ...competitions[competitionIndex],
              title: formData.title,
              description: formData.description,
              startDate: formData.startDate,
              endDate: formData.endDate,
              location: formData.location,
              image: formData.image || competitions[competitionIndex].image,
              status: formData.status,
              teams: selectedTeams,
              participantCount: selectedTeams.length
            }
            
            // Save updated competitions back to localStorage
            localStorage.setItem('competitions', JSON.stringify(competitions))
            
            // Update team competition counts
            if (removedTeams.length > 0 || addedTeams.length > 0) {
              const storedTeams = localStorage.getItem('teams')
              if (storedTeams) {
                const teams = JSON.parse(storedTeams)
                
                // Decrease count for removed teams
                removedTeams.forEach(teamId => {
                  const teamIndex = teams.findIndex((t: any) => t.id === teamId)
                  if (teamIndex !== -1 && teams[teamIndex].competitionCount > 0) {
                    teams[teamIndex] = {
                      ...teams[teamIndex],
                      competitionCount: teams[teamIndex].competitionCount - 1
                    }
                  }
                })
                
                // Increase count for added teams
                addedTeams.forEach(teamId => {
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
              setIsSubmitting(false)
              router.push(`/competitions/${id}`)
            }, 1000)
          } else {
            console.error('Соревнование не найдено')
            setIsSubmitting(false)
          }
        }
      } catch (error) {
        console.error('Ошибка при обновлении соревнования:', error)
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
              <h1 className="text-3xl font-bold mb-4">Соревнование не найдено</h1>
              <p className="text-gray-600 mb-8">Соревнование, которое вы пытаетесь редактировать, не существует или было удалено.</p>
              <Link href="/competitions" className="btn-primary inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Вернуться к списку соревнований
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
            <Link href={`/competitions/${id}`} className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <FaArrowLeft className="mr-2" /> Вернуться к соревнованию
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Редактирование соревнования</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Обновите информацию о соревновании
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
                    placeholder="Опишите соревнование"
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
                    Оставьте пустым для использования текущего изображения
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
                    Команды-участники
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
                  <Link href={`/competitions/${id}`} className="btn-outline py-3 flex-1 text-center">
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