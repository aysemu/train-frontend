export const s = {
  scene: {
    minHeight: "100vh",
    background: "linear-gradient(160deg,#060f1e 0%,#0b2040 35%,#0d3060 65%,#071828 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "32px 16px", position: "relative",
    fontFamily: "system-ui,-apple-system,sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.09)",
    backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "20px", padding: "32px 38px 30px",
    width: "100%", maxWidth: "420px", position: "relative", zIndex: 1,
  },
  logoWrap: { display: "flex", justifyContent: "center", marginBottom: "22px" },
  logoCircle: {
    width: "64px", height: "64px", borderRadius: "50%",
    background: "linear-gradient(135deg,#2196f3,#0d6ecc)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 20px rgba(33,150,243,0.45)",
  },
  tabBar: {
    display: "flex", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px", padding: "4px", marginBottom: "26px", gap: "4px",
  },
  heading: { textAlign: "center", fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "5px" },
  subtitle: { textAlign: "center", fontSize: "13px", color: "rgba(190,215,255,0.65)", marginBottom: "24px" },
  fieldLabel: { display: "block", fontSize: "12px", fontWeight: 600, color: "rgba(210,230,255,0.8)", marginBottom: "6px" },
  fieldWrap: { position: "relative", marginBottom: "15px" },
  fieldIcon: { position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex", alignItems: "center" },
  input: {
    width: "100%", background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)", borderRadius: "10px",
    padding: "11px 42px", fontSize: "14px", color: "rgba(255,255,255,0.9)",
    outline: "none", boxSizing: "border-box",
  },
  eyeBtn: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(190,215,255,0.45)", display: "flex", alignItems: "center", padding: 0 },
  rowBetween: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" },
  rememberLabel: { display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "rgba(190,215,255,0.75)", cursor: "pointer" },
  forgotBtn: { fontSize: "13px", color: "#42a5f5", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 },
  btnPrimary: {
    width: "100%", background: "linear-gradient(90deg,#1565c0,#42a5f5)",
    border: "none", borderRadius: "10px", padding: "13px",
    color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer",
    marginBottom: "18px", boxShadow: "0 4px 18px rgba(33,150,243,0.4)",
  },
  footText: { textAlign: "center", fontSize: "13px", color: "rgba(190,215,255,0.6)", margin: 0 },
  footLink: { color: "#42a5f5", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: "13px", padding: 0 },
  termsRow: { display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "18px", fontSize: "13px", color: "rgba(190,215,255,0.75)" },
  termsLink: { color: "#42a5f5", textDecoration: "underline", cursor: "pointer", background: "none", border: "none", fontSize: "13px", padding: 0 },
  helpBtn: {
    position: "fixed", bottom: "20px", right: "20px",
    width: "36px", height: "36px", borderRadius: "50%",
    background: "rgba(20,45,80,0.8)", border: "1px solid rgba(255,255,255,0.2)",
    color: "rgba(190,215,255,0.7)", fontSize: "15px", fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10,
  },
};

export function getTabStyle(active) {
  return {
    flex: 1, padding: "9px 0", borderRadius: "9px", border: "none",
    fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
    background: active ? "linear-gradient(135deg,#1976d2,#2196f3)" : "transparent",
    color: active ? "#fff" : "rgba(190,215,255,0.5)",
    boxShadow: active ? "0 2px 12px rgba(33,150,243,0.35)" : "none",
  };
}