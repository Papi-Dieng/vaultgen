import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "success", duration = 3000, onUndo = null) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type, onUndo }]);
      const timer = setTimeout(() => dismiss(id), duration);
      return { id, timer };
    },
    [dismiss]
  );

  return { toasts, push, dismiss };
}
