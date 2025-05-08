'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserFriends, FaFilter, FaTrophy } from 'react-icons/fa'

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [teamToDelete, setTeamToDelete] = useState(null)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = () => {
    setLoading(true)
    try {
      // Check if there are teams in localStorage
      const storedTeams = localStorage.getItem('teams')
      
      if (storedTeams) {
        const parsedTeams = JSON.parse(storedTeams)
        setTeams(parsedTeams)
      }
    } catch (error) {
      console.error('Ошибка при загрузке команд:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (team) => {
    setTeamToDelete(team)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!teamToDelete) return
    
    try {
      // Get competitions to remove team references
      const storedCompetitions = localStorage.getItem('competitions')
      if (storedCompetitions) {
        const competitions = JSON.parse(storedCompetitions)
        
        // Remove team from all competitions
        const updatedCompetitions = competitions.map(competition => {
          if (competition.teams && competition.teams.includes(teamToDelete.id)) {
            return {
              ...competition,
              teams: competition.teams.filter(id => id !== teamToDelete.id),
              participantCount: (competition.teams.filter(id => id !== teamToDelete.id)).length
            }
          }
          return competition
        })
        
        // Save updated competitions
        localStorage.setItem('competitions', JSON.stringify(updatedCompetitions))
      }
      
      // Remove team from teams
      const updatedTeams = teams.filter(t => t.id !== teamToDelete.id)
      localStorage.setItem('teams', JSON.stringify(updatedTeams))
      setTeams(updatedTeams)
      setShowDeleteModal(false)
      setTeamToDelete(null)
    } catch (error) {
      console.error('Ошибка при удалении команды:', error)
    }
  }

  const filteredAndSortedTeams = teams
    .filter(team => {
      return (
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'members':
          return (b.memberCount || 0) - (a.memberCount || 0)
        case 'competitions':
          return (b.competitionCount || 0) - (a.competitionCount || 0)
        default:
          return 0
      }
    })

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Управление командами</h1>
          <p className="text-gray-600">Создание, редактирование и удаление команд</p>
        </div>
        <Link 
          href="/admin/teams/create" 
          className="btn-primary mt-4 md:mt-0 inline-flex items-center"
        >
          <FaPlus className="mr-2" /> Создать команду
        </Link>
      </div>

      {/* Search and filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Поиск команд..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <FaFilter className="text-gray-400 mr-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="name">По названию</option>
                <option value="members">По количеству участников</option>
                <option value="competitions">По количеству соревнований</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Teams grid */}
      {loading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredAndSortedTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTeams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 relative">
                <Image
                  src={team.image || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt={team.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{team.name}</h3>
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <div className="flex items-center">
                    <FaUserFriends className="mr-2 text-primary-500" />
                    <span>{team.memberCount || 0} участников</span>
                  </div>
                  <div className="flex items-center">
                    <FaTrophy className="mr-2 text-primary-500" />
                    <span>{team.competitionCount || 0} соревнований</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Link 
                    href={`/admin/teams/${team.id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-800"
                  >
                    Просмотр
                  </Link>
                  <div className="flex space-x-2">
                    <Link 
                      href={`/teams/${team.id}/edit`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <FaEdit />
                      <span className="sr-only">Редактировать</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(team)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                      <span className="sr-only">Удалить</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
          {searchQuery ? (
            <>
              <FaSearch className="mx-auto text-3xl mb-2 text-gray-400" />
              <p>Команды не найдены. Попробуйте изменить параметры поиска.</p>
            </>
          ) : (
            <>
              <FaUserFriends className="mx-auto text-3xl mb-2 text-gray-400" />
              <p>Команды не найдены. Создайте новую команду!</p>
              <Link 
                href="/admin/teams/create" 
                className="btn-primary mt-4 inline-flex items-center"
              >
                <FaPlus className="mr-2" /> Создать команду
              </Link>
            </>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Удаление команды</h3>
            <p className="text-gray-600 mb-6">
              Вы уверены, что хотите удалить команду "{teamToDelete?.name}"? Это действие нельзя отменить.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={confirmDelete}
                className="btn-danger flex-1"
              >
                Удалить
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-outline flex-1"
              >
                Отмена
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 