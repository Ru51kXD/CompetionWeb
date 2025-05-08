'use client'

import React, { useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { FaMapMarkerAlt } from 'react-icons/fa'

// Замените на свой токен Mapbox
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby1tYXBib3giLCJhIjoiY2p1cXd1YzhjMDEwcDN5a2s2N2RpYnJkNyJ9.Ri-iLOPXlFq7keFsO-KsTQ'

interface LocationMapProps {
  address: string
  coordinates: [number, number]
  title: string
  popupInfo?: boolean
}

export default function LocationMap({
  address,
  coordinates,
  title,
  popupInfo = true
}: LocationMapProps) {
  const [showPopup, setShowPopup] = useState(false)

  return (
    <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: coordinates[0],
          latitude: coordinates[1],
          zoom: 13
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: '100%', height: '100%' }}
      >
        <Marker
          longitude={coordinates[0]}
          latitude={coordinates[1]}
          anchor="bottom"
          onClick={() => setShowPopup(true)}
        >
          <div className="text-red-600 text-3xl">
            <FaMapMarkerAlt />
          </div>
        </Marker>

        {popupInfo && showPopup && (
          <Popup
            longitude={coordinates[0]}
            latitude={coordinates[1]}
            anchor="bottom"
            onClose={() => setShowPopup(false)}
            closeButton={true}
          >
            <div className="p-2">
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs text-gray-600">{address}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
} 