'use client'

import React, { useState, useCallback, useRef, memo, useEffect } from 'react'
import { GoogleMap, StandaloneSearchBox, OverlayView } from '@react-google-maps/api'
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa'
import { useMapsLoaded } from './MapsProvider'

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
}

const libraries = ['places']

interface GoogleLocationPickerProps {
  initialAddress?: string
  initialCoordinates?: [number, number]
  onLocationChange: (location: {
    address: string
    coordinates: [number, number]
    city: string
    country: string
  }) => void
}

const GoogleLocationPicker: React.FC<GoogleLocationPickerProps> = memo(({
  initialAddress = '',
  initialCoordinates = [37.6156, 55.7522], // Москва по умолчанию
  onLocationChange
}) => {
  const [markerPosition, setMarkerPosition] = useState({
    lat: initialCoordinates[1],
    lng: initialCoordinates[0]
  })
  const [address, setAddress] = useState(initialAddress)
  const [inputValue, setInputValue] = useState(initialAddress)
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null)
  const mapsState = useMapsLoaded()
  const mapRef = useRef<google.maps.Map | null>(null)
  const initialLocationSent = useRef(false)

  // Сразу после монтирования компонента вызовем onLocationChange с начальными значениями
  useEffect(() => {
    // Выполняем только один раз при монтировании компонента
    if (!initialLocationSent.current) {
      initialLocationSent.current = true;
      
      // Вызываем onLocationChange с начальными данными только если есть адрес
      if (initialAddress) {
        onLocationChange({
          address: initialAddress,
          coordinates: initialCoordinates,
          city: '',  // Заполните эти поля, если у вас есть начальные данные
          country: ''
        });
        return; // Раннее завершение если уже есть адрес
      }
      
      // Если есть начальные координаты, сделаем обратное геокодирование чтобы получить адрес
      if (initialCoordinates[0] !== 0 && initialCoordinates[1] !== 0 && !initialAddress && window.google) {
        try {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ 
            location: { lat: initialCoordinates[1], lng: initialCoordinates[0] } 
          }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const formattedAddress = results[0].formatted_address;
              setAddress(formattedAddress);
              setInputValue(formattedAddress);
              
              // Extract city and country
              let city = '';
              let country = '';
              
              results[0].address_components.forEach(component => {
                if (component.types.includes('locality')) {
                  city = component.long_name;
                }
                if (component.types.includes('country')) {
                  country = component.long_name;
                }
              });
              
              onLocationChange({
                address: formattedAddress,
                coordinates: initialCoordinates,
                city,
                country
              });
            }
          });
        } catch (error) {
          console.error("Ошибка при геокодировании:", error);
        }
      }
    }
  }, [mapsState.loaded]); // Зависим только от загрузки карты, а не от props

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      
      setMarkerPosition({ lat, lng })
      
      // Get address from coordinates (reverse geocoding)
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const formattedAddress = results[0].formatted_address
          setAddress(formattedAddress)
          setInputValue(formattedAddress)
          
          // Extract city and country
          let city = ''
          let country = ''
          
          results[0].address_components.forEach(component => {
            if (component.types.includes('locality')) {
              city = component.long_name
            }
            if (component.types.includes('country')) {
              country = component.long_name
            }
          })
          
          onLocationChange({
            address: formattedAddress,
            coordinates: [lng, lat],
            city,
            country
          })
        }
      })
    }
  }, [onLocationChange])

  const handlePlacesChanged = useCallback(() => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces()
      
      if (places && places.length > 0) {
        const place = places[0]
        
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          
          setMarkerPosition({ lat, lng })
          setAddress(place.formatted_address || '')
          setInputValue(place.formatted_address || '')
          
          // Center map on the selected location
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng })
            mapRef.current.setZoom(14)
          }
          
          // Extract city and country
          let city = ''
          let country = ''
          
          if (place.address_components) {
            place.address_components.forEach(component => {
              if (component.types.includes('locality')) {
                city = component.long_name
              }
              if (component.types.includes('country')) {
                country = component.long_name
              }
            })
          }
          
          onLocationChange({
            address: place.formatted_address || '',
            coordinates: [lng, lat],
            city,
            country
          })
        }
      }
    }
  }, [onLocationChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleMarkerDrag = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      setMarkerPosition({ lat, lng })
      
      // Get address from coordinates (reverse geocoding)
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const formattedAddress = results[0].formatted_address
          setAddress(formattedAddress)
          setInputValue(formattedAddress)
          
          // Extract city and country
          let city = ''
          let country = ''
          
          results[0].address_components.forEach(component => {
            if (component.types.includes('locality')) {
              city = component.long_name
            }
            if (component.types.includes('country')) {
              country = component.long_name
            }
          })
          
          onLocationChange({
            address: formattedAddress,
            coordinates: [lng, lat],
            city,
            country
          })
        }
      })
    }
  }, [onLocationChange])

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  if (!mapsState.loaded) {
    return (
      <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Загрузка карты...</p>
      </div>
    )
  }

  if (mapsState.error) {
    return (
      <div className="w-full h-[300px] bg-red-50 rounded-lg flex items-center justify-center p-4">
        <p className="text-red-600 text-center">Не удалось загрузить карту. Пожалуйста, проверьте API ключ.</p>
      </div>
    )
  }

  return (
    <div className="location-picker">
      <div className="mb-3 relative">
        <StandaloneSearchBox
          onLoad={ref => (searchBoxRef.current = ref)}
          onPlacesChanged={handlePlacesChanged}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Введите адрес соревнования"
              className="w-full py-3 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={inputValue}
              onChange={handleInputChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </StandaloneSearchBox>
      </div>
      
      <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition}
          zoom={12}
          onClick={handleMapClick}
          onLoad={handleMapLoad}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            scrollwheel: false,
            fullscreenControl: false,
            mapTypeControl: true
          }}
        >
          {window.google && (
            <OverlayView
              position={markerPosition}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div 
                className="custom-marker"
                style={{
                  position: 'absolute',
                  transform: 'translate(-50%, -100%)',
                  cursor: 'pointer'
                }}
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
            </OverlayView>
          )}
        </GoogleMap>
      </div>
      
      {address && (
        <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-700">
            <strong>Выбранный адрес:</strong> {address}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Координаты: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  )
})

GoogleLocationPicker.displayName = 'GoogleLocationPicker'

export default GoogleLocationPicker 