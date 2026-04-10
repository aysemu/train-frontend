import React, { useEffect, useState } from "react";
import socket from "./services/socket";
import TrainList from "./components/TrainList";
import TrainDetail from "./components/TrainDetail";
import "./App.css";

function App() {
  const [trains, setTrains] = useState({});
  const [selectedTrain, setSelectedTrain] = useState(null);

  useEffect(() => {
    // 1. ADIM: Sayfa açıldığında veritabanındaki son kayıtları getir (REST API)
    const fetchInitialData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/trains");
        const data = await response.json();
        
        // Gelen diziyi { "id1": data, "id2": data } formatına çevirip state'e atıyoruz
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

    // 2. ADIM: Canlı güncellemeleri dinle (Socket.io)
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
        onSelect={(id) => {
    console.log("Seçilen Tren ID:", id); // Bunu ekle ve tıkla!
    setSelectedTrain(id);}}
      />
      <div style={{ flex: 1 }}>
        {/* Seçili tren varsa detayı göster */}
        {selectedTrain ? (
          <TrainDetail train={trains[selectedTrain]} />
        ) : (
          <div className="placeholder">Lütfen listeden bir tren seçin.</div>
        )} 
      </div>
    </div>
  );
}

export default App;