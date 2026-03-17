import React, { useEffect, useMemo, useState } from "react";
import ComponentSelector from "../components/ComponentSelector";
import BuildSummary from "../components/BuildSummary";
import { getComponents, saveBuild } from "../api/api";

const CATEGORY_LIST = ["CPU", "Motherboard", "RAM", "SSD", "GPU", "PSU", "Case", "Cooler", "Monitor", "Keyboard", "Mouse"];

export default function ConfiguratorPage() {
  const [selectedCategory, setSelectedCategory] = useState("CPU");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState({ CPU: null, Motherboard: null, RAM: null, SSD: null, GPU: null });

  useEffect(() => {
    const type = selectedCategory;
    let param = "";

    if (type === "Motherboard" && selectedComponents.CPU?.socket) {
      param = selectedComponents.CPU.socket;
    }
    if (type === "RAM" && selectedComponents.Motherboard?.ram_type) {
      param = selectedComponents.Motherboard.ram_type;
    }

    getComponents(type, param).then(setCategoryOptions).catch(err => {
      console.error("Impossible de charger les composants", err);
      setCategoryOptions([]);
    });
  }, [selectedCategory, selectedComponents.CPU, selectedComponents.Motherboard]);

  const activeComponent = selectedComponents[selectedCategory];

  const handleSelectOption = (component) => {
    setSelectedComponents((prev) => ({ ...prev, [selectedCategory]: component }));
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
          <p className="text-slate-300 mt-1 text-sm">Choisis ta configuration et filtre par catégorie.</p>
        </div>
        <button onClick={handleSave} className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition">Sauvegarder le build</button>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_LIST.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${selectedCategory === category ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ComponentSelector title={selectedCategory} options={categoryOptions} selected={activeComponent} onSelect={handleSelectOption} />
      </div>

      <div className="mt-6">
        <BuildSummary build={selectedList} />
      </div>
    </div>
  );
}
