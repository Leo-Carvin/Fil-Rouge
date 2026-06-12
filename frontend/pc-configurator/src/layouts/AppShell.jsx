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
    <div className="min-h-screen bg-slate-900 text-slate-200 p-3 sm:p-6">
      <div className="mx-auto max-w-5xl">
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
