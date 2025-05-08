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
  { id: 1, name: 'Команда Альфа', description: 'Сильнейшая команда по шахматам в городе', memberCount: 5, competitionCount: 12, type: 'Интеллектуальные', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2069' },
  { id: 2, name: 'Футбольная команда "Молния"', description: 'Школьная футбольная команда', memberCount: 15, competitionCount: 8, type: 'Спортивные', image: 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?q=80&w=1974' },
  { id: 3, name: 'Интеллектуальный клуб "Эрудит"', description: 'Команда любителей интеллектуальных игр и головоломок', memberCount: 8, competitionCount: 15, type: 'Интеллектуальные', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070' },
  { id: 4, name: 'Танцевальный коллектив "Ритм"', description: 'Профессиональная команда современных танцев', memberCount: 12, competitionCount: 7, type: 'Творческие', image: 'https://images.unsplash.com/photo-1526695814707-33de9e243329?q=80&w=2070' },
  { id: 5, name: 'Баскетбольный клуб "Победа"', description: 'Молодежная команда по баскетболу', memberCount: 10, competitionCount: 9, type: 'Спортивные', image: 'https://images.unsplash.com/photo-1519766304817-3450e0c49a58?q=80&w=2070' },
  { id: 6, name: 'Художественная студия "Палитра"', description: 'Коллектив молодых художников и дизайнеров', memberCount: 7, competitionCount: 5, type: 'Творческие', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080' },
  { id: 7, name: 'Спортивный клуб "Олимп"', description: 'Универсальный спортивный клуб для всех видов спорта', memberCount: 20, competitionCount: 14, type: 'Спортивные', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070' },
  { id: 8, name: 'Шахматный клуб "Гамбит"', description: 'Профессиональная шахматная команда', memberCount: 6, competitionCount: 11, type: 'Интеллектуальные', image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2071' },
  { id: 9, name: 'Волейбольная команда "Высота"', description: 'Университетская волейбольная команда', memberCount: 14, competitionCount: 6, type: 'Спортивные', image: 'https://images.unsplash.com/photo-1574271143515-5cddf8da19be?q=80&w=2574' },
  { id: 10, name: 'Команда КВН "Смешарики"', description: 'Веселая и находчивая команда юмористов', memberCount: 8, competitionCount: 4, type: 'Творческие', image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070' },
  { id: 11, name: 'Театр "Маска"', description: 'Творческий коллектив театралов', memberCount: 9, competitionCount: 6, type: 'Творческие', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070' },
  { id: 12, name: 'Клуб "Брейн-ринг"', description: 'Интеллектуальные баталии каждую неделю', memberCount: 6, competitionCount: 10, type: 'Интеллектуальные', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=2070' },
  { id: 13, name: 'Секция "Легкая атлетика"', description: 'Бег, прыжки, метания — всё для спорта!', memberCount: 18, competitionCount: 13, type: 'Спортивные', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070' },
  { id: 14, name: 'Танцевальная группа "Флэш"', description: 'Современные танцы и шоу', memberCount: 11, competitionCount: 8, type: 'Творческие', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2070' },
  { id: 15, name: 'Клуб "Что? Где? Когда?"', description: 'Интеллектуальные игры для всех возрастов', memberCount: 7, competitionCount: 12, type: 'Интеллектуальные', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=2070' },
  { id: 16, name: 'Футбольная команда "Динамо"', description: 'Детская футбольная команда', memberCount: 13, competitionCount: 7, type: 'Спортивные', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2070' },
  { id: 17, name: 'Студия "Арт-хаус"', description: 'Творческая студия для детей и взрослых', memberCount: 10, competitionCount: 5, type: 'Творческие', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=2070' },
  { id: 18, name: 'Клуб "Эрудит+"', description: 'Интеллектуальные турниры и квизы', memberCount: 8, competitionCount: 9, type: 'Интеллектуальные', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070' },
  { id: 19, name: 'Баскетбольная команда "Тигры"', description: 'Сильная спортивная команда', memberCount: 12, competitionCount: 10, type: 'Спортивные', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=2070' },
  { id: 20, name: 'Театр-студия "Вдохновение"', description: 'Творческие постановки и спектакли', memberCount: 14, competitionCount: 6, type: 'Творческие', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?q=80&w=2070' },
]

const competitionTypes = [
  'Все типы',
  'Спортивные',
  'Интеллектуальные',
  'Творческие',
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
  const [minMembers, setMinMembers] = useState('')
  const [maxMembers, setMaxMembers] = useState('')
  const [minCompetitions, setMinCompetitions] = useState('')
  const [maxCompetitions, setMaxCompetitions] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [typeFilter, setTypeFilter] = useState('Все типы')
  
  useEffect(() => {
    setIsLoaded(true)

    // Очищаем старые команды и записываем только актуальные mockTeams
    try {
      localStorage.removeItem('teams');
      localStorage.setItem('teams', JSON.stringify(mockTeams));
      setTeams(mockTeams);
    } catch (error) {
      console.error('Ошибка при инициализации команд:', error)
    }
  }, [])

  // Filter teams based on search query and filters
  const filteredTeams = teams.filter(team => {
    const matchesQuery = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase());
    const membersOk = (!minMembers || team.memberCount >= Number(minMembers)) && (!maxMembers || team.memberCount <= Number(maxMembers));
    const competitionsOk = (!minCompetitions || team.competitionCount >= Number(minCompetitions)) && (!maxCompetitions || team.competitionCount <= Number(maxCompetitions));
    const typeOk = typeFilter === 'Все типы' || team.type === typeFilter;
    return matchesQuery && membersOk && competitionsOk && typeOk;
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
          
          {/* Search & Filters */}
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="relative col-span-1 md:col-span-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Поиск команд..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input pl-10 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Тип соревнований</label>
                    <select
                      value={typeFilter}
                      onChange={e => setTypeFilter(e.target.value)}
                      className="input w-full"
                    >
                      {competitionTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Участников от</label>
                    <input
                      type="number"
                      min="0"
                      value={minMembers}
                      onChange={e => setMinMembers(e.target.value)}
                      className="input w-full"
                      placeholder="min"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Участников до</label>
                    <input
                      type="number"
                      min="0"
                      value={maxMembers}
                      onChange={e => setMaxMembers(e.target.value)}
                      className="input w-full"
                      placeholder="max"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Соревнований от</label>
                    <input
                      type="number"
                      min="0"
                      value={minCompetitions}
                      onChange={e => setMinCompetitions(e.target.value)}
                      className="input w-full"
                      placeholder="min"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Соревнований до</label>
                    <input
                      type="number"
                      min="0"
                      value={maxCompetitions}
                      onChange={e => setMaxCompetitions(e.target.value)}
                      className="input w-full"
                      placeholder="max"
                    />
                  </div>
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