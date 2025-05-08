'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserCircle, 
  FaPaperPlane, 
  FaFile, 
  FaImage, 
  FaLock, 
  FaUsers,
  FaPaperclip
} from 'react-icons/fa';
import useSocket from '../hooks/useSocket';

export default function TeamChat({ teamId, teamName, currentUser, initialMembers = [], initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [members, setMembers] = useState(initialMembers);
  const [isLoading, setIsLoading] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { socket, isConnected, joinTeam, sendTeamMessage } = useSocket();

  // Присоединяемся к каналу команды при загрузке
  useEffect(() => {
    if (isConnected && teamId) {
      joinTeam(teamId);
    }
  }, [isConnected, teamId, joinTeam]);

  // Слушаем входящие сообщения
  useEffect(() => {
    if (socket) {
      socket.on('new-team-message', (messageData) => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          ...messageData,
          timestamp: new Date(messageData.timestamp)
        }]);
      });
      
      // Слушаем уведомления, относящиеся к команде
      socket.on('notification', (notificationData) => {
        if (notificationData.target === `team-${teamId}`) {
          // Добавляем системное сообщение
          setMessages(prev => [...prev, {
            id: Date.now(),
            message: notificationData.message,
            sender: 'system',
            timestamp: new Date(),
            type: notificationData.type
          }]);
        }
      });
    }
    
    return () => {
      if (socket) {
        socket.off('new-team-message');
        socket.off('notification');
      }
    };
  }, [socket, teamId]);

  // Прокрутка до последнего сообщения при добавлении новых
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Отправка сообщения
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    if (sendTeamMessage) {
      sendTeamMessage(teamId, newMessage, currentUser);
    }
    
    // Также добавляем сообщение локально (будет заменено при получении через сокет)
    setMessages(prev => [...prev, {
      id: Date.now(),
      message: newMessage,
      sender: currentUser,
      timestamp: new Date(),
      isLocal: true // Метка для локально добавленного сообщения
    }]);
    
    setNewMessage('');
  };

  // Обработка прикрепления файлов
  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    
    // Имитация загрузки файла
    setTimeout(() => {
      const file = files[0];
      const isImage = file.type.startsWith('image/');
      
      // Добавляем сообщение с прикрепленным файлом
      const fileMessage = {
        id: Date.now(),
        message: isImage ? `Изображение: ${file.name}` : `Файл: ${file.name}`,
        sender: currentUser,
        timestamp: new Date(),
        attachment: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: '#', // В реальном приложении здесь будет URL загруженного файла
          isImage
        }
      };
      
      setMessages(prev => [...prev, fileMessage]);
      setIsLoading(false);
      
      // В реальном приложении здесь будет загрузка файла на сервер и отправка через WebSocket
    }, 1500);
    
    // Сбрасываем значение input для возможности повторной загрузки того же файла
    e.target.value = '';
  };

  // Форматирование даты сообщения
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Форматирование даты для группировки сообщений по дням
  const formatMessageDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Вычисление размера файла для отображения
  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Группировка сообщений по дням
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatMessageDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
      {/* Заголовок чата */}
      <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <FaLock className="mr-2" />
          <h2 className="text-lg font-semibold">Команда: {teamName}</h2>
        </div>
        <button 
          onClick={() => setShowMembers(!showMembers)}
          className="bg-primary-700 hover:bg-primary-800 p-2 rounded-full focus:outline-none transition-colors duration-200"
        >
          <FaUsers className="text-white" />
        </button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Основной чат */}
        <div className="flex-1 flex flex-col">
          {/* Область сообщений */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Object.keys(groupedMessages).map(date => (
              <div key={date}>
                <div className="text-center mb-4">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                    {date}
                  </span>
                </div>
                
                {groupedMessages[date].map(message => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 ${
                      message.sender === currentUser.id ? 'justify-end' : 'justify-start'
                    } ${message.isLocal ? 'opacity-70' : 'opacity-100'}`}
                  >
                    {message.sender !== 'system' && message.sender !== currentUser.id && (
                      <div className="flex-shrink-0">
                        {message.sender.avatar ? (
                          <img 
                            src={message.sender.avatar} 
                            alt="User Avatar" 
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <FaUserCircle className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] ${
                      message.sender === 'system' ? 'bg-gray-100 dark:bg-gray-700 mx-auto' :
                      message.sender === currentUser.id ? 'bg-primary-100 dark:bg-primary-900/30 ml-auto' : 
                      'bg-gray-100 dark:bg-gray-700'
                    } rounded-lg p-3 shadow-sm`}>
                      {message.sender !== 'system' && message.sender !== currentUser.id && (
                        <div className="font-medium text-primary-600 dark:text-primary-400 text-sm mb-1">
                          {typeof message.sender === 'object' ? message.sender.name : message.sender}
                        </div>
                      )}
                      
                      {message.attachment && (
                        <div className="mb-2">
                          {message.attachment.isImage ? (
                            <div className="relative">
                              <div className="bg-gray-200 dark:bg-gray-600 rounded-lg h-40 flex items-center justify-center mb-2">
                                <FaImage className="text-gray-400 text-xl" />
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {message.attachment.name} ({formatFileSize(message.attachment.size)})
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center">
                              <FaFile className="text-gray-400 mr-2" />
                              <div className="flex-1">
                                <div className="text-sm text-gray-800 dark:text-gray-200 font-medium truncate">
                                  {message.attachment.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatFileSize(message.attachment.size)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className={`text-sm ${
                        message.sender === 'system' ? 'text-center font-medium text-gray-600 dark:text-gray-300' :
                        message.sender === currentUser.id ? 'text-gray-800 dark:text-gray-200' : 
                        'text-gray-800 dark:text-gray-200'
                      }`}>
                        {message.message}
                      </div>
                      
                      <div className="text-right text-xs text-gray-400 mt-1">
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                    
                    {message.sender === currentUser.id && (
                      <div className="flex-shrink-0">
                        {currentUser.avatar ? (
                          <img 
                            src={currentUser.avatar} 
                            alt="User Avatar" 
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <FaUserCircle className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Форма отправки сообщения */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <button 
                type="button"
                onClick={handleFileAttach}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-2"
              >
                <FaPaperclip />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Введите сообщение..."
                className="input flex-1 py-2"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isLoading}
                className="flex-shrink-0 ml-2 p-2 bg-primary-600 hover:bg-primary-700 rounded-full text-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaPaperPlane />
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Список участников (отображается по клику) */}
        <AnimatePresence>
          {showMembers && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden"
            >
              <div className="p-4">
                <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Участники ({members.length})</h3>
                <div className="space-y-3">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center">
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      ) : (
                        <FaUserCircle className="w-8 h-8 text-gray-400 mr-3" />
                      )}
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                          {member.name}
                          {member.id === currentUser.id ? ' (вы)' : ''}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {member.role}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <span className={`w-3 h-3 rounded-full inline-block ${
                          member.status === 'online' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 