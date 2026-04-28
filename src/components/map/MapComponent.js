import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const trainIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Hayalet Marker İkonu ile gemiştekileri görebilelim idye ekledim
const ghostIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [20, 32],
    iconAnchor: [10, 32],
    popupAnchor: [0, -32], //popup ikonun üstünde dursun diye
    className: 'ghost-marker-style' // saydam olsun ki karışmasın
});

function RecenterMap({ selectedTrain, historyPos, markerRefs }) {
    const map = useMap();
    
    useEffect(() => {
        if (!map || !selectedTrain) return;
        // EĞER SEÇİLİ TREN VEYA GEÇMİŞ YOKSA HİÇBİR ŞEY YAPMA
        if (!selectedTrain && !historyPos) return;

        // Harita hazır değilse çık
        if (!map || typeof map.getZoom !== 'function') return;

        const { latitude, longitude, trainId } = selectedTrain;

        // 1. Eğer geçmiş konum seçiliyse oraya odaklan ve DUR
        if (historyPos) {
            map.setView([historyPos.latitude, historyPos.longitude], 15, { animate: true });
            return; 
        }

        // 2. Sadece seçili trenin koordinatları gerçekten değiştiyse hareket et
        // Leaflet'in mevcut merkezini alıp mesafe kontrolü yapıyoruz
        const center = map.getCenter();
        const latDiff = Math.abs(center.lat - latitude);
        const lonDiff = Math.abs(center.lng - longitude);

        // Çok küçük değişimlerde (titreme seviyesinde) haritayı oynatma
        if (latDiff > 0.0001 || lonDiff > 0.0001) {
            map.setView([latitude, longitude], map.getZoom(), { 
                animate: true,
                duration: 0.5 
            });
            
            // Popup'ı sadece marker varsa aç
            if (markerRefs.current[trainId]) {
                markerRefs.current[trainId].openPopup();
            }
        }
    }, [selectedTrain?.latitude, selectedTrain?.longitude, historyPos]); 
    // ^ Sadece koordinatlar veya geçmiş seçim değişirse çalışacak

    return null;
}

function MapComponent({ trains, selectedTrain, historyPos, onMarkerClick }) {
    const [railData, setRailData] = useState(null);
    const [stationData, setStationData] = useState(null);
    const markerRefs = useRef({});

    useEffect(() => {
        fetch("/railway_lines.json").then(res => res.json()).then(data => setRailData(data));
        fetch("/stations.json").then(res => res.json()).then(data => setStationData(data));
    }, []);

    return (
        <MapContainer
            center={[39.9334, 32.8597]} 
            zoom={7} 
            style={{ height: "100%", width: "100%" }}
            preferCanvas={true} // <--- Performans için çok kritik
            zoomControl={false} // <--- Eğer kendi zoom butonların varsa çakışmasın
            >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <RecenterMap selectedTrain={selectedTrain} historyPos={historyPos} markerRefs={markerRefs} />

            {/* HAYALET MARKER: Sadece bir geçmiş kaydına tıklandığında görünür */}
            {historyPos && (
                <Marker position={[historyPos.latitude, historyPos.longitude]} icon={ghostIcon}>
                    <Popup>Geçmiş Konum:<br />
                    {new Date(historyPos.timestamp).toLocaleTimeString()}<br />
                    {historyPos.latitude.toFixed(4)} / {historyPos.longitude.toFixed(4)}
                    </Popup>
                </Marker>
            )}

            {trains && trains.map((train) => (
                <Marker 
                    key={train.trainId} 
                    position={[train.latitude, train.longitude]} 
                    icon={trainIcon}
                    ref={(el) => { if (el) markerRefs.current[train.trainId] = el; }}
                    eventHandlers={{ click: () => onMarkerClick(train.trainId) }}
                >
                    <Popup autoPan={false}>
                        <div style={{ textAlign: "center" }}>
                            <strong>{train.trainId}</strong>
                            <div style={{ fontSize: "11px" }}></div>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {railData && <GeoJSON data={railData} style={{ color: "#2f7fee", weight: 2 }} />}
        </MapContainer>
    );
}

export default MapComponent;