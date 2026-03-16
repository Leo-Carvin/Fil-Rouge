import React, { useEffect, useState } from "react";
import ComponentSelector from "../components/ComponentSelector";
import BuildSummary from "../components/BuildSummary";
import { getComponents, saveBuild } from "../api/api";

export default function ConfiguratorPage() {
  const [cpus, setCpus] = useState([]);
  const [motherboards, setMotherboards] = useState([]);
  const [ram, setRam] = useState([]);

  const [selectedCPU, setSelectedCPU] = useState(null);
  const [selectedMotherboard, setSelectedMotherboard] = useState(null);
  const [selectedRAM, setSelectedRAM] = useState(null);

  useEffect(() => { getComponents("cpus").then(setCpus); }, []);
  useEffect(() => { if (selectedCPU) getComponents("motherboards", selectedCPU.socket || "").then(setMotherboards); }, [selectedCPU]);
  useEffect(() => { if (selectedMotherboard) getComponents("ram", selectedMotherboard.ram_type || "").then(setRam); }, [selectedMotherboard]);

  const handleSave = async () => {
    const build = [selectedCPU, selectedMotherboard, selectedRAM].filter(Boolean);
    const res = await saveBuild({ user_id: 1, components: build });
    alert(res.message || "PC sauvegardé !");
  };

  return (
    <div className="rounded-3xl bg-slate-900/80 p-5 lg:p-7 ring-1 ring-white/10 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Configurator</p>
          <h2 className="text-2xl font-extrabold text-white">Mon PC idéal</h2>
          <p className="text-slate-300 mt-1 text-sm">Choisis ta configuration pour un PC optimal.</p>
        </div>
        <button onClick={handleSave} className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition">Sauvegarder le build</button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <ComponentSelector title="CPU" options={cpus} selected={selectedCPU} onSelect={setSelectedCPU} />
        <ComponentSelector title="Carte mère" options={motherboards} selected={selectedMotherboard} onSelect={setSelectedMotherboard} />
        <ComponentSelector title="RAM" options={ram} selected={selectedRAM} onSelect={setSelectedRAM} />
      </div>

      <div className="mt-6">
        <BuildSummary build={[selectedCPU, selectedMotherboard, selectedRAM]} />
      </div>
    </div>
  );
}
