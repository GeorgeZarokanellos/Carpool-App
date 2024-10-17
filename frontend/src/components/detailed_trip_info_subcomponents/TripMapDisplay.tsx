import React, { useLayoutEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Stop, TripStops } from '../../interfacesAndTypes/Types';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import './TripMapDisplay.scss';
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
    const mapRef = useRef<L.Map | null>(null);

    const stops: StopDetails[] = tripStops.map(stop => ({
        coordinates: [stop.details.lat, stop.details.lng],
        location: stop.details.stopLocation,
    }));

    // delay rendering of map for the map to be displayed correctly
    useLayoutEffect(() => {
        setTimeout(() => setRenderMap(true), 10);
    }, []);

    useLayoutEffect(() => {
        if (renderMap && !mapRef.current) {
            const map = L.map('map').setView([startLocation.lat, startLocation.lng], 13);
            mapRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const waypoints = [
                L.latLng(startLocation.lat, startLocation.lng),
                ...stops.map(stop => L.latLng(stop.coordinates)),
                L.latLng(endLocation.lat, endLocation.lng)
            ];

            const plan = L.Routing.plan(waypoints, {
                draggableWaypoints: false,
            });

            L.Routing.control({
                routeWhileDragging: false,
                lineOptions: {
                    styles: [{ color: '#3880ff' }],
                    extendToWaypoints: true,
                    missingRouteTolerance: 0,
                },
                plan
            }).addTo(map);
        }
    }, [renderMap, startLocation, endLocation, stops]);

    const mapHeight = tripInProgress ? '90%' : '40%'

    return (
        <>
            {renderMap && (
                <div id="map" className='map-container' style={{height: mapHeight}}></div>
            )}
        </>
    );
}