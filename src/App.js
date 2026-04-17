import React, { useEffect, useState } from "react";
import socket from "./services/socket";
import TrainList from "./components/TrainList";
import MapComponent from "./components/MapComponent"; 
import TrainPopup from "./components/TrainPopup";    
import "./App.css";

function App() {
  const [trains, setTrains] = useState({});
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedHistoryPos, setSelectedHistoryPos] = useState(null); // Geçmiş konum state'i

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
    <div className="app-container" >
      {/* SOL PANEL: Tren Listesi */}
      <TrainList
        trains={trains}
        selectedTrain={selectedTrain}
        onSelect={(id) => {
          setSelectedTrain(id);
          setSelectedHistoryPos(null); // Listeden yeni tren seçilince hayaleti temizle
        }}
      />
      
      {/* SAĞ PANEL: Harita ve Popup Kapsayıcısı */}
      <div style={{ flex: 1, position: "relative" }}>
        <div className="map-wrapper" style={{ width: "100%", height: "100%" }}>
          <MapComponent 
            trains={Object.values(trains)} 
            selectedTrain={trains[selectedTrain]} 
            historyPos={selectedHistoryPos} 
            onMarkerClick={(id) => {
              setSelectedTrain(id);
              setSelectedHistoryPos(null); 
            }} 
          />
        </div>

        {/* POPUP KATMANI: Sadece bir tren seçiliyse görünür */}
        {selectedTrain && trains[selectedTrain] && (
          <TrainPopup 
            train={trains[selectedTrain]} 
            onClose={() => {
              setSelectedTrain(null);
              setSelectedHistoryPos(null);
            }} 
            onHistoryClick={(pos) => setSelectedHistoryPos(pos)} 
          />
        )}
      </div>
    </div>
  );
}

export default App;