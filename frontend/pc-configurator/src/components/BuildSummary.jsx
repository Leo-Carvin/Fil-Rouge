import React from "react";

export default function BuildSummary({ build }) {
  const totalPrice = build.reduce((sum, item) => sum + parseFloat(item?.price || 0), 0);

  return (
    <div className="rounded-2xl bg-slate-800/80 p-4 mt-3 ring-1 ring-primary-light/20">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Résumé du PC</h3>
        <span className="text-xs text-primary-light">Prix estimé</span>
      </div>
      <ul className="mt-2 space-y-1 text-sm text-slate-200">
        {build.map(item =>
          item ? (
            <li key={item.id} className="flex justify-between px-2 py-1 rounded-md bg-slate-700/50">
              <span>{item.type}</span>
              <span className="font-semibold">${item.price}</span>
            </li>
          ) : null
        )}
      </ul>
      <div className="mt-3 border-t border-slate-700 pt-2 flex justify-between text-sm text-slate-100">
        <span>Total</span>
        <strong className="text-primary-light">${totalPrice.toFixed(2)}</strong>
      </div>
    </div>
  );
}