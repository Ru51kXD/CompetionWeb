import React, { useState, useEffect } from 'react';
import { Table, Card, Button, message, Modal, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { mockTeams } from '../../data/mockData';

interface JoinRequest {
  id: number;
  userId: number;
  teamId: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  userName: string;
  teamName: string;
}

const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    setLoading(true);
    try {
      // Получаем все команды
      const teams = JSON.parse(localStorage.getItem('teams') || JSON.stringify(mockTeams));
      
      // Собираем все заявки из всех команд
      const allRequests: JoinRequest[] = [];
      teams.forEach((team: any) => {
        const teamRequests = JSON.parse(localStorage.getItem(`team_${team.id}_requests`) || '[]');
        teamRequests.forEach((request: any) => {
          allRequests.push({
            ...request,
            teamName: team.name,
          });
        });
      });

      setRequests(allRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
      message.error('Ошибка при загрузке заявок');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (request: JoinRequest) => {
    Modal.confirm({
      title: 'Подтверждение',
      content: `Вы уверены, что хотите одобрить заявку пользователя ${request.userName} в команду ${request.teamName}?`,
      onOk: () => {
        try {
          // Обновляем статус заявки
          const teamRequests = JSON.parse(localStorage.getItem(`team_${request.teamId}_requests`) || '[]');
          const updatedRequests = teamRequests.map((r: any) =>
            r.id === request.id ? { ...r, status: 'approved' } : r
          );
          localStorage.setItem(`team_${request.teamId}_requests`, JSON.stringify(updatedRequests));

          // Добавляем пользователя в команду
          const teams = JSON.parse(localStorage.getItem('teams') || '[]');
          const updatedTeams = teams.map((team: any) => {
            if (team.id === request.teamId) {
              return {
                ...team,
                participants: [...team.participants, request.userId],
              };
            }
            return team;
          });
          localStorage.setItem('teams', JSON.stringify(updatedTeams));

          message.success('Заявка одобрена');
          loadRequests();
        } catch (error) {
          console.error('Error approving request:', error);
          message.error('Ошибка при одобрении заявки');
        }
      },
    });
  };

  const handleReject = (request: JoinRequest) => {
    Modal.confirm({
      title: 'Подтверждение',
      content: `Вы уверены, что хотите отклонить заявку пользователя ${request.userName} в команду ${request.teamName}?`,
      onOk: () => {
        try {
          const teamRequests = JSON.parse(localStorage.getItem(`team_${request.teamId}_requests`) || '[]');
          const updatedRequests = teamRequests.map((r: any) =>
            r.id === request.id ? { ...r, status: 'rejected' } : r
          );
          localStorage.setItem(`team_${request.teamId}_requests`, JSON.stringify(updatedRequests));

          message.success('Заявка отклонена');
          loadRequests();
        } catch (error) {
          console.error('Error rejecting request:', error);
          message.error('Ошибка при отклонении заявки');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Пользователь',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Команда',
      dataIndex: 'teamName',
      key: 'teamName',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusColors = {
          pending: 'warning',
          approved: 'success',
          rejected: 'error',
        };
        const statusText = {
          pending: 'Ожидает',
          approved: 'Одобрена',
          rejected: 'Отклонена',
        };
        return (
          <Tag color={statusColors[status as keyof typeof statusColors]}>
            {statusText[status as keyof typeof statusText]}
          </Tag>
        );
      },
    },
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: JoinRequest) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button type="primary" onClick={() => handleApprove(record)}>
                Одобрить
              </Button>
              <Button danger onClick={() => handleReject(record)}>
                Отклонить
              </Button>
            </>
          )}
          <Button onClick={() => navigate(`/admin/teams/${record.teamId}`)}>
            Просмотр команды
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Управление заявками</h1>

      <Card>
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default AdminRequests; 