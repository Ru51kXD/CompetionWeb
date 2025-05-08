'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaUsers, FaTrophy, FaArrowLeft, FaEdit, FaTrash, FaPlus, FaUser, FaCalendarAlt } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function TeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Иван Иванов', role: 'Капитан', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Анна Петрова', role: 'Участник', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  ])
  const [userIsMember, setUserIsMember] = useState(false)
  const [teamCompetitions, setTeamCompetitions] = useState([])
  const { isAdmin } = useAuth()

  useEffect(() => {
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
            setTeam(foundTeam)
            // Simulate checking if current user is a member
            setUserIsMember(Math.random() > 0.5)
            
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
  }, [id])

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

  const handleJoinTeam = () => {
    if (team) {
      try {
        // Get current teams from localStorage
        const storedTeams = localStorage.getItem('teams')
        if (storedTeams) {
          const teams = JSON.parse(storedTeams)
          const teamId = typeof id === 'string' ? parseInt(id, 10) : id
          const teamIndex = teams.findIndex((t) => t.id === teamId)
          
          if (teamIndex !== -1) {
            // Update team member count
            teams[teamIndex] = {
              ...teams[teamIndex],
              memberCount: teams[teamIndex].memberCount + 1
            }
            
            // Save updated teams back to localStorage
            localStorage.setItem('teams', JSON.stringify(teams))
            
            // Update local state
            setTeam({
              ...team,
              memberCount: team.memberCount + 1
            })
            
            // Add a fake member to the team members list
            setTeamMembers([
              ...teamMembers,
              { 
                id: Date.now(), 
                name: 'Новый участник', 
                role: 'Участник', 
                avatar: 'https://randomuser.me/api/portraits/men/22.jpg' 
              }
            ])
            
            // Set user as a member
            setUserIsMember(true)
          }
        }
      } catch (error) {
        console.error('Ошибка при присоединении к команде:', error)
      }
    }
  }

  const handleLeaveTeam = () => {
    if (team) {
      try {
        // Get current teams from localStorage
        const storedTeams = localStorage.getItem('teams')
        if (storedTeams) {
          const teams = JSON.parse(storedTeams)
          const teamId = typeof id === 'string' ? parseInt(id, 10) : id
          const teamIndex = teams.findIndex((t) => t.id === teamId)
          
          if (teamIndex !== -1 && teams[teamIndex].memberCount > 0) {
            // Update team member count
            teams[teamIndex] = {
              ...teams[teamIndex],
              memberCount: teams[teamIndex].memberCount - 1
            }
            
            // Save updated teams back to localStorage
            localStorage.setItem('teams', JSON.stringify(teams))
            
            // Update local state
            setTeam({
              ...team,
              memberCount: team.memberCount - 1
            })
            
            // Remove the last member from the team members list
            setTeamMembers(teamMembers.slice(0, -1))
            
            // Set user as not a member
            setUserIsMember(false)
          }
        }
      } catch (error) {
        console.error('Ошибка при выходе из команды:', error)
      }
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
          Вы уверены, что хотите удалить команду "{team?.name}"? Это действие нельзя отменить.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDelete}
            className="btn-danger flex-1 flex items-center justify-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Удаление...
              </>
            ) : (
              <>
                <FaTrash className="mr-2" /> Удалить
              </>
            )}
          </button>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="btn-outline flex-1"
            disabled={isDeleting}
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
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-4">{error || 'Команда не найдена'}</h1>
              <p className="text-gray-600 mb-8">Возможно, команда была удалена или у вас нет доступа.</p>
              <Link href="/teams" className="btn-primary inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Вернуться к списку команд
              </Link>
            </motion.div>
          </div>
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link href="/teams" className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <FaArrowLeft className="mr-2" /> Вернуться к списку команд
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden"
          >
            {/* Hero section with team image */}
            <div className="relative h-64 md:h-80">
              <Image
                src={team.image}
                alt={team.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{team.name}</h1>
                
                {/* Action buttons */}
                <div className="flex items-center gap-3 mt-4">
                  {isAdmin() && (
                    <>
                      <Link href={`/teams/${id}/edit`} className="btn-white-outline">
                        <FaEdit className="mr-2" /> Редактировать
                      </Link>
                      <button onClick={() => setShowDeleteModal(true)} className="btn-danger-outline">
                        <FaTrash className="mr-2" /> Удалить
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Team details */}
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-gray-100 rounded-lg py-2 px-4 flex items-center">
                  <FaUsers className="mr-2 text-primary-500" />
                  <span>{team.memberCount} участников</span>
                </div>
                <div className="bg-gray-100 rounded-lg py-2 px-4 flex items-center">
                  <FaTrophy className="mr-2 text-primary-500" />
                  <span>{team.competitionCount} соревнований</span>
                </div>
                
                {/* Join/Leave team buttons */}
                {userIsMember ? (
                  <button 
                    onClick={handleLeaveTeam} 
                    className="bg-red-100 text-red-600 hover:bg-red-200 rounded-lg py-2 px-4 flex items-center transition-colors"
                  >
                    <FaUser className="mr-2" />
                    <span>Покинуть команду</span>
                  </button>
                ) : (
                  <button 
                    onClick={handleJoinTeam} 
                    className="bg-green-100 text-green-600 hover:bg-green-200 rounded-lg py-2 px-4 flex items-center transition-colors"
                  >
                    <FaPlus className="mr-2" />
                    <span>Присоединиться</span>
                  </button>
                )}
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">О команде</h2>
                <p className="text-gray-600 leading-relaxed">{team.description}</p>
              </div>
              
              {/* Team members */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Участники</h2>
                {teamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamMembers.map(member => (
                      <div key={member.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                        <div className="w-12 h-12 relative rounded-full overflow-hidden mr-4">
                          <Image 
                            src={member.avatar} 
                            alt={member.name} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                    В этой команде пока нет участников
                  </div>
                )}
              </div>
              
              {/* Competitions */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Соревнования</h2>
                {teamCompetitions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {teamCompetitions.map(competition => (
                      <div key={competition.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="h-36 relative">
                          <Image 
                            src={competition.image} 
                            alt={competition.title} 
                            fill 
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="text-white font-medium">{competition.title}</h3>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="text-sm text-gray-500 mb-3">
                            <FaCalendarAlt className="inline-block mr-1" /> 
                            {new Date(competition.startDate).toLocaleDateString('ru-RU')} - {new Date(competition.endDate).toLocaleDateString('ru-RU')}
                          </div>
                          <Link 
                            href={`/competitions/${competition.id}`} 
                            className="btn-primary-small block text-center"
                          >
                            Подробнее
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 mb-4">
                    Команда пока не участвует в соревнованиях
                  </div>
                )}
                <div className="mt-4">
                  <Link 
                    href="/competitions" 
                    className="btn-primary inline-flex items-center"
                  >
                    <FaTrophy className="mr-2" /> Найти соревнования
                  </Link>
                  <Link 
                    href="/competitions/create" 
                    className="btn-outline inline-flex items-center ml-3"
                  >
                    <FaPlus className="mr-2" /> Создать соревнование
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      {showDeleteModal && <DeleteModal />}
      
      <Footer />
    </div>
  )
} 