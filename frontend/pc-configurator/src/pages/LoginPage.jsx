import React from "react";
import LoginForm from "../components/LoginForm";

export default function LoginPage({ onLogin }) {
  return (
    <div className="rounded-2xl bg-slate-900/80 p-5 ring-1 ring-primary-light/20">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-primary-light">Connexion</p>
        <h2 className="text-2xl font-bold text-white">Bienvenue</h2>
        <p className="text-slate-300 text-sm mt-1">Accède à ton configurateur PC en quelques clics.</p>
      </div>
      <LoginForm onLogin={onLogin} />
    </div>
  );
}