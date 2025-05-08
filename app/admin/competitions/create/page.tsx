'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, DatePicker, Select, Card, message, InputNumber, Upload, Textarea } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function AdminCompetitionCreate() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: any) => {
    setLoading(true);
    try {
      const [startDate, endDate] = values.dateRange;
      
      // Получаем соревнования из localStorage или используем пустой массив
      const storedCompetitions = localStorage.getItem('competitions');
      const competitions = storedCompetitions ? JSON.parse(storedCompetitions) : [];
      
      // Создаем новое соревнование
      const newCompetition = {
        id: competitions.length > 0 ? Math.max(...competitions.map((c: any) => c.id)) + 1 : 1,
        title: values.title,
        description: values.description,
        type: values.type,
        status: 'upcoming',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location: values.location,
        participantCount: 0,
        maxTeams: values.maxTeams,
        maxTeamSize: values.maxTeamSize,
        teams: [],
        organizer: values.organizer,
        contactEmail: values.contactEmail,
        rules: values.rules,
        image: values.image || 'https://via.placeholder.com/400x200?text=Competition'
      };
      
      // Сохраняем в localStorage
      localStorage.setItem('competitions', JSON.stringify([...competitions, newCompetition]));
      
      message.success('Соревнование успешно создано');
      router.push('/admin/competitions');
    } catch (error) {
      console.error('Error creating competition:', error);
      message.error('Ошибка при создании соревнования');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => router.push('/admin/competitions')} 
        className="mb-4"
      >
        Назад к списку соревнований
      </Button>
      
      <Card title="Создание нового соревнования">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            maxTeams: 10,
            maxTeamSize: 5
          }}
        >
          <Form.Item
            name="title"
            label="Название соревнования"
            rules={[{ required: true, message: 'Введите название соревнования' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Описание"
            rules={[{ required: true, message: 'Введите описание соревнования' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Тип соревнования"
            rules={[{ required: true, message: 'Выберите тип соревнования' }]}
          >
            <Select>
              <Option value="sport">Спортивные</Option>
              <Option value="intellectual">Интеллектуальные</Option>
              <Option value="creative">Творческие</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="dateRange"
            label="Период проведения"
            rules={[{ required: true, message: 'Выберите период проведения соревнования' }]}
          >
            <RangePicker />
          </Form.Item>
          
          <Form.Item
            name="location"
            label="Место проведения"
            rules={[{ required: true, message: 'Укажите место проведения соревнования' }]}
          >
            <Input />
          </Form.Item>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="maxTeams"
              label="Максимальное количество команд"
              rules={[{ required: true, message: 'Укажите максимальное количество команд' }]}
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="maxTeamSize"
              label="Максимальный размер команды"
              rules={[{ required: true, message: 'Укажите максимальный размер команды' }]}
            >
              <InputNumber min={1} max={20} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          
          <Form.Item
            name="organizer"
            label="Организатор"
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="contactEmail"
            label="Контактный email"
            rules={[{ type: 'email', message: 'Введите корректный email' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="rules"
            label="Правила соревнования"
          >
            <TextArea rows={6} />
          </Form.Item>
          
          <Form.Item
            name="image"
            label="Изображение"
          >
            <Input placeholder="URL изображения" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Создать соревнование
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 