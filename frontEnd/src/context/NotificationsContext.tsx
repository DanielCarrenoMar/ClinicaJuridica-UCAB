import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import NotificationContainer, { type NotificationItem, type NotificationVariant } from "#components/notifications/NotificationContainer.tsx";

type NotificationsApi = {
  notyMessage: (text: string) => void;
  notyError: (text: string) => void;
};

const NotificationsContext = createContext<NotificationsApi | null>(null);

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type ProviderProps = {
  children: React.ReactNode;
  durationMs?: number;
};

export function NotificationsProvider({ children, durationMs = 4000 }: ProviderProps) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const remove = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const push = useCallback(
    (variant: NotificationVariant, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const id = createId();
      setItems((prev) => [...prev, { id, text: trimmed, variant }]);

      const timer = window.setTimeout(() => remove(id), durationMs);
      timersRef.current.set(id, timer);
    },
    [durationMs, remove]
  );

  const api = useMemo<NotificationsApi>(
    () => ({
      notyMessage: (text: string) => push("message", text),
      notyError: (text: string) => push("error", text),
    }),
    [push]
  );

  return (
    <NotificationsContext.Provider value={api}>
      {children}
      <NotificationContainer items={items} onClose={remove} />
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return ctx;
}
