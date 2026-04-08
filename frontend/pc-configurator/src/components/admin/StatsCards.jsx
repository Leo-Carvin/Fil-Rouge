import React from "react";

export default function StatsCards({ stats }) {
  const cards = [
    { label: "Commandes totales", value: stats.total_orders, color: "text-indigo-300" },
    { label: "Chiffre d'affaires", value: `$${Number(stats.revenue).toFixed(2)}`, color: "text-green-300" },
    { label: "Utilisateurs", value: stats.total_users, color: "text-blue-300" },
    { label: "Produits", value: stats.total_products, color: "text-yellow-300" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, color }) => (
        <div key={label} className="rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">{label}</p>
          <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}