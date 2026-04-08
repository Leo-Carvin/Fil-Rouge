import React, { useState } from "react";
import { loginUser } from "../api/api";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
  e.preventDefault();
  const res = await loginUser(email, password);
  if (res.token) {
    localStorage.setItem("token", res.token);
    localStorage.setItem("user_id", res.user.id);
    localStorage.setItem("user_email", res.user.email);
    localStorage.setItem("user_role", res.user.role); // ← ajoute ça
    onLogin(res.user.role); // ← passe le rôle à App.jsx
    } else {
      alert(res.message || "Erreur de connexion");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-200" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/40"
          placeholder="ton@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-200" htmlFor="login-password">Mot de passe</label>
        <input
          id="login-password"
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
        Se connecter
      </button>
    </form>
  );
}