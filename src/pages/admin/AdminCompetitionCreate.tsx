import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Select, Card, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { mockCompetitions } from '../../data/mockData';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminCompetitionCreate: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: any) => {
    setLoading(true);
    try {
      const [startDate, endDate] = values.dateRange;
      
      // Get competitions from localStorage or use mock data
      const storedCompetitions = localStorage.getItem('competitions');
      const competitions = storedCompetitions ? JSON.parse(storedCompetitions) : mockCompetitions;
      
      // Create new competition
      const newCompetition = {
        id: competitions.length + 1,
        name: values.name,
        type: values.type,
        status: 'upcoming',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        participants: 0
      };
      
      // Save to localStorage
      localStorage.setItem('competitions', JSON.stringify([...competitions, newCompetition]));
      
      message.success('Соревнование успешно создано');
      navigate('/admin/competitions');
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
        onClick={() => navigate('/admin/competitions')} 
        className="mb-4"
      >
        Назад к списку соревнований
      </Button>
      
      <Card title="Создание нового соревнования">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Название соревнования"
            rules={[{ required: true, message: 'Введите название соревнования' }]}
          >
            <Input />
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
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Создать соревнование
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminCompetitionCreate; 