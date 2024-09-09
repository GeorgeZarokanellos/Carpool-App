import React from 'react';
import { MapContainer , TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Stop, TripStops } from '../interfacesAndTypes/Types';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';


interface TripMapDisplayProps {
    // startLocation: LatLngExpression;
    tripStops: TripStops;
    startLocation: Stop;
    endLocation: Stop;
}

interface StopDetails {
    coordinates: LatLngExpression;
    location: string;
}

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

export const TripMapDisplay: React.FC<TripMapDisplayProps> = ({tripStops, startLocation, endLocation}) => {   
    
    const stops: StopDetails[] = tripStops.map(stop => ({
        coordinates: [stop.details.lat, stop.details.lng],
        location: stop.details.stopLocation,
    }));

    return (
        <MapContainer 
            center={[38.24368476508384, 21.73212381808353]} 
            zoom={14} 
            className='map' 
            style={{height: '100vh', width: '100%'}}
            scrollWheelZoom={false}
            tap={false}
            >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                stops.map((stop, index) => {
                    return(
                        <Marker 
                            key={index} 
                            position={stop.coordinates} 
                            eventHandlers={{
                                click: () => {
                                    console.log(`Marker ${index} clicked`); 
                                },
                            }}
                            >
                            <Popup >
                                {stop.location}
                            </Popup>
                        </Marker>
                    )
                } 
            )}
            <Marker position={[startLocation.lat, startLocation.lng]}>
                <Popup>
                    {"Start " + startLocation.stopLocation}
                </Popup>
            </Marker>
            <Marker position={[endLocation.lat, endLocation.lng]}>
                <Popup>
                    {"Finish " + endLocation.stopLocation}
                </Popup>
            </Marker>
        </MapContainer>
    )
}