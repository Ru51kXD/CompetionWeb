'use client'

import React from 'react'
import { GoogleMap } from '@react-google-maps/api'
import { useMapsLoaded } from './MapsProvider'

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
}

export default function GoogleMapTestPage() {
  const mapsState = useMapsLoaded()
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Тест подключения Google Maps API</h2>
      
      {!mapsState.loaded && !mapsState.error && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-4">
          <p className="text-blue-700">Загрузка Google Maps API...</p>
        </div>
      )}
      
      {mapsState.error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-4">
          <p className="font-semibold text-red-700">Ошибка загрузки Google Maps API:</p>
          <p className="text-sm text-red-600 mt-1">{mapsState.error}</p>
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-sm font-medium mb-2">Чтобы исправить эту ошибку:</p>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>Получите действительный API ключ Google Maps на <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
              <li>Создайте файл <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> в корневой директории проекта</li>
              <li>Добавьте в файл строку: <code className="bg-gray-100 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=ваш_ключ_api</code></li>
              <li>Перезапустите сервер разработки</li>
            </ol>
          </div>
        </div>
      )}
      
      {mapsState.loaded && !mapsState.error && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded-md">
            <p className="text-green-700">Google Maps API успешно загружен!</p>
          </div>
          
          <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat: 55.7522, lng: 37.6156 }} // Москва
              zoom={10}
              options={{
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: false
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
} 