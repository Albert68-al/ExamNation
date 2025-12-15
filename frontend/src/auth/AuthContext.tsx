import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, setAuthToken } from '../lib/api'

type AuthUser = {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
}

type JwtResponse = {
  accessToken: string
  tokenType: string
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
}

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signupStudent: (payload: StudentSignupPayload) => Promise<void>
  logout: () => void
}

type StudentSignupPayload = {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  school: string
  level: string
  city: string
  birthDate?: string
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const USER_KEY = 'auth_user'
const TOKEN_KEY = 'token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // On mount: hydrate from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    if (storedToken) {
      setToken(storedToken)
      setAuthToken(storedToken)
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        // ignore parse error
      }
    }
  }, [])

  const persist = (jwt: JwtResponse) => {
    const t = jwt.accessToken
    const u: AuthUser = {
      id: jwt.id,
      email: jwt.email,
      firstName: jwt.firstName,
      lastName: jwt.lastName,
      role: jwt.role,
    }
    setToken(t)
    setUser(u)
    setAuthToken(t)
    localStorage.setItem(TOKEN_KEY, t)
    localStorage.setItem(USER_KEY, JSON.stringify(u))
  }

  const login = async (email: string, password: string) => {
    const res = await api.post<JwtResponse>('/auth/login', { email, password })
    persist(res.data)
  }

  const signupStudent = async (payload: StudentSignupPayload) => {
    await api.post('/auth/register/student', payload)
    // optional: auto login? We keep manual login to respect backend response shape
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setAuthToken(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const value = useMemo(
    () => ({ user, token, login, signupStudent, logout }),
    [user, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

