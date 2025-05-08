'use client'

import React, { createContext, useContext, ReactNode, useState } from 'react'
import { LoadScript } from '@react-google-maps/api'

// Google Maps API Key - you need to replace this with a valid API key
// Get an API key at: https://developers.google.com/maps/documentation/javascript/get-api-key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

// Libraries to load
const libraries = ['places']

// Context to track if Maps API is loaded
const MapsLoadedContext = createContext<{loaded: boolean; error: string | null}>({
  loaded: false,
  error: null
})

// Hook to use the context
export const useMapsLoaded = () => useContext(MapsLoadedContext)

// Provider component
export function MapsProvider({ children }: { children: ReactNode }) {
  const [loadState, setLoadState] = useState({
    loaded: false,
    error: null as string | null
  });

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={libraries as any}
      loadingElement={<div className="h-full w-full flex items-center justify-center">Загрузка карты...</div>}
      onLoad={() => setLoadState({ loaded: true, error: null })}
      onError={(error) => setLoadState({ loaded: false, error: error.message })}
    >
      <MapsLoadedContext.Provider value={loadState}>
        {loadState.error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            <p className="font-semibold">Ошибка загрузки карты:</p>
            <p className="text-sm">{loadState.error}</p>
            <p className="text-sm mt-2">
              Проверьте API ключ Google Maps в файле .env.local (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
            </p>
          </div>
        ) : (
          children
        )}
      </MapsLoadedContext.Provider>
    </LoadScript>
  )
} 