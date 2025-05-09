'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaUsers, FaTrophy, FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaFilter, FaPlusCircle, FaMedal, FaChevronRight, FaChess, FaUser, FaTicketAlt, FaSearchMinus } from 'react-icons/fa'

// Mock data for competitions
const mockCompetitions = [
  {
    id: 1,
    title: 'Городской турнир по шахматам',
    description: 'Ежегодный шахматный турнир для команд всех уровней',
    startDate: '2023-06-15',
    endDate: '2023-06-18',
    location: 'Городской Дворец Спорта',
    participantCount: 8,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?q=80&w=2070',
    teams: [1, 2, 3, 4, 5, 6, 7, 8], // Команды, участвующие в соревновании
    competitionType: 'team',
    sportType: 'chess',
    type: 'Интеллектуальные',
  },
  {
    id: 2,
    title: 'Межшкольный футбольный чемпионат',
    description: 'Соревнования между школами города по футболу',
    startDate: '2023-05-10',
    endDate: '2023-05-30',
    location: 'Стадион "Юность"',
    participantCount: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2023',
    teams: [1, 3, 5, 6],
    competitionType: 'team',
    sportType: 'football',
    type: 'Спортивные',
  },
  {
    id: 3,
    title: 'Интеллектуальная олимпиада "Эрудит"',
    description: 'Командные соревнования на знание различных наук и искусств',
    startDate: '2023-07-05',
    endDate: '2023-07-07',
    location: 'Центральная библиотека',
    participantCount: 15,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2070',
    teams: [2, 4, 5],
    competitionType: 'team',
    sportType: 'intellectual',
    type: 'Интеллектуальные',
  },
  {
    id: 4,
    title: 'Городской турнир по плаванию',
    description: 'Соревнования по плаванию среди молодежных команд',
    startDate: '2023-04-12',
    endDate: '2023-04-14',
    location: 'Бассейн "Дельфин"',
    participantCount: 10,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?q=80&w=2012',
    teams: [1, 2, 3, 4, 5, 6],
    results: [
      { teamId: 2, points: 98, position: 1 },
      { teamId: 5, points: 87, position: 2 },
      { teamId: 1, points: 82, position: 3 },
      { teamId: 6, points: 75, position: 4 },
      { teamId: 3, points: 70, position: 5 },
      { teamId: 4, points: 65, position: 6 }
    ],
    competitionType: 'team',
    sportType: 'swimming',
    type: 'Спортивные',
  },
  {
    id: 5,
    title: 'Чемпионат по боулингу',
    description: 'Ежегодный чемпионат по боулингу среди любительских команд',
    startDate: '2023-03-05',
    endDate: '2023-03-07',
    location: 'Боулинг-центр "Страйк"',
    participantCount: 8,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?q=80&w=2070',
    teams: [1, 3, 5, 6, 2, 4],
    results: [
      { teamId: 3, points: 256, position: 1 },
      { teamId: 1, points: 240, position: 2 },
      { teamId: 2, points: 225, position: 3 },
      { teamId: 6, points: 210, position: 4 },
      { teamId: 5, points: 195, position: 5 },
      { teamId: 4, points: 180, position: 6 }
    ],
    competitionType: 'team',
    sportType: 'bowling',
    type: 'Спортивные',
  },
  {
    id: 6,
    title: 'Турнир по мини-футболу',
    description: 'Открытый турнир по мини-футболу среди студенческих команд',
    startDate: '2023-02-10',
    endDate: '2023-02-12',
    location: 'Спортивный комплекс "Энергия"',
    participantCount: 12,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2070',
    teams: [1, 2, 3, 4, 5, 6],
    results: [
      { teamId: 1, points: 15, position: 1 },
      { teamId: 6, points: 12, position: 2 },
      { teamId: 4, points: 9, position: 3 },
      { teamId: 3, points: 6, position: 4 },
      { teamId: 5, points: 3, position: 5 },
      { teamId: 2, points: 0, position: 6 }
    ],
    competitionType: 'team',
    sportType: 'football',
    type: 'Спортивные',
  },
  // Новые творческие соревнования
  {
    id: 7,
    title: 'Фестиваль современного танца',
    description: 'Творческий конкурс среди танцевальных коллективов',
    startDate: '2023-08-10',
    endDate: '2023-08-12',
    location: 'Дом культуры',
    participantCount: 10,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2070',
    teams: [4, 14, 17, 20],
    competitionType: 'team',
    sportType: 'dance',
    type: 'Творческие',
  },
  {
    id: 8,
    title: 'Конкурс художественного рисунка',
    description: 'Творческий конкурс для юных художников',
    startDate: '2023-09-01',
    endDate: '2023-09-03',
    location: 'Галерея искусств',
    participantCount: 15,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=2070',
    teams: [6, 17, 20],
    competitionType: 'team',
    sportType: 'art',
    type: 'Творческие',
  },
  {
    id: 9,
    title: 'Музыкальный фестиваль "Звуки города"',
    description: 'Фестиваль для музыкальных коллективов и сольных исполнителей',
    startDate: '2023-10-15',
    endDate: '2023-10-17',
    location: 'Концертный зал',
    participantCount: 20,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?q=80&w=2070',
    teams: [17, 20],
    competitionType: 'team',
    sportType: 'music',
    type: 'Творческие',
  },
  {
    id: 10,
    title: 'Квиз "Знатоки"',
    description: 'Интеллектуальный квиз для команд и индивидуальных участников',
    startDate: '2023-11-05',
    endDate: '2023-11-05',
    location: 'Коворкинг-центр',
    participantCount: 12,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070',
    teams: [3, 12, 15, 18],
    competitionType: 'team',
    sportType: 'quiz',
    type: 'Интеллектуальные',
  },
  // Интеллектуальные
  {
    id: 11,
    title: 'Олимпиада по математике',
    description: 'Интеллектуальное индивидуальное соревнование по математике',
    startDate: '2023-12-01',
    endDate: '2023-12-01',
    location: 'Школа №1',
    participantCount: 30,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=2070',
    teams: [],
    competitionType: 'individual',
    sportType: 'math',
    type: 'Интеллектуальные',
  },
  {
    id: 12,
    title: 'Квиз "Знатоки истории"',
    description: 'Интеллектуальный командный квиз по истории',
    startDate: '2023-12-10',
    endDate: '2023-12-10',
    location: 'Исторический музей',
    participantCount: 10,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=2070',
    teams: [3, 12, 15],
    competitionType: 'team',
    sportType: 'quiz',
    type: 'Интеллектуальные',
  },
  {
    id: 13,
    title: 'Турнир по программированию',
    description: 'Интеллектуальное соревнование для программистов',
    startDate: '2023-11-20',
    endDate: '2023-11-21',
    location: 'IT-центр',
    participantCount: 20,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2070',
    teams: [2, 5, 8],
    competitionType: 'team',
    sportType: 'programming',
    type: 'Интеллектуальные',
  },
  // Творческие
  {
    id: 14,
    title: 'Фестиваль уличного искусства',
    description: 'Творческий конкурс для художников и дизайнеров',
    startDate: '2023-12-15',
    endDate: '2023-12-17',
    location: 'Парк культуры',
    participantCount: 15,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=2070',
    teams: [6, 17],
    competitionType: 'team',
    sportType: 'art',
    type: 'Творческие',
  },
  {
    id: 15,
    title: 'Конкурс вокалистов',
    description: 'Творческий индивидуальный конкурс вокалистов',
    startDate: '2023-12-20',
    endDate: '2023-12-20',
    location: 'Дом музыки',
    participantCount: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?q=80&w=2070',
    teams: [],
    competitionType: 'individual',
    sportType: 'music',
    type: 'Творческие',
  },
  {
    id: 16,
    title: 'Театральный марафон',
    description: 'Творческий командный конкурс театральных коллективов',
    startDate: '2023-11-25',
    endDate: '2023-11-27',
    location: 'Театр драмы',
    participantCount: 8,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070',
    teams: [11, 20],
    competitionType: 'team',
    sportType: 'theatre',
    type: 'Творческие',
  },
  // Спортивные
  {
    id: 17,
    title: 'Летний кубок по баскетболу',
    description: 'Спортивное командное соревнование по баскетболу',
    startDate: '2023-12-05',
    endDate: '2023-12-07',
    location: 'Баскетбольная арена',
    participantCount: 10,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=2070',
    teams: [19, 5, 9],
    competitionType: 'team',
    sportType: 'basketball',
    type: 'Спортивные',
  },
  {
    id: 18,
    title: 'Зимний марафон',
    description: 'Спортивное индивидуальное соревнование по бегу',
    startDate: '2023-12-22',
    endDate: '2023-12-22',
    location: 'Городской стадион',
    participantCount: 50,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070',
    teams: [],
    competitionType: 'individual',
    sportType: 'running',
    type: 'Спортивные',
  },
  {
    id: 19,
    title: 'Турнир по настольному теннису',
    description: 'Спортивное индивидуальное соревнование по настольному теннису',
    startDate: '2023-11-15',
    endDate: '2023-11-16',
    location: 'Спорткомплекс',
    participantCount: 16,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070',
    teams: [],
    competitionType: 'individual',
    sportType: 'tennis',
    type: 'Спортивные',
  },
  // --- Спортивные ---
  {
    id: 101,
    title: 'Весенний турнир по футболу',
    description: 'Командное спортивное соревнование по футболу среди школ города',
    startDate: '2023-04-10',
    endDate: '2023-04-12',
    location: 'Стадион "Юность"',
    participantCount: 8,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2023',
    teams: [1, 2, 3, 4],
    competitionType: 'team',
    sportType: 'football',
    type: 'Спортивные',
  },
  {
    id: 102,
    title: 'Летний марафон',
    description: 'Индивидуальное спортивное соревнование по бегу',
    startDate: '2023-06-20',
    endDate: '2023-06-20',
    location: 'Городской парк',
    participantCount: 50,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070',
    teams: [],
    competitionType: 'individual',
    sportType: 'running',
    type: 'Спортивные',
  },
  {
    id: 103,
    title: 'Осенний кубок по баскетболу',
    description: 'Командное спортивное соревнование по баскетболу',
    startDate: '2023-09-15',
    endDate: '2023-09-17',
    location: 'Баскетбольная арена',
    participantCount: 10,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=2070',
    teams: [5, 6, 7],
    competitionType: 'team',
    sportType: 'basketball',
    type: 'Спортивные',
  },
  // --- Интеллектуальные ---
  {
    id: 201,
    title: 'Олимпиада по физике',
    description: 'Индивидуальное интеллектуальное соревнование по физике',
    startDate: '2023-05-05',
    endDate: '2023-05-05',
    location: 'Лицей №2',
    participantCount: 20,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=2070',
    teams: [],
    competitionType: 'individual',
    sportType: 'physics',
    type: 'Интеллектуальные',
  },
  {
    id: 202,
    title: 'Квиз "Знатоки литературы"',
    description: 'Командный интеллектуальный квиз по литературе',
    startDate: '2023-07-10',
    endDate: '2023-07-10',
    location: 'Библиотека',
    participantCount: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=2070',
    teams: [8, 9],
    competitionType: 'team',
    sportType: 'quiz',
    type: 'Интеллектуальные',
  },
  {
    id: 203,
    title: 'Турнир по шахматам',
    description: 'Командное интеллектуальное соревнование по шахматам',
    startDate: '2023-03-15',
    endDate: '2023-03-17',
    location: 'Шахматный клуб',
    participantCount: 6,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?q=80&w=2070',
    teams: [10, 11],
    competitionType: 'team',
    sportType: 'chess',
    type: 'Интеллектуальные',
  },
  // --- Творческие ---
  {
    id: 301,
    title: 'Фестиваль живописи',
    description: 'Творческий конкурс для художников',
    startDate: '2023-08-01',
    endDate: '2023-08-03',
    location: 'Галерея искусств',
    participantCount: 15,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=2070',
    teams: [12, 13],
    competitionType: 'team',
    sportType: 'art',
    type: 'Творческие',
  },
  {
    id: 302,
    title: 'Конкурс вокалистов',
    description: 'Индивидуальный творческий конкурс вокалистов',
    startDate: '2023-10-10',
    endDate: '2023-10-10',
    location: 'Дом музыки',
    participantCount: 10,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?q=80&w=2070',
    teams: [],
    competitionType: 'individual',
    sportType: 'music',
    type: 'Творческие',
  },
  {
    id: 303,
    title: 'Театральный марафон',
    description: 'Командный творческий конкурс театральных коллективов',
    startDate: '2023-09-20',
    endDate: '2023-09-22',
    location: 'Театр драмы',
    participantCount: 8,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070',
    teams: [14, 15],
    competitionType: 'team',
    sportType: 'theatre',
    type: 'Творческие',
  },
]

