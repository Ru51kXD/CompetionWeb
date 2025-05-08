'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaClipboardList, FaUserPlus, FaTrophy, FaArrowLeft, FaEdit, FaPlus, FaInfoCircle } from 'react-icons/fa'
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
  const { isAdmin } = useAuth()

  useEffect(() => {
    const fetchCompetition = async () => {
      setLoading(true)
      try {
        // Get competitions from localStorage
        const storedCompetitions = localStorage.getItem('competitions')
        const storedTeams = localStorage.getItem('teams')
        
        if (storedCompetitions) {
          const allCompetitions = JSON.parse(storedCompetitions)
          
          // Find competition with matching id
          const competitionId = typeof id === 'string' ? parseInt(id, 10) : id
          const foundCompetition = allCompetitions.find(c => c.id === competitionId)
          
          if (foundCompetition) {
            setCompetition(foundCompetition)
            
            // Get participating teams if any
            if (storedTeams) {
              const teams = JSON.parse(storedTeams)
              setAllTeams(teams)
              
              // Filter participating teams
              if (foundCompetition.teams && foundCompetition.teams.length > 0) {
                const participatingTeams = teams.filter(team => 
                  foundCompetition.teams.includes(team.id)
                )
                setParticipatingTeams(participatingTeams)
              }
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

    if (id) {
      fetchCompetition()
    }
  }, [id])

  const handleAddTeam = () => {
    if (!selectedTeam) return
    
    const teamId = parseInt(selectedTeam, 10)
    const team = allTeams.find(t => t.id === teamId)
    
    if (team && competition) {
      // Update competition in localStorage
      try {
        const storedCompetitions = localStorage.getItem('competitions')
        if (storedCompetitions) {
          const competitions = JSON.parse(storedCompetitions)
          const competitionId = typeof id === 'string' ? parseInt(id, 10) : id
          const competitionIndex = competitions.findIndex(c => c.id === competitionId)
          
          if (competitionIndex !== -1) {
            // Add team to competition teams list
            const updatedTeams = [...(competitions[competitionIndex].teams || []), teamId]
            
            // Update competition
            competitions[competitionIndex] = {
              ...competitions[competitionIndex],
              teams: updatedTeams,
              participantCount: updatedTeams.length
            }
            
            // Save updated competitions back to localStorage
            localStorage.setItem('competitions', JSON.stringify(competitions))
            
            // Update local state
            setCompetition({
              ...competition,
              teams: updatedTeams,
              participantCount: updatedTeams.length
            })
            
            // Add team to local participating teams list
            setParticipatingTeams([...participatingTeams, team])
            
            // Update team competition count
            const storedTeams = localStorage.getItem('teams')
            if (storedTeams) {
              const teams = JSON.parse(storedTeams)
              const teamIndex = teams.findIndex(t => t.id === teamId)
              
              if (teamIndex !== -1) {
                teams[teamIndex] = {
                  ...teams[teamIndex],
                  competitionCount: (teams[teamIndex].competitionCount || 0) + 1
                }
                
                localStorage.setItem('teams', JSON.stringify(teams))
              }
            }

            // Show success message
            setRegisteredTeamName(team.name)
            setRegistrationSuccess(true)
            
            // Hide success message after 5 seconds
            setTimeout(() => {
              setRegistrationSuccess(false)
            }, 5000)
          }
        }
      } catch (error) {
        console.error('Ошибка при добавлении команды:', error)
      }
      
      // Reset selection
      setSelectedTeam('')
      setShowTeamSelection(false)
    }
  }

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch(status) {
      case 'upcoming':
        return { 
          label: 'Предстоит', 
          classes: 'bg-blue-100 text-blue-700' 
        }
      case 'active':
        return { 
          label: 'Активно', 
          classes: 'bg-green-100 text-green-700' 
        }
      case 'completed':
        return { 
          label: 'Завершено', 
          classes: 'bg-gray-100 text-gray-700' 
        }
      default:
        return { 
          label: 'Неизвестно', 
          classes: 'bg-gray-100 text-gray-700' 
        }
    }
  }

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

  if (error || !competition) {
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
              <h1 className="text-3xl font-bold mb-4">{error || 'Соревнование не найдено'}</h1>
              <p className="text-gray-600 mb-8">Возможно, соревнование было удалено или у вас нет доступа.</p>
              <Link href="/competitions" className="btn-primary inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Вернуться к списку соревнований
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const statusBadge = getStatusBadge(competition.status)

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
            <Link href="/competitions" className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <FaArrowLeft className="mr-2" /> Вернуться к списку соревнований
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden"
          >
            {/* Hero section with competition image */}
            <div className="relative h-64 md:h-80">
              <Image
                src={competition.image}
                alt={competition.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.classes}`}>
                  {statusBadge.label}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{competition.title}</h1>
                
                {/* Action buttons */}
                <div className="flex items-center gap-3 mt-4">
                  <button 
                    onClick={() => setShowTeamSelection(!showTeamSelection)}
                    className="btn-primary px-5 py-2.5 text-base shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <FaUserPlus className="mr-2" /> Зарегистрировать команду
                  </button>
                  {isAdmin() && (
                    <Link href={`/competitions/${id}/edit`} className="btn-white-outline">
                      <FaEdit className="mr-2" /> Редактировать
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            {/* Competition details */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-100 rounded-lg py-3 px-4">
                  <div className="flex items-center mb-1">
                    <FaCalendarAlt className="mr-2 text-primary-500" />
                    <span className="font-medium">Даты проведения</span>
                  </div>
                  <p className="ml-6 text-gray-600">
                    {formatDate(competition.startDate)} - {formatDate(competition.endDate)}
                  </p>
                </div>
                
                <div className="bg-gray-100 rounded-lg py-3 px-4">
                  <div className="flex items-center mb-1">
                    <FaMapMarkerAlt className="mr-2 text-primary-500" />
                    <span className="font-medium">Место проведения</span>
                  </div>
                  <p className="ml-6 text-gray-600">{competition.location}</p>
                </div>
                
                <div className="bg-gray-100 rounded-lg py-3 px-4">
                  <div className="flex items-center mb-1">
                    <FaUsers className="mr-2 text-primary-500" />
                    <span className="font-medium">Количество команд</span>
                  </div>
                  <p className="ml-6 text-gray-600">{competition.participantCount || 0}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">О соревновании</h2>
                <p className="text-gray-600 leading-relaxed">{competition.description}</p>
              </div>
              
              {competition.status !== 'completed' && (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                  <div className="flex items-center mb-2">
                    <FaInfoCircle className="mr-2" />
                    <h3 className="font-medium">Регистрация команд открыта</h3>
                  </div>
                  <p>Зарегистрируйте свою команду для участия в этом соревновании! Нажмите кнопку "Зарегистрировать команду" вверху страницы.</p>
                </div>
              )}
              
              {/* Participating Teams */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">Команды-участники</h2>
                  <button 
                    onClick={() => setShowTeamSelection(!showTeamSelection)}
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
                  >
                    <FaPlus className="mr-1" /> Добавить команду
                  </button>
                </div>
                
                {registrationSuccess && (
                  <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Команда "{registeredTeamName}" успешно зарегистрирована!
                  </div>
                )}
                
                {showTeamSelection && (
                  <div className="mb-4 bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-medium mb-3">Регистрация команды на соревнование</h3>
                    <p className="text-gray-600 mb-4">Выберите свою команду для участия в соревновании "{competition.title}"</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select 
                        className="input flex-grow"
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                      >
                        <option value="">Выберите команду</option>
                        {allTeams
                          .filter(team => !participatingTeams.some(pt => pt.id === team.id))
                          .map(team => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))
                        }
                      </select>
                      <button 
                        onClick={handleAddTeam}
                        className="btn-primary"
                        disabled={!selectedTeam}
                      >
                        Зарегистрировать команду
                      </button>
                      <button 
                        onClick={() => setShowTeamSelection(false)}
                        className="btn-outline"
                      >
                        Отмена
                      </button>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      Не нашли свою команду? <Link href="/teams/create" className="text-primary-600 hover:text-primary-800">Создайте новую команду</Link>
                    </div>
                  </div>
                )}
                
                {participatingTeams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {participatingTeams.map(team => (
                      <div key={team.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                        <div className="w-12 h-12 relative rounded-full overflow-hidden mr-4">
                          <Image 
                            src={team.image} 
                            alt={team.name} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{team.name}</h3>
                          <p className="text-sm text-gray-500">{team.memberCount} участников</p>
                        </div>
                        <Link 
                          href={`/teams/${team.id}`}
                          className="text-sm text-primary-600 hover:text-primary-800"
                        >
                          Подробнее
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                    В этом соревновании пока нет участвующих команд
                  </div>
                )}
              </div>
              
              {/* Results section */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Результаты</h2>
                {competition.status === 'completed' ? (
                  competition.results ? (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Место
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Команда
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Очки
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Результат
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {competition.results.map((result, index) => {
                            const team = allTeams.find(t => t.id === result.teamId);
                            let badgeClass = "";
                            
                            if (index === 0) badgeClass = "bg-amber-100 text-amber-800"; // Gold
                            else if (index === 1) badgeClass = "bg-gray-200 text-gray-800"; // Silver
                            else if (index === 2) badgeClass = "bg-amber-50 text-amber-700"; // Bronze
                            
                            return (
                              <tr key={result.teamId} className={index < 3 ? "bg-opacity-50" : ""}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${badgeClass}`}>
                                      {index + 1}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 relative">
                                      <Image
                                        src={team?.image || "https://via.placeholder.com/40"}
                                        alt=""
                                        fill
                                        className="rounded-full object-cover"
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {team?.name || "Команда"}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-medium">{result.points}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    index < 3 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                  }`}>
                                    {index < 3 ? "Призёр" : "Участник"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                      Результаты соревнования пока не опубликованы
                    </div>
                  )
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                    Результаты будут доступны после завершения соревнования
                  </div>
                )}
              </div>
              
              {/* Schedule section */}
              {competition.status !== 'completed' && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-3">Расписание</h2>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Дата
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Время
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Событие
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(competition.startDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            10:00
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Открытие соревнования
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(competition.startDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            11:00
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Начало первого этапа
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(competition.endDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            15:00
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Финальный этап
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(competition.endDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            17:00
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Награждение победителей
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 