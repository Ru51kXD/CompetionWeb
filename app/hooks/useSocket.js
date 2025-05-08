'use client';

import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

export default function useSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Функция для инициализации Socket.io
    const initSocket = async () => {
      await fetch('/api/socket');
      
      const socketInstance = io();
      
      socketInstance.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected');
      });
      
      socketInstance.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });
      
      setSocket(socketInstance);
    };

    if (!socket) {
      initSocket();
    }

    // Очистка при размонтировании компонента
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // Функция для подключения к соревнованию
  const joinCompetition = useCallback((competitionId) => {
    if (socket && isConnected) {
      socket.emit('join-competition', competitionId);
    }
  }, [socket, isConnected]);

  // Функция для подключения к команде
  const joinTeam = useCallback((teamId) => {
    if (socket && isConnected) {
      socket.emit('join-team', teamId);
    }
  }, [socket, isConnected]);

  // Функция для отправки сообщения команде
  const sendTeamMessage = useCallback((teamId, message, sender) => {
    if (socket && isConnected) {
      socket.emit('team-message', { teamId, message, sender });
    }
  }, [socket, isConnected]);

  // Функция для отправки обновлений результатов
  const updateResults = useCallback((competitionId, results) => {
    if (socket && isConnected) {
      socket.emit('update-results', { competitionId, results });
    }
  }, [socket, isConnected]);

  // Функция для отправки системных уведомлений
  const sendNotification = useCallback((type, target, message) => {
    if (socket && isConnected) {
      socket.emit('system-notification', { type, target, message });
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    joinCompetition,
    joinTeam,
    sendTeamMessage,
    updateResults,
    sendNotification
  };
} 