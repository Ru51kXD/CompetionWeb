'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// Define user type
export type User = {
  id: number
  name: string
  email: string
  role: 'user' | 'admin'
  paymentCards?: PaymentCard[]
}

// Define payment card type
export type PaymentCard = {
  id: number
  cardNumber: string
  expiryDate: string
  cvv?: string
  cardholderName: string
  isDefault?: boolean
}

// Define auth context type
type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isAdmin: () => boolean
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => {},
  isAdmin: () => false,
})

// Create auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check for logged in user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error)
      }
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // For admin@example.com/admin123, create an admin user
    if (email === 'admin@example.com' && password === 'admin123') {
      const adminUser: User = {
        id: 1,
        name: 'Администратор',
        email: 'admin@example.com',
        role: 'admin',
      }
      setUser(adminUser)
      localStorage.setItem('user', JSON.stringify(adminUser))
      return { success: true, message: 'Вход выполнен успешно' }
    }

    // Check if there are any registered users in localStorage
    const storedUsers = localStorage.getItem('users')
    if (storedUsers) {
      try {
        const users = JSON.parse(storedUsers)
        const foundUser = users.find((u: any) => u.email === email)
        
        if (foundUser && foundUser.password === password) {
          // Don't store password in user state
          const { password, ...userWithoutPassword } = foundUser
          setUser(userWithoutPassword)
          localStorage.setItem('user', JSON.stringify(userWithoutPassword))
          return { success: true, message: 'Вход выполнен успешно' }
        }
      } catch (error) {
        console.error('Ошибка при проверке пользователя:', error)
      }
    }

    return { success: false, message: 'Неверный email или пароль' }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/login')
  }

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext)
} 