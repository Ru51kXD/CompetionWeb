'use client'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ParallaxHero from './components/ParallaxHero'
import FeatureSection from './components/FeatureSection'
import CompetitionCard from './components/CompetitionCard'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { FaTrophy, FaUsers, FaCalendarAlt, FaMedal, FaRegLightbulb, FaArrowRight, FaChevronDown, FaMapMarkerAlt } from 'react-icons/fa'

// Mock data for upcoming competitions
const upcomingCompetitions = [
  {
    id: 1,
    title: 'Городской турнир по шахматам',
    description: 'Ежегодный турнир по шахматам среди любителей и профессионалов всех возрастов.',
    type: 'INTELLECTUAL' as const,
    startDate: new Date('2023-12-15'),
    endDate: new Date('2023-12-17'),
    location: 'Городской шахматный клуб',
    image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2071'
  },
  {
    id: 2,
    title: 'Межшкольные соревнования по футболу',
    description: 'Футбольные матчи между командами школ города. Присоединяйтесь к спортивному празднику!',
    type: 'SPORTS' as const,
    startDate: new Date('2023-12-20'),
    endDate: new Date('2023-12-25'),
    location: 'Центральный стадион',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2034'
  },
  {
    id: 3,
    title: 'Конкурс молодых художников',
    description: 'Открытый конкурс для художников до 25 лет. Покажите свой талант и выиграйте ценные призы!',
    type: 'CREATIVE' as const,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-20'),
    location: 'Городская галерея искусств',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071'
  }
]

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Refs for scroll animations
  const featuresRef = useRef(null)
  const competitionsRef = useRef(null)
  const ctaRef = useRef(null)
  
  // Scroll animations
  const { scrollYProgress } = useScroll()
  const competitionsOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1])
  const competitionsY = useTransform(scrollYProgress, [0.3, 0.4], [100, 0])
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`min-h-screen flex flex-col ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <Navbar />
      
      <main className="flex-grow">
        {/* Enhanced Parallax Hero */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-accent-900/90 z-10"></div>
          
          {/* Background particles */}
          <div className="absolute inset-0 z-0">
            <div className="absolute w-full h-full">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white opacity-20"
                  style={{
                    width: Math.random() * 20 + 5,
                    height: Math.random() * 20 + 5,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, Math.random() * -100 - 50],
                    opacity: [0.2, 0],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Video or image background */}
          <div className="absolute inset-0 z-0">
            <video 
              autoPlay 
              muted 
              loop 
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?q=80&w=2070"
            >
              <source src="https://player.vimeo.com/external/473507966.sd.mp4?s=afd3d1d9fe2ddd774181f400a00936c73a0968db&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
            </video>
          </div>
          
          <div className="container mx-auto px-4 relative z-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-block py-1 px-4 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-4">
                Платформа для соревнований
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Создавайте <span className="text-accent-400">соревнования</span>, формируйте <span className="text-accent-400">команды</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10">
                CompetitionWeb - всё, что нужно для организации и участия в соревнованиях любого масштаба
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/register" className="btn bg-white hover:bg-white/90 text-primary-700 px-8 py-4 rounded-lg text-lg font-medium">
                Начать бесплатно
              </Link>
              
              <Link href="/competitions" className="btn bg-primary-600/50 hover:bg-primary-600/70 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-lg text-lg font-medium">
                Смотреть соревнования
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
              <button 
                onClick={scrollToFeatures}
                className="flex flex-col items-center text-white/80 hover:text-white transition-colors"
              >
                <span className="text-sm mb-2">Узнать больше</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FaChevronDown className="text-2xl" />
                </motion.div>
              </button>
            </motion.div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="bg-white py-12 relative z-10 border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center p-6"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">250+</div>
                <div className="text-gray-600">Соревнований</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center p-6"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">1.2K+</div>
                <div className="text-gray-600">Команд</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center p-6"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">8.5K+</div>
                <div className="text-gray-600">Участников</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center p-6"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">15+</div>
                <div className="text-gray-600">Городов</div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section with reference */}
        <div ref={featuresRef}>
          <FeatureSection />
        </div>
        
        {/* Upcoming Competitions Section */}
        <section ref={competitionsRef} className="py-20 bg-gray-50 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-100 rounded-full -ml-40 -mb-40 opacity-50"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              style={{ opacity: competitionsOpacity, y: competitionsY }}
              className="text-center mb-16"
            >
              <span className="inline-block py-1 px-4 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">
                Что нового?
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                Ближайшие соревнования
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Присоединяйтесь к предстоящим мероприятиям и покажите свои таланты
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingCompetitions.map((competition, index) => (
                <motion.div 
                  key={competition.id} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col transform transition-all"
                >
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {competition.image && (
                      <img 
                        src={competition.image}
                        alt={competition.title}
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        competition.type === 'SPORTS' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        competition.type === 'INTELLECTUAL' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                        'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {competition.type === 'SPORTS' ? 'Спортивное' :
                         competition.type === 'INTELLECTUAL' ? 'Интеллектуальное' :
                         'Творческое'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-3 text-gray-800">{competition.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm flex-grow">{competition.description}</p>
                    
                    <div className="mt-auto">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <FaCalendarAlt className="mr-2 text-primary-500" />
                        <span>
                          {new Date(competition.startDate).toLocaleDateString('ru-RU', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <FaMapMarkerAlt className="mr-2 text-primary-500" />
                        <span>{competition.location}</span>
                      </div>
                      
                      <Link href={`/competitions/${competition.id}`}
                        className="inline-block mt-2 text-primary-600 font-medium hover:text-primary-700 transition-colors flex items-center group"
                      >
                        Подробнее 
                        <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link href="/competitions" className="btn-primary px-8 py-3 rounded-lg">
                Все соревнования
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block py-1 px-4 bg-accent-100 text-accent-800 rounded-full text-sm font-medium mb-4">
                Как это работает
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Три простых шага
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Начните использовать платформу для организации соревнований всего за несколько минут
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-6 border-2 border-primary-200">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4">Создайте аккаунт</h3>
                <p className="text-gray-600">
                  Зарегистрируйтесь на платформе и получите доступ ко всем функциям
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-6 border-2 border-primary-200">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4">Создайте команду</h3>
                <p className="text-gray-600">
                  Соберите свою команду или присоединитесь к существующей для участия
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-6 border-2 border-primary-200">
                  3
                </div>
                <h3 className="text-xl font-bold mb-4">Участвуйте</h3>
                <p className="text-gray-600">
                  Регистрируйтесь на соревнования, побеждайте и отслеживайте результаты
                </p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mt-16"
            >
              <Link href="/register" className="btn-primary px-8 py-3 rounded-lg">
                Начать сейчас
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section ref={ctaRef} className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-700 skew-y-1 transform origin-top-right"></div>
          
          {/* Animated shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-20 -mt-20 opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full -ml-40 -mb-40 opacity-5"></div>
            
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 100 + 50,
                  height: Math.random() * 100 + 50,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.07,
                }}
                animate={{
                  y: [0, Math.random() * 50 - 25],
                  x: [0, Math.random() * 50 - 25],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </div>
          
          <div className="container mx-auto px-4 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center text-white"
            >
              <FaTrophy className="text-5xl mx-auto mb-6 text-white/80" />
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Готовы организовать свое соревнование?
              </h2>
              <p className="text-xl mb-10 text-white/90 max-w-3xl mx-auto">
                Присоединяйтесь к нашей платформе и создайте свое собственное мероприятие всего за несколько минут.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/register" className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-medium">
                  Зарегистрироваться
                </Link>
                <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-medium">
                  Свяжитесь с нами
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 