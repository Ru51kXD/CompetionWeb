'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaTrophy, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaArrowUp } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Scroll to Top Button */}
      <div className="container mx-auto px-4">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className={`w-12 h-12 rounded-full bg-primary-600 hover:bg-primary-700 flex items-center justify-center shadow-lg ${!showScrollTop && 'pointer-events-none'}`}
            aria-label="Scroll to top"
          >
            <FaArrowUp />
          </motion.button>
        </div>
      </div>
      
      {/* Newsletter section */}
      <div className="bg-primary-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Будьте в курсе новостей</h3>
                <p className="text-gray-300 mb-0">
                  Подпишитесь на нашу рассылку, чтобы получать информацию о новых соревнованиях и обновлениях
                </p>
              </div>
              <div>
                <form className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Ваш email"
                    className="flex-grow py-3 px-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    className="btn bg-white text-primary-700 hover:bg-gray-100 py-3 px-6 rounded-lg font-medium"
                  >
                    Подписаться
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <FaTrophy className="text-white text-xl" />
                </div>
                <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  CompetitionWeb
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Платформа для организации и участия в соревнованиях различных типов. Создавайте команды, регистрируйтесь на мероприятия и достигайте новых высот.
              </p>
              <div className="flex space-x-4">
                <Link href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  <FaFacebook className="text-xl" />
                </Link>
                <Link href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                  <FaTwitter className="text-xl" />
                </Link>
                <Link href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <FaInstagram className="text-xl" />
                </Link>
                <Link href="https://youtube.com" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                  <FaYoutube className="text-xl" />
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Разделы</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/competitions" className="text-gray-400 hover:text-white transition-colors inline-block">
                    Соревнования
                  </Link>
                </li>
                <li>
                  <Link href="/teams" className="text-gray-400 hover:text-white transition-colors inline-block">
                    Команды
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors inline-block">
                    О проекте
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors inline-block">
                    Контакты
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors inline-block">
                    Личный кабинет
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Полезные ссылки</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition-colors inline-block">
                    Часто задаваемые вопросы
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors inline-block">
                    Условия использования
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors inline-block">
                    Политика конфиденциальности
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-400 hover:text-white transition-colors inline-block">
                    Поддержка
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Контакты</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaMapMarkerAlt className="text-primary-500 mr-3 mt-1" />
                  <span className="text-gray-400">
                    123456, Россия, г. Москва, ул. Примерная, д. 123
                  </span>
                </li>
                <li className="flex items-center">
                  <FaPhone className="text-primary-500 mr-3" />
                  <Link href="tel:+71234567890" className="text-gray-400 hover:text-white transition-colors">
                    +7 (123) 456-78-90
                  </Link>
                </li>
                <li className="flex items-center">
                  <FaEnvelope className="text-primary-500 mr-3" />
                  <Link href="mailto:info@competitionweb.com" className="text-gray-400 hover:text-white transition-colors">
                    info@competitionweb.com
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="py-6 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} CompetitionWeb. Все права защищены.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-gray-300 text-sm">
                    Условия
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm">
                    Конфиденциальность
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-500 hover:text-gray-300 text-sm">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 