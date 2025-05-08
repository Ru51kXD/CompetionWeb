'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaClipboardList, FaUserPlus, FaTrophy, FaArrowLeft, FaEdit, FaPlus, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

// Mock data for competitions (same as on the listing page)
const mockCompetitions = [
  {
    id: 1,
    title: 'Городской турнир по шахматам',
    description: 'Ежегодный турнир по шахматам среди любителей и профессионалов всех возрастов.',
    type: 'INTELLECTUAL' as const,
    startDate: new Date('2023-12-15'),
    endDate: new Date('2023-12-17'),
    location: 'Городской шахматный клуб',
    image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2071',
    rules: `
      1. Соревнования проводятся по правилам ФИДЕ.
      2. Контроль времени: 15 минут + 10 секунд на ход каждому участнику.
      3. Турнир проводится по швейцарской системе в 9 туров.
      4. Определение победителей по наибольшему количеству набранных очков.
      5. При равенстве очков места определяются по дополнительным показателям.
    `,
    organizer: 'Городская федерация шахмат',
    contactEmail: 'chess@example.com',
    contactPhone: '+7 (123) 456-78-90',
    participants: 32,
    maxParticipants: 64
  },
  {
    id: 2,
    title: 'Межшкольные соревнования по футболу',
    description: 'Футбольные матчи между командами школ города. Присоединяйтесь к спортивному празднику!',
    type: 'SPORTS' as const,
    startDate: new Date('2023-12-20'),
    endDate: new Date('2023-12-25'),
    location: 'Центральный стадион',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2034',
    rules: `
      1. Матчи проводятся по правилам FIFA с адаптацией для школьных команд.
      2. Состав команды: 11 основных игроков + 5 запасных.
      3. Продолжительность матча: 2 тайма по 35 минут с 15-минутным перерывом.
      4. Групповой этап, затем плей-офф для определения победителя.
      5. В случае ничьей в плей-офф - серия пенальти.
    `,
    organizer: 'Городской департамент образования',
    contactEmail: 'school-sports@example.com',
    contactPhone: '+7 (123) 456-78-91',
    participants: 16,
    maxParticipants: 16
  },
  {
    id: 3,
    title: 'Конкурс молодых художников',
    description: 'Открытый конкурс для художников до 25 лет. Покажите свой талант и выиграйте ценные призы!',
    type: 'CREATIVE' as const,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-20'),
    location: 'Городская галерея искусств',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071',
    rules: `
      1. К участию приглашаются художники в возрасте до 25 лет.
      2. Работы принимаются в следующих категориях: живопись, графика, скульптура, цифровое искусство.
      3. Каждый участник может представить не более 3 работ.
      4. Работы должны быть созданы не ранее чем за 1 год до даты конкурса.
      5. Жюри оценивает оригинальность, технику исполнения и художественную ценность.
    `,
    organizer: 'Городская галерея искусств',
    contactEmail: 'art-contest@example.com',
    contactPhone: '+7 (123) 456-78-92',
    participants: 45,
    maxParticipants: 100
  },
  {
    id: 4,
    title: 'Турнир по настольному теннису',
    description: 'Открытый турнир по настольному теннису для спортсменов всех уровней подготовки.',
    type: 'SPORTS' as const,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-16'),
    location: 'Спортивный комплекс "Динамо"',
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=2099',
    rules: `
      1. Соревнования проводятся в соответствии с правилами ITTF.
      2. Проводятся личные и парные соревнования.
      3. Матчи проводятся до 3 побед в 5 сетах.
      4. Система проведения: групповой этап, затем плей-офф.
      5. Участники должны иметь собственные ракетки.
    `,
    organizer: 'Спортивный комплекс "Динамо"',
    contactEmail: 'pingpong@example.com',
    contactPhone: '+7 (123) 456-78-93',
    participants: 28,
    maxParticipants: 64
  },
  {
    id: 5,
    title: 'Олимпиада по программированию',
    description: 'Ежегодная олимпиада по программированию для школьников и студентов.',
    type: 'INTELLECTUAL' as const,
    startDate: new Date('2024-02-05'),
    endDate: new Date('2024-02-07'),
    location: 'Технический университет',
    image: 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?q=80&w=2076',
    rules: `
      1. К участию приглашаются школьники старших классов и студенты.
      2. Участники могут использовать языки программирования: C++, Java, Python.
      3. Олимпиада проводится в два тура по 4 часа каждый.
      4. Задачи оцениваются по времени и корректности решения.
      5. Запрещается использование интернета и внешних источников информации.
    `,
    organizer: 'Технический университет',
    contactEmail: 'coding-olympiad@example.com',
    contactPhone: '+7 (123) 456-78-94',
    participants: 120,
    maxParticipants: 200
  },
  {
    id: 6,
    title: 'Фестиваль современного танца',
    description: 'Конкурс танцевальных коллективов разных стилей и направлений.',
    type: 'CREATIVE' as const,
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-02-25'),
    location: 'Городской дворец культуры',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069',
    rules: `
      1. К участию приглашаются как индивидуальные танцоры, так и коллективы.
      2. Возрастные категории: дети (7-12), юниоры (13-17), взрослые (18+).
      3. Номинации: современный танец, хип-хоп, брейк-данс, уличные танцы, экспериментальные формы.
      4. Выступление должно длиться от 3 до 5 минут.
      5. Оценивается техника, артистизм, хореография и оригинальность.
    `,
    organizer: 'Городской дворец культуры',
    contactEmail: 'dance-fest@example.com',
    contactPhone: '+7 (123) 456-78-95',
    participants: 80,
    maxParticipants: 150
  }
]

