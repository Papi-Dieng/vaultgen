import { btnGhost } from "../styles";

const navItems = [
  { id: "generate", icon: "✦", label: "Générer",     shortcut: "G" },
  { id: "accounts", icon: "⊞", label: "Mes comptes", shortcut: "A" },
  { id: "settings", icon: "⚙", label: "Paramètres",  shortcut: "S" },
];

function SidebarContent({ active, onNav, user, onLogout, collapsed }) {
  return (
    <>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32, paddingLeft:4 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg, #4f46e5, #7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ fontSize:15 }}>🔐</span>
        </div>
        {!collapsed && <span style={{ color:"#f0f0f0", fontSize:15, fontWeight:700, letterSpacing:"-0.02em", whiteSpace:"nowrap" }}>VaultGen</span>}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:4, flex:1 }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            title={collapsed ? `${item.label} (${item.shortcut})` : item.shortcut}
            style={{
              display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
              borderRadius:10, border:"none",
              background: active === item.id ? "rgba(79,70,229,0.2)" : "transparent",
              color:      active === item.id ? "#a5b4fc" : "#888",
              cursor:"pointer", fontSize:14,
              fontWeight: active === item.id ? 600 : 400,
              transition:"all 0.15s", textAlign:"left", whiteSpace:"nowrap", overflow:"hidden",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
            {!collapsed && (
              <>
                <span style={{ flex:1 }}>{item.label}</span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.06)", borderRadius:4, padding:"1px 5px", fontFamily:"monospace" }}>
                  {item.shortcut}
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:16 }}>
        {!collapsed && (
          <div style={{ marginBottom:10, padding:"8px 12px" }}>
            <p style={{ color:"#ddd", fontSize:13, fontWeight:500, margin:0 }}>{user?.name}</p>
            <p style={{ color:"#666", fontSize:12, margin:0, overflow:"hidden", textOverflow:"ellipsis" }}>{user?.email}</p>
          </div>
        )}
        <button
          onClick={onLogout}
          style={{ ...btnGhost, width:"100%", textAlign:"left", display:"flex", alignItems:"center", gap:8, padding:"10px 12px", justifyContent: collapsed ? "center" : "flex-start" }}
        >
          <span>↩</span>
          {!collapsed && "Déconnexion"}
        </button>
      </div>
    </>
  );
}

export function Sidebar({ active, onNav, user, onLogout, collapsed, isMobile, mobileOpen, onMobileClose }) {
  if (isMobile) {
    if (!mobileOpen) return null;
    return (
      <>
        <div onClick={onMobileClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:40 }} />
        <div style={{
          position:"fixed", top:0, left:0, bottom:0, width:240,
          background:"#0d0d1a", borderRight:"1px solid rgba(255,255,255,0.08)",
          display:"flex", flexDirection:"column", padding:"20px 12px",
          zIndex:50, boxSizing:"border-box",
        }}>
          <SidebarContent
            active={active}
            onNav={(id) => { onNav(id); onMobileClose(); }}
            user={user}
            onLogout={onLogout}
            collapsed={false}
          />
        </div>
      </>
    );
  }

  return (
    <div style={{
      width: collapsed ? 68 : 220,
      minHeight: "100vh",
      background:"rgba(255,255,255,0.02)",
      borderRight:"1px solid rgba(255,255,255,0.06)",
      display:"flex", flexDirection:"column", padding:"20px 12px",
      transition:"width 0.25s", flexShrink:0, boxSizing:"border-box",
    }}>
      <SidebarContent active={active} onNav={onNav} user={user} onLogout={onLogout} collapsed={collapsed} />
    </div>
  );
}
