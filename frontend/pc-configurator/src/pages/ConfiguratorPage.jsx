import React, { useMemo, useState } from "react";
import BuildSummary from "../components/BuildSummary";
import { getComponents, saveBuild } from "../api/api";

const CATEGORY_LIST = ["CPU", "Motherboard", "RAM", "SSD", "GPU", "PSU", "Case", "Cooler", "Monitor", "Keyboard", "Mouse"];

const IMAGE_PLACEHOLDER = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80";

export default function ConfiguratorPage() {
  const [selectedComponents, setSelectedComponents] = useState({ CPU: null, Motherboard: null, RAM: null, SSD: null, GPU: null, PSU: null, Case: null, Cooler: null, Monitor: null, Keyboard: null, Mouse: null });
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
      if ((cat === "CPU" || cat === "MOTHERBOARD") && filtered.socket && filtered.socket !== "All") {
        options.socket = filtered.socket;
      }
      if (cat === "RAM" && filtered.ram_type && filtered.ram_type !== "All") {
        options.ram_type = filtered.ram_type;
      }
      if (cat === "GPU" && filtered.brand && filtered.brand !== "All") {
        options.brand = filtered.brand;
      }
      if (cat === "PSU" && filtered.wattage && filtered.wattage !== "All") {
        options.wattage = filtered.wattage;
      }
      if (cat === "COOLER" && filtered.cooler_type && filtered.cooler_type !== "All") {
        options.cooler_type = filtered.cooler_type;
      }
      if (cat === "SSD" && filtered.ssd_tb && filtered.ssd_tb !== "All") {
        options.ssd_tb = filtered.ssd_tb;
      }
      if (cat === "MONITOR" && filtered.monitor_size && filtered.monitor_size !== "All") {
        options.monitor_size = filtered.monitor_size;
      }

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
    const filters = {
      socket: socketFilter,
      ram_type: ramTypeFilter,
      brand: gpuBrandFilter,
      wattage: psuWattFilter,
      cooler_type: coolerTypeFilter,
      ssd_tb: ssdTbFilter,
      monitor_size: monitorSizeFilter,
    };
    loadCategoryItems(category, sortOption, filters);
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
    <div className="rounded-3xl bg-slate-900/80 p-5 lg:p-7 ring-1 ring-white/10 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Configurator</p>
          <h2 className="text-2xl font-extrabold text-white">Mon PC idéal</h2>
          <p className="text-slate-300 mt-1 text-sm">Choisis un composant et visualise tes options avec image et prix.</p>
        </div>
        <button onClick={handleSave} className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition">Sauvegarder le build</button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_LIST.map((category) => {
          const selected = selectedComponents[category];
          return (
            <button
              key={category}
              onClick={() => openModal(category)}
              className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-left hover:border-indigo-400 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{category}</span>
                <span className="text-xs text-indigo-300">{selected ? "Modifié" : "Choisir"}</span>
              </div>
              <div className="mt-2 text-xs text-slate-300">{selected ? `${selected.name} · $${selected.price}` : "Aucun sélectionné"}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <BuildSummary build={selectedList} />
      </div>

      {openCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 p-4 ring-1 ring-white/10 shadow-2xl">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white">Choisir un {openCategory}</h3>
                <p className="text-xs text-slate-300">Clique sur un composant pour le sélectionner.</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-300 mr-1">Trier:</span>
                {[
                  ["recent", "Plus récent"],
                  ["price_asc", "Prix ↑"],
                  ["price_desc", "Prix ↓"]
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => loadCategoryItems(openCategory, value, socketFilter, ramTypeFilter)}
                    className={`rounded-full px-2 py-1 text-xs ${sortOption === value ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-200 hover:bg-slate-600"}`}
                  >
                    {label}
                  </button>
                ))}
                { (openCategory === "CPU" || openCategory === "Motherboard") && (
                  <select
                    value={socketFilter}
                    onChange={(e) => {
                      const newSocket = e.target.value;
                      setSocketFilter(newSocket);
                      loadCategoryItems(openCategory, sortOption, {
                        socket: newSocket,
                        ram_type: ramTypeFilter,
                        brand: gpuBrandFilter,
                        wattage: psuWattFilter,
                        cooler_type: coolerTypeFilter,
                        ssd_tb: ssdTbFilter,
                        monitor_size: monitorSizeFilter,
                      });
                    }}
                    className="rounded-full border border-slate-500 bg-slate-800 px-2 py-1 text-xs text-white"
                  >
                    <option value="All">Socket (Tous)</option>
                    <option value="AM4">AM4</option>
                    <option value="LGA1700">LGA1700</option>
                    <option value="AM5">AM5</option>
                  </select>
                )}
                { openCategory === "RAM" && (
                  <select
                    value={ramTypeFilter}
                    onChange={(e) => {
                      const newRamType = e.target.value;
                      setRamTypeFilter(newRamType);
                      loadCategoryItems(openCategory, sortOption, {
                        socket: socketFilter,
                        ram_type: newRamType,
                        brand: gpuBrandFilter,
                        wattage: psuWattFilter,
                        cooler_type: coolerTypeFilter,
                        ssd_tb: ssdTbFilter,
                        monitor_size: monitorSizeFilter,
                      });
                    }}
                    className="rounded-full border border-slate-500 bg-slate-800 px-2 py-1 text-xs text-white"
                  >
                    <option value="All">Type RAM (Tous)</option>
                    <option value="DDR4">DDR4</option>
                    <option value="DDR5">DDR5</option>
                  </select>
                )}
                { openCategory === "GPU" && (
                  <select
                    value={gpuBrandFilter}
                    onChange={(e) => {
                      const newBrand = e.target.value;
                      setGpuBrandFilter(newBrand);
                      loadCategoryItems(openCategory, sortOption, {
                        socket: socketFilter,
                        ram_type: ramTypeFilter,
                        brand: newBrand,
                        wattage: psuWattFilter,
                        cooler_type: coolerTypeFilter,
                        ssd_tb: ssdTbFilter,
                        monitor_size: monitorSizeFilter,
                      });
                    }}
                    className="rounded-full border border-slate-500 bg-slate-800 px-2 py-1 text-xs text-white"
                  >
                    <option value="All">GPU (Tous)</option>
                    <option value="AMD">AMD</option>
                    <option value="NVIDIA">NVIDIA</option>
                  </select>
                )}
                { openCategory === "PSU" && (
                  <select
                    value={psuWattFilter}
                    onChange={(e) => {
                      const newWatt = e.target.value;
                      setPsuWattFilter(newWatt);
                      loadCategoryItems(openCategory, sortOption, {
                        socket: socketFilter,
                        ram_type: ramTypeFilter,
                        brand: gpuBrandFilter,
                        wattage: newWatt,
                        cooler_type: coolerTypeFilter,
                        ssd_tb: ssdTbFilter,
                        monitor_size: monitorSizeFilter,
                      });
                    }}
                    className="rounded-full border border-slate-500 bg-slate-800 px-2 py-1 text-xs text-white"
                  >
                    <option value="All">Wattage (Tous)</option>
                    <option value="650">650W+</option>
                    <option value="750">750W+</option>
                    <option value="850">850W+</option>
                    <option value="1000">1000W+</option>
                  </select>
                )}
                { openCategory === "Cooler" && (
                  <select
                    value={coolerTypeFilter}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setCoolerTypeFilter(newType);
                      loadCategoryItems(openCategory, sortOption, {
                        socket: socketFilter,
                        ram_type: ramTypeFilter,
                        brand: gpuBrandFilter,
                        wattage: psuWattFilter,
                        cooler_type: newType,
                        ssd_tb: ssdTbFilter,
                        monitor_size: monitorSizeFilter,
                      });
                    }}
                    className="rounded-full border border-slate-500 bg-slate-800 px-2 py-1 text-xs text-white"
                  >
                    <option value="All">Type Cooler (Tous)</option>
                    <option value="water">Watercooling</option>
                    <option value="air">Ventirad</option>
                  </select>
                )}
                { openCategory === "SSD" && (
                  <select
                    value={ssdTbFilter}
                    onChange={(e) => {
                      const newTb = e.target.value;
                      setSsdTbFilter(newTb);
                      loadCategoryItems(openCategory, sortOption, {
                        socket: socketFilter,
                        ram_type: ramTypeFilter,
                        brand: gpuBrandFilter,
                        wattage: psuWattFilter,
                        cooler_type: coolerTypeFilter,
                        ssd_tb: newTb,
                        monitor_size: monitorSizeFilter,
                      });
                    }}
                    className="rounded-full border border-slate-500 bg-slate-800 px-2 py-1 text-xs text-white"
                  >
                    <option value="All">TB (Tous)</option>
                    <option value="1">1TB</option>
                    <option value="2">2TB</option>
                    <option value="4">4TB</option>
                  </select>
                )}
                { openCategory === "Monitor" && (
                  <select
                    value={monitorSizeFilter}
                    onChange={(e) => {
                      const newSize = e.target.value;
                      setMonitorSizeFilter(newSize);
                      loadCategoryItems(openCategory, sortOption, {
                        socket: socketFilter,
                        ram_type: ramTypeFilter,
                        brand: gpuBrandFilter,
                        wattage: psuWattFilter,
                        cooler_type: coolerTypeFilter,
                        ssd_tb: ssdTbFilter,
                        monitor_size: newSize,
                      });
                    }}
                    className="rounded-full border border-slate-500 bg-slate-800 px-2 py-1 text-xs text-white"
                  >
                    <option value="All">Taille (Tous)</option>
                    <option value="24">24 pouces</option>
                    <option value="27">27 pouces</option>
                    <option value="32">32 pouces</option>
                  </select>
                )}
                <button onClick={() => setOpenCategory(null)} className="text-slate-400 hover:text-white">Fermer ✕</button>
              </div>
            </div>

            {loadingItems ? (
              <div className="text-slate-300">Chargement...</div>
            ) : categoryItems.length === 0 ? (
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-slate-300">Aucun composant trouvé pour {openCategory}.</div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categoryItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => selectItem(item)}
                    className="group rounded-xl border border-slate-700 bg-slate-800 p-3 text-left hover:border-indigo-400 transition"
                  >
                    <img
                      src={item.image || IMAGE_PLACEHOLDER}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = IMAGE_PLACEHOLDER;
                      }}
                      className="h-36 w-full rounded-md object-contain"
                    />
                    <div className="mt-2">
                      <div className="text-sm font-semibold text-white">{item.name}</div>
                      <div className="mt-1 text-xs text-slate-300">{item.description || "Pas de description"}</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-200">
                      <span className="font-semibold text-indigo-300">${Number(item.price).toFixed(2)}</span>
                      <span className="text-slate-400">Stock: {item.stock}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
