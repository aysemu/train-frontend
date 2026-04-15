import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker ikon hatasını çözmek için standart Leaflet ikonlarını manuel tanımlıyoruz
const trainIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

function MapComponent({ trains, onMarkerClick }) {
    const [railData, setRailData] = useState(null);
    const [stationData, setStationData] = useState(null);

    useEffect(() => {
        fetch("/railway_lines.json").then(res => res.json()).then(data => setRailData(data));
        fetch("/stations.json").then(res => res.json()).then(data => setStationData(data));
    }, []);

    // İstasyon noktaları için stil (Daha önce sendeki ayarlar)
    const stationMarkerOptions = {
        radius: 5,
        fillColor: "#ffffff",
        color: "#1e293b",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
    };

    return (
        <MapContainer
            center={[39.9334, 32.8597]} 
            zoom={7}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* 1. TRENLER: Yüzlerce görsel hatasını engellemek için ikonu sabitledik */}
            {trains && trains.map((train) => (
                <Marker 
                    key={train.trainId} 
                    position={[train.latitude, train.longitude]} 
                    icon={trainIcon}
                    eventHandlers={{
                        click: () => onMarkerClick(train.trainId),
                    }}
                >
                    <Popup>{train.trainId}</Popup>
                </Marker>
            ))}

            {/* 2. DEMİRYOLLARI */}
            {railData && <GeoJSON data={railData} style={{ color: "#2f7fee", weight: 2 }} />}

            {/* 3. İSTASYONLAR: Geri geldiler! */}
            {stationData && (
                <GeoJSON
                    data={stationData}
                    pointToLayer={(feature, latlng) => L.circleMarker(latlng, stationMarkerOptions)}
                    onEachFeature={(feature, layer) => {
                        if (feature.properties?.name) {
                            layer.bindPopup(`<div style="color: black;"><strong>İstasyon:</strong> ${feature.properties.name}</div>`);
                        }
                    }}
                />
            )}
        </MapContainer>
    );
}

export default MapComponent;