import React, { useState } from "react";
import { loginUser, registerUser } from "../api/api";

// Validation mot de passe fort
function validatePassword(password) {
  const rules = [
    { test: password.length >= 8,            label: "8 caractères minimum" },
    { test: /[A-Z]/.test(password),          label: "Une majuscule" },
    { test: /[0-9]/.test(password),          label: "Un chiffre" },
    { test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), label: "Un caractère spécial" },
  ];
  return rules;
}

export default function LoginForm({ onLogin }) {
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  const passwordRules = validatePassword(password);
  const allRulesOk = passwordRules.every(r => r.test);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user_id", res.user.id);
        localStorage.setItem("user_email", res.user.email);
        localStorage.setItem("user_role", res.user.role);
        onLogin(res.user.role);
      } else {
        setError(res.message || "Identifiants incorrects");
      }
    } catch {
      setError("Erreur serveur, réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!allRulesOk)
      return setError("Ton mot de passe ne respecte pas toutes les règles.");
    if (password !== confirmPassword)
      return setError("Les mots de passe ne correspondent pas.");
    if (!consent)
      return setError("Tu dois accepter la politique de confidentialité pour créer un compte.");

    setLoading(true);
    try {
      const res = await registerUser(email, password);
      if (res.message === "Compte créé avec succès") {
        setSuccess("Compte créé ! Tu peux maintenant te connecter.");
        setTab("login");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(res.message || "Erreur lors de l'inscription");
      }
    } catch {
      setError("Erreur serveur, réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Onglets */}
      <div className="flex rounded-xl overflow-hidden border border-slate-700">
        <button
          onClick={() => { setTab("login"); setError(null); setSuccess(null); }}
          className={`flex-1 py-2 text-sm font-semibold transition ${tab === "login" ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
        >
          Se connecter
        </button>
        <button
          onClick={() => { setTab("register"); setError(null); setSuccess(null); }}
          className={`flex-1 py-2 text-sm font-semibold transition ${tab === "register" ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
        >
          Créer un compte
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          ✅ {success}
        </div>
      )}

      {/* Formulaire Connexion */}
      {tab === "login" && (
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-200">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="ton@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-200">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 pr-10 text-sm text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      )}

      {/* Formulaire Inscription */}
      {tab === "register" && (
        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-200">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="ton@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-200">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 pr-10 text-sm text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Indicateur règles mot de passe */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                {passwordRules.map((rule, i) => (
                  <div key={i} className={`flex items-center gap-2 text-xs ${rule.test ? "text-green-400" : "text-slate-400"}`}>
                    <span>{rule.test ? "✅" : "○"}</span>
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-200">Confirmer le mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full rounded-xl border px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 bg-slate-800 focus:outline-none focus:ring-2 transition ${
                confirmPassword.length > 0
                  ? password === confirmPassword
                    ? "border-green-500 focus:ring-green-500/40"
                    : "border-red-500 focus:ring-red-500/40"
                  : "border-slate-700 focus:border-indigo-400 focus:ring-indigo-500/40"
              }`}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="mt-1 text-xs text-red-400">Les mots de passe ne correspondent pas</p>
            )}
          </div>

          {/* Consentement RGPD */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-0.5 accent-indigo-500"
            />
            <span className="text-xs text-slate-300">
              J'accepte la{" "}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-privacy"))}
                className="text-indigo-400 underline hover:text-indigo-300"
              >
                politique de confidentialité
              </button>{" "}
              et le traitement de mes données personnelles conformément au RGPD.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !allRulesOk || password !== confirmPassword || !consent}
            className="w-full rounded-xl bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>
      )}
    </div>
  );
}