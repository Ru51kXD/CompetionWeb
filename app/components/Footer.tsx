'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaTrophy, FaEnvelope, FaPhone, FaMapMarkerAlt, FaVk, FaTelegram, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <FaTrophy className="text-primary-400 text-3xl" />
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                CompetitionWeb
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              Платформа для организации и проведения спортивных, интеллектуальных и творческих соревнований.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaVk className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaTelegram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-6">Быстрые ссылки</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/competitions" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Соревнования
                </Link>
              </li>
              <li>
                <Link href="/teams" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Команды
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary-400 transition-colors">
                  О проекте
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Условия использования
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Types of Competitions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-6">Типы соревнований</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/competitions?type=SPORTS" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Спортивные
                </Link>
              </li>
              <li>
                <Link href="/competitions?type=INTELLECTUAL" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Интеллектуальные
                </Link>
              </li>
              <li>
                <Link href="/competitions?type=CREATIVE" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Творческие
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-6">Контактная информация</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-400 mt-1" />
                <span className="text-gray-400">г. Москва, ул. Примерная, д. 123</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary-400" />
                <span className="text-gray-400">+7 (123) 456-78-90</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400" />
                <span className="text-gray-400">info@competitionweb.ru</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="text-center text-gray-500">
            <p>&copy; {currentYear} CompetitionWeb. Все права защищены.</p>
          </div>
        </div>
      </div>
    </footer>
  )
} 