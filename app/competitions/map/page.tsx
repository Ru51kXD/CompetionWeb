'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { GoogleMap, InfoWindow } from '@react-google-maps/api'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft, FaSearch, FaFilter } from 'react-icons/fa'
import { useMapsLoaded } from '../../components/MapsProvider'

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '8px',
}

export default function CompetitionsMapPage() {
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [popupInfo, setPopupInfo] = useState(null)
  const [viewport, setViewport] = useState({
    latitude: 55.7522,
    longitude: 37.6156, // Москва по умолчанию
    zoom: 5
  })
  const [filter, setFilter] = useState({
    type: '',
    city: '',
    date: ''
  })
  const [cities, setCities] = useState([])
  const [types, setTypes] = useState([])
  const mapsState = useMapsLoaded()

  // Fetch competitions only once on component mount
  useEffect(() => {
    const fetchCompetitions = async () => {
      setLoading(true)
      try {
        // Получаем соревнования из localStorage или API
        const storedCompetitions = localStorage.getItem('competitions')
        
        if (storedCompetitions) {
          const allCompetitions = JSON.parse(storedCompetitions)
          // Фильтруем соревнования только с координатами
          const competitionsWithLocation = allCompetitions.filter(
            comp => comp.coordinates && comp.coordinates.length === 2
          )
          setCompetitions(competitionsWithLocation)
          
          // Собираем уникальные города и типы
          const uniqueCities = [...new Set(competitionsWithLocation.map(comp => comp.city).filter(Boolean))]
          const uniqueTypes = [...new Set(competitionsWithLocation.map(comp => comp.type).filter(Boolean))]
          
          setCities(uniqueCities)
          setTypes(uniqueTypes)
        }
      } catch (err) {
        console.error('Ошибка при загрузке соревнований:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCompetitions()
  }, [])

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target
    setFilter(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  // Use useMemo for filtered competitions to avoid recomputing on every render
  const filteredCompetitions = useMemo(() => {
    return competitions.filter(comp => {
      return (
        (!filter.type || comp.type === filter.type) &&
        (!filter.city || comp.city === filter.city) &&
        (!filter.date || new Date(comp.startDate) >= new Date(filter.date))
      )
    })
  }, [competitions, filter.type, filter.city, filter.date])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
  
  // Options for the map to optimize rendering
  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    gestureHandling: 'cooperative'
  }), [])

  // Render a custom marker component that doesn't use the deprecated Marker
  const renderMarkers = () => {
    if (!window.google) return null;
    
    return filteredCompetitions.map(competition => {
      if (!competition.coordinates || competition.coordinates.length !== 2) {
        return null;
      }
      
      const position = {
        lat: competition.coordinates[1],
        lng: competition.coordinates[0]
      };
      
      return (
        <div
          key={competition.id}
          className="custom-marker"
          style={{
            position: 'absolute',
            left: '0px',
            top: '0px',
            transform: 'translate(-50%, -100%)',
            cursor: 'pointer',
            zIndex: 1
          }}
          onClick={() => setPopupInfo(competition)}
        >
          <div
            style={{
              backgroundColor: '#e53e3e',
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
            }}
          >
            <div
              style={{
                transform: 'rotate(45deg)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/competitions" className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <FaArrowLeft className="mr-2" /> Вернуться к списку соревнований
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold">Карта соревнований</h1>
              <p className="text-gray-600 mt-2">Все соревнования на интерактивной карте</p>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaFilter className="inline mr-1" /> Тип соревнования
                  </label>
                  <select
                    name="type"
                    value={filter.type}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Все типы</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaMapMarkerAlt className="inline mr-1" /> Город
                  </label>
                  <select
                    name="city"
                    value={filter.city}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Все города</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaCalendarAlt className="inline mr-1" /> Дата (с)
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={filter.date}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div style={{ height: '500px', borderRadius: '8px', overflow: 'hidden' }}>
                {!mapsState.loaded ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">Загрузка карты...</p>
                  </div>
                ) : mapsState.error ? (
                  <div className="w-full h-full bg-red-50 flex items-center justify-center p-4">
                    <div className="text-center">
                      <p className="text-red-600 font-semibold mb-2">Ошибка загрузки карты:</p>
                      <p className="text-sm text-red-500">{mapsState.error}</p>
                      <p className="text-sm mt-4">
                        Для корректной работы карты необходимо добавить правильный API ключ Google Maps в 
                        файл .env.local (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
                      </p>
                    </div>
                  </div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{ lat: viewport.latitude, lng: viewport.longitude }}
                    zoom={viewport.zoom}
                    options={mapOptions}
                  >
                    {window.google && renderMarkers()}
                    
                    {popupInfo && popupInfo.coordinates && (
                      <InfoWindow
                        position={{ 
                          lat: popupInfo.coordinates[1], 
                          lng: popupInfo.coordinates[0] 
                        }}
                        onCloseClick={() => setPopupInfo(null)}
                        options={{ pixelOffset: new google.maps.Size(0, -36) }}
                      >
                        <div className="p-2 max-w-xs">
                          <h3 className="font-semibold">{popupInfo.title}</h3>
                          <p className="text-xs text-gray-600 mb-1">{popupInfo.location}</p>
                          <p className="text-xs text-gray-600 mb-2">
                            <FaCalendarAlt className="inline mr-1" />
                            {formatDate(popupInfo.startDate)}
                          </p>
                          <Link
                            href={`/competitions/${popupInfo.id}`}
                            className="text-primary-600 text-sm hover:underline"
                          >
                            Подробнее
                          </Link>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                )}
              </div>
              
              <div className="mt-6">
                <p className="text-gray-600 text-sm">
                  {filteredCompetitions.length === 0
                    ? 'Нет соревнований, удовлетворяющих выбранным критериям'
                    : `Отображено соревнований: ${filteredCompetitions.length}`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 