'use client';

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaCrown, FaUserCircle } from "react-icons/fa";

const mockTeams = [
  { id: 1, name: "@komandaA", score: 9765, avatar: null },
  { id: 2, name: "@komandaB", score: 7567, avatar: null },
  { id: 3, name: "@komandaC", score: 6674, avatar: null },
  { id: 4, name: "@komandaD", score: 5741, avatar: null },
  { id: 5, name: "@komandaE", score: 4567, avatar: null },
  { id: 6, name: "@komandaF", score: 3791, avatar: null },
  { id: 7, name: "@komandaG", score: 2243, avatar: null },
];

const periods = [
  { label: "All time", value: "all" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("all");
  // В реальном проекте фильтрация по period
  const teams = mockTeams;
  const top3 = teams.slice(0, 3);
  const others = teams.slice(3);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 relative overflow-x-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute w-96 h-96 bg-purple-500 opacity-30 rounded-full blur-3xl top-[-100px] left-[-100px]" />
          <div className="absolute w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />
        </div>
        <div className="container mx-auto px-4 py-12 z-10 relative">
          <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg">Leaderboard</h1>
          {/* Tabs */}
          <div className="flex justify-center mb-8 gap-2">
            {periods.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setPeriod(tab.value)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 text-sm focus:outline-none border-2  ${
                  period === tab.value
                    ? "bg-white text-purple-700 border-white shadow-lg"
                    : "bg-transparent text-white border-white/30 hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Podium */}
          <div className="flex justify-center items-end gap-6 mb-12">
            {/* 2nd */}
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-2 border-4 border-indigo-400">
                <FaUserCircle className="text-5xl text-indigo-300" />
              </div>
              <span className="text-white font-bold">{top3[1].name}</span>
              <span className="text-indigo-200 text-lg font-bold">{top3[1].score}</span>
              <div className="bg-indigo-400 text-white px-4 py-1 rounded-t-lg font-bold mt-2">2</div>
            </div>
            {/* 1st */}
            <div className="flex flex-col items-center relative">
              <div className="bg-white/30 rounded-full w-28 h-28 flex items-center justify-center mb-2 border-4 border-yellow-400 relative">
                <FaUserCircle className="text-7xl text-yellow-300" />
                <FaCrown className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 text-3xl drop-shadow-lg" />
              </div>
              <span className="text-white font-bold text-lg">{top3[0].name}</span>
              <span className="text-yellow-200 text-2xl font-extrabold">{top3[0].score}</span>
              <div className="bg-yellow-400 text-white px-6 py-1 rounded-t-lg font-bold mt-2 text-lg shadow">1</div>
            </div>
            {/* 3rd */}
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-2 border-4 border-purple-400">
                <FaUserCircle className="text-5xl text-purple-300" />
              </div>
              <span className="text-white font-bold">{top3[2].name}</span>
              <span className="text-purple-200 text-lg font-bold">{top3[2].score}</span>
              <div className="bg-purple-400 text-white px-4 py-1 rounded-t-lg font-bold mt-2">3</div>
            </div>
          </div>
          {/* List */}
          <div className="max-w-xl mx-auto bg-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md">
            <h2 className="text-white text-xl font-semibold mb-4">Остальные участники</h2>
            <ul>
              {others.map((team, idx) => (
                <li
                  key={team.id}
                  className="flex items-center justify-between py-3 px-4 mb-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white w-6 text-center">{idx + 4}</span>
                    <span className="bg-white/30 rounded-full w-10 h-10 flex items-center justify-center">
                      <FaUserCircle className="text-2xl text-white/80" />
                    </span>
                    <span className="text-white font-medium">{team.name}</span>
                  </div>
                  <span className="text-white font-bold text-lg">{team.score}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 