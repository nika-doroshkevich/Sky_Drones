import React, {useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMapEvents} from 'react-leaflet';
import L, {LatLng} from 'leaflet';
import "./Map.css";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

interface MapProps {
    onMarkerPositionChange: (lat: number, lng: number) => void;
}

const MapComponent: React.FC<MapProps> = ({onMarkerPositionChange}) => {
    const [markerPosition, setMarkerPosition] =
        useState<{ lat: number, lng: number } | null>(null);

    const handleMapClick = (event: any) => {
        const {lat, lng} = event.latlng;
        setMarkerPosition(new LatLng(lat, lng));
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
            <MapContainer center={[53.9, 27.5667]} zoom={13} style={{height: '400px'}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <MapClickHandler/>
                {markerPosition && (
                    <Marker position={[markerPosition.lat, markerPosition.lng]}>
                        <Popup>Your facility is here</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
