import React, { useEffect, useState, useCallback } from "react";
import { getProducts } from "../api/api";
import { useCart } from "../context/CartContext";
import Toast from "../components/Toast";

const IMAGE_PLACEHOLDER = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80";
const CATEGORY_LIST = ["All", "CPU", "Motherboard", "RAM", "SSD", "GPU", "PSU", "Case", "Cooler", "Monitor", "Keyboard", "Mouse"];

export default function ShopPage({ onRequireAuth }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sort, setSort] = useState("recent");
  const [quantities, setQuantities] = useState({});
  const [toast, setToast] = useState(null);
  const { addToCart } = useCart();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        type: typeFilter !== "All" ? typeFilter : undefined,
        search: search || undefined,
        sort,
      });
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, search, sort]);

  useEffect(() => {
    const delay = setTimeout(fetchProducts, 300);
    return () => clearTimeout(delay);
  }, [fetchProducts]);

  const handleAddToCart = (item) => {
    if (!localStorage.getItem("token")) {
      onRequireAuth && onRequireAuth();
      return;
    }
    addToCart(item, quantities[item.id] || 1);
    setToast(`${item.name} ajouté au panier !`);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-slate-900/80 ring-1 ring-white/10 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-primary-light">Boutique</p>
        <h2 className="text-2xl font-extrabold text-white">Tous les produits</h2>
        <p className="text-slate-400 text-sm mt-1">Parcours notre catalogue et ajoute directement au panier.</p>

        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Rechercher un produit..."
            className="rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/40 w-56"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none"
          >
            <option value="recent">Plus récent</option>
            <option value="price_asc">Prix ↑</option>
            <option value="price_desc">Prix ↓</option>
          </select>
          <span className="ml-auto text-xs text-slate-400">
            {loading ? "Chargement..." : `${products.length} produit${products.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat}
              onClick={() => setTypeFilter(cat)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                typeFilter === cat ? "bg-primary-dark text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Chargement des produits...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-slate-400">Aucun produit trouvé.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-700 bg-slate-800 p-3 flex flex-col hover:border-indigo-400 transition">
              <img
                src={item.image || IMAGE_PLACEHOLDER}
                alt={item.name}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
                className="h-36 w-full rounded-md object-contain bg-slate-700/50"
              />
              <div className="mt-3 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-sm font-semibold text-white leading-tight">{item.name}</p>
                  <span className="shrink-0 rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">{item.type}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">{item.description || "Pas de description"}</p>

                <div className="mt-2 flex gap-1 flex-wrap">
                  {item.socket && <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">🔌 {item.socket}</span>}
                  {item.ram_type && <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">💾 {item.ram_type}</span>}
                </div>

                <div className="mt-auto pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-indigo-300 font-black text-base">${Number(item.price).toFixed(2)}</span>
                    <span className="text-xs text-slate-400">Stock: {item.stock}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantities((prev) => ({ ...prev, [item.id]: Math.max(1, (prev[item.id] || 1) - 1) }))}
                      className="rounded-full w-7 h-7 bg-slate-700 text-white font-bold hover:bg-slate-600 transition text-sm"
                    >−</button>
                    <span className="text-sm text-white font-semibold w-4 text-center">{quantities[item.id] || 1}</span>
                    <button
                      onClick={() => setQuantities((prev) => ({ ...prev, [item.id]: (prev[item.id] || 1) + 1 }))}
                      className="rounded-full w-7 h-7 bg-slate-700 text-white font-bold hover:bg-slate-600 transition text-sm"
                    >+</button>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-400 transition"
                    >🛒 Ajouter</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}