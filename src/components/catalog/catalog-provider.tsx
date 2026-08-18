"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Course } from "@/content/courses";

type CatalogContextValue = {
  courses: Course[];
};

const CatalogContext = createContext<CatalogContextValue>({ courses: [] });

export function CatalogProvider({
  courses,
  children,
}: {
  courses: Course[];
  children: ReactNode;
}) {
  return <CatalogContext.Provider value={{ courses }}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
