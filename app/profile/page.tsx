'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaUser, FaEnvelope, FaLock, FaCheck, FaExclamationTriangle, FaEdit, FaSave, FaCalendarAlt, FaTrophy, FaBell, FaMapMarkerAlt, FaMoon, FaSun, FaPalette, FaWater, FaCreditCard, FaPlus, FaTrash, FaStar } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { PaymentCard } from '../context/AuthContext'
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
  const [unpaidCompetitions, setUnpaidCompetitions] = useState([])
  const [avatarUrl, setAvatarUrl] = useState('https://randomuser.me/api/portraits/men/22.jpg')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
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
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([])

  // Payment card management
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [newCardData, setNewCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
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
    
    // Load saved payment cards
    if (user.paymentCards) {
      setPaymentCards(user.paymentCards)
    }
    
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
          
          // Get unpaid competitions (competitions with entry fee where the team hasn't paid)
          const unpaidCompetitions = teamCompetitions.filter(competition => 
            competition.entryFee && 
            competition.entryFee > 0 && 
            competition.teams.some(teamId => {
              // Check if team is part of user's teams and hasn't paid
              return userTeamIds.includes(teamId) && 
                (!competition.paidTeams || !competition.paidTeams.includes(teamId))
            })
          )
          
          // Sort by start date
          teamCompetitions.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          
          setUpcomingCompetitions(teamCompetitions)
          setUnpaidCompetitions(unpaidCompetitions)
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

  // Add payment processing function
  const handlePayment = (competition, team) => {
    setSelectedCompetition(competition)
    setSelectedTeam(team)
    setShowPaymentModal(true)
  }
  
  const processPayment = () => {
    if (!selectedCompetition || !selectedTeam) return
    
    try {
      // Update competition with paid team
      const storedCompetitions = localStorage.getItem('competitions')
      if (storedCompetitions) {
        const allCompetitions = JSON.parse(storedCompetitions)
        const competitionIndex = allCompetitions.findIndex(c => c.id === selectedCompetition.id)
        
        if (competitionIndex !== -1) {
          // Initialize paidTeams array if it doesn't exist
          if (!allCompetitions[competitionIndex].paidTeams) {
            allCompetitions[competitionIndex].paidTeams = []
          }
          
          // Add team to paid teams
          allCompetitions[competitionIndex].paidTeams.push(selectedTeam.id)
          localStorage.setItem('competitions', JSON.stringify(allCompetitions))
          
          // Update local state
          setUnpaidCompetitions(unpaidCompetitions.filter(c => c.id !== selectedCompetition.id))
          setSuccessMessage('Оплата успешно произведена!')
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('')
          }, 3000)
        }
      }
    } catch (error) {
      console.error('Ошибка при обработке оплаты:', error)
      setErrors(prev => ({
        ...prev,
        general: 'Произошла ошибка при обработке оплаты'
      }))
    } finally {
      setShowPaymentModal(false)
      setSelectedCompetition(null)
      setSelectedTeam(null)
    }
  }

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value;

    // Format card number with spaces after every 4 digits
    if (name === 'cardNumber') {
      // Remove any non-digit characters
      const digits = value.replace(/\D/g, '');
      // Format with spaces
      if (digits.length > 0) {
        const groups = digits.match(/.{1,4}/g);
        formattedValue = groups ? groups.join(' ') : digits;
      } else {
        formattedValue = '';
      }
    }

    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      // Remove any non-digit characters
      const digits = value.replace(/\D/g, '');
      
      if (digits.length > 0) {
        if (digits.length <= 2) {
          formattedValue = digits;
        } else {
          formattedValue = `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
        }
      } else {
        formattedValue = '';
      }
    }

    // Only allow numbers for CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
    }
    
    setNewCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }))
    
    // Clear errors when typing
    if (cardErrors[name as keyof typeof cardErrors]) {
      setCardErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateCardForm = () => {
    let isValid = true
    const newErrors = {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      general: ''
    }

    // Validate card number (16 digits, can have spaces)
    const cardNumberClean = newCardData.cardNumber.replace(/\s/g, '')
    if (!cardNumberClean) {
      newErrors.cardNumber = 'Номер карты обязателен'
      isValid = false
    } else if (cardNumberClean.length !== 16 || !/^\d+$/.test(cardNumberClean)) {
      newErrors.cardNumber = 'Введите корректный номер карты (16 цифр)'
      isValid = false
    }

    // Validate expiry date (MM/YY format)
    if (!newCardData.expiryDate) {
      newErrors.expiryDate = 'Срок действия обязателен'
      isValid = false
    } else if (!/^\d{2}\/\d{2}$/.test(newCardData.expiryDate)) {
      newErrors.expiryDate = 'Введите дату в формате ММ/ГГ'
      isValid = false
    } else {
      // Check if date is valid (not expired)
      const [month, year] = newCardData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
      const currentMonth = currentDate.getMonth() + 1; // 1-12
      
      const expiryMonth = parseInt(month, 10);
      const expiryYear = parseInt(year, 10);
      
      if (expiryMonth < 1 || expiryMonth > 12) {
        newErrors.expiryDate = 'Неверный месяц (1-12)';
        isValid = false;
      } else if (
        (expiryYear < currentYear) || 
        (expiryYear === currentYear && expiryMonth < currentMonth)
      ) {
        newErrors.expiryDate = 'Срок действия карты истек';
        isValid = false;
      }
    }

    // Validate CVV (3 digits)
    if (!newCardData.cvv) {
      newErrors.cvv = 'CVV обязателен'
      isValid = false
    } else if (newCardData.cvv.length !== 3 || !/^\d{3}$/.test(newCardData.cvv)) {
      newErrors.cvv = 'CVV должен содержать 3 цифры'
      isValid = false
    }

    // Validate cardholder name
    if (!newCardData.cardholderName.trim()) {
      newErrors.cardholderName = 'Имя владельца карты обязательно'
      isValid = false
    }

    setCardErrors(newErrors)
    return isValid
  }

  const addPaymentCard = () => {
    if (!validateCardForm()) return
    
    try {
      const newCard: PaymentCard = {
        id: Date.now(),
        cardNumber: formatCardNumber(newCardData.cardNumber),
        expiryDate: newCardData.expiryDate,
        cardholderName: newCardData.cardholderName,
        isDefault: paymentCards.length === 0 // Make default if it's the first card
      }
      
      const updatedCards = [...paymentCards, newCard]
      setPaymentCards(updatedCards)
      
      // Update user in localStorage
      if (user) {
        const updatedUser = {
          ...user,
          paymentCards: updatedCards
        }
        
        // Update users array in localStorage
        const storedUsers = localStorage.getItem('users')
        if (storedUsers) {
          const users = JSON.parse(storedUsers)
          const userIndex = users.findIndex((u: any) => u.id === user.id)
          
          if (userIndex !== -1) {
            users[userIndex] = {
              ...users[userIndex],
              paymentCards: updatedCards
            }
            localStorage.setItem('users', JSON.stringify(users))
          }
        }
        
        // Update current user in localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      setSuccessMessage('Карта успешно добавлена!')
      setTimeout(() => setSuccessMessage(''), 3000)
      setShowAddCardModal(false)
      
      // Reset form
      setNewCardData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
      })
    } catch (error) {
      console.error('Ошибка при добавлении карты:', error)
      setCardErrors(prev => ({
        ...prev,
        general: 'Произошла ошибка при добавлении карты'
      }))
    }
  }

  const removePaymentCard = (cardId: number) => {
    try {
      const updatedCards = paymentCards.filter(card => card.id !== cardId)
      
      // If we're removing the default card, make the first remaining card default
      if (paymentCards.find(card => card.id === cardId)?.isDefault && updatedCards.length > 0) {
        updatedCards[0].isDefault = true
      }
      
      setPaymentCards(updatedCards)
      
      // Update user in localStorage
      if (user) {
        const updatedUser = {
          ...user,
          paymentCards: updatedCards
        }
        
        // Update users array in localStorage
        const storedUsers = localStorage.getItem('users')
        if (storedUsers) {
          const users = JSON.parse(storedUsers)
          const userIndex = users.findIndex((u: any) => u.id === user.id)
          
          if (userIndex !== -1) {
            users[userIndex] = {
              ...users[userIndex],
              paymentCards: updatedCards
            }
            localStorage.setItem('users', JSON.stringify(users))
          }
        }
        
        // Update current user in localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      setSuccessMessage('Карта успешно удалена')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Ошибка при удалении карты:', error)
      setErrors(prev => ({
        ...prev,
        general: 'Произошла ошибка при удалении карты'
      }))
    }
  }

  const setDefaultCard = (cardId: number) => {
    try {
      const updatedCards = paymentCards.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
      
      setPaymentCards(updatedCards)
      
      // Update user in localStorage
      if (user) {
        const updatedUser = {
          ...user,
          paymentCards: updatedCards
        }
        
        // Update users array in localStorage
        const storedUsers = localStorage.getItem('users')
        if (storedUsers) {
          const users = JSON.parse(storedUsers)
          const userIndex = users.findIndex((u: any) => u.id === user.id)
          
          if (userIndex !== -1) {
            users[userIndex] = {
              ...users[userIndex],
              paymentCards: updatedCards
            }
            localStorage.setItem('users', JSON.stringify(users))
          }
        }
        
        // Update current user in localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      setSuccessMessage('Карта по умолчанию изменена')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Ошибка при установке карты по умолчанию:', error)
      setErrors(prev => ({
        ...prev,
        general: 'Произошла ошибка при установке карты по умолчанию'
      }))
    }
  }

  // Format card number with spaces for display (1234 5678 9012 3456)
  const formatCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s+/g, '')
    const groups = cleaned.match(/.{1,4}/g)
    return groups ? groups.join(' ') : cleaned
  }

  // Mask card number for display (only last 4 digits visible)
  const maskCardNumber = (cardNumber: string) => {
    const parts = cardNumber.split(' ')
    if (parts.length === 4) {
      return `•••• •••• •••• ${parts[3]}`
    }
    return cardNumber
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
                
                {/* Payment Section - Display after the teams section */}
                {unpaidCompetitions.length > 0 && (
                  <section className="mb-8">
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6">
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <FaBell className="mr-2 text-yellow-500" /> Необходимо оплатить участие
                      </h2>
                      
                      <div className="space-y-4">
                        {unpaidCompetitions.map(competition => {
                          // Find user's teams that are participating in this competition
                          const teamsInCompetition = userTeams.filter(team => 
                            competition.teams && competition.teams.includes(team.id)
                          )
                          
                          return teamsInCompetition.map(team => (
                            <div 
                              key={`${competition.id}-${team.id}`} 
                              className="bg-white rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between"
                            >
                              <div>
                                <h3 className="font-medium text-gray-800">{competition.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  Команда: <span className="font-medium">{team.name}</span>
                                </p>
                                <div className="flex items-center text-sm text-gray-500">
                                  <FaCalendarAlt className="mr-1" />
                                  <span>{formatDate(competition.startDate)}</span>
                                </div>
                              </div>
                              
                              <div className="mt-3 md:mt-0 flex items-center">
                                <div className="mr-4 text-yellow-600 font-semibold">
                                  {competition.entryFee?.toLocaleString()} ₸
                                </div>
                                <button 
                                  className="btn-primary py-1.5 px-4 text-sm"
                                  onClick={() => handlePayment(competition, team)}
                                >
                                  Оплатить
                                </button>
                              </div>
                            </div>
                          ))
                        })}
                      </div>
                    </div>
                  </section>
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
            
            {/* Payment Cards Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-6xl mx-auto mt-8"
            >
              <div className="card p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <FaCreditCard className="mr-3" style={{ color: 'var(--color-primary-500)' }} /> Платежные карты
                  </h2>
                  <button 
                    onClick={() => setShowAddCardModal(true)}
                    className="btn-outline-primary flex items-center"
                  >
                    <FaPlus className="mr-2" /> Добавить карту
                  </button>
                </div>
                
                {paymentCards.length > 0 ? (
                  <div className="space-y-4">
                    {paymentCards.map(card => (
                      <div 
                        key={card.id} 
                        className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-md transition-all duration-300"
                        style={{ borderColor: card.isDefault ? 'var(--color-primary-300)' : 'var(--color-border)', 
                                 backgroundColor: card.isDefault ? 'var(--color-primary-50)' : 'transparent' }}
                      >
                        <div className="flex items-center">
                          <FaCreditCard className="text-lg mr-3" style={{ color: 'var(--color-primary-500)' }} />
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{maskCardNumber(card.cardNumber)}</p>
                              {card.isDefault && (
                                <span className="ml-2 text-xs bg-primary-100 text-primary-700 py-0.5 px-2 rounded-full flex items-center">
                                  <FaStar className="mr-1" size={10} /> По умолчанию
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{card.cardholderName}</p>
                            <p className="text-sm text-gray-600">Действует до: {card.expiryDate}</p>
                          </div>
                        </div>
                        <div className="mt-3 md:mt-0 flex items-center">
                          {!card.isDefault && (
                            <button 
                              onClick={() => setDefaultCard(card.id)} 
                              className="text-sm text-primary-600 hover:text-primary-800 mr-4"
                            >
                              Сделать основной
                            </button>
                          )}
                          <button 
                            onClick={() => removePaymentCard(card.id)} 
                            className="text-sm text-red-600 hover:text-red-800 flex items-center"
                          >
                            <FaTrash className="mr-1" size={12} /> Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FaCreditCard className="mx-auto text-3xl mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-4">У вас нет сохраненных платежных карт</p>
                    <button 
                      onClick={() => setShowAddCardModal(true)}
                      className="btn-primary inline-flex items-center"
                    >
                      <FaPlus className="mr-2" /> Добавить карту
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      {/* Payment Modal */}
      {showPaymentModal && selectedCompetition && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Оплата участия</h3>
            <p className="mb-4">
              Оплата участия команды <strong>{selectedTeam.name}</strong> в соревновании <strong>{selectedCompetition.title}</strong>:
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <p className="font-bold text-center text-xl text-yellow-700">
                {selectedCompetition.entryFee?.toLocaleString()} ₸
              </p>
            </div>
            
            {/* Show saved cards if available */}
            {paymentCards.length > 0 ? (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Выберите сохраненную карту:</h4>
                <div className="space-y-3">
                  {paymentCards.map(card => (
                    <div key={card.id} className="border rounded-md p-3 flex cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="savedCard" 
                        id={`card-${card.id}`} 
                        defaultChecked={card.isDefault}
                        className="mr-3"
                      />
                      <label htmlFor={`card-${card.id}`} className="flex-grow cursor-pointer">
                        <div className="flex items-center">
                          <FaCreditCard className="mr-2 text-primary-500" />
                          <span className="font-medium">{maskCardNumber(card.cardNumber)}</span>
                          {card.isDefault && (
                            <span className="ml-2 text-xs bg-primary-100 text-primary-700 py-0.5 px-1 rounded-full">
                              По умолчанию
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {card.cardholderName} • Истекает: {card.expiryDate}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Номер карты
                  </label>
                  <input 
                    type="text" 
                    className="input"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Срок действия
                    </label>
                    <input 
                      type="text" 
                      className="input"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      CVV
                    </label>
                    <input 
                      type="text" 
                      className="input"
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                className="btn-outline py-2 px-4"
                onClick={() => {
                  setShowPaymentModal(false)
                  setSelectedCompetition(null)
                  setSelectedTeam(null)
                }}
              >
                Отмена
              </button>
              <button
                className="btn-primary py-2 px-4"
                onClick={processPayment}
              >
                Оплатить
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Payment Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Добавление платежной карты</h3>
            
            {cardErrors.general && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                <FaExclamationTriangle className="mr-2" />
                {cardErrors.general}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Номер карты <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="cardNumber"
                value={newCardData.cardNumber}
                onChange={handleCardInputChange}
                className={`input ${cardErrors.cardNumber ? 'border-red-500' : ''}`}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
              />
              {cardErrors.cardNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {cardErrors.cardNumber}
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Имя владельца карты <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="cardholderName"
                value={newCardData.cardholderName}
                onChange={handleCardInputChange}
                className={`input ${cardErrors.cardholderName ? 'border-red-500' : ''}`}
                placeholder="IVAN IVANOV"
              />
              {cardErrors.cardholderName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {cardErrors.cardholderName}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Срок действия <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="expiryDate"
                  value={newCardData.expiryDate}
                  onChange={handleCardInputChange}
                  className={`input ${cardErrors.expiryDate ? 'border-red-500' : ''}`}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {cardErrors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" />
                    {cardErrors.expiryDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  CVV <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="cvv"
                  value={newCardData.cvv}
                  onChange={handleCardInputChange}
                  className={`input ${cardErrors.cvv ? 'border-red-500' : ''}`}
                  placeholder="123"
                  maxLength={3}
                />
                {cardErrors.cvv && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" />
                    {cardErrors.cvv}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                className="btn-outline py-2 px-4"
                onClick={() => {
                  setShowAddCardModal(false)
                  setNewCardData({
                    cardNumber: '',
                    expiryDate: '',
                    cvv: '',
                    cardholderName: ''
                  })
                  setCardErrors({
                    cardNumber: '',
                    expiryDate: '',
                    cvv: '',
                    cardholderName: '',
                    general: ''
                  })
                }}
              >
                Отмена
              </button>
              <button
                className="btn-primary py-2 px-4"
                onClick={addPaymentCard}
              >
                Добавить карту
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* --- User Statistics & Achievements --- */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Statistics */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4 flex items-center"><FaTrophy className="mr-2 text-yellow-500" />Статистика</h3>
          <div className="w-full space-y-3">
            <div className="flex justify-between items-center">
              <span>Побед:</span>
              <span className="font-bold text-green-600">{user?.stats?.wins ?? 5}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Поражений:</span>
              <span className="font-bold text-red-500">{user?.stats?.losses ?? 2}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Участий:</span>
              <span className="font-bold text-blue-600">{user?.stats?.participations ?? 9}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Процент побед:</span>
              <span className="font-bold text-purple-600">{user?.stats ? Math.round((user.stats.wins/(user.stats.participations||1))*100) : 56}%</span>
            </div>
          </div>
        </div>
        {/* Participation History */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center"><FaCalendarAlt className="mr-2 text-primary-500" />История участия</h3>
          <ul className="divide-y divide-gray-100">
            {(user?.history ?? [
              { title: 'Открытый турнир по шахматам', date: '2024-03-10', result: 'Победа', status: 'completed' },
              { title: 'Весенний марафон', date: '2024-04-01', result: 'Участие', status: 'active' },
              { title: 'Летний кубок', date: '2024-05-20', result: 'Поражение', status: 'completed' },
            ]).map((item, idx) => (
              <li key={idx} className="flex justify-between items-center py-2">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.result === 'Победа' ? 'bg-green-100 text-green-700' : item.result === 'Поражение' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{item.result}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${item.status === 'completed' ? 'bg-gray-200' : 'bg-yellow-100 text-yellow-700'}`}>{item.status === 'completed' ? 'Завершено' : 'В процессе'}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4 flex items-center"><FaStar className="mr-2 text-yellow-400" />Достижения</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Mock achievements */}
            <div className="flex flex-col items-center">
              <span className="text-3xl">🏆</span>
              <span className="text-xs mt-1">Победитель турнира</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl">🥈</span>
              <span className="text-xs mt-1">Серебряный призёр</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl">🔥</span>
              <span className="text-xs mt-1">Серия из 3 побед</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl">🎯</span>
              <span className="text-xs mt-1">100% посещаемость</span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 