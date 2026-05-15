import { useState, useEffect, useCallback, useRef } from "react";
import { ToastContainer }  from "./components/ToastContainer";
import { AuthScreen }      from "./components/AuthScreen";
import { Sidebar }         from "./components/Sidebar";
import { GeneratePage }    from "./components/GeneratePage";
import { AccountsPage }    from "./components/AccountsPage";
import { SettingsPage }    from "./components/SettingsPage";
import { useIsMobile }     from "./hooks/useIsMobile";
import { useToast }        from "./hooks/useToast";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { loadAccounts, saveAccountsLS, loadUser, removeUser } from "./utils/storage";
import { btnGhost } from "./styles";

// ─── Default demo accounts ────────────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  { id:1, template:"netflix", status:"Terminé",    email:"john.doe@gmail.com",  password:"secret098",  profileName:"John", pin:"1234", expiresAt:"20/05/2026", createdAt:"12/05/2026" },
  { id:2, template:"spotify", status:"À vérifier", email:"jane.smith@gmail.com", password:"pass123098", profileName:"Kids", pin:"",     expiresAt:"",           createdAt:"10/05/2026" },
];

export default function App() {
  const isMobile = useIsMobile();
  const { toasts, push: toast } = useToast();

  const [user,    setUser]    = useState(() => loadUser());
  const [page,    setPage]    = useState("generate");
  const [accounts,setAccounts]= useState(() => {
    const stored = loadAccounts();
    return stored.length > 0 ? stored : DEMO_ACCOUNTS;
  });
  const [sidebarCollapsed,  setSidebarCollapsed]  = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const searchRef = useRef(null);
  const undoRef   = useRef(null);

  // Persist accounts to localStorage whenever they change
  useEffect(() => { saveAccountsLS(accounts); }, [accounts]);

  // Listen for internal navigation events (e.g. from EmptyState button)
  useEffect(() => {
    const handler = (e) => setPage(e.detail);
    window.addEventListener("navigate", handler);
    return () => window.removeEventListener("navigate", handler);
  }, []);

  const handleLogin  = useCallback((u) => setUser(u), []);
  const handleLogout = useCallback(() => { removeUser(); setUser(null); }, []);
  const handleSave   = useCallback((acc) => setAccounts((prev) => [acc, ...prev]), []);

  // ─── Undo delete ─────────────────────────────────────────────────────────────
  const handleDelete = useCallback((id, deletedAccount) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));

    if (undoRef.current) clearTimeout(undoRef.current);

    let restored = false;
    const doUndo = () => {
      if (restored) return;
      restored = true;
      if (undoRef.current) clearTimeout(undoRef.current);
      if (deletedAccount) {
        setAccounts((prev) => {
          if (prev.find((a) => a.id === deletedAccount.id)) return prev;
          return [deletedAccount, ...prev];
        });
        toast("Compte restauré ✓", "success", 2500);
      }
    };

    toast("Compte supprimé", "undo", 5000, doUndo);
  }, [toast]);

  // ─── Keyboard shortcuts ───────────────────────────────────────────────────────
  useKeyboardShortcuts([
    { key: "g", callback: () => setPage("generate") },
    { key: "a", callback: () => setPage("accounts") },
    { key: "s", callback: () => setPage("settings") },
    { key: "k", ctrl: true, callback: () => {
      setPage("accounts");
      setTimeout(() => searchRef.current?.focus(), 100);
    }},
  ]);

  if (!user) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #0a0f1a 100%)",
      display: "flex",
      fontFamily: "'Geist Sans', 'Inter', system-ui, sans-serif",
      color: "#f0f0f0",
      position: "relative",
    }}>
      {/* Background glows */}
      <div style={{ position:"fixed", top:"5%", left:"25%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:"10%", right:"5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <ToastContainer toasts={toasts} />

      <div style={{ position:"relative", zIndex:1, display:"flex", width:"100%" }}>
        <Sidebar
          active={page}
          onNav={setPage}
          user={user}
          onLogout={handleLogout}
          collapsed={sidebarCollapsed}
          isMobile={isMobile}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <main style={{ flex:1, padding: isMobile ? "24px 16px" : "40px 48px", overflowY:"auto", minHeight:"100vh", boxSizing:"border-box" }}>
          {/* Top bar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:48 }}>
            <button
              onClick={() => isMobile ? setMobileSidebarOpen((o) => !o) : setSidebarCollapsed((c) => !c)}
              style={{ ...btnGhost, padding:"8px 12px", fontSize:16 }}
            >
              ☰
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg, #4f46e5, #7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:600 }}>
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              {!isMobile && <span style={{ color:"#aaa", fontSize:14 }}>{user.name}</span>}
            </div>
          </div>

          {page === "generate" && <GeneratePage onSave={handleSave} isMobile={isMobile} toast={toast} />}
          {page === "accounts" && <AccountsPage accounts={accounts} onDelete={handleDelete} isMobile={isMobile} toast={toast} searchRef={searchRef} />}
          {page === "settings" && <SettingsPage user={user} toast={toast} />}
        </main>
      </div>
    </div>
  );
}
