import AdminPage from "../pages/AdminPage"
import CartPage from "../pages/CartPage"
import ConfiguratorPage from "../pages/ConfiguratorPage"
import LandingPage from "../pages/LandingPage"
import LoginPage from "../pages/LoginPage"
import ProfilePage from "../pages/ProfilePage"
import RegisterPage from "../pages/RegisterPage"
import ShopPage from "../pages/ShopPage"
import { PAGES } from "../constants/pages"

export default function AppRoutes({
  activePage,
  handleLogin,
  handleOrder,
  logged,
  onLogout,
  requireAuth,
  setActivePage,
  userRole,
}) {
  if (activePage === PAGES.CART && logged) {
    return <CartPage onOrder={handleOrder} />
  }

  if (activePage === PAGES.PROFILE && logged) {
    return <ProfilePage onLogout={onLogout} />
  }

  if (activePage === PAGES.SHOP) {
    return <ShopPage onRequireAuth={() => requireAuth(PAGES.SHOP)} />
  }

  if (activePage === PAGES.ADMIN && logged && userRole === "admin") {
    return <AdminPage />
  }

  if (activePage === PAGES.LOGIN && !logged) {
    return <LoginPage onLogin={handleLogin} />
  }

  if (activePage === PAGES.REGISTER && !logged) {
    return <RegisterPage />
  }

  if (activePage === PAGES.LANDING) {
    return (
      <LandingPage
        onGoLogin={() => setActivePage(PAGES.LOGIN)}
        onGoRegister={() => setActivePage(PAGES.REGISTER)}
        onRequireAuth={() => requireAuth(PAGES.SHOP)}
      />
    )
  }

  return <ConfiguratorPage onRequireAuth={() => requireAuth(PAGES.CONFIGURATOR)} />
}
