import { PAGES } from "../../constants/pages"

function NavButton({ active, children, className = "", onClick }) {
  const activeClass = active
    ? "bg-primary-dark text-white"
    : "bg-slate-700 text-slate-200 hover:bg-slate-600"

  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeClass} ${className}`}
    >
      {children}
    </button>
  )
}

export default function AppNavigation({
  activePage,
  cartCount,
  logged,
  onLogout,
  onNavigate,
  onRequireAuth,
  userRole,
}) {
  const goToCart = () => {
    if (!logged) {
      onRequireAuth(PAGES.CART)
      return
    }

    onNavigate(PAGES.CART)
  }

  return (
    <div className="flex gap-2 flex-wrap justify-center md:justify-end w-full md:w-auto">
      <NavButton active={activePage === PAGES.CONFIGURATOR} onClick={() => onNavigate(PAGES.CONFIGURATOR)}>
        Configurateur
      </NavButton>
      <NavButton active={activePage === PAGES.SHOP} onClick={() => onNavigate(PAGES.SHOP)}>
        🏪 Boutique
      </NavButton>
      <NavButton
        active={activePage === PAGES.CART}
        className="flex items-center gap-2"
        onClick={goToCart}
      >
        🛒 Panier
        {logged && cartCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{cartCount}</span>
        )}
      </NavButton>

      {!logged ? (
        <NavButton active={activePage === PAGES.LOGIN} onClick={() => onNavigate(PAGES.LOGIN)}>
          🔑 Connexion
        </NavButton>
      ) : (
        <>
          <NavButton active={activePage === PAGES.PROFILE} onClick={() => onNavigate(PAGES.PROFILE)}>
            👤 Profil
          </NavButton>
          <button
            onClick={onLogout}
            className="rounded-full px-4 py-2 text-sm font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/40 transition"
          >
            Déconnexion
          </button>
        </>
      )}

      {logged && userRole === "admin" && (
        <button
          onClick={() => onNavigate(PAGES.ADMIN)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activePage === PAGES.ADMIN ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-200 hover:bg-slate-600"
          }`}
        >
          🛡️ Admin
        </button>
      )}
    </div>
  )
}
