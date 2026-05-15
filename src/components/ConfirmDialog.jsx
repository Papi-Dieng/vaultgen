import { useEffect } from "react";
import { glassStyle, btnGhost, btnPrimary } from "../styles";

export function ConfirmDialog({ message, onConfirm, onCancel }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onConfirm, onCancel]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          ...glassStyle,
          padding: 32,
          maxWidth: 360,
          width: "90%",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 16 }}>🗑️</div>
        <p style={{ color: "#e0e0e0", fontSize: 16, marginBottom: 8 }}>
          {message}
        </p>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 28 }}>
          Appuie sur Entrée pour confirmer, Échap pour annuler.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={onCancel}
            style={{ ...btnGhost, padding: "10px 24px" }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{
              ...btnPrimary,
              background: "linear-gradient(135deg, #c0392b, #e74c3c)",
              padding: "10px 24px",
            }}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
