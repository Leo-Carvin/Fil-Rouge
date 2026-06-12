import { PAGES } from "../../constants/pages"

const primaryItems = [
  { label: "Configurer", page: PAGES.CONFIGURATOR },
  { label: "Boutique", page: PAGES.SHOP },
]

function CartIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 7h15l-2 8H8L6 3H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 20h.01M18 20h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function NavTab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`h-9 shrink-0 rounded-md px-4 text-sm font-medium transition ${
        active
          ? "bg-white text-slate-900"
          : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      {children}
    </button>
  )
}

function ActionButton({ active, children, className = "", onClick, tone = "neutral" }) {
  const base = "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition"

  const styles = {
    neutral: active
      ? "border-slate-600 bg-slate-700 text-white"
      : "border-slate-700/50 bg-slate-800/60 text-slate-300 hover:border-slate-600 hover:bg-slate-700 hover:text-white",
    danger: "border-red-500/30 bg-red-500/10 text-red-300 hover:border-red-500/50 hover:bg-red-500/20",
  }

  return (
    <button onClick={onClick} className={`${base} ${styles[tone]} ${className}`}>
      {children}
    </button>
  )
}

function CartButton({ active, cartCount, logged, onClick }) {
  return (
    <ActionButton active={active} onClick={onClick}>
      <CartIcon />
      <span>Panier</span>
      {logged && cartCount > 0 && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-slate-500 px-1.5 text-[11px] font-bold text-white">
          {cartCount}
        </span>
      )}
    </ActionButton>
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
    <nav className="w-full overflow-x-auto pb-1 lg:w-auto lg:overflow-visible lg:pb-0" aria-label="Navigation principale">
      <div className="flex min-w-max items-center gap-2 lg:min-w-0">
        <div className="flex rounded-lg border border-slate-700/50 bg-slate-800/40 p-1">
          {primaryItems.map((item) => (
            <NavTab
              key={item.page}
              active={activePage === item.page}
              onClick={() => onNavigate(item.page)}
            >
              {item.label}
            </NavTab>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <CartButton
            active={activePage === PAGES.CART}
            cartCount={cartCount}
            logged={logged}
            onClick={goToCart}
          />

          {!logged ? (
            <ActionButton active={activePage === PAGES.LOGIN} onClick={() => onNavigate(PAGES.LOGIN)}>
              <UserIcon />
              Connexion
            </ActionButton>
          ) : (
            <>
              <ActionButton active={activePage === PAGES.PROFILE} onClick={() => onNavigate(PAGES.PROFILE)}>
                <UserIcon />
                Profil
              </ActionButton>

              {userRole === "admin" && (
                <ActionButton active={activePage === PAGES.ADMIN} onClick={() => onNavigate(PAGES.ADMIN)}>
                  Admin
                </ActionButton>
              )}

              <ActionButton tone="danger" onClick={onLogout}>
                Sortir
              </ActionButton>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
