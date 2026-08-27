"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from "react-leaflet";
import L from "leaflet";

// Define our location type
export interface LocationData {
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  isMain: boolean;
  coordinates: [number, number];
  mapUrl: string;
}

// Center of Nepal / Default Zoom bounds
const NEPAL_CENTER: [number, number] = [28.3, 84.2];
const DEFAULT_ZOOM = 7;

const hondaIcon = L.divIcon({
  className: "honda-marker",
  html: `<div class="honda-marker-pulse"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Component to handle the map flying animation
function MapAnimator({ selectedLocation }: { selectedLocation: LocationData | null }) {
  const map = useMap();
  const prevLocationRef = React.useRef<LocationData | null>(null);

  useEffect(() => {
    if (!selectedLocation) {
      // Reset view
      map.flyTo(NEPAL_CENTER, DEFAULT_ZOOM, { duration: 1.5 });
      prevLocationRef.current = null;
      return;
    }

    if (prevLocationRef.current && prevLocationRef.current.name !== selectedLocation.name) {
      // Switching between locations: Zoom out to Nepal first
      map.flyTo(NEPAL_CENTER, DEFAULT_ZOOM, { duration: 1.5 });

      // Then zoom into the new location after the zoom out completes
      const timeoutId = setTimeout(() => {
        map.flyTo(selectedLocation.coordinates, 18, {
          duration: 2.0,
        });
      }, 1600);

      prevLocationRef.current = selectedLocation;
      return () => clearTimeout(timeoutId);
    }

    // First time clicking a location (already at Nepal view)
    map.flyTo(selectedLocation.coordinates, 18, {
      duration: 2.5,
      easeLinearity: 0.25,
    });
    
    prevLocationRef.current = selectedLocation;
  }, [selectedLocation, map]);

  return null;
}

interface InteractiveMapProps {
  locations: LocationData[];
  selectedLocation: LocationData | null;
  onSelectLocation: (loc: LocationData) => void;
}

export default function InteractiveMap({ locations, selectedLocation, onSelectLocation }: InteractiveMapProps) {
  const [geoData, setGeoData] = React.useState<any>(null);

  useEffect(() => {
    fetch('/nepal.geo.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Error loading Nepal GeoJSON:", err));
  }, []);

  return (
    <MapContainer
      center={NEPAL_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={true}
      className="w-full h-full rounded-2xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {geoData && (
        <GeoJSON 
          data={geoData} 
          style={{
            color: "#8B0000", // Dark red
            weight: 4,        // Bold
            opacity: 1.0,
            fillColor: "#CC0000",
            fillOpacity: 0.05,
          }}
        />
      )}
      
      {locations.map((loc, idx) => (
        <Marker 
          key={idx} 
          position={loc.coordinates} 
          icon={hondaIcon}
          eventHandlers={{
            click: () => onSelectLocation(loc),
          }}
        >
          <Popup className="honda-popup min-w-[150px]">
            <div className="p-1">
              <h3 className="font-bold text-[#CC0000] text-sm uppercase">{loc.name}</h3>
              <p className="text-xs text-gray-600 mt-1 leading-tight">{loc.address}</p>
              <a 
                href={loc.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block bg-[#CC0000] text-white text-xs font-bold px-3 py-1.5 rounded-md w-full text-center hover:bg-[#A30000] transition-colors"
              >
                Directions
              </a>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapAnimator selectedLocation={selectedLocation} />
    </MapContainer>
  );
}
