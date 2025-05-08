'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSocket from '../hooks/useSocket';

export default function LeaderboardRealtime({ competitionId, initialData = [] }) {
  const [leaderboardData, setLeaderboardData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const { socket, isConnected, joinCompetition } = useSocket();

  // Подключиться к соревнованию при монтировании
  useEffect(() => {
    if (isConnected && competitionId) {
      joinCompetition(competitionId);
      setIsLoading(false);
    }
  }, [isConnected, competitionId, joinCompetition]);

  // Слушатель обновлений результатов
  useEffect(() => {
    if (socket) {
      // Слушаем обновления данных таблицы лидеров
      socket.on('results-updated', (results) => {
        setLeaderboardData(prevData => {
          // Сортируем по очкам
          const newData = [...results].sort((a, b) => b.score - a.score);
          return newData;
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('results-updated');
      }
    };
  }, [socket]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 bg-primary-600 text-white">
        <h2 className="text-xl font-bold">Таблица лидеров</h2>
        <p className="text-sm opacity-80">Обновляется в реальном времени</p>
      </div>

      <AnimatePresence>
        <motion.div
          className="overflow-x-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Позиция
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Участник/Команда
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Счет
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {leaderboardData.map((participant, index) => (
                <motion.tr 
                  key={participant.id} 
                  className={`${index < 3 ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                  variants={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`
                        flex items-center justify-center h-8 w-8 rounded-full 
                        ${index === 0 ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 
                          index === 1 ? 'bg-gray-100 text-gray-800 border border-gray-300' :
                          index === 2 ? 'bg-amber-100 text-amber-800 border border-amber-300' : 
                          'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'}
                      `}>
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {participant.avatar ? (
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={participant.avatar} 
                            alt="" 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700">
                            {participant.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {participant.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {participant.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.div 
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                      key={participant.score}
                      initial={{ scale: 1.5, color: '#4f46e5' }}
                      animate={{ scale: 1, color: '' }}
                      transition={{ duration: 0.5 }}
                    >
                      {participant.score}
                    </motion.div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${participant.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' : 
                        participant.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400' : 
                        'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'}
                    `}>
                      {participant.status === 'active' ? 'Активен' : 
                        participant.status === 'pending' ? 'Ожидание' : 'Завершил'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 