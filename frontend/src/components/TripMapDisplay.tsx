import React, { useLayoutEffect } from 'react';
import { MapContainer , TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Stop, TripStops } from '../interfacesAndTypes/Types';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import './TripMapDisplay.scss';
import { useState } from 'react';

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
    
    const [renderMap, setRenderMap] = useState(false);

    const stops: StopDetails[] = tripStops.map(stop => ({
        coordinates: [stop.details.lat, stop.details.lng],
        location: stop.details.stopLocation,
    }));

    //delay rendering of map for the map to be displayed correctly
    useLayoutEffect(() => { // runs before the browser renders the page
        setTimeout(() => setRenderMap(true),10);
    }, []);

    return (
        <>
            {renderMap && (
                <MapContainer 
                    center={[startLocation.lat, startLocation.lng]} 
                    zoom={14} 
                    className='map' 
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {stops.map((stop, index) => (
                        <Marker 
                            key={index} 
                            position={stop.coordinates} 
                            eventHandlers={{
                                click: () => {
                                    console.log(`Marker ${index} clicked`); 
                                },
                            }}
                        >
                            <Popup>
                                {stop.location}
                            </Popup>
                        </Marker>
                    ))}
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
            )}
        </>
    );
}