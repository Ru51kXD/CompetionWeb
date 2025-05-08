'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { FaUsers, FaTrophy, FaUserShield, FaHome, FaUserFriends, FaClipboardList, FaTachometerAlt, FaSignOutAlt, FaEnvelope } from 'react-icons/fa'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not admin and not loading
    if (!loading && (!user || !isAdmin())) {
      router.push('/login')
    }
  }, [user, loading, isAdmin, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Do not render anything if not admin
  if (!user || !isAdmin()) {
    return null
  }

  // Admin sidebar navigation items
  const navItems = [
    { name: 'Обзор', href: '/admin', icon: <FaTachometerAlt className="mr-2" /> },
    { name: 'Пользователи', href: '/admin/users', icon: <FaUsers className="mr-2" /> },
    { name: 'Команды', href: '/admin/teams', icon: <FaUserFriends className="mr-2" /> },
    { name: 'Соревнования', href: '/admin/competitions', icon: <FaTrophy className="mr-2" /> },
    { name: 'Сообщения', href: '/admin/messages', icon: <FaEnvelope className="mr-2" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-800 text-white fixed h-full">
        <div className="p-4 border-b border-primary-700">
          <div className="flex items-center">
            <FaUserShield className="text-2xl text-primary-300 mr-2" />
            <h1 className="text-xl font-semibold">Админ панель</h1>
          </div>
        </div>
        
        <nav className="mt-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="block px-4 py-2.5 text-sm hover:bg-primary-700 transition-colors flex items-center"
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 px-4 pt-4 border-t border-primary-700">
            <Link
              href="/"
              className="block py-2.5 text-sm hover:bg-primary-700 transition-colors rounded flex items-center"
            >
              <FaHome className="mr-2" />
              Вернуться на сайт
            </Link>
            
            <button
              onClick={logout}
              className="block w-full text-left py-2.5 text-sm text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors rounded flex items-center mt-2"
            >
              <FaSignOutAlt className="mr-2" />
              Выйти
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="ml-64 flex-1 p-6">
        {children}
      </main>
    </div>
  )
} 