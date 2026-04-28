// src/components/auth/LoginForm.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FormField, PasswordInput } from "./inputs";
import { EmailIcon, LockIcon, UserIcon } from "./icons";

export const LoginForm = ({ onSwitch }) => {
    const [role, setRole] = useState("engineer");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    // Makinist için seçilen treni tutacak state
    const [assignedTrain, setAssignedTrain] = useState("");
    
    const navigate = useNavigate();

    // E5000'den E5020'ye kadar dinamik liste
    const availableTrains = Array.from({ length: 21 }, (_, i) => `E50${i < 10 ? '0' + i : i}`);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:4000/api/auth/login", { 
                identifier, 
                password, 
                role,
                assignedTrain // Makinistse bu bilgi de gitsin
            });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/");
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || "Giriş başarısız.");
        }
    };

    return (
        <form onSubmit={handleLogin} className="auth-form">
            <h2 className="form-title">Sisteme Giriş</h2>
            
            {/* ROL SEÇİCİ */}
            <div className="role-selector-wrapper">
                <label className="field-label">Giriş Yetkisi Seçin</label>
                <div className="role-selector">
                    {["admin", "engineer", "makinist"].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => { setRole(r); setIdentifier(""); }}
                            className={`role-btn ${role === r ? "active" : ""}`}
                        >
                            {r.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* TREN SEÇİMİ (Sadece makinist seçiliyse görünür) */}
            {role === "makinist" && (
                <div className="field-group" style={{ marginBottom: "20px" }}>
                    <label className="field-label">Görevli Olduğunuz Tren</label>
                    <select 
                        className="auth-input-select"
                        required
                        value={assignedTrain}
                        onChange={e => setAssignedTrain(e.target.value)}
                    >
                        <option value="">Tren Seçin...</option>
                        {availableTrains.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            )}

            <FormField 
                label={role === "makinist" ? "Telefon Numarası" : "E-posta Adresi"} 
                icon={role === "makinist" ? UserIcon : EmailIcon}
                type={role === "makinist" ? "tel" : "email"}
                value={identifier}
                onChange={e => setIdentifier(e.target.value)} 
                required 
            />

            <PasswordInput 
                label="Şifre" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
            />

            <div className="form-options">
                <span 
                    className="forgot-password-text" 
                    onClick={() => alert("Şifre sıfırlama servisine yönlendiriliyorsunuz...")}
                >
                    Şifremi Unuttum
                </span>
            </div>

            <button className="btn-primary" type="submit">
                {role.toUpperCase()} GİRİŞİ
            </button>
            
            <p className="auth-footer">
                Hesabın yok mu?{" "}
                <span className="switch-auth-text" onClick={onSwitch}>
                    Kayıt Ol
                </span>
            </p>
        </form>
    );
};