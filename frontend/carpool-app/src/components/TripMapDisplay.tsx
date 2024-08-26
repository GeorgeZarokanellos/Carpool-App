import React from 'react';
import { MapContainer , TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { TripStops } from '../interfacesAndTypes/Types';
import { LatLngExpression } from 'leaflet';

interface TripMapDisplayProps {
    // startLocation: LatLngExpression;
    tripStops: TripStops;
}

export const TripMapDisplay: React.FC<TripMapDisplayProps> = ({tripStops}) => {     
    const stops: LatLngExpression[] = tripStops.map(stop => [stop.details.lat, stop.details.lng]);
    
    return (
        <MapContainer center={[38.24368476508384, 21.73212381808353]} zoom={14} className='map'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stops.map((position, index) => (
                <Marker key={index} position={position} />
            ))}
        </MapContainer>
    )
}