'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTrophy, FaFilter, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'

export default function AdminCompetitionsPage() {
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [competitionToDelete, setCompetitionToDelete] = useState(null)

  useEffect(() => {
    fetchCompetitions()
  }, [])

  const fetchCompetitions = () => {
    setLoading(true)
    try {
      // Check if there are competitions in localStorage
      const storedCompetitions = localStorage.getItem('competitions')
      
      if (storedCompetitions) {
        const parsedCompetitions = JSON.parse(storedCompetitions)
        setCompetitions(parsedCompetitions)
      }
    } catch (error) {
      console.error('Ошибка при загрузке соревнований:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (competition) => {
    setCompetitionToDelete(competition)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!competitionToDelete) return
    
    try {
      const updatedCompetitions = competitions.filter(c => c.id !== competitionToDelete.id)
      localStorage.setItem('competitions', JSON.stringify(updatedCompetitions))
      setCompetitions(updatedCompetitions)
      setShowDeleteModal(false)
      setCompetitionToDelete(null)
    } catch (error) {
      console.error('Ошибка при удалении соревнования:', error)
    }
  }

  const filteredCompetitions = competitions.filter(competition => {
    const matchesQuery = (
      competition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competition.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competition.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    const matchesStatus = statusFilter === 'all' || competition.status === statusFilter
    
    return matchesQuery && matchesStatus
  })

  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Управление соревнованиями</h1>
          <p className="text-gray-600">Создание, редактирование и удаление соревнований</p>
        </div>
        <Link 
          href="/admin/competitions/create" 
          className="btn-primary mt-4 md:mt-0 inline-flex items-center"
        >
          <FaPlus className="mr-2" /> Создать соревнование
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
              placeholder="Поиск соревнований..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <FaFilter className="text-gray-400 mr-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Все статусы</option>
                <option value="upcoming">Предстоит</option>
                <option value="active">Активно</option>
                <option value="completed">Завершено</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Competitions grid */}
      {loading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredCompetitions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map((competition) => (
            <div key={competition.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 relative">
                <Image
                  src={competition.image || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt={competition.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
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
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{competition.title}</h3>
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-primary-500" />
                    <span>{formatDate(competition.startDate)} - {formatDate(competition.endDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-primary-500" />
                    <span>{competition.location}</span>
                  </div>
                  <div className="flex items-center">
                    <FaTrophy className="mr-2 text-primary-500" />
                    <span>{competition.participantCount || 0} команд</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Link 
                    href={`/admin/competitions/${competition.id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-800"
                  >
                    Просмотр
                  </Link>
                  <div className="flex space-x-2">
                    <Link 
                      href={`/competitions/${competition.id}/edit`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <FaEdit />
                      <span className="sr-only">Редактировать</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(competition)}
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
          {searchQuery || statusFilter !== 'all' ? (
            <>
              <FaSearch className="mx-auto text-3xl mb-2 text-gray-400" />
              <p>Соревнования не найдены. Попробуйте изменить параметры поиска.</p>
            </>
          ) : (
            <>
              <FaTrophy className="mx-auto text-3xl mb-2 text-gray-400" />
              <p>Соревнования не найдены. Создайте новое соревнование!</p>
              <Link 
                href="/admin/competitions/create" 
                className="btn-primary mt-4 inline-flex items-center"
              >
                <FaPlus className="mr-2" /> Создать соревнование
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
            <h3 className="text-xl font-bold mb-4">Удаление соревнования</h3>
            <p className="text-gray-600 mb-6">
              Вы уверены, что хотите удалить соревнование "{competitionToDelete?.title}"? Это действие нельзя отменить.
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