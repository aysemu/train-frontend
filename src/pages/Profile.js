// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    trainId: "",
    createdAt: "",
    phone: "",
    tcNo: "",
    address: "",
    bloodGroup: "",
    disabilityStatus: "Yok",
    role: ""
  });

  useEffect(() => {
    // Mevcut kullanıcıyı çek (Bunu backend'de bir /api/auth/me rotasıyla yaparsan daha güvenli olur)
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(prev => ({ ...prev, ...savedUser }));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:4000/api/auth/update-profile`, user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Bilgileriniz güncellendi!");
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      alert("Güncelleme hatası.");
    }
  };
  // Çalışma süresini hesaplayan fonksiyon
  const calculateWorkDuration = (startDate) => {
    if (!startDate) return "Yeni Başladı";
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} gündür çalışıyor`;
    const months = Math.floor(diffDays / 30);
    return `${months} aydır çalışıyor`;
  };

  return (
    <div className="profile-container">
      <h2>Profil Bilgileri</h2>
      
      {/* ÜST KISIM: AVATAR VE ÖZET BİLGİ */}
      <div className="profile-header">
        <div className="avatar-circle">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="profile-summary">
          <h2>{user.name}</h2>
          <span className="badge-role">{user.role ? user.role.toUpperCase() : "ROL YOK"}</span>
          <p className="work-duration">⏱ {calculateWorkDuration(user.createdAt)}</p>
        </div>
      </div>

      {/* TREN BİLGİSİ (SADECE MAKİNİSTSE) */}
      <div className="profile-info-grid">
        {user.role === "makinist" && (
          <div className="info-card highlight">
            <label>Atandığı Tren</label>
            <h3>{user.trainId || "Atama Bekliyor"}</h3>
          </div>
        )}
      </div> {/* <-- BU DIV EKSİKTİ, KAPATILMALI */}

      <form onSubmit={handleUpdate} className="profile-grid">
        <div className="profile-field">
          <label>Ad Soyad</label>
          <input type="text" value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
        </div>

        <div className="profile-field">
          <label>T.C. Kimlik No</label>
          <input type="text" maxLength="11" value={user.tcNo} onChange={e => setUser({...user, tcNo: e.target.value})} />
        </div>

        <div className="profile-field">
          <label>E-posta</label>
          <input type="email" value={user.email} disabled /> {/* Email genellikle değiştirilmez, disabled yaptık */}
        </div>

        <div className="profile-field">
          <label>Kan Grubu</label>
          <select value={user.bloodGroup} onChange={e => setUser({...user, bloodGroup: e.target.value})}>
            <option value="">Seçiniz</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div className="profile-field" style={{gridColumn: "span 2"}}>
          <label>Adres</label>
          <textarea rows="3" value={user.address} onChange={e => setUser({...user, address: e.target.value})} 
            style={{background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '10px'}} />
        </div>

        <div className="profile-field">
          <label>Engel Durumu</label>
          <input type="text" value={user.disabilityStatus} onChange={e => setUser({...user, disabilityStatus: e.target.value})} />
        </div>

        <button type="submit" className="btn-primary" style={{gridColumn: "span 2", marginTop: '20px'}}>Bilgileri Güncelle</button>
      </form>
    </div>
  );
};

export default Profile;