"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  properties: Array<{
    id: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    title: string;
    price: string;
    type: string;
    isNew?: boolean;
  }>;
  onMarkerClick?: (propertyId: string) => void;
  onBoundsChanged?: (bounds: MapBounds) => void;
  onMapLoad?: (map: any) => void;
}

// Dynamic import of the actual map component to prevent SSR issues
const LeafletMap = dynamic(
  () => import("./LeafletMapComponent"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <div className="text-gray-500">Loading map...</div>
        </div>
      </div>
    )
  }
);

const Map = (props: MapProps) => {
  const [isClient, setIsClient] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMapError = useCallback(() => {
    // Map error occurred, attempting recovery
    setMapKey(prev => prev + 1);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Initializing map...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <LeafletMap 
        key={mapKey}
        {...props}
        onError={handleMapError}
      />
    </div>
  );
};

export default Map;
