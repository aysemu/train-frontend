import React, { useEffect, useState } from "react";
import socket from "./services/socket";
import TrainList from "./components/TrainList";
import MapComponent from "./components/MapComponent"; // Haritayı ekledik
import TrainPopup from "./components/TrainPopup";    // BU SATIR HATAYI ÇÖZER
import "./App.css";

function App() {
  const [trains, setTrains] = useState({});
  const [selectedTrain, setSelectedTrain] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/trains");
        const data = await response.json();
        const trainMap = {};
        data.forEach(train => {
          trainMap[train.trainId] = train;
        });
        setTrains(trainMap);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      }
    };

    fetchInitialData();

    socket.on("telemetry", (data) => {
      setTrains((prev) => ({
        ...prev,
        [data.trainId]: data
      }));
    });

    return () => socket.off("telemetry");
  }, []);

  return (
    <div className="app-container" style={{ display: "flex", height: "100vh" }}>
      <TrainList
        trains={trains}
        selectedTrain={selectedTrain}
        onSelect={(id) => setSelectedTrain(id)}
      />
      
      <div style={{ flex: 1, position: "relative" }}>
        {/* HARİTA ARKA PLANDA */}
        <div className="map-wrapper" style={{ flex: 1, height: "100vh", position: "relative" }}>
        <MapComponent 
          trains={Object.values(trains)} 
          onMarkerClick={(id) => setSelectedTrain(id)} 
        /></div>

        {/* POPUP ÜST KATMANDA */}
        {selectedTrain && trains[selectedTrain] && (
          <TrainPopup 
            train={trains[selectedTrain]} 
            onClose={() => setSelectedTrain(null)} // setSelectedTrain olarak düzelttik
          />
        )}
      </div>
    </div>
  );
}

export default App;