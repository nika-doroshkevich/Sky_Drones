import React, {useEffect, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMapEvents} from 'react-leaflet';
import L from 'leaflet';
import "./Map.css";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

interface MapProps {
    latitude: number;
    longitude: number;
    onMarkerPositionChange: (lat: number, lng: number) => void;
    isMarker: boolean;
}

const MapComponent: React.FC<MapProps> = ({latitude, longitude, onMarkerPositionChange, isMarker}) => {
    const [markerPosition, setMarkerPosition] =
        useState<{ lat: number, lng: number } | null>(null);

    useEffect(() => {
        if (isMarker) {
            setMarkerPosition({lat: latitude, lng: longitude});
        }
    }, [latitude, longitude]);

    const handleMapClick = (event: any) => {
        const {lat, lng} = event.latlng;
        setMarkerPosition({lat, lng});
        onMarkerPositionChange(lat, lng);
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: (event) => {
                handleMapClick(event);
            },
        });

        return null;
    };

    return (
        <div className="container">
            {latitude !== 0 && longitude !== 0 && (
                <MapContainer center={[latitude, longitude]} zoom={10} style={{height: '450px'}}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <MapClickHandler/>
                    {markerPosition && (
                        <Marker position={[markerPosition.lat, markerPosition.lng]}>
                            <Popup>Your facility is here</Popup>
                        </Marker>
                    )}
                </MapContainer>
            )}
        </div>
    );
};

export default MapComponent;
