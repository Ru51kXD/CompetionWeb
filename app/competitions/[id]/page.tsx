'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaClipboardList, FaUserPlus, FaTrophy, FaArrowLeft, FaEdit, FaPlus, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaCreditCard } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import GoogleLocationMap from '../../components/GoogleLocationMap'

// Type definitions
interface User {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  paymentCards?: PaymentCard[];
}

interface TeamMember {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
  memberCount?: number;
  members?: TeamMember[];
  image?: string;
  ownerId?: number;
  competitionCount?: number;
  maxMembers?: number;
}

interface Competition {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  status: 'upcoming' | 'active' | 'completed';
  teams?: number[];
  participants?: number[];
  maxTeams: number;
  maxTeamSize: number;
  participantCount?: number;
  coordinates?: [number, number];
  rules?: string;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  city?: string;
  country?: string;
  competitionType?: 'team' | 'individual';
  createdBy?: number;
  creatorName?: string;
  prizePool?: number;
  entryFee?: number;
  paidTeams?: number[];
  refundedTeams?: number[];
  paymentLog?: { teamId: number; amount: number; status: 'paid' | 'refunded'; date: string }[];
  prizeDistribution?: { teamId: number; amount: number }[];
}

interface PaymentCard {
  id: number;
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
  isDefault: boolean;
}

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

// Utility function to safely convert Date objects to strings
const safelyConvertDateToString = (date: any): string => {
  if (date instanceof Date) {
    return date.toISOString();
  } else if (typeof date === 'string') {
    return date;
  } else {
    // Fallback to current date if invalid
    return new Date().toISOString();
  }
};

