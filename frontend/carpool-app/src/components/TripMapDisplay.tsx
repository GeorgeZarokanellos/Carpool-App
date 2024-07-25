import React from 'react';
import { MapContainer , TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ExtendedTrip, Stop, TripStops } from '../interfacesAndTypes/Types';
import { LatLngExpression } from 'leaflet';

interface TripMapDisplayProps {
    tripStops: TripStops;
}

export const TripMapDisplay: React.FC<TripMapDisplayProps> = ({tripStops}) => { 
    console.log(tripStops);
    const startPosition: LatLngExpression = [38.24368476508384, 21.73212381808353]; 
    const endPosition: LatLngExpression = [38.28623463741879, 21.785996514033958]; //prutaneia    
    const stops: LatLngExpression[] = tripStops.map(stop => [stop.details.lat, stop.details.lng]);
    // console.log(stops);
    
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