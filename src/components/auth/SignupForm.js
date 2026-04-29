import React, { useState } from "react";
import axios from "axios";
import { FormField } from "./inputs";
import { EmailIcon, UserIcon, LockIcon } from "./icons"; // PhoneIcon varsa ekleyebilirsin

// src/components/SignupForm.js

export const SignupForm = ({ onSwitch }) => {
    const [data, setData] = useState({ 
        name: "", 
        email: "", 
        password: "", 
        phone: "", 
        tcNo: "", // TC Kimlik alanı eklendi
        role: "engineer",
        assignedTrain: "" // Bunu da boş string olarak başlatalım
    });

    const availableTrains = Array.from({ length: 21 }, (_, i) => `E50${i < 10 ? '0' + i : i}`);

    const handleSignup = async (e) => {
        e.preventDefault();
        // Basit bir TC uzunluk kontrolü
        if (data.tcNo.length !== 11) {
            return alert("T.C. Kimlik numarası 11 haneli olmalıdır.");
        }
        try {
            await axios.post("http://localhost:4000/api/auth/register", data);
            alert("Kayıt başarılı! Giriş yapabilirsiniz.");
            onSwitch(); 
        } catch (err) { 
            alert(err.response?.data?.message || "Kayıt yapılamadı."); 
        }
    };

    return (
        <form onSubmit={handleSignup} className="auth-form">
            <h2 className="form-title" style={{color:'#fff'}}>Hesap Oluştur</h2>

            {/* ROL SEÇİCİ KISMI AYNI KALIYOR */}
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

            {/* TC KİMLİK NUMARASI ALANI */}
            <FormField 
                label="T.C. Kimlik Numarası" 
                icon={UserIcon} 
                type="text"
                maxLength="11"
                required 
                placeholder="11 Haneli TC Kimlik No"
                onChange={e => setData({ ...data, tcNo: e.target.value })} 
            />

            {/* AD SOYAD VE DİĞERLERİ AYNI KALIYOR... */}
            <FormField 
                label="Ad Soyad" 
                icon={UserIcon} 
                required 
                placeholder="Örn: Ayşen Yılmaz"
                onChange={e => setData({ ...data, name: e.target.value })} 
            />

            {/* MAKİNİSTSE TREN SEÇİMİ */}
            {data.role === "makinist" && (
                <div className="field-group" style={{ marginBottom: "15px" }}>
                    <label className="field-label">Atanacak Lokomotif</label>
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

            {/* E-POSTA, TELEFON VE ŞİFRE... */}
            <FormField 
                label="E-posta" 
                icon={EmailIcon} 
                type="email" 
                required 
                onChange={e => setData({ ...data, email: e.target.value })} 
            />

            <FormField 
                label="Telefon Numarası" 
                icon={UserIcon}
                type="tel" 
                placeholder="05xx xxx xx xx"
                required={data.role === "makinist"} 
                onChange={e => setData({ ...data, phone: e.target.value })} 
            />

            <FormField 
                label="Şifre" 
                icon={LockIcon} 
                type="password" 
                required 
                onChange={e => setData({ ...data, password: e.target.value })} 
            />

            <button className="btn-primary" type="submit" style={{ marginTop: "10px" }}>
                 KAYIT OL
            </button>
            {/* ... FOOTER AYNI ... */}
        </form>
    );
};