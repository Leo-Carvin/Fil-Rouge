import React, { createContext, useContext, useState, useCallback } from "react";
import { getCart, addCartItem, removeCartItem, clearCartAPI } from "../api/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Charger le panier depuis la BDD (appelé au login)
  const loadCart = useCallback(async () => {
    try {
      const data = await getCart();
      if (Array.isArray(data)) {
        setCart(data.map((item) => ({
          id: item.product_id,
          name: item.name,
          price: item.price,
          type: item.type,
          image: item.image,
          socket: item.socket,
          ram_type: item.ram_type,
          quantity: item.quantity,
        })));
      }
    } catch (err) {
      console.error("Erreur chargement panier:", err);
    }
  }, []);

  const addToCart = async (product, qty = 1) => {
    // Mise à jour optimiste locale
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });

    // Sync BDD
    try {
      const existing = cart.find((i) => i.id === product.id);
      const newQty = existing ? existing.quantity + qty : qty;
      await addCartItem(product.id, newQty);
    } catch (err) {
      console.error("Erreur sync panier:", err);
    }
  };

  const removeFromCart = async (productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
    try {
      await removeCartItem(productId);
    } catch (err) {
      console.error("Erreur suppression panier:", err);
    }
  };

  const updateQuantity = async (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity: qty } : i))
    );
    try {
      await addCartItem(productId, qty);
    } catch (err) {
      console.error("Erreur update quantité:", err);
    }
  };

  // Vider localement seulement (déconnexion)
  const clearCartLocal = () => setCart([]);

  // Vider en BDD + local (après commande)
  const clearCart = async () => {
    setCart([]);
    try {
      await clearCartAPI();
    } catch (err) {
      console.error("Erreur vidage panier:", err);
    }
  };

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, clearCartLocal, loadCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}