import React, { useEffect, useState } from "react";
import {
  getAdminStats,
  getAdminOrders,
  getProducts,
  updateOrderStatus,
  updateProduct,
} from "../api/api";

import StatsCards from "../components/admin/StatsCards";
import RevenueChart from "../components/admin/RevenueChart";

const STATUS_OPTIONS = [
  { value: "pending", label: "en attente" },
  { value: "paid", label: "confirmée" },
  { value: "shipped", label: "expédiée" },
  { value: "completed", label: "livrée" },
  { value: "cancelled", label: "annulée" },
];

const STATUS_COLORS = {
  pending: "bg-yellow-500/15 text-yellow-300",
  paid: "bg-blue-500/15 text-blue-300",
  shipped: "bg-indigo-500/15 text-indigo-300",
  completed: "bg-green-500/15 text-green-300",
  cancelled: "bg-red-500/15 text-red-300",
};

const STATUS_LABEL = Object.fromEntries( STATUS_OPTIONS.map((option) => [option.value, option.label] ) );
const TABS = [
  { id: "stats", label: "Statistiques" },
  { id: "orders", label: "Commandes" },
  { id: "products", label: "Produits" },
];

// ---- ORDERS TAB ----
function OrdersTab({ orders, setOrders, setStats }) {
  const [selectedOrders, setSelectedOrders] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  const handleStatusSelect = (orderId, status) => {
    setSelectedOrders((prev) => {
      const next = { ...prev };
      if (!status) {
        delete next[orderId];
      } else {
        next[orderId] = status;
      }
      return next;
    });
  };

  const handleApplyStatus = async () => {
    const changes = Object.entries(selectedOrders).filter(([, s]) => s);
    if (changes.length === 0) return;

    if (!window.confirm(`Valider les modifications pour ${changes.length} commande(s) ?`))
      return;

    setSaving(true);
    setSaveSuccess(null);
    try {
      for (const [orderId, status] of changes) {
        await updateOrderStatus(Number(orderId), status);
      }
      const refreshedOrders = await getAdminOrders();
      setOrders(Array.isArray(refreshedOrders) ? refreshedOrders : orders);
      const refreshedStats = await getAdminStats();
      setStats(refreshedStats);
      setSelectedOrders({});
      setSaveSuccess(`Statuts mis a jour pour ${changes.length} commande(s)`);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const changesCount = Object.keys(selectedOrders).length;

  return (
    <div className="flex flex-col gap-4">
      {saveSuccess && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm text-green-300">
          {saveSuccess}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {changesCount > 0 ? (
            <span className="text-white font-medium">
              {changesCount} modification{changesCount > 1 ? "s" : ""} prete{changesCount > 1 ? "s" : ""}
            </span>
          ) : (
            <span>Selectionnez les commandes a modifier via le select gauche</span>
          )}
        </p>
        <button
          onClick={handleApplyStatus}
          disabled={changesCount === 0 || saving}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
            changesCount > 0
              ? "bg-slate-600 text-white hover:bg-slate-500"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          {saving ? "En cours..." : "Valider les changements"}
        </button>
      </div>

      <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-3 text-left font-medium w-32">Modifier</th>
                <th className="p-3 text-left font-medium">ID</th>
                <th className="p-3 text-left font-medium">Client</th>
                <th className="p-3 text-left font-medium">Montant</th>
                <th className="p-3 text-left font-medium">Date</th>
                <th className="p-3 text-left font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {orders.map((order) => {
                const selectedStatus = selectedOrders[order.id];
                const displayStatus = selectedStatus || order.status || "pending";
                return (
                  <tr
                    key={order.id}
                    className={`transition-colors ${
                      selectedStatus ? "bg-slate-700/30" : "hover:bg-slate-700/15"
                    }`}
                  >
                    <td className="p-3">
                      <SelectStatus
                        value={selectedOrders[order.id] || ""}
                        onChange={(v) => handleStatusSelect(order.id, v)}
                      />
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-xs">
                      #{order.id}
                    </td>
                    <td className="p-3 text-white font-medium">
                      {order.user_email || "Client inconnu"}
                    </td>
                    <td className="p-3 text-slate-300 font-medium">
                      ${Number(order.total_price).toFixed(2)}
                    </td>
                    <td className="p-3 text-slate-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={displayStatus} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <p className="text-sm">Aucune commande enregistree.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SelectStatus({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="w-full rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-slate-500"
    >
      <option value="">--</option>
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        STATUS_COLORS[status] || "bg-slate-700/50 text-slate-400"
      }`}
    >
      {STATUS_LABEL[status] || status}
    </span>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Chargement des donnees selon l onglet
  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  useEffect(() => {
    if (tab === "orders") getAdminOrders().then(setOrders);
  }, [tab]);

  useEffect(() => {
    if (tab === "products")
      getProducts({}).then((p) => setProducts(Array.isArray(p) ? p : []));
  }, [tab]);

  const handleSaveProduct = async () => {
    setSaving(true);
    await updateProduct(editingProduct.id, editingProduct);
    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );
    setEditingProduct(null);
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">
          Panel de controle
        </p>
        <h2 className="text-xl font-semibold text-white">Dashboard Admin</h2>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-slate-600 text-white"
                : "bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* --- STATISTIQUES --- */}
      {tab === "stats" && stats && (
        <div className="flex flex-col gap-6">
          <StatsCards stats={stats} />
          <RevenueChart data={stats.dailyStats} />
        </div>
      )}

      {/* --- COMMANDES --- */}
      {tab === "orders" && (
        <OrdersTab
          orders={orders}
          setOrders={setOrders}
          setStats={setStats}
        />
      )}

      {/* --- PRODUITS --- */}
      {tab === "products" && (
        <div className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-4 flex flex-col gap-3 hover:border-slate-600 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <span className="inline-block mt-1 rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {p.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-700/40">
                  <span className="text-white font-bold text-lg">
                    ${Number(p.price).toFixed(2)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.stock > 5
                        ? "bg-green-500/10 text-green-400"
                        : p.stock > 0
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    Stock: {p.stock}
                  </span>
                </div>

                <button
                  onClick={() => setEditingProduct({ ...p })}
                  className="mt-1 w-full rounded-md bg-slate-700 py-2 text-xs font-medium text-white hover:bg-slate-600 transition"
                >
                  Modifier le produit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MODAL D EDITION PRODUIT --- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">
              Modifier le composant
            </h3>

            <div className="space-y-3">
              {[
                { label: "Nom du produit", key: "name", type: "text" },
                { label: "Prix ($)", key: "price", type: "number" },
                { label: "Stock disponible", key: "stock", type: "number" },
              ].map(({ label, key, type }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={editingProduct[key]}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-slate-500 focus:outline-none"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-slate-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 rounded-md bg-slate-700 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-600 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={saving}
                className="flex-1 rounded-md bg-slate-600 py-2.5 text-sm font-medium text-white hover:bg-slate-500 transition disabled:opacity-50"
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
