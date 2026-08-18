"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useCatalog } from "@/components/catalog/catalog-provider";
import { type Course } from "@/content/courses";

export type CartItem = {
  slug: string;
  title: string;
  price: number;
  priceLabel: string;
  quantity: number;
  image: string;
  module?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  vat: number;
  total: number;
  addItem: (slug: string, opts?: { module?: string; price?: number; priceLabel?: string }) => void;
  removeItem: (slug: string, module?: string) => void;
  updateQuantity: (slug: string, quantity: number, module?: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "vigitrust-cart-v1";
const VAT_RATE = 0.23;

function coursePrice(course: Course, moduleName?: string): { price: number; label: string } {
  if (moduleName && course.modules) {
    const mod = course.modules.find((m) => m.name === moduleName);
    if (mod) {
      const n = Number(mod.price.replace(/[^\d.]/g, ""));
      return { price: n, label: mod.price };
    }
  }
  if (typeof course.priceFrom === "number") {
    return { price: course.priceFrom, label: course.priceLabel };
  }
  const match = course.priceLabel.match(/€[\d,]+\.?\d*/);
  if (match) {
    const n = Number(match[0].replace(/[^\d.]/g, ""));
    return { price: n, label: course.priceLabel };
  }
  return { price: 0, label: course.priceLabel };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { courses } = useCatalog();
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        // Refresh images/titles from catalogue so stale localStorage paths never break checkout.
        setItems(
          parsed.map((item) => {
            const course = courses.find((c) => c.slug === item.slug);
            if (!course) return item;
            return {
              ...item,
              title: item.module ? `${course.title}  -  ${item.module}` : course.title,
              image: course.image,
            };
          }),
        );
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [courses]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback(
    (slug: string, opts?: { module?: string; price?: number; priceLabel?: string }) => {
      const course = courses.find((c) => c.slug === slug);
      if (!course) return;
      const priced = coursePrice(course, opts?.module);
      const price = opts?.price ?? priced.price;
      const priceLabel = opts?.priceLabel ?? priced.label;

      setItems((prev) => {
        const keyMatch = (i: CartItem) =>
          i.slug === slug && (i.module ?? "") === (opts?.module ?? "");
        const existing = prev.find(keyMatch);
        if (existing) {
          return prev.map((i) =>
            keyMatch(i) ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }
        return [
          ...prev,
          {
            slug,
            title: opts?.module ? `${course.title}  -  ${opts.module}` : course.title,
            price,
            priceLabel,
            quantity: 1,
            image: course.image,
            module: opts?.module,
          },
        ];
      });
    },
    [courses],
  );

  const removeItem = useCallback((slug: string, module?: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.slug === slug && (i.module ?? "") === (module ?? ""))),
    );
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number, module?: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.slug === slug && (i.module ?? "") === (module ?? "")
            ? { ...i, quantity: Math.max(1, quantity) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );
  const vat = useMemo(() => Math.round(subtotal * VAT_RATE * 100) / 100, [subtotal]);
  const total = useMemo(() => Math.round((subtotal + vat) * 100) / 100, [subtotal, vat]);
  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      vat,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clear,
    }),
    [items, count, subtotal, vat, total, addItem, removeItem, updateQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function formatEuro(n: number) {
  return `€${n.toFixed(2)}`;
}
