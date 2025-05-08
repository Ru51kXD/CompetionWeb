'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaUsers, FaTrophy, FaSearch, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'

// Mock data for competitions
const mockCompetitions = [
  {
    id: 1,
    title: 'Городской турнир по шахматам',
    description: 'Ежегодный шахматный турнир для команд всех уровней',
    startDate: '2023-06-15',
    endDate: '2023-06-18',
    location: 'Городской Дворец Спорта',
    participantCount: 8,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?q=80&w=2070',
    teams: [1, 2, 3, 4, 5, 6, 7, 8] // Команды, участвующие в соревновании
  },
  {
    id: 2,
    title: 'Межшкольный футбольный чемпионат',
    description: 'Соревнования между школами города по футболу',
    startDate: '2023-05-10',
    endDate: '2023-05-30',
    location: 'Стадион "Юность"',
    participantCount: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2023',
    teams: [1, 3, 5, 6]
  },
  {
    id: 3,
    title: 'Интеллектуальная олимпиада "Эрудит"',
    description: 'Командные соревнования на знание различных наук и искусств',
    startDate: '2023-07-05',
    endDate: '2023-07-07',
    location: 'Центральная библиотека',
    participantCount: 15,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2070',
    teams: [2, 4, 5]
  },
  {
    id: 4,
    title: 'Городской турнир по плаванию',
    description: 'Соревнования по плаванию среди молодежных команд',
    startDate: '2023-04-12',
    endDate: '2023-04-14',
    location: 'Бассейн "Дельфин"',
    participantCount: 10,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?q=80&w=2012',
    teams: [1, 2, 3, 4, 5, 6],
    results: [
      { teamId: 2, points: 98, position: 1 },
      { teamId: 5, points: 87, position: 2 },
      { teamId: 1, points: 82, position: 3 },
      { teamId: 6, points: 75, position: 4 },
      { teamId: 3, points: 70, position: 5 },
      { teamId: 4, points: 65, position: 6 }
    ]
  },
  {
    id: 5,
    title: 'Чемпионат по боулингу',
    description: 'Ежегодный чемпионат по боулингу среди любительских команд',
    startDate: '2023-03-05',
    endDate: '2023-03-07',
    location: 'Боулинг-центр "Страйк"',
    participantCount: 8,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?q=80&w=2070',
    teams: [1, 3, 5, 6, 2, 4],
    results: [
      { teamId: 3, points: 256, position: 1 },
      { teamId: 1, points: 240, position: 2 },
      { teamId: 2, points: 225, position: 3 },
      { teamId: 6, points: 210, position: 4 },
      { teamId: 5, points: 195, position: 5 },
      { teamId: 4, points: 180, position: 6 }
    ]
  },
  {
    id: 6,
    title: 'Турнир по мини-футболу',
    description: 'Открытый турнир по мини-футболу среди студенческих команд',
    startDate: '2023-02-10',
    endDate: '2023-02-12',
    location: 'Спортивный комплекс "Энергия"',
    participantCount: 12,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2070',
    teams: [1, 2, 3, 4, 5, 6],
    results: [
      { teamId: 1, points: 15, position: 1 },
      { teamId: 6, points: 12, position: 2 },
      { teamId: 4, points: 9, position: 3 },
      { teamId: 3, points: 6, position: 4 },
      { teamId: 5, points: 3, position: 5 },
      { teamId: 2, points: 0, position: 6 }
    ]
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 }
  }
}

// Format date function
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
    
    // Load competitions from localStorage
    try {
      const storedCompetitions = localStorage.getItem('competitions')
      if (storedCompetitions) {
        const parsedCompetitions = JSON.parse(storedCompetitions)
        if (Array.isArray(parsedCompetitions) && parsedCompetitions.length > 0) {
          // Combine stored competitions with mock data, avoiding duplicates by id
          const combinedCompetitions = [...parsedCompetitions]
          
          const existingIds = new Set(parsedCompetitions.map(comp => comp.id))
          mockCompetitions.forEach(comp => {
            if (!existingIds.has(comp.id)) {
              combinedCompetitions.push(comp)
            }
          })
          
          setCompetitions(combinedCompetitions)
        } else {
          setCompetitions(mockCompetitions)
        }
      } else {
        setCompetitions(mockCompetitions)
        localStorage.setItem('competitions', JSON.stringify(mockCompetitions))
      }
    } catch (error) {
      console.error('Ошибка при загрузке соревнований:', error)
      setCompetitions(mockCompetitions)
    }
  }, [])

  // Filter competitions based on search query and status
  const filteredCompetitions = competitions.filter(competition => {
    const matchesSearch = 
      competition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competition.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competition.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || 
      competition.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch(status) {
      case 'upcoming':
        return { 
          label: 'Предстоит', 
          classes: 'bg-blue-100 text-blue-700' 
        }
      case 'active':
        return { 
          label: 'Активно', 
          classes: 'bg-green-100 text-green-700' 
        }
      case 'completed':
        return { 
          label: 'Завершено', 
          classes: 'bg-gray-100 text-gray-700' 
        }
      default:
        return { 
          label: 'Неизвестно', 
          classes: 'bg-gray-100 text-gray-700' 
        }
    }
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Соревнования</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Найдите и примите участие в соревнованиях или создайте своё собственное
            </p>
          </motion.div>
          
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-4"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Поиск соревнований..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input pl-10 w-full"
                    />
                  </div>
                  
                  <div className="flex-shrink-0">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="input"
                    >
                      <option value="all">Все соревнования</option>
                      <option value="upcoming">Предстоящие</option>
                      <option value="active">Активные</option>
                      <option value="completed">Завершенные</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Create Competition Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12 text-center"
          >
            <Link href="/competitions/create" className="btn-primary px-8 py-3">
              Создать новое соревнование
            </Link>
          </motion.div>
          
          {/* Competitions Grid */}
          <AnimatePresence mode="wait">
            {filteredCompetitions.length > 0 ? (
              <motion.div
                key="competitions"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredCompetitions.map((competition) => {
                  const statusBadge = getStatusBadge(competition.status)
                  
                  return (
                    <motion.div
                      key={competition.id}
                      variants={itemVariants}
                      exit="exit"
                      className="card card-hover h-full flex flex-col"
                    >
                      <div className="relative overflow-hidden h-52">
                        <Image
                          src={competition.image}
                          alt={competition.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.classes}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-xl font-bold text-white">{competition.title}</h3>
                        </div>
                      </div>
                      
                      <div className="p-6 flex-grow flex flex-col">
                        <p className="text-gray-600 mb-4 flex-grow">{competition.description}</p>
                        
                        <div className="text-sm text-gray-500 space-y-2 mb-4">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-primary-500" />
                            <span>{formatDate(competition.startDate)} - {formatDate(competition.endDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-primary-500" />
                            <span>{competition.location}</span>
                          </div>
                          <div className="flex items-center">
                            <FaUsers className="mr-2 text-primary-500" />
                            <span>{competition.participantCount} команд</span>
                          </div>
                        </div>
                        
                        <Link 
                          href={`/competitions/${competition.id}`}
                          className="block w-full btn-primary text-center mt-2"
                        >
                          Подробнее
                        </Link>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <p className="text-2xl text-gray-500">Соревнования не найдены</p>
                <p className="text-gray-500 mt-2">Попробуйте изменить параметры поиска или создайте своё соревнование</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 