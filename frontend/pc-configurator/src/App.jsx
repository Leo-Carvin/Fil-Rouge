import { useState } from "react"
import AppShell from "./layouts/AppShell"
import AppRoutes from "./routes/AppRoutes"
import { PAGES } from "./constants/pages"
import { useAuth } from "./hooks/useAuth"
import { useCheckout } from "./hooks/useCheckout"
import { useCart } from "./hooks/useCart"

export default function App() {
  const [activePage, setActivePage] = useState(PAGES.CONFIGURATOR)
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null)
  const { cart, clearCart, clearCartLocal, loadCart } = useCart()

  const { logged, login, logout, userRole } = useAuth({
    clearCartLocal,
    loadCart,
    onLogout: () => setActivePage(PAGES.CONFIGURATOR),
  })

  const { handleOrder } = useCheckout({
    cart,
    clearCart,
    onOrderSuccess: () => setActivePage(PAGES.CONFIGURATOR),
  })

  const requireAuth = (targetPage) => {
    setRedirectAfterLogin(targetPage)
    setActivePage(PAGES.LOGIN)
  }

  const handleLogin = async (role) => {
    await login(role)

    if (redirectAfterLogin) {
      setActivePage(redirectAfterLogin)
      setRedirectAfterLogin(null)
      return
    }

    setActivePage(PAGES.CONFIGURATOR)
  }

  return (
    <AppShell
      activePage={activePage}
      cartCount={cart.length}
      logged={logged}
      onLogout={logout}
      onNavigate={setActivePage}
      onRequireAuth={requireAuth}
      userRole={userRole}
    >
      <AppRoutes
        activePage={activePage}
        handleLogin={handleLogin}
        handleOrder={handleOrder}
        logged={logged}
        onLogout={logout}
        requireAuth={requireAuth}
        setActivePage={setActivePage}
        userRole={userRole}
      />
    </AppShell>
  )
}
