'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaTrophy, FaMapMarkerAlt, FaCalendarAlt, FaImage, FaInfoCircle, FaUsers, FaListUl, FaArrowLeft, FaTrash, FaPlus, FaUser, FaChess } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function CreateIndividualCompetitionPage() {
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
    maxParticipants: 32, // Максимальное число участников
    competitionType: 'individual', // Тип соревнования - индивидуальное
    sportType: 'chess', // Вид спорта - шахматы по умолчанию
  })
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    image: '',
    maxParticipants: ''
  })
  const [users, setUsers] = useState([])
  const [selectedParticipants, setSelectedParticipants] = useState([])

  useEffect(() => {
    // Перенаправление, если пользователь не авторизован
    if (!user) {
      router.push('/login?redirect=/competitions/create-individual')
      return
    }
    
    setIsLoaded(true)
    
    // Загрузка всех пользователей для выбора участников
    try {
      const storedUsers = localStorage.getItem('users')
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers)
        if (Array.isArray(parsedUsers)) {
          setUsers(parsedUsers)
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error)
    }
  }, [router, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value, 10) || 0 : value
    }))

    // Очистка ошибок при вводе
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleParticipantSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = parseInt(e.target.value, 10)
    if (userId && !selectedParticipants.includes(userId)) {
      if (selectedParticipants.length >= formData.maxParticipants) {
        setErrors(prev => ({
          ...prev,
          maxParticipants: `Достигнуто максимальное количество участников (${formData.maxParticipants})`
        }))
        return
      }
      setSelectedParticipants([...selectedParticipants, userId])
    }
  }

  const removeSelectedParticipant = (userId: number) => {
    setSelectedParticipants(selectedParticipants.filter(id => id !== userId))
    
    // Очистка ошибки о максимальном количестве участников, если мы теперь ниже лимита
    if (errors.maxParticipants && selectedParticipants.length <= formData.maxParticipants) {
      setErrors(prev => ({
        ...prev,
        maxParticipants: ''
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
      maxParticipants: ''
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
    
    if (formData.maxParticipants <= 0) {
      newErrors.maxParticipants = 'Количество участников должно быть больше 0'
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
        // Создание объекта соревнования
        const newCompetition = {
          id: Date.now(),
          title: formData.title,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          location: formData.location,
          image: formData.image || 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071',
          participantCount: selectedParticipants.length || 0,
          status: formData.status,
          participants: selectedParticipants,
          competitionType: formData.competitionType,
          sportType: formData.sportType,
          maxParticipants: formData.maxParticipants,
          createdBy: user?.id || 0,
          creatorName: user?.name || 'Аноним'
        }
        
        // Загрузка существующих соревнований из localStorage
        let competitions = []
        try {
          const storedCompetitions = localStorage.getItem('competitions')
          if (storedCompetitions) {
            competitions = JSON.parse(storedCompetitions)
          }
        } catch (error) {
          console.error('Ошибка при загрузке соревнований:', error)
        }
        
        // Добавление нового соревнования и сохранение в localStorage
        competitions.push(newCompetition)
        localStorage.setItem('competitions', JSON.stringify(competitions))
        
        // Обновление счетчика соревнований для пользователей
        if (selectedParticipants.length > 0) {
          const storedUsers = localStorage.getItem('users')
          if (storedUsers) {
            const users = JSON.parse(storedUsers)
            
            selectedParticipants.forEach(userId => {
              const userIndex = users.findIndex((u: any) => u.id === userId)
              if (userIndex !== -1) {
                // Увеличение счетчика соревнований
                users[userIndex] = {
                  ...users[userIndex],
                  competitionCount: (users[userIndex].competitionCount || 0) + 1
                }
              }
            })
            
            localStorage.setItem('users', JSON.stringify(users))
          }
        }
        
        setTimeout(() => {
          console.log('Создано индивидуальное соревнование:', newCompetition)
          setIsSubmitting(false)
          router.push('/competitions')
        }, 1500)
      } catch (error) {
        console.error('Ошибка при создании соревнования:', error)
        setIsSubmitting(false)
      }
    }
  }
  
  // Не рендерить, если пользователь не авторизован
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
            <h1 className="text-3xl font-bold mb-2">Создание индивидуального соревнования</h1>
            <p className="text-gray-600 mb-6">Создайте соревнование для индивидуальных участников, например шахматный турнир</p>
                         
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
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="sportType">
                    Вид спорта / соревнования *
                  </label>
                  <select
                    id="sportType"
                    name="sportType"
                    value={formData.sportType}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="chess">Шахматы</option>
                    <option value="checkers">Шашки</option>
                    <option value="tennis">Теннис</option>
                    <option value="badminton">Бадминтон</option>
                    <option value="swimming">Плавание</option>
                    <option value="running">Бег</option>
                    <option value="cycling">Велоспорт</option>
                    <option value="other">Другое</option>
                  </select>
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
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
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
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="maxParticipants">
                    Максимальное количество участников *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUsers className="text-gray-400" />
                    </div>
                    <input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      min="2"
                      max="128"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      className={`input pl-10 ${errors.maxParticipants ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.maxParticipants && <p className="text-red-500 text-xs mt-1">{errors.maxParticipants}</p>}
                  <p className="text-gray-500 text-xs mt-1">Выбрано участников: {selectedParticipants.length} из {formData.maxParticipants}</p>
                </div>

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

              {/* Секция выбора участников */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaUser className="mr-2 text-primary-500" /> Выбор участников
                </h3>

                <div className="flex flex-wrap gap-3 mb-4">
                  {selectedParticipants.length > 0 ? (
                    selectedParticipants.map(userId => {
                      const participant = users.find(u => u.id === userId)
                      return participant ? (
                        <div
                          key={userId}
                          className="bg-gray-100 rounded-full py-1 px-3 flex items-center text-sm"
                        >
                          <span className="mr-2">{participant.name}</span>
                          <button
                            type="button"
                            onClick={() => removeSelectedParticipant(userId)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      ) : null
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">Нет выбранных участников. Выберите участников из списка ниже.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <select
                    id="participant-select"
                    className="input flex-grow"
                    onChange={handleParticipantSelect}
                    value=""
                  >
                    <option value="">-- Выберите участника --</option>
                    {users
                      .filter(u => !selectedParticipants.includes(u.id))
                      .map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))
                    }
                  </select>
                  <button
                    type="button"
                    onClick={() => document.getElementById('participant-select')?.focus()}
                    className="btn-outline py-2 px-4 flex items-center"
                    disabled={selectedParticipants.length >= formData.maxParticipants}
                  >
                    <FaPlus className="mr-1" /> Добавить
                  </button>
                </div>
                {errors.maxParticipants && (
                  <p className="text-yellow-600 text-sm mt-2 flex items-center">
                    <FaInfoCircle className="mr-1" /> {errors.maxParticipants}
                  </p>
                )}
              </div>

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