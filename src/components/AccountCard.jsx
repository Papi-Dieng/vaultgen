import { useState, useCallback, useMemo, memo } from "react";
import { glassStyle, btnGhost } from "../styles";
import { STATUS_COLORS, TEMPLATES } from "../constants";
import { stripSuffix, isExpiringSoon } from "../utils/helpers";

export const AccountCard = memo(function AccountCard({ account, onDelete, isMobile, toast }) {
  const [expanded, setExpanded] = useState(false);
  const [copied,   setCopied]   = useState(false);

  const sc  = STATUS_COLORS[account.status] || STATUS_COLORS["Terminé"];
  const tpl = TEMPLATES[account.template]   || TEMPLATES.netflix;

  const handleCopy = useCallback(() => {
    const text = tpl.generate({
      email:       stripSuffix(account.email,    "@gmail.com"),
      password:    stripSuffix(account.password, "098"),
      profileName: account.profileName,
      pin:         account.pin,
    });
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast("Instructions copiées !", "success");
  }, [account, tpl, toast]);

  const handleDelete  = useCallback(() => onDelete(account.id), [account.id, onDelete]);
  const toggleExpand  = useCallback(() => setExpanded((e) => !e), []);
  const expiringSoon  = useMemo(() => isExpiringSoon(account.expiresAt), [account.expiresAt]);

  return (
    <div style={{ ...glassStyle, padding:"18px 22px", transition:"border-color 0.2s" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:sc.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
          {tpl.icon}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2, flexWrap:"wrap" }}>
            <span style={{ color:"#e0e0e0", fontWeight:600, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {account.email}
            </span>
            <span style={{ background:sc.bg, color:sc.text, fontSize:11, padding:"2px 8px", borderRadius:6, whiteSpace:"nowrap", fontWeight:500 }}>
              {account.status}
            </span>
            {expiringSoon && (
              <span style={{ background:"rgba(133,79,11,0.4)", color:"#faeeda", fontSize:11, padding:"2px 8px", borderRadius:6, whiteSpace:"nowrap" }}>
                ⏳ Expire bientôt
              </span>
            )}
          </div>
          <span style={{ color:"#666", fontSize:13 }}>
            Profil : {account.profileName} · Ajouté le {account.createdAt}
            {account.expiresAt ? ` · Expire : ${account.expiresAt}` : ""}
          </span>
        </div>
        <div style={{ display:"flex", gap:8, flexShrink:0 }}>
          <button onClick={handleCopy}   title="Copier les instructions" style={{ ...btnGhost, padding:"7px 12px", fontSize:12 }}>{copied ? "✓" : "⎘"}</button>
          <button onClick={toggleExpand} title={expanded ? "Réduire" : "Voir les détails"} style={{ ...btnGhost, padding:"7px 12px", fontSize:12 }}>{expanded ? "▲" : "▼"}</button>
          <button onClick={handleDelete} title="Supprimer" style={{ ...btnGhost, padding:"7px 12px", fontSize:12, color:"#f09595" }}>✕</button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:12 }}>
            {[
              ["Email",       account.email],
              ["Mot de passe",account.password],
              ["Profil",      account.profileName],
              ["PIN",         account.pin || "—"],
              ["Expiration",  account.expiresAt || "—"],
            ].map(([label, val]) => (
              <div key={label} style={{ background:"rgba(0,0,0,0.25)", borderRadius:8, padding:"10px 14px" }}>
                <div style={{ color:"#666", fontSize:11, marginBottom:3 }}>{label}</div>
                <div style={{ color:"#ddd", fontSize:14, fontFamily:"monospace" }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
