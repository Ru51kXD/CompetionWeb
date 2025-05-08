'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { FaSave, FaCalendarAlt, FaMapMarkerAlt, FaTrophy, FaExclamationTriangle, FaArrowLeft, FaImage, FaPlus, FaTrash } from 'react-icons/fa'
import { useAuth } from '../../../context/AuthContext'

export default function EditCompetitionPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAdmin } = useAuth()
  const competitionId = params.id

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableTeams, setAvailableTeams] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'SPORTS',
    startDate: '',
    endDate: '',
    location: '',
    image: '',
    rules: '',
    organizer: '',
    contactEmail: '',
    contactPhone: '',
    status: 'upcoming',
    teams: [] as number[]
  })
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    general: ''
  })

  useEffect(() => {
    // Redirect if user is not admin
    if (user && !isAdmin()) {
      router.push('/')
      return
    }

    if (competitionId) {
      fetchCompetition()
      fetchTeams()
    }
  }, [competitionId, user, isAdmin, router])

  const fetchCompetition = () => {
    setLoading(true)
    try {
      const storedCompetitions = localStorage.getItem('competitions')
      if (storedCompetitions) {
        const competitions = JSON.parse(storedCompetitions)
        const compId = typeof competitionId === 'string' ? parseInt(competitionId, 10) : competitionId
        const competition = competitions.find(c => c.id === compId)
        
        if (competition) {
          // Format dates for input fields
          const startDate = new Date(competition.startDate)
          const endDate = new Date(competition.endDate)
          
          setFormData({
            ...competition,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            teams: competition.teams || []
          })
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
      setLoading(false)
    }
  }

  const fetchTeams = () => {
    try {
      const storedTeams = localStorage.getItem('teams')
      if (storedTeams) {
        setAvailableTeams(JSON.parse(storedTeams))
      } else {
        setAvailableTeams([])
      }
    } catch (error) {
      console.error('Ошибка при загрузке команд:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleTeamSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeamId(e.target.value)
  }

  const addSelectedTeam = () => {
    if (!selectedTeamId) return
    
    const teamId = parseInt(selectedTeamId, 10)
    if (!formData.teams.includes(teamId)) {
      setFormData(prev => ({
        ...prev,
        teams: [...prev.teams, teamId]
      }))
    }
    setSelectedTeamId('')
  }

  const removeSelectedTeam = (teamId: number) => {
    setFormData(prev => ({
      ...prev,
      teams: prev.teams.filter(id => id !== teamId)
    }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      general: ''
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно для заполнения'
      isValid = false
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно для заполнения'
      isValid = false
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Дата начала обязательна для заполнения'
      isValid = false
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Дата окончания обязательна для заполнения'
      isValid = false
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'Дата окончания должна быть позже даты начала'
      isValid = false
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Место проведения обязательно для заполнения'
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
        const storedCompetitions = localStorage.getItem('competitions')
        if (storedCompetitions) {
          const competitions = JSON.parse(storedCompetitions)
          const compId = typeof competitionId === 'string' ? parseInt(competitionId, 10) : competitionId
          const competitionIndex = competitions.findIndex(c => c.id === compId)
          
          if (competitionIndex !== -1) {
            // Prepare data for saving
            const updatedCompetition = {
              ...competitions[competitionIndex],
              ...formData,
              startDate: new Date(formData.startDate),
              endDate: new Date(formData.endDate),
              participantCount: formData.teams.length
            }
            
            // Update competition in array
            competitions[competitionIndex] = updatedCompetition
            
            // Save to localStorage
            localStorage.setItem('competitions', JSON.stringify(competitions))
            
            // Update teams' competition counts
            const storedTeams = localStorage.getItem('teams')
            if (storedTeams) {
              const teams = JSON.parse(storedTeams)
              
              // Reset competition counts for all teams
              teams.forEach(team => {
                const teamCompetitions = competitions.filter(c => 
                  c.teams && c.teams.includes(team.id)
                )
                team.competitionCount = teamCompetitions.length
              })
              
              // Save updated teams
              localStorage.setItem('teams', JSON.stringify(teams))
            }
            
            // Redirect after successful save
            setTimeout(() => {
              router.push(`/competitions/${compId}`)
            }, 1000)
          }
        }
      } catch (error) {
        console.error('Ошибка при сохранении соревнования:', error)
        setErrors(prev => ({
          ...prev,
          general: 'Произошла ошибка при сохранении соревнования'
        }))
        setIsSubmitting(false)
      }
    }
  }

  // Don't render if user is not admin (will redirect)
  if (user && !isAdmin()) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        </main>
        <Footer />
      </div>
    )
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
              <p className="text-gray-600 mb-8">Возможно, соревнование было удалено или у вас нет доступа.</p>
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link href={`/competitions/${competitionId}`} className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <FaArrowLeft className="mr-2" /> Вернуться к соревнованию
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-xl overflow-hidden p-6 md:p-8">
              <h1 className="text-3xl font-bold mb-6">Редактирование соревнования</h1>
              
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  {errors.general}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                      Название соревнования *
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      className={`input ${errors.title ? 'border-red-500' : ''}`}
                      placeholder="Введите название соревнования"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="type">
                      Тип соревнования *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="SPORTS">Спортивное</option>
                      <option value="INTELLECTUAL">Интеллектуальное</option>
                      <option value="CREATIVE">Творческое</option>
                    </select>
                  </div>
                  
                  <div>
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
                      <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                    )}
                  </div>
                  
                  <div>
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
                      <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                    )}
                  </div>
                  
                  <div>
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
                        placeholder="Укажите место проведения"
                      />
                    </div>
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="status">
                      Статус соревнования *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="upcoming">Предстоит</option>
                      <option value="active">Активно</option>
                      <option value="completed">Завершено</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
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
                        className="input pl-10"
                        placeholder="Укажите URL изображения"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                      Описание *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`input min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
                      placeholder="Введите описание соревнования"
                      rows={4}
                    ></textarea>
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="rules">
                      Правила
                    </label>
                    <textarea
                      id="rules"
                      name="rules"
                      value={formData.rules}
                      onChange={handleChange}
                      className="input min-h-[120px]"
                      placeholder="Введите правила соревнования"
                      rows={4}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="organizer">
                      Организатор
                    </label>
                    <input
                      id="organizer"
                      name="organizer"
                      type="text"
                      value={formData.organizer}
                      onChange={handleChange}
                      className="input"
                      placeholder="Название организатора"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="contactEmail">
                      Контактный email
                    </label>
                    <input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="input"
                      placeholder="contact@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="contactPhone">
                      Контактный телефон
                    </label>
                    <input
                      id="contactPhone"
                      name="contactPhone"
                      type="text"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="input"
                      placeholder="+7 (123) 456-78-90"
                    />
                  </div>
                </div>
                
                {/* Teams selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Команды-участники</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.teams.map(teamId => {
                      const team = availableTeams.find(t => t.id === teamId)
                      return team ? (
                        <div 
                          key={teamId}
                          className="bg-gray-100 rounded-full py-1 px-3 flex items-center text-sm"
                        >
                          <span className="mr-2">{team.name}</span>
                          <button 
                            type="button"
                            onClick={() => removeSelectedTeam(teamId)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      ) : null
                    })}
                    {formData.teams.length === 0 && (
                      <p className="text-gray-500 text-sm">Нет выбранных команд</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={selectedTeamId}
                      onChange={handleTeamSelect}
                      className="input flex-grow"
                    >
                      <option value="">Выберите команду</option>
                      {availableTeams
                        .filter(team => !formData.teams.includes(team.id))
                        .map(team => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))
                      }
                    </select>
                    <button 
                      type="button"
                      onClick={addSelectedTeam}
                      disabled={!selectedTeamId}
                      className="btn-outline py-2 px-4 flex items-center"
                    >
                      <FaPlus className="mr-1" /> Добавить
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Link
                    href={`/competitions/${competitionId}`}
                    className="btn-outline py-2 px-4"
                  >
                    Отмена
                  </Link>
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
              </form>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 