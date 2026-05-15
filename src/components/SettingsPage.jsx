import { useState } from "react";
import { glassStyle, inputStyle, btnPrimary, btnGhost } from "../styles";

export function SettingsPage({ user, toast }) {
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    await new Promise((r) => setTimeout(r, 600));
    setSavingProfile(false);
    toast("Profil enregistré ✓", "success");
  };

  return (
    <div style={{ maxWidth:540 }}>
      <h1 style={{ color:"#f0f0f0", fontSize:28, fontWeight:700, letterSpacing:"-0.03em", margin:"0 0 8px" }}>
        Paramètres
      </h1>
      <p style={{ color:"#777", fontSize:15, margin:"0 0 36px" }}>Gérez vos préférences.</p>

      {/* Keyboard shortcuts hint */}
      <div style={{ ...glassStyle, padding:"16px 24px", marginBottom:20, display:"flex", alignItems:"center", gap:12, background:"rgba(79,70,229,0.08)", borderColor:"rgba(79,70,229,0.2)" }}>
        <span style={{ fontSize:20 }}>⌨</span>
        <div>
          <p style={{ color:"#a5b4fc", fontSize:13, fontWeight:600, margin:"0 0 2px" }}>Raccourcis clavier</p>
          <p style={{ color:"#666", fontSize:12, margin:0 }}>
            <kbd style={{ background:"rgba(255,255,255,0.08)", borderRadius:4, padding:"1px 6px", fontSize:11 }}>G</kbd> Générer &nbsp;
            <kbd style={{ background:"rgba(255,255,255,0.08)", borderRadius:4, padding:"1px 6px", fontSize:11 }}>A</kbd> Comptes &nbsp;
            <kbd style={{ background:"rgba(255,255,255,0.08)", borderRadius:4, padding:"1px 6px", fontSize:11 }}>S</kbd> Paramètres &nbsp;
            <kbd style={{ background:"rgba(255,255,255,0.08)", borderRadius:4, padding:"1px 6px", fontSize:11 }}>Ctrl+K</kbd> Rechercher
          </p>
        </div>
      </div>

      <div style={{ ...glassStyle, padding:28, marginBottom:20 }}>
        <h2 style={{ color:"#e0e0e0", fontSize:15, fontWeight:600, margin:"0 0 20px" }}>Profil</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={{ color:"#aaa", fontSize:13, marginBottom:6, display:"block" }}>Nom affiché</label>
            <input style={inputStyle} defaultValue={user?.name} />
          </div>
          <div>
            <label style={{ color:"#aaa", fontSize:13, marginBottom:6, display:"block" }}>Email</label>
            <input style={{ ...inputStyle, opacity:0.6 }} value={user?.email || ""} disabled onChange={() => {}} />
          </div>
        </div>
        <button style={{ ...btnPrimary, marginTop:20, minWidth:140 }} onClick={handleSaveProfile} disabled={savingProfile}>
          {savingProfile ? (
            <span style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ display:"inline-block", width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
              Enregistrement…
            </span>
          ) : "Enregistrer"}
        </button>
      </div>

      <div style={{ ...glassStyle, padding:28, marginBottom:20 }}>
        <h2 style={{ color:"#e0e0e0", fontSize:15, fontWeight:600, margin:"0 0 20px" }}>Sécurité</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={{ color:"#aaa", fontSize:13, marginBottom:6, display:"block" }}>Nouveau mot de passe</label>
            <input style={inputStyle} type="password" placeholder="••••••••" />
          </div>
          <div>
            <label style={{ color:"#aaa", fontSize:13, marginBottom:6, display:"block" }}>Confirmer le mot de passe</label>
            <input style={inputStyle} type="password" placeholder="••••••••" />
          </div>
        </div>
        <button style={{ ...btnGhost, marginTop:20 }} onClick={() => toast("Mot de passe mis à jour ✓", "success")}>
          Mettre à jour
        </button>
      </div>

      <div style={{ ...glassStyle, padding:24, borderColor:"rgba(124,58,237,0.3)" }}>
        <h2 style={{ color:"#e0e0e0", fontSize:15, fontWeight:600, margin:"0 0 12px" }}>📨 Notifications email</h2>
        <p style={{ color:"#888", fontSize:13, margin:0, lineHeight:1.6 }}>
          Les identifiants EmailJS sont chargés depuis les variables d'environnement (<code style={{ background:"rgba(255,255,255,0.08)", borderRadius:4, padding:"1px 5px", fontSize:12 }}>.env</code>).
          Ne commitez jamais vos clés dans Git.
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
