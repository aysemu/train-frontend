import React, { useEffect, useState } from "react";
import SpeedGauge from "./SpeedGauge"; 
import MotorTemperature from "./MotorTemperature";
import "./TrainPopup.css";

function TrainPopup({ train, onClose, onHistoryClick }) {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // 1. Fonksiyonu useEffect içinde tanımlayıp hemen çağırıyoruz
    const fetchHistory = async () => {
      if (!train?.trainId) return;

      try {
        const res = await fetch(`http://localhost:4000/api/trains/${train.trainId}/history`, {
          headers: {
            "Authorization": `Bearer ${token}` // Token artık burada!
          }
        });

        const data = await res.json();

        // 2. Güvenlik Kontrolü: Gelen veri dizi mi? (Slice hatasını engeller)
        if (Array.isArray(data)) {
          setHistory(data.slice(0, 5)); // Son 5 sinyali al
        } else {
          console.error("Beklenen geçmiş verisi dizi değil:", data);
          setHistory([]);
        }
      } catch (err) {
        console.error("Geçmiş verisi çekilirken hata oluştu:", err);
      }
    };

    fetchHistory();
  }, [train?.trainId, token]); // trainId veya token değişirse tekrar çek

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="popup-title">{train.trainId} Canlı Takip</h2>
        
        <div className="visuals-container">
          <div className="visual-item">
            <SpeedGauge speed={train.speed} />
          </div>
          <div className="visual-item">
            <MotorTemperature temperature={train.temperature ?? 0} />
          </div>
        </div>

        <div className="history-section">
          <h3>Son 5 Sinyal (Konuma Gitmek İçin Tıkla)</h3>
          <table className="mini-table">
            <thead>
              <tr>
                <th>Zaman</th>
                <th>Konum (Lat / Lon)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr 
                  key={i} 
                  onClick={() => onHistoryClick(h)} // Satıra tıklandığında konumu gönderir
                  style={{ cursor: 'pointer' }}
                  className="history-row"
                >
                  <td>{new Date(h.timestamp).toLocaleTimeString()}</td>
                  <td style={{ fontSize: '11px' }}>
                    {h.latitude?.toFixed(4)} / {h.longitude?.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TrainPopup;