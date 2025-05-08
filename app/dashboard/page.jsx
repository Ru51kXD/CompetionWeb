'use client';

import { useState, lazy, Suspense } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSocket } from '../hooks/useSocket';
import { motion } from 'framer-motion';
import { 
  FaTrophy, 
  FaCalendarAlt, 
  FaUsers, 
  FaChartLine, 
  FaMedal, 
  FaBell, 
  FaMapMarkerAlt,
  FaChess,
  FaRunning,
  FaSwimmer,
  FaBiking,
  FaBrain,
  FaCode,
  FaPalette
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

// Ленивая загрузка тяжелых компонентов
const LeaderboardRealtime = lazy(() => import('../components/LeaderboardRealtime'));
const NotificationSystem = lazy(() => import('../components/NotificationSystem'));
const CompetitionsMap = lazy(() => import('../components/CompetitionsMap'));
const TeamChat = lazy(() => import('../components/TeamChat'));
const ScheduleGenerator = lazy(() => import('../components/ScheduleGenerator'));
const ActivityChart = lazy(() => import('../components/ActivityChart'));

// Компонент загрузки
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { sendNotification } = useSocket();

  // Заглушки данных для компонентов
  const competitionId = "comp-123";
  const currentUser = {
    id: "user-1",
    name: "Александр Петров",
    avatar: null,
    role: "admin",
    stats: {
      totalCompetitions: 15,
      wins: 8,
      rating: 1250,
      teams: 3,
      achievements: 12,
      activityScore: 85
    },
    recentAchievements: [
      {
        id: 1,
        name: "Первая победа",
        type: "gold",
        date: "2024-03-15",
        icon: "trophy"
      },
      {
        id: 2,
        name: "Активный участник",
        type: "silver",
        date: "2024-03-10",
        icon: "star"
      },
      {
        id: 3,
        name: "Командный игрок",
        type: "bronze",
        date: "2024-03-05",
        icon: "users"
      }
    ],
    upcomingCompetitions: [
      {
        id: 1,
        name: "Шахматный турнир",
        date: "2024-04-01",
        type: "individual",
        sportType: "chess",
        status: "upcoming"
      },
      {
        id: 2,
        name: "Командное программирование",
        date: "2024-04-15",
        type: "team",
        status: "upcoming"
      }
    ],
    activityData: [
      { date: "2024-03-01", score: 65 },
      { date: "2024-03-08", score: 75 },
      { date: "2024-03-15", score: 85 },
      { date: "2024-03-22", score: 80 },
      { date: "2024-03-29", score: 90 }
    ]
  };
  
  const teamId = "team-1";
  const teamName = "Code Warriors";
  
  const teamMembers = [
    { id: "user-1", name: "Александр Петров", role: "Капитан", status: "online", avatar: null },
    { id: "user-2", name: "Мария Иванова", role: "Разработчик", status: "online", avatar: null },
    { id: "user-3", name: "Дмитрий Сидоров", role: "Дизайнер", status: "offline", avatar: null },
    { id: "user-4", name: "Анна Кузнецова", role: "Тестировщик", status: "online", avatar: null }
  ];
  
  const initialMessages = [
    { id: 1, message: "Добро пожаловать в командный чат!", sender: "system", timestamp: new Date(Date.now() - 3600000 * 5) },
    { id: 2, message: "Привет всем! Готовы к соревнованию?", sender: { id: "user-1", name: "Александр Петров" }, timestamp: new Date(Date.now() - 3600000 * 4) },
    { id: 3, message: "Да, я подготовила презентацию нашего проекта", sender: { id: "user-2", name: "Мария Иванова" }, timestamp: new Date(Date.now() - 3600000 * 3) },
    { id: 4, message: "Отлично! Я закончил дизайн интерфейса", sender: { id: "user-3", name: "Дмитрий Сидоров" }, timestamp: new Date(Date.now() - 3600000 * 2) }
  ];
  
  const leaderboardData = [
    { id: 1, name: "Code Warriors", category: "Web Development", score: 950, status: "active", avatar: null },
    { id: 2, name: "Data Dragons", category: "Data Science", score: 920, status: "active", avatar: null },
    { id: 3, name: "Algorithm Angels", category: "Algorithms", score: 880, status: "active", avatar: null },
    { id: 4, name: "React Masters", category: "Web Development", score: 820, status: "active", avatar: null },
    { id: 5, name: "Python Pandas", category: "Data Science", score: 780, status: "active", avatar: null },
    { id: 6, name: "Unity Wizards", category: "Game Development", score: 750, status: "active", avatar: null }
  ];
  
  const scheduleCompetition = {
    id: "comp-123",
    name: "Хакатон AI Challenge 2023",
    startDate: "2023-12-15",
    endDate: "2023-12-17",
    type: "team"
  };
  
  const scheduleParticipants = [
    { id: "team-1", name: "Code Warriors" },
    { id: "team-2", name: "Data Dragons" },
    { id: "team-3", name: "Algorithm Angels" },
    { id: "team-4", name: "React Masters" }
  ];
  
  const scheduleRooms = [
    { id: "room-1", name: "Конференц-зал A" },
    { id: "room-2", name: "Конференц-зал B" },
    { id: "room-3", name: "Аудитория 101" }
  ];

  // Функция для отправки тестового уведомления
  const sendTestNotification = (type) => {
    const notificationMessages = {
      info: "Информация: До начала соревнования осталось 3 дня",
      success: "Поздравляем! Ваша команда перешла в следующий этап",
      warning: "Внимание! Заканчивается время для сдачи проекта",
      error: "Ошибка! Произошла проблема с загрузкой файла"
    };

    if (sendNotification) {
      sendNotification(type, 'all', notificationMessages[type]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <NotificationSystem />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Заголовок и навигация */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Личный кабинет</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Добро пожаловать, {currentUser.name}! Здесь вы можете управлять своими соревнованиями и следить за активностью.
              </p>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                    <FaTrophy className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Всего соревнований</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentUser.stats.totalCompetitions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                    <FaMedal className="text-green-600 dark:text-green-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Победы</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentUser.stats.wins}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                    <FaChartLine className="text-purple-600 dark:text-purple-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Рейтинг</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentUser.stats.rating}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full mr-4">
                    <FaUsers className="text-yellow-600 dark:text-yellow-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Команды</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentUser.stats.teams}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Основной контент */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Левая колонка */}
              <div className="lg:col-span-2 space-y-8">
                {/* Предстоящие соревнования */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Предстоящие соревнования</h2>
                    <Link href="/dashboard/my-competitions" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                      Все соревнования
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {currentUser.upcomingCompetitions.map((competition) => (
                      <div key={competition.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex-shrink-0 mr-4">
                          {competition.type === 'individual' && competition.sportType === 'chess' && (
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <FaChess className="text-blue-600 dark:text-blue-400 text-xl" />
                            </div>
                          )}
                          {competition.type === 'team' && (
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                              <FaUsers className="text-green-600 dark:text-green-400 text-xl" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{competition.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(competition.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                            {competition.type === 'individual' ? 'Индивидуальное' : 'Командное'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* График активности */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Активность</h2>
                  <div className="h-64">
                    <Suspense fallback={<LoadingSpinner />}>
                      <ActivityChart data={currentUser.activityData} />
                    </Suspense>
                  </div>
                </div>
              </div>

              {/* Правая колонка */}
              <div className="space-y-8">
                {/* Последние достижения */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Последние достижения</h2>
                    <Link href="/profile" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                      Все достижения
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {currentUser.recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start">
                        <div className={`mr-3 p-2 rounded-full ${
                          achievement.type === 'gold' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                          achievement.type === 'silver' ? 'bg-gray-100 dark:bg-gray-700' :
                          'bg-blue-100 dark:bg-blue-900/20'
                        }`}>
                          {achievement.icon === 'trophy' && <FaTrophy className="text-yellow-600 dark:text-yellow-400" />}
                          {achievement.icon === 'star' && <FaStar className="text-gray-600 dark:text-gray-400" />}
                          {achievement.icon === 'users' && <FaUsers className="text-blue-600 dark:text-blue-400" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Командный чат */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Командный чат</h2>
                  <Suspense fallback={<LoadingSpinner />}>
                    <TeamChat
                      teamId={teamId}
                      teamName={teamName}
                      currentUser={currentUser}
                      initialMembers={teamMembers}
                      initialMessages={[]}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 