// Format date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Format time
const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function CompetitionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  const [competition, setCompetition] = useState(null)
  const [participatingTeams, setParticipatingTeams] = useState([])
  const [allTeams, setAllTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTeamSelection, setShowTeamSelection] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registeredTeamName, setRegisteredTeamName] = useState('')
  const [userTeams, setUserTeams] = useState([])
  const [teamSizeError, setTeamSizeError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [registeredParticipants, setRegisteredParticipants] = useState([])
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    const fetchCompetition = async () => {
      setLoading(true)
      try {
        // Get competitions from localStorage
        const storedCompetitions = localStorage.getItem('competitions')
        const storedTeams = localStorage.getItem('teams')
        const storedUsers = localStorage.getItem('users')
        
        if (storedCompetitions) {
          const allCompetitions = JSON.parse(storedCompetitions)
          
          // Find competition with matching id
          const competitionId = typeof id === 'string' ? parseInt(id, 10) : id
          const foundCompetition = allCompetitions.find(c => c.id === competitionId)
          
          if (foundCompetition) {
            // Ensure maxTeams and maxTeamSize are set
            if (!foundCompetition.maxTeams) {
              foundCompetition.maxTeams = 10; // Default value
            }
            
            if (!foundCompetition.maxTeamSize) {
              foundCompetition.maxTeamSize = 10; // Default value
            }
            
            setCompetition(foundCompetition)
            
            // Get participating teams if any
            if (storedTeams) {
              const teams = JSON.parse(storedTeams)
              setAllTeams(teams)
              
              // Get teams that are participating in this competition
              if (foundCompetition.teams && foundCompetition.teams.length > 0) {
                const teamsInCompetition = teams.filter(team => 
                  foundCompetition.teams.includes(team.id)
                )
                setParticipatingTeams(teamsInCompetition)
              }
              
              // Get teams that the current user is a member of or owns
              if (user) {
                const userTeams = teams.filter(team => 
                  team.members && team.members.some(member => member.id === user.id) ||
                  team.ownerId === user.id
                )
                setUserTeams(userTeams)
              }
            }
            
            // Загружаем данные об участниках для индивидуальных соревнований
            if (storedUsers && foundCompetition.participants && foundCompetition.participants.length > 0) {
              const users = JSON.parse(storedUsers)
              const participants = users.filter(user => 
                foundCompetition.participants.includes(user.id)
              )
              setRegisteredParticipants(participants)
            }
          } else {
            setError('Соревнование не найдено')
          }
        } else {
          setError('Соревнования не найдены')
        }
      } catch (err) {
        console.error('Ошибка при загрузке соревнования:', err)
        setError('Ошибка при загрузке данных соревнования')
      } finally {
        setLoading(false)
      }
    }

    fetchCompetition()
  }, [id, user])

  const handleAddTeam = () => {
    if (!selectedTeam) return
    
    setIsRegistering(true)
    setTeamSizeError('')
    
    try {
      // Get all competitions and teams from localStorage
      const storedCompetitions = localStorage.getItem('competitions')
      const storedTeams = localStorage.getItem('teams')
      
      if (storedCompetitions && storedTeams) {
        const competitions = JSON.parse(storedCompetitions)
        const teams = JSON.parse(storedTeams)
        
        // Find competition to update
        const competitionId = typeof id === 'string' ? parseInt(id, 10) : id
        const competitionIndex = competitions.findIndex(c => c.id === competitionId)
        
        // Find selected team
        const teamId = parseInt(selectedTeam, 10)
        const team = teams.find(t => t.id === teamId)
        
        if (competitionIndex !== -1 && team) {
          // Check if the competition has reached max teams
          if (competitions[competitionIndex].teams && 
              competitions[competitionIndex].teams.length >= competitions[competitionIndex].maxTeams) {
            setTeamSizeError(`Достигнут лимит команд (${competitions[competitionIndex].maxTeams}) для этого соревнования`)
            setIsRegistering(false)
            return
          }
          
          // Check if the team meets the size requirements
          if (team.members && team.members.length > competitions[competitionIndex].maxTeamSize) {
            setTeamSizeError(`В команде слишком много участников. Максимально допустимый размер команды: ${competitions[competitionIndex].maxTeamSize}`)
            setIsRegistering(false)
            return
          }
          
          // Check if the team is already registered
          if (competitions[competitionIndex].teams && 
              competitions[competitionIndex].teams.includes(teamId)) {
            setTeamSizeError('Эта команда уже зарегистрирована в соревновании')
            setIsRegistering(false)
            return
          }
          
          // Add team to competition
          if (!competitions[competitionIndex].teams) {
            competitions[competitionIndex].teams = []
          }
          
          competitions[competitionIndex].teams.push(teamId)
          competitions[competitionIndex].participantCount = competitions[competitionIndex].teams.length
          
          // Update competition in localStorage
          localStorage.setItem('competitions', JSON.stringify(competitions))
          
          // Update team's competition count
          const teamIndex = teams.findIndex(t => t.id === teamId)
          if (teamIndex !== -1) {
            teams[teamIndex] = {
              ...teams[teamIndex],
              competitionCount: (teams[teamIndex].competitionCount || 0) + 1
            }
            
            // Save team back to localStorage
            localStorage.setItem('teams', JSON.stringify(teams))
          }
          
          // Update state
          setCompetition(competitions[competitionIndex])
          setParticipatingTeams([...participatingTeams, team])
          setRegistrationSuccess(true)
          setRegisteredTeamName(team.name)
          setShowTeamSelection(false)
          
          setTimeout(() => {
            setRegistrationSuccess(false)
            setIsRegistering(false)
          }, 3000)
        }
      }
    } catch (error) {
      console.error('Ошибка при регистрации команды:', error)
      setIsRegistering(false)
    }
  }

  const handleIndividualRegistration = () => {
    if (!user || !competition) return;

    setIsRegistering(true);
    setError('');

    try {
      // Получаем соревнования из localStorage
      const storedCompetitions = localStorage.getItem('competitions');
      const storedUsers = localStorage.getItem('users');
      
      if (storedCompetitions && storedUsers) {
        const competitions = JSON.parse(storedCompetitions);
        const users = JSON.parse(storedUsers);
        
        const competitionId = typeof id === 'string' ? parseInt(id, 10) : id;
        const competitionIndex = competitions.findIndex(c => c.id === competitionId);

        if (competitionIndex !== -1) {
          // Проверяем, не зарегистрирован ли уже пользователь
          if (!competitions[competitionIndex].participants) {
            competitions[competitionIndex].participants = [];
          }
          
          if (competitions[competitionIndex].participants.includes(user.id)) {
            setError('Вы уже зарегистрированы на это соревнование');
            setIsRegistering(false);
            return;
          }
          
          // Добавляем пользователя
          competitions[competitionIndex].participants.push(user.id);
          competitions[competitionIndex].participantCount = competitions[competitionIndex].participants.length;
          localStorage.setItem('competitions', JSON.stringify(competitions));
          
          // Обновляем список участников
          const currentUser = users.find(u => u.id === user.id);
          if (currentUser) {
            setRegisteredParticipants([...registeredParticipants, currentUser]);
          }
          
          setRegistrationSuccess(true);
        }
      }
    } catch (err) {
      setError('Ошибка при регистрации');
    } finally {
      setIsRegistering(false);
    }
  };

  const getStatusBadge = (status) => {
    let bgColor, textColor, label
    
    switch(status) {
      case 'upcoming':
        bgColor = 'bg-blue-100'
        textColor = 'text-blue-700'
        label = 'Предстоит'
        break
      case 'active':
        bgColor = 'bg-green-100'
        textColor = 'text-green-700'
        label = 'Активно'
        break
      case 'completed':
        bgColor = 'bg-gray-100'
        textColor = 'text-gray-700'
        label = 'Завершено'
        break
      default:
        bgColor = 'bg-gray-100'
        textColor = 'text-gray-700'
        label = 'Неизвестно'
    }
    
    return (
      <div className={`${bgColor} ${textColor} inline-flex items-center px-3 py-1 rounded-full text-sm font-medium`}>
        {label}
      </div>
    )
  }

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
            <Link href="/competitions" className="btn-primary">
              Вернуться к списку соревнований
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!competition) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/competitions" className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <FaArrowLeft className="mr-2" /> Вернуться к списку соревнований
            </Link>
          </div>
          
          {registrationSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-md p-4 flex items-center">
              <FaCheckCircle className="mr-2" />
              <p>Команда "{registeredTeamName}" успешно зарегистрирована на соревнование!</p>
            </div>
          )}
          
          {teamSizeError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-md p-4 flex items-center">
              <FaTimesCircle className="mr-2" />
              <p>{teamSizeError}</p>
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Hero section with image */}
            <div className="relative h-64 md:h-96">
              <Image 
                src={competition.image || 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2070'}
                alt={competition.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="mb-2">
                  {getStatusBadge(competition.status)}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{competition.title}</h1>
                <div className="flex flex-wrap gap-4 text-white mt-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <span>
                      {new Date(competition.startDate).toLocaleDateString('ru-RU')} - {new Date(competition.endDate).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{competition.location}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Competition details */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">О соревновании</h2>
                    <p className="text-gray-700 whitespace-pre-line">{competition.description}</p>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Правила</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="whitespace-pre-line font-sans text-gray-700">{competition.rules || 'Правила не указаны'}</pre>
                    </div>
                  </div>
                  
                  {isAdmin() && (
                    <div className="mb-8">
                      <Link 
                        href={`/competitions/${id}/edit`}
                        className="btn-primary inline-flex items-center"
                      >
                        <FaEdit className="mr-2" /> Редактировать соревнование
                      </Link>
                    </div>
                  )}
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <FaInfoCircle className="mr-2 text-primary-600" /> Информация
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-gray-600 font-medium mr-2">Организатор:</span>
                        <span>{competition.organizer || 'Не указан'}</span>
                      </li>
                      {competition.contactEmail && (
                        <li className="flex items-start">
                          <span className="text-gray-600 font-medium mr-2">Email:</span>
                          <a href={`mailto:${competition.contactEmail}`} className="text-primary-600 hover:underline">{competition.contactEmail}</a>
                        </li>
                      )}
                      {competition.contactPhone && (
                        <li className="flex items-start">
                          <span className="text-gray-600 font-medium mr-2">Телефон:</span>
                          <a href={`tel:${competition.contactPhone}`} className="text-primary-600 hover:underline">{competition.contactPhone}</a>
                        </li>
                      )}
                      <li className="flex items-start">
                        <span className="text-gray-600 font-medium mr-2">Участники:</span>
                        <span>{competition.participantCount || 0} команд из {competition.maxTeams}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-600 font-medium mr-2">Размер команды:</span>
                        <span>до {competition.maxTeamSize} человек</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* --- Блок для командных соревнований --- */}
                  {competition.competitionType === 'team' && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <FaUsers className="mr-2 text-primary-600" /> Команды-участники
                      </h3>
                      {participatingTeams.length > 0 ? (
                        <div className="space-y-3">
                          {participatingTeams.map(team => (
                            <Link 
                              key={team.id} 
                              href={`/teams/${team.id}`}
                              className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                            >
                              <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                                {team.image ? (
                                  <Image 
                                    src={team.image} 
                                    alt={team.name} 
                                    fill 
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                                    <FaUsers />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">{team.name}</h4>
                                <p className="text-sm text-gray-500">{team.memberCount || (team.members ? team.members.length : 0)} участников</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-center py-4 bg-gray-50 rounded-lg">
                          Пока нет зарегистрированных команд
                        </p>
                      )}
                      {competition.status !== 'completed' && !showTeamSelection && (
                        <button 
                          onClick={() => {
                            if (!user) {
                              router.push('/login')
                              return
                            }
                            setShowTeamSelection(true)
                          }}
                          className="mt-4 w-full btn-primary flex items-center justify-center"
                          disabled={participatingTeams.length >= competition.maxTeams}
                        >
                          {participatingTeams.length >= competition.maxTeams ? (
                            <>
                              <FaInfoCircle className="mr-2" /> Достигнут лимит команд
                            </>
                          ) : (
                            <>
                              <FaUserPlus className="mr-2" /> Зарегистрировать команду
                            </>
                          )}
                        </button>
                      )}
                      {showTeamSelection && (
                        <div className="mt-4 border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium mb-3">Выберите команду для регистрации:</h4>
                          {userTeams.length > 0 ? (
                            <>
                              <select
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                                className="input mb-3 w-full"
                              >
                                <option value="">-- Выберите команду --</option>
                                {userTeams
                                  .filter(team => !participatingTeams.some(pt => pt.id === team.id))
                                  .map(team => (
                                    <option key={team.id} value={team.id}>
                                      {team.name} ({team.memberCount || (team.members ? team.members.length : 0)} участников)
                                    </option>
                                  ))
                                }
                              </select>
                              <div className="flex gap-2">
                                <button 
                                  onClick={handleAddTeam}
                                  disabled={!selectedTeam || isRegistering}
                                  className="btn-primary flex-1 flex items-center justify-center"
                                >
                                  {isRegistering ? (
                                    <>
                                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Регистрация...
                                    </>
                                  ) : (
                                    <>
                                      <FaUserPlus className="mr-2" /> Зарегистрировать
                                    </>
                                  )}
                                </button>
                                <button 
                                  onClick={() => setShowTeamSelection(false)}
                                  className="btn-outline flex-1"
                                >
                                  Отмена
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-3">
                              <p className="text-gray-600 mb-3">У вас нет команд, которые могли бы участвовать</p>
                              <Link href="/teams/create" className="btn-primary inline-flex items-center">
                                <FaPlus className="mr-2" /> Создать команду
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- Блок для индивидуальных соревнований --- */}
                  {competition.competitionType === 'individual' && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <FaUserPlus className="mr-2 text-primary-600" /> Индивидуальное участие
                      </h3>
                      
                      {/* Список участников */}
                      <div className="mb-4">
                        <h4 className="font-medium mb-3">Участники соревнования:</h4>
                        {registeredParticipants.length > 0 ? (
                          <div className="space-y-3">
                            {registeredParticipants.map(participant => (
                              <div 
                                key={participant.id} 
                                className="flex items-center p-3 border border-gray-200 rounded-lg"
                              >
                                <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                                  {participant.avatar ? (
                                    <Image 
                                      src={participant.avatar} 
                                      alt={participant.name} 
                                      fill 
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                      <FaUserPlus />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium">{participant.name}</h4>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600 text-center py-4 bg-gray-50 rounded-lg">
                            Пока нет зарегистрированных участников
                          </p>
                        )}
                      </div>
                      
                      {/* Кнопка регистрации */}
                      {!user ? (
                        <div className="text-center">
                          <p className="text-gray-600 mb-4">Для участия необходимо войти в систему</p>
                          <Link href="/login" className="btn-primary inline-flex items-center">
                            <FaUserPlus className="mr-2" /> Войти
                          </Link>
                        </div>
                      ) : registrationSuccess ? (
                        <div className="text-center text-green-600">
                          <FaCheckCircle className="mx-auto text-4xl mb-2" />
                          <p className="font-semibold">Вы успешно зарегистрированы!</p>
                        </div>
                      ) : (
                        <button
                          onClick={handleIndividualRegistration}
                          disabled={isRegistering}
                          className="w-full btn-primary flex items-center justify-center"
                        >
                          {isRegistering ? 'Регистрация...' : 'Зарегистрироваться'}
                        </button>
                      )}
                      {error && <p className="text-red-600 text-center mt-2">{error}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 