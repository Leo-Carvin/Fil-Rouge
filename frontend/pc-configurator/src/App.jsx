// src/App.jsx
import React, { useState } from "react";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ConfiguratorPage from "./pages/ConfiguratorPage";

export default function App() {
  const [page, setPage] = useState("login");
  const [logged, setLogged] = useState(false);

  if (!logged) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-3xl bg-slate-900/80 ring-1 ring-white/10 shadow-2xl backdrop-blur">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
            <div className="p-8 lg:p-10 bg-gradient-to-br from-indigo-600 via-sky-600 to-violet-500 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
              <h1 className="text-4xl font-black tracking-tight text-white">PC Configurator</h1>
              <p className="mt-4 text-indigo-100 text-sm leading-relaxed">
                Crée ton PC hautes performances rapidement avec un assistant moderne. Choisis ton setup, compare et sauvegarde.
              </p>
              <div className="mt-8 flex gap-2">
                <button
                  onClick={() => setPage("login")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${page === "login" ? "bg-white text-slate-900" : "bg-white/20 text-indigo-100 hover:bg-white/30"}`}
                >
                  Se connecter
                </button>
                <button
                  onClick={() => setPage("register")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${page === "register" ? "bg-white text-slate-900" : "bg-white/20 text-indigo-100 hover:bg-white/30"}`}
                >
                  Créer un compte
                </button>
              </div>
            </div>
            <div className="p-6 lg:p-8">
              <Header variant="compact" />
              {page === "login" ? (
                <LoginPage onLogin={() => setLogged(true)} />
              ) : (
                <RegisterPage />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-slate-800/80 p-6 ring-1 ring-white/10 shadow-2xl">
        <Header />
        <ConfiguratorPage />
      </div>
    </div>
  );
}
