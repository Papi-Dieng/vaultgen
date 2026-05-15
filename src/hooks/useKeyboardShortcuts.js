import { useEffect } from "react";

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handler = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "SELECT"
      ) {
        if (e.key === "Escape") e.target.blur();
        return;
      }
      for (const { key, ctrl, callback } of shortcuts) {
        if (e.key === key && (!ctrl || e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          callback();
          return;
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}
