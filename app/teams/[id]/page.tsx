'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaUsers, FaTrophy, FaArrowLeft, FaEdit, FaTrash, FaPlus, FaUser, FaCalendarAlt, FaExclamationTriangle, FaUserPlus, FaDoorOpen, FaExclamationCircle, FaCheck } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function TeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const id = params.id
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [joinRequestSent, setJoinRequestSent] = useState(false)
  const [joinRequestSuccess, setJoinRequestSuccess] = useState(false)
  const [userStatus, setUserStatus] = useState('none') // 'none', 'member', 'pending'
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Иван Иванов', role: 'Капитан', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Анна Петрова', role: 'Участник', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  ])
  const [pendingRequests, setPendingRequests] = useState([])
  const [teamCompetitions, setTeamCompetitions] = useState([])
  const [canJoin, setCanJoin] = useState(true)
  const [isTeamOwner, setIsTeamOwner] = useState(false)
  const maxTeamSize = 10 // Default maximum team size

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchTeam = () => {
      setLoading(true)
      try {
        // Get teams from localStorage
        const storedTeams = localStorage.getItem('teams')
        const storedCompetitions = localStorage.getItem('competitions')
        
        if (storedTeams) {
          const allTeams = JSON.parse(storedTeams)
          
          // Find team with matching id
          const teamId = typeof id === 'string' ? parseInt(id, 10) : id
          const foundTeam = allTeams.find(t => t.id === teamId)
          
          if (foundTeam) {
            // Initialize members and pending requests if they don't exist
            if (!foundTeam.members) {
              foundTeam.members = teamMembers.map(m => ({...m})); // Clone the default members
            }
            
            if (!foundTeam.pendingRequests) {
              foundTeam.pendingRequests = [];
            }
            
            if (!foundTeam.maxMembers) {
              foundTeam.maxMembers = maxTeamSize;
            }
            
            if (!foundTeam.ownerId) {
              foundTeam.ownerId = 1; // Default owner ID (admin)
            }
            
            setTeam(foundTeam)
            setTeamMembers(foundTeam.members || [])
            setPendingRequests(foundTeam.pendingRequests || [])
            
            // Check if max team size reached
            setCanJoin(foundTeam.members.length < foundTeam.maxMembers)
            
            // Check if current user is team owner
            setIsTeamOwner(foundTeam.ownerId === user.id || isAdmin())
            
            // Check user status
            if (foundTeam.members.some(m => m.id === user.id)) {
              setUserStatus('member')
            } else if (foundTeam.pendingRequests.some(r => r.userId === user.id)) {
              setUserStatus('pending')
            } else {
              setUserStatus('none')
            }
            
            // Get team competitions if any
            if (storedCompetitions) {
              const competitions = JSON.parse(storedCompetitions)
              const teamCompetitions = competitions.filter(competition => 
                competition.teams && competition.teams.includes(teamId)
              )
              setTeamCompetitions(teamCompetitions)
            }
          } else {
            setError('Команда не найдена')
          }
        } else {
          setError('Команды не найдены')
        }
      } catch (err) {
        console.error('Ошибка при загрузке команды:', err)
        setError('Ошибка при загрузке данных команды')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTeam()
    }
  }, [id, user, router, isAdmin])

  const handleDelete = () => {
    setIsDeleting(true)
    
    try {
      // Get current teams from localStorage
      const storedTeams = localStorage.getItem('teams')
      if (storedTeams) {
        const teams = JSON.parse(storedTeams)
        const teamId = typeof id === 'string' ? parseInt(id, 10) : id
        
        // Filter out the team to delete
        const updatedTeams = teams.filter((t) => t.id !== teamId)
        
        // Save updated teams back to localStorage
        localStorage.setItem('teams', JSON.stringify(updatedTeams))
        
        setTimeout(() => {
          setIsDeleting(false)
          router.push('/teams')
        }, 1000)
      }
    } catch (error) {
      console.error('Ошибка при удалении команды:', error)
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleJoinRequest = () => {
    if (!user) {
      router.push('/login')
      return
    }
    
    setJoinRequestSent(true)
    
    try {
      // Get current teams from localStorage
      const storedTeams = localStorage.getItem('teams')
      if (storedTeams && team) {
        const teams = JSON.parse(storedTeams)
        const teamId = typeof id === 'string' ? parseInt(id, 10) : id
        const teamIndex = teams.findIndex((t) => t.id === teamId)
        
        if (teamIndex !== -1) {
          // If pendingRequests doesn't exist, initialize it
          if (!teams[teamIndex].pendingRequests) {
            teams[teamIndex].pendingRequests = []
          }
          
          // Add user to pending requests
          const newRequest = {
            userId: user.id,
            userName: user.name,
            requestDate: new Date().toISOString(),
            status: 'pending'
          }
          
          teams[teamIndex].pendingRequests.push(newRequest)
          
          // Save updated teams back to localStorage
          localStorage.setItem('teams', JSON.stringify(teams))
          
          // Update local state
          setPendingRequests([...pendingRequests, newRequest])
          setUserStatus('pending')
          
          // Show success message
          setJoinRequestSuccess(true)
          setTimeout(() => {
            setJoinRequestSuccess(false)
            setJoinRequestSent(false)
          }, 3000)
        }
      }
    } catch (error) {
      console.error('Ошибка при отправке заявки на вступление:', error)
      setJoinRequestSent(false)
    }
  }

  const handleLeaveTeam = () => {
    if (!user) return;
    
    try {
      // Get current teams from localStorage
      const storedTeams = localStorage.getItem('teams')
      if (storedTeams && team) {
        const teams = JSON.parse(storedTeams)
        const teamId = typeof id === 'string' ? parseInt(id, 10) : id
        const teamIndex = teams.findIndex((t) => t.id === teamId)
        
        if (teamIndex !== -1) {
          // Remove user from members
          teams[teamIndex].members = teams[teamIndex].members.filter(member => member.id !== user.id)
          teams[teamIndex].memberCount = teams[teamIndex].members.length
          
          // Save updated teams back to localStorage
          localStorage.setItem('teams', JSON.stringify(teams))
          
          // Update local state
          setTeam({
            ...team,
            members: teams[teamIndex].members,
            memberCount: teams[teamIndex].members.length
          })
          setTeamMembers(teams[teamIndex].members)
          setUserStatus('none')
          setCanJoin(teams[teamIndex].members.length < teams[teamIndex].maxMembers)
        }
      }
    } catch (error) {
      console.error('Ошибка при выходе из команды:', error)
    }
  }

  const handleApproveRequest = (userId) => {
    try {
      // Get current teams from localStorage
      const storedTeams = localStorage.getItem('teams')
      const storedUsers = localStorage.getItem('users')
      
      if (storedTeams && team && storedUsers) {
        const teams = JSON.parse(storedTeams)
        const users = JSON.parse(storedUsers)
        const teamId = typeof id === 'string' ? parseInt(id, 10) : id
        const teamIndex = teams.findIndex((t) => t.id === teamId)
        
        if (teamIndex !== -1) {
          // Find the user in the pending requests
          const requestIndex = teams[teamIndex].pendingRequests.findIndex(req => req.userId === userId)
          if (requestIndex !== -1) {
            const request = teams[teamIndex].pendingRequests[requestIndex]
            
            // Find the user from users list to get full profile
            const userObj = users.find(u => u.id === userId) || {
              id: userId,
              name: request.userName,
              role: 'Участник',
              avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`
            }
            
            // Add user to members
            const newMember = {
              id: userId,
              name: userObj.name || request.userName,
              role: 'Участник',
              avatar: userObj.avatar || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`
            }
            
            // Initialize members array if it doesn't exist
            if (!teams[teamIndex].members) {
              teams[teamIndex].members = []
            }
            
            teams[teamIndex].members.push(newMember)
            teams[teamIndex].memberCount = teams[teamIndex].members.length
            
            // Remove from pending requests
            teams[teamIndex].pendingRequests.splice(requestIndex, 1)
            
            // Save updated teams back to localStorage
            localStorage.setItem('teams', JSON.stringify(teams))
            
            // Update local state
            setTeamMembers(teams[teamIndex].members)
            setPendingRequests(teams[teamIndex].pendingRequests)
            setCanJoin(teams[teamIndex].members.length < teams[teamIndex].maxMembers)
            setTeam({
              ...team,
              members: teams[teamIndex].members,
              pendingRequests: teams[teamIndex].pendingRequests,
              memberCount: teams[teamIndex].members.length
            })
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при одобрении заявки:', error)
    }
  }

  const handleRejectRequest = (userId) => {
    try {
      // Get current teams from localStorage
      const storedTeams = localStorage.getItem('teams')
      if (storedTeams && team) {
        const teams = JSON.parse(storedTeams)
        const teamId = typeof id === 'string' ? parseInt(id, 10) : id
        const teamIndex = teams.findIndex((t) => t.id === teamId)
        
        if (teamIndex !== -1) {
          // Remove from pending requests
          teams[teamIndex].pendingRequests = teams[teamIndex].pendingRequests.filter(req => req.userId !== userId)
          
          // Save updated teams back to localStorage
          localStorage.setItem('teams', JSON.stringify(teams))
          
          // Update local state
          setPendingRequests(teams[teamIndex].pendingRequests)
          setTeam({
            ...team,
            pendingRequests: teams[teamIndex].pendingRequests
          })
        }
      }
    } catch (error) {
      console.error('Ошибка при отклонении заявки:', error)
    }
  }

  // Delete confirmation modal
  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <h3 className="text-xl font-bold mb-4">Удаление команды</h3>
        <p className="text-gray-600 mb-6">
          Вы уверены, что хотите удалить эту команду? Это действие нельзя отменить.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-danger flex-1 flex justify-center items-center"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Удаление...
              </>
            ) : 'Удалить команду'}
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
  )

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <FaExclamationTriangle className="mx-auto text-4xl text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-4">{error}</h1>
            <Link href="/teams" className="btn-primary">
              Вернуться к списку команд
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!team) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/teams" className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <FaArrowLeft className="mr-2" /> Вернуться к списку команд
            </Link>
          </div>

          {joinRequestSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-md p-4 flex items-center">
              <FaCheck className="mr-2" />
              <p>Заявка на вступление отправлена! Ожидайте одобрения от администратора команды.</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Team info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative h-64 bg-gray-100">
                  {team.image ? (
                    <Image 
                      src={team.image}
                      alt={team.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <FaUsers className="text-6xl text-gray-300" />
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
                    
                    <div className="flex space-x-2">
                      {(isAdmin() || isTeamOwner) && (
                        <>
                          <Link 
                            href={`/teams/${id}/edit`}
                            className="btn-outline py-1 px-3 flex items-center text-sm"
                          >
                            <FaEdit className="mr-1" /> Редактировать
                          </Link>
                          
                          <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="btn-outline text-red-600 border-red-300 hover:bg-red-50 py-1 px-3 flex items-center text-sm"
                          >
                            <FaTrash className="mr-1" /> Удалить
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-700 whitespace-pre-line">{team.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-primary-50 text-primary-700 rounded-full py-1 px-4 flex items-center">
                      <FaUsers className="mr-2" />
                      <span>{team.memberCount || teamMembers.length} {team.memberCount === 1 ? 'участник' : 'участников'}</span>
                    </div>
                    
                    <div className="bg-primary-50 text-primary-700 rounded-full py-1 px-4 flex items-center">
                      <FaTrophy className="mr-2" />
                      <span>{team.competitionCount || 0} {team.competitionCount === 1 ? 'соревнование' : 'соревнований'}</span>
                    </div>
                  </div>
                  
                  {userStatus === 'none' && (
                    <div className="mt-6">
                      {canJoin ? (
                        <button 
                          onClick={handleJoinRequest}
                          disabled={joinRequestSent}
                          className="btn-primary flex items-center"
                        >
                          {joinRequestSent ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Отправка заявки...
                            </>
                          ) : (
                            <>
                              <FaUserPlus className="mr-2" /> Подать заявку на вступление
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md p-4 flex items-center">
                          <FaExclamationCircle className="mr-2" />
                          <p>Команда заполнена. Максимальное количество участников: {team.maxMembers || maxTeamSize}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {userStatus === 'pending' && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 rounded-md p-4 flex items-center">
                      <FaExclamationCircle className="mr-2" />
                      <p>Ваша заявка на вступление находится на рассмотрении.</p>
                    </div>
                  )}
                  
                  {userStatus === 'member' && (
                    <div className="mt-6">
                      <button 
                        onClick={handleLeaveTeam}
                        className="btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center"
                      >
                        <FaDoorOpen className="mr-2" /> Покинуть команду
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Competitions */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Соревнования команды</h2>
                
                {teamCompetitions.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="space-y-4">
                        {teamCompetitions.map(competition => (
                          <Link 
                            key={competition.id} 
                            href={`/competitions/${competition.id}`}
                            className="block p-4 border border-gray-100 rounded-lg hover:border-primary-100 hover:bg-primary-50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{competition.title}</h3>
                                <div className="flex items-center text-sm text-gray-600 mt-2">
                                  <FaCalendarAlt className="mr-1 text-primary-500" />
                                  <span>
                                    {new Date(competition.startDate).toLocaleDateString('ru-RU')} - {new Date(competition.endDate).toLocaleDateString('ru-RU')}
                                  </span>
                                </div>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                competition.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                competition.status === 'active' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {competition.status === 'upcoming' ? 'Предстоит' :
                                competition.status === 'active' ? 'Активно' : 'Завершено'}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                    <p className="text-gray-500 text-center">Эта команда пока не участвует в соревнованиях.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Team members */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Участники</h2>
                  <span className="text-sm text-gray-500">{teamMembers.length}/{team.maxMembers || maxTeamSize}</span>
                </div>
                
                {teamMembers.length > 0 ? (
                  <div className="space-y-4">
                    {teamMembers.map(member => (
                      <div key={member.id} className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3 relative">
                          <Image
                            src={member.avatar || 'https://via.placeholder.com/40'}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">В команде пока нет участников.</p>
                )}
                
                {/* Pending requests - only visible to team owner/admin */}
                {(isTeamOwner || isAdmin()) && pendingRequests.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Заявки на вступление</h3>
                    <div className="space-y-4">
                      {pendingRequests.map(request => (
                        <div key={request.userId} className="border border-gray-100 rounded-lg p-3">
                          <p className="font-medium">{request.userName}</p>
                          <p className="text-xs text-gray-500 mb-3">
                            Запрос от {new Date(request.requestDate).toLocaleDateString('ru-RU')}
                          </p>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleApproveRequest(request.userId)}
                              className="flex-1 py-1 px-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm flex items-center justify-center"
                            >
                              <FaCheck className="mr-1" /> Принять
                            </button>
                            <button 
                              onClick={() => handleRejectRequest(request.userId)}
                              className="flex-1 py-1 px-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm flex items-center justify-center"
                            >
                              <FaTrash className="mr-1" /> Отклонить
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {showDeleteModal && <DeleteModal />}
    </div>
  )
} 