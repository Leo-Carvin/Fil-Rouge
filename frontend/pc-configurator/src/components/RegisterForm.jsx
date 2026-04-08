import React, { useState } from "react";
import { registerUser } from "../api/api";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await registerUser(email, password);
    alert(res.message || "Erreur lors de la création du compte");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-200" htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/40"
          placeholder="ton@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-200" htmlFor="register-password">Mot de passe</label>
        <input
          id="register-password"
          type="password"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/40"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-primary-dark px-3 py-2 text-sm font-semibold text-white hover:bg-primary-light hover:text-slate-950 transition"
      >
        Créer un compte
      </button>
    </form>
  );
}