import ShopPreview from "../components/shop/ShopPreview"

const FEATURES = [
  { title: "Compatibilité intelligente", desc: "Alertes automatiques si tes composants sont incompatibles." },
  { title: "Boutique complète", desc: "Parcours tout le catalogue et ajoute au panier en un clic." },
  { title: "Suivi de commandes", desc: "Historique complet de tes commandes dans ton profil." },
  { title: "Confirmation par email", desc: "Reçois un email récapitulatif à chaque commande passée." },
]

const STATS = [
  { value: "100+", label: "Composants disponibles" },
  { value: "3", label: "Secondes pour configurer" },
  { value: "100%", label: "Compatibilité vérifiée" },
]

export default function LandingPage({ onGoLogin, onGoRegister, onRequireAuth }) {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center px-6 py-12">
        <span className="inline-block rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 mb-4">
          Configurateur PC en ligne
        </span>
        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto">
          Monte ton PC
          <span className="text-slate-400"> parfait.</span>
        </h1>
        <p className="mt-4 text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
          Choisis tes composants, vérifie la compatibilité en temps réel et commande en quelques clics.
        </p>
        <div className="mt-8 flex gap-3 flex-wrap justify-center">
          <button
            onClick={onGoRegister}
            className="rounded-lg bg-slate-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-600 transition"
          >
            Créer un compte gratuit
          </button>
          <button
            onClick={onGoLogin}
            className="rounded-lg bg-slate-800 px-6 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition ring-1 ring-slate-700"
          >
            Se connecter
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ title, desc }) => (
          <div key={title} className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-5 flex flex-col gap-2">
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 rounded-lg border border-slate-700/50 bg-slate-800/40 p-6">
        {STATS.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Shop Preview */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Catalogue</span>
          <h2 className="text-xl font-semibold text-white">Nos produits</h2>
        </div>
        <button
          onClick={onGoLogin}
          className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 ring-1 ring-slate-700 transition"
        >
          Se connecter pour acheter →
        </button>
      </div>

      <ShopPreview onRequireAuth={onRequireAuth} />

      {/* CTA */}
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-8 text-center">
        <h2 className="text-xl font-semibold text-white">Prêt à construire ton PC ?</h2>
        <p className="text-slate-400 text-sm mt-2">Rejoins PCStore et configure ton setup idéal.</p>
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <button
            onClick={onGoRegister}
            className="rounded-lg bg-slate-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-600 transition"
          >
            Créer un compte
          </button>
          <button
            onClick={onGoLogin}
            className="rounded-lg bg-slate-800 px-6 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition ring-1 ring-slate-700"
          >
            Se connecter
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-slate-600">© 2025 PCStore — Tous droits réservés</p>
    </div>
  )
}
