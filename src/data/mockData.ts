// Mock data for competitions
export const mockCompetitions = [
  {
    id: 1,
    name: 'Чемпионат по футболу',
    type: 'sport',
    status: 'upcoming',
    startDate: '2023-12-15T00:00:00.000Z',
    endDate: '2023-12-25T00:00:00.000Z',
    participants: 8
  },
  {
    id: 2,
    name: 'Олимпиада по математике',
    type: 'intellectual',
    status: 'ongoing',
    startDate: '2023-11-10T00:00:00.000Z',
    endDate: '2023-12-20T00:00:00.000Z',
    participants: 120
  },
  {
    id: 3,
    name: 'Конкурс художественной фотографии',
    type: 'creative',
    status: 'completed',
    startDate: '2023-09-01T00:00:00.000Z',
    endDate: '2023-10-15T00:00:00.000Z',
    participants: 45
  }
];

// Mock data for teams
export const mockTeams = [
  {
    id: 1,
    name: 'Спартак',
    description: 'Футбольная команда университета',
    type: 'Спортивные',
    maxParticipants: 15,
    participants: [
      {
        id: 1,
        name: 'Иван Петров',
        email: 'ivan@example.com',
        role: 'Капитан'
      },
      {
        id: 2,
        name: 'Сергей Иванов',
        email: 'sergey@example.com',
        role: 'Участник'
      }
    ],
    competitions: [
      {
        id: 1,
        name: 'Чемпионат по футболу',
        type: 'Спортивные',
        status: 'Активно'
      }
    ],
    createdAt: '2023-10-10T10:00:00.000Z'
  },
  {
    id: 2,
    name: 'Умники',
    description: 'Команда для интеллектуальных соревнований',
    type: 'Интеллектуальные',
    maxParticipants: 5,
    participants: [
      {
        id: 3,
        name: 'Мария Сидорова',
        email: 'maria@example.com',
        role: 'Капитан'
      }
    ],
    competitions: [
      {
        id: 2,
        name: 'Олимпиада по математике',
        type: 'Интеллектуальные',
        status: 'Активно'
      }
    ],
    createdAt: '2023-11-05T14:30:00.000Z'
  }
];

// Mock user data
export const mockUsers = [
  {
    id: 1,
    name: 'Иван Петров',
    email: 'ivan@example.com',
    role: 'user',
    createdAt: '2023-09-01T10:00:00.000Z'
  },
  {
    id: 2,
    name: 'Мария Сидорова',
    email: 'maria@example.com',
    role: 'user',
    createdAt: '2023-09-05T14:30:00.000Z'
  },
  {
    id: 3,
    name: 'Админ Системы',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2023-08-15T09:00:00.000Z'
  }
]; 