import React from "react";

export default function ComponentSelector({ title, options, selected, onSelect }) {
  return (
    <div className="rounded-2xl bg-slate-800/80 p-3 ring-1 ring-white/10">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        {selected && <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-200">Sélectionné</span>}
      </div>
      <select
        value={selected?.id || ""}
        onChange={e => onSelect(options.find(o => o.id === parseInt(e.target.value)))}
        className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      >
        <option value="">-- Sélectionner --</option>
        {options.map(o => (
          <option key={o.id} value={o.id}>{o.name} - ${o.price}</option>
        ))}
      </select>
    </div>
  );
}
