'use client';

import { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  FaUsers, 
  FaTrophy, 
  FaCalendarAlt, 
  FaChartLine,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus
} from 'react-icons/fa';
import useSocket from '../../hooks/useSocket';

// Регистрируем необходимые компоненты для ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompetitions: 0,
    totalTeams: 0,
    upcomingEvents: 0
  });
  const [competitions, setCompetitions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const { socket, sendNotification } = useSocket();

  // Имитация загрузки данных
  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      setStats({
        totalUsers: 124,
        totalCompetitions: 8,
        totalTeams: 32,
        upcomingEvents: 3
      });

      setCompetitions([
        { id: 1, name: 'Чемпионат по программированию 2023', date: '2023-11-15', participants: 42, status: 'completed' },
        { id: 2, name: 'Хакатон Web Development', date: '2023-12-20', participants: 36, status: 'upcoming' },
        { id: 3, name: 'AI Challenge Spring 2024', date: '2024-03-10', participants: 28, status: 'upcoming' },
        { id: 4, name: 'Киберспортивный турнир', date: '2024-01-15', participants: 64, status: 'registration' },
        { id: 5, name: 'Summer Code Jam', date: '2024-06-01', participants: 0, status: 'draft' }
      ]);

      setTeams([
        { id: 1, name: 'Code Warriors', members: 4, competitions: 3, wins: 1 },
        { id: 2, name: 'Byte Busters', members: 3, competitions: 5, wins: 2 },
        { id: 3, name: 'Algorithm Angels', members: 5, competitions: 2, wins: 0 },
        { id: 4, name: 'Data Dragons', members: 4, competitions: 4, wins: 1 }
      ]);

      setUsers([
        { id: 1, name: 'Иван Петров', email: 'ivan@example.com', role: 'user', teams: 1, status: 'active' },
        { id: 2, name: 'Мария Сидорова', email: 'maria@example.com', role: 'admin', teams: 2, status: 'active' },
        { id: 3, name: 'Алексей Иванов', email: 'alexey@example.com', role: 'user', teams: 1, status: 'inactive' },
        { id: 4, name: 'Елена Смирнова', email: 'elena@example.com', role: 'moderator', teams: 0, status: 'active' }
      ]);
    }, 1000);
  }, []);

  // Данные для графика участников
  const participantData = {
    labels: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль'],
    datasets: [
      {
        label: 'Новые участники',
        data: [12, 19, 15, 29, 32, 25, 36],
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        tension: 0.4
      }
    ]
  };

  // Данные для графика соревнований
  const competitionData = {
    labels: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль'],
    datasets: [
      {
        label: 'Соревнования',
        data: [1, 2, 1, 3, 2, 1, 2],
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1
      }
    ]
  };

  // Данные для графика типа соревнований
  const competitionTypeData = {
    labels: ['Программирование', 'Дизайн', 'Data Science', 'Киберспорт', 'Мобильная разработка'],
    datasets: [
      {
        data: [35, 20, 15, 20, 10],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(79, 70, 229, 0.8)',
          'rgba(67, 56, 202, 0.8)',
          'rgba(55, 48, 163, 0.8)',
          'rgba(49, 46, 129, 0.8)'
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(79, 70, 229, 1)',
          'rgba(67, 56, 202, 1)',
          'rgba(55, 48, 163, 1)',
          'rgba(49, 46, 129, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Обработчик отправки тестового уведомления
  const sendTestNotification = (type) => {
    const messages = {
      info: 'Информация: скоро открывается регистрация на новое соревнование!',
      success: 'Успех! Новая команда успешно зарегистрирована.',
      warning: 'Внимание! До закрытия регистрации осталось 24 часа.',
      error: 'Ошибка! Произошла проблема с сервером соревнований.'
    };
    
    sendNotification(type, 'all', messages[type]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Панель администратора</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => sendTestNotification('info')}
              className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200"
            >
              Тест инфо
            </button>
            <button 
              onClick={() => sendTestNotification('success')}
              className="px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
            >
              Тест успех
            </button>
            <button 
              onClick={() => sendTestNotification('warning')}
              className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200"
            >
              Тест предупр.
            </button>
            <button 
              onClick={() => sendTestNotification('error')}
              className="px-3 py-2 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
            >
              Тест ошибка
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Статистические карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex items-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4">
              <FaUsers className="text-primary-600 dark:text-primary-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Пользователей</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex items-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4">
              <FaTrophy className="text-primary-600 dark:text-primary-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Соревнований</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCompetitions}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex items-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4">
              <FaUsers className="text-primary-600 dark:text-primary-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Команд</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTeams}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex items-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4">
              <FaCalendarAlt className="text-primary-600 dark:text-primary-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Предстоящих событий</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.upcomingEvents}</p>
            </div>
          </div>
        </div>

        {/* Переключатель вкладок */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
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
              onClick={() => setActiveTab('teams')}
              className={`pb-4 px-1 font-medium text-sm ${
                activeTab === 'teams'
                  ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Команды
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-1 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Пользователи
            </button>
          </nav>
        </div>

        {/* Содержимое вкладок */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Регистрация пользователей</h2>
                <div className="h-80">
                  <Line
                    data={participantData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(156, 163, 175, 0.1)'
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                          labels: {
                            boxWidth: 12
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Соревнования по месяцам</h2>
                <div className="h-80">
                  <Bar
                    data={competitionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(156, 163, 175, 0.1)'
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                          labels: {
                            boxWidth: 12
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Распределение по типам</h2>
                <div className="h-80 flex justify-center items-center">
                  <div className="w-64 h-64">
                    <Doughnut
                      data={competitionTypeData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              boxWidth: 12
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 col-span-1 lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Ближайшие события</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Название</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Дата</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Участники</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Статус</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {competitions.filter(comp => comp.status === 'upcoming').map(competition => (
                        <tr key={competition.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{competition.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(competition.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{competition.participants}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                              Предстоящее
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitions' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Управление соревнованиями</h2>
              <button className="btn-primary flex items-center space-x-2">
                <FaPlus />
                <span>Создать соревнование</span>
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Название</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Дата</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Участники</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Статус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {competitions.map(competition => (
                    <tr key={competition.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{competition.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(competition.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{competition.participants}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${competition.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : 
                          competition.status === 'upcoming' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' :
                          competition.status === 'registration' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'}`}>
                          {competition.status === 'completed' ? 'Завершено' : 
                          competition.status === 'upcoming' ? 'Предстоящее' :
                          competition.status === 'registration' ? 'Регистрация' : 'Черновик'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <FaEye />
                          </button>
                          <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                            <FaEdit />
                          </button>
                          <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Управление командами</h2>
              <button className="btn-primary flex items-center space-x-2">
                <FaPlus />
                <span>Создать команду</span>
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Название</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Участники</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Соревнования</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Победы</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {teams.map(team => (
                    <tr key={team.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{team.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{team.members}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{team.competitions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{team.wins}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <FaEye />
                          </button>
                          <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                            <FaEdit />
                          </button>
                          <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Управление пользователями</h2>
              <button className="btn-primary flex items-center space-x-2">
                <FaPlus />
                <span>Добавить пользователя</span>
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Имя</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Роль</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Команды</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Статус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-400' : 
                          user.role === 'moderator' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                          {user.role === 'admin' ? 'Администратор' : 
                          user.role === 'moderator' ? 'Модератор' : 'Пользователь'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.teams}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' : 
                          'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'}`}>
                          {user.status === 'active' ? 'Активен' : 'Неактивен'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <FaEye />
                          </button>
                          <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                            <FaEdit />
                          </button>
                          <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 