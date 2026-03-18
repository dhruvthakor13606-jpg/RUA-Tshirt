import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Product } from "@/data/products";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { CartItem } from "@/types/ecommerce";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size?: string) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Handle Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
      if (!user) setItems([]); // Clear cart on logout
    });
    return () => unsubscribe();
  }, []);

  // Sync from Firestore on login
  useEffect(() => {
    if (!userId) return;

    const cartRef = doc(db, "carts", userId);
    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setItems(data.items || []);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  // Sync to Firestore on change
  const syncCart = useCallback(async (newItems: CartItem[]) => {
    if (!userId) return;
    try {
      await setDoc(doc(db, "carts", userId), { items: newItems });
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  }, [userId]);

  const addItem = useCallback((product: Product, size: string = "M") => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.size === size);
      let newItems;
      if (existing) {
        newItems = prev.map((i) =>
          i.product.id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...prev, { product, quantity: 1, size }];
      }
      syncCart(newItems);
      return newItems;
    });
  }, [syncCart]);

  const removeItem = useCallback((productId: number, size: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => !(i.product.id === productId && i.size === size));
      syncCart(newItems);
      return newItems;
    });
  }, [syncCart]);

  const updateQuantity = useCallback((productId: number, size: string, quantity: number) => {
    setItems((prev) => {
      let newItems;
      if (quantity <= 0) {
        newItems = prev.filter((i) => !(i.product.id === productId && i.size === size));
      } else {
        newItems = prev.map((i) =>
          i.product.id === productId && i.size === size ? { ...i, quantity } : i
        );
      }
      syncCart(newItems);
      return newItems;
    });
  }, [syncCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    syncCart([]);
  }, [syncCart]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