// Массив стадионов в Астане
const astanaStadiums = [
  {
    name: "Астана Арена",
    address: "Туран 54, Астана, Казахстан",
    coordinates: [71.428152, 51.089079]
  },
  {
    name: "Центральный стадион Астаны",
    address: "Кенесары 54, Астана, Казахстан",
    coordinates: [71.429680, 51.142890]
  },
  {
    name: "Стадион им. Х. Мунайтпасова",
    address: "Кабанбай батыра 49, Астана, Казахстан",
    coordinates: [71.415234, 51.122356]
  },
  {
    name: "Спорткомплекс Казахстан",
    address: "Мунайтпасова 15, Астана, Казахстан",
    coordinates: [71.431567, 51.127890]
  },
  {
    name: "Футбольный центр Туран",
    address: "Карталы 6, Астана, Казахстан",
    coordinates: [71.416592, 51.098765]
  },
  {
    name: "ФОК Алатау",
    address: "Сатпаева 23, Астана, Казахстан",
    coordinates: [71.435678, 51.139012]
  },
  {
    name: "Дворец спорта Онер",
    address: "Республики 43, Астана, Казахстан",
    coordinates: [71.423456, 51.127654]
  },
  {
    name: "Спортивный комплекс Даулет",
    address: "Победы 32, Астана, Казахстан",
    coordinates: [71.442134, 51.113451]
  }
];

