'use client';

import React, { FC, useState, useEffect } from 'react';
import Map, { Marker, NavigationControl, ViewState } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

// Fix Mapbox worker inside Next.js
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import mapboxgl from 'mapbox-gl';
mapboxgl.workerClass = MapboxWorker;

interface MiniMapProps {
  selectable?: boolean;
  onSelect?: (lat: string, lon: string) => void;
  marker: {
    latitude?: string;
    longitude?: string;
  };
  scrollZoom?: boolean;
}

const MiniMap: FC<MiniMapProps> = ({
  selectable = false,
  onSelect,
  marker,
  scrollZoom = false,
}) => {
  const latInitial = parseFloat(marker.latitude ?? '28.0') || 28.0;
  const lonInitial = parseFloat(marker.longitude ?? '2.0') || 2.0;

  const [viewport, setViewport] = useState<ViewState>({
    latitude: latInitial,
    longitude: lonInitial,
    zoom: 1,
  });

  // Fixed width + height defined visually instead of viewport object
  const width = 384;
  const height = 300;

  const parseLatitude = (value: string) => {
    const lat = parseFloat(value);
    return !Number.isNaN(lat) && lat >= -90 && lat <= 90 ? lat : 28.0;
  };

  const parseLongitude = (value: string) => {
    const lon = parseFloat(value);
    return !Number.isNaN(lon) && lon >= -180 && lon <= 180 ? lon : 2.0;
  };

  return (
    <div
      className="m-auto border border-solid rounded"
      style={{ width, height }}
    >
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        scrollZoom={scrollZoom}
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        onClick={(e) => {
          if (selectable && onSelect) {
            try {
              const lat = e.lngLat.lat.toFixed(6);
              const lon = e.lngLat.lng.toFixed(6);
              onSelect(lat, lon);
            } catch (err) {}
          }
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl showCompass={false} />

        {marker?.latitude && marker?.longitude && (
          <Marker
            latitude={parseLatitude(marker.latitude)}
            longitude={parseLongitude(marker.longitude)}
          >
            <MapPin
              size={32}
              className="text-yellow-500"
            />
          </Marker>
        )}
      </Map>
    </div>
  );
};

export default MiniMap;
