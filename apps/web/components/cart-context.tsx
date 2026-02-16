'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { MenuItem, OrderItem } from "@food-delivery/shared";

interface CartContextType {
  items: OrderItem[];
  restaurantId: string | null;
  addItem: (menuItem: MenuItem) => 'added' | 'conflict';
  replaceCart: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const addItem = useCallback((menuItem: MenuItem): 'added' | 'conflict' => {
    // Check if cart has items from a different restaurant
    if (restaurantId && restaurantId !== menuItem.restaurantId) {
      return 'conflict';
    }

    setRestaurantId(menuItem.restaurantId);
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
    return 'added';
  }, [restaurantId]);

  const replaceCart = useCallback((menuItem: MenuItem) => {
    setRestaurantId(menuItem.restaurantId);
    setItems([{ menuItem, quantity: 1 }]);
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.menuItem.id !== menuItemId);
      if (next.length === 0) setRestaurantId(null);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => {
        const next = prev.filter((i) => i.menuItem.id !== menuItemId);
        if (next.length === 0) setRestaurantId(null);
        return next;
      });
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.menuItem.id === menuItemId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, restaurantId, addItem, replaceCart, removeItem, updateQuantity, clearCart, totalItems, subtotal }),
    [items, restaurantId, addItem, replaceCart, removeItem, updateQuantity, clearCart, totalItems, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}