import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-10 text-center text-slate-500">
        Aucune donnée de vente pour les 7 derniers jours.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
      <h3 className="text-sm font-bold text-slate-300 mb-6 uppercase tracking-wider">
        Revenus des 7 derniers jours
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
            />
            <Area type="monotone" dataKey="ca" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCa)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}