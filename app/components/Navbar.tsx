'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaBars, FaTimes, FaTrophy, FaUserCircle } from 'react-icons/fa'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
          </motion.div>

          <motion.div className="flex space-x-4" variants={navVariants}>
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
            <div className="pt-4 flex flex-col space-y-3">
              <Link href="/login" className="btn-outline text-center">
                Войти
              </Link>
              <Link href="/register" className="btn-primary text-center">
                Регистрация
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
} 