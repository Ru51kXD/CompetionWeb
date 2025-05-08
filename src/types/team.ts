export interface Participant {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface TeamCompetition {
  id: number;
  name: string;
  type: string;
  status: string;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  type: string;
  maxParticipants: number;
  participants: Participant[];
  competitions: TeamCompetition[];
  createdAt: string;
} 