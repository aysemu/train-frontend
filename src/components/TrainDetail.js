import React from "react";
import SpeedGauge from "./SpeedGauge";
import MotorTemperature from "./MotorTemperature";
import "./TrainDetail.css";
import MapComponent from "./MapComponent";

function TrainDetail({ train }) {
  if (!train) return <h2>Bir tren seçin</h2>;

  return (
    <div className="dashboard-container">
      <h2 className="title">{train.trainId} Telemetri</h2>

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

      <div className="card location-card">
         <h3>Konum</h3>
         <MapComponent
        latitude={train.latitude}
        longitude={train.longitude}
        trainId={train.trainId}/>

      <p>
        Lat: {typeof train.latitude === 'number' ? train.latitude.toFixed(4) : "0.0000"} <br />
        Lon: {typeof train.longitude === 'number' ? train.longitude.toFixed(4) : "0.0000"}
      </p>
        </div>
    </div>
  );
}

export default TrainDetail;
