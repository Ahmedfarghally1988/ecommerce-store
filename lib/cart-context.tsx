"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItemData = {
  productId: string;
  variantId?: string | null;
  name: string;
  nameEn?: string;
  nameAr?: string;
  slug: string;
  price: number;
  image?: string;
  quantity: number;
  variantName?: string;
  variantNameEn?: string;
  variantNameAr?: string;
};

interface CartContextType {
  items: CartItemData[];
  addItem: (item: CartItemData) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isMounted: boolean;
  currency: string;
  exchangeRate: number;
  locale: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, currency = 'EGP', exchangeRate = 1, locale = 'en' }: { children: ReactNode, currency?: string, exchangeRate?: number, locale?: string }) {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load initial cart from localStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const storedCart = localStorage.getItem("store_cart");
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from local storage", e);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("store_cart", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addItem = (item: CartItemData) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + item.quantity
        };
        return newItems;
      } else {
        return [...prevItems, item];
      }
    });
  };

  const removeItem = (productId: string, variantId?: string | null) => {
    setItems((prevItems) => 
      prevItems.filter((i) => !(i.productId === productId && i.variantId === variantId))
    );
  };

  const updateQuantity = (productId: string, variantId: string | null | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId === productId && item.variantId === variantId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isMounted,
        currency,
        exchangeRate,
        locale
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
