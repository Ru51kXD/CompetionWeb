'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaTrophy, FaMapMarkerAlt, FaCalendarAlt, FaImage, FaInfoCircle, FaUsers, FaListUl, FaArrowLeft, FaTrash, FaPlus } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import GoogleLocationPicker from '../../components/GoogleLocationPicker'

export default function CreateCompetitionPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
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
    status: 'upcoming',
    maxTeams: 10, // Maximum number of teams that can participate
    maxTeamSize: 10, // Maximum number of members per team
    coordinates: [37.6156, 55.7522] as [number, number], // Москва по умолчанию
    city: '',
    country: '',
    competitionType: 'team', // Default to team competition
    prizePool: 0, // Prize pool amount
    entryFee: 0 // Entry fee amount
  })
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    image: '',
    maxTeams: '',
    maxTeamSize: ''
  })
  const [teams, setTeams] = useState([])
  const [selectedTeams, setSelectedTeams] = useState([])

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login?redirect=/competitions/create')
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
  }, [router, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxTeams' || name === 'maxTeamSize' ? parseInt(value, 10) || 0 : value
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
      if (selectedTeams.length >= formData.maxTeams) {
        setErrors(prev => ({
          ...prev,
          maxTeams: `Достигнуто максимальное количество команд (${formData.maxTeams})`
        }))
        return
      }
      setSelectedTeams([...selectedTeams, teamId])
    }
  }

  const removeSelectedTeam = (teamId: number) => {
    setSelectedTeams(selectedTeams.filter(id => id !== teamId))
    
    // Clear max teams error if we're now below the limit
    if (errors.maxTeams && selectedTeams.length <= formData.maxTeams) {
      setErrors(prev => ({
        ...prev,
        maxTeams: ''
      }))
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      image: '',
      maxTeams: '',
      maxTeamSize: ''
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
    
    if (formData.maxTeams <= 0) {
      newErrors.maxTeams = 'Количество команд должно быть больше 0'
      isValid = false
    }
    
    if (formData.maxTeamSize <= 0) {
      newErrors.maxTeamSize = 'Размер команды должен быть больше 0'
      isValid = false
    }

    if (formData.prizePool < 0) {
      newErrors.title = 'Призовой фонд не может быть отрицательным'
      isValid = false
    }
    
    if (formData.entryFee < 0) {
      newErrors.title = 'Стоимость участия не может быть отрицательной'
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
          teams: formData.competitionType === 'team' ? selectedTeams : [],
          maxTeams: formData.maxTeams,
          maxTeamSize: formData.maxTeamSize,
          createdBy: user?.id || 0,
          creatorName: user?.name || 'Аноним',
          competitionType: formData.competitionType,
          prizePool: formData.prizePool,
          entryFee: formData.entryFee,
          paidTeams: [] // Teams that have paid the entry fee
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
        
        // Update team competition counts and enforce team size limits
        if (selectedTeams.length > 0) {
          const storedTeams = localStorage.getItem('teams')
          if (storedTeams) {
            const teams = JSON.parse(storedTeams)
            
            selectedTeams.forEach(teamId => {
              const teamIndex = teams.findIndex((t: any) => t.id === teamId)
              if (teamIndex !== -1) {
                // Update competition count
                teams[teamIndex] = {
                  ...teams[teamIndex],
                  competitionCount: (teams[teamIndex].competitionCount || 0) + 1
                }
                
                // Ensure the team has maxMembers set based on the competition limit
                if (!teams[teamIndex].maxMembers || teams[teamIndex].maxMembers > formData.maxTeamSize) {
                  teams[teamIndex].maxMembers = formData.maxTeamSize
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

  const handleLocationChange = (location) => {
    setFormData({
      ...formData,
      location: location.address,
      coordinates: location.coordinates,
      city: location.city,
      country: location.country
    })
  }
  
  // Don't render if not logged in
  if (!user) {
    return null
  }

  if (!isLoaded) {
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/competitions" className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <FaArrowLeft className="mr-2" /> Вернуться к списку соревнований
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl overflow-hidden p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Создание нового соревнования</h1>
            
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
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
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
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="competitionType">
                    Тип соревнования *
                  </label>
                  <select
                    id="competitionType"
                    name="competitionType"
                    value={formData.competitionType}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="team">Командное</option>
                    <option value="individual">Индивидуальное</option>
                  </select>
                  <p className="text-gray-500 text-xs mt-1">
                    {formData.competitionType === 'team' 
                      ? 'В соревновании участвуют команды' 
                      : 'В соревновании участвуют отдельные спортсмены'}
                  </p>
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
                  {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
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
                  {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Местоположение
                  </label>
                  <p className="text-gray-600 text-sm mb-3">
                    Выберите место проведения соревнования на карте или введите адрес в поле поиска
                  </p>
                  <GoogleLocationPicker 
                    initialAddress={formData.location}
                    initialCoordinates={formData.coordinates}
                    onLocationChange={handleLocationChange}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                  )}
                </div>
                
                <div>
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
                      placeholder="Укажите URL изображения соревнования"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="prizePool">
                    Призовой фонд (₸)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTrophy className="text-gray-400" />
                    </div>
                    <input
                      id="prizePool"
                      name="prizePool"
                      type="number"
                      min="0"
                      value={formData.prizePool}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="Укажите сумму призового фонда"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Укажите 0, если призового фонда нет</p>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="entryFee">
                    Стоимость участия (₸)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUsers className="text-gray-400" />
                    </div>
                    <input
                      id="entryFee"
                      name="entryFee"
                      type="number"
                      min="0"
                      value={formData.entryFee}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="Укажите стоимость участия"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Укажите 0 для бесплатного участия</p>
                </div>
                
                {formData.competitionType === 'team' && (
                  <>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="maxTeams">
                        Максимальное количество команд *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUsers className="text-gray-400" />
                        </div>
                        <input
                          id="maxTeams"
                          name="maxTeams"
                          type="number"
                          min="1"
                          max="100"
                          value={formData.maxTeams}
                          onChange={handleChange}
                          className={`input pl-10 ${errors.maxTeams ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.maxTeams && <p className="text-red-500 text-xs mt-1">{errors.maxTeams}</p>}
                      <p className="text-gray-500 text-xs mt-1">Выбрано команд: {selectedTeams.length} из {formData.maxTeams}</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="maxTeamSize">
                        Максимальный размер команды *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUsers className="text-gray-400" />
                        </div>
                        <input
                          id="maxTeamSize"
                          name="maxTeamSize"
                          type="number"
                          min="1"
                          max="50"
                          value={formData.maxTeamSize}
                          onChange={handleChange}
                          className={`input pl-10 ${errors.maxTeamSize ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.maxTeamSize && <p className="text-red-500 text-xs mt-1">{errors.maxTeamSize}</p>}
                    </div>
                  </>
                )}
                
                {formData.competitionType === 'individual' && (
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="maxParticipants">
                      Максимальное количество участников *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUsers className="text-gray-400" />
                      </div>
                      <input
                        id="maxTeams"
                        name="maxTeams"
                        type="number"
                        min="1"
                        max="1000"
                        value={formData.maxTeams}
                        onChange={handleChange}
                        className={`input pl-10 ${errors.maxTeams ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.maxTeams && <p className="text-red-500 text-xs mt-1">{errors.maxTeams}</p>}
                    <p className="text-gray-500 text-xs mt-1">Лимит участников для индивидуального соревнования</p>
                  </div>
                )}
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                    Описание соревнования *
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
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
              </div>
              
              {/* Team selection section - only shown for team competitions */}
              {formData.competitionType === 'team' && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FaUsers className="mr-2 text-primary-500" /> Выбор команд-участников
                  </h3>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    {selectedTeams.length > 0 ? (
                      selectedTeams.map(teamId => {
                        const team = teams.find(t => t.id === teamId)
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
                      })
                    ) : (
                      <p className="text-gray-500 text-sm">Нет выбранных команд. Выберите команды из списка ниже.</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      className="input flex-grow"
                      onChange={handleTeamSelect}
                      value=""
                    >
                      <option value="">-- Выберите команду --</option>
                      {teams
                        .filter(team => !selectedTeams.includes(team.id))
                        .map(team => (
                          <option key={team.id} value={team.id}>
                            {team.name} ({team.memberCount || 0} участников)
                          </option>
                        ))
                      }
                    </select>
                    <button 
                      type="button"
                      onClick={() => document.getElementById('team-select')?.focus()}
                      className="btn-outline py-2 px-4 flex items-center"
                      disabled={selectedTeams.length >= formData.maxTeams}
                    >
                      <FaPlus className="mr-1" /> Добавить
                    </button>
                  </div>
                  {errors.maxTeams && (
                    <p className="text-yellow-600 text-sm mt-2 flex items-center">
                      <FaInfoCircle className="mr-1" /> {errors.maxTeams}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <Link
                  href="/competitions"
                  className="btn-outline py-2 px-4 flex items-center"
                >
                  Отмена
                </Link>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 flex items-center"
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
                    <>
                      <FaTrophy className="mr-2" /> Создать соревнование
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 