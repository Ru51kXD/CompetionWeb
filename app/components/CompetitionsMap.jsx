'use client';

import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaTrophy, FaInfoCircle } from 'react-icons/fa';

// Установите свой API ключ Mapbox (в реальном приложении храните его в .env)
mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xyLTM3ZTltLWx2ZWQiOiJleGFtcGxlLXRva2VuLTEyMzQ1In0.example';

export default function CompetitionsMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(37.6173); // Москва
  const [lat, setLat] = useState(55.7558);
  const [zoom, setZoom] = useState(10);
  const [competitionLocations, setCompetitionLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    // Имитация загрузки данных о местах проведения соревнований
    const mockData = [
      {
        id: 1,
        name: 'Чемпионат по программированию 2023',
        location: {
          name: 'Цифровой деловой центр',
          address: 'ул. Пушкина, 10, Москва',
          coordinates: [37.6173, 55.7558]
        },
        date: '2023-11-15',
        participants: 42,
        status: 'completed',
        type: 'Программирование',
        description: 'Соревнование для профессиональных разработчиков с опытом работы от 2-х лет.'
      },
      {
        id: 2,
        name: 'Хакатон Web Development',
        location: {
          name: 'Технопарк "Инновация"',
          address: 'Ленинградский пр., 80, Москва',
          coordinates: [37.5373, 55.8048]
        },
        date: '2023-12-20',
        participants: 36,
        status: 'upcoming',
        type: 'Web-разработка',
        description: 'Двухдневный хакатон для веб-разработчиков с призовым фондом 500 000 рублей.'
      },
      {
        id: 3,
        name: 'AI Challenge Spring 2024',
        location: {
          name: 'Бизнес-центр "Горизонт"',
          address: 'ул. Тверская, 22, Москва',
          coordinates: [37.6014, 55.7648]
        },
        date: '2024-03-10',
        participants: 28,
        status: 'upcoming',
        type: 'Искусственный интеллект',
        description: 'Соревнование по созданию решений на базе искусственного интеллекта.'
      },
      {
        id: 4,
        name: 'Киберспортивный турнир',
        location: {
          name: 'Центр киберспорта "Арена"',
          address: 'ул. Новый Арбат, 15, Москва',
          coordinates: [37.5914, 55.7528]
        },
        date: '2024-01-15',
        participants: 64,
        status: 'registration',
        type: 'Киберспорт',
        description: 'Турнир по Dota 2, CS:GO и League of Legends с международным участием.'
      }
    ];

    setCompetitionLocations(mockData);
  }, []);

  useEffect(() => {
    if (map.current) return; // Инициализировать карту только один раз
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    // Добавляем элементы управления
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }), 'top-right');

    // Отслеживаем движение карты
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    return () => {
      // Очистка при размонтировании
      if (map.current) {
        map.current.remove();
      }
    };
  }, [lng, lat, zoom]);

  // Добавляем маркеры на карту
  useEffect(() => {
    if (!map.current || competitionLocations.length === 0) return;

    // Создаем маркеры для каждого местоположения
    const markers = [];
    const bounds = new mapboxgl.LngLatBounds();

    competitionLocations.forEach(competition => {
      // Создаем HTML элемент для маркера
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.innerHTML = `
        <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </div>
      `;

      // Создаем и добавляем маркер
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(competition.location.coordinates)
        .addTo(map.current);

      // Добавляем обработчик клика
      markerElement.addEventListener('click', () => {
        setSelectedLocation(competition);
        
        // Если уже есть открытый popup, удаляем его
        if (popupRef.current) {
          popupRef.current.remove();
        }

        // Создаем новый popup
        const popupNode = document.createElement('div');
        
        // Центрируем карту на маркере
        map.current.flyTo({
          center: competition.location.coordinates,
          zoom: 14,
          essential: true
        });
        
        // Добавляем попап через React Portal для поддержки интерактивных элементов
        popupRef.current = new mapboxgl.Popup({ closeButton: true, maxWidth: '300px' })
          .setLngLat(competition.location.coordinates)
          .setDOMContent(popupNode)
          .addTo(map.current);
        
        // Рендерим HTML содержимое попапа
        popupNode.innerHTML = `
          <div class="p-2">
            <h3 class="font-bold text-lg mb-2">${competition.name}</h3>
            <p class="text-sm mb-2 flex items-center">
              <span class="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
              </span>
              ${competition.location.name}
            </p>
            <p class="text-sm mb-2 text-gray-600">${competition.location.address}</p>
            
            <div class="flex items-center mb-2">
              <span class="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
              </span>
              <span class="text-sm">${new Date(competition.date).toLocaleDateString()}</span>
            </div>
            
            <div class="flex items-center mb-2">
              <span class="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </span>
              <span class="text-sm">Участников: ${competition.participants}</span>
            </div>
            
            <div class="flex items-center mb-3">
              <span class="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </span>
              <span class="text-sm">${competition.type}</span>
            </div>
            
            <p class="text-sm text-gray-700 mb-4">${competition.description}</p>
            
            <div>
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                ${competition.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                competition.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                competition.status === 'registration' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'}">
                ${competition.status === 'completed' ? 'Завершено' : 
                competition.status === 'upcoming' ? 'Скоро' :
                competition.status === 'registration' ? 'Регистрация открыта' : 'Готовится'}
              </span>
            </div>
            
            <div class="mt-3">
              <button class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded text-sm transition">
                Подробнее
              </button>
            </div>
          </div>
        `;
      });

      markers.push(marker);
      bounds.extend(competition.location.coordinates);
    });

    // Делаем так, чтобы все маркеры были видны
    if (competitionLocations.length > 1) {
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15
      });
    }

    return () => {
      // Удаляем маркеры при изменении данных
      markers.forEach(marker => marker.remove());
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, [competitionLocations]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <FaMapMarkerAlt className="mr-2 text-primary-600" />
          Карта мероприятий
        </h2>
        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
          {lng}, {lat}
        </div>
      </div>
      
      {/* Контейнер для карты */}
      <div className="relative">
        <div ref={mapContainer} className="w-full h-[500px]" />
        
        {/* Список мест справа от карты на больших экранах */}
        <div className="absolute top-0 right-0 w-80 h-full overflow-y-auto bg-white dark:bg-gray-800 shadow-lg transform transition-transform translate-x-full lg:translate-x-0">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
              Мероприятия
            </h3>
            
            <div className="space-y-4">
              {competitionLocations.map(competition => (
                <div 
                  key={competition.id}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border ${
                    selectedLocation?.id === competition.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => {
                    setSelectedLocation(competition);
                    map.current.flyTo({
                      center: competition.location.coordinates,
                      zoom: 14,
                      essential: true
                    });
                  }}
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{competition.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-1 text-xs" />
                    {competition.location.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <FaCalendarAlt className="mr-1 text-xs" />
                    {new Date(competition.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <FaUsers className="mr-1 text-xs" />
                    Участников: {competition.participants}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <FaTrophy className="mr-1 text-xs" />
                    {competition.type}
                  </p>
                  <div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${competition.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : 
                      competition.status === 'upcoming' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' :
                      competition.status === 'registration' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'}`}>
                      {competition.status === 'completed' ? 'Завершено' : 
                      competition.status === 'upcoming' ? 'Скоро' :
                      competition.status === 'registration' ? 'Регистрация' : 'Готовится'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Кнопка переключения списка мест на мобильных устройствах */}
        <button 
          className="absolute top-4 right-4 lg:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-md z-10"
          onClick={() => {
            const sidebar = document.querySelector('.map-sidebar');
            sidebar?.classList.toggle('translate-x-full');
            sidebar?.classList.toggle('translate-x-0');
          }}
        >
          <FaInfoCircle className="text-primary-600" />
        </button>
      </div>
    </div>
  );
} 