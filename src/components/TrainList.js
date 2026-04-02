import React from "react";

function TrainList({ trains, selectedTrain, onSelect }) {
  // 1. Önce tren ID'lerini bir diziye alıyoruz
  // 2. .sort() ile bu ID'leri alfabetik olarak sıralıyoruz
  const sortedTrainIds = Object.keys(trains).sort((a, b) => {
    // localeCompare, metinleri (E5001, E5014 vb.) doğru bir şekilde kıyaslar
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    <div style={{ width: 200, borderRight: "1px solid gray", padding: 10, height: "100vh", overflowY: "auto" }}>
      <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>Trenler</h3>
      
      {sortedTrainIds.map((trainId) => (
        <div
          key={trainId}
          style={{
            padding: "5px 8px",
            margin: "4px 0",
            cursor: "pointer",
            borderRadius: "4px",
            fontSize:"20px",
            transition: "background 0.2s",
            background: selectedTrain === trainId ? "#3b82f6" : "transparent",
            color: selectedTrain === trainId ? "white" : "grey",
            fontWeight: selectedTrain === trainId ? "bold" : "normal",
            border: "10px solid transparent"
          }}
          onMouseEnter={(e) => { if(selectedTrain !== trainId) e.target.style.background = "#f1f5f9" }}
          onMouseLeave={(e) => { if(selectedTrain !== trainId) e.target.style.background = "transparent" }}
          onClick={() => onSelect(trainId)}
        >
          {trainId}
        </div>
      ))}
      
      {sortedTrainIds.length === 0 && (
        <p style={{ fontSize: "12px", color: "gray" }}>Tren verisi bekleniyor...</p>
      )}
    </div>
  );
}

export default TrainList;