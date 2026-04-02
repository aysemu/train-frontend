import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 1. ADIM: RecenterMap artık en dışta ve bağımsız bir bileşen
function RecenterMap({ latitude, longitude }) {
  const map = useMap();
  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], map.getZoom(), { animate: true, duration: 0.5 });
    }
  }, [latitude, longitude, map]);
  return null;
}

function MapComponent({ latitude, longitude, trainId }) {
  const [railData, setRailData] = useState(null);
  const [stationData, setStationData] = useState(null);

  const marker = new L.Icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useEffect(() => {
    fetch("/railway_lines.json")
      .then((res) => res.json())
      .then((data) => setRailData(data));

    fetch("/stations.json")
      .then((res) => res.json())
      .then((data) => setStationData(data));
  }, []);

  if (latitude == null || longitude == null) return null;

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
      center={[latitude, longitude]}
      zoom={13}
      style={{ height: "800px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 2. ADIM: TileLayer'dan sonra burada çağırıyoruz */}
      <RecenterMap latitude={latitude} longitude={longitude} />

      {railData && (
        <GeoJSON 
          key={`rails-${railData.features.length}`}
          data={railData} 
          style={{ color: "#2f7fee", weight: 2 }} 
        />
      )}

      {stationData && (
        <GeoJSON
          key={`stations-${stationData.features.length}`}
          data={stationData}
          pointToLayer={(feature, latlng) => L.circleMarker(latlng, stationMarkerOptions)}
          onEachFeature={(feature, layer) => {
            if (feature.properties && feature.properties.name) {
              layer.bindPopup(`<div style="color: black;"><strong>İstasyon:</strong> ${feature.properties.name}</div>`);
            }
          }}
        />
      )}

      <Marker position={[latitude, longitude]} icon={marker}>
        <Popup>
          <div style={{ color: "black", fontSize: "14px" }}>
            <strong style={{ color: "#d22121" }}>{trainId || "Bilinmeyen Tren"}</strong>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapComponent;