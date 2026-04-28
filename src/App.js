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

// 1. DASHBOARD BİLEŞENİ (Harita stabilitesi için fonksiyon dışında tanımlı)
const Dashboard = ({ trains, selectedTrain, setSelectedTrain, selectedHistoryPos, setSelectedHistoryPos, handleLogout, memoizedMap }) => (
  <div className="app-container">
    <button onClick={handleLogout} className="logout-btn" style={{position: "absolute", top: 20, right: 20, zIndex: 1000}}>
      Çıkış Yap
    </button>

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

    // Başlangıç verilerini çek
    fetch("http://localhost:4000/api/trains", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      const trainMap = {};
      data.forEach(t => {
        // BAŞLANGIÇ VERİSİ FİLTRESİ: 
        // Makinistse sadece kendi trenini yükle, değilse hepsini.
        if (user?.role === "makinist") {
            if (t.trainId === user.trainId) trainMap[t.trainId] = t;
        } else {
            trainMap[t.trainId] = t;
        }
      });
      setTrains(trainMap);
    })
    .catch(err => console.error("Veri yüklenemedi:", err));

    // Canlı veri dinle
    socket.on("telemetry", (data) => {
      // SOCKET FİLTRESİ:
      // Makinistse ve gelen veri ona ait değilse state'i güncelleme.
      if (user?.role === "makinist" && data.trainId !== user.trainId) {
          return; 
      }
      setTrains(prev => ({ ...prev, [data.trainId]: data }));
    });

    return () => socket.off("telemetry");
  }, [token, user?.role, user?.trainId]); // user bilgilerini dependency'ye ekledik

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;