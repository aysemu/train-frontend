import { useState } from "react";
import { EyeIcon, EyeOffIcon, LockIcon, EmailIcon, UserIcon } from "./icons";
import { s } from "./styles";

// --- Ortak Input Bileşeni ---
export const FormField = ({ label, icon: Icon, ...props }) => (
  <>
    <label style={s.fieldLabel}>{label}</label>
    <div style={s.fieldWrap}>
      <span style={s.fieldIcon}><Icon /></span>
      <input {...props} style={s.input} />
    </div>
  </>
);

// --- Şifre Input Bileşeni ---
export const PasswordInput = ({ label, ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <label style={s.fieldLabel}>{label}</label>
      <div style={s.fieldWrap}>
        <span style={s.fieldIcon}><LockIcon /></span>
        <input 
          type={show ? "text" : "password"} 
          {...props} 
          style={s.input} 
        />
        <button style={s.eyeBtn} onClick={() => setShow(!show)} type="button">
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </>
  );
};