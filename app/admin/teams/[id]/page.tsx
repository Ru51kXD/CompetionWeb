'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Card, 
  Button, 
  Table, 
  Tag, 
  message, 
  Spin, 
  Tabs, 
  Descriptions, 
  Avatar,
  Modal,
  Divider,
  Badge,
  notification,
  List
} from 'antd';
import { ArrowLeftOutlined, UserOutlined, TrophyOutlined, CheckOutlined, CloseOutlined, EditOutlined, DeleteOutlined, BellOutlined } from '@ant-design/icons';

interface Participant {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  skills?: string[];
  joinDate?: string;
}

interface Competition {
  id: number;
  name: string;
  type: string;
  status: string;
}

interface Team {
  id: number;
  name: string;
  description: string;
  type: string;
  maxParticipants: number;
  participants: Participant[];
  competitions: Competition[];
  createdAt: string;
}

interface JoinRequest {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  message?: string;
}

export default function AdminTeamDetailsPage() {
  const params = useParams();
  const teamId = params.id as string;
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [hasUnreadRequests, setHasUnreadRequests] = useState(false);
  const [notifications, setNotifications] = useState<JoinRequest[]>([]);

  useEffect(() => {
    fetchTeamAndRequests();
  }, [teamId]);

  useEffect(() => {
    // Check for unread join requests
    const unreadRequests = joinRequests.filter(req => req.status === 'pending');
    setHasUnreadRequests(unreadRequests.length > 0);
    setNotifications(unreadRequests);
    
    if (unreadRequests.length > 0) {
      notification.info({
        message: 'Новые заявки на вступление',
        description: `У команды ${team?.name} есть ${unreadRequests.length} новых заявок на вступление`,
        placement: 'topRight',
        duration: 5
      });
    }
  }, [joinRequests]);

  const fetchTeamAndRequests = async () => {
    try {
      setLoading(true);
      
      // Загрузка команды из localStorage
      const storedTeams = localStorage.getItem('teams');
      let teams: Team[] = [];
      
      if (storedTeams) {
        try {
          teams = JSON.parse(storedTeams);
          // Проверка, что teams это массив
          if (!Array.isArray(teams)) {
            console.error('Teams is not an array:', teams);
            teams = [];
          }
        } catch (parseError) {
          console.error('Error parsing teams data:', parseError);
          // Создаем пустой массив команд в случае ошибки парсинга
          localStorage.setItem('teams', JSON.stringify([]));
        }
      } else {
        // Если нет данных команд, инициализируем пустой массив
        localStorage.setItem('teams', JSON.stringify([]));
      }

      // Поиск команды по ID
      const foundTeam = teams.find(t => t.id === Number(teamId));
      
      if (foundTeam) {
        try {
          // Проверяем наличие всех необходимых полей и инициализируем их при необходимости
          if (!foundTeam.participants) foundTeam.participants = [];
          if (!foundTeam.competitions) foundTeam.competitions = [];
          
          // Обогащаем данные участников для более детального отображения
          const enhancedTeam = {
            ...foundTeam,
            participants: foundTeam.participants ? foundTeam.participants.map(p => ({
              ...p,
              avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`,
              skills: p.skills || generateRandomSkills(),
              joinDate: p.joinDate || new Date(Date.now() - Math.random() * 10000000000).toISOString()
            })) : [],
            competitions: foundTeam.competitions || []
          };
          
          setTeam(enhancedTeam);
          
          // Загрузка заявок на вступление
          const storedRequests = localStorage.getItem(`team_${teamId}_requests`);
          let parsedRequests: JoinRequest[] = [];
          
          if (storedRequests) {
            try {
              parsedRequests = JSON.parse(storedRequests);
              setJoinRequests(parsedRequests);
            } catch (error) {
              console.error('Error parsing join requests:', error);
              // Инициализируем пустым массивом в случае ошибки
              setJoinRequests([]);
              localStorage.setItem(`team_${teamId}_requests`, JSON.stringify([]));
            }
          } else {
            // Создаем тестовые заявки, если их нет
            const mockRequests: JoinRequest[] = [
              {
                id: 1,
                userId: 101,
                userName: 'Иван Петров',
                userEmail: 'ivan@example.com',
                status: 'pending',
                createdAt: new Date().toISOString(),
                message: 'Хочу присоединиться к команде'
              }
            ];
            setJoinRequests(mockRequests);
            localStorage.setItem(`team_${teamId}_requests`, JSON.stringify(mockRequests));
          }
        } catch (enhanceError) {
          console.error('Error enhancing team data:', enhanceError);
          // Используем оригинальную команду без улучшений
          setTeam(foundTeam);
        }
      } else {
        // Если команды с таким ID нет, создаем тестовую команду (для любого ID)
        try {
          const newTeam: Team = {
            id: Number(teamId),
            name: `Команда ${teamId}`,
            description: 'Команда создана автоматически при просмотре',
            type: 'Спортивные',
            maxParticipants: 10,
            participants: [
              {
                id: 1001,
                name: 'Алексей Тестов',
                email: 'test@example.com',
                role: 'Капитан',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Алексей`,
                skills: ['Программирование', 'Лидерство', 'Стратегия'],
                joinDate: new Date(Date.now() - 5000000000).toISOString()
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
              message: `Хочу присоединиться к команде ${teamId}`
            }
          ];
          setJoinRequests(mockRequests);
          localStorage.setItem(`team_${teamId}_requests`, JSON.stringify(mockRequests));
          
          setTeam(newTeam);
          message.success(`Создана тестовая команда с ID ${teamId}`);
        } catch (createError) {
          console.error('Error creating test team:', createError);
          message.error('Не удалось создать тестовую команду');
          router.push('/admin/teams');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Ошибка при загрузке данных. Попробуйте обновить страницу.');
    } finally {
      setLoading(false);
    }
  };

  // Функция для генерации случайных навыков
  const generateRandomSkills = () => {
    const allSkills = [
      'Программирование', 'Дизайн', 'Аналитика', 'Маркетинг',
      'Презентация', 'Тестирование', 'Коммуникация', 'Стратегия',
      'Лидерство', 'Организация', 'Тайм-менеджмент', 'Исследование'
    ];
    
    const count = Math.floor(Math.random() * 4) + 1; // 1-4 навыка
    const skills = [];
    
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * allSkills.length);
      skills.push(allSkills[index]);
      allSkills.splice(index, 1);
    }
    
    return skills;
  };

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
          // Добавляем нового участника с расширенной информацией
          const updatedTeam = {
            ...team,
            participants: [
              ...team.participants,
              {
                id: request.userId,
                name: request.userName,
                email: request.userEmail,
                role: 'Участник',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.userName}`,
                skills: generateRandomSkills(),
                joinDate: new Date().toISOString()
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

          notification.success({
            message: 'Заявка одобрена',
            description: `${request.userName} успешно добавлен в команду`,
            placement: 'topRight'
          });
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
        
        notification.info({
          message: 'Заявка отклонена',
          description: `Заявка от ${request.userName} была отклонена`,
          placement: 'topRight'
        });
      }
    });
  };

  // Новый улучшенный компонент для отображения участников
  const renderParticipantsTab = () => {
    if (!team) return null;
    
    return (
      <List
        itemLayout="horizontal"
        dataSource={team.participants || []}
        renderItem={(participant) => (
          <List.Item 
            actions={[
              <Button key="message" size="small">Сообщение</Button>,
              participant.role !== 'Капитан' && 
                <Button key="remove" size="small" danger>Удалить</Button>
            ].filter(Boolean)}
          >
            <List.Item.Meta
              avatar={<Avatar src={participant.avatar} size={64} />}
              title={
                <div className="flex items-center">
                  <span className="font-bold">{participant.name}</span>
                  {participant.role === 'Капитан' && 
                    <Tag color="blue" className="ml-2">Капитан</Tag>
                  }
                </div>
              }
              description={
                <div>
                  <p>{participant.email}</p>
                  <p>Участник с {new Date(participant.joinDate || '').toLocaleDateString()}</p>
                  <div className="mt-2">
                    {participant.skills?.map(skill => (
                      <Tag key={skill} color="green" className="mr-1 mb-1">{skill}</Tag>
                    ))}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  // Остальные колонки для компетиций без изменений
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
      render: (name: string) => (
        <div className="flex items-center">
          <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} size="small" className="mr-2" />
          {name}
        </div>
      )
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
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
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
          <div className="flex gap-2">
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApproveRequest(record)}
            >
              Принять
            </Button>
            <Button
              danger
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleRejectRequest(record)}
            >
              Отклонить
            </Button>
          </div>
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
          onClick={() => router.push('/admin/teams')}
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
      <div className="flex items-center justify-between mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/admin/teams')}
        >
          Назад к списку команд
        </Button>
        <div className="flex gap-2 items-center">
          {hasUnreadRequests && (
            <Badge count={notifications.length} overflowCount={99}>
              <Button 
                icon={<BellOutlined />} 
                onClick={() => {
                  const tabsElement = document.getElementById('team-tabs');
                  if (tabsElement) {
                    tabsElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Заявки
              </Button>
            </Badge>
          )}
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsEditModalVisible(true)}
          >
            Редактировать
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => setIsDeleteModalVisible(true)}
          >
            Удалить
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-grow">
            <h1 className="text-2xl font-bold mb-4">{team.name}</h1>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Тип команды">
                <Tag color="blue">{team.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Описание">
                {team.description}
              </Descriptions.Item>
              <Descriptions.Item label="Макс. участников">
                {team.maxParticipants}
              </Descriptions.Item>
              <Descriptions.Item label="Текущее количество участников">
                <span className="font-bold">{team.participants.length}</span> из {team.maxParticipants}
              </Descriptions.Item>
              <Descriptions.Item label="Дата создания">
                {new Date(team.createdAt).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Card>

      <Tabs defaultActiveKey="participants" id="team-tabs">
        <Tabs.TabPane tab={
          <span>
            Участники
            <Tag className="ml-2" color="green">{team.participants?.length || 0}</Tag>
          </span>
        } key="participants">
          <Card>
            {renderParticipantsTab()}
          </Card>
        </Tabs.TabPane>
        
        <Tabs.TabPane tab={
          <span>
            Соревнования
            <Tag className="ml-2" color="blue">{team.competitions?.length || 0}</Tag>
          </span>
        } key="competitions">
          <Card>
            <Table
              dataSource={team.competitions || []}
              columns={competitionsColumns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Tabs.TabPane>
        
        <Tabs.TabPane tab={
          <span>
            Заявки на вступление
            {hasUnreadRequests && (
              <Badge count={notifications.length} className="ml-2" />
            )}
          </span>
        } key="requests">
          <Card>
            <Table
              dataSource={joinRequests}
              columns={requestsColumns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      {/* Модальное окно удаления */}
      <Modal
        title="Удаление команды"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={() => {
          // Удаление команды из localStorage
          const storedTeams = localStorage.getItem('teams');
          if (storedTeams) {
            const teams = JSON.parse(storedTeams);
            const updatedTeams = teams.filter((t: Team) => t.id !== team.id);
            localStorage.setItem('teams', JSON.stringify(updatedTeams));
          }
          
          // Удаление заявок команды
          localStorage.removeItem(`team_${teamId}_requests`);
          
          message.success('Команда успешно удалена');
          router.push('/admin/teams');
        }}
      >
        <p>Вы уверены, что хотите удалить команду "{team.name}"?</p>
        <p>Это действие нельзя отменить.</p>
      </Modal>
    </div>
  );
} 