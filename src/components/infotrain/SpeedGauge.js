import React from "react";
import GaugeComponent from "react-gauge-component";

function SpeedGauge({ speed }) {
  return (
    <div style={{ width: 200, height: 200 }}>
      <GaugeComponent
        value={speed}
        minValue={0}
        maxValue={200}
        arc={{
          subArcs: [
            { limit: 80, color: "#4caf50" },
            { limit: 140, color: "#ff9800" },
            { limit: 200, color: "#f44336" }
          ]
        }}
        labels={{
          valueLabel: {
            formatTextValue: value => value + " km/h",
            style: {
                fill: "#d22121",   // 
                fontSize: "40px",
                fontWeight: "bold"
            }
          }
        }}
      />
    </div>
  );
}

export default SpeedGauge;
