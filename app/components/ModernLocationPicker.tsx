'use client'

import React, { useEffect, useRef } from 'react'
import Script from 'next/script'

interface ModernLocationPickerProps {
  onLocationChange: (location: {
    address: string
    coordinates: [number, number]
    city: string
    country: string
  }) => void
  apiKey?: string
}

const ModernLocationPicker: React.FC<ModernLocationPickerProps> = ({ 
  onLocationChange,
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
}) => {
  const mapRef = useRef<HTMLElement | null>(null)
  const markerRef = useRef<HTMLElement | null>(null)
  const placePickerRef = useRef<HTMLElement | null>(null)
  const scriptLoaded = useRef(false)

  useEffect(() => {
    // Инициализация карты после загрузки компонентов
    const init = async () => {
      // Проверяем, есть ли API ключ
      if (!apiKey) {
        console.error('Google Maps API key is not provided');
        return;
      }

      // Дожидаемся определения кастомных элементов
      if (window.customElements && !scriptLoaded.current) {
        try {
          await window.customElements.whenDefined('gmp-map');
          await window.customElements.whenDefined('gmp-advanced-marker');
          await window.customElements.whenDefined('gmpx-place-picker');
          
          scriptLoaded.current = true;
          
          // Получаем ссылки на элементы
          const map = mapRef.current;
          const marker = markerRef.current;
          const placePicker = placePickerRef.current;
          
          if (map && marker && placePicker && window.google) {
            // Доступ к внутренней карте
            // @ts-ignore - innerMap существует, но TypeScript не знает об этом
            const innerMap = map.innerMap;
            
            if (innerMap) {
              // Настройка карты
              innerMap.setOptions({
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
                zoomControl: true,
              });
              
              // Создаем infowindow
              const infowindow = new window.google.maps.InfoWindow();
              
              // Слушаем изменения места
              placePicker.addEventListener('gmpx-placechange', () => {
                // @ts-ignore - value существует, но TypeScript не знает об этом
                const place = placePicker.value;
                
                if (!place.location) {
                  console.error("Не удалось получить координаты для:", place.name);
                  infowindow.close();
                  // @ts-ignore - position существует
                  marker.position = null;
                  return;
                }
                
                if (place.viewport) {
                  innerMap.fitBounds(place.viewport);
                } else {
                  // @ts-ignore - center и zoom существуют
                  map.center = place.location;
                  map.zoom = 17;
                }
                
                // @ts-ignore - position существует
                marker.position = place.location;
                
                infowindow.setContent(`
                  <strong>${place.displayName || ''}</strong><br>
                  <span>${place.formattedAddress || ''}</span>
                `);
                
                infowindow.open(innerMap, marker);
                
                // Извлекаем город и страну
                let city = '';
                let country = '';
                
                // Ищем город и страну в адресных компонентах, если они доступны
                if (place.addressComponents) {
                  place.addressComponents.forEach((component: any) => {
                    if (component.types.includes('locality')) {
                      city = component.longText;
                    }
                    if (component.types.includes('country')) {
                      country = component.longText;
                    }
                  });
                }
                
                // Вызываем функцию обратного вызова с данными о местоположении
                onLocationChange({
                  address: place.formattedAddress || place.displayName || '',
                  coordinates: [place.location.lng, place.location.lat],
                  city,
                  country
                });
              });
              
              // Обработка клика по карте
              innerMap.addListener('click', (e: any) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                
                // @ts-ignore - position существует
                marker.position = { lat, lng };
                
                // Обратное геокодирование для получения адреса
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
                  if (status === 'OK' && results && results[0]) {
                    const place = results[0];
                    
                    infowindow.setContent(`
                      <strong>${place.formatted_address}</strong><br>
                    `);
                    
                    infowindow.open(innerMap, marker);
                    
                    // Извлекаем город и страну
                    let city = '';
                    let country = '';
                    
                    place.address_components.forEach((component: any) => {
                      if (component.types.includes('locality')) {
                        city = component.long_name;
                      }
                      if (component.types.includes('country')) {
                        country = component.long_name;
                      }
                    });
                    
                    // Вызываем функцию обратного вызова с данными о местоположении
                    onLocationChange({
                      address: place.formatted_address,
                      coordinates: [lng, lat],
                      city,
                      country
                    });
                  }
                });
              });
            }
          }
        } catch (error) {
          console.error('Ошибка инициализации карты:', error);
        }
      }
    };
    
    // Запускаем инициализацию после монтирования компонента
    if (document.readyState === 'complete') {
      init();
    } else {
      window.addEventListener('load', init);
      return () => window.removeEventListener('load', init);
    }
  }, [onLocationChange, apiKey]);

  if (!apiKey) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <p className="font-semibold">Ошибка настройки Google Maps:</p>
        <p className="text-sm mt-1">API ключ не указан.</p>
        <p className="text-sm mt-2">
          Создайте файл .env.local в корне проекта и добавьте:
          <br />
          <code className="bg-red-100 px-2 py-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=ваш_ключ_api</code>
        </p>
      </div>
    );
  }

  return (
    <div className="location-picker">
      <Script 
        strategy="beforeInteractive"
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=Function.prototype`}
      />
      <Script 
        strategy="afterInteractive"
        type="module" 
        src="https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js"
      />
      
      <div className="w-full rounded-lg overflow-hidden" style={{ height: '400px', position: 'relative' }}>
        <gmpx-api-loader
          apiKey={apiKey}
          solution-channel="GMP_GE_mapsandplacesautocomplete_v2"
        ></gmpx-api-loader>
        
        <gmp-map
          ref={mapRef}
          center="55.7522,37.6156" // Москва
          zoom="12"
          map-id="DEMO_MAP_ID"
          className="w-full h-full"
        >
          <div slot="control-block-start-inline-start" className="p-4">
            <gmpx-place-picker
              ref={placePickerRef} 
              placeholder="Введите адрес соревнования"
              className="w-full bg-white shadow-md rounded-md p-2"
            ></gmpx-place-picker>
          </div>
          
          <gmp-advanced-marker
            ref={markerRef}
          ></gmp-advanced-marker>
        </gmp-map>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        После выбора местоположения, можно также кликнуть на карту для уточнения позиции
      </div>
    </div>
  )
}

export default ModernLocationPicker 