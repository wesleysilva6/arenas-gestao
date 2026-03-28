import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, clearAuth } from '../service/http'

type AuthUser = {
  idusuario: number
  nome: string
  email: string
  situacao: number
}

type AuthContextType = {
  user: AuthUser | null
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<AuthUser | null>(() => getUser())
  const navigate = useNavigate()

  const signOut = useCallback(() => {
    clearAuth()
    navigate('/login', { replace: true })
  }, [navigate])

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
