import { createContext, useCallback, useContext, useState } from "react";

const FlashContext = createContext(null);

/**
 * Reproduit le comportement de `flash()` / `get_flashed_messages()` de Flask :
 * un composant appelle `pushFlash(message, "success" | "error")`, le message
 * s'affiche en haut de la page suivante (ou courante), puis disparaît.
 */
export function FlashProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const pushFlash = useCallback((message, category = "success") => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), message, category }]);
  }, []);

  const dismissFlash = useCallback((id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const clearFlash = useCallback(() => setMessages([]), []);

  return (
    <FlashContext.Provider value={{ messages, pushFlash, dismissFlash, clearFlash }}>
      {children}
    </FlashContext.Provider>
  );
}

export function useFlash() {
  const ctx = useContext(FlashContext);
  if (!ctx) throw new Error("useFlash doit être utilisé dans un FlashProvider");
  return ctx;
}
