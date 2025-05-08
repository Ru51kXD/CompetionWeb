import React from 'react';
import { useParams } from 'react-router-dom';

const TeamDetails: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Детали команды {teamId}</h1>
    </div>
  );
};

export default TeamDetails; 