export default function CompetitionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  const [competition, setCompetition] = useState<Competition | null>(null)
  const [participatingTeams, setParticipatingTeams] = useState<Team[]>([])
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showTeamSelection, setShowTeamSelection] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registeredTeamName, setRegisteredTeamName] = useState('')
  const [userTeams, setUserTeams] = useState<Team[]>([])
  const [teamSizeError, setTeamSizeError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [registeredParticipants, setRegisteredParticipants] = useState<User[]>([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [teamToRegister, setTeamToRegister] = useState<Team | null>(null)
  const [userTeam, setUserTeam] = useState<Team | null>(null)
  const [useSavedCard, setUseSavedCard] = useState(true)
  const [savedCard, setSavedCard] = useState<{number: string, expiry: string, cvv: string} | null>(null)
  const { user, isAdmin } = useAuth()

  // State for payment processing
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [selectedSavedCard, setSelectedSavedCard] = useState<number | null>(null);
  const [saveCardForFuture, setSaveCardForFuture] = useState(false);
  const [newCardData, setNewCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // Mask card number for display (only last 4 digits visible)
  const maskCardNumber = (cardNumber: string) => {
    const parts = cardNumber.split(' ');
    if (parts.length === 4) {
      return `•••• •••• •••• ${parts[3]}`;
    }
    return cardNumber;
  };

  // Format card number with spaces for display (1234 5678 9012 3456)
  const formatCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  // Handle card input changes with formatting
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces after every 4 digits
    if (name === 'cardNumber') {
      // Remove any non-digit characters
      const digits = value.replace(/\D/g, '');
      // Format with spaces
      if (digits.length > 0) {
        const groups = digits.match(/.{1,4}/g);
        formattedValue = groups ? groups.join(' ') : digits;
      } else {
        formattedValue = '';
      }
    }

    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      // Remove any non-digit characters
      const digits = value.replace(/\D/g, '');
      
      if (digits.length > 0) {
        if (digits.length <= 2) {
          formattedValue = digits;
        } else {
          formattedValue = `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
        }
      } else {
        formattedValue = '';
      }
    }

    // Only allow numbers for CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
    }
    
    setNewCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  // Process payment with selected or new card
  const processPayment = () => {
    if (!teamToRegister || !competition) return;
    
    // Validate if using new card
    if (!selectedSavedCard && !useSavedCard) {
      // Very basic validation
      if (!newCardData.cardNumber || !newCardData.expiryDate || !newCardData.cvv || !newCardData.cardholderName) {
        setError('Пожалуйста, заполните все данные карты');
        return;
      }
      
      // Basic format validation
      const cardNumberClean = newCardData.cardNumber.replace(/\s/g, '');
      if (cardNumberClean.length !== 16 || !/^\d+$/.test(cardNumberClean)) {
        setError('Неверный формат номера карты');
        return;
      }
      
      if (!/^\d{2}\/\d{2}$/.test(newCardData.expiryDate)) {
        setError('Неверный формат срока действия (ММ/ГГ)');
        return;
      }
      
      if (newCardData.cvv.length !== 3 || !/^\d{3}$/.test(newCardData.cvv)) {
        setError('CVV должен содержать 3 цифры');
        return;
      }
    }
    
    setPaymentInProgress(true);
    setError('');

    // Simulate payment processing delay
    setTimeout(() => {
      try {
        // Get the latest competition data
        const storedCompetitions = localStorage.getItem('competitions');
        if (storedCompetitions && competition) {
          const allCompetitions = JSON.parse(storedCompetitions);
          const competitionIndex = allCompetitions.findIndex(c => c.id === competition.id);
          
          if (competitionIndex !== -1) {
            // Process team registration
            const teamId = teamToRegister.id;
            
            // Create paidTeams array if it doesn't exist
            if (!allCompetitions[competitionIndex].paidTeams) {
              allCompetitions[competitionIndex].paidTeams = [];
            }
            
            // Add to paid teams
            allCompetitions[competitionIndex].paidTeams.push(teamId);
            
            // Register the team
            registerTeam(teamId, allCompetitions, competitionIndex, teamToRegister);
            
            // Add success message
            const successMsg = `Оплата успешно произведена. Команда ${teamToRegister.name} зарегистрирована на соревнование!`;
            setSuccessMessage(successMsg);
            
            // Clear success message after 5 seconds
            setTimeout(() => {
              setSuccessMessage('');
            }, 5000);
          }
        }
      } catch (error) {
        console.error('Ошибка при обработке оплаты:', error);
        setError('Произошла ошибка при обработке оплаты');
      } finally {
        setPaymentInProgress(false);
        setShowPaymentModal(false);
        setTeamToRegister(null);
        setSelectedSavedCard(null);
        setSaveCardForFuture(false);
        setNewCardData({
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardholderName: ''
        });
      }
    }, 1500);
  };

  // Add this useEffect to check for saved cards when the component loads
  useEffect(() => {
    // Check if user has saved card data in profile or local storage
    if (user && user.id) {
      console.log("Checking for saved card data for user:", user.id);
      
      // Check userCards in localStorage first
      const userCards = localStorage.getItem('userCards');
      if (userCards) {
        try {
          const cards = JSON.parse(userCards);
          const userCard = cards.find(card => card.userId === user.id);
          if (userCard) {
            console.log("Found saved card in localStorage");
            setSavedCard({
              number: userCard.cardNumber,
              expiry: userCard.expiry,
              cvv: userCard.cvv
            });
          }
        } catch (e) {
          console.error("Error parsing userCards from localStorage:", e);
        }
      }
      
      // Also check user.paymentCards as a backup
      if (user.paymentCards && user.paymentCards.length > 0) {
        console.log("Found payment cards in user profile:", user.paymentCards.length);
        
        // Get default or first card
        const defaultCard = user.paymentCards.find(card => card.isDefault) || user.paymentCards[0];
        
        if (defaultCard) {
          console.log("Using card from profile:", defaultCard.id);
          setSavedCard({
            number: defaultCard.cardNumber,
            expiry: defaultCard.expiryDate,
            cvv: "***" // We don't typically store CVV in profiles
          });
        }
      }
    }
  }, [user]);

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
          console.log('Ищем соревнование с ID:', competitionId, 'Тип:', typeof competitionId)
          console.log('Доступные соревнования:', allCompetitions.map(c => ({id: c.id, title: c.title, idType: typeof c.id})))
          
          // Try to find by numeric id first
          let foundCompetition = allCompetitions.find(c => c.id === competitionId)
          
          // If not found, try string comparison as fallback
          if (!foundCompetition && typeof id === 'string') {
            foundCompetition = allCompetitions.find(c => String(c.id) === id)
          }
          
          // If still not found, try looking by array index in case IDs are mismatched
          if (!foundCompetition && typeof competitionId === 'number' && competitionId > 0 && competitionId <= allCompetitions.length) {
            console.log('Пытаемся найти по индексу массива:', competitionId - 1)
            foundCompetition = allCompetitions[competitionId - 1]
          }
          
          if (foundCompetition) {
            console.log('Соревнование найдено:', foundCompetition)
            // Ensure maxTeams and maxTeamSize are set
            if (!foundCompetition.maxTeams) {
              foundCompetition.maxTeams = 10; // Default value
            }
            
            if (!foundCompetition.maxTeamSize) {
              foundCompetition.maxTeamSize = 10; // Default value
            }
            
            // Проверяем, есть ли координаты, и если нет - добавляем случайные для Астаны
            if (!foundCompetition.coordinates || foundCompetition.coordinates.length !== 2) {
              const astanaCoordinates = [
                [71.428152, 51.089079], // Астана Арена
                [71.429680, 51.142890], // Центральный стадион
                [71.415234, 51.122356], // Стадион Мунайтпасова
                [71.431567, 51.127890], // Спорткомплекс Казахстан
              ]
              const randomIndex = Math.floor(Math.random() * astanaCoordinates.length)
              foundCompetition.coordinates = astanaCoordinates[randomIndex]
              foundCompetition.city = "Астана"
              foundCompetition.country = "Казахстан"
              
              // Сохраняем обратно в localStorage
              const updatedCompetitions = [...allCompetitions]
              const competitionIndex = updatedCompetitions.findIndex(c => c.id === foundCompetition.id)
              if (competitionIndex !== -1) {
                updatedCompetitions[competitionIndex] = foundCompetition
                localStorage.setItem('competitions', JSON.stringify(updatedCompetitions))
              }
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
            console.error('Соревнование не найдено в базе данных. ID:', competitionId)
            setError('Соревнование не найдено')
            
            // Альтернативный вариант - загрузить данные из мок-данных
            const mockCompetition = mockCompetitions.find(c => c.id === competitionId || String(c.id) === id)
            if (mockCompetition) {
              console.log('Найдено в mocked данных:', mockCompetition)
              // Добавим координаты в Астане и конвертируем даты в строки
              const mockWithCoordinates: Competition = {
                ...mockCompetition,
                coordinates: [71.428152, 51.089079] as [number, number], // Астана Арена
                city: "Астана",
                country: "Казахстан",
                maxTeams: 10,
                maxTeamSize: 10,
                status: 'upcoming',
                startDate: safelyConvertDateToString(mockCompetition.startDate),
                endDate: safelyConvertDateToString(mockCompetition.endDate),
                participants: Array.isArray(mockCompetition.participants) ? mockCompetition.participants : [],
              }
              setCompetition(mockWithCoordinates)
              setError('') // Сбросим ошибку, так как нашли соревнование в мок-данных
              
              // Сохраним это соревнование в localStorage
              const competitionsToSave = storedCompetitions ? JSON.parse(storedCompetitions) : []
              competitionsToSave.push(mockWithCoordinates)
              localStorage.setItem('competitions', JSON.stringify(competitionsToSave))
            }
          }
        } else {
          console.error('Соревнования не найдены в localStorage')
          setError('Соревнования не найдены')
          
          // Инициализируем localStorage мок-данными
          const competitionsWithCoordinates = mockCompetitions.map(comp => {
            return {
              ...comp,
              coordinates: [71.428152, 51.089079] as [number, number], // Астана Арена
              city: "Астана",
              country: "Казахстан",
              maxTeams: 10,
              maxTeamSize: 10,
              status: 'upcoming' as 'upcoming',
              startDate: safelyConvertDateToString(comp.startDate),
              endDate: safelyConvertDateToString(comp.endDate),
              participants: Array.isArray(comp.participants) ? comp.participants : [],
            }
          })
          localStorage.setItem('competitions', JSON.stringify(competitionsWithCoordinates))
          
          // Если ID соответствует одному из мок-соревнований, установим его
          const competitionId = typeof id === 'string' ? parseInt(id, 10) : id
          const mockCompetition = competitionsWithCoordinates.find(c => c.id === competitionId || String(c.id) === id)
          if (mockCompetition) {
            setCompetition(mockCompetition)
            setError('') // Сбросим ошибку, так как нашли соревнование в мок-данных
          }
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

  // Update userTeam when userTeams changes or competition is loaded
  useEffect(() => {
    if (user && competition && userTeams.length > 0) {
      // Find the user's team that is registered for this competition
      const registeredTeam = userTeams.find(team => 
        competition.teams?.includes(team.id)
      );
      setUserTeam(registeredTeam || null);
    }
  }, [user, competition, userTeams]);

  const handleAddTeam = () => {
    if (!user) {
      router.push('/login')
      return
    }
    
    setIsRegistering(true)
    
    try {
      // Get teams from localStorage
      const storedTeams = localStorage.getItem('teams')
      if (storedTeams) {
        const allTeams = JSON.parse(storedTeams)
        
        // Filter teams owned by current user
        const userOwnedTeams = allTeams.filter(team => team.ownerId === user.id)
        
        if (userOwnedTeams.length === 0) {
          // If user has no teams, redirect to create team page
          setError('У вас нет команд для регистрации. Создайте команду сначала.')
          setIsRegistering(false)
          
          // Show confirm dialog
          if (confirm('У вас нет команд для регистрации. Создать команду?')) {
            router.push('/teams/create')
          }
          return
        }
        
        setUserTeams(userOwnedTeams)
        setShowTeamSelection(true)
      }
      
      setIsRegistering(false)
    } catch (error) {
      console.error('Ошибка при загрузке команд:', error)
      setError('Произошла ошибка при загрузке команд')
      setIsRegistering(false)
    }
  }

  const handleTeamSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = parseInt(e.target.value, 10)
    setSelectedTeam(e.target.value)
    
    if (!teamId || !competition) return
    
    try {
      // Get competitions and teams from localStorage
      const storedCompetitions = localStorage.getItem('competitions')
      const storedTeams = localStorage.getItem('teams')
      
      if (storedCompetitions && storedTeams) {
        const allCompetitions = JSON.parse(storedCompetitions)
        const allTeams = JSON.parse(storedTeams)
        
        // Find team and competition
        const team = allTeams.find(t => t.id === teamId)
        const competitionIndex = allCompetitions.findIndex(c => c.id === competition.id)
        
        if (competitionIndex !== -1 && team) {
          // Set the userTeam when a team is selected
          setUserTeam(team);
          
          // Check if team members exceed max team size
          if (team.memberCount && team.memberCount > competition.maxTeamSize) {
            setTeamSizeError(`В команде слишком много участников. Максимальный размер команды: ${competition.maxTeamSize}`)
            return
          }
          
          setTeamSizeError('')
          setTeamToRegister(team)
          
          // Always show payment modal if competition has an entry fee
          if (competition.entryFee && competition.entryFee > 0) {
            // Auto-use saved card if available
            if (savedCard) {
              console.log("Using previously loaded saved card");
              setUseSavedCard(true);
            } else {
              // One more check for saved cards
              console.log("No saved card found, checking again...");
              if (user && user.id) {
                // Check userCards in localStorage
                const userCards = localStorage.getItem('userCards');
                if (userCards) {
                  try {
                    const cards = JSON.parse(userCards);
                    const userCard = cards.find(card => card.userId === user.id);
                    if (userCard) {
                      console.log("Found saved card in localStorage during team select");
                      setSavedCard({
                        number: userCard.cardNumber,
                        expiry: userCard.expiry,
                        cvv: userCard.cvv
                      });
                      setUseSavedCard(true);
                    }
                  } catch (e) {
                    console.error("Error parsing userCards:", e);
                  }
                }
                
                // Also check user.paymentCards
                if (user.paymentCards && user.paymentCards.length > 0) {
                  console.log("Found payment cards in user profile during team select");
                  
                  // Get default or first card
                  const defaultCard = user.paymentCards.find(card => card.isDefault) || user.paymentCards[0];
                  
                  if (defaultCard) {
                    console.log("Using card from profile during team select:", defaultCard.id);
                    setSavedCard({
                      number: defaultCard.cardNumber,
                      expiry: defaultCard.expiryDate,
                      cvv: "***" // We don't typically store CVV in profiles
                    });
                    setUseSavedCard(true);
                  }
                }
              }
            }
            
            setShowPaymentModal(true);
          } else {
            // Only register if no fee is required
            registerTeam(teamId, allCompetitions, competitionIndex, team)
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при выборе команды:', error)
      setError('Произошла ошибка при выборе команды')
    }
  }
  
  const registerTeam = (teamId: number, allCompetitions: any[], competitionIndex: number, team: any) => {
    // If competition allows more registrations
    if (!allCompetitions[competitionIndex].teams) {
      allCompetitions[competitionIndex].teams = []
    }
    
    // Check if team is already registered
    if (allCompetitions[competitionIndex].teams.includes(teamId)) {
      setError('Эта команда уже зарегистрирована на соревнование')
      return
    }
    
    // Check if max teams reached
    if (allCompetitions[competitionIndex].teams.length >= (competition?.maxTeams || 10)) {
      setError('Достигнуто максимальное количество команд')
      return
    }
    
    // Add team to competition
    allCompetitions[competitionIndex].teams.push(teamId)
    
    // Update participant count
    allCompetitions[competitionIndex].participantCount = 
      (allCompetitions[competitionIndex].participantCount || 0) + (team.memberCount || 1)
    
    // Save competitions
    localStorage.setItem('competitions', JSON.stringify(allCompetitions))
    
    // Update team info with competition
    const storedTeams = localStorage.getItem('teams')
    if (storedTeams) {
      const teams = JSON.parse(storedTeams)
      const teamIndex = teams.findIndex(t => t.id === teamId)
      if (teamIndex !== -1) {
        teams[teamIndex].competitionCount = (teams[teamIndex].competitionCount || 0) + 1
        localStorage.setItem('teams', JSON.stringify(teams))
      }
    }
    
    // Update competition and show success message
    setCompetition(allCompetitions[competitionIndex])
    setParticipatingTeams([...participatingTeams, team])
    // Ensure userTeam is set after registration
    setUserTeam(team);
    setRegistrationSuccess(true)
    setRegisteredTeamName(team.name)
    setShowTeamSelection(false)
  }

  const getStatusBadge = (status: string) => {
    let bgColor, textColor, label;
    
    switch(status) {
      case 'upcoming':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-700';
        label = 'Предстоит';
        break;
      case 'active':
        bgColor = 'bg-green-100';
        textColor = 'text-green-700';
        label = 'Активно';
        break;
      case 'completed':
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-700';
        label = 'Завершено';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-700';
        label = 'Неизвестно';
    }
    
    return (
      <div className={`${bgColor} ${textColor} inline-flex items-center px-3 py-1 rounded-full text-sm font-medium`}>
        {label}
      </div>
    );
  };

  // Handler for refund
  const handleRefund = (teamId: number) => {
    if (!competition) return;
    const updatedCompetition = { ...competition };
    if (!updatedCompetition.refundedTeams) updatedCompetition.refundedTeams = [];
    if (!updatedCompetition.paymentLog) updatedCompetition.paymentLog = [];
    updatedCompetition.refundedTeams.push(teamId);
    updatedCompetition.paymentLog.push({
      teamId,
      amount: competition.entryFee || 0,
      status: 'refunded',
      date: new Date().toISOString(),
    });
    // Remove from paidTeams
    updatedCompetition.paidTeams = updatedCompetition.paidTeams?.filter(id => id !== teamId);
    setCompetition(updatedCompetition);
    // Save to localStorage
    const storedCompetitions = localStorage.getItem('competitions');
    if (storedCompetitions) {
      const allCompetitions = JSON.parse(storedCompetitions);
      const idx = allCompetitions.findIndex((c: any) => c.id === competition.id);
      if (idx !== -1) {
        allCompetitions[idx] = updatedCompetition;
        localStorage.setItem('competitions', JSON.stringify(allCompetitions));
      }
    }
  };

  // Handler for prize pool distribution
  const handleDistributePrizePool = () => {
    if (!competition || !competition.paidTeams || !competition.prizePool) return;
    // Simple distribution: all paid teams share the prize equally
    const winners = competition.paidTeams;
    const prizePerTeam = Math.floor(competition.prizePool / winners.length);
    const distribution = winners.map(teamId => ({ teamId, amount: prizePerTeam }));
    const updatedCompetition = { ...competition, prizeDistribution: distribution };
    setCompetition(updatedCompetition);
    // Save to localStorage
    const storedCompetitions = localStorage.getItem('competitions');
    if (storedCompetitions) {
      const allCompetitions = JSON.parse(storedCompetitions);
      const idx = allCompetitions.findIndex((c: any) => c.id === competition.id);
      if (idx !== -1) {
        allCompetitions[idx] = updatedCompetition;
        localStorage.setItem('competitions', JSON.stringify(allCompetitions));
      }
    }
  };

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
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{competition.description}</p>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-md font-semibold text-blue-800 mb-2 flex items-center">
                          <FaCalendarAlt className="mr-2" /> Важные даты
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-blue-700 font-medium mr-2 flex-shrink-0">Начало:</span>
                            <span className="text-gray-700">
                              {new Date(competition.startDate).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-700 font-medium mr-2 flex-shrink-0">Завершение:</span>
                            <span className="text-gray-700">
                              {new Date(competition.endDate).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-700 font-medium mr-2 flex-shrink-0">Продолжительность:</span>
                            <span className="text-gray-700">
                              {Math.ceil((new Date(competition.endDate).getTime() - new Date(competition.startDate).getTime()) / (1000 * 60 * 60 * 24))} дней
                            </span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-md font-semibold text-green-800 mb-2 flex items-center">
                          <FaUsers className="mr-2" /> Участие
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-green-700 font-medium mr-2">Тип соревнования:</span>
                            <span className="text-gray-700">{competition.competitionType === 'team' ? 'Командное' : 'Индивидуальное'}</span>
                          </li>
                          {competition.competitionType === 'team' && (
                            <>
                              <li className="flex items-start">
                                <span className="text-green-700 font-medium mr-2">Команд:</span>
                                <span className="text-gray-700">{participatingTeams.length} из {competition.maxTeams}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-green-700 font-medium mr-2">Размер команды:</span>
                                <span className="text-gray-700">до {competition.maxTeamSize} человек</span>
                              </li>
                            </>
                          )}
                          {competition.competitionType === 'individual' && (
                            <li className="flex items-start">
                              <span className="text-green-700 font-medium mr-2">Участников:</span>
                              <span className="text-gray-700">{registeredParticipants.length}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Правила</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="whitespace-pre-line font-sans text-gray-700 leading-relaxed">{competition.rules || 'Правила не указаны'}</pre>
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
                      {competition.city && (
                        <li className="flex items-start">
                          <span className="text-gray-600 font-medium mr-2">Город:</span>
                          <span>{competition.city}</span>
                        </li>
                      )}
                      {competition.country && (
                        <li className="flex items-start">
                          <span className="text-gray-600 font-medium mr-2">Страна:</span>
                          <span>{competition.country}</span>
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
                      {competition.prizePool !== undefined && competition.prizePool > 0 && (
                        <li className="flex items-start">
                          <span className="text-gray-600 font-medium mr-2">Призовой фонд:</span>
                          <span className="font-bold text-green-600">{competition.prizePool.toLocaleString()} ₸</span>
                        </li>
                      )}
                      {competition.entryFee !== undefined && competition.entryFee > 0 ? (
                        <li className="flex items-start">
                          <span className="text-gray-600 font-medium mr-2">Стоимость участия:</span>
                          <span className="font-semibold text-yellow-600">{competition.entryFee.toLocaleString()} ₸</span>
                          {user && userTeams.some(team => competition.teams?.includes(team.id)) && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded bg-gray-200">
                              {competition.paidTeams?.some(paidTeamId => 
                                userTeams.some(team => team.id === paidTeamId)
                              ) 
                                ? "Оплачено" 
                                : "Требуется оплата"}
                            </span>
                          )}
                        </li>
                      ) : (
                        <li className="flex items-start">
                          <span className="text-gray-600 font-medium mr-2">Стоимость участия:</span>
                          <span className="text-green-600">Бесплатно</span>
                        </li>
                      )}
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
                          {participatingTeams.map((team: Team) => (
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
                              {competition.entryFee && competition.entryFee > 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                                  Платно: {competition.entryFee.toLocaleString()} ₸
                                </span>
                              )}
                            </>
                          )}
                        </button>
                      )}
                      {showTeamSelection && (
                        <div className="mt-4 border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium mb-3">Выберите команду для регистрации:</h4>
                          {competition.entryFee && competition.entryFee > 0 && (
                            <div className="mb-3 p-2 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
                              <FaInfoCircle className="inline-block mr-1" /> Регистрация команды требует оплаты взноса в размере {competition.entryFee.toLocaleString()} ₸
                            </div>
                          )}
                          {userTeams.length > 0 ? (
                            <>
                              <select
                                value={selectedTeam}
                                onChange={handleTeamSelect}
                                className="input mb-3 w-full"
                              >
                                <option value="">-- Выберите команду --</option>
                                {userTeams
                                  .filter((team: Team) => !participatingTeams.some((pt: Team) => pt.id === team.id))
                                  .map((team: Team) => (
                                    <option key={team.id} value={team.id.toString()}>
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
                                      <FaUserPlus className="mr-2" /> 
                                      {competition.entryFee && competition.entryFee > 0 
                                        ? "Продолжить к оплате" 
                                        : "Зарегистрировать"}
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
                            {registeredParticipants.map((participant: User) => (
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
                          onClick={handleAddTeam}
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
              
              {/* Карта соревнования - крупная, снизу */}
              {competition.coordinates && competition.coordinates.length === 2 && (
                <div className="mt-10 border-t border-gray-200 pt-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-primary-600" /> Место проведения соревнования
                  </h2>
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-medium text-lg">{competition.location}</h3>
                      {competition.city && competition.country && (
                        <p className="text-gray-600">{competition.city}, {competition.country}</p>
                      )}
                    </div>
                    <div className="h-[500px]">
                      <GoogleLocationMap 
                        address={competition.location}
                        coordinates={competition.coordinates}
                        title={competition.title}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Payment Modal */}
      {showPaymentModal && teamToRegister && competition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Оплата участия</h3>
            <p className="mb-4">
              Для завершения регистрации команды <strong>{teamToRegister.name}</strong> необходимо оплатить взнос:
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <p className="font-bold text-center text-xl text-yellow-700">
                {competition.entryFee?.toLocaleString()} ₸
              </p>
            </div>
            
            {savedCard ? (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-700 text-sm font-medium">
                    Способ оплаты
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="useSavedCard"
                      checked={useSavedCard}
                      onChange={() => setUseSavedCard(!useSavedCard)}
                      className="mr-2"
                    />
                    <label htmlFor="useSavedCard" className="text-sm">
                      Использовать сохраненную карту
                    </label>
                  </div>
                </div>
                
                {useSavedCard ? (
                  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Ваша карта</p>
                        <p className="text-gray-600">**** **** **** {savedCard.number.slice(-4)}</p>
                        <p className="text-xs text-gray-500">Срок действия: {savedCard.expiry}</p>
                      </div>
                      <div className="flex space-x-2">
                        <svg className="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Номер карты
                      </label>
                      <input 
                        type="text" 
                        className="input w-full"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Срок действия
                        </label>
                        <input 
                          type="text" 
                          className="input w-full"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          CVV
                        </label>
                        <input 
                          type="text" 
                          className="input w-full"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="saveCard"
                          className="mr-2"
                        />
                        <label htmlFor="saveCard" className="text-sm text-gray-700">
                          Сохранить карту для будущих платежей
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Номер карты
                  </label>
                  <input 
                    type="text" 
                    className="input w-full"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Срок действия
                    </label>
                    <input 
                      type="text" 
                      className="input w-full"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      CVV
                    </label>
                    <input 
                      type="text" 
                      className="input w-full"
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveCard"
                      className="mr-2"
                    />
                    <label htmlFor="saveCard" className="text-sm text-gray-700">
                      Сохранить карту для будущих платежей
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                className="btn-outline py-2 px-4"
                onClick={() => {
                  setShowPaymentModal(false)
                  setTeamToRegister(null)
                }}
              >
                Отмена
              </button>
              <button
                className="btn-primary py-2 px-4"
                onClick={() => {
                  // Add logging for debugging
                  console.log("Processing payment with saved card:", savedCard);
                  console.log("Using saved card:", useSavedCard);
                  
                  // Process payment
                  setShowPaymentModal(false)
                  
                  // Get the latest competition data
                  const storedCompetitions = localStorage.getItem('competitions')
                  if (storedCompetitions && competition && teamToRegister) {
                    const allCompetitions = JSON.parse(storedCompetitions)
                    const competitionIndex = allCompetitions.findIndex(c => c.id === competition.id)
                    
                    if (competitionIndex !== -1) {
                      // Process team registration
                      const teamId = teamToRegister.id
                      
                      // Create paidTeams array if it doesn't exist
                      if (!allCompetitions[competitionIndex].paidTeams) {
                        allCompetitions[competitionIndex].paidTeams = []
                      }
                      
                      // Add to paid teams
                      allCompetitions[competitionIndex].paidTeams.push(teamId)
                      
                      // Register the team
                      registerTeam(teamId, allCompetitions, competitionIndex, teamToRegister)
                      
                      // Success message
                      setSuccessMessage(`Оплата успешно произведена. Команда ${teamToRegister.name} зарегистрирована на соревнование!`);
                      setTimeout(() => {
                        setSuccessMessage('');
                      }, 5000);
                      
                      // Save the new card if user chose to save it
                      if (!useSavedCard && user) {
                        const cardNumberInput = document.querySelector('input[placeholder="0000 0000 0000 0000"]') as HTMLInputElement;
                        const expiryInput = document.querySelector('input[placeholder="MM/YY"]') as HTMLInputElement;
                        const cvvInput = document.querySelector('input[placeholder="123"]') as HTMLInputElement;
                        const saveCardCheckbox = document.getElementById('saveCard') as HTMLInputElement;
                        
                        if (saveCardCheckbox?.checked && cardNumberInput && expiryInput && cvvInput) {
                          const cardNumber = cardNumberInput.value;
                          const expiry = expiryInput.value;
                          const cvv = cvvInput.value;
                          
                          if (cardNumber && expiry && cvv) {
                            // Save card to localStorage
                            const userCards = localStorage.getItem('userCards');
                            const cards = userCards ? JSON.parse(userCards) : [];
                            
                            // Check if user already has a card
                            const userCardIndex = cards.findIndex(card => card.userId === user.id);
                            
                            if (userCardIndex !== -1) {
                              // Update existing card
                              cards[userCardIndex] = {
                                userId: user.id,
                                cardNumber,
                                expiry,
                                cvv
                              };
                            } else {
                              // Add new card
                              cards.push({
                                userId: user.id,
                                cardNumber,
                                expiry,
                                cvv
                              });
                            }
                            
                            localStorage.setItem('userCards', JSON.stringify(cards));
                          }
                        }
                      }
                    }
                  }
                  
                  setTeamToRegister(null)
                }}
              >
                Оплатить
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isAdmin() && competition && (
        <div className="my-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaCreditCard className="mr-2 text-primary-600" /> Управление взносами и возвратами
          </h2>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Оплаченные команды</h3>
            {competition.paidTeams && competition.paidTeams.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {competition.paidTeams.map(teamId => {
                  const team = allTeams.find(t => t.id === teamId);
                  const isRefunded = competition.refundedTeams?.includes(teamId);
                  return (
                    <li key={teamId} className="flex items-center justify-between py-3">
                      <div>
                        <span className="font-medium">{team?.name || `Команда #${teamId}`}</span>
                        {isRefunded && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-red-100 text-red-700">Возврат</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-700 font-semibold">{competition.entryFee?.toLocaleString()} ₸</span>
                        {!isRefunded && (
                          <button
                            className="btn-outline btn-xs"
                            onClick={() => handleRefund(teamId)}
                          >
                            Оформить возврат
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-600">Нет оплаченных команд</p>
            )}
          </div>
          {competition.status === 'completed' && competition.prizePool && competition.prizePool > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Распределение призового фонда</h3>
              <button
                className="btn-primary mb-3"
                onClick={handleDistributePrizePool}
              >
                Распределить призовой фонд
              </button>
              {competition.prizeDistribution && competition.prizeDistribution.length > 0 && (
                <ul className="divide-y divide-gray-200">
                  {competition.prizeDistribution.map(prize => {
                    const team = allTeams.find(t => t.id === prize.teamId);
                    return (
                      <li key={prize.teamId} className="flex items-center justify-between py-2">
                        <span>{team?.name || `Команда #${prize.teamId}`}</span>
                        <span className="font-bold text-green-700">{prize.amount.toLocaleString()} ₸</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
      
      <Footer />
    </div>
  )
}

// ... existing code ...
