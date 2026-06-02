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

export type CartItem = {
  id: string; // composite trip+date key
  tripId: string;
  tripTitle: string;
  image: string;
  date: string;
  duration: string;
  travellers: number;
  pricePerPerson: number;
  originalPricePerPerson?: number;
  depositPerPerson: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  totalDeposit: number;
  totalSavings: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateTravellers: (id: string, travellers: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "trutravels-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    const id = `${item.tripId}__${item.date}`;
    setItems((current) => {
      const existing = current.find((c) => c.id === id);
      if (existing) {
        return current.map((c) =>
          c.id === id ? { ...c, travellers: c.travellers + item.travellers } : c,
        );
      }
      return [...current, { ...item, id }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((c) => c.id !== id));
  }, []);

  const updateTravellers = useCallback((id: string, travellers: number) => {
    setItems((current) =>
      current.map((c) =>
        c.id === id ? { ...c, travellers: Math.max(1, travellers) } : c,
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, total, totalDeposit, totalSavings } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.count += item.travellers;
        acc.total += item.pricePerPerson * item.travellers;
        acc.totalDeposit += item.depositPerPerson * item.travellers;
        if (item.originalPricePerPerson) {
          acc.totalSavings +=
            (item.originalPricePerPerson - item.pricePerPerson) * item.travellers;
        }
        return acc;
      },
      { count: 0, total: 0, totalDeposit: 0, totalSavings: 0 },
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        totalDeposit,
        totalSavings,
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
        addItem,
        removeItem,
        updateTravellers,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
