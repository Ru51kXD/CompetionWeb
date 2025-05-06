'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaMapMarkerAlt, FaTag } from 'react-icons/fa'

type CompetitionType = 'SPORTS' | 'INTELLECTUAL' | 'CREATIVE'

interface CompetitionCardProps {
  id: number
  title: string
  description: string
  type: CompetitionType
  startDate: Date
  endDate: Date
  location?: string
  image?: string
  index: number
}

const typeLabels: Record<CompetitionType, string> = {
  SPORTS: 'Спортивное',
  INTELLECTUAL: 'Интеллектуальное',
  CREATIVE: 'Творческое'
}

const typeColors: Record<CompetitionType, string> = {
  SPORTS: 'bg-primary-100 text-primary-800',
  INTELLECTUAL: 'bg-secondary-100 text-secondary-800',
  CREATIVE: 'bg-accent-100 text-accent-800'
}

export default function CompetitionCard({
  id,
  title,
  description,
  type,
  startDate,
  endDate,
  location,
  image = 'https://images.unsplash.com/photo-1506485338023-6ce5f36692df?q=80&w=2070',
  index
}: CompetitionCardProps) {
  const [hovered, setHovered] = useState(false)
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      className="card card-hover h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden h-52">
        <Image
          src={image}
          alt={title}
          fill
          className={`object-cover transition-transform duration-500 ${hovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute top-4 left-4">
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${typeColors[type]}`}>
            {typeLabels[type]}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <FaCalendarAlt className="mr-2 text-primary-500" />
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </div>
          
          {location && (
            <div className="flex items-center text-sm text-gray-500">
              <FaMapMarkerAlt className="mr-2 text-primary-500" />
              <span>{location}</span>
            </div>
          )}
        </div>
        
        <Link 
          href={`/competitions/${id}`}
          className="block w-full btn-primary text-center mt-2"
        >
          Подробнее
        </Link>
      </div>
    </motion.div>
  )
} 