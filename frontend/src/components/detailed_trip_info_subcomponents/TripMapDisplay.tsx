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

    // useLayoutEffect(() => {
    //     if (renderMap && !mapReference.current) {
    //         const map = L.map('map').setView([startLocation.lat, startLocation.lng], 13);
    //         console.log('map', map);
            
    //         mapReference.current = map;   // store map reference to not reinitialize in each render

    //         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //             attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //         }).addTo(map);

    //         const waypoints = [
    //             L.latLng(startLocation.lat, startLocation.lng),
    //             ...stops.map(stop => L.latLng(stop.coordinates)),
    //             L.latLng(endLocation.lat, endLocation.lng)
    //         ];

    //         const plan = L.Routing.plan(waypoints, {
    //             draggableWaypoints: false,
    //         });

    //         L.Routing.control({
    //             routeWhileDragging: false,
    //             lineOptions: {
    //                 styles: [{ color: '#3880ff' }],
    //                 extendToWaypoints: true,
    //                 missingRouteTolerance: 0,
    //             },
    //             plan
    //         }).addTo(map);

    //     }

    //     return () => {
    //         if(mapReference.current){
    //             mapReference.current.remove();
    //             mapReference.current = null;
    //         }
    //     }

    // }, [renderMap, startLocation, endLocation, stops]);

    const mapHeight = tripInProgress ? '85%' : '40%'

    return (
        <> 
            {
                renderMap && 
                (
                    <MapContainer 
                        center={[startLocation.lat, startLocation.lng]} 
                        zoom={13} 
                        style={{ height: mapHeight, width: '100%' }}
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