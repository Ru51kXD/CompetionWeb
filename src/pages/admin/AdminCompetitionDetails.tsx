import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
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

const AdminCompetitionDetails: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetition = () => {
      try {
        const storedCompetitions = localStorage.getItem('competitions');
        let competitions: Competition[] = [];
        if (storedCompetitions) {
          competitions = JSON.parse(storedCompetitions);
        } else {
          competitions = mockCompetitions;
          localStorage.setItem('competitions', JSON.stringify(mockCompetitions));
        }
        const found = competitions.find(c => c.id === Number(competitionId));
        if (found) {
          setCompetition(found);
        } else {
          message.error('Соревнование не найдено');
          navigate('/admin/competitions');
        }
      } catch (error) {
        message.error('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };
    if (competitionId) fetchCompetition();
  }, [competitionId, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spin size="large" tip="Загрузка..." /></div>;
  }

  if (!competition) {
    return (
      <div className="p-6">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/competitions')} className="mb-4">Назад к списку соревнований</Button>
        <Card><div className="text-center text-red-500">Соревнование не найдено</div></Card>
      </div>
    );
  }

  const typeText = {
    sport: 'Спортивные',
    intellectual: 'Интеллектуальные',
    creative: 'Творческие',
  };
  const statusText = {
    upcoming: 'Предстоящее',
    ongoing: 'Текущее',
    completed: 'Завершенное',
  };
  const statusColor = {
    upcoming: 'blue',
    ongoing: 'green',
    completed: 'gray',
  };

  return (
    <div className="p-6">
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/competitions')} className="mb-4">Назад к списку соревнований</Button>
      <Card>
        <h1 className="text-2xl font-bold mb-4">{competition.name}</h1>
        <div className="flex gap-4 mb-4">
          <Tag color="purple">ID: {competition.id}</Tag>
          <Tag color="blue">{typeText[competition.type]}</Tag>
          <Tag color={statusColor[competition.status]}>{statusText[competition.status]}</Tag>
        </div>
        <div className="mb-2">Дата начала: <b>{new Date(competition.startDate).toLocaleDateString()}</b></div>
        <div className="mb-2">Дата окончания: <b>{new Date(competition.endDate).toLocaleDateString()}</b></div>
        <div className="mb-2">Участников: <b>{competition.participants}</b></div>
      </Card>
    </div>
  );
};

export default AdminCompetitionDetails; 