import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTeams } from '../../data/mockData';
import { Team } from '../../types/team';
import { Button, Table, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const AdminTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // Инициализация данных при первом запуске
    const initializeData = () => {
      try {
        // Очищаем localStorage для команд
        localStorage.removeItem('teams');
        
        // Проверяем, есть ли команда с ID 19, если нет - добавляем её в mock-данные
        let teamsToSave = [...mockTeams];
        
        if (!teamsToSave.find(t => t.id === 19)) {
          console.log('Создаем тестовую команду с ID 19');
          const testTeam: Team = {
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
          teamsToSave.push(testTeam);
        }
        
        // Сохраняем mock-данные с учетом команды с ID 19
        localStorage.setItem('teams', JSON.stringify(teamsToSave));
        setTeams(teamsToSave);
        
        // Инициализируем заявки для каждой команды
        teamsToSave.forEach(team => {
          const mockRequests = [
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
          localStorage.setItem(`team_${team.id}_requests`, JSON.stringify(mockRequests));
        });

        message.success('Данные успешно инициализированы');
      } catch (error) {
        console.error('Error initializing data:', error);
        message.error('Ошибка при инициализации данных');
      }
    };

    // Проверяем, есть ли данные в localStorage
    const storedTeams = localStorage.getItem('teams');
    if (!storedTeams) {
      initializeData();
    } else {
      try {
        const parsedTeams = JSON.parse(storedTeams);
        
        // Проверяем, есть ли команда с ID 19
        if (!parsedTeams.find((t: Team) => t.id === 19)) {
          // Если нет, добавляем её
          const testTeam: Team = {
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
          
          const updatedTeams = [...parsedTeams, testTeam];
          localStorage.setItem('teams', JSON.stringify(updatedTeams));
          setTeams(updatedTeams);
          
          // Создаем тестовые заявки для команды с ID 19
          const mockRequests = [
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
        } else {
          setTeams(parsedTeams);
        }
      } catch (error) {
        console.error('Error parsing localStorage teams:', error);
        initializeData(); // При ошибке парсинга, инициализируем данные заново
      }
    }
  }, []);

  const handleViewTeam = (team: Team) => {
    console.log('Navigating to team:', team.id);
    navigate(`/admin/teams/${team.id}`);
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    form.setFieldsValue({
      name: team.name,
      description: team.description,
      type: team.type,
      maxParticipants: team.maxParticipants,
    });
    setIsModalVisible(true);
  };

  const handleDeleteTeam = (team: Team) => {
    const updatedTeams = teams.filter(t => t.id !== team.id);
    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    message.success('Команда успешно удалена');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (selectedTeam) {
        const updatedTeams = teams.map(team =>
          team.id === selectedTeam.id
            ? { ...team, ...values }
            : team
        );
        setTeams(updatedTeams);
        localStorage.setItem('teams', JSON.stringify(updatedTeams));
        message.success('Команда успешно обновлена');
      } else {
        const newTeam: Team = {
          id: teams.length + 1,
          name: values.name,
          description: values.description,
          type: values.type,
          maxParticipants: values.maxParticipants,
          participants: [],
          competitions: [],
          createdAt: new Date().toISOString(),
        };
        const updatedTeams = [...teams, newTeam];
        setTeams(updatedTeams);
        localStorage.setItem('teams', JSON.stringify(updatedTeams));
        message.success('Команда успешно создана');
      }
      setIsModalVisible(false);
      form.resetFields();
      setSelectedTeam(null);
    });
  };

  const columns = [
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
      title: 'Участники',
      dataIndex: 'participants',
      key: 'participants',
      render: (participants: any[]) => `${participants.length} чел.`,
    },
    {
      title: 'Соревнования',
      dataIndex: 'competitions',
      key: 'competitions',
      render: (competitions: any[]) => `${competitions.length} шт.`,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Team) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewTeam(record)}
          >
            Просмотр
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEditTeam(record)}
          >
            Редактировать
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTeam(record)}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление командами</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedTeam(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Создать команду
        </Button>
      </div>

      <Table
        dataSource={teams}
        columns={columns}
        rowKey="id"
        className="bg-white rounded-lg shadow"
      />

      <Modal
        title={selectedTeam ? 'Редактировать команду' : 'Создать команду'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setSelectedTeam(null);
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Название команды"
            rules={[{ required: true, message: 'Введите название команды' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
            rules={[{ required: true, message: 'Введите описание команды' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="type"
            label="Тип команды"
            rules={[{ required: true, message: 'Выберите тип команды' }]}
          >
            <Select>
              <Option value="Спортивные">Спортивные</Option>
              <Option value="Интеллектуальные">Интеллектуальные</Option>
              <Option value="Творческие">Творческие</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="maxParticipants"
            label="Максимальное количество участников"
            rules={[{ required: true, message: 'Введите максимальное количество участников' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminTeams; 