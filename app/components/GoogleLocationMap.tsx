'use client'

import React, { useState } from 'react'
import { GoogleMap, InfoWindow } from '@react-google-maps/api'
import { useMapsLoaded } from './MapsProvider'

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
}

interface GoogleLocationMapProps {
  address: string
  coordinates: [number, number]
  title: string
  popupInfo?: boolean
}

const GoogleLocationMap: React.FC<GoogleLocationMapProps> = ({
  address,
  coordinates,
  title,
  popupInfo = true
}) => {
  const [showInfoWindow, setShowInfoWindow] = useState(false)
  const mapsState = useMapsLoaded()
  
  const position = {
    lat: coordinates[1],
    lng: coordinates[0]
  }

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
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={position}
      zoom={13}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        scrollwheel: false,
        fullscreenControl: false,
        streetViewControl: false
      }}
    >
      {window.google && (
        <div>
          {/* Using the Advanced Marker Element with a div element to avoid deprecation */}
          <div
            className="custom-marker"
            style={{
              position: 'absolute',
              transform: 'translate(-50%, -100%)',
              cursor: 'pointer',
              zIndex: 1,
              left: '0px',
              top: '0px'
            }}
            onClick={() => setShowInfoWindow(true)}
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
        </div>
      )}
      
      {popupInfo && showInfoWindow && (
        <InfoWindow
          position={position}
          onCloseClick={() => setShowInfoWindow(false)}
        >
          <div className="p-2 min-w-[150px]">
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-gray-600 mt-1">{address}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

export default GoogleLocationMap 