import React, { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem("cookie_consent", "refused");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl ring-1 ring-white/10 animate-fade-in-up">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">🍪 Ce site utilise des cookies</p>
            <p className="mt-1 text-xs text-slate-400">
              Nous utilisons uniquement des cookies essentiels au fonctionnement du site (authentification). Aucun cookie publicitaire ou de tracking.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={refuse}
              className="rounded-full border border-slate-600 px-4 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Refuser
            </button>
            <button
              onClick={accept}
              className="rounded-full bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-400 transition"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}