'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaTrophy, 
  FaMedal, 
  FaStar, 
  FaUsers, 
  FaCalendarAlt, 
  FaChartLine,
  FaBadgeCheck,
  FaCode,
  FaGraduationCap,
  FaBrain,
  FaGamepad,
  FaLaptopCode,
  FaCertificate,
  FaCheck
} from 'react-icons/fa';

export default function UserProfile({ params }) {
  const { userId } = params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Имитация получения данных пользователя
  useEffect(() => {
    // В реальном приложении здесь был бы запрос к API
    setTimeout(() => {
      setUser({
        id: userId,
        name: 'Александр Иванов',
        email: 'alex@example.com',
        avatar: null, // URL аватара
        role: 'user',
        joinDate: '2023-01-15',
        location: 'Москва, Россия',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Data Science'],
        bio: 'Разработчик с 5-летним опытом в веб-разработке. Увлекаюсь алгоритмами и участвую в соревнованиях по программированию с 2020 года.',
        social: {
          github: 'https://github.com/example',
          linkedin: 'https://linkedin.com/in/example',
          twitter: 'https://twitter.com/example'
        },
        stats: {
          competitions: 12,
          wins: 3,
          rating: 1850,
          achievements: 8,
          teams: 4
        },
        competitions: [
          { 
            id: 1, 
            name: 'Чемпионат по программированию 2023', 
            date: '2023-11-15', 
            result: 1, 
            type: 'programming',
            teamName: 'Code Warriors',
            score: 950,
            outOf: 1000,
            certificate: true
          },
          { 
            id: 2, 
            name: 'Хакатон Web Development', 
            date: '2023-08-20', 
            result: 5, 
            type: 'web',
            teamName: 'React Masters',
            score: 820,
            outOf: 1000,
            certificate: true
          },
          { 
            id: 3, 
            name: 'AI Challenge Spring 2023', 
            date: '2023-04-10', 
            result: 12, 
            type: 'ai',
            teamName: 'Neural Network',
            score: 740,
            outOf: 1000,
            certificate: false
          },
          { 
            id: 4, 
            name: 'Киберспортивный турнир', 
            date: '2023-02-15', 
            result: 8, 
            type: 'gaming',
            teamName: 'Cyber Squad',
            score: 640,
            outOf: 1000,
            certificate: false
          },
          { 
            id: 5, 
            name: 'Mobile App Jam 2022', 
            date: '2022-12-05', 
            result: 2, 
            type: 'mobile',
            teamName: 'App Wizards',
            score: 900,
            outOf: 1000,
            certificate: true
          }
        ],
        achievements: [
          {
            id: 1,
            name: 'Победитель соревнования',
            description: 'Победа в "Чемпионат по программированию 2023"',
            icon: 'trophy',
            date: '2023-11-15',
            type: 'gold'
          },
          {
            id: 2,
            name: 'Серебряный призер',
            description: 'Второе место в "Mobile App Jam 2022"',
            icon: 'medal',
            date: '2022-12-05',
            type: 'silver'
          },
          {
            id: 3,
            name: 'Мастер алгоритмов',
            description: 'Решено более 100 алгоритмических задач',
            icon: 'code',
            date: '2023-03-10',
            type: 'achievement'
          },
          {
            id: 4,
            name: 'Командный игрок',
            description: 'Участие в 5+ соревнованиях в составе команды',
            icon: 'users',
            date: '2023-08-20',
            type: 'achievement'
          },
          {
            id: 5,
            name: 'Постоянный участник',
            description: 'Участие в соревнованиях в течение 2+ лет подряд',
            icon: 'calendar',
            date: '2023-01-01',
            type: 'achievement'
          }
        ],
        teams: [
          {
            id: 1,
            name: 'Code Warriors',
            role: 'Капитан',
            members: 4,
            competitions: 3,
            active: true
          },
          {
            id: 2,
            name: 'React Masters',
            role: 'Участник',
            members: 3,
            competitions: 2,
            active: true
          },
          {
            id: 3,
            name: 'Neural Network',
            role: 'Участник',
            members: 5,
            competitions: 1,
            active: false
          },
          {
            id: 4,
            name: 'Cyber Squad',
            role: 'Участник',
            members: 3,
            competitions: 1,
            active: false
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [userId]);

  // Функция для получения иконки по типу соревнования
  const getCompetitionIcon = (type) => {
    switch (type) {
      case 'programming':
        return <FaCode className="text-blue-500" />;
      case 'web':
        return <FaLaptopCode className="text-purple-500" />;
      case 'ai':
        return <FaBrain className="text-green-500" />;
      case 'gaming':
        return <FaGamepad className="text-red-500" />;
      case 'mobile':
        return <FaLaptopCode className="text-orange-500" />;
      default:
        return <FaCode className="text-gray-500" />;
    }
  };

  // Функция для получения иконки по типу достижения
  const getAchievementIcon = (icon) => {
    switch (icon) {
      case 'trophy':
        return <FaTrophy className="text-yellow-500" />;
      case 'medal':
        return <FaMedal className="text-gray-400" />;
      case 'star':
        return <FaStar className="text-yellow-500" />;
      case 'badge':
        return <FaBadgeCheck className="text-blue-500" />;
      case 'code':
        return <FaCode className="text-purple-500" />;
      case 'users':
        return <FaUsers className="text-green-500" />;
      case 'calendar':
        return <FaCalendarAlt className="text-red-500" />;
      default:
        return <FaStar className="text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pb-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Пользователь не найден</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Пользователь с ID {userId} не существует или был удален.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Профиль пользователя - верхняя часть */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="md:flex">
              <div className="p-6 md:p-8 flex-1">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-4xl border-4 border-white dark:border-gray-700 shadow-md">
                        <FaUser />
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{user.location}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 md:p-8 md:w-64 lg:w-80">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Статистика</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mr-3">
                      <FaCalendarAlt className="text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Участие в соревнованиях</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.stats.competitions}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded-full mr-3">
                      <FaTrophy className="text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Победы</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.stats.wins}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full mr-3">
                      <FaChartLine className="text-purple-500 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Рейтинг</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.stats.rating}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full mr-3">
                      <FaUsers className="text-green-500 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Команды</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.stats.teams}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full mr-3">
                      <FaMedal className="text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Достижения</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.stats.achievements}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Участник с {new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Вкладки */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-1 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Обзор
              </button>
              <button
                onClick={() => setActiveTab('competitions')}
                className={`pb-4 px-1 font-medium text-sm ${
                  activeTab === 'competitions'
                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Соревнования
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`pb-4 px-1 font-medium text-sm ${
                  activeTab === 'achievements'
                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Достижения
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`pb-4 px-1 font-medium text-sm ${
                  activeTab === 'teams'
                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Команды
              </button>
            </nav>
          </div>

          {/* Содержимое вкладок */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Обзор */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Последние соревнования</h2>
                    <div className="space-y-4">
                      {user.competitions.slice(0, 3).map((competition) => (
                        <div key={competition.id} className="flex items-start bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="mr-4 mt-1">
                            {getCompetitionIcon(competition.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{competition.name}</h3>
                            <div className="flex flex-wrap items-center gap-x-4 mt-1 text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                {new Date(competition.date).toLocaleDateString()}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                Команда: {competition.teamName}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${
                              competition.result <= 3 ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'
                            }`}>
                              {competition.result === 1 ? '1-е место' : 
                               competition.result === 2 ? '2-е место' : 
                               competition.result === 3 ? '3-е место' : 
                               `${competition.result}-е место`}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Счет: {competition.score}/{competition.outOf}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <button 
                        onClick={() => setActiveTab('competitions')}
                        className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                      >
                        Посмотреть все соревнования
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Текущие команды</h2>
                    <div className="space-y-4">
                      {user.teams.filter(team => team.active).map((team) => (
                        <div key={team.id} className="flex items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="mr-4 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                            {team.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{team.name}</h3>
                            <div className="flex items-center gap-x-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <span>{team.role}</span>
                              <span>•</span>
                              <span>{team.members} участников</span>
                            </div>
                          </div>
                          <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                            Активная
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <button 
                        onClick={() => setActiveTab('teams')}
                        className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                      >
                        Посмотреть все команды
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Достижения</h2>
                    <div className="space-y-4">
                      {user.achievements.slice(0, 3).map((achievement) => (
                        <div key={achievement.id} className="flex items-start">
                          <div className={`mr-3 p-2 rounded-full ${
                            achievement.type === 'gold' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                            achievement.type === 'silver' ? 'bg-gray-100 dark:bg-gray-700' :
                            'bg-blue-100 dark:bg-blue-900/20'
                          }`}>
                            {getAchievementIcon(achievement.icon)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <button 
                        onClick={() => setActiveTab('achievements')}
                        className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                      >
                        Посмотреть все достижения
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Навыки</h2>
                    <div className="space-y-3">
                      {user.skills.map((skill, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary-600 mr-2"></div>
                          <span className="text-gray-800 dark:text-gray-200">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Соревнования */}
            {activeTab === 'competitions' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">История соревнований</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Полная история участия в соревнованиях
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Соревнование
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Дата
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Команда
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Результат
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Счет
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Сертификат
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {user.competitions.map((competition) => (
                        <tr key={competition.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 mr-3">
                                {getCompetitionIcon(competition.type)}
                              </div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {competition.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(competition.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {competition.teamName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              competition.result === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 
                              competition.result === 2 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : 
                              competition.result === 3 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' : 
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            }`}>
                              {competition.result === 1 ? '1-е место' : 
                               competition.result === 2 ? '2-е место' : 
                               competition.result === 3 ? '3-е место' : 
                               `${competition.result}-е место`}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {competition.score}/{competition.outOf}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {competition.certificate ? (
                              <span className="text-green-600 dark:text-green-400 flex items-center">
                                <FaCertificate className="mr-1" />
                                Есть
                              </span>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">Нет</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Достижения */}
            {activeTab === 'achievements' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Доска достижений</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`flex items-start p-4 rounded-lg border ${
                        achievement.type === 'gold' ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10' :
                        achievement.type === 'silver' ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30' :
                        'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10'
                      }`}
                    >
                      <div className={`mr-4 p-3 rounded-full ${
                        achievement.type === 'gold' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                        achievement.type === 'silver' ? 'bg-gray-100 dark:bg-gray-700' :
                        'bg-blue-100 dark:bg-blue-900/20'
                      }`}>
                        {getAchievementIcon(achievement.icon)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{achievement.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{achievement.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                          Получено: {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Команды */}
            {activeTab === 'teams' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Мои команды</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.teams.map((team) => (
                    <div 
                      key={team.id} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <div className={`p-4 ${team.active ? 'bg-primary-50 dark:bg-primary-900/10 border-b border-primary-100 dark:border-primary-800' : 'bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600'}`}>
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{team.name}</h3>
                          {team.active ? (
                            <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                              Активная
                            </span>
                          ) : (
                            <span className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                              Неактивная
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-white">Роль:</span> {team.role}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-white">Участников:</span> {team.members}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <span className="font-medium text-gray-900 dark:text-white">Соревнований:</span> {team.competitions}
                        </div>
                        <button className="w-full py-2 px-4 border border-primary-300 dark:border-primary-700 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors duration-200 text-sm font-medium">
                          Просмотреть команду
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 