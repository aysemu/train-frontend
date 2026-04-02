import React, { useEffect, useState } from "react";
import socket from "./services/socket";
import TrainList from "./components/TrainList";
import TrainDetail from "./components/TrainDetail";
import "./App.css";

function App() {
  const [trains, setTrains] = useState({});
  const [selectedTrain, setSelectedTrain] = useState(null);

  useEffect(() => {
    socket.on("telemetry", (data) => {
      setTrains((prev) => ({ //güncellemeden önceki değeri laır
        ...prev,//önceki tüm verilerini kopyalar yeni nesneye verir
        [data.trainId]: data
      }));
    });

    return () => socket.off("telemetry");//kapat
  }, []);
  
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <TrainList
        trains={trains}
        selectedTrain={selectedTrain}
        onSelect={setSelectedTrain}
      />
      <div style={{ flex: 1 }}>
        <TrainDetail train={trains[selectedTrain]} />
        
      </div>
    </div>
  );
}


export default App;
