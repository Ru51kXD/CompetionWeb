'use client'

import React, { useState, useEffect } from 'react'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

// Custom hook to load external script
const useScript = (src: string) => {
  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) return;
    
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [src]);
};

// Замените на свой токен Mapbox
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby1tYXBib3giLCJhIjoiY2p1cXd1YzhjMDEwcDN5a2s2N2RpYnJkNyJ9.Ri-iLOPXlFq7keFsO-KsTQ'

interface LocationPickerProps {
  initialAddress?: string
  initialCoordinates?: [number, number]
  onLocationChange: (location: {
    address: string
    coordinates: [number, number]
    city: string
    country: string
  }) => void
}

export default function LocationPicker({
  initialAddress = '',
  initialCoordinates = [37.6156, 55.7522], // Москва по умолчанию
  onLocationChange
}: LocationPickerProps) {
  // Load Mapbox GL JS script if needed
  useScript('https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.js');
  
  const [viewport, setViewport] = useState({
    longitude: initialCoordinates[0],
    latitude: initialCoordinates[1],
    zoom: 12
  })
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(initialCoordinates)
  const [address, setAddress] = useState(initialAddress)
  const [geocoder, setGeocoder] = useState<any>(null)

  useEffect(() => {
    if (!geocoder) {
      // Check if mapboxgl is available
      if (!(window as any).mapboxgl) {
        console.error('Mapbox GL JS is not available. Make sure to include the script in your HTML.');
        return;
      }
      
      const newGeocoder = new MapboxGeocoder({
        accessToken: MAPBOX_TOKEN,
        types: 'address,poi',
        language: 'ru',
        placeholder: 'Введите адрес соревнования',
        mapboxgl: (window as any).mapboxgl,
      })

      newGeocoder.on('result', (e: any) => {
        const coords = e.result.geometry.coordinates
        const newLocation = [coords[0], coords[1]] as [number, number]
        
        setMarkerPosition(newLocation)
        setViewport({
          ...viewport,
          longitude: newLocation[0],
          latitude: newLocation[1]
        })
        
        const place = e.result
        setAddress(place.place_name)
        
        // Извлекаем информацию о городе и стране
        let city = ''
        let country = ''
        
        if (place.context) {
          for (const context of place.context) {
            if (context.id.startsWith('place')) {
              city = context.text
            }
            if (context.id.startsWith('country')) {
              country = context.text
            }
          }
        }
        
        onLocationChange({
          address: place.place_name,
          coordinates: newLocation,
          city,
          country
        })
      })
      
      setGeocoder(newGeocoder)
      
      return () => {
        // Safe cleanup - check if the geocoder was actually added to DOM
        try {
          if (newGeocoder._container && newGeocoder._container.parentNode) {
            newGeocoder.onRemove()
          }
        } catch (error) {
          console.log('Error removing geocoder:', error)
        }
      }
    }
  }, [geocoder, onLocationChange, viewport])

  useEffect(() => {
    if (geocoder) {
      const geocoderContainer = document.getElementById('geocoder-container')
      if (geocoderContainer && !geocoderContainer.hasChildNodes()) {
        try {
          geocoderContainer.appendChild(geocoder.onAdd())
        } catch (error) {
          console.log('Error adding geocoder to container:', error)
        }
      }
    }
  }, [geocoder])

  const handleMapClick = (event: any) => {
    const newCoords: [number, number] = [
      event.lngLat.lng,
      event.lngLat.lat
    ]
    
    setMarkerPosition(newCoords)
    
    // Обратный геокодинг - получение адреса по координатам
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${newCoords[0]},${newCoords[1]}.json?access_token=${MAPBOX_TOKEN}&language=ru`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const place = data.features[0]
          setAddress(place.place_name)
          
          // Извлекаем информацию о городе и стране
          let city = ''
          let country = ''
          
          if (place.context) {
            for (const context of place.context) {
              if (context.id.startsWith('place')) {
                city = context.text
              }
              if (context.id.startsWith('country')) {
                country = context.text
              }
            }
          }
          
          onLocationChange({
            address: place.place_name,
            coordinates: newCoords,
            city,
            country
          })
        }
      })
  }

  return (
    <div className="location-picker">
      <div id="geocoder-container" className="mb-3"></div>
      
      <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={viewport}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onClick={handleMapClick}
          style={{ width: '100%', height: '100%' }}
        >
          <Marker
            longitude={markerPosition[0]}
            latitude={markerPosition[1]}
            anchor="bottom"
            draggable
            onDragEnd={(event) => {
              handleMapClick(event)
            }}
          />
        </Map>
      </div>
      
      {address && (
        <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-700">
            <strong>Выбранный адрес:</strong> {address}
          </p>
        </div>
      )}
    </div>
  )
} 