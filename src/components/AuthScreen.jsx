import { useState } from "react";
import { glassStyle, inputStyle, btnPrimary } from "../styles";
import { LS_USER } from "../constants";
import { saveUser } from "../utils/storage";

export function AuthScreen({ onLogin }) {
  const [mode, setMode]         = useState("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    const userData = { email, name: name || email.split("@")[0] };
    saveUser(userData);
    onLogin(userData);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 40%, #0a0f1a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Geist Sans', 'Inter', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position:"absolute", top:"10%", left:"15%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"15%", right:"10%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div style={{ ...glassStyle, padding:"48px 40px", width:"100%", maxWidth:420, position:"relative", zIndex:1, margin:"0 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg, #4f46e5, #7c3aed)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:18 }}>🔐</span>
          </div>
          <span style={{ color:"#f0f0f0", fontSize:18, fontWeight:600, letterSpacing:"-0.02em" }}>VaultGen</span>
        </div>

        <h1 style={{ color:"#f0f0f0", fontSize:26, fontWeight:700, margin:"0 0 6px", letterSpacing:"-0.03em" }}>
          {mode === "login" ? "Bienvenue" : "Créer un compte"}
        </h1>
        <p style={{ color:"#888", fontSize:14, margin:"0 0 32px" }}>
          {mode === "login" ? "Connectez-vous pour gérer vos comptes" : "Commencez à gérer vos identifiants"}
        </p>

        {error && (
          <div style={{ background:"rgba(226,75,74,0.15)", border:"1px solid rgba(226,75,74,0.3)", borderRadius:8, padding:"10px 14px", color:"#f09595", fontSize:13, marginBottom:16 }}>
            {error}
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {mode === "signup" && (
            <div>
              <label style={{ color:"#aaa", fontSize:13, marginBottom:6, display:"block" }}>Nom complet</label>
              <input style={inputStyle} placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div>
            <label style={{ color:"#aaa", fontSize:13, marginBottom:6, display:"block" }}>Email</label>
            <input style={inputStyle} type="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ color:"#aaa", fontSize:13, marginBottom:6, display:"block" }}>Mot de passe</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <button
          style={{ ...btnPrimary, width:"100%", marginTop:24, opacity:loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <span style={{ display:"inline-block", width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
              Connexion…
            </span>
          ) : mode === "login" ? "Se connecter" : "Créer un compte"}
        </button>

        <p style={{ color:"#666", fontSize:13, textAlign:"center", marginTop:20 }}>
          {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <span
            style={{ color:"#7c6fff", cursor:"pointer" }}
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
          >
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </span>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
