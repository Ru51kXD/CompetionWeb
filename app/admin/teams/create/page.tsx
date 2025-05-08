'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Select, Card, message, InputNumber } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

export default function AdminTeamCreate() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: any) => {
    setLoading(true);
    try {
      // Получаем команды из localStorage или используем пустой массив
      const storedTeams = localStorage.getItem('teams');
      const teams = storedTeams ? JSON.parse(storedTeams) : [];
      
      // Создаем новую команду
      const newTeam = {
        id: teams.length > 0 ? Math.max(...teams.map((c: any) => c.id)) + 1 : 1,
        name: values.name,
        description: values.description,
        type: values.type,
        maxParticipants: values.maxParticipants,
        participants: [],
        competitions: [],
        memberCount: 0,
        competitionCount: 0,
        createdAt: new Date().toISOString(),
      };
      
      // Сохраняем в localStorage
      localStorage.setItem('teams', JSON.stringify([...teams, newTeam]));
      
      message.success('Команда успешно создана');
      router.push('/admin/teams');
    } catch (error) {
      console.error('Error creating team:', error);
      message.error('Ошибка при создании команды');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => router.push('/admin/teams')} 
        className="mb-4"
      >
        Назад к списку команд
      </Button>
      
      <Card title="Создание новой команды">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
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
            <TextArea rows={4} />
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
            rules={[{ required: true, message: 'Укажите максимальное количество участников' }]}
          >
            <InputNumber min={1} max={100} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Создать команду
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 