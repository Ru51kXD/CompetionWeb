'use client'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ParallaxHero from './components/ParallaxHero'
import FeatureSection from './components/FeatureSection'
import CompetitionCard from './components/CompetitionCard'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`min-h-screen flex flex-col ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <Navbar />
      
      <main className="flex-grow">
        <ParallaxHero />
        
        <FeatureSection />
        
        {/* Upcoming Competitions Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ближайшие соревнования</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Присоединяйтесь к предстоящим мероприятиям и покажите свои таланты
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingCompetitions.map((competition, index) => (
                <CompetitionCard 
                  key={competition.id} 
                  {...competition} 
                  index={index} 
                />
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <a href="/competitions" className="btn-primary px-8 py-3">
                Все соревнования
              </a>
            </motion.div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-700 text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Готовы организовать свое соревнование?</h2>
              <p className="text-xl mb-8 text-white/90">
                Присоединяйтесь к нашей платформе и создайте свое собственное мероприятие всего за несколько минут.
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