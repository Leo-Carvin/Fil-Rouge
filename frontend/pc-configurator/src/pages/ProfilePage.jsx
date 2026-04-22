import React, { useEffect, useState } from "react";
import { getUserOrders } from "../api/api";

async function deleteAccount() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/auth/delete-account`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export default function ProfilePage({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showRgpd, setShowRgpd] = useState(false);
  const email = localStorage.getItem("user_email");

  useEffect(() => {
    getUserOrders().then((data) => {
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const handleDeleteAccount = async () => {
      console.log('TOKEN ENVOYÉ:', localStorage.getItem("token")) // ← ajoute ça

    setDeleteLoading(true);
    
    try {
      const res = await deleteAccount();
      if (res.message === "Compte supprimé définitivement") {
        localStorage.clear();
        onLogout();
      } else {
        alert(res.message || "Erreur lors de la suppression");
      }
    } catch {
      alert("Erreur serveur");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Carte profil */}
      <div className="rounded-2xl bg-slate-900/80 ring-1 ring-white/10 p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-black text-white">
            {email ? email[0].toUpperCase() : "U"}
          </div>
          <div>
            <p className="text-white font-bold text-lg">{email || "Utilisateur"}</p>
            <p className="text-slate-400 text-xs">{orders.length} commande{orders.length !== 1 ? "s" : ""} passée{orders.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      {/* Section RGPD — Mes données */}
      <div className="rounded-2xl bg-slate-900/80 ring-1 ring-white/10 p-5">
        <button
          onClick={() => setShowRgpd(v => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <div>
            <p className="text-white font-bold">🛡️ Mes données personnelles</p>
            <p className="text-slate-400 text-xs mt-0.5">Vos droits RGPD — accès, portabilité, suppression</p>
          </div>
          <span className="text-slate-400 text-sm">{showRgpd ? "▲" : "▼"}</span>
        </button>

        {showRgpd && (
          <div className="mt-4 space-y-3 animate-fade-in">

            {/* Données stockées */}
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p className="text-sm font-semibold text-white mb-2">📋 Données que nous stockons</p>
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Email</span>
                  <span>{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mot de passe</span>
                  <span>Hashé (bcrypt) — non lisible</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Commandes</span>
                  <span>{orders.length} enregistrée{orders.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cookies</span>
                  <span>{localStorage.getItem("cookie_consent") || "Non défini"}</span>
                </div>
              </div>
            </div>

            {/* Droits RGPD */}
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p className="text-sm font-semibold text-white mb-2">⚖️ Vos droits</p>
              <div className="space-y-1.5 text-xs text-slate-300">
                <p>✅ <strong className="text-white">Droit d'accès</strong> — vos données sont visibles ci-dessus</p>
                <p>✅ <strong className="text-white">Droit de portabilité</strong> — exportez vos données via le bouton ci-dessous</p>
                <p>✅ <strong className="text-white">Droit à l'oubli</strong> — supprimez définitivement votre compte</p>
                <p>✅ <strong className="text-white">Droit de rectification</strong> — contactez-nous à <span className="text-indigo-400">privacy@pcconfig.fr</span></p>
              </div>
            </div>

            {/* Export données */}
            <button
              onClick={() => {
                const data = {
                  email,
                  cookie_consent: localStorage.getItem("cookie_consent"),
                  orders: orders.map(o => ({
                    id: o.id,
                    date: o.created_at,
                    total: o.total_price,
                    status: o.status,
                  }))
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "mes-donnees-pcconfig.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/20 transition"
            >
              📥 Exporter mes données (JSON)
            </button>

            {/* Suppression compte */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition"
            >
              🗑️ Supprimer définitivement mon compte
            </button>
          </div>
        )}
      </div>

      {/* Historique commandes */}
      <div className="rounded-2xl bg-slate-900/80 ring-1 ring-white/10 p-5">
        <h2 className="text-lg font-extrabold text-white mb-4">📦 Historique des commandes</h2>

        {loading ? (
          <p className="text-slate-400 text-sm">Chargement...</p>
        ) : orders.length === 0 ? (
          <p className="text-slate-400 text-sm">Aucune commande pour le moment.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order, i) => (
              <div
                key={order.id}
                className="animate-fade-in-up rounded-xl border border-slate-700 bg-slate-800 p-4"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-bold text-sm">Commande #{order.id}</p>
                    <p className="text-slate-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === "pending"   ? "bg-yellow-500/20 text-yellow-300" :
                      order.status === "completed" ? "bg-green-500/20 text-green-300"  :
                      "bg-slate-700 text-slate-300"
                    }`}>
                      {order.status === "pending" ? "⏳ En attente" :
                       order.status === "completed" ? "✅ Complétée" : order.status}
                    </span>
                    <span className="text-indigo-300 font-black">${Number(order.total_price).toFixed(2)}</span>
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
                        <span className="text-indigo-300 text-xs font-bold">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal confirmation suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 ring-1 ring-white/10 p-6 shadow-2xl animate-scale-in">
            <p className="text-lg font-extrabold text-white">⚠️ Supprimer mon compte</p>
            <p className="mt-2 text-sm text-slate-300">
              Cette action est <strong className="text-red-400">irréversible</strong>. Toutes tes données (compte, commandes) seront définitivement effacées conformément au RGPD.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl border border-slate-600 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-500 transition disabled:opacity-50"
              >
                {deleteLoading ? "Suppression..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}