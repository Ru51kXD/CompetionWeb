'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaBell, 
  FaTimes 
} from 'react-icons/fa';
import useSocket from '../hooks/useSocket';

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification) => {
        addNotification(notification);
      });
    }

    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [socket]);

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

    // Автоматически удаляем через 5 секунд
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
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
                {new Date(notification.timestamp).toLocaleTimeString()}
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