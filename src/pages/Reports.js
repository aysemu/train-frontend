import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Reports.css";

const Reports = () => {
  const [faults, setFaults] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const [newFault, setNewFault] = useState({
    trainId: user?.trainId || "",
    issue: "",
    description: "",
    severity: "Orta",
    reportedBy: { id: user?.id, name: user?.name, phone: user?.phone || "05xx" }
  });

  useEffect(() => {
    fetchFaults();
  }, []);

  const fetchFaults = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/faults/all`, {
        params: { role: user.role, trainId: user.trainId }
      });
      setFaults(res.data);
    } catch (err) { console.error("Hata:", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newFault._id) {
        await axios.put(`http://localhost:4000/api/faults/update-makinist/${newFault._id}`, newFault);
        alert("Kayıt güncellendi!");
      } else {
        await axios.post("http://localhost:4000/api/faults/create", newFault);
        alert("Arıza kaydı açıldı!");
      }
      setShowForm(false);
      fetchFaults();
    } catch (err) { alert("İşlem hatası."); }
  };

  const handleEngineerUpdate = async (id, comment) => {
    try {
      await axios.put(`http://localhost:4000/api/faults/update/${id}`, {
        engineerComment: comment
      });
    } catch (err) { console.error("Not kaydedilemedi", err); }
  };

  const closeFault = async (id) => {
  // 1. Veriyi kontrol etmek için konsola yazdır (F12 > Console'dan kontrol et)
  console.log("Kapatma İşlemini Yapan User Objesi:", user);

  try {
    // 2. resolvedBy objesini güvenli bir şekilde oluşturalım
    const resolverInfo = {
      id: user._id || user.id, // MongoDB'den geliyorsa _id, localStorage'da id ise id
      name: user.name || user.username || "İsimsiz Mühendis" // name yoksa username'i dene
    };

    console.log("Backend'e Gönderilen Bilgi:", resolverInfo);

    await axios.put(`http://localhost:4000/api/faults/update/${id}`, {
      status: "Çözüldü",
      resolvedBy: resolverInfo // İşte burası veritabanına mühürlenecek
    });

    alert("Arıza kaydı başarıyla kapatıldı.");
    fetchFaults(); // Listeyi yenile
  } catch (err) {
    console.error("Kapatma Hatası:", err);
    alert("Arıza kapatılamadı.");
  }
};

  const deleteFault = async (id) => {
    if (window.confirm("Bu arıza kaydını silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:4000/api/faults/delete/${id}`);
        fetchFaults();
      } catch (err) { alert("Silme hatası."); }
    }
  };

  const handleEditClick = (fault) => {
    setNewFault({ ...fault });
    setShowForm(true);
  };

  return (
    <div className="reports-container">
      {/* 1. ADMIN ÖZET PANELİ */}
      {user.role === 'admin' && (
        <div className="admin-stats">
          <div className="stat-card active">
            <h4>AKTİF TRENLER</h4>
            <p>12 / 15</p>
          </div>
          <div className="stat-card warning">
            <h4>BEKLEYEN ARIZALAR</h4>
            <p>{faults.filter(f => f.status !== 'Çözüldü').length}</p>
          </div>
          <div className="stat-card critical">
            <h4>KRİTİK DURUMLAR</h4>
            <p>{faults.filter(f => f.severity === 'Kritik').length}</p>
          </div>
        </div>
      )}

      <div className="reports-header">
        <h2>Arıza Takip ve Raporlama</h2>
        {user.role === "makinist" && (
          <button className="btn-add" onClick={() => {
            setShowForm(!showForm);
            if (!showForm) setNewFault({ issue: "", description: "", severity: "Orta", trainId: user.trainId, reportedBy: { id: user.id, name: user.name, phone: user.phone } });
          }}>
            {showForm ? "İptal" : "+ Yeni Arıza Kaydı"}
          </button>
        )}
      </div>

      {/* 2. ARIZA FORMU */}
      {showForm && (
        <form onSubmit={handleSubmit} className="fault-form animate-in">
          <h3>{newFault._id ? "Kaydı Düzenle" : "Yeni Arıza Bildir"}</h3>
          <input type="text" value={newFault.issue} placeholder="Arıza Başlığı..." onChange={e => setNewFault({ ...newFault, issue: e.target.value })} required />
          <textarea value={newFault.description} placeholder="Detaylı Açıklama..." onChange={e => setNewFault({ ...newFault, description: e.target.value })} />
          <select value={newFault.severity} onChange={e => setNewFault({ ...newFault, severity: e.target.value })}>
            <option value="Düşük">Düşük</option>
            <option value="Orta">Orta</option>
            <option value="Kritik">Kritik</option>
          </select>
          <button type="submit" className="btn-save">{newFault._id ? "Güncelle" : "Kaydı Oluştur"}</button>
        </form>
      )}

      <div className="fault-list">
        {faults.map(fault => (
          <div key={fault._id} className={`fault-card ${fault.severity}`}>
            <div className="card-top">
              <span className={`status-badge ${fault.status}`}>{fault.status}</span>
              <span className="fault-date">{new Date(fault.createdAt).toLocaleString()}</span>
            </div>

            <h3>{fault.trainId} - {fault.issue}</h3>
            <p className="fault-desc">{fault.description}</p>

            {/* 3. MÜHENDİS VE ADMIN İÇİN MAKİNİST BİLGİLERİ */}
            {(user.role === 'engineer' || user.role === 'admin') && (
              <div className="reporter-info">
                <p>👤 <b>Bildiren:</b> {fault.reportedBy?.name || "Bilinmiyor"}</p>
                <p>📞 <b>İletişim:</b> <a href={`tel:${fault.reportedBy?.phone}`} style={{color: '#38bdf8'}}>{fault.reportedBy?.phone || "05xx"}</a></p>
              </div>
            )}

            {/* 4. MAKİNİST AKSİYONLARI */}
            {user.role === "makinist" && fault.status === "Açık" && (
              <div className="makinist-actions">
                <button className="btn-edit" onClick={() => handleEditClick(fault)}>Düzenle</button>
                <button className="btn-delete" onClick={() => deleteFault(fault._id)}>Sil</button>
              </div>
            )}

            {/* 5. MÜHENDİS MÜDAHALE ALANI */}
            {user.role === 'engineer' && fault.status !== 'Çözüldü' && (
              <div className="engineer-actions">
                <textarea 
                  placeholder="Bakım açıklaması ve çözüm notu..."
                  defaultValue={fault.engineerComment}
                  onBlur={(e) => handleEngineerUpdate(fault._id, e.target.value)}
                />
                <button onClick={() => closeFault(fault._id)} className="btn-resolve">Bakımı Tamamla ve Kapat</button>
              </div>
            )}

            {/* 6. ADMIN VE GEÇMİŞ MÜDAHALE LOGLARI */}
            {(fault.engineerComment || fault.status === 'Çözüldü') && (
              <div className="admin-log">
                <p><b>Müdahale Notu:</b> {fault.engineerComment || "Not girilmedi."}</p>
                {fault.status === 'Çözüldü' && (
                  <p> <b>Müdahale Eden:</b> {fault.resolvedBy?.name || "Bilinmiyor"}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;