'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaTrophy, FaUsers, FaChartLine, FaClipboardCheck, FaMedal, FaCalendarCheck } from 'react-icons/fa'

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

const Feature = ({ icon, title, description, delay }: FeatureProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-center w-14 h-14 text-2xl text-white rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

export default function FeatureSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })
  
  const features = [
    {
      icon: <FaTrophy />,
      title: 'Организация соревнований',
      description: 'Создавайте и управляйте соревнованиями любого типа: спортивными, интеллектуальными и творческими.'
    },
    {
      icon: <FaUsers />,
      title: 'Управление командами',
      description: 'Формируйте команды участников, отслеживайте их состав и прогресс в соревнованиях.'
    },
    {
      icon: <FaChartLine />,
      title: 'Система рейтингов',
      description: 'Автоматический подсчет очков и формирование рейтинговых таблиц для участников и команд.'
    },
    {
      icon: <FaClipboardCheck />,
      title: 'Регистрация участников',
      description: 'Удобная система регистрации участников и модерации заявок на участие в соревнованиях.'
    },
    {
      icon: <FaMedal />,
      title: 'Результаты и награды',
      description: 'Автоматическое определение победителей и система распределения наград.'
    },
    {
      icon: <FaCalendarCheck />,
      title: 'Расписание событий',
      description: 'Создание и управление расписанием мероприятий с напоминаниями о важных датах.'
    }
  ]

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Возможности платформы</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Наш сервис предоставляет все необходимые инструменты для организации соревнований на высшем уровне
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 