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
        // Eğer bir geçmiş konumuna tıklandıysa oraya odaklan
        if (historyPos) {
            // Geçmiş konuma giderken odaklanmak için 15 ideal, 
            // ama istersen burayı da map.getZoom() yapabilirsin.
            map.setView([historyPos.latitude, historyPos.longitude], 15, { animate: true });
        } 
        // Yoksa normal seçili treni takip et
        else if (selectedTrain?.trainId && markerRefs.current[selectedTrain.trainId]) {
            const { latitude, longitude } = selectedTrain;
            
            // KRİTİK DEĞİŞİKLİK: Sabit zoom yerine o anki zoom'u alıyoruz
            const currentZoom = map.getZoom(); 
            
            map.setView([latitude, longitude], currentZoom, { 
                animate: true,
                duration: 0.5 // Geçiş süresini biraz kısalttık ki canlı takip daha akıcı olsun
            });
            
            markerRefs.current[selectedTrain.trainId].openPopup();
        }
    }, [selectedTrain, historyPos, map, markerRefs]);

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
        <MapContainer center={[39.9334, 32.8597]} zoom={7} style={{ height: "100%", width: "100%" }}>
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