import React, { useEffect, useState } from "react";
import { 
  getAdminStats, 
  getAdminOrders, 
  updateOrderStatus, 
  getProducts, 
  updateProduct 
} from "../api/api";

import StatsCards from "../components/admin/StatsCards";
import RevenueChart from "../components/admin/RevenueChart";

const STATUS_OPTIONS = ["en attente", "confirmée", "expédiée", "livrée", "annulée"];
const STATUS_COLORS = {
  "en attente": "bg-yellow-500/20 text-yellow-300",
  confirmée: "bg-blue-500/20 text-blue-300",
  expédiée: "bg-indigo-500/20 text-indigo-300",
  livrée: "bg-green-500/20 text-green-300",
  annulée: "bg-red-500/20 text-red-300",
};

export default function AdminPage() {
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Chargement des données selon l'onglet
  useEffect(() => { 
    getAdminStats().then(setStats); 
  }, []);

  useEffect(() => { 
    if (tab === "orders") getAdminOrders().then(setOrders); 
  }, [tab]);

  useEffect(() => { 
    if (tab === "products") getProducts({}).then(p => setProducts(Array.isArray(p) ? p : [])); 
  }, [tab]);

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleSaveProduct = async () => {
    setSaving(true);
    await updateProduct(editingProduct.id, editingProduct);
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* --- HEADER & NAVIGATION --- */}
      <div className="rounded-2xl bg-slate-900/80 ring-1 ring-white/10 p-5 shadow-xl backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.2em] text-indigo-400 font-bold">Panel de contrôle</p>
        <h2 className="text-2xl font-black text-white">Dashboard Admin</h2>
        
        <div className="mt-5 flex gap-2 flex-wrap">
          {[
            { id: "stats", label: "📊 Statistiques", color: "bg-indigo-500" },
            { id: "orders", label: "📦 Commandes", color: "bg-indigo-500" },
            { id: "products", label: "🛒 Produits", color: "bg-indigo-500" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                tab === item.id 
                ? `${item.color} text-white shadow-lg shadow-indigo-500/20 scale-105` 
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTENU DE L'ONGLET STATS --- */}
      {tab === "stats" && stats && (
        <div className="space-y-6">
          <StatsCards stats={stats} />
          <RevenueChart data={stats.dailyStats} />
        </div>
      )}

      {/* --- CONTENU DE L'ONGLET COMMANDES --- */}
      {tab === "orders" && (
        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Client</th>
                  <th className="p-4 text-left">Montant</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 text-slate-400 font-mono">#{order.id}</td>
                    <td className="p-4 text-white font-medium">{order.user_email || "Client inconnu"}</td>
                    <td className="p-4 text-indigo-300 font-bold">${Number(order.total_price).toFixed(2)}</td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status || "en attente"}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold border-0 cursor-pointer outline-none transition-all ${STATUS_COLORS[order.status || "en attente"]}`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <span className="text-4xl mb-2">📦</span>
              <p>Aucune commande enregistrée pour le moment.</p>
            </div>
          )}
        </div>
      )}

      {/* --- CONTENU DE L'ONGLET PRODUITS --- */}
      {tab === "products" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="group rounded-2xl border border-slate-700 bg-slate-800/50 p-5 flex flex-col gap-3 hover:border-indigo-500/50 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">{p.name}</p>
                  <span className="inline-block mt-1 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {p.type}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-700/50">
                <span className="text-indigo-300 font-black text-lg">${Number(p.price).toFixed(2)}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  p.stock > 5 ? "bg-green-500/10 text-green-400" : 
                  p.stock > 0 ? "bg-yellow-500/10 text-yellow-400" : 
                  "bg-red-500/10 text-red-400"
                }`}>
                  Stock: {p.stock}
                </span>
              </div>
              
              <button
                onClick={() => setEditingProduct({ ...p })}
                className="mt-2 w-full rounded-xl bg-slate-700 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition-colors"
              >
                ✏️ Modifier le produit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL D'ÉDITION PRODUIT --- */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 ring-1 ring-white/10 p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-black text-white mb-6">Modifier le composant</h3>
            
            <div className="space-y-4">
              {[
                { label: "Nom du produit", key: "name", type: "text" },
                { label: "Prix ($)", key: "price", type: "number" },
                { label: "Stock disponible", key: "stock", type: "number" },
              ].map(({ label, key, type }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                  <input
                    type={type}
                    value={editingProduct[key]}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, [key]: e.target.value }))}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                  />
                </div>
              ))}
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setEditingProduct(null)} 
                className="flex-1 rounded-full bg-slate-800 py-3 text-sm font-bold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleSaveProduct} 
                disabled={saving} 
                className="flex-1 rounded-full bg-indigo-500 py-3 text-sm font-bold text-white hover:bg-indigo-400 transition-all disabled:opacity-50"
              >
                {saving ? "Sauvegarde..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}