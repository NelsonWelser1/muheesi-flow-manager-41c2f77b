import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { ExternalLink, ZoomIn, ZoomOut, RotateCcw, Ship, MapPin, PackageCheck } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Mapbox public token - in production, you should use an environment variable
// This is a temporary token for demonstration purposes
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby1hY2NvdW50LWxvdmFibGUiLCJhIjoiY2x3bzdsdGNrMGp6djJrcXFhdHAzN3d5NCJ9.Py-uZKIUDMBFKJ9v3K-EYw';

const GlobalShipmentMap = ({ shipments = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState('3d'); // '3d' or '2d'
  const markersRef = useRef([]);
  
  // Setup map on component mount
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        projection: viewMode === '3d' ? 'globe' : 'mercator',
        zoom: 1.5,
        center: [30, 15],
        pitch: viewMode === '3d' ? 45 : 0,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Disable scroll zoom for smoother experience, users can zoom with buttons
      map.current.scrollZoom.disable();

      // Add effects for 3D globe view
      map.current.on('style.load', () => {
        if (viewMode === '3d') {
          map.current.setFog({
            color: 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 200, 225)',
            'horizon-blend': 0.2,
          });
        }
        
        setMapLoaded(true);
      });
      
      // Start gentle rotation in 3D mode
      if (viewMode === '3d') {
        startGlobeRotation();
      }

      // Cleanup
      return () => {
        if (markersRef.current) {
          markersRef.current.forEach(marker => marker.remove());
          markersRef.current = [];
        }
        
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Map Error",
        description: "Could not initialize the map. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [viewMode, toast]);

  // Plot shipment data on the map
  useEffect(() => {
    if (!map.current || !mapLoaded || !shipments.length) return;
    
    try {
      // Clear existing markers
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
      }

      // Geocode destinations and add markers for each shipment
      shipments.forEach(shipment => {
        if (!shipment.destination) return;
        
        // In a real app, you would use geocoding to get coordinates
        // For this demo, we'll use a random position near the named destination
        // In production, you should use a proper geocoding service
        const destinationCoordinates = getApproximateCoordinates(shipment.destination);
        
        if (destinationCoordinates) {
          // Create custom HTML element for the marker
          const el = document.createElement('div');
          el.className = 'shipment-marker';
          el.innerHTML = `<div class="flex h-8 w-8 items-center justify-center rounded-full ${getStatusColor(shipment.status)} text-white shadow-lg cursor-pointer transform hover:scale-110 transition-all">
            <span>${shipment.status === 'delivered' ? '✓' : '📦'}</span>
          </div>`;
          
          // Create popup with shipment info
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold">${shipment.shipment_id}</h3>
                <p><strong>Status:</strong> ${shipment.status || 'Unknown'}</p>
                <p><strong>Destination:</strong> ${shipment.destination}</p>
                <p><strong>Client:</strong> ${shipment.client || 'Unknown'}</p>
                ${shipment.eta ? `<p><strong>ETA:</strong> ${new Date(shipment.eta).toLocaleDateString()}</p>` : ''}
                ${shipment.vessel ? `<p><strong>Vessel:</strong> ${shipment.vessel}</p>` : ''}
              </div>
            `);

          // Add marker to map
          const marker = new mapboxgl.Marker(el)
            .setLngLat(destinationCoordinates)
            .setPopup(popup)
            .addTo(map.current);
            
          markersRef.current.push(marker);
        }
      });
      
      // Draw routes if we have origin and destination
      shipments.forEach(shipment => {
        if (shipment.route) {
          drawShipmentRoute(shipment);
        }
      });
    } catch (error) {
      console.error('Error plotting shipments on map:', error);
    }
  }, [shipments, mapLoaded]);

  // Helper function to draw a route line between points
  const drawShipmentRoute = (shipment) => {
    if (!map.current || !shipment.route) return;
    
    // Parse route into waypoints
    const waypoints = parseRoute(shipment.route);
    
    if (waypoints.length < 2) return;
    
    try {
      // Add a route line
      const routeId = `route-${shipment.id}`;
      
      // Remove existing route if it exists
      if (map.current.getSource(routeId)) {
        map.current.removeLayer(`${routeId}-line`);
        map.current.removeSource(routeId);
      }
      
      // Convert waypoints to coordinates
      const coordinates = waypoints.map(place => getApproximateCoordinates(place));
      const validCoordinates = coordinates.filter(coord => coord !== null);
      
      if (validCoordinates.length < 2) return;
      
      map.current.addSource(routeId, {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': validCoordinates
          }
        }
      });
      
      map.current.addLayer({
        'id': `${routeId}-line`,
        'type': 'line',
        'source': routeId,
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': getStatusLineColor(shipment.status),
          'line-width': 2,
          'line-dasharray': [0, 2, 1]
        }
      });
    } catch (error) {
      console.error('Error drawing route:', error);
    }
  };

  // Helper to parse route string into waypoints
  const parseRoute = (routeString) => {
    // Split by arrows, commas, or other delimiters that might be used
    return routeString.split(/→|,|;|\s-\s/).map(s => s.trim()).filter(Boolean);
  };

  // Helper to get approximate coordinates for a location name
  // In a real app, you would use a geocoding service
  const getApproximateCoordinates = (locationName) => {
    // This is a simplified map with approximate coordinates
    // In production, use a geocoding API to get precise coordinates
    const locationMap = {
      'mombasa': [39.6682, -4.0435],
      'nairobi': [36.8219, -1.2921],
      'singapore': [103.8198, 1.3521],
      'tokyo': [139.6503, 35.6762],
      'beijing': [116.4074, 39.9042],
      'shanghai': [121.4737, 31.2304],
      'hong kong': [114.1694, 22.3193],
      'new york': [-74.0060, 40.7128],
      'los angeles': [-118.2437, 34.0522],
      'dubai': [55.2708, 25.2048],
      'london': [-0.1278, 51.5074],
      'mumbai': [72.8777, 19.0760],
      'cape town': [18.4241, -33.9249],
      'rio de janeiro': [-43.1729, -22.9068],
      'sydney': [151.2093, -33.8688],
      'amsterdam': [4.9041, 52.3676],
      'rotterdam': [4.4777, 51.9244],
      'antwerp': [4.4026, 51.2194],
      'hamburg': [9.9937, 53.5511],
      'marseille': [5.3698, 43.2965]
    };
    
    // Try to find the location in our map
    const key = Object.keys(locationMap).find(key => 
      locationName.toLowerCase().includes(key.toLowerCase())
    );
    
    if (key) {
      return locationMap[key];
    }
    
    // Return random coordinates if location not found (for demo purposes)
    // In production, you should handle this more gracefully
    return [
      Math.random() * 360 - 180, // longitude between -180 and 180
      Math.random() * 140 - 70   // latitude between -70 and 70
    ];
  };

  // Start a gentle rotation of the globe
  const startGlobeRotation = () => {
    if (!map.current) return;
    
    const secondsPerRevolution = 240;
    let userInteracting = false;
    let startTime = Date.now();
    
    const frame = () => {
      if (!map.current) return;
      
      if (!userInteracting) {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const rotationDegrees = (elapsedSeconds / secondsPerRevolution) * 360;
        
        const center = map.current.getCenter();
        center.lng = ((rotationDegrees % 360) - 180);
        
        map.current.easeTo({
          center,
          duration: 0,
          easing: t => t
        });
      }
      
      requestAnimationFrame(frame);
    };
    
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      startTime = Date.now();
    });
    
    map.current.on('dragend', () => {
      userInteracting = false;
      startTime = Date.now();
    });
    
    frame();
  };

  // Helper to get status color for markers
  const getStatusColor = (status) => {
    switch (status) {
      case 'in-transit': return 'bg-blue-600';
      case 'loading': return 'bg-amber-500';
      case 'preparing': return 'bg-purple-600';
      case 'delivered': return 'bg-green-600';
      case 'scheduled': return 'bg-gray-600';
      case 'delayed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };
  
  // Helper to get status color for route lines
  const getStatusLineColor = (status) => {
    switch (status) {
      case 'in-transit': return '#3b82f6';
      case 'loading': return '#f59e0b';
      case 'preparing': return '#9333ea';
      case 'delivered': return '#16a34a';
      case 'scheduled': return '#6b7280';
      case 'delayed': return '#dc2626';
      default: return '#6b7280';
    }
  };

  // Toggle between 2D and 3D views
  const toggleViewMode = () => {
    setViewMode(prev => {
      const newMode = prev === '3d' ? '2d' : '3d';
      
      // Reset the map with new projection
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      
      return newMode;
    });
  };

  // Zoom in and out handlers
  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  // Reset map view
  const handleResetView = () => {
    if (map.current) {
      map.current.easeTo({
        center: [30, 15],
        zoom: 1.5,
        pitch: viewMode === '3d' ? 45 : 0,
        bearing: 0,
        duration: 1500
      });
    }
  };

  // Check if we have real data to show
  const hasShipmentData = shipments && shipments.length > 0;

  return (
    <div className="relative h-80 bg-slate-100 rounded-md overflow-hidden">
      {!hasShipmentData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-100">
          <Ship className="h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-600">No Shipment Data Available</h3>
          <p className="text-sm text-slate-500 max-w-md text-center mt-2">
            Add shipments to view them on the interactive global map
          </p>
        </div>
      )}
      
      <div 
        ref={mapContainer} 
        className="absolute inset-0"
        style={{ opacity: hasShipmentData ? 1 : 0.3 }}
      />
      
      {/* Map controls */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/90 hover:bg-white"
          onClick={toggleViewMode}
        >
          {viewMode === '3d' ? '2D View' : '3D View'}
        </Button>
        
        <div className="flex flex-col gap-1">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/90 hover:bg-white h-8 w-8"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/90 hover:bg-white h-8 w-8"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline" 
            size="icon"
            className="bg-white/90 hover:bg-white h-8 w-8"
            onClick={handleResetView}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Legend */}
      {hasShipmentData && (
        <div className="absolute bottom-3 left-3 z-10 bg-white/90 rounded-md p-2 text-xs">
          <h4 className="font-semibold mb-1">Shipment Status</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span>In Transit</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>Loading</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <span>Preparing</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span>Delivered</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-600"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span>Delayed</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Fullscreen button */}
      <div className="absolute bottom-3 right-3 z-10">
        <Button variant="outline" className="bg-white/90 hover:bg-white">
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Full Map
        </Button>
      </div>
      
      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-100/80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default GlobalShipmentMap;
