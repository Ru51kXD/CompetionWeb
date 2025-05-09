import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Table, Tag, message, Modal, Space, Spin } from 'antd';
import { ArrowLeftOutlined, UserOutlined, TrophyOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Team } from '../../types/team';
import { Competition } from '../../types/competition';
import { mockTeams } from '../../data/mockData';

interface JoinRequest {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  message?: string;
}

const AdminTeamDetails: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

  // Добавляем функцию инициализации данных, если команда не найдена
  const initializeTeamData = () => {
    try {
      // Создаем тестовую команду с ID 19, если она запрашивается и не существует
      if (teamId === '19' && !mockTeams.find(t => t.id === 19)) {
        const newTeam: Team = {
          id: 19,
          name: 'Тестовая команда 19',
          description: 'Команда для тестирования, созданная автоматически',
          type: 'Спортивные',
          maxParticipants: 10,
          participants: [
            {
              id: 1001,
              name: 'Алексей Тестов',
              email: 'test@example.com',
              role: 'Капитан'
            }
          ],
          competitions: [
            {
              id: 101,
              name: 'Тестовое соревнование',
              type: 'Спортивные',
              status: 'Активно'
            }
          ],
          createdAt: new Date().toISOString(),
        };
        
        // Сохраняем тестовую команду в localStorage
        const storedTeams = localStorage.getItem('teams');
        let teams = storedTeams ? JSON.parse(storedTeams) : [];
        teams = teams.filter((t: Team) => t.id !== 19);
        teams.push(newTeam);
        localStorage.setItem('teams', JSON.stringify(teams));
        
        // Создаем тестовые заявки
        const mockRequests: JoinRequest[] = [
          {
            id: 1,
            userId: 101,
            userName: 'Иван Петров',
            userEmail: 'ivan@example.com',
            status: 'pending',
            createdAt: new Date().toISOString(),
            message: 'Хочу присоединиться к команде 19'
          }
        ];
        localStorage.setItem(`team_19_requests`, JSON.stringify(mockRequests));
        
        console.log('Создана тестовая команда с ID 19');
        return newTeam;
      }
      return null;
    } catch (error) {
      console.error('Error initializing test team:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchTeamAndRequests = async () => {
      try {
        console.log('Fetching team with ID:', teamId);
        
        // Сначала проверяем localStorage
        const storedTeams = localStorage.getItem('teams');
        let teams: Team[] = [];
        
        if (storedTeams) {
          teams = JSON.parse(storedTeams);
        } else {
          // Если данных нет в localStorage, используем mock-данные
          teams = mockTeams;
          localStorage.setItem('teams', JSON.stringify(mockTeams));
        }

        // Ищем команду
        let foundTeam = teams.find(t => t.id === Number(teamId));
        console.log('Found team:', foundTeam);

        // Если команда не найдена, пробуем инициализировать тестовые данные
        if (!foundTeam) {
          foundTeam = initializeTeamData();
          if (!foundTeam) {
            message.error('Команда не найдена');
            navigate('/admin/teams');
            return;
          }
        }

        setTeam(foundTeam);
        
        // Загружаем заявки
        const storedRequests = localStorage.getItem(`team_${teamId}_requests`);
        if (storedRequests) {
          setJoinRequests(JSON.parse(storedRequests));
        } else {
          // Создаем тестовые заявки
          const mockRequests: JoinRequest[] = [
            {
              id: 1,
              userId: 101,
              userName: 'Иван Петров',
              userEmail: 'ivan@example.com',
              status: 'pending',
              createdAt: new Date().toISOString(),
              message: 'Хочу присоединиться к команде'
            },
            {
              id: 2,
              userId: 102,
              userName: 'Мария Сидорова',
              userEmail: 'maria@example.com',
              status: 'pending',
              createdAt: new Date().toISOString(),
              message: 'Имею опыт участия в подобных соревнованиях'
            }
          ];
          setJoinRequests(mockRequests);
          localStorage.setItem(`team_${teamId}_requests`, JSON.stringify(mockRequests));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTeamAndRequests();
    }
  }, [teamId, navigate]);

  const handleApproveRequest = (request: JoinRequest) => {
    Modal.confirm({
      title: 'Подтверждение',
      content: `Вы уверены, что хотите принять ${request.userName} в команду?`,
      onOk: () => {
        const updatedRequests = joinRequests.map(req =>
          req.id === request.id ? { ...req, status: 'approved' } : req
        );
        setJoinRequests(updatedRequests);
        localStorage.setItem(`team_${teamId}_requests`, JSON.stringify(updatedRequests));

        if (team) {
          const updatedTeam = {
            ...team,
            participants: [
              ...team.participants,
              {
                id: request.userId,
                name: request.userName,
                email: request.userEmail,
                role: 'Участник'
              }
            ]
          };
          setTeam(updatedTeam);
          
          const storedTeams = localStorage.getItem('teams');
          if (storedTeams) {
            const teams = JSON.parse(storedTeams);
            const updatedTeams = teams.map((t: Team) =>
              t.id === team.id ? updatedTeam : t
            );
            localStorage.setItem('teams', JSON.stringify(updatedTeams));
          }

          message.success('Пользователь успешно добавлен в команду');
        }
      }
    });
  };

  const handleRejectRequest = (request: JoinRequest) => {
    Modal.confirm({
      title: 'Подтверждение',
      content: `Вы уверены, что хотите отклонить заявку от ${request.userName}?`,
      onOk: () => {
        const updatedRequests = joinRequests.map(req =>
          req.id === request.id ? { ...req, status: 'rejected' } : req
        );
        setJoinRequests(updatedRequests);
        localStorage.setItem(`team_${teamId}_requests`, JSON.stringify(updatedRequests));
        message.success('Заявка отклонена');
      }
    });
  };

  const participantsColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'Капитан' ? 'blue' : 'green'}>
          {role}
        </Tag>
      ),
    },
  ];

  const competitionsColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusColors: { [key: string]: string } = {
          'Активно': 'green',
          'Завершено': 'red',
          'Ожидает': 'orange',
        };
        return (
          <Tag color={statusColors[status] || 'default'}>
            {status}
          </Tag>
        );
      },
    },
  ];

  const requestsColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Имя',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: 'Сообщение',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusColors: { [key: string]: string } = {
          'pending': 'orange',
          'approved': 'green',
          'rejected': 'red',
        };
        const statusText: { [key: string]: string } = {
          'pending': 'Ожидает',
          'approved': 'Принято',
          'rejected': 'Отклонено',
        };
        return (
          <Tag color={statusColors[status]}>
            {statusText[status]}
          </Tag>
        );
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: JoinRequest) => (
        record.status === 'pending' ? (
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleApproveRequest(record)}
            >
              Принять
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => handleRejectRequest(record)}
            >
              Отклонить
            </Button>
          </Space>
        ) : null
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Загрузка данных..." />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/teams')}
          className="mb-4"
        >
          Назад к списку команд
        </Button>
        <Card>
          <div className="text-center text-red-500">
            Команда не найдена
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/admin/teams')}
        className="mb-4"
      >
        Назад к списку команд
      </Button>

      <Card className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{team.name}</h1>
        <p className="text-gray-600 mb-4">{team.description}</p>
        <div className="flex gap-4">
          <Tag color="blue">{team.type}</Tag>
          <Tag color="green">Макс. участников: {team.maxParticipants}</Tag>
          <Tag color="purple">Создана: {new Date(team.createdAt).toLocaleDateString()}</Tag>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card
          title={
            <div className="flex items-center gap-2">
              <UserOutlined />
              <span>Заявки на вступление</span>
            </div>
          }
        >
          <Table
            dataSource={joinRequests}
            columns={requestsColumns}
            rowKey="id"
            pagination={false}
          />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            title={
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>Участники команды</span>
              </div>
            }
          >
            <Table
              dataSource={team.participants}
              columns={participantsColumns}
              rowKey="id"
              pagination={false}
            />
          </Card>

          <Card
            title={
              <div className="flex items-center gap-2">
                <TrophyOutlined />
                <span>Соревнования команды</span>
              </div>
            }
          >
            <Table
              dataSource={team.competitions}
              columns={competitionsColumns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminTeamDetails; 