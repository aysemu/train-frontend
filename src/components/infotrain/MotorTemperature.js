import "./MotorTemperature.css";

const MotorTemperature = ({ temperature }) => {
  const maxTemp = 200; // Maksimum motor sıcaklığı

  // 1. CSS yüksekliği için yüzde hesapla (Sayı olarak kalsın)
  const fillPercentage = Math.min(((temperature || 0) / maxTemp) * 100, 100);

  // 2. Ekranda görünecek metni formatla (2 hane sabit)
  // temperature varsa formatla, yoksa 0.00 göster
  const formattedTemp = typeof temperature === 'number' 
    ? temperature.toFixed(2) 
    : "0.00";

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
            height: `${fillPercentage}%`, // CSS için ham yüzdeyi kullanıyoruz
            background: getColor()
          }}
        ></div>
      </div>

      <div className="temp-value">
        {formattedTemp} °C {/* İşte burası virgülden sonra 2 hane gösterir */}
      </div>
    </div>
  );
};

export default MotorTemperature;