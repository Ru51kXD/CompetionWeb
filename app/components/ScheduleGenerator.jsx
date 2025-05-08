'use client';

import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Calendar,
  momentLocalizer,
} from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ru';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaTrophy, 
  FaRandom,
  FaSave,
  FaExclamationTriangle,
  FaBan,
  FaCheck,
  FaTrash
} from 'react-icons/fa';
import useSocket from '../hooks/useSocket';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// Настраиваем локализацию для календаря
moment.locale('ru');
const localizer = momentLocalizer(moment);

// Выносим константы за пределы компонента
const TIME_SLOTS = {
  MORNING: { start: 9, end: 12 },
  AFTERNOON: { start: 13, end: 17 }
};

const EVENT_TYPES = {
  MATCH: 'match',
  INDIVIDUAL: 'individual',
  CEREMONY: 'ceremony'
};

const EVENT_COLORS = {
  [EVENT_TYPES.MATCH]: '#3b82f6',
  [EVENT_TYPES.INDIVIDUAL]: '#10b981',
  [EVENT_TYPES.CEREMONY]: '#4338ca'
};

export default function ScheduleGenerator({ competition, participants, rooms, initialEvents = [] }) {
  const [events, setEvents] = useState(initialEvents);
  const [generatedEvents, setGeneratedEvents] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [scheduleVersion, setScheduleVersion] = useState(1);
  const { sendNotification } = useSocket();
  const { user } = useAuth();

  // Мемоизируем форматированные события
  const formattedEvents = useMemo(() => 
    events.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    })), [events]);

  // Мемоизируем функцию стилизации событий
  const eventStyleGetter = useCallback((event) => {
    const backgroundColor = event.color || EVENT_COLORS[event.type] || '#6366f1';
    
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.95,
        color: 'white',
        border: '0',
        display: 'block'
      }
    };
  }, []);

  // Оптимизированная генерация временных слотов
  const generateTimeSlots = useCallback((startDate, endDate) => {
    const timeSlots = [];
    const dayDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
    
    for (let day = 0; day < dayDiff; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + day);
      
      // Генерируем утренние слоты
      for (let hour = TIME_SLOTS.MORNING.start; hour < TIME_SLOTS.MORNING.end; hour++) {
        timeSlots.push(createTimeSlot(currentDate, hour, 'morning'));
      }
      
      // Генерируем дневные слоты
      for (let hour = TIME_SLOTS.AFTERNOON.start; hour < TIME_SLOTS.AFTERNOON.end; hour++) {
        timeSlots.push(createTimeSlot(currentDate, hour, 'afternoon'));
      }
    }
    
    return timeSlots;
  }, []);

  // Вспомогательная функция создания временного слота
  const createTimeSlot = (date, hour, preference) => ({
    start: new Date(date.setHours(hour, 0, 0)),
    end: new Date(date.setHours(hour + 1, 0, 0)),
    available: true,
    preference
  });

  // Оптимизированная генерация расписания
  const generateSchedule = useCallback(() => {
    setGenerationStatus('loading');
    setErrorMessage('');
    
    try {
      validateScheduleData(participants, rooms, competition);
      
      const startDate = new Date(competition.startDate);
      const endDate = new Date(competition.endDate);
      
      const timeSlots = generateTimeSlots(startDate, endDate);
      const matchSchedule = generateMatchSchedule(participants, timeSlots, rooms);
      const ceremonies = generateCeremonies(startDate, endDate, rooms[0], participants);
      
      const newEvents = [...matchSchedule, ...ceremonies];

      // Используем requestAnimationFrame для оптимизации рендеринга
      requestAnimationFrame(() => {
        setGeneratedEvents(newEvents);
        setShowConfirmation(true);
        setGenerationStatus('success');
      });
      
    } catch (error) {
      setErrorMessage(error.message);
      setGenerationStatus('error');
      toast.error(error.message);
    }
  }, [competition, participants, rooms, generateTimeSlots]);

  // Валидация данных расписания
  const validateScheduleData = (participants, rooms, competition) => {
    if (!participants || participants.length < 2) {
      throw new Error('Недостаточно участников для генерации расписания');
    }
    
    if (!rooms || rooms.length === 0) {
      throw new Error('Необходимо добавить хотя бы одно помещение для проведения соревнований');
    }
    
    if (!competition?.startDate || !competition?.endDate) {
      throw new Error('Не указаны даты начала и окончания соревнования');
    }
    
    const startDate = new Date(competition.startDate);
    const endDate = new Date(competition.endDate);
    
    if (endDate <= startDate) {
      throw new Error('Дата окончания должна быть позже даты начала соревнования');
    }
  };

  // Оптимизированная модификация расписания
  const modifySchedule = useCallback((eventId, newStart, newEnd, newRoom) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => {
        if (event.id === eventId) {
          const updatedEvent = {
            ...event,
            start: newStart,
            end: newEnd,
            resource: newRoom.id,
            location: newRoom.name,
            version: scheduleVersion + 1
          };
          
          // Отправляем уведомления асинхронно
          if (sendNotification) {
            event.participants.forEach(participantId => {
              setTimeout(() => {
                sendNotification(
                  'warning',
                  participantId,
                  `Изменение в расписании: "${event.title}" перенесен на ${new Date(newStart).toLocaleString()} в ${newRoom.name}`
                );
              }, 0);
            });
          }
          
          return updatedEvent;
        }
        return event;
      });
      
      setScheduleVersion(prev => prev + 1);
      toast.success('Расписание обновлено');
      
      return updatedEvents;
    });
  }, [sendNotification, scheduleVersion]);

  // Мемоизированные сообщения для календаря
  const calendarMessages = useMemo(() => ({
    allDay: 'Весь день',
    previous: 'Назад',
    next: 'Вперед',
    today: 'Сегодня',
    month: 'Месяц',
    week: 'Неделя',
    day: 'День',
    agenda: 'Список',
    date: 'Дата',
    time: 'Время',
    event: 'Событие',
    noEventsInRange: 'Нет событий в этом диапазоне.'
  }), []);

  // Генерация расписания матчей с оптимизацией
  const generateMatchSchedule = (participants, timeSlots, rooms) => {
    const matches = [];
    const participantPreferences = new Map();
    
    // Собираем предпочтения участников
    participants.forEach(participant => {
      participantPreferences.set(participant.id, {
        preferredTime: Math.random() > 0.5 ? 'morning' : 'afternoon',
        matchesPlayed: 0
      });
    });
    
    // Создаем пары матчей
    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        const team1 = participants[i];
        const team2 = participants[j];
        
        // Находим оптимальный слот с учетом предпочтений
        const optimalSlot = findOptimalTimeSlot(
          timeSlots,
          participantPreferences.get(team1.id),
          participantPreferences.get(team2.id)
        );
        
        if (!optimalSlot) {
          throw new Error('Не удалось найти подходящее время для всех матчей');
        }
        
        // Выбираем оптимальное помещение
        const room = findOptimalRoom(rooms, optimalSlot.start);
        
        // Создаем матч
        const match = {
          id: uuidv4(),
          title: `${team1.name} vs ${team2.name}`,
          start: optimalSlot.start,
          end: optimalSlot.end,
          resource: room.id,
          location: room.name,
          participants: [team1.id, team2.id],
          type: 'match',
          version: scheduleVersion
        };
        
        matches.push(match);
        
        // Обновляем статистику
        participantPreferences.get(team1.id).matchesPlayed++;
        participantPreferences.get(team2.id).matchesPlayed++;
        optimalSlot.available = false;
      }
    }
    
    return matches;
  };

  // Поиск оптимального временного слота
  const findOptimalTimeSlot = (timeSlots, team1Pref, team2Pref) => {
    // Сначала ищем слот, который подходит обоим командам
    let slot = timeSlots.find(slot => 
      slot.available && 
      slot.preference === team1Pref.preferredTime &&
      slot.preference === team2Pref.preferredTime
    );
    
    // Если не нашли, ищем любой доступный слот
    if (!slot) {
      slot = timeSlots.find(slot => slot.available);
    }
    
    return slot;
  };

  // Поиск оптимального помещения
  const findOptimalRoom = (rooms, time) => {
    // Проверяем загруженность помещений
    const roomLoad = rooms.map(room => ({
      room,
      load: events.filter(e => e.resource === room.id && 
        new Date(e.start).toDateString() === time.toDateString()).length
    }));
    
    // Выбираем наименее загруженное помещение
    return roomLoad.sort((a, b) => a.load - b.load)[0].room;
  };

  // Генерация церемоний
  const generateCeremonies = (startDate, endDate, mainRoom, participants) => {
    return [
      {
        id: uuidv4(),
        title: 'Церемония открытия',
        start: new Date(startDate.setHours(9, 0, 0)),
        end: new Date(startDate.setHours(10, 0, 0)),
        resource: mainRoom.id,
        location: mainRoom.name,
        participants: participants.map(p => p.id),
        type: 'ceremony',
        color: '#4338ca',
        version: scheduleVersion
      },
      {
        id: uuidv4(),
        title: 'Церемония закрытия и награждение',
        start: new Date(endDate.setHours(16, 0, 0)),
        end: new Date(endDate.setHours(18, 0, 0)),
        resource: mainRoom.id,
        location: mainRoom.name,
        participants: participants.map(p => p.id),
        type: 'ceremony',
        color: '#4338ca',
        version: scheduleVersion
      }
    ];
  };

  // Подтверждение и сохранение расписания
  const confirmSchedule = () => {
    setEvents(generatedEvents);
    setShowConfirmation(false);
    setScheduleVersion(prev => prev + 1);
    
    // Отправляем уведомления участникам
    if (sendNotification) {
      // Уведомление о создании расписания
      sendNotification('info', 'all', `Расписание для "${competition?.name}" создано и доступно для просмотра.`);
      
      // Отправляем персональные уведомления участникам
      generatedEvents.forEach(event => {
        if (event.type === 'match') {
          event.participants.forEach(participantId => {
            const participant = participants.find(p => p.id === participantId);
            if (participant) {
              sendNotification(
                'info',
                participantId,
                `Ваш матч "${event.title}" запланирован на ${new Date(event.start).toLocaleString()} в ${event.location}`
              );
            }
          });
        }
      });
    }
    
    toast.success('Расписание успешно создано');
  };

  // Отменяет сгенерированное расписание
  const cancelGeneration = () => {
    setGeneratedEvents([]);
    setShowConfirmation(false);
    setGenerationStatus('idle');
  };
  
  // Удаляет все события из расписания
  const clearSchedule = () => {
    if (confirm('Вы уверены, что хотите удалить все события из расписания?')) {
      setEvents([]);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaCalendarAlt className="mr-2 text-primary-600" />
            Генератор расписания
          </h2>
          
          <div className="flex space-x-3">
            <button
              onClick={generateSchedule}
              disabled={generationStatus === 'loading'}
              className="btn-primary flex items-center space-x-2"
            >
              {generationStatus === 'loading' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Генерация...</span>
                </>
              ) : (
                <>
                  <FaRandom className="mr-1" />
                  <span>Сгенерировать</span>
                </>
              )}
            </button>
            
            {events.length > 0 && (
              <button
                onClick={clearSchedule}
                className="btn-outline text-red-600 dark:text-red-400 flex items-center space-x-2 border-red-300 dark:border-red-700"
              >
                <FaTrash className="mr-1" />
                <span>Очистить</span>
              </button>
            )}
          </div>
        </div>
        
        {competition && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-start">
              <FaTrophy className="text-primary-600 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Соревнование</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{competition.name}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-start">
              <FaCalendarAlt className="text-primary-600 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Даты</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-start">
              <FaUsers className="text-primary-600 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Участники</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{participants?.length || 0} участников</p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-start">
              <FaMapMarkerAlt className="text-primary-600 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Помещения</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{rooms?.length || 0} доступных помещений</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Сообщение об ошибке */}
        {generationStatus === 'error' && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-400">Ошибка генерации расписания</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Подтверждение генерации расписания */}
        {showConfirmation && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <FaCalendarAlt className="text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-blue-800 dark:text-blue-400">Расписание сгенерировано</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Сгенерировано {generatedEvents.length} событий для соревнования "{competition?.name}".
                  Вы хотите применить это расписание?
                </p>
                <div className="mt-4 flex space-x-4">
                  <button 
                    onClick={confirmSchedule}
                    className="btn-primary text-sm flex items-center"
                  >
                    <FaCheck className="mr-1" />
                    Применить
                  </button>
                  <button 
                    onClick={cancelGeneration}
                    className="btn-outline text-sm flex items-center"
                  >
                    <FaBan className="mr-1" />
                    Отменить
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <Calendar
          localizer={localizer}
          events={formattedEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          defaultView="week"
          views={['day', 'week', 'agenda']}
          step={60}
          timeslots={1}
          min={new Date(0, 0, 0, 8, 0)}
          max={new Date(0, 0, 0, 20, 0)}
          messages={calendarMessages}
        />
      </div>
      
      {(formattedEvents.length > 0) && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Список событий</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Время
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Место
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Тип
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {formattedEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {event.start.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${event.type === 'match' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400' : 
                        event.type === 'individual' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-400'}`}>
                        {event.type === 'match' ? 'Матч' : 
                        event.type === 'individual' ? 'Индивидуальное' : 'Церемония'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 