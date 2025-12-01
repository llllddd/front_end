'use client';

import React, { FC, useState, useCallback } from 'react';
import Map, { Marker, NavigationControl, MapLayerMouseEvent } from 'react-map-gl';
import { MapPin } from 'lucide-react';

interface MarkerType {
  latitude: string | number;
  longitude: string | number;
}

interface MiniMapProps {
  selectable?: boolean;
  onSelect: (lat: string, lon: string) => void;
  marker: MarkerType;
  scrollZoom?: boolean;
}

/**
 * Validate latitude
 */
const parseLat = (value: any): number => {
  const n = parseFloat(value);
  return !isNaN(n) && n >= -90 && n <= 90 ? n : 28.0;
};

/**
 * Validate longitude
 */
const parseLon = (value: any): number => {
  const n = parseFloat(value);
  return !isNaN(n) && n >= -180 && n <= 180 ? n : 2.0;
};

const MiniMap: FC<MiniMapProps> = ({
  selectable = false,
  onSelect,
  marker,
  scrollZoom = true,
}) => {
  const [viewport, setViewport] = useState({
    latitude: parseLat(marker.latitude),
    longitude: parseLon(marker.longitude),
    zoom: 1,
  });

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      if (!selectable) return;

      try {
        const lat = e.lngLat.lat.toFixed(6);
        const lon = e.lngLat.lng.toFixed(6);
        onSelect(lat, lon);
      } catch {}
    },
    [selectable, onSelect]
  );

  return (
    <div className="m-auto border rounded overflow-hidden" style={{ width: 384, height: 300 }}>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        scrollZoom={scrollZoom}
        style={{ width: '100%', height: '100%' }}
        onMove={(e) => setViewport(e.viewState)}
        onClick={handleClick}
      >
        <NavigationControl showCompass={false} position="bottom-right" />

        <Marker
          latitude={parseLat(marker.latitude)}
          longitude={parseLon(marker.longitude)}
          anchor="bottom"
        >
          <MapPin className="text-yellow-500" size={28} />
        </Marker>
      </Map>
    </div>
  );
};

export default MiniMap;
