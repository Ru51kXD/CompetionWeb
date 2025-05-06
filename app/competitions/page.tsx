'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CompetitionCard from '../components/CompetitionCard'
import { FaSearch, FaFilter, FaChevronDown } from 'react-icons/fa'

// Mock data for competitions
const mockCompetitions = [
  {
    id: 1,
    title: 'Городской турнир по шахматам',
    description: 'Ежегодный турнир по шахматам среди любителей и профессионалов всех возрастов.',
    type: 'INTELLECTUAL' as const,
    startDate: new Date('2023-12-15'),
    endDate: new Date('2023-12-17'),
    location: 'Городской шахматный клуб',
    image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2071'
  },
  {
    id: 2,
    title: 'Межшкольные соревнования по футболу',
    description: 'Футбольные матчи между командами школ города. Присоединяйтесь к спортивному празднику!',
    type: 'SPORTS' as const,
    startDate: new Date('2023-12-20'),
    endDate: new Date('2023-12-25'),
    location: 'Центральный стадион',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2034'
  },
  {
    id: 3,
    title: 'Конкурс молодых художников',
    description: 'Открытый конкурс для художников до 25 лет. Покажите свой талант и выиграйте ценные призы!',
    type: 'CREATIVE' as const,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-20'),
    location: 'Городская галерея искусств',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071'
  },
  {
    id: 4,
    title: 'Турнир по настольному теннису',
    description: 'Открытый турнир по настольному теннису для спортсменов всех уровней подготовки.',
    type: 'SPORTS' as const,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-16'),
    location: 'Спортивный комплекс "Динамо"',
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=2099'
  },
  {
    id: 5,
    title: 'Олимпиада по программированию',
    description: 'Ежегодная олимпиада по программированию для школьников и студентов.',
    type: 'INTELLECTUAL' as const,
    startDate: new Date('2024-02-05'),
    endDate: new Date('2024-02-07'),
    location: 'Технический университет',
    image: 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?q=80&w=2076'
  },
  {
    id: 6,
    title: 'Фестиваль современного танца',
    description: 'Конкурс танцевальных коллективов разных стилей и направлений.',
    type: 'CREATIVE' as const,
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-02-25'),
    location: 'Городской дворец культуры',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069'
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

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState(mockCompetitions)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Handle filter change
  const handleFilterChange = (type: string | null) => {
    setFilterType(type)
    setIsFilterOpen(false)
  }

  // Filter competitions based on search query and type
  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !filterType || comp.type === filterType;
    
    return matchesSearch && matchesType;
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Соревнования</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Найдите интересующие вас соревнования и присоединяйтесь к участникам
            </p>
          </motion.div>
          
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Поиск соревнований..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10"
                  />
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="btn-outline w-full sm:w-auto flex items-center justify-center space-x-2"
                  >
                    <FaFilter />
                    <span>{filterType || 'Все типы'}</span>
                    <FaChevronDown className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleFilterChange(null)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Все типы
                        </button>
                        <button
                          onClick={() => handleFilterChange('SPORTS')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Спортивные
                        </button>
                        <button
                          onClick={() => handleFilterChange('INTELLECTUAL')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Интеллектуальные
                        </button>
                        <button
                          onClick={() => handleFilterChange('CREATIVE')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Творческие
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
          
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
                {filteredCompetitions.map((competition, index) => (
                  <motion.div
                    key={competition.id}
                    variants={itemVariants}
                    exit="exit"
                  >
                    <CompetitionCard {...competition} index={index} />
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
                <p className="text-2xl text-gray-500">Соревнования не найдены</p>
                <p className="text-gray-500 mt-2">Попробуйте изменить параметры поиска</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 