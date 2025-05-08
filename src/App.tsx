import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Competitions from './pages/Competitions';
import TeamDetails from './pages/TeamDetails';
import CompetitionDetails from './pages/CompetitionDetails';
import AdminPanel from './pages/admin/AdminPanel';
import AdminTeams from './pages/admin/AdminTeams';
import AdminTeamDetails from './pages/admin/AdminTeamDetails';
import AdminCompetitions from './pages/admin/AdminCompetitions';
import AdminCompetitionDetails from './pages/admin/AdminCompetitionDetails';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRequests from './pages/admin/AdminRequests';
import Search from './pages/Search';
import Leaders from './pages/Leaders';
import AdminCompetitionCreate from './pages/admin/AdminCompetitionCreate';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/teams/:teamId" element={<TeamDetails />} />
            <Route path="/competitions/:competitionId" element={<CompetitionDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/leaders" element={<Leaders />} />
            
            {/* Админ-панель */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/teams" element={<AdminTeams />} />
            <Route path="/admin/teams/:teamId" element={<AdminTeamDetails />} />
            <Route path="/admin/competitions" element={<AdminCompetitions />} />
            <Route path="/admin/competitions/create" element={<AdminCompetitionCreate />} />
            <Route path="/admin/competitions/:competitionId" element={<AdminCompetitionDetails />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/requests" element={<AdminRequests />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 