import { createContext, useContext, useState,type ReactNode } from 'react'


interface User {
  name: string
  email: string
  profile_image: string | null
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  login: (user: User, access: string, refresh: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

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

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
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