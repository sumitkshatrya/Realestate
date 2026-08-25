import React, { useEffect, useRef } from 'react';
import { Marker } from 'react-leaflet';

const BouncingMarker = ({ isBouncing, children, ...props }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      const markerElement = marker.getElement();
      if (markerElement) {
        if (isBouncing) {
          markerElement.classList.add('marker-bounce');
        } else {
          markerElement.classList.remove('marker-bounce');
        }
      }
    }
  }, [isBouncing]);

  return (
    <Marker ref={markerRef} {...props}>
      {children}
    </Marker>
  );
};

export default BouncingMarker;