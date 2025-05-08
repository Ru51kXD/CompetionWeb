'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Динамически загружаем компонент для избежания ошибок SSR
const ModernLocationPicker = dynamic(
  () => import('../components/ModernLocationPicker'),
  { ssr: false }
)

export default function ModernLocationPage() {
  const [locationData, setLocationData] = useState({
    address: '',
    coordinates: [0, 0] as [number, number],
    city: '',
    country: ''
  })
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  const handleLocationChange = (location: {
    address: string
    coordinates: [number, number]
    city: string
    country: string
  }) => {
    setLocationData(location)
    console.log('Выбрано местоположение:', location)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/" className="text-primary-600 hover:text-primary-800 hover:underline">
            ← Вернуться на главную
          </Link>
          
          {!apiKey && (
            <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-md">
              API ключ не настроен
            </span>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Новый компонент выбора местоположения</h1>
            <p className="text-gray-600 mt-2">
              Использует Google Maps Platform с веб-компонентами (Extended Component Library)
            </p>
          </div>
          
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Выберите местоположение:</h2>
            
            {!apiKey ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
                <p className="text-red-700 font-medium">Отсутствует API ключ Google Maps</p>
                <p className="text-sm mt-2">
                  Для корректной работы компонента необходимо:
                </p>
                <ol className="list-decimal list-inside text-sm mt-1 ml-2 space-y-1">
                  <li>Создать файл <code className="bg-red-100 px-1 py-0.5 rounded">.env.local</code> в корне проекта</li>
                  <li>Добавить переменную <code className="bg-red-100 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=ваш_ключ_api</code></li>
                  <li>Перезапустить сервер разработки</li>
                </ol>
              </div>
            ) : (
              <ModernLocationPicker 
                onLocationChange={handleLocationChange} 
                apiKey={apiKey}
              />
            )}
            
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="font-semibold">Данные о выбранном местоположении:</h3>
              <div className="mt-2 grid grid-cols-1 gap-2">
                <div>
                  <span className="font-medium">Адрес:</span> {locationData.address || 'Не выбран'}
                </div>
                <div>
                  <span className="font-medium">Координаты:</span> {locationData.coordinates[1]}, {locationData.coordinates[0]}
                </div>
                <div>
                  <span className="font-medium">Город:</span> {locationData.city || 'Не определен'}
                </div>
                <div>
                  <span className="font-medium">Страна:</span> {locationData.country || 'Не определена'}
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded">
                <h4 className="font-medium text-blue-800">Подтверждение выбора:</h4>
                <div className="mt-2">
                  <button 
                    className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                    onClick={() => {
                      if (locationData.address) {
                        alert(`Местоположение подтверждено:\n${locationData.address}\nКоординаты: ${locationData.coordinates[1]}, ${locationData.coordinates[0]}`)
                      } else {
                        alert('Выберите местоположение на карте или с помощью поиска!')
                      }
                    }}
                  >
                    Подтвердить выбор местоположения
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 