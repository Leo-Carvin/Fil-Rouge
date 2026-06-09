import ShopPreview from "../components/shop/ShopPreview"

const FEATURES = [
  { icon: "⚡", title: "Compatibilité intelligente", desc: "Alertes automatiques si tes composants sont incompatibles." },
  { icon: "🛒", title: "Boutique complète", desc: "Parcours tout le catalogue et ajoute au panier en un clic." },
  { icon: "📦", title: "Suivi de commandes", desc: "Historique complet de tes commandes dans ton profil." },
  { icon: "📧", title: "Confirmation par email", desc: "Reçois un email récapitulatif à chaque commande passée." },
]

const STATS = [
  { value: "100+", label: "Composants disponibles" },
  { value: "3", label: "Secondes pour configurer" },
  { value: "100%", label: "Compatibilité vérifiée" },
]

export default function LandingPage({ onGoLogin, onGoRegister, onRequireAuth }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-block rounded-full bg-indigo-500/20 px-4 py-1.5 text-xs font-semibold text-indigo-300 tracking-widest uppercase mb-6">
          Configurateur PC en ligne
        </div>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight max-w-3xl">
          Monte ton PC
          <span className="text-indigo-400"> parfait.</span>
        </h1>
        <p className="mt-6 text-slate-400 text-lg max-w-xl leading-relaxed">
          Choisis tes composants, vérifie la compatibilité en temps réel et commande en quelques clics.
        </p>
        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <button
            onClick={onGoRegister}
            className="rounded-full bg-indigo-500 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/30"
          >
            Créer un compte gratuit
          </button>
          <button
            onClick={onGoLogin}
            className="rounded-full bg-slate-800 px-8 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 transition ring-1 ring-slate-700"
          >
            Se connecter
          </button>
        </div>
      </div>

      <div className="px-6 pb-10 max-w-5xl mx-auto w-full">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col gap-3">
              <span className="text-3xl">{icon}</span>
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-black text-indigo-400">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">Catalogue</p>
            <h2 className="text-2xl font-black text-white">Nos produits</h2>
          </div>
          <button
            onClick={onGoLogin}
            className="rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 ring-1 ring-slate-700 transition"
          >
            Se connecter pour acheter →
          </button>
        </div>

        <ShopPreview onRequireAuth={onRequireAuth} />

        <div className="mt-8 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-8 text-center">
          <h2 className="text-2xl font-black text-white">Prêt à construire ton PC ?</h2>
          <p className="text-slate-400 text-sm mt-2">Rejoins PCStore et configure ton setup idéal.</p>
          <div className="mt-6 flex gap-4 justify-center flex-wrap">
            <button
              onClick={onGoRegister}
              className="rounded-full bg-indigo-500 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-400 transition"
            >
              Créer un compte
            </button>
            <button
              onClick={onGoLogin}
              className="rounded-full bg-slate-800 px-8 py-3 text-sm font-bold text-slate-300 hover:bg-slate-700 transition ring-1 ring-slate-700"
            >
              Se connecter
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">© 2025 PCStore — Tous droits réservés</p>
      </div>
    </div>
  )
}
