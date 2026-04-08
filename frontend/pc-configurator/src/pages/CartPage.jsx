import React from "react";
import { useCart } from "../context/CartContext";

export default function CartPage({ onOrder }) {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg">Votre panier est vide.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-extrabold text-white">🛒 Mon Panier</h2>

      <div className="flex flex-col gap-3">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 p-4">
            <div className="flex items-center gap-4">
              <img
                src={item.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&q=80"}
                alt={item.name}
                className="h-14 w-14 rounded-lg object-contain bg-slate-700"
              />
              <div>
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="rounded-full w-6 h-6 bg-slate-700 text-white text-xs font-bold hover:bg-slate-600 transition"
                  >−</button>
                  <span className="text-xs text-slate-300 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="rounded-full w-6 h-6 bg-slate-700 text-white text-xs font-bold hover:bg-slate-600 transition"
                  >+</button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-indigo-300 font-bold">${(Number(item.price) * item.quantity).toFixed(2)}</span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-xs text-red-400 hover:text-red-300 transition"
              >Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-700 pt-4">
        <div>
          <p className="text-slate-400 text-sm">Total</p>
          <p className="text-2xl font-black text-white">${total.toFixed(2)}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="rounded-full px-4 py-2 text-sm font-semibold bg-slate-700 text-slate-200 hover:bg-slate-600 transition"
          >Vider le panier</button>
          <button
            onClick={onOrder}
            className="rounded-full px-4 py-2 text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-400 transition"
          >Commander</button>
        </div>
      </div>
    </div>
  );
}