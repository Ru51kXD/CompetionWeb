'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Динамический импорт компонентов карт для избежания ошибок SSR
const GoogleLocationPicker = dynamic(
  () => import('../components/GoogleLocationPicker'),
  { ssr: false }
)

export default function LocationTestPage() {
  const [locationData, setLocationData] = useState({
    address: '',
    coordinates: [0, 0] as [number, number],
    city: '',
    country: ''
  })

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
        <div className="mb-6">
          <Link href="/" className="text-primary-600 hover:text-primary-800 hover:underline">
            ← Вернуться на главную
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Тест выбора местоположения</h1>
            <p className="text-gray-600 mt-2">
              Этот тест позволяет проверить работу компонента выбора местоположения
            </p>
          </div>
          
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Выберите местоположение:</h2>
            
            <GoogleLocationPicker 
              onLocationChange={handleLocationChange}
              initialCoordinates={[37.6156, 55.7522]} // Москва
            />
            
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