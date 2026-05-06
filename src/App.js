import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import socket from "./services/socket";
import TrainList from "./components/sidebar/TrainList";
import MapComponent from "./components/map/MapComponent"; 
import TrainPopup from "./components/infotrain/TrainPopup";
// Yeni şık tasarımın olduğu bileşeni import ediyoruz
import "./App.css";
import LoginPage from "./pages/Login";
import Navbar from "./components/nav/Navbar";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import Maintenance from "./pages/Maintenance";

// 1. DASHBOARD BİLEŞENİ (Harita stabilitesi için fonksiyon dışında tanımlı)
const Dashboard = ({ trains, selectedTrain, setSelectedTrain, selectedHistoryPos, setSelectedHistoryPos, handleLogout, memoizedMap }) => (
  <div className="app-container">
    

    <TrainList
      trains={trains}
      selectedTrain={selectedTrain}
      onSelect={(id) => {
        setSelectedTrain(id);
        setSelectedHistoryPos(null);
      }}
    />
    
    <div style={{ flex: 1, position: "relative" }}>
      <div className="map-wrapper" style={{ width: "100%", height: "100%" }}>
        {memoizedMap} 
      </div>

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

// 2. KORUMALI ROTA (Yetkisiz girişi engeller)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const [trains, setTrains] = useState({});
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedHistoryPos, setSelectedHistoryPos] = useState(null);
  const token = localStorage.getItem("token");
  // Kullanıcı bilgisini ve rolünü alıyoruz
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
  if (!token) return;

  // --- A. İLK VERİLERİ ÇEK (REST API) ---
  fetch("http://localhost:4000/api/trains", {
    headers: { "Authorization": `Bearer ${token}` }
  })
  .then(res => {
    if (!res.ok) throw new Error(`Sunucu Hatası: ${res.status}`);
    return res.json();
  })
  .then(data => {
    if (data && Array.isArray(data)) {
      const trainMap = {};
      data.forEach(t => {
        if (user?.role === "makinist") {
          if (t.trainId === user.trainId) trainMap[t.trainId] = t;
        } else {
          trainMap[t.trainId] = t;
        }
      });
      setTrains(trainMap);
    }
  })
  .catch(err => console.error("İlk yükleme hatası:", err));

  // --- B. CANLI VERİLERİ DİNLE (SOCKET.IO) ---
  // Backend'den 'telemetry_data' (veya senin belirlediğin isim) kanalını dinle
  socket.on("telemetry_data", (newTrainData) => {
    setTrains((prevTrains) => {
      // Eğer kullanıcı makinistse sadece kendi trenini güncelle
      if (user?.role === "makinist" && newTrainData.trainId !== user.trainId) {
        return prevTrains;
      }

      // Mevcut trenlerin üzerine yeni gelen veriyi yaz (Anlık hareket sağlar)
      return {
        ...prevTrains,
        [newTrainData.trainId]: {
          ...prevTrains[newTrainData.trainId], // Eski verileri koru (isim vb.)
          ...newTrainData // Yeni koordinat, hız ve sıcaklığı üzerine yaz
        }
      };
    });
  });

  // Bileşen kapandığında dinlemeyi durdur (Memory leak önlemek için)
  return () => {
    socket.off("telemetry_data");
  };
}, [token, user?.role, user?.trainId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // 3. HARİTA MEMOIZATION (Gereksiz titremeyi önler)
 // HARİTA VE LİSTE FİLTRESİ
  const memoizedMap = useMemo(() => {
    // trains objesini diziye çevirip MapComponent'e gönderiyoruz
    const trainList = Object.values(trains);

    return (
      <MapComponent 
        trains={trainList} 
        selectedTrain={trains[selectedTrain]} 
        historyPos={selectedHistoryPos} 
        onMarkerClick={(id) => {
          setSelectedTrain(id);
          setSelectedHistoryPos(null); 
        }} 
      />
    );
  }, [trains, selectedTrain, selectedHistoryPos]);

  
  // App.js içindeki return kısmını böyle düzelt:
  return (
    <Router>
      {/* Navbar her zaman Routes'un dışında durmalı ki her sayfada görünsün */}
      {token && <Navbar handleLogout={handleLogout} />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard 
              trains={trains}
              selectedTrain={selectedTrain}
              setSelectedTrain={setSelectedTrain}
              selectedHistoryPos={selectedHistoryPos}
              setSelectedHistoryPos={setSelectedHistoryPos}
              handleLogout={handleLogout}
              memoizedMap={memoizedMap}
            />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/maintenance" element={
          <ProtectedRoute>
            <Maintenance />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;