import React from "react";

export default function Header({ variant }) {
  if (variant === "compact") {
    return (
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-400 via-sky-300 to-violet-400 shadow-lg" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">Configurator</p>
            <h1 className="font-bold text-2xl text-white">PC Builder Pro</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <header className="mb-6 rounded-2xl bg-slate-900/80 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">PC Configurator</p>
          <h1 className="text-2xl font-extrabold text-white">Build your dream rig</h1>
        </div>
        <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">v1.0</span>
      </div>
    </header>
  );
}
