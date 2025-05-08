import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Система соревнований</Link>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-gray-300">Главная</Link>
          <Link to="/teams" className="hover:text-gray-300">Команды</Link>
          <Link to="/competitions" className="hover:text-gray-300">Соревнования</Link>
          <Link to="/leaders" className="hover:text-gray-300">Лидеры</Link>
          <Link to="/admin" className="hover:text-gray-300">Админ</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 