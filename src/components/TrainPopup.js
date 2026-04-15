import React, { useEffect, useState } from "react";
import SpeedGauge from "./SpeedGauge"; 
import MotorTemperature from "./MotorTemperature";
import "./TrainPopup.css";

function TrainPopup({ train, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (train?.trainId) {
      fetch(`http://localhost:4000/api/trains/${train.trainId}/history`)
        .then(res => res.json())
        .then(data => setHistory(data.slice(0, 5)))
        .catch(err => console.error(err));
    }
  }, [train?.trainId]);

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
          <h3>Son 5 Sinyal</h3>
          <table className="mini-table">
            <thead>
              <tr>
                <th>Zaman</th>
                {/* Hız yerine Konum başlığı geldi */}
                <th>Konum (Lat / Lon)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td>{new Date(h.timestamp).toLocaleTimeString()}</td>
                  {/* Hız yerine enlem ve boylam değerleri gösteriliyor */}
                  <td style={{ fontSize: '17px' }}>
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