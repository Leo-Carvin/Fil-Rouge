import React, { useMemo, useState } from "react";
import BuildSummary from "../components/BuildSummary";
import { getComponents, saveBuild } from "../api/api";
import { useCart } from "../context/CartContext";
import Toast from "../components/Toast";

const CATEGORY_LIST = ["CPU", "Motherboard", "RAM", "SSD", "GPU", "PSU", "Case", "Cooler", "Monitor", "Keyboard", "Mouse"];
const IMAGE_PLACEHOLDER = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80";

function checkCompatibility(components) {
  const alerts = [];
  const cpu = components.CPU;
  const mb = components.Motherboard;
  const ram = components.RAM;

  if (cpu && mb) {
    if (cpu.socket && mb.socket && cpu.socket !== mb.socket) {
      alerts.push(`⚠️ Socket incompatible : CPU ${cpu.socket} ≠ Motherboard ${mb.socket}`);
    }
  }

  if (mb && ram) {
    if (mb.ram_type && ram.ram_type && mb.ram_type !== ram.ram_type) {
      alerts.push(`⚠️ RAM incompatible : Motherboard supporte ${mb.ram_type} mais RAM sélectionnée est ${ram.ram_type}`);
    }
  }

  return alerts;
}

function getIconForCategory(category) {
  const icons = {
    CPU: "⚙️",
    Motherboard: "📊",
    RAM: "🧠",
    SSD: "💾",
    GPU: "🎮",
    PSU: "⚡",
    Case: "📦",
    Cooler: "❄️",
    Monitor: "🖥️",
    Keyboard: "⌨️",
    Mouse: "🖱️",
  };
  return icons[category] || "🔧";
}

