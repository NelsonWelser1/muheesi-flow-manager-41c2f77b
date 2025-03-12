
import React, { useRef } from 'react';
import MapPinDisplay from './MapPinDisplay';
import { getMapEmbedUrl } from './mapUtils';

const MapContainer = ({ 
  isDragging, 
  handlePinDrag, 
  pinPosition, 
  pinAddress, 
  coordinates 
}) => {
  const mapContainerRef = useRef(null);
  
  return (
    <div 
      className="h-[500px] w-full relative" 
      ref={mapContainerRef}
      onMouseMove={isDragging ? (e) => handlePinDrag(e, mapContainerRef) : null}
    >
      <iframe 
        id="google-map-iframe"
        src={getMapEmbedUrl("Kampala,Uganda")}
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen="" 
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      
      <MapPinDisplay 
        pinPosition={pinPosition}
        pinAddress={pinAddress}
        coordinates={coordinates}
        isDragging={isDragging}
      />
    </div>
  );
};

export default MapContainer;