// Функция для получения случайного стадиона
const getRandomStadium = () => {
  const randomIndex = Math.floor(Math.random() * astanaStadiums.length);
  return astanaStadiums[randomIndex];
};

// Функция для инициализации соревнований с случайными стадионами в Астане
const initializeCompetitionsWithStadiums = (competitions) => {
  return competitions.map(competition => {
    const stadium = getRandomStadium();
    return {
      ...competition,
      location: stadium.name,
      address: stadium.address,
      city: "Астана",
      country: "Казахстан",
      coordinates: stadium.coordinates
    };
  });
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, type: "spring", stiffness: 100 }
  },
  hover: {
    scale: 1.03,
    y: -5,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.3 }
  }
}

// Format date function
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}

const competitionTypeOptions = [
  { value: 'all', label: 'Все типы' },
  { value: 'Спортивные', label: 'Спортивные' },
  { value: 'Интеллектуальные', label: 'Интеллектуальные' },
  { value: 'Творческие', label: 'Творческие' },
]

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoaded, setIsLoaded] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')
  const [formatFilter, setFormatFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [activeCompetition, setActiveCompetition] = useState(null)
  
  // Scroll animation
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8])
  
  // Refs for scroll effects
  const competitionsRef = useRef(null)
  
  useEffect(() => {
    setIsLoaded(true)
    
    // Load competitions from localStorage
    try {
      const storedCompetitions = localStorage.getItem('competitions')
      if (storedCompetitions) {
        const parsedCompetitions = JSON.parse(storedCompetitions)
        if (Array.isArray(parsedCompetitions) && parsedCompetitions.length > 0) {
          // Проверим, есть ли у соревнований координаты и адреса в Астане
          const needsStadiums = !parsedCompetitions.some(comp => 
            comp.city === "Астана" && comp.coordinates && comp.coordinates.length === 2
          );
          
          if (needsStadiums) {
            // Добавим случайные стадионы всем соревнованиям
            const updatedCompetitions = initializeCompetitionsWithStadiums(parsedCompetitions);
            localStorage.setItem('competitions', JSON.stringify(updatedCompetitions));
            setCompetitions(updatedCompetitions);
          } else {
            // Combine stored competitions with mock data, avoiding duplicates by id
            const combinedCompetitions = [...parsedCompetitions]
            
            const existingIds = new Set(parsedCompetitions.map(comp => comp.id))
            const mocksWithStadiums = initializeCompetitionsWithStadiums(mockCompetitions);
            mocksWithStadiums.forEach(comp => {
              if (!existingIds.has(comp.id)) {
                combinedCompetitions.push(comp)
              }
            })
            
            setCompetitions(combinedCompetitions)
          }
        } else {
          const competitionsWithStadiums = initializeCompetitionsWithStadiums(mockCompetitions);
          setCompetitions(competitionsWithStadiums);
          localStorage.setItem('competitions', JSON.stringify(competitionsWithStadiums));
        }
      } else {
        const competitionsWithStadiums = initializeCompetitionsWithStadiums(mockCompetitions);
        setCompetitions(competitionsWithStadiums);
        localStorage.setItem('competitions', JSON.stringify(competitionsWithStadiums));
      }
    } catch (error) {
      console.error('Ошибка при загрузке соревнований:', error)
      setCompetitions(mockCompetitions)
    }
  }, [])

  // Filter competitions based on search query, status, type and format
  const filteredCompetitions = competitions.filter(competition => {
    const matchesSearch = 
      competition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competition.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competition.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || 
      competition.status === statusFilter
    
    const matchesType = 
      typeFilter === 'all' || 
      (competition.type && competition.type.toLowerCase() === typeFilter.toLowerCase())
    
    const matchesFormat = 
      formatFilter === 'all' || 
      (formatFilter === 'team' && (!competition.competitionType || competition.competitionType === 'team')) ||
      (formatFilter === 'individual' && competition.competitionType === 'individual')
    
    return matchesSearch && matchesStatus && matchesType && matchesFormat
  })
  
  // Sort competitions
  const sortedCompetitions = [...filteredCompetitions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.startDate) - new Date(b.startDate)
    } else if (sortBy === 'participants') {
      return b.participantCount - a.participantCount
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch(status) {
      case 'upcoming':
        return { 
          label: 'Предстоит', 
          classes: 'bg-blue-100 text-blue-700 border border-blue-200' 
        }
      case 'active':
        return { 
          label: 'Активно', 
          classes: 'bg-green-100 text-green-700 border border-green-200' 
        }
      case 'completed':
        return { 
          label: 'Завершено', 
          classes: 'bg-gray-100 text-gray-700 border border-gray-200' 
        }
      default:
        return { 
          label: 'Неизвестно', 
          classes: 'bg-gray-100 text-gray-700 border border-gray-200' 
        }
    }
  }
  
  const scrollToCompetitions = () => {
    competitionsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`min-h-screen flex flex-col ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <Navbar />
      
      <main className="flex-grow pt-16 pb-20">
        {/* Hero Section */}
        <section className="relative w-full h-[50vh] min-h-[400px] overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-accent-900 text-white">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10 z-10"></div>
          
          {/* Animated background patterns */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-1/4 right-1/4 w-60 h-60 rounded-full bg-accent-500 blur-xl"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary-300 blur-xl"></div>
            </div>
          </div>
          
          <motion.div 
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="container mx-auto px-4 h-full z-20 relative flex flex-col justify-center items-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-center"
            >
              Соревнования
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-center mb-8"
            >
              Участвуйте в соревнованиях, завоевывайте награды и достигайте новых высот
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button 
                onClick={scrollToCompetitions}
                className="btn bg-white text-primary-700 hover:bg-white/90 px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg"
              >
                <FaSearch /> Найти соревнования
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/competitions/create"
                  className="btn bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg"
                >
                  <FaPlusCircle /> Командное соревнование
                </Link>
                <Link 
                  href="/competitions/create-individual"
                  className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg"
                >
                  <FaChess className="mr-1" /> Индивидуальное соревнование
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <button 
                onClick={scrollToCompetitions}
                className="flex flex-col items-center text-white/80 hover:text-white transition-colors"
              >
                <span className="text-sm mb-2">Все соревнования</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FaChevronRight className="transform rotate-90 text-2xl" />
                </motion.div>
              </button>
            </motion.div>
          </motion.div>
        </section>
        
        <div ref={competitionsRef} className="container mx-auto px-4 pt-12">
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="max-w-5xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Поиск по названию, описанию или месту проведения..."
                      className="w-full py-3 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <FaFilter /> Фильтры
                    </button>
                    
                    <div className="group relative">
                      <button
                        className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <FaPlusCircle /> Создать
                      </button>
                      <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 min-w-[220px]">
                        <Link
                          href="/competitions/create"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <FaUsers className="mr-2" /> Командное соревнование
                        </Link>
                        <Link
                          href="/competitions/create-individual"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <FaChess className="mr-2" /> Индивидуальное соревнование
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 mt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="all">Все статусы</option>
                            <option value="upcoming">Предстоящие</option>
                            <option value="active">Активные</option>
                            <option value="completed">Завершенные</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Формат</label>
                          <select
                            value={formatFilter}
                            onChange={(e) => setFormatFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="all">Все форматы</option>
                            <option value="team">Командные</option>
                            <option value="individual">Индивидуальные</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Тип</label>
                          <select
                            value={typeFilter}
                            onChange={e => setTypeFilter(e.target.value)}
                            className="input w-full"
                          >
                            {competitionTypeOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Сортировка</label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="date">По дате</option>
                            <option value="participants">По участникам</option>
                            <option value="title">По названию</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
          
          {/* Competitions List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {sortedCompetitions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-1 md:col-span-2 lg:col-span-3 py-12 text-center"
                >
                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-100 p-8 rounded-lg">
                      <FaSearch className="text-gray-400 text-5xl mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-700 mb-2">Соревнования не найдены</h3>
                      <p className="text-gray-500 mb-6">
                        Попробуйте изменить параметры поиска или создайте новое соревнование.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <Link
                          href="/competitions/create"
                          className="btn-primary px-4 py-2 flex items-center justify-center"
                        >
                          <FaPlusCircle className="mr-1" /> Командное соревнование
                        </Link>
                        <Link
                          href="/competitions/create-individual"
                          className="btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                        >
                          <FaChess className="mr-1" /> Индивидуальное соревнование
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                sortedCompetitions.map((competition, index) => {
                  const statusBadge = getStatusBadge(competition.status)
                  
                  return (
                    <motion.div
                      key={competition.id}
                      variants={itemVariants}
                      whileHover="hover"
                      className="h-full perspective-1000"
                      layoutId={`competition-${competition.id}`}
                    >
                      <div 
                        className="bg-white rounded-xl shadow-md transition-all duration-300 h-full flex flex-col border border-gray-100 overflow-hidden group"
                        onMouseEnter={() => setActiveCompetition(competition.id)}
                        onMouseLeave={() => setActiveCompetition(null)}
                      >
                        <div className="relative h-48 md:h-56 overflow-hidden">
                          {competition.image && (
                            <Image
                              src={competition.image}
                              alt={competition.title}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          )}
                          
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent h-24"></div>
                          
                          <div className="absolute top-3 left-3 z-10">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.classes}`}>
                              {statusBadge.label}
                            </span>
                          </div>
                          
                          <div className="absolute top-3 right-3 z-10 flex space-x-2">
                            {competition.competitionType === 'individual' ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 flex items-center">
                                <FaUser className="mr-1" /> Индивидуальное
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent-100 text-accent-800 border border-accent-200 flex items-center">
                                <FaUsers className="mr-1" /> Командное
                              </span>
                            )}
                            
                            {competition.type && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-700 border border-gray-200">
                                {competition.type === 'Спортивные' && 'Спортивное'}
                                {competition.type === 'Интеллектуальные' && 'Интеллектуальное'}
                                {competition.type === 'Творческие' && 'Творческое'}
                              </span>
                            )}
                          </div>
                          
                          {competition.competitionType === 'individual' && competition.sportType && (
                            <div className="absolute top-14 right-3 z-10">
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-700 border border-gray-200 flex items-center">
                                {competition.sportType === 'chess' && <FaChess className="mr-1" />}
                                {competition.sportType === 'chess' && 'Шахматы'}
                                {competition.sportType === 'checkers' && 'Шашки'}
                                {competition.sportType === 'tennis' && 'Теннис'}
                                {competition.sportType === 'badminton' && 'Бадминтон'}
                                {competition.sportType === 'swimming' && 'Плавание'}
                                {competition.sportType === 'running' && 'Бег'}
                                {competition.sportType === 'cycling' && 'Велоспорт'}
                                {competition.sportType === 'other' && 'Другое'}
                                {!['chess', 'checkers', 'tennis', 'badminton', 'swimming', 'running', 'cycling', 'other'].includes(competition.sportType) && competition.sportType}
                              </span>
                            </div>
                          )}
                          
                          {competition.status === 'completed' && competition.results && (
                            <div className="absolute right-3 bottom-3 z-10">
                              <div className="flex items-center gap-1 bg-accent-100 bg-opacity-90 px-2 py-1 rounded border border-accent-200">
                                <FaMedal className="text-accent-700" />
                                <span className="text-xs font-semibold text-accent-800">
                                  {competition.results[0]?.teamId}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-5 flex-grow flex flex-col">
                          <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
                            {competition.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-grow">
                            {competition.description}
                          </p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-start">
                              <FaCalendarAlt className="text-primary-500 mr-2 mt-1" />
                              <div>
                                <p className="text-sm text-gray-700">
                                  {formatDate(competition.startDate)}
                                  {competition.endDate && competition.endDate !== competition.startDate && 
                                    ` - ${formatDate(competition.endDate)}`
                                  }
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <FaMapMarkerAlt className="text-primary-500 mr-2 mt-1" />
                              <p className="text-sm text-gray-700 line-clamp-1">{competition.location}</p>
                            </div>
                            
                            <div className="flex items-start">
                              <FaUsers className="text-primary-500 mr-2 mt-1" />
                              <p className="text-sm text-gray-700">
                                {competition.participantCount || 0} 
                                {competition.competitionType === 'team' 
                                  ? ' команд' 
                                  : ' участников'
                                } из {competition.maxTeams || competition.maxParticipants || '∞'}
                              </p>
                            </div>
                            
                            {/* Prize Pool */}
                            {competition.prizePool > 0 && (
                              <div className="flex items-start">
                                <FaTrophy className="text-primary-500 mr-2 mt-1" />
                                <p className="text-sm font-medium text-green-600">
                                  Призовой фонд: {competition.prizePool.toLocaleString()} ₸
                                </p>
                              </div>
                            )}
                            
                            {/* Entry Fee */}
                            {competition.entryFee !== undefined && (
                              <div className="flex items-start">
                                <FaTicketAlt className="text-primary-500 mr-2 mt-1" />
                                <p className="text-sm text-gray-700">
                                  {competition.entryFee > 0 
                                    ? <span className="font-medium text-yellow-600">Участие: {competition.entryFee.toLocaleString()} ₸</span> 
                                    : <span className="text-green-600">Бесплатное участие</span>
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <Link
                              href={`/competitions/${competition.id}`}
                              className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                            >
                              Подробнее <FaChevronRight className="ml-1" />
                            </Link>
                            <div>
                              {competition.creatorName && (
                                <span className="text-xs text-gray-500">
                                  Организатор: {competition.creatorName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 