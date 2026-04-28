import React, { useState } from "react";
import axios from "axios";
import { FormField } from "./inputs";
import { EmailIcon, UserIcon, LockIcon } from "./icons"; // PhoneIcon varsa ekleyebilirsin

export const SignupForm = ({ onSwitch }) => {
    // State'e role ve phone alanlarını ekledik
    const [data, setData] = useState({ 
        name: "", 
        email: "", 
        password: "", 
        phone: "", 
        role: "engineer" // Varsayılan rol
    });
// E5000'den E5020'ye kadar otomatik liste oluşturur
const availableTrains = Array.from({ length: 21 }, (_, i) => `E50${i < 10 ? '0' + i : i}`);
// Sonuç: ["E5000", "E5001", ..., "E5020"]
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/api/auth/register", data);
            alert("Kayıt başarılı! Giriş yapabilirsiniz.");
            onSwitch(); // Başarılıysa giriş ekranına yönlendir
        } catch (err) { 
            alert(err.response?.data?.message || "Kayıt yapılamadı."); 
        }
    };

    return (
        <form onSubmit={handleSignup} className="auth-form">
            <h2 className="form-title" style={{color:'#fff'}}>Hesap Oluştur</h2>

            {/* ROL SEÇİCİ - Giriş ekranıyla aynı tasarım */}
            <div className="role-selector-wrapper">
                <label className="field-label" style={{color:'#64b5f6'}}>Sistem Yetkisi</label>
                <div className="role-selector">
                    {["admin", "engineer", "makinist"].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setData({ ...data, role: r })}
                            className={`role-btn ${data.role === r ? "active" : ""}`}
                        >
                            {r.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
            {data.role === "makinist" && (
                <div className="field-group" style={{ marginBottom: "15px" }}>
                    <label className="field-label">Atanacak Lokomotif (E5000 Serisi)</label>
                    <select 
                        className="auth-input-select"
                        required
                        value={data.assignedTrain}
                        onChange={e => setData({...data, assignedTrain: e.target.value})}
                    >
                        <option value="">Lokomotif Seçiniz...</option>
                        {availableTrains.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            )}

            <FormField 
                label="Ad Soyad" 
                icon={UserIcon} 
                required 
                placeholder="Örn: Ayşen Yılmaz"
                onChange={e => setData({ ...data, name: e.target.value })} 
            />

            <FormField 
                label="E-posta" 
                icon={EmailIcon} 
                type="email" 
                required 
                placeholder="ornek@sirket.com"
                onChange={e => setData({ ...data, email: e.target.value })} 
            />

            {/* TELEFON NUMARASI EKLEMESİ */}
            <FormField 
                label="Telefon Numarası" 
                icon={UserIcon} // Varsa PhoneIcon
                type="tel" 
                placeholder="05xx xxx xx xx"
                required={data.role === "makinist"} // Makinistse zorunlu yapalım
                onChange={e => setData({ ...data, phone: e.target.value })} 
            />

            <FormField 
                label="Şifre" 
                icon={LockIcon} 
                type="password" 
                required 
                placeholder="••••••••"
                onChange={e => setData({ ...data, password: e.target.value })} 
            />

            <button className="btn-primary" type="submit" style={{ marginTop: "10px" }}>
                 KAYIT OL
            </button>

            <p className="auth-footer">
                Zaten üye misin?{" "}
                <span className="switch-auth-text" onClick={onSwitch}>
                    Giriş Yap
                </span>
            </p>
        </form>
    );
};