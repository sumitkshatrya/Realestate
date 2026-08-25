import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { FaBed, FaBath } from 'react-icons/fa';
import { MdSpaceDashboard } from 'react-icons/md'; 
import BouncingMarker from './BouncingMarker';

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to handle map movement and report visible properties
const MapBoundsListener = ({ allProperties, onVisibleChange }) => {
  const map = useMap();
  const updateVisibleProperties = () => {
    const bounds = map.getBounds();
    const visible = allProperties.filter(
      p => p.latitude && p.longitude && bounds.contains([p.latitude, p.longitude])
    );
    onVisibleChange(visible);
  };

  useMapEvents({
    moveend: updateVisibleProperties,
    zoomend: updateVisibleProperties,
  });

  useEffect(updateVisibleProperties, [map, allProperties, onVisibleChange]);
  return null;
};
const MapBounds = ({ properties }) => {
  const map = useMap();
  useMemo(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [properties, map]);
  return null;
};

const ListingsMap = ({ properties, onVisibleChange, hoveredPropertyId, onMarkerClick }) => {
  const propertiesWithCoords = useMemo(() => {
    return properties.filter(p => p.latitude && p.longitude);
  }, [properties]);

  if (propertiesWithCoords.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] w-full rounded-2xl border border-slate-200 bg-slate-50 shadow-lg">
        <p className="text-center text-slate-500">No properties with location data to display on the map.</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-lg">
      <MapContainer center={[propertiesWithCoords[0].latitude, propertiesWithCoords[0].longitude]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds properties={propertiesWithCoords} />
        {onVisibleChange && <MapEvents allProperties={propertiesWithCoords} onVisibleChange={onVisibleChange} />}
        {propertiesWithCoords.map(property => (
          <BouncingMarker
            key={property._id}
            position={[property.latitude, property.longitude]}
            isBouncing={hoveredPropertyId === property._id}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) onMarkerClick(property._id);
              },
            }}
          >
            <Popup>
              <div className="w-64">
                <img src={property.images[0]} alt={property.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                <h3 className="font-bold text-lg mb-1 truncate" title={property.name}>{property.name}</h3>
                <p className="text-rose-600 font-bold text-lg mb-3">{property.price}</p>
                
                <div className="grid grid-cols-3 gap-2 text-center text-sm text-slate-600 border-t pt-3 mb-4">
                    <div><FaBed className="mx-auto mb-1 text-lg text-rose-500" /><p className="font-semibold">{property.bed}</p><p className="text-xs">Beds</p></div>
                    <div><FaBath className="mx-auto mb-1 text-lg text-rose-500" /><p className="font-semibold">{property.bath}</p><p className="text-xs">Baths</p></div>
                    <div><MdSpaceDashboard className="mx-auto mb-1 text-lg text-rose-500" /><p className="font-semibold">{property.area}</p><p className="text-xs">sq ft</p></div>
                </div>

                <Link 
                  to={`/properties/${property._id}`} 
                  className="block w-full text-center bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={(e) => e.stopPropagation()} // Prevents map click event
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </BouncingMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ListingsMap;