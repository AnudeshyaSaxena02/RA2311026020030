import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "campus_viewed_ids";

interface ViewedCtx {
  isViewed:      (id: string) => boolean;
  markViewed:    (id: string) => void;
  markAllViewed: (ids: string[]) => void;
  unviewedCount: (ids: string[]) => number;
}

const ViewedContext = createContext<ViewedCtx | null>(null);

function loadFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function ViewedProvider({ children }: { children: ReactNode }) {
  const [viewed, setViewed] = useState<Set<string>>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...viewed]));
  }, [viewed]);

  const isViewed      = (id: string) => viewed.has(id);
  const markViewed    = (id: string) => setViewed(p => new Set([...p, id]));
  const markAllViewed = (ids: string[]) => setViewed(p => new Set([...p, ...ids]));
  const unviewedCount = (ids: string[]) => ids.filter(id => !viewed.has(id)).length;

  return (
    <ViewedContext.Provider value={{ isViewed, markViewed, markAllViewed, unviewedCount }}>
      {children}
    </ViewedContext.Provider>
  );
}

export function useViewed(): ViewedCtx {
  const ctx = useContext(ViewedContext);
  if (!ctx) throw new Error("useViewed must be used inside <ViewedProvider>");
  return ctx;
}
