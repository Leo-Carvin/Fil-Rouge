import React, { useEffect, useState } from "react";
import { getUserOrders } from "../api/api";

export default function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("user_email");

  useEffect(() => {
    getUserOrders().then((data) => {
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-slate-900/80 ring-1 ring-primary-light/20 p-5 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-primary-dark flex items-center justify-center text-2xl font-black text-white">
          {email ? email[0].toUpperCase() : "U"}
        </div>
        <div>
          <p className="text-white font-bold text-lg">{email || "Utilisateur"}</p>
          <p className="text-slate-400 text-xs">{orders.length} commande{orders.length !== 1 ? "s" : ""} passée{orders.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/80 ring-1 ring-primary-light/20 p-5">
        <h2 className="text-lg font-extrabold text-white mb-4">📦 Historique des commandes</h2>

        {loading ? (
          <p className="text-slate-400 text-sm">Chargement...</p>
        ) : orders.length === 0 ? (
          <p className="text-slate-400 text-sm">Aucune commande pour le moment.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-bold text-sm">Commande #{order.id}</p>
                    <p className="text-slate-400 text-xs">{new Date(order.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === "pending" ? "bg-yellow-500/20 text-yellow-300" :
                      order.status === "completed" ? "bg-green-500/20 text-green-300" :
                      "bg-slate-700 text-slate-300"
                    }`}>
                      {order.status === "pending" ? "⏳ En attente" :
                       order.status === "completed" ? "✅ Complétée" : order.status}
                    </span>
                    <span className="text-primary-light font-black">${Number(order.total_price).toFixed(2)}</span>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-lg bg-slate-700/50 p-2">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&q=80"}
                          alt={item.name}
                          className="h-10 w-10 rounded-md object-contain bg-slate-700"
                        />
                        <div className="flex-1">
                          <p className="text-white text-xs font-semibold">{item.name}</p>
                          <p className="text-slate-400 text-xs">Qté : {item.quantity}</p>
                        </div>
                        <span className="text-primary-light text-xs font-bold">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}