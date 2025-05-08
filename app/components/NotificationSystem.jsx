'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaBell, 
  FaTimes,
  FaTrash,
  FaEllipsisH,
  FaUserPlus,
  FaTrophy,
  FaClock
} from 'react-icons/fa';
import useSocket from '../hooks/useSocket';

export default function NotificationSystem({ isPopup = false }) {
  const [notifications, setNotifications] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification) => {
        addNotification(notification);
      });
    }

    // Добавляем примеры уведомлений для отображения в попапе
    if (isPopup && showAllNotifications.length === 0) {
      setShowAllNotifications([
        {
          id: 1,
          type: 'info',
          message: 'Новое соревнование "Хакатон 2024" открыто для регистрации',
          timestamp: new Date(Date.now() - 3600000 * 2), // 2 часа назад
          read: false,
          icon: <FaTrophy className="text-blue-500" />
        },
        {
          id: 2,
          type: 'success',
          message: 'Ваша команда "Победители" успешно зарегистрирована на соревнование',
          timestamp: new Date(Date.now() - 3600000 * 5), // 5 часов назад
          read: true,
          icon: <FaCheckCircle className="text-green-500" />
        },
        {
          id: 3,
          type: 'warning',
          message: 'До начала соревнования "Программирование 2024" осталось 2 дня',
          timestamp: new Date(Date.now() - 3600000 * 12), // 12 часов назад 
          read: false,
          icon: <FaClock className="text-yellow-500" />
        },
        {
          id: 4,
          type: 'info',
          message: 'Пользователь "Александр" отправил запрос на вступление в команду',
          timestamp: new Date(Date.now() - 3600000 * 24), // 1 день назад
          read: false,
          icon: <FaUserPlus className="text-blue-500" />
        },
        {
          id: 5,
          type: 'success',
          message: 'Поздравляем! Ваша команда заняла 2-е место в соревновании',
          timestamp: new Date(Date.now() - 3600000 * 48), // 2 дня назад
          read: true,
          icon: <FaTrophy className="text-green-500" />
        }
      ]);
    }

    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [socket, isPopup]);

  const addNotification = (notification) => {
    const id = Date.now();
    
    // Добавляем новое уведомление с уникальным ID
    setNotifications(prev => [
      ...prev,
      {
        id,
        ...notification,
        timestamp: new Date(),
      }
    ]);

    // Также добавляем в общий список уведомлений
    setShowAllNotifications(prev => [
      {
        id,
        ...notification,
        timestamp: new Date(),
        read: false
      },
      ...prev
    ]);

    // Автоматически удаляем через 5 секунд из окна уведомлений
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAsRead = (id) => {
    setShowAllNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setShowAllNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setShowAllNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setShowAllNotifications([]);
  };

  // Получить иконку на основе типа уведомления
  const getIcon = (type) => {
    switch (type) {
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  // Получить цвет фона на основе типа уведомления
  const getBackgroundColor = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  // Форматирование времени
  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // в минутах
    
    if (diff < 1) return 'Только что';
    if (diff < 60) return `${diff} мин. назад`;
    
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} ч. назад`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} д. назад`;
    
    return date.toLocaleDateString();
  };

  // Для всплывающих уведомлений
  if (!isPopup) {
    return (
      <div className="fixed top-5 right-5 z-50 space-y-2 w-96 max-w-full">
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`${getBackgroundColor(notification.type)} p-4 rounded-lg shadow-lg border flex items-start`}
            >
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 mr-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {notification.message}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(notification.timestamp)}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FaTimes />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  // Для попапа уведомлений
  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-[70vh] overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="font-semibold text-gray-700">Уведомления</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Прочитать все
          </button>
          <button 
            onClick={clearAllNotifications}
            className="text-gray-500 hover:text-red-500"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
        {showAllNotifications.length > 0 ? (
          showAllNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`border-b border-gray-100 p-3 hover:bg-gray-50 transition-colors ${notification.read ? 'opacity-70' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1">
                  {notification.icon || getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${notification.read ? 'font-normal' : 'font-semibold'}`}>
                    {notification.message}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      {formatTime(notification.timestamp)}
                    </p>
                    <div className="flex items-center">
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      )}
                      <button 
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <FaBell className="mx-auto text-gray-300 text-3xl mb-2" />
            <p>У вас нет уведомлений</p>
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-center">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Посмотреть все уведомления
        </button>
      </div>
    </div>
  );
} 