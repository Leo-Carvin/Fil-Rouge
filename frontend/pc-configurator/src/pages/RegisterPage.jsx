import React from "react";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="rounded-2xl bg-slate-900/80 p-5 ring-1 ring-white/10 shadow-xl">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">Inscription</p>
        <h2 className="text-2xl font-bold text-white">Créer un compte</h2>
        <p className="text-slate-300 text-sm mt-1">Rejoins la plateforme et commence à configurer ton PC.</p>
      </div>
      <RegisterForm />
    </div>
  );
}