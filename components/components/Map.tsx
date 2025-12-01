'use client';

import React, { FC, useState, useEffect } from 'react';
import Map, { Marker, ViewState } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

// Fix for Mapbox workers inside Next.js
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import mapboxgl from 'mapbox-gl';
mapboxgl.workerClass = MapboxWorker;

interface MarkerData {
  id: string | number;
  latitude: string;
  longitude: string;
}

interface MapProps {
  height: number | string;
  markers: MarkerData[];
  onClickMarker: (id: string | number) => void;
}

const WorldMap: FC<MapProps> = ({ height, markers, onClickMarker }) => {
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 28.0000272,
    longitude: 2.9999825,
    zoom: 1,
  });

  // Prevent SSR crash – width calculated on client only
  const [width, setWidth] = useState<number>(600);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth - 15);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div style={{ width: '100%', height }}>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v10"
        scrollZoom={false}
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        style={{ width, height }}
      >
        {markers?.map((marker) => (
          <Marker
            key={marker.id}
            latitude={parseFloat(marker.latitude)}
            longitude={parseFloat(marker.longitude)}
          >
            <MapPin
              size={28}
              className="text-yellow-500 cursor-pointer"
              onClick={() => onClickMarker(marker.id)}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default WorldMap;
