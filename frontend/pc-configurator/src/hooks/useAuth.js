import { useEffect, useState } from "react"

export function useAuth({ clearCartLocal, loadCart, onLogout }) {
  const [logged, setLogged] = useState(() => Boolean(localStorage.getItem("token")))
  const [userRole, setUserRole] = useState(() => localStorage.getItem("user_role"))

  useEffect(() => {
    if (logged) {
      loadCart()
    }
  }, [loadCart, logged])

  const login = async (role) => {
    setLogged(true)
    setUserRole(role)
    await loadCart()
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
    localStorage.removeItem("user_email")
    localStorage.removeItem("user_role")
    clearCartLocal()
    setLogged(false)
    setUserRole(null)
    onLogout?.()
  }

  return {
    logged,
    login,
    logout,
    userRole,
  }
}
