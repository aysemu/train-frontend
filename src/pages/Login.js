import React, { useState } from "react";
import "../components/auth/auth.css";
import { LoginForm } from "../components/auth/LoginForm";
import { SignupForm } from "../components/auth/SignupForm";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-scene">
            {/* SOL TARAF: Görsel ve Başlık */}
            <div className="auth-visual-side">
                <div className="visual-content">
                    <h1>E5000</h1>
                    <p>Milli Elektrikli Lokomotif Sistemleri <br/> Canlı Telemetri Takip Platformu</p>
                </div>
            </div>

            {/* SAĞ TARAF: Form */}
            <div className="auth-form-side">
                <div className="auth-card">
                    {/*<div className="auth-tab-bar">
                        <button className={`tab-btn ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>Giriş</button>
                        <button className={`tab-btn ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>Kayıt</button>
                    </div> */}
                    {isLogin ? <LoginForm onSwitch={() => setIsLogin(false)} /> : <SignupForm onSwitch={() => setIsLogin(true)} />}
                </div>
            </div>
        </div>
    );
}