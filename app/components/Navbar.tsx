'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaTrophy, FaUserCircle, FaSignOutAlt, FaUserCog, FaEnvelope, FaBell, FaSearch, FaChevronDown } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
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
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }
  
  const closeUserMenu = () => {
    setUserMenuOpen(false)
  }
  
  const toggleSearch = () => {
    setSearchOpen(!searchOpen)
  }

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
  
  const mobileMenuVariants = {
    closed: { 
      height: 0,
      opacity: 0,
      transition: {
        damping: 25,
        stiffness: 500
      }
    },
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        damping: 25,
        stiffness: 500,
        staggerChildren: 0.05
      }
    }
  }
  
  const mobileItemVariants = {
    closed: { 
      opacity: 0,
      y: 10,
      transition: { duration: 0.2 }
    },
    open: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || isOpen || searchOpen 
          ? 'bg-white/90 backdrop-blur-lg shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full opacity-20 group-hover:opacity-30 blur-md"
            ></motion.div>
            <FaTrophy className="text-primary-600 text-3xl relative z-10" />
          </div>
          <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            CompetitionWeb
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          <motion.div className="flex space-x-8" variants={navVariants}>
            <motion.div variants={itemVariants} className="group">
              <Link href="/competitions" className="font-medium group-hover:text-primary-600 transition-colors flex items-center">
                Соревнования
                <FaChevronDown className="ml-1 text-xs transition-transform group-hover:rotate-180" />
              </Link>
              <div className="absolute left-0 right-0 mt-2 p-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border-t border-gray-100">
                <div className="container mx-auto">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Типы соревнований</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/competitions?type=sports" className="text-gray-600 hover:text-primary-600 transition-colors">
                            Спортивные
                          </Link>
                        </li>
                        <li>
                          <Link href="/competitions?type=intellectual" className="text-gray-600 hover:text-primary-600 transition-colors">
                            Интеллектуальные
                          </Link>
                        </li>
                        <li>
                          <Link href="/competitions?type=creative" className="text-gray-600 hover:text-primary-600 transition-colors">
                            Творческие
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Управление</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/competitions/create" className="text-gray-600 hover:text-primary-600 transition-colors">
                            Создать соревнование
                          </Link>
                        </li>
                        <li>
                          <Link href="/dashboard/my-competitions" className="text-gray-600 hover:text-primary-600 transition-colors">
                            Мои соревнования
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-4 rounded-lg">
                      <h4 className="text-lg font-bold text-primary-800 mb-2">Организуйте свое событие</h4>
                      <p className="text-primary-700 text-sm mb-4">
                        Создайте и управляйте собственным соревнованием всего за несколько минут
                      </p>
                      <Link href="/competitions/create" className="btn-primary py-2 px-4 inline-block text-sm">
                        Начать сейчас
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="group">
              <Link href="/teams" className="font-medium group-hover:text-primary-600 transition-colors flex items-center">
                Команды
                <FaChevronDown className="ml-1 text-xs transition-transform group-hover:rotate-180" />
              </Link>
              <div className="absolute left-0 right-0 mt-2 p-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border-t border-gray-100">
                <div className="container mx-auto">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Управление командами</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/teams/create" className="text-gray-600 hover:text-primary-600 transition-colors">
                            Создать команду
                          </Link>
                        </li>
                        <li>
                          <Link href="/teams" className="text-gray-600 hover:text-primary-600 transition-colors">
                            Поиск команд
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Мои команды</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/dashboard/my-teams" className="text-gray-600 hover:text-primary-600 transition-colors">
                            Управление составом
                          </Link>
                        </li>
                        <li>
                          <Link href="/dashboard/invitations" className="text-gray-600 hover:text-primary-600 transition-colors">
                            Приглашения
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-4 rounded-lg">
                      <h4 className="text-lg font-bold text-primary-800 mb-2">Создайте свою команду</h4>
                      <p className="text-primary-700 text-sm mb-4">
                        Соберите команду и принимайте участие в соревнованиях
                      </p>
                      <Link href="/teams/create" className="btn-primary py-2 px-4 inline-block text-sm">
                        Создать команду
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
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

          <motion.div className="flex items-center space-x-4" variants={navVariants}>
            <motion.button
              variants={itemVariants}
              onClick={toggleSearch}
              className="text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Search"
            >
              <FaSearch />
            </motion.button>
            
            {user && (
              <motion.button
                variants={itemVariants}
                className="text-gray-600 hover:text-primary-600 transition-colors"
                aria-label="Notifications"
              >
                <div className="relative">
                  <FaBell />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]"></span>
                </div>
              </motion.button>
            )}
            
            {user ? (
              <motion.div variants={itemVariants} className="relative">
                <button 
                  onClick={toggleUserMenu}
                  onBlur={closeUserMenu}
                  className="flex items-center space-x-2 text-sm font-medium hover:text-primary-600 focus:outline-none"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary-100 border border-primary-200 flex items-center justify-center group">
                    <FaUserCircle className="text-primary-600 text-lg" />
                  </div>
                  <span className="hidden lg:inline-block">{user.name}</span>
                  <FaChevronDown className={`text-xs transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg overflow-hidden z-50 border border-gray-100"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center"
                          onClick={closeUserMenu}
                        >
                          <FaUserCircle className="mr-2 text-gray-500" /> Мой профиль
                        </Link>
                        
                        <Link 
                          href="/dashboard" 
                          className="block px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center"
                          onClick={closeUserMenu}
                        >
                          <FaTrophy className="mr-2 text-gray-500" /> Личный кабинет
                        </Link>
                        
                        {isAdmin() && (
                          <Link 
                            href="/admin" 
                            className="block px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center"
                            onClick={closeUserMenu}
                          >
                            <FaUserCog className="mr-2 text-gray-500" /> Админ панель
                          </Link>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-100 py-1">
                        <button 
                          onClick={() => {
                            logout();
                            closeUserMenu();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <FaSignOutAlt className="mr-2" /> Выйти
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <>
                <motion.div variants={itemVariants}>
                  <Link 
                    href="/login" 
                    className="px-5 py-2 rounded-lg font-medium border-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    Войти
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link 
                    href="/register" 
                    className="px-5 py-2 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  >
                    Регистрация
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleSearch}
            className="text-gray-600 hover:text-primary-600 transition-colors p-2"
            aria-label="Search"
          >
            <FaSearch />
          </button>
          
          {user && (
            <button
              className="text-gray-600 hover:text-primary-600 transition-colors p-2"
              aria-label="Notifications"
            >
              <div className="relative">
                <FaBell />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]"></span>
              </div>
            </button>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-primary-600 focus:outline-none transition-colors p-2"
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 bg-white shadow-inner overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="max-w-3xl mx-auto relative">
                <input
                  type="text"
                  placeholder="Поиск соревнований, команд и участников..."
                  className="w-full py-3 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  onClick={toggleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-1">
                <motion.div variants={mobileItemVariants}>
                  <Link 
                    href="/competitions" 
                    className="block py-3 px-4 text-lg font-medium hover:text-primary-600 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Соревнования
                  </Link>
                </motion.div>
                
                <motion.div variants={mobileItemVariants}>
                  <Link 
                    href="/teams" 
                    className="block py-3 px-4 text-lg font-medium hover:text-primary-600 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Команды
                  </Link>
                </motion.div>
                
                <motion.div variants={mobileItemVariants}>
                  <Link 
                    href="/about" 
                    className="block py-3 px-4 text-lg font-medium hover:text-primary-600 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    О проекте
                  </Link>
                </motion.div>
                
                <motion.div variants={mobileItemVariants}>
                  <Link 
                    href="/contact" 
                    className="block py-3 px-4 text-lg font-medium hover:text-primary-600 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Свяжитесь с нами
                  </Link>
                </motion.div>
                
                {isAdmin() && (
                  <motion.div variants={mobileItemVariants}>
                    <Link 
                      href="/admin" 
                      className="block py-3 px-4 text-lg font-medium text-primary-600 hover:text-primary-800 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Админ панель
                    </Link>
                  </motion.div>
                )}
              </div>

              <motion.div 
                variants={mobileItemVariants}
                className="mt-6 pt-6 border-t border-gray-100"
              >
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <FaUserCircle className="text-xl text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    
                    <Link 
                      href="/profile" 
                      className="block py-3 px-4 text-lg font-medium hover:text-primary-600 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Мой профиль
                    </Link>
                    
                    <Link 
                      href="/dashboard" 
                      className="block py-3 px-4 text-lg font-medium hover:text-primary-600 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Личный кабинет
                    </Link>
                    
                    <button 
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full py-3 px-4 mt-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-center font-medium hover:bg-red-100 transition-colors"
                    >
                      <FaSignOutAlt className="mr-2" /> Выйти
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link 
                      href="/login" 
                      className="py-3 block text-center border-2 border-primary-500 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Войти
                    </Link>
                    <Link 
                      href="/register" 
                      className="py-3 block text-center bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Регистрация
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
} 