export default function ConfiguratorPage() {
  const [selectedComponents, setSelectedComponents] = useState({
    CPU: null, Motherboard: null, RAM: null, SSD: null,
    GPU: null, PSU: null, Case: null, Cooler: null,
    Monitor: null, Keyboard: null, Mouse: null
  });
  const [openCategory, setOpenCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [sortOption, setSortOption] = useState("recent");
  const [socketFilter, setSocketFilter] = useState("All");
  const [ramTypeFilter, setRamTypeFilter] = useState("All");
  const [gpuBrandFilter, setGpuBrandFilter] = useState("All");
  const [psuWattFilter, setPsuWattFilter] = useState("All");
  const [coolerTypeFilter, setCoolerTypeFilter] = useState("All");
  const [ssdTbFilter, setSsdTbFilter] = useState("All");
  const [monitorSizeFilter, setMonitorSizeFilter] = useState("All");
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const [toast, setToast] = useState(null);

  const compatibilityAlerts = useMemo(() => checkCompatibility(selectedComponents), [selectedComponents]);

  const loadCategoryItems = async (category, sort = "recent", filtered = {}) => {
    setOpenCategory(category);
    setSortOption(sort);
    setLoadingItems(true);
    setSocketFilter(filtered.socket || "All");
    setRamTypeFilter(filtered.ram_type || "All");
    setGpuBrandFilter(filtered.brand || "All");
    setPsuWattFilter(filtered.wattage || "All");
    setCoolerTypeFilter(filtered.cooler_type || "All");
    setSsdTbFilter(filtered.ssd_tb || "All");
    setMonitorSizeFilter(filtered.monitor_size || "All");

    try {
      const options = { sort };
      const cat = category.toUpperCase();
      if ((cat === "CPU" || cat === "MOTHERBOARD") && filtered.socket && filtered.socket !== "All") options.socket = filtered.socket;
      if (cat === "RAM" && filtered.ram_type && filtered.ram_type !== "All") options.ram_type = filtered.ram_type;
      if (cat === "GPU" && filtered.brand && filtered.brand !== "All") options.brand = filtered.brand;
      if (cat === "PSU" && filtered.wattage && filtered.wattage !== "All") options.wattage = filtered.wattage;
      if (cat === "COOLER" && filtered.cooler_type && filtered.cooler_type !== "All") options.cooler_type = filtered.cooler_type;
      if (cat === "SSD" && filtered.ssd_tb && filtered.ssd_tb !== "All") options.ssd_tb = filtered.ssd_tb;
      if (cat === "MONITOR" && filtered.monitor_size && filtered.monitor_size !== "All") options.monitor_size = filtered.monitor_size;

      const data = await getComponents(category, options);
      setCategoryItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement composants", err);
      setCategoryItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const openModal = (category) => {
    loadCategoryItems(category, sortOption, {
      socket: socketFilter, ram_type: ramTypeFilter, brand: gpuBrandFilter,
      wattage: psuWattFilter, cooler_type: coolerTypeFilter,
      ssd_tb: ssdTbFilter, monitor_size: monitorSizeFilter,
    });
  };

  const selectItem = (item) => {
    setSelectedComponents((prev) => ({ ...prev, [openCategory]: item }));
    setOpenCategory(null);
  };

  const handleSave = async () => {
    const buildIds = Object.values(selectedComponents).filter(Boolean).map((item) => item.id);
    const res = await saveBuild({ user_id: 1, components: buildIds });
    alert(res.message || "PC sauvegardé !");
  };

  const selectedList = useMemo(() => Object.values(selectedComponents).filter(Boolean), [selectedComponents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl bg-slate-900/80 p-6 lg:p-8 ring-2 ring-primary-light/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-primary-light">🖥️ CONFIGURATEUR PC</p>
              <h1 className="text-4xl font-black text-primary-light mt-1">Assembleur PC Personnalisé</h1>
              <p className="text-slate-300 mt-2 text-sm">Sélectionnez vos composants et construisez votre configuration</p>
            </div>
            <button onClick={handleSave} className="rounded-lg bg-primary-dark px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-light hover:text-slate-950">
              💾 Sauvegarder le Build
            </button>
          </div>
        </div>

        <div className="mt-8">
          {compatibilityAlerts.length > 0 && (
            <div className="mb-6 p-4 rounded-lg bg-yellow-900/30 border-2 border-yellow-600/50">
              {compatibilityAlerts.map((alert, idx) => (
                <p key={idx} className="text-yellow-300 text-sm font-semibold">{alert}</p>
              ))}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {CATEGORY_LIST.map((category) => {
              const selected = selectedComponents[category];
              const isIncompatible = compatibilityAlerts.some((a) =>
                a.toLowerCase().includes(category.toLowerCase())
              );

              return (
                <button
                  key={category}
                  onClick={() => openModal(category)}
                  className={`rounded-lg border-2 p-4 text-left transition duration-200 ${isIncompatible ? "border-yellow-500/70 bg-slate-900" : "border-primary-light/40 bg-slate-900 hover:border-primary-light"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold flex items-center gap-2 text-primary-light">
                      <span className="text-2xl">{getIconForCategory(category)}</span>
                      {category}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isIncompatible ? "bg-yellow-500/20 text-yellow-300" : "bg-primary-light/20 text-primary-light"}`}>
                      {isIncompatible ? "⚠️ Incompatible" : selected ? "✓ Modifié" : "→ Choisir"}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-slate-300 border-t border-slate-700/50 pt-2">
                    {selected ? (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary-light">{selected.name}</span>
                        <span className="text-slate-300">· ${Number(selected.price).toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Aucun composant sélectionné</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <BuildSummary build={selectedList} />
          </div>
        </div>
      </div>

      {openCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 p-6 ring-2 ring-primary-light/20">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-primary-light/20 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-primary-light">{getIconForCategory(openCategory)} Choisir un {openCategory}</h3>
                <p className="text-xs text-slate-400 mt-1">Cliquez sur un composant pour le sélectionner</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 mr-2">📊 Trier:</span>
                {[["recent", "Récents"], ["price_asc", "Prix ↑"], ["price_desc", "Prix ↓"]].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => loadCategoryItems(openCategory, value, { socket: socketFilter, ram_type: ramTypeFilter, brand: gpuBrandFilter, wattage: psuWattFilter, cooler_type: coolerTypeFilter, ssd_tb: ssdTbFilter, monitor_size: monitorSizeFilter })}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition ${sortOption === value ? "bg-primary-dark text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
                  >
                    {label}
                  </button>
                ))}
                <button onClick={() => setOpenCategory(null)} className="ml-2 px-3 py-1 rounded-md bg-slate-700 text-slate-300 hover:bg-red-600/40 hover:text-red-300 transition text-xs font-bold">✕ Fermer</button>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {(openCategory === "CPU" || openCategory === "Motherboard") && (
                <select value={socketFilter} onChange={(e) => { setSocketFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: e.target.value, ram_type: ramTypeFilter, brand: gpuBrandFilter, wattage: psuWattFilter, cooler_type: coolerTypeFilter, ssd_tb: ssdTbFilter, monitor_size: monitorSizeFilter }); }}
                  className="rounded-md border border-primary-light/30 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-primary-light transition focus:border-primary-light focus:outline-none">
                  <option value="All">🔌 Socket (Tous)</option>
                  <option value="AM4">AM4</option>
                  <option value="LGA1700">LGA1700</option>
                  <option value="AM5">AM5</option>
                </select>
              )}
              {openCategory === "RAM" && (
                <select value={ramTypeFilter} onChange={(e) => { setRamTypeFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: socketFilter, ram_type: e.target.value, brand: gpuBrandFilter, wattage: psuWattFilter, cooler_type: coolerTypeFilter, ssd_tb: ssdTbFilter, monitor_size: monitorSizeFilter }); }}
                  className="rounded-md border border-primary-light/30 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-primary-light transition focus:border-primary-light focus:outline-none">
                  <option value="All">💾 Type RAM (Tous)</option>
                  <option value="DDR4">DDR4</option>
                  <option value="DDR5">DDR5</option>
                </select>
              )}
              {openCategory === "GPU" && (
                <select value={gpuBrandFilter} onChange={(e) => { setGpuBrandFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: socketFilter, ram_type: ramTypeFilter, brand: e.target.value, wattage: psuWattFilter, cooler_type: coolerTypeFilter, ssd_tb: ssdTbFilter, monitor_size: monitorSizeFilter }); }}
                  className="rounded-md border border-primary-light/30 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-primary-light transition focus:border-primary-light focus:outline-none">
                  <option value="All">🎮 GPU (Tous)</option>
                  <option value="AMD">AMD</option>
                  <option value="NVIDIA">NVIDIA</option>
                </select>
              )}
              {openCategory === "PSU" && (
                <select value={psuWattFilter} onChange={(e) => { setPsuWattFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: socketFilter, ram_type: ramTypeFilter, brand: gpuBrandFilter, wattage: e.target.value, cooler_type: coolerTypeFilter, ssd_tb: ssdTbFilter, monitor_size: monitorSizeFilter }); }}
                  className="rounded-md border border-primary-light/30 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-primary-light transition focus:border-primary-light focus:outline-none">
                  <option value="All">⚡ Wattage (Tous)</option>
                  <option value="650">650W+</option>
                  <option value="750">750W+</option>
                  <option value="850">850W+</option>
                  <option value="1000">1000W+</option>
                </select>
              )}
              {openCategory === "Cooler" && (
                <select value={coolerTypeFilter} onChange={(e) => { setCoolerTypeFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: socketFilter, ram_type: ramTypeFilter, brand: gpuBrandFilter, wattage: psuWattFilter, cooler_type: e.target.value, ssd_tb: ssdTbFilter, monitor_size: monitorSizeFilter }); }}
                  className="rounded-md border border-primary-light/30 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-primary-light transition focus:border-primary-light focus:outline-none">
                  <option value="All">❄️ Type Cooler (Tous)</option>
                  <option value="water">Watercooling</option>
                  <option value="air">Ventirad</option>
                </select>
              )}
              {openCategory === "SSD" && (
                <select value={ssdTbFilter} onChange={(e) => { setSsdTbFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: socketFilter, ram_type: ramTypeFilter, brand: gpuBrandFilter, wattage: psuWattFilter, cooler_type: coolerTypeFilter, ssd_tb: e.target.value, monitor_size: monitorSizeFilter }); }}
                  className="rounded-md border border-primary-light/30 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-primary-light transition focus:border-primary-light focus:outline-none">
                  <option value="All">💽 TB (Tous)</option>
                  <option value="1">1TB</option>
                  <option value="2">2TB</option>
                  <option value="4">4TB</option>
                </select>
              )}
              {openCategory === "Monitor" && (
                <select value={monitorSizeFilter} onChange={(e) => { setMonitorSizeFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: socketFilter, ram_type: ramTypeFilter, brand: gpuBrandFilter, wattage: psuWattFilter, cooler_type: coolerTypeFilter, ssd_tb: ssdTbFilter, monitor_size: e.target.value }); }}
                  className="rounded-md border border-primary-light/30 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-primary-light transition focus:border-primary-light focus:outline-none">
                  <option value="All">🖥️ Taille (Tous)</option>
                  <option value="24">24 pouces</option>
                  <option value="27">27 pouces</option>
                  <option value="32">32 pouces</option>
                </select>
              )}
            </div>

            {loadingItems ? (
              <div className="text-center py-8 text-slate-400">⏳ Chargement des composants...</div>
            ) : categoryItems.length === 0 ? (
              <div className="rounded-lg border-2 border-slate-700 bg-slate-800/50 p-6 text-center text-slate-400">
                <p className="text-sm">❌ Aucun composant trouvé pour {openCategory}</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryItems.map((item) => (
                  <div key={item.id} className="group rounded-xl border-2 border-primary-light/20 bg-slate-900 p-4 text-left transition duration-200 hover:border-primary-light">
                    <img
                      src={item.image || IMAGE_PLACEHOLDER}
                      alt={item.name}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
                      className="h-40 w-full rounded-lg object-contain bg-slate-700/30"
                    />
                    <div className="mt-3">
                      <div className="text-sm font-bold text-primary-light">{getIconForCategory(openCategory)} {item.name}</div>
                      <div className="mt-1 text-xs text-slate-400 line-clamp-2">{item.description || "Pas de description"}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="font-bold text-primary-dark">${Number(item.price).toFixed(2)}</span>
                      <span className="text-slate-500">Stock: {item.stock}</span>
                    </div>

                    {/* Badge socket/ram_type sur la carte */}
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {item.socket && (
                        <span className="rounded-full border border-primary-light/30 bg-primary-light/10 px-2 py-0.5 text-xs font-semibold text-primary-light">
                          🔌 {item.socket}
                        </span>
                      )}
                      {item.ram_type && (
                        <span className="rounded-full border border-primary-dark/30 bg-primary-dark/10 px-2 py-0.5 text-xs font-semibold text-primary-dark">
                          💾 {item.ram_type}
                        </span>
                      )}
                    </div>

                            <div className="mt-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantities((prev) => ({ ...prev, [item.id]: Math.max(1, (prev[item.id] || 1) - 1) }))}
                          className="rounded-md w-8 h-8 bg-slate-700 text-primary-light font-bold transition text-sm hover:bg-slate-600"
                        >−</button>
                        <span className="text-sm font-semibold w-4 text-center text-primary-light">{quantities[item.id] || 1}</span>
                        <button
                          onClick={() => setQuantities((prev) => ({ ...prev, [item.id]: (prev[item.id] || 1) + 1 }))}
                          className="rounded-md w-8 h-8 bg-slate-700 text-primary-light font-bold transition text-sm hover:bg-slate-600"
                        >+</button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => selectItem(item)}
                          className="flex-1 rounded-md bg-slate-700 px-3 py-1.5 text-xs font-bold text-primary-light transition hover:bg-primary-dark hover:text-white"
                        >✓ Choisir</button>
                        <button
                          onClick={() => { addToCart(item, quantities[item.id] || 1); setToast(`${item.name} ajouté au panier !`); }}
                          className="flex-1 rounded-md bg-primary-dark px-3 py-1.5 text-xs font-bold text-white transition hover:bg-primary-light hover:text-slate-950"
                        >🛒 Ajouter</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}