'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaBars, FaTimes, FaTrophy, FaUserCircle, FaSignOutAlt, FaUserCog, FaEnvelope } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout, isAdmin } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <FaTrophy className="text-primary-600 text-3xl" />
          <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            CompetitionWeb
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          <motion.div className="flex space-x-8" variants={navVariants}>
            <motion.div variants={itemVariants}>
              <Link href="/competitions" className="font-medium hover:text-primary-600 transition-colors">
                Соревнования
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/teams" className="font-medium hover:text-primary-600 transition-colors">
                Команды
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/about" className="font-medium hover:text-primary-600 transition-colors">
                О проекте
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/contact" className="font-medium hover:text-primary-600 transition-colors">
                Свяжитесь с нами
              </Link>
            </motion.div>
            {isAdmin() && (
              <motion.div variants={itemVariants}>
                <Link href="/admin" className="font-medium text-primary-600 hover:text-primary-800 transition-colors">
                  Админ панель
                </Link>
              </motion.div>
            )}
          </motion.div>

          <motion.div className="flex space-x-4" variants={navVariants}>
            {user ? (
              <>
                <motion.div variants={itemVariants} className="flex items-center">
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-sm font-medium hover:text-primary-600">
                      <FaUserCircle className="text-xl" />
                      <span>{user.name}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50 invisible group-hover:visible transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center">
                        <FaUserCircle className="mr-2" /> Мой профиль
                      </Link>
                      {isAdmin() && (
                        <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center">
                          <FaUserCog className="mr-2" /> Админ панель
                        </Link>
                      )}
                      <button 
                        onClick={logout}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2" /> Выйти
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div variants={itemVariants}>
                  <Link href="/login" className="btn-outline">
                    Войти
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link href="/register" className="btn-primary">
                    Регистрация
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              href="/competitions" 
              className="block py-2 font-medium hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Соревнования
            </Link>
            <Link 
              href="/teams" 
              className="block py-2 font-medium hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Команды
            </Link>
            <Link 
              href="/about" 
              className="block py-2 font-medium hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              О проекте
            </Link>
            <Link 
              href="/contact" 
              className="block py-2 font-medium hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Свяжитесь с нами
            </Link>
            {isAdmin() && (
              <Link 
                href="/admin" 
                className="block py-2 font-medium text-primary-600 hover:text-primary-800"
                onClick={() => setIsOpen(false)}
              >
                Админ панель
              </Link>
            )}
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center py-2">
                    <FaUserCircle className="text-xl mr-2" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <Link 
                    href="/profile" 
                    className="block py-2 font-medium hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Мой профиль
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full btn-outline-danger flex items-center justify-center"
                  >
                    <FaSignOutAlt className="mr-2" /> Выйти
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link 
                    href="/login" 
                    className="btn-outline text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Войти
                  </Link>
                  <Link 
                    href="/register" 
                    className="btn-primary text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
} 