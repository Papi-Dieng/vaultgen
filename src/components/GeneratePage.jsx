import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import emailjs from "@emailjs/browser";
import { glassStyle, inputStyle, btnPrimary, btnGhost } from "../styles";
import { STATUS_OPTIONS, TEMPLATES, SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY, NOTIFY_EMAIL } from "../constants";

export function GeneratePage({ onSave, isMobile, toast }) {
  const [template, setTemplate] = useState("netflix");
  const [form, setForm]         = useState({
    status: "Terminé", email: "", password: "", profileName: "", pin: "", expiresAt: "",
  });
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const emailRef = useRef(null);

  useEffect(() => { emailRef.current?.focus(); }, []);

  const generated = useMemo(() => {
    if (!form.email || !form.password || !form.profileName) return "";
    return TEMPLATES[template].generate(form);
  }, [form, template]);

  // Reset "saved" indicator when form changes
  useEffect(() => { setSaved(false); }, [form, template]);

  const handleCopy = useCallback(() => {
    if (!generated) return;
    navigator.clipboard?.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast("Instructions copiées !", "success");
  }, [generated, toast]);

  const handleSave = useCallback(async () => {
    if (!generated) return;
    setSaving(true);

    const newAccount = {
      id: Date.now(),
      template,
      status: form.status,
      email: `${form.email}@gmail.com`,
      password: `${form.password}098`,
      profileName: form.profileName,
      pin: form.pin,
      expiresAt: form.expiresAt,
      createdAt: new Date().toLocaleDateString("fr-FR"),
    };

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: NOTIFY_EMAIL,
          message: JSON.stringify(newAccount, null, 2),
        },
        PUBLIC_KEY
      );
      toast("Compte sauvegardé + email envoyé ✓", "success");
    } catch (err) {
      // L'email a échoué mais on sauvegarde quand même localement
      console.error("EmailJS error:", err);
      toast("Compte sauvegardé (email non envoyé)", "warning");
    }

    onSave(newAccount);
    setSaving(false);
    setSaved(true);
  }, [form, template, generated, onSave, toast]);

  const setField = useCallback((key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value })), []);

  const field = (label, key, opts = {}) => (
    <div>
      <label style={{ color:"#aaa", fontSize:13, marginBottom:6, display:"block" }}>{label}</label>
      {opts.type === "select" ? (
        <select value={form[key]} onChange={setField(key)} style={{ ...inputStyle, appearance:"none" }}>
          {opts.options.map((o) => (
            <option key={o} value={o} style={{ background:"#1a1a2e" }}>{o}</option>
          ))}
        </select>
      ) : (
        <div style={{ position:"relative" }}>
          <input
            ref={key === "email" ? emailRef : undefined}
            style={{ ...inputStyle, paddingRight: opts.suffix ? 80 : 16 }}
            placeholder={opts.placeholder || ""}
            value={form[key]}
            type={opts.inputType || "text"}
            onChange={setField(key)}
          />
          {opts.suffix && (
            <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"#555", fontSize:13, pointerEvents:"none" }}>
              {opts.suffix}
            </span>
          )}
        </div>
      )}
    </div>
  );

  const progress    = [form.email, form.password, form.profileName].filter(Boolean).length;
  const progressPct = Math.round((progress / 3) * 100);

  return (
    <div style={{ maxWidth:820, margin:"0 auto" }}>
      <div style={{ marginBottom:36 }}>
        <h1 style={{ color:"#f0f0f0", fontSize:28, fontWeight:700, letterSpacing:"-0.03em", margin:"0 0 8px" }}>
          Générer des instructions
        </h1>
        <p style={{ color:"#777", fontSize:15, margin:"0 0 16px" }}>
          Remplissez les détails — les instructions se génèrent en temps réel.
        </p>
        {progress > 0 && progress < 3 && (
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1, height:4, background:"rgba(255,255,255,0.08)", borderRadius:4, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progressPct}%`, background:"linear-gradient(90deg, #4f46e5, #7c3aed)", borderRadius:4, transition:"width 0.3s" }} />
            </div>
            <span style={{ color:"#666", fontSize:13, whiteSpace:"nowrap" }}>{progress}/3 champs requis</span>
          </div>
        )}
      </div>

      {/* Template picker */}
      <div style={{ display:"flex", gap:10, marginBottom:28 }}>
        {Object.entries(TEMPLATES).map(([key, tpl]) => (
          <button
            key={key}
            onClick={() => setTemplate(key)}
            style={{
              ...btnGhost, padding:"9px 18px", fontSize:13,
              background: template === key ? "rgba(79,70,229,0.25)" : "rgba(255,255,255,0.06)",
              color:      template === key ? "#a5b4fc" : "#888",
              border:     template === key ? "1px solid rgba(79,70,229,0.5)" : "1px solid rgba(255,255,255,0.1)",
              fontWeight: template === key ? 600 : 400,
            }}
          >
            {tpl.icon} {tpl.label}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:32, alignItems:"start" }}>
        {/* Form */}
        <div style={{ ...glassStyle, padding:28 }}>
          <h2 style={{ color:"#e0e0e0", fontSize:16, fontWeight:600, margin:"0 0 24px", letterSpacing:"-0.01em" }}>
            Détails du compte
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            {field("Statut du compte", "status", { type:"select", options: STATUS_OPTIONS })}
            {field("Email",            "email",       { placeholder:"nom d'utilisateur", suffix:"@gmail.com" })}
            {field("Mot de passe",     "password",    { placeholder:"mot de passe de base", suffix:"098" })}
            {field("Nom du profil",    "profileName", { placeholder:"ex. Enfants, Jean" })}
            {field("PIN du profil (optionnel)",       "pin",      { placeholder:"PIN à 4 chiffres", inputType:"number" })}
            {field("Date d'expiration (optionnel)",   "expiresAt",{ placeholder:"ex. 15/06/2026" })}
          </div>
        </div>

        {/* Live output */}
        <div>
          {generated ? (
            <div style={{ ...glassStyle, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
                <h2 style={{ color:"#e0e0e0", fontSize:15, fontWeight:600, margin:0 }}>Résultat</h2>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <button onClick={handleCopy} style={{ ...btnGhost, padding:"7px 14px", fontSize:13 }}>
                    {copied ? "✓ Copié !" : "⎘ Copier"}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    style={{ ...btnGhost, padding:"7px 14px", fontSize:13, color: saved ? "#6ee7b7" : "#ccc", minWidth:110 }}
                  >
                    {saving ? (
                      <span style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"center" }}>
                        <span style={{ display:"inline-block", width:12, height:12, border:"2px solid rgba(255,255,255,0.2)", borderTopColor:"#ccc", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                        Sauvegarde…
                      </span>
                    ) : saved ? "✓ Sauvegardé" : "↳ Sauvegarder"}
                  </button>
                </div>
              </div>
              <pre style={{
                color:"#ccc", fontSize:13, lineHeight:1.7,
                whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0,
                fontFamily:"'JetBrains Mono', 'Fira Code', monospace",
                background:"rgba(0,0,0,0.3)", borderRadius:10,
                padding:"16px 18px", maxHeight:480, overflowY:"auto",
              }}>
                {generated}
              </pre>
            </div>
          ) : (
            <div style={{ ...glassStyle, padding:40, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:280, gap:16 }}>
              <div style={{ fontSize:48, opacity:0.2 }}>✦</div>
              <div style={{ textAlign:"center" }}>
                <p style={{ color:"#555", fontSize:15, margin:"0 0 8px", fontWeight:500 }}>En attente des données…</p>
                <p style={{ color:"#444", fontSize:13, margin:0 }}>
                  Remplissez Email, Mot de passe et Profil<br />pour générer les instructions.
                </p>
              </div>
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                {["Email", "Mot de passe", "Profil"].map((step, i) => {
                  const filled = [form.email, form.password, form.profileName][i];
                  return (
                    <div key={step} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color: filled ? "#6ee7b7" : "#555" }}>
                      <span style={{ width:16, height:16, borderRadius:"50%", border:`1px solid ${filled ? "#6ee7b7" : "#444"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>
                        {filled ? "✓" : i + 1}
                      </span>
                      {step}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
