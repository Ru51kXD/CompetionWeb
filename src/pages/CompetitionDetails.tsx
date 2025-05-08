import React from 'react';
import { useParams } from 'react-router-dom';

const CompetitionDetails: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Детали соревнования {competitionId}</h1>
    </div>
  );
};

export default CompetitionDetails; 