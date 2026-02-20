'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { MenuItem, OrderItem } from "@food-delivery/shared";

interface CartContextType {
  restaurantId: string | null;
  items: OrderItem[];
  totalItems: number; // Count of items
  subtotal: number;
  addItem: (menuItem: MenuItem) => 'added' | 'conflict';
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  replaceCart: (menuItem: MenuItem) => void;  // Replace the old cart when a new order is started
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

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


  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => {
      const filteredItems = prev.filter((i) => i.menuItem.id !== menuItemId);
      if (filteredItems.length === 0) setRestaurantId(null);
      return filteredItems;
    });
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => {
        const filteredItems = prev.filter((i) => i.menuItem.id !== menuItemId);
        if (filteredItems.length === 0) setRestaurantId(null);
        return filteredItems;
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

  const replaceCart = useCallback((menuItem: MenuItem) => {
    setRestaurantId(menuItem.restaurantId);
    setItems([{ menuItem, quantity: 1 }]);
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
    () => ({ restaurantId, items, totalItems, subtotal, addItem, removeItem, updateQuantity, clearCart, replaceCart }),
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