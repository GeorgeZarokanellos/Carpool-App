import React, { useLayoutEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { Stop, TripStops } from '../../interfacesAndTypes/Types';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import './TripMapDisplay.scss';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

interface TripMapDisplayProps {
    tripStops: TripStops;
    startLocation: Stop;
    endLocation: Stop;
    tripInProgress: boolean;
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

export const TripMapDisplay: React.FC<TripMapDisplayProps> = ({ tripStops, startLocation, endLocation, tripInProgress }) => {
    const [renderMap, setRenderMap] = useState(false);
    const stops: StopDetails[] = tripStops.map(stop => ({
        coordinates: [stop.details.lat, stop.details.lng],
        location: stop.details.stopLocation,
    }));

    // delay rendering of map for the map to be displayed correctly
    useLayoutEffect(() => {
        setTimeout(() => setRenderMap(true), 10);
    }, []);

    return (
        <> 
            {
                renderMap && 
                (
                    <MapContainer 
                        center={[startLocation.lat, startLocation.lng]} 
                        zoom={13} 
                        style={{ height: tripInProgress ? '85%' : '40%', width: '100%' }}
                    >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[startLocation.lat, startLocation.lng]}>
                        <Popup>
                            Start Location : {startLocation.stopLocation}
                        </Popup>
                    </Marker>
                    {stops.map((stop, index) => (
                        <Marker key={index} position={stop.coordinates}>
                            <Popup>
                                {stop.location}
                            </Popup>
                        </Marker>
                    ))}
                    <Marker position={[endLocation.lat, endLocation.lng]}>
                        <Popup>
                            End Location : {endLocation.stopLocation}
                        </Popup>
                    </Marker>
                    </MapContainer>
                )
            }
        </>
    );
}