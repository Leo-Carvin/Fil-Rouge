import React, { useState } from "react";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import { useCart } from "./context/CartContext";
import { createOrder, getProducts } from "./api/api";
import ShopPage from "./pages/ShopPage";
import AdminPage from "./pages/AdminPage";
import CookieBanner from "./components/CookieBanner";


const FEATURES = [
  { icon: "⚡", title: "Compatibilité intelligente", desc: "Alertes automatiques si tes composants sont incompatibles." },
  { icon: "🛒", title: "Boutique complète", desc: "Parcours tout le catalogue et ajoute au panier en un clic." },
  { icon: "📦", title: "Suivi de commandes", desc: "Historique complet de tes commandes dans ton profil." },
  { icon: "📧", title: "Confirmation par email", desc: "Reçois un email récapitulatif à chaque commande passée." },
];

const IMAGE_PLACEHOLDER = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80";

function ShopPreview({ onRequireAuth }) {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    getProducts({ sort: "recent" }).then(data => {
      setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
    });
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((item) => (
        <div key={item.id} className="rounded-xl border border-slate-700 bg-slate-800 p-3 flex flex-col">
          <img
            src={item.image || IMAGE_PLACEHOLDER}
            alt={item.name}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
            className="h-32 w-full rounded-md object-contain bg-slate-700/50"
          />
          <div className="mt-2 flex-1 flex flex-col">
            <p className="text-sm font-semibold text-white leading-tight">{item.name}</p>
            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-indigo-300 font-black">${Number(item.price).toFixed(2)}</span>
              <span className="shrink-0 rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">{item.type}</span>
            </div>
            <button
              onClick={onRequireAuth}
              className="mt-2 w-full rounded-full bg-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500 hover:text-white transition"
            >
              🛒 Ajouter au panier
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function LandingPage({ onGoLogin, onGoRegister, onRequireAuth }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-block rounded-full bg-indigo-500/20 px-4 py-1.5 text-xs font-semibold text-indigo-300 tracking-widest uppercase mb-6">
          Configurateur PC en ligne
        </div>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight max-w-3xl">
          Monte ton PC
          <span className="text-indigo-400"> parfait.</span>
        </h1>
        <p className="mt-6 text-slate-400 text-lg max-w-xl leading-relaxed">
          Choisis tes composants, vérifie la compatibilité en temps réel et commande en quelques clics.
        </p>
        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <button
            onClick={onGoRegister}
            className="rounded-full bg-indigo-500 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/30"
          >
            Créer un compte gratuit
          </button>
          <button
            onClick={onGoLogin}
            className="rounded-full bg-slate-800 px-8 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 transition ring-1 ring-slate-700"
          >
            Se connecter
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 pb-10 max-w-5xl mx-auto w-full">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col gap-3">
              <span className="text-3xl">{icon}</span>
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          {[
            { value: "100+", label: "Composants disponibles" },
            { value: "3", label: "Secondes pour configurer" },
            { value: "100%", label: "Compatibilité vérifiée" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-black text-indigo-400">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Aperçu boutique */}
      <div className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">Catalogue</p>
            <h2 className="text-2xl font-black text-white">Nos produits</h2>
          </div>
          <button
            onClick={onGoLogin}
            className="rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 ring-1 ring-slate-700 transition"
          >
            Se connecter pour acheter →
          </button>
        </div>

        <ShopPreview onRequireAuth={onRequireAuth} />

        {/* CTA bas */}
        <div className="mt-8 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-8 text-center">
          <h2 className="text-2xl font-black text-white">Prêt à construire ton PC ?</h2>
          <p className="text-slate-400 text-sm mt-2">Rejoins PCStore et configure ton setup idéal.</p>
          <div className="mt-6 flex gap-4 justify-center flex-wrap">
            <button
              onClick={onGoRegister}
              className="rounded-full bg-indigo-500 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-400 transition"
            >
              Créer un compte
            </button>
            <button
              onClick={onGoLogin}
              className="rounded-full bg-slate-800 px-8 py-3 text-sm font-bold text-slate-300 hover:bg-slate-700 transition ring-1 ring-slate-700"
            >
              Se connecter
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">© 2025 PCStore — Tous droits réservés</p>
      </div>
    </div>
  );
}

export default function App() {
  const [logged, setLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [activePage, setActivePage] = useState("configurator");
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const { cart, clearCart, clearCartLocal, loadCart } = useCart();

  // Auto-login au montage du composant
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("user_role");
    if (token) {
      setLogged(true);
      setUserRole(role);
      loadCart();
    }
  }, [loadCart]);

  const requireAuth = (targetPage) => {
    setRedirectAfterLogin(targetPage);
    setActivePage("login");
  };

  const handleOrder = async () => {
    if (cart.length === 0) return;
    const items = cart.map((i) => ({
      product_id: i.id,
      quantity: i.quantity,
      price: i.price,
    }));
    const res = await createOrder(items);
    if (res.orderId) {
      clearCart();
      setActivePage("configurator");
      alert(`✅ Commande #${res.orderId} passée avec succès !`);
    } else {
      alert("❌ Erreur lors de la commande");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    clearCartLocal();
    setLogged(false);
    setUserRole(null);
    setActivePage("configurator");
  };

  // App principale
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-slate-800/80 p-6 ring-1 ring-primary-light/20">
        <div className="flex items-center justify-between mb-6">
          <Header />
          <div className="flex gap-2 flex-wrap justify-end">
            <button
              onClick={() => setActivePage("configurator")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activePage === "configurator" ? "bg-primary-dark text-white" : "bg-slate-700 text-slate-200 hover:bg-slate-600"}`}
            >
              Configurateur
            </button>
            <button
              onClick={() => setActivePage("shop")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activePage === "shop" ? "bg-primary-dark text-white" : "bg-slate-700 text-slate-200 hover:bg-slate-600"}`}
            >
              🏪 Boutique
            </button>
            <button
              onClick={() => {
                if (!logged) {
                  requireAuth("cart");
                } else {
                  setActivePage("cart");
                }
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition flex items-center gap-2 ${activePage === "cart" ? "bg-primary-dark text-white" : "bg-slate-700 text-slate-200 hover:bg-slate-600"}`}
            >
              🛒 Panier
              {logged && cart.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{cart.length}</span>
              )}
            </button>
            
            {!logged ? (
              <button
                onClick={() => setActivePage("login")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activePage === "login" ? "bg-primary-dark text-white" : "bg-slate-700 text-slate-200 hover:bg-slate-600"}`}
              >
                🔑 Connexion
              </button>
            ) : (
              <>
                <button
                  onClick={() => setActivePage("profile")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activePage === "profile" ? "bg-primary-dark text-white" : "bg-slate-700 text-slate-200 hover:bg-slate-600"}`}
                >
                  👤 Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-full px-4 py-2 text-sm font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/40 transition"
                >
                  Déconnexion
                </button>
              </>
            )}

            {logged && userRole === "admin" && (
              <button
                onClick={() => setActivePage("admin")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activePage === "admin" ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-200 hover:bg-slate-600"}`}
              >
                🛡️ Admin
              </button>
            )}
          </div>
        </div>

        {activePage === "configurator" && <ConfiguratorPage onRequireAuth={() => requireAuth("configurator")} />}
        {activePage === "cart" && logged && <CartPage onOrder={handleOrder} />}
        {activePage === "profile" && logged && <ProfilePage onLogout={handleLogout} />}
        {activePage === "shop" && <ShopPage onRequireAuth={() => requireAuth("shop")} />}
        {activePage === "admin" && logged && userRole === "admin" && <AdminPage />}
        {activePage === "login" && !logged && (
          <LoginPage onLogin={async (role) => {
              setLogged(true);
              setUserRole(role);
              await loadCart(); 
              if (redirectAfterLogin) {
                setActivePage(redirectAfterLogin);
                setRedirectAfterLogin(null);
              } else {
                setActivePage("configurator");
              }
            }} />
        )}
      </div>
      <CookieBanner />
    </div>
  );
}

