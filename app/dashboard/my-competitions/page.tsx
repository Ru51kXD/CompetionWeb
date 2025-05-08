'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaTrophy, FaEdit, FaTrash, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaPlus, FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function MyCompetitionsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [competitions, setCompetitions] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login?redirect=/dashboard/my-competitions')
      return
    }
    
    setIsLoaded(true)
    
    // Load competitions from localStorage
    try {
      const storedCompetitions = localStorage.getItem('competitions')
      if (storedCompetitions) {
        const parsedCompetitions = JSON.parse(storedCompetitions)
        if (Array.isArray(parsedCompetitions)) {
          // Filter competitions created by the current user
          const myCompetitions = parsedCompetitions.filter(comp => 
            comp.createdBy === user.id
          )
          setCompetitions(myCompetitions)
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке соревнований:', error)
    }
  }, [router, user])
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('ru-RU', options)
  }
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return { label: 'Предстоит', classes: 'bg-blue-100 text-blue-800' }
      case 'active':
        return { label: 'Активно', classes: 'bg-green-100 text-green-800' }
      case 'completed':
        return { label: 'Завершено', classes: 'bg-gray-100 text-gray-800' }
      default:
        return { label: 'Неизвестно', classes: 'bg-gray-100 text-gray-800' }
    }
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
            <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <FaArrowLeft className="mr-2" /> Вернуться в личный кабинет
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Мои соревнования</h1>
            <p className="text-gray-600">
              Управляйте созданными вами соревнованиями
            </p>
          </div>
          
          <div className="mb-6 flex justify-between items-center">
            <div className="text-gray-600">
              Всего соревнований: {competitions.length}
            </div>
            <Link 
              href="/competitions/create" 
              className="btn-primary px-4 py-2 flex items-center"
            >
              <FaPlus className="mr-2" /> Создать соревнование
            </Link>
          </div>
          
          {competitions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <FaTrophy className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">У вас пока нет созданных соревнований</h3>
              <p className="text-gray-500 mb-6">
                Создайте своё первое соревнование и начните приглашать команды
              </p>
              <Link 
                href="/competitions/create" 
                className="btn-primary px-6 py-2 inline-flex items-center"
              >
                <FaPlus className="mr-2" /> Создать соревнование
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitions.map(competition => {
                const statusBadge = getStatusBadge(competition.status)
                
                return (
                  <motion.div
                    key={competition.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-full"
                  >
                    <div className="relative h-40">
                      {competition.image && (
                        <Image
                          src={competition.image}
                          alt={competition.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="absolute bottom-3 left-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.classes}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-grow">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">{competition.title}</h3>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-gray-400 mr-2" />
                          <span>
                            {formatDate(competition.startDate)} - {formatDate(competition.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-gray-400 mr-2" />
                          <span className="line-clamp-1">{competition.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FaUsers className="text-gray-400 mr-2" />
                          <span>Команд: {competition.teams?.length || 0} из {competition.maxTeams}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 p-4 flex justify-between">
                      <Link
                        href={`/competitions/${competition.id}`}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        Подробнее
                      </Link>
                      <div className="flex space-x-2">
                        <button 
                          className="text-gray-500 hover:text-primary-600"
                          title="Редактировать"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="text-gray-500 hover:text-red-600"
                          title="Удалить"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 