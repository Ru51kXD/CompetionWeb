import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  // Обработка соединений
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Обработка событий соревнований
    socket.on('join-competition', (competitionId) => {
      socket.join(`competition-${competitionId}`);
      console.log(`${socket.id} joined competition-${competitionId}`);
    });

    // Обработка обновлений результатов
    socket.on('update-results', (data) => {
      const { competitionId, results } = data;
      io.to(`competition-${competitionId}`).emit('results-updated', results);
    });

    // Обработка событий команд
    socket.on('join-team', (teamId) => {
      socket.join(`team-${teamId}`);
      console.log(`${socket.id} joined team-${teamId}`);
    });

    // Отправка сообщений в чат команды
    socket.on('team-message', (data) => {
      const { teamId, message, sender } = data;
      io.to(`team-${teamId}`).emit('new-team-message', { message, sender, timestamp: new Date() });
    });

    // Обработка системных уведомлений
    socket.on('system-notification', (data) => {
      const { type, target, message } = data;
      if (target === 'all') {
        io.emit('notification', { type, message });
      } else if (target.startsWith('team-')) {
        io.to(target).emit('notification', { type, message });
      } else if (target.startsWith('competition-')) {
        io.to(target).emit('notification', { type, message });
      }
    });

    // Обработка отключения
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log('Socket.io server started successfully');
  res.end();
};

export default SocketHandler; 