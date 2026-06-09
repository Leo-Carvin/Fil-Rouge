import Header from "../components/Header"
import AppNavigation from "../components/navigation/AppNavigation"
import CookieBanner from "../components/CookieBanner"

export default function AppShell({
  activePage,
  cartCount,
  children,
  logged,
  onLogout,
  onNavigate,
  onRequireAuth,
  userRole,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-3 sm:p-6">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-slate-800/80 p-4 sm:p-6 ring-1 ring-primary-light/20">
        <Header logged={logged} userRole={userRole}>
          <AppNavigation
            activePage={activePage}
            cartCount={cartCount}
            logged={logged}
            onLogout={onLogout}
            onNavigate={onNavigate}
            onRequireAuth={onRequireAuth}
            userRole={userRole}
          />
        </Header>

        {children}
      </div>
      <CookieBanner />
    </div>
  )
}
