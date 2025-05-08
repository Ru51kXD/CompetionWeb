'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaUsers, FaTrophy, FaUserFriends, FaClock, FaStar, FaPlus } from 'react-icons/fa'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    teams: 0,
    competitions: 0,
    activeCompetitions: 0
  })
  const [recentCompetitions, setRecentCompetitions] = useState([])
  const [popularTeams, setPopularTeams] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = () => {
      try {
        // Load users from localStorage
        let userCount = 0
        const storedUsers = localStorage.getItem('users')
        if (storedUsers) {
          const users = JSON.parse(storedUsers)
          userCount = users.length
        }

        // Load teams from localStorage
        let teams = []
        const storedTeams = localStorage.getItem('teams')
        if (storedTeams) {
          teams = JSON.parse(storedTeams)
        }

        // Load competitions from localStorage
        let competitions = []
        const storedCompetitions = localStorage.getItem('competitions')
        if (storedCompetitions) {
          competitions = JSON.parse(storedCompetitions)
        }

        // Calculate stats
        const activeCompetitions = competitions.filter(comp => comp.status === 'active')
        
        // Set stats
        setStats({
          users: userCount,
          teams: teams.length,
          competitions: competitions.length,
          activeCompetitions: activeCompetitions.length
        })

        // Get recent competitions
        const sortedCompetitions = [...competitions].sort((a, b) => {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        })
        setRecentCompetitions(sortedCompetitions.slice(0, 5))

        // Get popular teams (sorted by competitionCount)
        const sortedTeams = [...teams].sort((a, b) => {
          return (b.competitionCount || 0) - (a.competitionCount || 0)
        })
        setPopularTeams(sortedTeams.slice(0, 5))

      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
        <p className="text-gray-600">Добро пожаловать в панель управления. Здесь вы можете управлять всеми аспектами платформы.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">Пользователи</p>
              <p className="text-3xl font-bold">{stats.users}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
          </div>
          <Link href="/admin/users" className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            Управление пользователями
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">Команды</p>
              <p className="text-3xl font-bold">{stats.teams}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaUserFriends className="text-green-600 text-xl" />
            </div>
          </div>
          <Link href="/admin/teams" className="mt-4 inline-flex items-center text-sm text-green-600 hover:text-green-800">
            Управление командами
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">Соревнования</p>
              <p className="text-3xl font-bold">{stats.competitions}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaTrophy className="text-purple-600 text-xl" />
            </div>
          </div>
          <Link href="/admin/competitions" className="mt-4 inline-flex items-center text-sm text-purple-600 hover:text-purple-800">
            Управление соревнованиями
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">Активные соревнования</p>
              <p className="text-3xl font-bold">{stats.activeCompetitions}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <FaClock className="text-amber-600 text-xl" />
            </div>
          </div>
          <Link href="/admin/competitions" className="mt-4 inline-flex items-center text-sm text-amber-600 hover:text-amber-800">
            Посмотреть активные
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Competitions */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Недавние соревнования</h2>
            <Link href="/admin/competitions/create" className="text-primary-600 hover:text-primary-800 flex items-center text-sm">
              <FaPlus className="mr-1" /> Создать
            </Link>
          </div>
          
          {recentCompetitions.length > 0 ? (
            <div className="space-y-3">
              {recentCompetitions.map((competition) => (
                <Link href={`/admin/competitions/${competition.id}`} key={competition.id}>
                  <div className="flex items-center border border-gray-100 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-gray-100 rounded-full p-3 mr-4">
                      <FaTrophy className="text-primary-500" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{competition.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(competition.startDate).toLocaleDateString('ru-RU')} - {new Date(competition.endDate).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        competition.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                        competition.status === 'active' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {competition.status === 'upcoming' ? 'Предстоит' :
                         competition.status === 'active' ? 'Активно' : 'Завершено'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Соревнования не найдены
            </div>
          )}
        </motion.div>

        {/* Popular Teams */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Популярные команды</h2>
            <Link href="/admin/teams/create" className="text-primary-600 hover:text-primary-800 flex items-center text-sm">
              <FaPlus className="mr-1" /> Создать
            </Link>
          </div>
          
          {popularTeams.length > 0 ? (
            <div className="space-y-3">
              {popularTeams.map((team) => (
                <Link href={`/admin/teams/${team.id}`} key={team.id}>
                  <div className="flex items-center border border-gray-100 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-gray-100 rounded-full p-3 mr-4">
                      <FaUserFriends className="text-green-500" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{team.name}</h3>
                      <p className="text-sm text-gray-500">
                        {team.memberCount} участников, {team.competitionCount || 0} соревнований
                      </p>
                    </div>
                    {team.competitionCount > 0 && (
                      <div className="flex items-center">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 flex items-center">
                          <FaStar className="mr-1" /> Популярная
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Команды не найдены
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 