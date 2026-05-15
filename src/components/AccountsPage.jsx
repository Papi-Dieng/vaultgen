import { useState, useMemo, useCallback } from "react";
import { glassStyle, inputStyle, btnGhost, btnPrimary } from "../styles";
import { STATUS_OPTIONS, STATUS_COLORS } from "../constants";
import { useDebounce } from "../hooks/useDebounce";
import { isExpiringSoon } from "../utils/helpers";
import { ConfirmDialog } from "./ConfirmDialog";
import { AccountCard } from "./AccountCard";

function EmptyState({ hasAccounts, search }) {
  if (!hasAccounts) {
    return (
      <div style={{ ...glassStyle, padding:60, textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:16, opacity:0.6 }}>🔐</div>
        <p style={{ color:"#e0e0e0", fontSize:18, fontWeight:600, margin:"0 0 10px" }}>Aucun compte encore</p>
        <p style={{ color:"#555", fontSize:14, margin:"0 0 24px", lineHeight:1.6 }}>
          Génère ton premier compte depuis la page<br />"Générer" pour commencer.
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail:"generate" }))}
          style={{ ...btnPrimary, fontSize:14, padding:"10px 22px" }}
        >
          ✦ Générer un compte
        </button>
      </div>
    );
  }
  return (
    <div style={{ ...glassStyle, padding:48, textAlign:"center" }}>
      <div style={{ fontSize:40, marginBottom:12, opacity:0.4 }}>🔍</div>
      <p style={{ color:"#e0e0e0", fontSize:16, fontWeight:500, margin:"0 0 8px" }}>Aucun résultat</p>
      <p style={{ color:"#555", fontSize:14, margin:0 }}>
        Aucun compte ne correspond à « {search} ».<br />Essaie un autre terme.
      </p>
    </div>
  );
}

export function AccountsPage({ accounts, onDelete, isMobile, toast, searchRef }) {
  const [search,      setSearch]  = useState("");
  const [statusFilter,setFilter]  = useState("Tous");
  const [sortOrder,   setSort]    = useState("newest");
  const [confirmId,   setConfirmId] = useState(null);
  const [exporting,   setExporting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let list = accounts.filter((a) => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch =
        a.email.toLowerCase().includes(q) ||
        (a.profileName || "").toLowerCase().includes(q) ||
        (a.status || "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "Tous" || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
    if (sortOrder === "oldest") list = [...list].reverse();
    return list;
  }, [accounts, debouncedSearch, statusFilter, sortOrder]);

  const stats = useMemo(() => ({
    total: accounts.length,
    expiring: accounts.filter((a) => isExpiringSoon(a.expiresAt)).length,
    byStatus: STATUS_OPTIONS.reduce(
      (acc, s) => ({ ...acc, [s]: accounts.filter((a) => a.status === s).length }),
      {}
    ),
  }), [accounts]);

  const handleExport = useCallback(async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 600));
    const blob = new Blob([JSON.stringify(accounts, null, 2)], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `vaultgen-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
    toast("Backup téléchargé !", "success");
  }, [accounts, toast]);

  const handleConfirmDelete = useCallback((id) => setConfirmId(id), []);

  const handleDelete = useCallback(() => {
    const deletedAccount = accounts.find((a) => a.id === confirmId);
    onDelete(confirmId, deletedAccount);
    setConfirmId(null);
  }, [accounts, confirmId, onDelete]);

  return (
    <div>
      {confirmId && (
        <ConfirmDialog
          message="Supprimer ce compte ? Tu pourras annuler pendant 5 secondes."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* Header */}
      <div style={{ display:"flex", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", justifyContent:"space-between", gap:16, marginBottom:24 }}>
        <div>
          <h1 style={{ color:"#f0f0f0", fontSize:28, fontWeight:700, letterSpacing:"-0.03em", margin:"0 0 6px" }}>Mes comptes</h1>
          <p style={{ color:"#777", fontSize:15, margin:0 }}>
            {accounts.length} compte{accounts.length !== 1 ? "s" : ""} sauvegardé{accounts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={handleExport} disabled={exporting} style={{ ...btnGhost, fontSize:13, padding:"9px 16px", whiteSpace:"nowrap", minWidth:140 }}>
          {exporting ? (
            <span style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ display:"inline-block", width:12, height:12, border:"2px solid rgba(255,255,255,0.2)", borderTopColor:"#ccc", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
              Export…
            </span>
          ) : "⬇ Exporter JSON"}
        </button>
      </div>

      {/* Stats bar */}
      {accounts.length > 0 && (
        <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
          {Object.entries(stats.byStatus).map(([status, count]) => {
            const sc = STATUS_COLORS[status];
            return (
              <div
                key={status}
                style={{ background:`${sc.bg}22`, border:`1px solid ${sc.bg}55`, borderRadius:10, padding:"8px 14px", display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}
                onClick={() => setFilter((f) => f === status ? "Tous" : status)}
              >
                <span style={{ width:8, height:8, borderRadius:"50%", background:sc.bg, flexShrink:0 }} />
                <span style={{ color:sc.text, fontSize:13 }}>{status}</span>
                <span style={{ color:"#888", fontSize:13, fontWeight:600 }}>{count}</span>
              </div>
            );
          })}
          {stats.expiring > 0 && (
            <div style={{ background:"rgba(133,79,11,0.15)", border:"1px solid rgba(133,79,11,0.4)", borderRadius:10, padding:"8px 14px", display:"flex", alignItems:"center", gap:8 }}>
              <span>⏳</span>
              <span style={{ color:"#faeeda", fontSize:13 }}>
                {stats.expiring} expire{stats.expiring > 1 ? "nt" : ""} bientôt
              </span>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:20 }}>
        <div style={{ position:"relative", flex: isMobile ? "1 1 100%" : "0 0 220px" }}>
          <input
            ref={searchRef}
            style={{ ...inputStyle, paddingLeft:40, fontSize:14 }}
            placeholder="Rechercher… (Ctrl+K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#555", fontSize:15 }}>⌕</span>
          {search && (
            <button onClick={() => setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#666", cursor:"pointer", fontSize:16, padding:0 }}>
              ×
            </button>
          )}
        </div>
        <select value={statusFilter} onChange={(e) => setFilter(e.target.value)} style={{ ...inputStyle, width:"auto", appearance:"none", fontSize:13, padding:"10px 14px" }}>
          {["Tous", ...STATUS_OPTIONS].map((o) => (
            <option key={o} value={o} style={{ background:"#1a1a2e" }}>{o}</option>
          ))}
        </select>
        <select value={sortOrder} onChange={(e) => setSort(e.target.value)} style={{ ...inputStyle, width:"auto", appearance:"none", fontSize:13, padding:"10px 14px" }}>
          <option value="newest" style={{ background:"#1a1a2e" }}>Plus récent</option>
          <option value="oldest" style={{ background:"#1a1a2e" }}>Plus ancien</option>
        </select>
      </div>

      {debouncedSearch && (
        <p style={{ color:"#666", fontSize:13, marginBottom:12 }}>
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} pour « {debouncedSearch} »
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState hasAccounts={accounts.length > 0} search={debouncedSearch} />
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {filtered.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onDelete={handleConfirmDelete}
              isMobile={isMobile}
              toast={toast}
            />
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
