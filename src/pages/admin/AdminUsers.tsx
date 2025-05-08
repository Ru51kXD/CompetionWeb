import React, { useState, useEffect } from 'react';
import { Table, Card, Button, message, Modal, Space, Tag, Input } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { mockUsers } from '../../data/mockData';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || JSON.stringify(mockUsers));
      setUsers(storedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      message.error('Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (user: User) => {
    const newRole = user.role === 'user' ? 'admin' : 'user';
    Modal.confirm({
      title: 'Подтверждение',
      content: `Вы уверены, что хотите изменить роль пользователя ${user.username} на ${newRole}?`,
      onOk: () => {
        try {
          const updatedUsers = users.map((u) =>
            u.id === user.id ? { ...u, role: newRole } : u
          );
          localStorage.setItem('users', JSON.stringify(updatedUsers));
          setUsers(updatedUsers);
          message.success('Роль пользователя изменена');
        } catch (error) {
          console.error('Error changing user role:', error);
          message.error('Ошибка при изменении роли пользователя');
        }
      },
    });
  };

  const handleDeleteUser = (user: User) => {
    Modal.confirm({
      title: 'Подтверждение',
      content: `Вы уверены, что хотите удалить пользователя ${user.username}?`,
      onOk: () => {
        try {
          const updatedUsers = users.filter((u) => u.id !== user.id);
          localStorage.setItem('users', JSON.stringify(updatedUsers));
          setUsers(updatedUsers);
          message.success('Пользователь удален');
        } catch (error) {
          console.error('Error deleting user:', error);
          message.error('Ошибка при удалении пользователя');
        }
      },
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Имя пользователя',
      dataIndex: 'username',
      key: 'username',
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
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? 'Администратор' : 'Пользователь'}
        </Tag>
      ),
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button
            type={record.role === 'user' ? 'primary' : 'default'}
            onClick={() => handleRoleChange(record)}
          >
            {record.role === 'user' ? 'Сделать админом' : 'Сделать пользователем'}
          </Button>
          <Button danger onClick={() => handleDeleteUser(record)}>
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Управление пользователями</h1>

      <Card>
        <div className="mb-4 flex justify-between items-center">
          <Input
            placeholder="Поиск пользователей..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<UserAddOutlined />}>
            Добавить пользователя
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default AdminUsers; 