import React from "react";
import { useCart } from "../hooks/useCart";

export default function CartPage({ onOrder }) {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <p className="text-slate-400 text-lg font-semibold">Votre panier est vide.</p>
        <p className="text-slate-500 text-sm mt-2">Parcourez la boutique pour y ajouter des composants !</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="border-b border-slate-700/50 pb-3">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <span>🛒</span> Mon Panier
        </h2>
        <p className="text-xs text-slate-400 mt-1">Gérez vos articles et finalisez votre commande.</p>
      </div>

      <div className="flex flex-col gap-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-700/60 bg-slate-800/50 p-4 transition hover:border-slate-600"
          >
            {/* Infos produit (Image + Nom + Quantité) */}
            <div className="flex items-center gap-4">
              <img
                src={item.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&q=80"}
                alt={item.name}
                className="h-16 w-16 rounded-xl object-contain bg-slate-700/50 border border-slate-600/30 p-1 shrink-0"
              />
              <div className="min-w-0">
                <span className="inline-block rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] font-bold text-slate-300 uppercase mb-1">
                  {item.type}
                </span>
                <p className="text-sm font-bold text-white truncate leading-tight">{item.name}</p>
                
                {/* Quantité mobile & desktop */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="rounded-lg w-7 h-7 bg-slate-700 text-white font-black hover:bg-slate-600 transition flex items-center justify-center text-sm"
                  >
                    −
                  </button>
                  <span className="text-sm text-slate-200 font-bold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="rounded-lg w-7 h-7 bg-slate-700 text-white font-black hover:bg-slate-600 transition flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Prix + Action supprimer */}
            <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-slate-700/40 sm:border-t-0 pt-3 sm:pt-0">
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block sm:hidden">Sous-total</span>
                <span className="text-indigo-300 font-black text-lg">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Résumé pied de page */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-700 pt-6 mt-2">
        <div className="text-center sm:text-left">
          <p className="text-slate-400 text-sm">Prix Total TTC</p>
          <p className="text-3xl font-black text-white">${total.toFixed(2)}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={clearCart}
            className="flex-1 sm:flex-none rounded-xl px-5 py-3 text-sm font-bold bg-slate-700 text-slate-200 hover:bg-slate-600 transition"
          >
            Vider le panier
          </button>
          <button
            onClick={onOrder}
            className="flex-1 sm:flex-none rounded-xl px-6 py-3 text-sm font-bold bg-indigo-500 text-white hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/20"
          >
            Commander
          </button>
        </div>
      </div>
    </div>
  );
}
