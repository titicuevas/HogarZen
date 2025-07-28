import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { User, AuthState } from '../types'
import { AuthServiceFactory } from '../services/authService'
import CookieManager from '../utils/cookies'

// =====================================================
// TIPOS DEL CONTEXTO
// =====================================================
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
}

// =====================================================
// ESTADO INICIAL
// =====================================================
const initialState: AuthState = {
  user: null,
  loading: true,
  isAuthenticated: false
}

// =====================================================
// ACCIONES DEL REDUCER
// =====================================================
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'LOGOUT' }

// =====================================================
// REDUCER
// =====================================================
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false
      }
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload }
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      }
    
    default:
      return state
  }
}

// =====================================================
// CONTEXTO
// =====================================================
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// =====================================================
// PROVIDER
// =====================================================
interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const authService = AuthServiceFactory.create()

  // =====================================================
  // INICIALIZACIÓN
  // =====================================================
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        
        // Verificar si hay token en cookies
        const cookieToken = CookieManager.getAuthToken()
        const cookieUserData = CookieManager.getUserData()
        
        console.log('🔍 Inicializando autenticación...')
        console.log('🍪 Token en cookies:', !!cookieToken)
        console.log('👤 Datos de usuario en cookies:', !!cookieUserData)
        
        if (cookieToken && cookieUserData) {
          // Intentar recuperar sesión del backend
          const validation = await authService.validateToken()
          
          if (validation.success) {
            console.log('✅ Sesión recuperada exitosamente')
            dispatch({ type: 'SET_USER', payload: cookieUserData })
          } else {
            console.log('⚠️ Sesión expirada, limpiando cookies')
            CookieManager.clearAll()
            dispatch({ type: 'SET_LOADING', payload: false })
          }
        } else {
          console.log('ℹ️ No hay datos de autenticación en cookies')
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('❌ Error inicializando autenticación:', error)
        CookieManager.clearAll()
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()
  }, [])

  // =====================================================
  // MÉTODOS DEL CONTEXTO
  // =====================================================
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await authService.signIn({ email, password })
      
      if (response.success && response.user) {
        dispatch({ type: 'SET_USER', payload: response.user })
        dispatch({ type: 'SET_AUTHENTICATED', payload: true })
      } else {
        throw new Error(response.message || 'Error en el inicio de sesión')
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await authService.signUp({ name, email, password, confirmPassword: password })
      
      if (response.success && response.user) {
        dispatch({ type: 'SET_USER', payload: response.user })
        dispatch({ type: 'SET_AUTHENTICATED', payload: true })
      } else {
        throw new Error(response.message || 'Error en el registro')
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const logout = async () => {
    try {
      const response = await authService.signOut()
      
      if (response.success) {
        dispatch({ type: 'LOGOUT' })
      } else {
        throw new Error(response.error || 'Error al cerrar sesión')
      }
    } catch (error) {
      console.error('Error en logout:', error)
      // Aún así, limpiamos el estado local
      dispatch({ type: 'LOGOUT' })
    }
  }

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!state.user) throw new Error('No hay usuario autenticado')
      
      // TODO: Implementar actualización de perfil en el backend
      console.log('🔄 Actualizando perfil de usuario:', updates)
      
      // Por ahora, actualizar solo en el estado local
      dispatch({ type: 'UPDATE_USER', payload: updates })
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      throw error
    }
  }

  // =====================================================
  // VALOR DEL CONTEXTO
  // =====================================================
  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// =====================================================
// HOOK PERSONALIZADO
// =====================================================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  
  return context
} 