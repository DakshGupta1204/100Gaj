"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/map-overrides.css";
// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/location.png",
    iconUrl: "/location.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});
const LeafletMapComponent = ({ center, zoom, properties, onMarkerClick, onBoundsChanged, onMapLoad, onError }) => {
    const mapRef = useRef(null);
    const containerRef = useRef(null);
    const markersRef = useRef([]);
    const [isInitialized, setIsInitialized] = useState(false);
    // Initialize map
    useEffect(() => {
        if (!containerRef.current || isInitialized)
            return;
        try {
            // Clear any existing map
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            // Create new map
            const map = L.map(containerRef.current, {
                center: [center.lat, center.lng],
                zoom: zoom,
                zoomControl: true,
                attributionControl: true,
            });
            // Add tile layer
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);
            // Set up event handlers
            map.on('moveend', () => {
                if (onBoundsChanged) {
                    const bounds = map.getBounds();
                    onBoundsChanged({
                        north: bounds.getNorth(),
                        south: bounds.getSouth(),
                        east: bounds.getEast(),
                        west: bounds.getWest(),
                    });
                }
            });
            map.on('zoomend', () => {
                if (onBoundsChanged) {
                    const bounds = map.getBounds();
                    onBoundsChanged({
                        north: bounds.getNorth(),
                        south: bounds.getSouth(),
                        east: bounds.getEast(),
                        west: bounds.getWest(),
                    });
                }
            });
            mapRef.current = map;
            setIsInitialized(true);
            if (onMapLoad) {
                onMapLoad(map);
            }
        }
        catch (error) {
            // Error initializing map
            onError === null || onError === void 0 ? void 0 : onError();
        }
    }, [center.lat, center.lng, zoom, onBoundsChanged, onMapLoad, onError, isInitialized]);
    // Update markers when properties change
    useEffect(() => {
        if (!mapRef.current || !isInitialized)
            return;
        try {
            // Clear existing markers
            markersRef.current.forEach(marker => {
                var _a;
                (_a = mapRef.current) === null || _a === void 0 ? void 0 : _a.removeLayer(marker);
            });
            markersRef.current = [];
            // Add new markers
            properties.forEach((property) => {
                const icon = L.icon({
                    iconUrl: property.isNew ? "/gps.png" : "/location.png",
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -35],
                    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
                    shadowSize: [45, 45],
                    shadowAnchor: [10, 40],
                });
                const marker = L.marker([property.coordinates.lat, property.coordinates.lng], { icon })
                    .addTo(mapRef.current)
                    .bindPopup(`
            <div class="text-sm">
              <h3 class="font-semibold">${property.title}</h3>
              <p class="text-orange-500">${property.price}</p>
              <p class="text-gray-600">${property.type}</p>
            </div>
          `)
                    .on('click', () => {
                    onMarkerClick === null || onMarkerClick === void 0 ? void 0 : onMarkerClick(property.id);
                });
                markersRef.current.push(marker);
            });
        }
        catch (error) {
            // Error updating markers - silent fail
        }
    }, [properties, onMarkerClick, isInitialized]);
    // Update map view when center or zoom changes
    useEffect(() => {
        if (!mapRef.current || !isInitialized)
            return;
        try {
            mapRef.current.setView([center.lat, center.lng], zoom);
        }
        catch (error) {
            // Error updating map view - silent fail
        }
    }, [center.lat, center.lng, zoom, isInitialized]);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mapRef.current) {
                try {
                    mapRef.current.remove();
                    mapRef.current = null;
                }
                catch (error) {
                    // Cleanup error - silent fail
                }
            }
        };
    }, []);
    return (<div className="h-full w-full relative">
      <div ref={containerRef} className="h-full w-full" style={{ minHeight: "400px" }}/>
      {!isInitialized && (<div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <div className="text-gray-500">Setting up map...</div>
          </div>
        </div>)}
    </div>);
};
export default LeafletMapComponent;
