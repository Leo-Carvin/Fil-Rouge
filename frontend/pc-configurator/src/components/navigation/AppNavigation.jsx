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
      className={`relative h-10 shrink-0 rounded-lg px-4 text-sm font-bold transition ${
        active
          ? "bg-white text-slate-950 shadow-lg shadow-slate-950/20"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  )
}

function ActionButton({ active, children, className = "", onClick, tone = "neutral" }) {
  const neutral = active
    ? "border-primary-light/40 bg-primary-light/15 text-white"
    : "border-white/10 bg-white/[0.06] text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white"

  const danger = "border-red-400/25 bg-red-500/10 text-red-200 hover:border-red-300/40 hover:bg-red-500/20"

  return (
    <button
      onClick={onClick}
      className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-bold transition ${tone === "danger" ? danger : neutral} ${className}`}
    >
      {children}
    </button>
  )
}

function CartButton({ active, cartCount, logged, onClick }) {
  return (
    <ActionButton
      active={active}
      className="border-primary-light/25 bg-primary-light/10 text-primary-light hover:bg-primary-light/20 hover:text-white"
      onClick={onClick}
    >
      <CartIcon />
      <span>Panier</span>
      {logged && cartCount > 0 && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1.5 text-[11px] font-black text-slate-950">
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
      <div className="flex min-w-max items-center gap-3 lg:min-w-0">
        <div className="flex rounded-xl border border-white/10 bg-white/[0.04] p-1">
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
