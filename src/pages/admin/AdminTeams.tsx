import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTeams } from '../../data/mockData';
import { Team } from '../../types/team';
import AdminTeamDetails from './AdminTeamDetails';
import { Button, Table, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;

const AdminTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // Загружаем команды из localStorage или используем mock-данные
    const storedTeams = localStorage.getItem('teams');
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    } else {
      setTeams(mockTeams);
      localStorage.setItem('teams', JSON.stringify(mockTeams));
    }
  }, []);

  const handleViewTeam = (team: Team) => {
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