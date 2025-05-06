'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ParallaxHero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const parallaxLayerRef1 = useRef<HTMLDivElement>(null)
  const parallaxLayerRef2 = useRef<HTMLDivElement>(null)
  const parallaxLayerRef3 = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
      
      const section = sectionRef.current
      const layer1 = parallaxLayerRef1.current
      const layer2 = parallaxLayerRef2.current
      const layer3 = parallaxLayerRef3.current
      const text = textRef.current

      if (section && layer1 && layer2 && layer3 && text) {
        // Create parallax effect
        gsap.to(layer1, {
          y: 100,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        })

        gsap.to(layer2, {
          y: 200,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        })

        gsap.to(layer3, {
          y: 300,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        })

        // Text animation
        gsap.to(text, {
          y: 100,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '30% top',
            scrub: true
          }
        })
      }
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    }
  }

  return (
    <div ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Parallax Layers */}
      <div 
        ref={parallaxLayerRef1} 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070")', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}
      />
      <div 
        ref={parallaxLayerRef2} 
        className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-primary-700/20 to-transparent" 
      />
      <div 
        ref={parallaxLayerRef3} 
        className="absolute inset-0 z-20 bg-gradient-to-r from-secondary-700/10 via-transparent to-accent-700/10" 
      />

      {/* Content */}
      <div className="relative z-30 h-full flex flex-col justify-center items-center text-center text-white px-4">
        <div ref={textRef}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg"
            >
              <span className="bg-gradient-to-r from-primary-400 via-white to-accent-400 bg-clip-text text-transparent">
                Организуйте соревнования любого формата
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200"
            >
              Спортивные, интеллектуальные и творческие состязания на одной платформе. 
              Мы сделаем организацию вашего мероприятия простой и эффективной.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/competitions" className="btn-primary text-base px-8 py-3">
                Просмотреть соревнования
              </Link>
              <Link href="/about" className="btn-outline text-base px-8 py-3 text-white border-white hover:bg-white/10">
                Узнать больше
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-ping"></div>
          </div>
        </div>
      </div>
    </div>
  )
} 