import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getTokens, login as apiLogin, logout as apiLogout, fetchCurrentAdmin } from './adminApi'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { accessToken, refreshToken } = getTokens()
    if (!accessToken && !refreshToken) {
      setLoading(false)
      return
    }
    fetchCurrentAdmin()
      .then((data) => setAdmin(data))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username, password) => {
    await apiLogin(username, password)
    const me = await fetchCurrentAdmin()
    setAdmin(me)
    return me
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setAdmin(null)
  }, [])

  return (
    <AdminAuthContext.Provider value={{ admin, loading, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
