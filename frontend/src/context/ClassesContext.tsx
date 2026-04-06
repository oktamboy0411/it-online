import React, { createContext, useContext } from "react";
import { useClasses } from "@/hooks/useClasses";

type ClassesContextType = ReturnType<typeof useClasses>;

const ClassesContext = createContext<ClassesContextType | null>(null);

export function ClassesProvider({ children }: { children: React.ReactNode }) {
  const value = useClasses();
  return <ClassesContext.Provider value={value}>{children}</ClassesContext.Provider>;
}

export function useClassesContext() {
  const ctx = useContext(ClassesContext);
  if (!ctx) throw new Error("useClassesContext must be used within ClassesProvider");
  return ctx;
}
