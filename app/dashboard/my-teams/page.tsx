'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaUsers, FaEdit, FaTrash, FaTrophy, FaUserPlus, FaCalendarAlt, FaPlus, FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function MyTeamsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [teams, setTeams] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login?redirect=/dashboard/my-teams')
      return
    }
    
    setIsLoaded(true)
    
    // Load teams from localStorage
    try {
      const storedTeams = localStorage.getItem('teams')
      if (storedTeams) {
        const parsedTeams = JSON.parse(storedTeams)
        if (Array.isArray(parsedTeams)) {
          // Filter teams owned by the current user
          const myTeams = parsedTeams.filter(team => 
            team.ownerId === user.id || (team.members && team.members.includes(user.id))
          )
          setTeams(myTeams)
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке команд:', error)
    }
  }, [router, user])
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('ru-RU', options)
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
            <h1 className="text-3xl font-bold mb-2">Мои команды</h1>
            <p className="text-gray-600">
              Управляйте своими командами и участвуйте в соревнованиях
            </p>
          </div>
          
          <div className="mb-6 flex justify-between items-center">
            <div className="text-gray-600">
              Всего команд: {teams.length}
            </div>
            <Link 
              href="/teams/create" 
              className="btn-primary px-4 py-2 flex items-center"
            >
              <FaPlus className="mr-2" /> Создать команду
            </Link>
          </div>
          
          {teams.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <FaUsers className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">У вас пока нет команд</h3>
              <p className="text-gray-500 mb-6">
                Создайте свою первую команду или присоединитесь к существующей
              </p>
              <Link 
                href="/teams/create" 
                className="btn-primary px-6 py-2 inline-flex items-center"
              >
                <FaPlus className="mr-2" /> Создать команду
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map(team => {
                const isOwner = team.ownerId === user.id
                
                return (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-full"
                  >
                    <div 
                      className="relative h-40"
                      style={{backgroundColor: team.teamColor}}
                    >
                      {team.image && (
                        <Image
                          src={team.image}
                          alt={team.name}
                          fill
                          className="object-cover opacity-90"
                          unoptimized
                        />
                      )}
                      {team.logo && (
                        <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white p-1 shadow-md flex items-center justify-center overflow-hidden">
                          <Image 
                            src={team.logo} 
                            alt={`${team.name} лого`} 
                            width={60} 
                            height={60}
                            className="rounded-full"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    
                    <div className="p-4 flex-grow">
                      <h3 className="text-xl font-semibold mb-2 flex items-center">
                        {team.name}
                        {isOwner && (
                          <span className="ml-2 text-xs bg-primary-100 text-primary-800 py-1 px-2 rounded-full">
                            Капитан
                          </span>
                        )}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {team.description}
                      </p>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaUsers className="text-gray-400 mr-2" />
                            <span>Участников: {team.memberCount || 1}</span>
                          </div>
                          {isOwner && (
                            <Link href={`/teams/${team.id}/invite`} className="text-primary-600 text-xs">
                              + Пригласить
                            </Link>
                          )}
                        </div>
                        <div className="flex items-center">
                          <FaTrophy className="text-gray-400 mr-2" />
                          <span>Соревнований: {team.competitionCount || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-gray-400 mr-2" />
                          <span>Создана: {formatDate(team.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 p-4 flex justify-between">
                      <Link
                        href={`/teams/${team.id}`}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        Подробнее
                      </Link>
                      <div className="flex space-x-2">
                        {isOwner && (
                          <>
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
                          </>
                        )}
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