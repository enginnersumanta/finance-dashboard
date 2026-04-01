import { useEffect, useMemo, useState } from "react"
import { demoUsers } from "../data/users"
import { AuthContext } from "./AuthStoreContext"

const AUTH_STORAGE_KEY = "finance.authUser"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  })

  const [authError, setAuthError] = useState("")

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    const matchedUser = demoUsers.find(
      (entry) => entry.email.toLowerCase() === normalizedEmail && entry.password === password,
    )

    if (!matchedUser) {
      setAuthError("Invalid email or password.")
      return false
    }

    const { password: _password, ...safeUser } = matchedUser
    setUser(safeUser)
    setAuthError("")
    return true
  }

  const logout = () => {
    setUser(null)
    setAuthError("")
  }

  const value = useMemo(
    () => ({
      user,
      role: user?.role || "viewer",
      isAuthenticated: Boolean(user),
      authError,
      setAuthError,
      login,
      logout,
    }),
    [authError, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
