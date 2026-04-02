
import "./MotorTemperature.css";

const MotorTemperature = ({ temperature }) => {
  const maxTemp = 200;   // maksimum motor sıcaklığı
  const percentage = Math.min((temperature / maxTemp) * 100, 100);

  const getColor = () => {
    if (temperature < 60) return "#4caf50";
    if (temperature < 90) return "#ff9800";
    return "#f44336";
  }; 

  return (
    <div className="temp-container">
      <div className="thermometer">
        <div
          className="thermometer-fill"
          style={{
            height: `${percentage}%`,
            background: getColor()
          }}
        ></div>
      </div>

      <div className="temp-value">
        {temperature} °C
      </div>
    </div>
  );
};

export default MotorTemperature;
