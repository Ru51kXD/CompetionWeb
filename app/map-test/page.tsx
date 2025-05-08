import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamically load the test component to avoid SSR issues
const GoogleMapTestPage = dynamic(
  () => import('../components/GoogleMapTestPage'),
  { ssr: false }
)

export default function MapTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="mb-6">
          <Link href="/" className="text-primary-600 hover:text-primary-800 hover:underline">
            ← Вернуться на главную
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Проверка настройки Google Maps API</h1>
            <p className="text-gray-600 mt-2">
              Эта страница позволяет проверить корректность настройки Google Maps API для платформы CompetitionWeb.
            </p>
          </div>
          
          <GoogleMapTestPage />
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Подробные инструкции по настройке API можно найти в файле README.md проекта.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 