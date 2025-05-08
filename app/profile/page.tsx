'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaUser, FaEnvelope, FaLock, FaCheck, FaExclamationTriangle, FaEdit, FaSave, FaCalendarAlt, FaTrophy, FaBell, FaMapMarkerAlt, FaMoon, FaSun, FaPalette, FaWater } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [userTeams, setUserTeams] = useState([])
  const [upcomingCompetitions, setUpcomingCompetitions] = useState([])
  const [avatarUrl, setAvatarUrl] = useState('https://randomuser.me/api/portraits/men/22.jpg')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
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
    confirmPassword: '',
    general: ''
  })

  useEffect(() => {
    // Redirect to login if user is not logged in
    if (!user) {
      router.push('/login')
      return
    }

    // Initialize form data with user info
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      confirmPassword: ''
    })
    
    // Fetch user teams and upcoming competitions
    fetchUserTeamsAndCompetitions()
    
    // Generate avatar URL based on user ID for consistency
    if (user.id) {
      const gender = user.id % 2 === 0 ? 'men' : 'women'
      const avatarId = (user.id % 70) + 1
      setAvatarUrl(`https://randomuser.me/api/portraits/${gender}/${avatarId}.jpg`)
    }
    
    setIsLoaded(true)
  }, [user, router])

  const fetchUserTeamsAndCompetitions = () => {
    try {
      // In a real app, you would filter teams by user ID
      // Here we'll simulate by getting some teams from localStorage
      const storedTeams = localStorage.getItem('teams')
      if (storedTeams) {
        const allTeams = JSON.parse(storedTeams)
        
        // Simulate this user belonging to some teams (in a real app, this would use user.id)
        // For demo, we'll take the first 1-3 teams as "user's teams"
        const userTeams = allTeams.slice(0, Math.min(allTeams.length, Math.floor(Math.random() * 3) + 1))
        setUserTeams(userTeams)
        
        // Get competitions
        const storedCompetitions = localStorage.getItem('competitions')
        if (storedCompetitions) {
          const allCompetitions = JSON.parse(storedCompetitions)
          
          // Filter upcoming competitions for user's teams
          const userTeamIds = userTeams.map(team => team.id)
          const teamCompetitions = allCompetitions.filter(competition => 
            competition.status === 'upcoming' && 
            competition.teams && 
            competition.teams.some(teamId => userTeamIds.includes(teamId))
          )
          
          // Sort by start date
          teamCompetitions.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          
          setUpcomingCompetitions(teamCompetitions)
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке команд и соревнований:', error)
    }
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

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
      confirmPassword: '',
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

    // Validate password only if provided (since it's optional during update)
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Пароль должен содержать не менее 6 символов'
        isValid = false
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают'
        isValid = false
      }
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
      setIsSubmitting(true)
      
      try {
        // Get users from localStorage
        const storedUsers = localStorage.getItem('users')
        if (storedUsers && user) {
          const users = JSON.parse(storedUsers)
          const userIndex = users.findIndex((u: any) => u.id === user.id)
          
          if (userIndex !== -1) {
            // Check if email exists for another user
            const emailExists = users.some((u: any, index: number) => 
              index !== userIndex && u.email === formData.email
            )
            
            if (emailExists) {
              setErrors(prev => ({
                ...prev,
                email: 'Пользователь с таким email уже существует',
                general: 'Пользователь с таким email уже существует'
              }))
              setIsSubmitting(false)
              return
            }
            
            // Update user information
            const updatedUser = {
              ...users[userIndex],
              name: formData.name,
              email: formData.email
            }
            
            // Update password if provided
            if (formData.password) {
              updatedUser.password = formData.password
            }
            
            users[userIndex] = updatedUser
            localStorage.setItem('users', JSON.stringify(users))
            
            // Update user in localStorage (for current session)
            const { password, ...userWithoutPassword } = updatedUser
            localStorage.setItem('user', JSON.stringify(userWithoutPassword))
            
            // Force page reload to update user context
            setSuccessMessage('Профиль успешно обновлен!')
            setIsSubmitting(false)
            setIsEditing(false)
            
            // Clear success message after 3 seconds
            setTimeout(() => {
              setSuccessMessage('')
              window.location.reload()
            }, 3000)
          }
        }
      } catch (error) {
        console.error('Ошибка при обновлении профиля:', error)
        setErrors(prev => ({
          ...prev,
          general: 'Произошла ошибка при обновлении профиля'
        }))
        setIsSubmitting(false)
      }
    }
  }

  // Don't render anything if user is not logged in (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className={`min-h-screen flex flex-col ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Theme Switcher */}
          <div className="fixed bottom-6 right-6 z-50">
            <button 
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className="rounded-full p-3 shadow-lg text-white"
              style={{ backgroundColor: 'var(--color-primary-600)' }}
            >
              <FaPalette size={22} />
            </button>

            {showThemeSelector && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-16 right-0 card p-3 shadow-xl"
                style={{ width: '200px' }}
              >
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => { setTheme('light'); setShowThemeSelector(false); }}
                    className={`flex items-center p-2 rounded-md ${theme === 'light' ? 'bg-primary-100' : 'hover:bg-gray-100'}`}
                  >
                    <FaSun className="text-yellow-500 mr-3" /> Светлая тема
                  </button>
                  <button 
                    onClick={() => { setTheme('dark'); setShowThemeSelector(false); }}
                    className={`flex items-center p-2 rounded-md ${theme === 'dark' ? 'bg-primary-100' : 'hover:bg-gray-100'}`}
                  >
                    <FaMoon className="text-indigo-500 mr-3" /> Тёмная тема
                  </button>
                  <button 
                    onClick={() => { setTheme('blue'); setShowThemeSelector(false); }}
                    className={`flex items-center p-2 rounded-md ${theme === 'blue' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  >
                    <FaWater className="text-blue-500 mr-3" /> Синяя тема
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sidebar with Avatar and Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1"
              >
                <div className="card p-6 mb-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative h-32 w-32 mb-4">
                      <Image
                        src={avatarUrl}
                        alt={user.name}
                        fill
                        className="rounded-full object-cover border-4"
                        style={{ borderColor: 'var(--color-primary-200)' }}
                      />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                    <p className="text-sm mb-3" style={{ color: 'var(--color-text-accent)' }}>{user.email}</p>
                    
                    <div className="py-2 px-4 rounded-full text-sm font-medium mt-1"
                      style={{ 
                        backgroundColor: user.role === 'admin' ? 'var(--color-primary-100)' : 'var(--color-bg-accent)',
                        color: user.role === 'admin' ? 'var(--color-primary-800)' : 'var(--color-text-secondary)'
                      }}
                    >
                      {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <h3 className="font-semibold mb-3">Команды</h3>
                    {userTeams.length > 0 ? (
                      <div className="space-y-2">
                        {userTeams.map(team => (
                          <Link 
                            href={`/teams/${team.id}`} 
                            key={team.id}
                            className="flex items-center p-2 rounded-md card-hover"
                            style={{ backgroundColor: 'var(--color-bg-accent)' }}
                          >
                            <div className="h-8 w-8 rounded-full overflow-hidden relative mr-3">
                              <Image
                                src={team.image || 'https://via.placeholder.com/40'}
                                alt={team.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium">{team.name}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Вы не состоите в командах
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Notifications section */}
                {upcomingCompetitions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="card p-6 mb-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold flex items-center">
                        <FaBell className="mr-3" style={{ color: 'var(--color-primary-500)' }} /> Уведомления команды
                      </h2>
                    </div>
                    
                    <div className="space-y-4">
                      {upcomingCompetitions.map(competition => {
                        // Find the user team that's participating
                        const participatingTeams = userTeams.filter(team => 
                          competition.teams && competition.teams.includes(team.id)
                        )
                        
                        return (
                          <div 
                            key={competition.id} 
                            className="border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                            style={{ borderColor: 'var(--color-border)' }}
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="text-lg font-medium">{competition.title}</h3>
                                <div className="mt-2 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <FaCalendarAlt className="mr-1" style={{ color: 'var(--color-primary-500)' }} />
                                    {formatDate(competition.startDate)}
                                  </div>
                                  <div className="flex items-center">
                                    <FaMapMarkerAlt className="mr-1" style={{ color: 'var(--color-primary-500)' }} />
                                    {competition.location}
                                  </div>
                                  <div className="flex items-center">
                                    <FaTrophy className="mr-1" style={{ color: 'var(--color-primary-500)' }} />
                                    {competition.type === 'SPORTS' ? 'Спортивное' : 
                                    competition.type === 'INTELLECTUAL' ? 'Интеллектуальное' : 'Творческое'}
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <span className="text-sm font-medium" style={{ color: 'var(--color-primary-600)' }}>
                                    Участвует: {participatingTeams.map(team => team.name).join(', ')}
                                  </span>
                                </div>
                              </div>
                              
                              <Link 
                                href={`/competitions/${competition.id}`} 
                                className="mt-3 md:mt-0 inline-flex items-center px-3 py-2 border rounded-md text-sm leading-4 font-medium transition-colors"
                                style={{ 
                                  borderColor: 'var(--color-primary-300)',
                                  color: 'var(--color-primary-700)',
                                  backgroundColor: 'var(--color-bg-primary)'
                                }}
                              >
                                Подробнее
                              </Link>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="card p-8"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Личная информация</h2>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="btn-outline-primary flex items-center"
                      >
                        <FaEdit className="mr-2" /> Редактировать
                      </button>
                    )}
                  </div>
                  
                  {successMessage && (
                    <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
                      <FaCheck className="mr-2" />
                      {successMessage}
                    </div>
                  )}
                  
                  {errors.general && (
                    <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                      <FaExclamationTriangle className="mr-2" />
                      {errors.general}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2" htmlFor="name">
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
                          disabled={!isEditing}
                          className={`input pl-10 ${errors.name ? 'border-red-500' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <FaExclamationTriangle className="mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2" htmlFor="email">
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
                          disabled={!isEditing}
                          className={`input pl-10 ${errors.email ? 'border-red-500' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <FaExclamationTriangle className="mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                    
                    {isEditing && (
                      <>
                        <div className="mb-6">
                          <label className="block text-sm font-medium mb-2" htmlFor="password">
                            Новый пароль (оставьте пустым, чтобы не менять)
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
                              placeholder="Новый пароль"
                            />
                          </div>
                          {errors.password && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <FaExclamationTriangle className="mr-1" />
                              {errors.password}
                            </p>
                          )}
                        </div>
                        
                        <div className="mb-6">
                          <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">
                            Подтверждение нового пароля
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
                              placeholder="Подтвердите новый пароль"
                            />
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <FaExclamationTriangle className="mr-1" />
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-8">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false)
                              // Reset form to original values
                              setFormData({
                                name: user.name || '',
                                email: user.email || '',
                                password: '',
                                confirmPassword: ''
                              })
                              // Clear errors
                              setErrors({
                                name: '',
                                email: '',
                                password: '',
                                confirmPassword: '',
                                general: ''
                              })
                            }}
                            className="btn-outline py-2 px-4"
                          >
                            Отмена
                          </button>
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
                      </>
                    )}
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 