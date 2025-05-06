'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaClipboardList, FaUserPlus } from 'react-icons/fa'

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

export default function CompetitionDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const [competition, setCompetition] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState('about')

  useEffect(() => {
    // Find competition by ID
    const found = mockCompetitions.find(comp => comp.id === id)
    if (found) {
      setCompetition(found)
    }
    setIsLoaded(true)
  }, [id])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    )
  }

  if (!competition) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Соревнование не найдено</h1>
            <p className="text-xl text-gray-600 mb-8">
              Запрашиваемое соревнование не существует или было удалено.
            </p>
            <Link href="/competitions" className="btn-primary">
              Вернуться к списку соревнований
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const typeLabels = {
    'SPORTS': 'Спортивное',
    'INTELLECTUAL': 'Интеллектуальное',
    'CREATIVE': 'Творческое'
  }

  const typeColors = {
    'SPORTS': 'bg-primary-100 text-primary-800',
    'INTELLECTUAL': 'bg-secondary-100 text-secondary-800',
    'CREATIVE': 'bg-accent-100 text-accent-800'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        {/* Hero Section with Image */}
        <div className="relative h-96 w-full">
          <Image
            src={competition.image}
            alt={competition.title}
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full mb-4 ${typeColors[competition.type]}`}>
                  {typeLabels[competition.type]}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{competition.title}</h1>
                <div className="flex flex-wrap gap-6 text-white text-sm md:text-base">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-primary-400" />
                    <span>{formatDate(competition.startDate)} - {formatDate(competition.endDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-primary-400" />
                    <span>{formatTime(competition.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-primary-400" />
                    <span>{competition.location}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="mr-2 text-primary-400" />
                    <span>{competition.participants} / {competition.maxParticipants} участников</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-2/3"
            >
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('about')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'about' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    О соревновании
                  </button>
                  <button
                    onClick={() => setActiveTab('rules')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'rules' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    Правила
                  </button>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'contact' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    Контакты
                  </button>
                </nav>
              </div>
              
              {/* Tab Content */}
              <div className="prose max-w-none">
                {activeTab === 'about' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Описание</h2>
                    <p className="text-lg mb-6">{competition.description}</p>
                    
                    <h3 className="text-xl font-bold mb-3">Организатор</h3>
                    <p className="mb-6">{competition.organizer}</p>
                    
                    <h3 className="text-xl font-bold mb-3">Детали проведения</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="font-semibold w-48">Дата начала:</span>
                        <span>{formatDate(competition.startDate)}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold w-48">Дата окончания:</span>
                        <span>{formatDate(competition.endDate)}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold w-48">Время начала:</span>
                        <span>{formatTime(competition.startDate)}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold w-48">Место проведения:</span>
                        <span>{competition.location}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold w-48">Тип соревнования:</span>
                        <span>{typeLabels[competition.type]}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold w-48">Количество участников:</span>
                        <span>{competition.participants} из {competition.maxParticipants}</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {activeTab === 'rules' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Правила соревнования</h2>
                    <div className="whitespace-pre-line text-lg">
                      {competition.rules}
                    </div>
                  </div>
                )}
                
                {activeTab === 'contact' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Контактная информация</h2>
                    <p className="text-lg mb-6">По всем вопросам, связанным с соревнованием, обращайтесь:</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <span className="font-semibold w-48">Организатор:</span>
                        <span>{competition.organizer}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-semibold w-48">Email:</span>
                        <a href={`mailto:${competition.contactEmail}`} className="text-primary-600 hover:text-primary-800">
                          {competition.contactEmail}
                        </a>
                      </div>
                      <div className="flex items-start">
                        <span className="font-semibold w-48">Телефон:</span>
                        <a href={`tel:${competition.contactPhone}`} className="text-primary-600 hover:text-primary-800">
                          {competition.contactPhone}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:w-1/3"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6">Управление участием</h3>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Занято мест:</span>
                    <span className="font-semibold">{competition.participants} / {competition.maxParticipants}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-600" 
                      style={{ width: `${(competition.participants / competition.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <button className="btn-primary w-full mb-4 flex items-center justify-center">
                  <FaUserPlus className="mr-2" />
                  Подать заявку на участие
                </button>
                
                <button className="btn-outline w-full flex items-center justify-center">
                  <FaClipboardList className="mr-2" />
                  Скачать правила
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h3 className="text-xl font-bold mb-4">Поделиться</h3>
                <div className="flex space-x-4">
                  <button className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                  <button className="p-3 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </button>
                  <button className="p-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                  <button className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13.5h-1v6h1V15h2v-1h-2V6.5z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 