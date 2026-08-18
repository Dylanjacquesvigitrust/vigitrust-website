"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ImageOverrideMap } from "@/lib/image-slots";

type AdminContextValue = {
  isAdmin: boolean;
  overrides: ImageOverrideMap;
  replaceImage: (slot: string, file: File) => Promise<void>;
  resetImage: (slot: string) => Promise<void>;
};

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  overrides: {},
  replaceImage: async () => undefined,
  resetImage: async () => undefined,
});

export function AdminProvider({
  isAdmin,
  initialOverrides,
  children,
}: {
  isAdmin: boolean;
  initialOverrides: ImageOverrideMap;
  children: ReactNode;
}) {
  const [overrides, setOverrides] = useState<ImageOverrideMap>(initialOverrides);

  const replaceImage = useCallback(async (slot: string, file: File) => {
    const body = new FormData();
    body.set("slot", slot);
    body.set("file", file);

    const response = await fetch("/api/admin/images", { method: "POST", body });
    const data = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !data.url) {
      throw new Error(data.error ?? "Could not replace image.");
    }

    setOverrides((current) => ({ ...current, [slot]: data.url! }));
  }, []);

  const resetImage = useCallback(async (slot: string) => {
    const response = await fetch(`/api/admin/images?slot=${encodeURIComponent(slot)}`, {
      method: "DELETE",
    });
    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      throw new Error(data.error ?? "Could not reset image.");
    }

    setOverrides((current) => {
      const next = { ...current };
      delete next[slot];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ isAdmin, overrides, replaceImage, resetImage }),
    [isAdmin, overrides, replaceImage, resetImage],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  return useContext(AdminContext);
}
