'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaSearch, FaFilter, FaExclamationTriangle, FaUser } from 'react-icons/fa'

type Message = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  read: boolean
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = () => {
    setLoading(true)
    try {
      // Retrieve messages from localStorage
      const storedMessages = localStorage.getItem('contactMessages')
      
      if (storedMessages) {
        const parsedMessages: Message[] = JSON.parse(storedMessages)
        // Sort by creation date (newest first)
        const sortedMessages = parsedMessages.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setMessages(sortedMessages)
      } else {
        setMessages([])
      }
    } catch (error) {
      console.error('Ошибка при загрузке сообщений:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (message: Message) => {
    setMessageToDelete(message)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!messageToDelete) return
    
    try {
      const updatedMessages = messages.filter(m => m.id !== messageToDelete.id)
      localStorage.setItem('contactMessages', JSON.stringify(updatedMessages))
      setMessages(updatedMessages)
      setShowDeleteModal(false)
      setMessageToDelete(null)
    } catch (error) {
      console.error('Ошибка при удалении сообщения:', error)
    }
  }

  const handleViewMessage = (message: Message) => {
    // If message is unread, mark it as read
    if (!message.read) {
      const updatedMessages = messages.map(m => 
        m.id === message.id ? { ...m, read: true } : m
      )
      setMessages(updatedMessages)
      localStorage.setItem('contactMessages', JSON.stringify(updatedMessages))
    }
    
    setSelectedMessage(message)
    setShowViewModal(true)
  }

  const toggleReadStatus = (message: Message) => {
    const updatedMessages = messages.map(m => 
      m.id === message.id ? { ...m, read: !m.read } : m
    )
    setMessages(updatedMessages)
    localStorage.setItem('contactMessages', JSON.stringify(updatedMessages))
  }

  const filteredMessages = messages.filter(message => {
    // Filter by search query
    const matchesQuery = (
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    // Filter by read status
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'read' && message.read) || 
      (filter === 'unread' && !message.read)
    
    return matchesQuery && matchesFilter
  })

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Управление сообщениями</h1>
          <p className="text-gray-600">Управляйте сообщениями от пользователей</p>
        </div>
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
              placeholder="Поиск сообщений..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <FaFilter className="text-gray-400 mr-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'read' | 'unread')}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Все сообщения</option>
                <option value="read">Прочитанные</option>
                <option value="unread">Непрочитанные</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Messages list */}
      {loading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredMessages.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Отправитель
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тема
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сообщение
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr key={message.id} className={`hover:bg-gray-50 ${!message.read ? 'font-medium bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {message.read ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FaEnvelopeOpen className="mr-1" /> Прочитано
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <FaEnvelope className="mr-1" /> Новое
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <FaUser className="text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{message.name}</div>
                          <div className="text-sm text-gray-500">{message.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {message.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {truncateText(message.message, 50)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(message.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="text-primary-600 hover:text-primary-900 p-2"
                        >
                          <FaEnvelopeOpen />
                          <span className="sr-only">Просмотреть</span>
                        </button>
                        <button
                          onClick={() => toggleReadStatus(message)}
                          className={`p-2 ${message.read ? 'text-gray-600 hover:text-gray-900' : 'text-blue-600 hover:text-blue-900'}`}
                        >
                          {message.read ? <FaEnvelope /> : <FaEnvelopeOpen />}
                          <span className="sr-only">{message.read ? 'Пометить как непрочитанное' : 'Пометить как прочитанное'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(message)}
                          className="text-red-600 hover:text-red-900 p-2"
                        >
                          <FaTrash />
                          <span className="sr-only">Удалить</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
          {searchQuery || filter !== 'all' ? (
            <>
              <FaSearch className="mx-auto text-3xl mb-2 text-gray-400" />
              <p>Сообщения не найдены. Попробуйте изменить параметры поиска.</p>
            </>
          ) : (
            <>
              <FaEnvelope className="mx-auto text-3xl mb-2 text-gray-400" />
              <p>Сообщения отсутствуют.</p>
            </>
          )}
        </div>
      )}

      {/* View message modal */}
      {showViewModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{selectedMessage.subject}</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  &times;
                </button>
              </div>
              
              <div className="mb-6 border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUser className="text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium">{selectedMessage.name}</div>
                    <div className="text-sm text-gray-500">{selectedMessage.email}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(selectedMessage.createdAt)}
                </div>
              </div>
              
              <div className="mb-6 whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="btn-outline py-2 px-4"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && messageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Удаление сообщения</h3>
            <p className="text-gray-600 mb-6">
              Вы уверены, что хотите удалить сообщение от {messageToDelete.name}? Это действие нельзя отменить.
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