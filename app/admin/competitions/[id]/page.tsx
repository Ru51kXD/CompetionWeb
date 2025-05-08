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
  Badge,
  Modal,
  Divider,
  Statistic,
  Avatar,
  List,
  Progress
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  TeamOutlined, 
  TrophyOutlined, 
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined
} from '@ant-design/icons';

interface Team {
  id: number;
  name: string;
  description?: string;
  memberCount?: number;
  image?: string;
  createdAt?: string;
}

interface Participant {
  id: number;
  name: string;
  teamId?: number;
  teamName?: string;
  status?: 'active' | 'pending' | 'rejected';
}

interface Competition {
  id: number;
  title: string;
  description?: string;
  type?: string;
  status: 'upcoming' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  location?: string;
  image?: string;
  teams?: number[];
  participants?: number[];
  participantCount?: number;
  teamsList?: Team[];
  maxTeams?: number;
  maxTeamSize?: number;
  rules?: string;
  organizer?: string;
  contactEmail?: string;
  results?: { teamId: number; position: number; score: number }[];
}

export default function AdminCompetitionDetailsPage() {
  const params = useParams();
  const competitionId = params.id as string;
  const router = useRouter();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchCompetitionData();
  }, [competitionId]);

  const fetchCompetitionData = async () => {
    try {
      setLoading(true);
      
      // Загрузка соревнований из localStorage
      const storedCompetitions = localStorage.getItem('competitions');
      let competitions: Competition[] = [];
      
      if (storedCompetitions) {
        try {
          competitions = JSON.parse(storedCompetitions);
          // Проверка, что competitions это массив
          if (!Array.isArray(competitions)) {
            console.error('Competitions is not an array:', competitions);
            competitions = [];
          }
        } catch (parseError) {
          console.error('Error parsing competitions data:', parseError);
          localStorage.setItem('competitions', JSON.stringify([]));
        }
      } else {
        localStorage.setItem('competitions', JSON.stringify([]));
      }

      // Поиск соревнования по ID
      const foundCompetition = competitions.find(c => c.id === Number(competitionId));
      
      if (foundCompetition) {
        // Загрузка команд
        const storedTeams = localStorage.getItem('teams');
        let allTeams: Team[] = [];
        
        if (storedTeams) {
          try {
            allTeams = JSON.parse(storedTeams);
          } catch (error) {
            console.error('Error parsing teams data:', error);
          }
        }
        
        // Фильтруем команды, участвующие в соревновании
        const competitionTeams = foundCompetition.teams && allTeams.length > 0
          ? allTeams.filter(team => foundCompetition.teams?.includes(team.id))
          : [];
        
        // Предварительный список участников (в будущем может быть загружен из отдельного хранилища)
        const mockParticipants = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Участник ${i + 1}`,
          teamId: competitionTeams[i % competitionTeams.length]?.id,
          teamName: competitionTeams[i % competitionTeams.length]?.name,
          status: 'active' as const
        }));
        
        // Обновляем состояние
        setCompetition({
          ...foundCompetition,
          teamsList: competitionTeams
        });
        setTeams(competitionTeams);
        setParticipants(mockParticipants);
      } else {
        // Если соревнования с таким ID нет, создаем тестовое соревнование
        try {
          const newCompetition: Competition = {
            id: Number(competitionId),
            title: `Соревнование ${competitionId}`,
            description: 'Это соревнование создано автоматически при просмотре деталей',
            type: 'sport',
            status: 'upcoming',
            startDate: new Date(Date.now() + 86400000).toISOString(), // завтра
            endDate: new Date(Date.now() + 86400000 * 7).toISOString(), // через неделю
            location: 'Москва, Россия',
            participantCount: 0,
            maxTeams: 10,
            maxTeamSize: 5,
            teams: [],
            organizer: 'Администрация сайта',
            contactEmail: 'admin@example.com',
            rules: 'Правила соревнования будут объявлены позже'
          };
          
          // Сохраняем новое соревнование
          competitions.push(newCompetition);
          localStorage.setItem('competitions', JSON.stringify(competitions));
          
          setCompetition(newCompetition);
          setTeams([]);
          setParticipants([]);
          
          message.success(`Создано тестовое соревнование с ID ${competitionId}`);
        } catch (error) {
          console.error('Error creating test competition:', error);
          message.error('Ошибка при создании тестового соревнования');
          router.push('/admin/competitions');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Ошибка при загрузке данных. Попробуйте обновить страницу.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    try {
      // Получение списка соревнований
      const storedCompetitions = localStorage.getItem('competitions');
      if (storedCompetitions) {
        const competitions = JSON.parse(storedCompetitions);
        // Удаление текущего соревнования
        const updatedCompetitions = competitions.filter((c: Competition) => c.id !== Number(competitionId));
        // Сохранение обновленного списка
        localStorage.setItem('competitions', JSON.stringify(updatedCompetitions));
        
        message.success('Соревнование успешно удалено');
        router.push('/admin/competitions');
      }
    } catch (error) {
      console.error('Error deleting competition:', error);
      message.error('Ошибка при удалении соревнования');
    }
  };

  const teamsColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Team) => (
        <div className="flex items-center">
          <Avatar 
            src={record.image || `https://api.dicebear.com/7.x/identicon/svg?seed=${record.name}`} 
            size="small" 
            className="mr-2" 
          />
          {text}
        </div>
      ),
    },
    {
      title: 'Участников',
      dataIndex: 'memberCount',
      key: 'memberCount',
      render: (memberCount: number) => memberCount || 0,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Team) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => router.push(`/admin/teams/${record.id}`)}>
            Подробнее
          </Button>
        </div>
      ),
    },
  ];

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
      title: 'Команда',
      dataIndex: 'teamName',
      key: 'teamName',
      render: (text: string, record: Participant) => (
        text ? (
          <Tag color="blue">{text}</Tag>
        ) : (
          <Tag color="orange">Без команды</Tag>
        )
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusColors: { [key: string]: string } = {
          'active': 'green',
          'pending': 'orange',
          'rejected': 'red',
        };
        const statusText: { [key: string]: string } = {
          'active': 'Активен',
          'pending': 'Ожидает',
          'rejected': 'Отклонен',
        };
        return (
          <Tag color={statusColors[status] || 'default'}>
            {statusText[status] || status}
          </Tag>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Загрузка данных..." />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/admin/competitions')}
          className="mb-4"
        >
          Назад к списку соревнований
        </Button>
        <Card>
          <div className="text-center text-red-500">
            Соревнование не найдено
          </div>
        </Card>
      </div>
    );
  }

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Определение статуса соревнования
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge status="warning" text="Предстоит" />;
      case 'active':
        return <Badge status="success" text="Активно" />;
      case 'completed':
        return <Badge status="default" text="Завершено" />;
      default:
        return <Badge status="processing" text={status} />;
    }
  };

  // Расчет прогресса соревнования
  const calculateProgress = () => {
    const now = new Date().getTime();
    const start = new Date(competition.startDate).getTime();
    const end = new Date(competition.endDate).getTime();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/admin/competitions')}
        >
          Назад к списку соревнований
        </Button>
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => router.push(`/admin/competitions/${competitionId}/edit`)}
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

      <Card className="mb-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold">{competition.title}</h1>
              <div>{getStatusBadge(competition.status)}</div>
            </div>
            
            <p className="text-gray-700 mb-4">{competition.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div className="flex items-center">
                <CalendarOutlined className="text-blue-500 mr-2" />
                <span className="font-medium">Начало:</span>
                <span className="ml-2">{formatDate(competition.startDate)}</span>
              </div>
              
              <div className="flex items-center">
                <CalendarOutlined className="text-red-500 mr-2" />
                <span className="font-medium">Окончание:</span>
                <span className="ml-2">{formatDate(competition.endDate)}</span>
              </div>
              
              {competition.location && (
                <div className="flex items-center">
                  <EnvironmentOutlined className="text-green-500 mr-2" />
                  <span className="font-medium">Место проведения:</span>
                  <span className="ml-2">{competition.location}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <TeamOutlined className="text-purple-500 mr-2" />
                <span className="font-medium">Команд:</span>
                <span className="ml-2">
                  {teams.length} из {competition.maxTeams || 'неограничено'}
                </span>
              </div>
            </div>
            
            {competition.status === 'active' && (
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Прогресс соревнования:</span>
                  <span>{calculateProgress()}%</span>
                </div>
                <Progress percent={calculateProgress()} status="active" />
              </div>
            )}
            
            {competition.organizer && (
              <div className="flex items-center mb-2">
                <UserOutlined className="text-gray-500 mr-2" />
                <span className="font-medium">Организатор:</span>
                <span className="ml-2">{competition.organizer}</span>
              </div>
            )}
            
            {competition.contactEmail && (
              <div className="flex items-center">
                <span className="font-medium">Контактный email:</span>
                <span className="ml-2">{competition.contactEmail}</span>
              </div>
            )}
          </div>
          
          <div className="md:w-64 flex flex-col gap-4">
            <Card className="bg-gray-50">
              <Statistic
                title="Команд"
                value={teams.length}
                suffix={`/ ${competition.maxTeams || '∞'}`}
                valueStyle={{ color: '#1890ff' }}
                prefix={<TeamOutlined />}
              />
            </Card>
            
            <Card className="bg-gray-50">
              <Statistic
                title="Участников"
                value={participants.length}
                valueStyle={{ color: '#52c41a' }}
                prefix={<UserOutlined />}
              />
            </Card>
            
            <Card className="bg-gray-50">
              <Statistic
                title="Дней до начала"
                value={Math.max(0, Math.floor((new Date(competition.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </div>
        </div>
      </Card>

      <Tabs defaultActiveKey="teams">
        <Tabs.TabPane 
          tab={
            <span>
              <TeamOutlined /> Команды ({teams.length})
            </span>
          } 
          key="teams"
        >
          <Card>
            <Table
              dataSource={teams}
              columns={teamsColumns}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: 'Нет команд' }}
            />
            
            <div className="mt-4 flex justify-end">
              <Button type="primary" onClick={() => router.push('/admin/teams/create')}>
                Добавить команду
              </Button>
            </div>
          </Card>
        </Tabs.TabPane>
        
        <Tabs.TabPane 
          tab={
            <span>
              <UserOutlined /> Участники ({participants.length})
            </span>
          } 
          key="participants"
        >
          <Card>
            <Table
              dataSource={participants}
              columns={participantsColumns}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: 'Нет участников' }}
            />
          </Card>
        </Tabs.TabPane>
        
        {competition.rules && (
          <Tabs.TabPane 
            tab={
              <span>
                <CheckCircleOutlined /> Правила
              </span>
            } 
            key="rules"
          >
            <Card>
              <div className="prose max-w-none">
                <h3>Правила соревнования</h3>
                <p>{competition.rules}</p>
              </div>
            </Card>
          </Tabs.TabPane>
        )}
        
        {competition.status === 'completed' && (
          <Tabs.TabPane 
            tab={
              <span>
                <TrophyOutlined /> Результаты
              </span>
            } 
            key="results"
          >
            <Card>
              {competition.results ? (
                <List
                  itemLayout="horizontal"
                  dataSource={competition.results.sort((a, b) => a.position - b.position)}
                  renderItem={(result) => {
                    const team = teams.find(t => t.id === result.teamId);
                    return (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold">
                              {result.position}
                            </div>
                          }
                          title={team?.name || `Команда #${result.teamId}`}
                          description={`Очки: ${result.score}`}
                        />
                      </List.Item>
                    );
                  }}
                />
              ) : (
                <div className="text-center py-4">
                  <p>Результаты соревнования не подведены</p>
                  <Button className="mt-2">Подвести итоги</Button>
                </div>
              )}
            </Card>
          </Tabs.TabPane>
        )}
      </Tabs>

      {/* Модальное окно удаления */}
      <Modal
        title="Удаление соревнования"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
      >
        <p>Вы уверены, что хотите удалить соревнование "{competition.title}"?</p>
        <p>Это действие нельзя отменить.</p>
      </Modal>
    </div>
  );
} 