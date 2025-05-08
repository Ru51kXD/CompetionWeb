'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaUsers, FaTrophy, FaSearch } from 'react-icons/fa'

// Mock data for teams
const mockTeams = [
  {
    id: 1,
    name: 'Команда Альфа',
    description: 'Сильнейшая команда по шахматам в городе',
    memberCount: 5,
    competitionCount: 12,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2069'
  },
  {
    id: 2,
    name: 'Футбольная команда "Молния"',
    description: 'Школьная футбольная команда',
    memberCount: 15,
    competitionCount: 8,
    image: 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?q=80&w=1974'
  },
  {
    id: 3,
    name: 'Интеллектуальный клуб "Эрудит"',
    description: 'Команда любителей интеллектуальных игр и головоломок',
    memberCount: 8,
    competitionCount: 15,
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070'
  },
  {
    id: 4,
    name: 'Танцевальный коллектив "Ритм"',
    description: 'Профессиональная команда современных танцев',
    memberCount: 12,
    competitionCount: 7,
    image: 'https://images.unsplash.com/photo-1526695814707-33de9e243329?q=80&w=2070'
  },
  {
    id: 5,
    name: 'Баскетбольный клуб "Победа"',
    description: 'Молодежная команда по баскетболу',
    memberCount: 10,
    competitionCount: 9,
    image: 'https://images.unsplash.com/photo-1519766304817-3450e0c49a58?q=80&w=2070'
  },
  {
    id: 6,
    name: 'Художественная студия "Палитра"',
    description: 'Коллектив молодых художников и дизайнеров',
    memberCount: 7,
    competitionCount: 5,
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080'
  },
  {
    id: 7,
    name: 'Спортивный клуб "Олимп"',
    description: 'Универсальный спортивный клуб для всех видов спорта',
    memberCount: 20,
    competitionCount: 14,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070'
  },
  {
    id: 8,
    name: 'Шахматный клуб "Гамбит"',
    description: 'Профессиональная шахматная команда',
    memberCount: 6,
    competitionCount: 11,
    image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2071'
  },
  {
    id: 9,
    name: 'Волейбольная команда "Высота"',
    description: 'Университетская волейбольная команда',
    memberCount: 14,
    competitionCount: 6,
    image: 'https://images.unsplash.com/photo-1574271143515-5cddf8da19be?q=80&w=2574'
  },
  {
    id: 10,
    name: 'Команда КВН "Смешарики"',
    description: 'Веселая и находчивая команда юмористов',
    memberCount: 8,
    competitionCount: 4,
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070'
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

export default function TeamsPage() {
  const [teams, setTeams] = useState(mockTeams)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
    
    // Загружаем команды из localStorage
    try {
      const storedTeams = localStorage.getItem('teams')
      if (storedTeams) {
        const parsedTeams = JSON.parse(storedTeams)
        if (Array.isArray(parsedTeams) && parsedTeams.length > 0) {
          // Объединяем сохраненные команды с мок-данными, исключая дубликаты по id
          const combinedTeams = [...parsedTeams];
          
          // Добавляем только те мок-команды, id которых еще нет в сохраненных командах
          const existingIds = new Set(parsedTeams.map(team => team.id));
          mockTeams.forEach(team => {
            if (!existingIds.has(team.id)) {
              combinedTeams.push(team);
            }
          });
          
          setTeams(combinedTeams);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке команд из localStorage:', error)
    }
  }, [])

  // Filter teams based on search query
  const filteredTeams = teams.filter(team => {
    return team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           team.description.toLowerCase().includes(searchQuery.toLowerCase());
  })

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Команды</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Найдите существующие команды или создайте свою собственную для участия в соревнованиях
            </p>
          </motion.div>
          
          {/* Search */}
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-4"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Поиск команд..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Create Team Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12 text-center"
          >
            <Link href="/teams/create" className="btn-primary px-8 py-3 mr-4">
              Создать новую команду
            </Link>
            <Link href="/competitions" className="btn-outline px-8 py-3">
              <FaTrophy className="inline-block mr-2" /> Смотреть соревнования
            </Link>
          </motion.div>
          
          {/* Teams Grid */}
          <AnimatePresence mode="wait">
            {filteredTeams.length > 0 ? (
              <motion.div
                key="teams"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredTeams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    variants={itemVariants}
                    exit="exit"
                    className="card card-hover h-full"
                  >
                    <div className="relative overflow-hidden h-52">
                      <Image
                        src={team.image}
                        alt={team.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white">{team.name}</h3>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">{team.description}</p>
                      
                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <FaUsers className="mr-2 text-primary-500" />
                          <span>{team.memberCount} участников</span>
                        </div>
                        <div className="flex items-center">
                          <FaTrophy className="mr-2 text-primary-500" />
                          <span>{team.competitionCount} соревнований</span>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/teams/${team.id}`}
                        className="block w-full btn-primary text-center mt-2"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <p className="text-2xl text-gray-500">Команды не найдены</p>
                <p className="text-gray-500 mt-2">Попробуйте изменить параметры поиска или создайте свою команду</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 