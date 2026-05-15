export function ToastContainer({ toasts }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background:
              t.type === "error"
                ? "rgba(226,75,74,0.95)"
                : t.type === "warning"
                ? "rgba(133,79,11,0.95)"
                : t.type === "undo"
                ? "rgba(30,30,50,0.97)"
                : "rgba(15,110,86,0.95)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 12,
            padding: "12px 18px",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            minWidth: 220,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            animation: "slideIn 0.25s ease",
            display: "flex",
            alignItems: "center",
            gap: 10,
            pointerEvents: t.onUndo ? "all" : "none",
          }}
        >
          <span style={{ fontSize: 16 }}>
            {t.type === "error"
              ? "⚠"
              : t.type === "warning"
              ? "⏳"
              : t.type === "undo"
              ? "🗑"
              : "✓"}
          </span>
          <span style={{ flex: 1 }}>{t.message}</span>
          {t.onUndo && (
            <button
              onClick={t.onUndo}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 6,
                color: "#fff",
                fontSize: 13,
                padding: "4px 10px",
                cursor: "pointer",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Annuler
            </button>
          )}
        </div>
      ))}
      <style>{`@keyframes slideIn { from { transform: translateX(40px); opacity:0; } to { transform: translateX(0); opacity:1; } }`}</style>
    </div>
  );
}
