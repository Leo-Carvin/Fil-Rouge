import React, { useMemo, useState } from "react";
import BuildSummary from "../components/BuildSummary";
import { getComponents, saveBuild } from "../api/api";
import { useCart } from "../hooks/useCart";
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
      alerts.push(`Socket incompatible : CPU ${cpu.socket} != Motherboard ${mb.socket}`);
    }
  }

  if (mb && ram) {
    if (mb.ram_type && ram.ram_type && mb.ram_type !== ram.ram_type) {
      alerts.push(`RAM incompatible : Motherboard supporte ${mb.ram_type} mais RAM selectionnee est ${ram.ram_type}`);
    }
  }

  return alerts;
}

export default function ConfiguratorPage({ onRequireAuth }) {
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
    if (!localStorage.getItem("token")) {
      onRequireAuth && onRequireAuth();
      return;
    }
    const userId = localStorage.getItem("user_id");
    const buildIds = Object.values(selectedComponents).filter(Boolean).map((item) => item.id);
    const res = await saveBuild({ user_id: userId, components: buildIds });
    alert(res.message || "PC sauvegarde !");
  };

  const selectedList = useMemo(() => Object.values(selectedComponents).filter(Boolean), [selectedComponents]);
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Configurateur PC</h1>
          <p className="text-slate-400 text-sm mt-1">Selectionnez vos composants et construisez votre configuration</p>
        </div>
        <button onClick={handleSave} className="w-full md:w-auto rounded-lg bg-slate-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-600">
          Sauvegarder le Build
        </button>
      </div>

      {/* Alerts */}
      {compatibilityAlerts.length > 0 && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
          {compatibilityAlerts.map((alert, idx) => (
            <p key={idx} className="text-yellow-300 text-sm">{alert}</p>
          ))}
        </div>
      )}

      {/* Category Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CATEGORY_LIST.map((category) => {
          const selected = selectedComponents[category];
          const isIncompatible = compatibilityAlerts.some((a) =>
            a.toLowerCase().includes(category.toLowerCase())
          );

          return (
            <button
              key={category}
              onClick={() => openModal(category)}
              className={`rounded-lg border p-4 text-left transition duration-200 ${isIncompatible ? "border-yellow-500/40 bg-slate-800/60" : "border-slate-700/50 bg-slate-800/40 hover:border-slate-600"}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{category}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isIncompatible ? "bg-yellow-500/15 text-yellow-400" : selected ? "bg-slate-600 text-slate-200" : "bg-slate-700/50 text-slate-400"}`}>
                  {isIncompatible ? "Incompatible" : selected ? "Selectionne" : "Choisir"}
                </span>
              </div>
              <div className="mt-2 text-sm text-slate-300 border-t border-slate-700/40 pt-2">
                {selected ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-200">{selected.name}</span>
                    <span className="text-slate-400">${Number(selected.price).toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="text-slate-500 italic text-xs">Aucun composant selectionne</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-2">
        <BuildSummary build={selectedList} />
      </div>

      {/* Modal */}
      {openCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 overflow-y-auto">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-slate-700/50 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Choisir un {openCategory}</h3>
                <p className="text-xs text-slate-400 mt-1">Cliquez sur un composant pour le selectionner</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500 mr-2">Trier:</span>
                {[["recent", "Recents"], ["price_asc", "Prix >"], ["price_desc", "Prix <"]].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => loadCategoryItems(openCategory, value, { socket: socketFilter, ram_type: ramTypeFilter, brand: gpuBrandFilter, wattage: psuWattFilter, cooler_type: coolerTypeFilter, ssd_tb: ssdTbFilter, monitor_size: monitorSizeFilter })}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition ${sortOption === value ? "bg-slate-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
                  >
                    {label}
                  </button>
                ))}
                <button onClick={() => setOpenCategory(null)} className="ml-2 px-3 py-1 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 transition text-xs font-medium">Fermer</button>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {(openCategory === "CPU" || openCategory === "Motherboard") && (
                <select value={socketFilter} onChange={(e) => { setSocketFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: e.target.value, ram_type: ramTypeFilter, brand: gpuBrandFilter, wattage: psuWattFilter, cooler_type: coolerTypeFilter, ssd_tb: ssdTbFilter, monitor_size: monitorSizeFilter }); }}
                  className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition focus:border-slate-500 focus:outline-none">
                  <option value="All">Socket (Tous)</option>
                  <option value="AM4">AM4</option>
                  <option value="LGA1700">LGA1700</option>
                  <option value="AM5">AM5</option>
                </select>
              )}
              {openCategory === "RAM" && (
                <select value={ramTypeFilter} onChange={(e) => { setRamTypeFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: socketFilter, ram_type: e.target.value, brand: gpuBrandFilter, wattage: psuWattFilter, cooler_type: coolerTypeFilter, ssd_tb: ssdTbFilter, monitor_size: monitorSizeFilter }); }}
                  className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition focus:border-slate-500 focus:outline-none">
                  <option value="All">Type RAM (Tous)</option>
                  <option value="DDR4">DDR4</option>
                  <option value="DDR5">DDR5</option>
                </select>
              )}
              {openCategory === "GPU" && (
                <select value={gpuBrandFilter} onChange={(e) => { setGpuBrandFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: socketFilter, ram_type: ramTypeFilter, brand: e.target.value, wattage: psuWattFilter, cooler_type: coolerTypeFilter, ssd_tb: ssdTbFilter, monitor_size: monitorSizeFilter }); }}
                  className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition focus:border-slate-500 focus:outline-none">
                  <option value="All">GPU (Tous)</option>
                  <option value="AMD">AMD</option>
                  <option value="NVIDIA">NVIDIA</option>
                </select>
              )}
              {openCategory === "PSU" && (
                <select value={psuWattFilter} onChange={(e) => { setPsuWattFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: socketFilter, ram_type: ramTypeFilter, brand: gpuBrandFilter, wattage: e.target.value, cooler_type: coolerTypeFilter, ssd_tb: ssdTbFilter, monitor_size: monitorSizeFilter }); }}
                  className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition focus:border-slate-500 focus:outline-none">
                  <option value="All">Wattage (Tous)</option>
                  <option value="650">650W+</option>
                  <option value="750">750W+</option>
                  <option value="850">850W+</option>
                  <option value="1000">1000W+</option>
                </select>
              )}
              {openCategory === "Cooler" && (
                <select value={coolerTypeFilter} onChange={(e) => { setCoolerTypeFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: socketFilter, ram_type: ramTypeFilter, brand: gpuBrandFilter, wattage: psuWattFilter, cooler_type: e.target.value, ssd_tb: ssdTbFilter, monitor_size: monitorSizeFilter }); }}
                  className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition focus:border-slate-500 focus:outline-none">
                  <option value="All">Type Cooler (Tous)</option>
                  <option value="water">Watercooling</option>
                  <option value="air">Ventirad</option>
                </select>
              )}
              {openCategory === "SSD" && (
                <select value={ssdTbFilter} onChange={(e) => { setSsdTbFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: socketFilter, ram_type: ramTypeFilter, brand: gpuBrandFilter, wattage: psuWattFilter, cooler_type: coolerTypeFilter, ssd_tb: e.target.value, monitor_size: monitorSizeFilter }); }}
                  className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition focus:border-slate-500 focus:outline-none">
                  <option value="All">Capacite (Tous)</option>
                  <option value="1">1TB</option>
                  <option value="2">2TB</option>
                  <option value="4">4TB</option>
                </select>
              )}
              {openCategory === "Monitor" && (
                <select value={monitorSizeFilter} onChange={(e) => { setMonitorSizeFilter(e.target.value); loadCategoryItems(openCategory, sortOption, { socket: socketFilter, ram_type: ramTypeFilter, brand: gpuBrandFilter, wattage: psuWattFilter, cooler_type: coolerTypeFilter, ssd_tb: ssdTbFilter, monitor_size: e.target.value }); }}
                  className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition focus:border-slate-500 focus:outline-none">
                  <option value="All">Taille (Tous)</option>
                  <option value="24">24 pouces</option>
                  <option value="27">27 pouces</option>
                  <option value="32">32 pouces</option>
                </select>
              )}
            </div>

            {loadingItems ? (
              <div className="text-center py-8 text-slate-400">Chargement des composants...</div>
            ) : categoryItems.length === 0 ? (
              <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-6 text-center text-slate-400">
                <p className="text-sm">Aucun composant trouve pour {openCategory}</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryItems.map((item) => (
                  <div key={item.id} className="group rounded-lg border border-slate-700/30 bg-slate-800/50 p-4 text-left transition duration-200 hover:border-slate-600">
                    <img
                      src={item.image || IMAGE_PLACEHOLDER}
                      alt={item.name}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
                      className="h-40 w-full rounded-lg object-contain bg-slate-700/30"
                    />
                    <div className="mt-3">
                      <div className="text-sm font-medium text-white">{item.name}</div>
                      <div className="mt-1 text-xs text-slate-400 line-clamp-2">{item.description || "Pas de description"}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="font-medium text-white">${Number(item.price).toFixed(2)}</span>
                      <span className="text-slate-500">Stock: {item.stock}</span>
                    </div>

                    <div className="mt-2 flex gap-1 flex-wrap">
                      {item.socket && (
                        <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                          {item.socket}
                        </span>
                      )}
                      {item.ram_type && (
                        <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                          {item.ram_type}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantities((prev) => ({ ...prev, [item.id]: Math.max(1, (prev[item.id] || 1) - 1) }))}
                          className="rounded-md w-8 h-8 bg-slate-700 text-slate-200 font-medium transition text-sm hover:bg-slate-600"
                        >-</button>
                        <span className="text-sm font-medium w-4 text-center text-slate-200">{quantities[item.id] || 1}</span>
                        <button
                          onClick={() => setQuantities((prev) => ({ ...prev, [item.id]: (prev[item.id] || 1) + 1 }))}
                          className="rounded-md w-8 h-8 bg-slate-700 text-slate-200 font-medium transition text-sm hover:bg-slate-600"
                        >+</button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => selectItem(item)}
                          className="flex-1 rounded-md bg-slate-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-600"
                        >Choisir</button>
                        <button
                          onClick={() => {
                            if (!localStorage.getItem("token")) {
                              onRequireAuth && onRequireAuth();
                              return;
                            }
                            addToCart(item, quantities[item.id] || 1);
                            setToast(`${item.name} ajoute au panier !`);
                          }}
                          className="flex-1 rounded-md bg-slate-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-500"
                        >Ajouter au panier</button>
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
