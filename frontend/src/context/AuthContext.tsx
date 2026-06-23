import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api, { registerAuthCallbacks } from '../api/axios'

interface User {
  name: string
  email: string
  profile_image: string | null
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  loading: boolean
  login: (user: User, access: string, refresh: string) => void
  logout: () => void
  updateUser: (patch: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function login(user: User, access: string, refresh: string) {
    setUser(user)
    setAccessToken(access)
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
  }

  function logout() {
    setUser(null)
    setAccessToken(null)
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
  }

  function updateUser(patch: Partial<User>) {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  useEffect(() => {
    registerAuthCallbacks(
      (newAccess) => setAccessToken(newAccess),
      () => logout()
    )

    async function rehydrate() {
      const token = localStorage.getItem('access')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data)
        setAccessToken(token)
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }

    rehydrate()
  }, [])

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}