import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Statistic } from 'antd';
import {
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
  FileTextOutlined,
  DashboardOutlined,
} from '@ant-design/icons';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Команды',
      icon: <TeamOutlined style={{ fontSize: '24px' }} />,
      path: '/admin/teams',
      color: '#1890ff',
      description: 'Управление командами и их участниками',
    },
    {
      title: 'Соревнования',
      icon: <TrophyOutlined style={{ fontSize: '24px' }} />,
      path: '/admin/competitions',
      color: '#52c41a',
      description: 'Управление соревнованиями и их результатами',
    },
    {
      title: 'Пользователи',
      icon: <UserOutlined style={{ fontSize: '24px' }} />,
      path: '/admin/users',
      color: '#722ed1',
      description: 'Управление пользователями и их ролями',
    },
    {
      title: 'Заявки',
      icon: <FileTextOutlined style={{ fontSize: '24px' }} />,
      path: '/admin/requests',
      color: '#fa8c16',
      description: 'Просмотр и обработка заявок на вступление',
    },
  ];

  // Получаем статистику из localStorage
  const getStats = () => {
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    const competitions = JSON.parse(localStorage.getItem('competitions') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const requests = teams.reduce((acc: number, team: any) => {
      const teamRequests = JSON.parse(localStorage.getItem(`team_${team.id}_requests`) || '[]');
      return acc + teamRequests.length;
    }, 0);

    return {
      teams: teams.length,
      competitions: competitions.length,
      users: users.length,
      requests,
    };
  };

  const stats = getStats();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Панель администратора</h1>
        <p className="text-gray-600">Управление системой соревнований</p>
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Команды"
              value={stats.teams}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Соревнования"
              value={stats.competitions}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Пользователи"
              value={stats.users}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Заявки"
              value={stats.requests}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {menuItems.map((item) => (
          <Col xs={24} sm={12} md={6} key={item.path}>
            <Card
              hoverable
              className="h-full"
              onClick={() => navigate(item.path)}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  {React.cloneElement(item.icon, { style: { color: item.color } })}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminPanel; 