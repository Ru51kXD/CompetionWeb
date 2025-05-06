'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaTrophy, FaUsers, FaMedal, FaCalendarAlt, FaChartLine, FaHandshake } from 'react-icons/fa'

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  const stats = [
    { icon: <FaTrophy />, value: '150+', label: 'соревнований', color: 'bg-primary-100 text-primary-600' },
    { icon: <FaUsers />, value: '10,000+', label: 'участников', color: 'bg-secondary-100 text-secondary-600' },
    { icon: <FaMedal />, value: '500+', label: 'награжденных', color: 'bg-accent-100 text-accent-600' },
    { icon: <FaCalendarAlt />, value: '5+', label: 'лет опыта', color: 'bg-yellow-100 text-yellow-600' }
  ]

  const teamMembers = [
    {
      name: 'Александр Петров',
      role: 'Основатель и CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974',
      description: 'Опытный организатор спортивных мероприятий с 10-летним стажем в индустрии.'
    },
    {
      name: 'Екатерина Смирнова',
      role: 'Директор по развитию',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974',
      description: 'Специалист в области маркетинга и развития проектов в сфере спорта и отдыха.'
    },
    {
      name: 'Михаил Соколов',
      role: 'Технический директор',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974',
      description: 'Руководит технической стороной проекта, обеспечивая бесперебойную работу сервиса.'
    },
    {
      name: 'Анна Волкова',
      role: 'Руководитель службы поддержки',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964',
      description: 'Следит за качеством обслуживания клиентов и решением всех возникающих вопросов.'
    }
  ]

  return (
    <div className={`min-h-screen flex flex-col ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-700 to-secondary-700 text-white py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520808663317-647b476a81b9?q=80&w=2073')] bg-center bg-cover opacity-10"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">О проекте CompetitionWeb</h1>
              <p className="text-xl mb-8">
                Мы создаем удобную платформу для организации и проведения соревнований любых масштабов
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Our Mission */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2"
              >
                <h2 className="text-3xl font-bold mb-6">Наша миссия</h2>
                <p className="text-lg mb-4">
                  CompetitionWeb создан, чтобы сделать организацию соревнований простой и доступной для всех. Мы верим, что состязательный дух способствует личностному росту и развитию общества.
                </p>
                <p className="text-lg mb-4">
                  Наша цель — предоставить организаторам и участникам удобный инструмент для проведения мероприятий различных типов: от спортивных турниров до интеллектуальных игр и творческих конкурсов.
                </p>
                <p className="text-lg">
                  Мы стремимся сделать соревновательный процесс максимально прозрачным, честным и увлекательным для всех участников.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2 relative"
              >
                <div className="rounded-xl overflow-hidden shadow-xl relative h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070"
                    alt="Our Mission"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-500 rounded-lg -z-10"></div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary-500 rounded-lg -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-md p-6 text-center flex flex-col items-center"
                >
                  <div className={`w-16 h-16 rounded-full ${stat.color} flex items-center justify-center mb-4 text-2xl`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Почему выбирают нас</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Наша платформа предлагает уникальные преимущества для организаторов и участников соревнований
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl mb-4">
                  <FaChartLine />
                </div>
                <h3 className="text-xl font-bold mb-3">Удобство управления</h3>
                <p className="text-gray-600">
                  Интуитивно понятный интерфейс для организации и управления соревнованиями любой сложности.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center text-2xl mb-4">
                  <FaHandshake />
                </div>
                <h3 className="text-xl font-bold mb-3">Техническая поддержка</h3>
                <p className="text-gray-600">
                  Круглосуточная помощь нашей команды поддержки для организаторов и участников.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center text-2xl mb-4">
                  <FaUsers />
                </div>
                <h3 className="text-xl font-bold mb-3">Активное сообщество</h3>
                <p className="text-gray-600">
                  Тысячи участников и организаторов, объединенных общими интересами и целями.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Our Team */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Наша команда</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Профессионалы, объединенные одной целью — сделать организацию соревнований простой и эффективной
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary-600 mb-4">{member.role}</p>
                    <p className="text-gray-600">{member.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-700 text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Присоединяйтесь к нашей платформе</h2>
              <p className="text-xl mb-8 text-white/90">
                Начните организовывать свои соревнования с CompetitionWeb уже сегодня
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a href="/register" className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3">
                  Зарегистрироваться
                </a>
                <a href="/contact" className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-3">
                  Свяжитесь с нами
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 