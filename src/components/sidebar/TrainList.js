import React from "react";
import "./TrainList.css";

function TrainList({ trains, selectedTrain, onSelect }) {
  const sortedTrainIds = Object.keys(trains).sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    // "train-list" sınıfını buraya ekledik, inline width: 200'ü sildik
    <div className="train-list">
      <h3 className="list-title">Trenler</h3>
      
      {sortedTrainIds.map((trainId) => (
        <div
          key={trainId}
          // "train-item" sınıfını ve seçiliyse "selected" sınıfını ekledik
          className={`train-item ${selectedTrain === trainId ? "selected" : ""}`}
          onClick={() => onSelect(trainId)}
        >
          <span className="train-status-dot"></span>
          {trainId}
        </div>
      ))}
      
      {sortedTrainIds.length === 0 && (
        <p className="loading-text">Tren verisi bekleniyor...</p>
      )}
    </div>
  );
}

export default TrainList;