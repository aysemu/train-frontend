// src/pages/Maintenance.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Maintenance.css";

const Maintenance = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [formData, setFormData] = useState({
    trainId: "",
    title: "",
    description: "",
    plannedDate: "",
    priority: "Normal"
  });
  const [completingId, setCompletingId] = useState(null); // Hangi kartın formu açık?
  const [completionDesc, setCompletionDesc] = useState(""); // Formdaki açıklama
  const [editingId, setEditingId] = useState(null); // Hangi kart düzenleniyor?
  const [editData, setEditData] = useState({ title: "", plannedDate: "" }); // Düzenleme verileri
  const [commentText, setCommentText] = useState("");

  // Bakım listesini getir
  const fetchMaintenances = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/maintenance");
      setMaintenances(res.data);
    } catch (err) {
      console.error("Bakım verileri çekilemedi");
    }
  };

  useEffect(() => { fetchMaintenances(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Gönderilen Veri:", formData); // Gönderilen veriyi kontrol et
      const res = await axios.post("http://localhost:4000/api/maintenance/add", {
        ...formData,
        createdBy: user.name
      });
      alert("Bakım planı başarıyla oluşturuldu!");
      fetchMaintenances();
    } catch (err) {
      // HATAYI BURADA DETAYLI GÖRÜN:
      console.error("Hata Detayı:", err.response?.data || err.message);
      alert("Planlama hatası: " + (err.response?.data?.message || "Sunucuya ulaşılamadı"));
    }
  };
  const handleCompleteSubmit = async (id) => {
    if (!completionDesc.trim()) {
      alert("Lütfen bir açıklama giriniz."); 
      return;
    }
    console.log("İşlem Yapılan Kayıt ID:", id); // Konsola bakıp undefined mı görcem
    try {
      await axios.put(`http://localhost:4000/api/maintenance/complete/${id}`, { 
        description: completionDesc 
      });
      setCompletingId(null); // Formu kapat
      setCompletionDesc(""); // State'i temizle
      fetchMaintenances();
    } catch (err) {
      console.error("Tamamlama Hatası:", err.response?.data || err.message);
      alert("İşlem başarısız: " + (err.response?.data?.message || "Sunucu hatası"));
    }
  };

const handleDelete = async (id) => {
  if (!window.confirm("Bu bakım planını silmek istediğinize emin misiniz?")) return;
  
  try {
    await axios.delete(`http://localhost:4000/api/maintenance/${id}`);
    fetchMaintenances();
  } catch (err) {
    alert("Silme hatası.");
  }
};

// Düzenle butonuna tıklandığında mevcut verileri yükle
const handleEditClick = (m) => {
  setEditingId(m._id);
  setEditData({
    title: m.title,
    plannedDate: m.plannedDate.split('T')[0] // Tarihi input (date) formatına uygun hale getir
  });
};

// Güncelleme isteğini gönder
const handleEditSubmit = async (id) => {
  try {
    const res = await axios.put(`http://localhost:4000/api/maintenance/update/${id}`, editData);
    if (res.status === 200) {
      setEditingId(null);
      fetchMaintenances(); // Listeyi yenile
    }
  } catch (err) {
    console.error("Güncelleme Hatası:", err);
    alert("Güncelleme yapılamadı.");
  }
};

//açılan bakım planı için userların yorumlaşabilmesi için
const handleCommentSubmit = async (id) => {
  if (!commentText.trim()) return;
  try {
    await axios.post(`http://localhost:4000/api/maintenance/${id}/comment`, {
      text: commentText,
      user: user.name,
      role: user.role
    });
    setCommentText("");
    fetchMaintenances(); // Listeyi yenileyerek yorumu göster
  } catch (err) {
    alert("Yorum gönderilemedi.");
  }
};

  return (
  <div className="maintenance-container">
    <header className="page-header">
      <h2>Bakım Planlama ve Takip</h2>
      <p>Lokomotiflerin periyodik kontrol süreçlerini buradan yönetebilirsiniz.</p>
    </header>

    <div className="maintenance-content">
      {/* SADECE MÜHENDİS VE ADMİN FORM GÖREBİLİR */}
      {(user.role === "admin" || user.role === "engineer") && (
        <section className="plan-section">
          <div className="auth-form" style={{ maxWidth: "400px" }}>
            <h3 style={{ color: "#64b5f6", marginBottom: "15px" }}>Yeni Bakım Planla</h3>
            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">Lokomotif (E5000 Serisi)</label>
                <select 
                  className="auth-input-select" required
                  value={formData.trainId} 
                  onChange={e => setFormData({...formData, trainId: e.target.value})}
                >
                  <option value="">Seçiniz...</option>
                  {Array.from({ length: 21 }, (_, i) => `E50${i < 10 ? '0' + i : i}`).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Bakım Başlığı</label>
                <input 
                  type="text" className="auth-input" placeholder="Örn: Yıllık Fren Bakımı"
                  required value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="field-group">
                <label className="field-label">Planlanan Tarih</label>
                <input 
                  type="date" className="auth-input" required 
                  style={{ colorScheme: 'dark' }}
                  value={formData.plannedDate}
                  onChange={e => setFormData({...formData, plannedDate: e.target.value})}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: "15px" }}>
                SİSTEME KAYDET
              </button>
            </form>
          </div>
        </section>
      )}

      {/* LİSTE HERKESE GÖRÜNÜR */}
      <section className="list-section">
        <h3 style={{ color: "#64b5f6", marginBottom: "15px" }}>Bakım Takvimi</h3>
        <div className="maintenance-grid">
          {maintenances
            // --- FİLTRELEME BURADA BAŞLIYOR ---
            .filter(m => {
              if (user?.role === "makinist") {
                return m.trainId === user.trainId; // Makinistse sadece kendi trenini görsün
              }
              return true; // Admin/Engineer ise her şeyi görsün
            })
            // ---------------------------------
            .map(m => (
              <div key={m._id} className={`m-card ${m.status === 'Beklemede' && new Date(m.plannedDate) < new Date() ? 'expired' : ''}`}>
                <div className="m-badge">{m.trainId}</div>
                <h4>{m.title}</h4>
                <p>📅 {new Date(m.plannedDate).toLocaleDateString('tr-TR')}</p>

                {/* Eğer bakım tamamlanmışsa notu göster */}
                {m.status === "Tamamlandı" && m.description && (
                  <div className="m-completed-note">📝 Kapatma Notu: {m.description}</div>
                )}

                <div className={`m-status ${m.status.toLowerCase()}`}>{m.status}</div>

                {/* AKSİYON ALANI */}
                <div className="m-actions">
                  {/* DÜZENLE BUTONU (Mühendis ve Admin her durumda görebilir) */}
                  {(user.role === "admin" || user.role === "engineer") && editingId !== m._id && (
                    <button onClick={() => handleEditClick(m)} className="btn-edit">
                      {m.status === "Tamamlandı" ? "Düzenle / Tekrar Aç" : "Düzenle"}
                    </button>
                  )}

                  {/* Bakımı Kapat Butonu (Sadece beklemedeki bakımlar için) */}
                  {m.status === "Beklemede" && completingId !== m._id && editingId !== m._id && (
                    <button onClick={() => setCompletingId(m._id)} className="btn-complete">Bakımı Kapat</button>
                  )}

                  {/* Sil Butonu (Sadece Admin ve Engineer için) */}
                  {(user.role === "admin" || user.role === "engineer") && editingId !== m._id && completingId !== m._id && (
                    <button onClick={() => handleDelete(m._id)} className="btn-delete">Sil</button>
                  )}
                </div>

                {/* DÜZENLEME FORMU */}
                {editingId === m._id && (
                  <div className="edit-form-inline">
                    <label className="field-label">Başlığı Güncelle</label>
                    <input 
                      type="text" className="auth-input"
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      style={{ marginBottom: '10px' }}
                    />
                    <label className="field-label">Tarihi Güncelle</label>
                    <input 
                      type="date" className="auth-input"
                      style={{ colorScheme: 'dark', marginBottom: '10px' }}
                      value={editData.plannedDate}
                      onChange={(e) => setEditData({...editData, plannedDate: e.target.value})}
                    />
                    <div className="form-buttons">
                      <button onClick={() => handleEditSubmit(m._id)} className="btn-save">Güncelle</button>
                      <button onClick={() => setEditingId(null)} className="btn-cancel">Vazgeç</button>
                    </div>
                  </div>
                )}

                {/* AÇIKLAMA (KAPATMA) FORMU */}
                {completingId === m._id && (
                  <div className="completion-form">
                    <textarea 
                      placeholder="Yapılan işlemler hakkında kısa bilgi verin..."
                      value={completionDesc}
                      onChange={(e) => setCompletionDesc(e.target.value)}
                      className="completion-textarea"
                    />
                    <div className="form-buttons">
                      <button onClick={() => handleCompleteSubmit(m._id)} className="btn-save">Kaydet ve Kapat</button>
                      <button onClick={() => {setCompletingId(null); setCompletionDesc("");}} className="btn-cancel">Vazgeç</button>
                    </div>
                  </div>
                )}

                {/* YORUM / SOHBET ALANI */}
                <div className="comment-section">
                  <h5 className="comment-title">💬 İletişim & Notlar</h5>
                  <div className="comment-list">
                    {m.comments?.length > 0 ? (
                      m.comments.map((c, index) => (
                        <div key={index} className={`comment-bubble ${c.role}`}>
                          <strong>{c.user} ({c.role}):</strong> {c.text}
                          <span className="comment-date">{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      ))
                    ) : (
                      <p style={{fontSize: '11px', color: '#64748b', textAlign: 'center'}}>Henüz yorum yapılmamış.</p>
                    )}
                  </div>
                  
                  <div className="comment-input-group">
                    <input 
                      type="text" 
                      placeholder="Bir mesaj yazın..." 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(m._id)}
                    />
                    <button onClick={() => handleCommentSubmit(m._id)}>Gönder</button>
                  </div>
                </div>

              </div>
            ))
          }

          {/* Makinistin hiç bakımı yoksa kullanıcıya bilgi verelim */}
          {user?.role === "makinist" && 
          maintenances.filter(m => m.trainId === user.trainId).length === 0 && (
            <p style={{ color: "#94a3b8", gridColumn: "1/-1", textAlign: "center", marginTop: "20px" }}>
              Treninize ait planlanmış bir bakım bulunmamaktadır.
            </p>
          )}
        </div>
      </section>
    </div>
  </div>
);
};

export default Maintenance;