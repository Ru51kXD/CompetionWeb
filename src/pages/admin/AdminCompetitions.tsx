import React, { useState, useEffect } from 'react';
import { Table, Card, Button, message, Modal, Space, Tag, Input } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockCompetitions } from '../../data/mockData';

interface Competition {
  id: number;
  name: string;
  type: 'sport' | 'intellectual' | 'creative';
  status: 'upcoming' | 'ongoing' | 'completed';
  startDate: string;
  endDate: string;
  participants: number;
}

const AdminCompetitions: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = () => {
    setLoading(true);
    try {
      const storedCompetitions = JSON.parse(
        localStorage.getItem('competitions') || JSON.stringify(mockCompetitions)
      );
      setCompetitions(storedCompetitions);
    } catch (error) {
      console.error('Error loading competitions:', error);
      message.error('Ошибка при загрузке соревнований');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompetition = (competition: Competition) => {
    Modal.confirm({
      title: 'Подтверждение',
      content: `Вы уверены, что хотите удалить соревнование "${competition.name}"?`,
      onOk: () => {
        try {
          const updatedCompetitions = competitions.filter((c) => c.id !== competition.id);
          localStorage.setItem('competitions', JSON.stringify(updatedCompetitions));
          setCompetitions(updatedCompetitions);
          message.success('Соревнование удалено');
        } catch (error) {
          console.error('Error deleting competition:', error);
          message.error('Ошибка при удалении соревнования');
        }
      },
    });
  };

  const handleStatusChange = (competition: Competition) => {
    const statusOrder = ['upcoming', 'ongoing', 'completed'];
    const currentIndex = statusOrder.indexOf(competition.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    Modal.confirm({
      title: 'Подтверждение',
      content: `Вы уверены, что хотите изменить статус соревнования "${competition.name}" на "${nextStatus}"?`,
      onOk: () => {
        try {
          const updatedCompetitions = competitions.map((c) =>
            c.id === competition.id ? { ...c, status: nextStatus } : c
          );
          localStorage.setItem('competitions', JSON.stringify(updatedCompetitions));
          setCompetitions(updatedCompetitions);
          message.success('Статус соревнования изменен');
        } catch (error) {
          console.error('Error changing competition status:', error);
          message.error('Ошибка при изменении статуса соревнования');
        }
      },
    });
  };

  const filteredCompetitions = competitions.filter(
    (competition) =>
      competition.name.toLowerCase().includes(searchText.toLowerCase()) ||
      competition.type.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeColors = {
          sport: 'green',
          intellectual: 'blue',
          creative: 'purple',
        };
        const typeText = {
          sport: 'Спортивные',
          intellectual: 'Интеллектуальные',
          creative: 'Творческие',
        };
        return (
          <Tag color={typeColors[type as keyof typeof typeColors]}>
            {typeText[type as keyof typeof typeText]}
          </Tag>
        );
      },
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusColors = {
          upcoming: 'blue',
          ongoing: 'green',
          completed: 'gray',
        };
        const statusText = {
          upcoming: 'Предстоящее',
          ongoing: 'Текущее',
          completed: 'Завершенное',
        };
        return (
          <Tag color={statusColors[status as keyof typeof statusColors]}>
            {statusText[status as keyof typeof statusText]}
          </Tag>
        );
      },
    },
    {
      title: 'Дата начала',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Дата окончания',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Участники',
      dataIndex: 'participants',
      key: 'participants',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Competition) => (
        <Space>
          <Button onClick={() => navigate(`/competitions/${record.id}`)}>
            Просмотр
          </Button>
          <Button
            type="primary"
            onClick={() => handleStatusChange(record)}
          >
            Изменить статус
          </Button>
          <Button danger onClick={() => handleDeleteCompetition(record)}>
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Управление соревнованиями</h1>
        <p className="text-gray-600">Управление соревнованиями и их статусами</p>
      </div>

      <Card>
        <div className="mb-4 flex justify-between items-center">
          <Input
            placeholder="Поиск соревнований..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredCompetitions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default AdminCompetitions; 