import React, { useEffect, useState } from "react";
import SpeedGauge from "./SpeedGauge";
import MotorTemperature from "./MotorTemperature";
import MapComponent from "./MapComponent";
import "./TrainDetail.css";

function TrainDetail({ train }) {
  // 1. Hook'ları bileşen içine aldık
  const [history, setHistory] = useState([]);

  // 2. Seçili tren değiştikçe geçmişi çeken mantık
  useEffect(() => {
    // Sadece trainId gerçekten varsa istek at
    if (train?.trainId) {
      console.log(`📡 ${train.trainId} için geçmiş verisi çekiliyor...`);
      
      fetch(`http://localhost:4000/api/trains/${train.trainId}/history`)
        .then((res) => {
          if (!res.ok) throw new Error("Sunucu yanıt vermedi");
          return res.json();
        })
        .then((data) => {
          console.log("📥 Gelen Geçmiş Verisi:", data);
          setHistory(data);
        })
        .catch((err) => {
          console.error("🔥 Geçmiş yüklenemedi:", err);
          setHistory([]); // Hata durumunda listeyi temizle
        });
    }
  }, [train?.trainId]);

  if (!train) return <div className="no-selection">Lütfen bir tren seçin</div>;

  return (
    <div className="dashboard-container">
      <h2 className="title">{train.trainId} Telemetri Paneli</h2>

      {/* Üst Kısım: Göstergeler */}
      <div className="top-row">
        <div className="card">
          <h3>Hız</h3>
          <SpeedGauge speed={train.speed} />
        </div>

        <div className="card">
          <h3>Motor Sıcaklığı</h3>
          <MotorTemperature temperature={train.temperature ?? 0} />
        </div>
      </div>

      {/* Orta Kısım: Harita */}
      <div className="card location-card">
        <h3>Konum</h3>
        <MapComponent
          latitude={train.latitude}
          longitude={train.longitude}
          trainId={train.trainId}
        />
        <p className="coordinates">
          Lat: {train.latitude?.toFixed(4)} | Lon: {train.longitude?.toFixed(4)}
        </p>
      </div>

      {/* Alt Kısım: Geçmiş Veri Tablosu */}
      <div className="card history-card">
        <h3>Son Hareketler (Geçmiş)</h3>
        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Zaman</th>
                <th>Hız (km/h)</th>
                <th>Sıcaklık (°C)</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((h, index) => (
                  <tr key={index}>
                    <td>{new Date(h.timestamp).toLocaleTimeString()}</td>
                    <td>{h.speed.toFixed(1)}</td>
                    <td>{h.temperature?.toFixed(1) ?? "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Veri yükleniyor...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TrainDetail;