import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { User, AuthState } from '../types'
import { AuthService } from '../services/authService'

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

  // =====================================================
  // INICIALIZACIÓN
  // =====================================================
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        
        const user = await AuthService.getCurrentUser()
        
        if (user) {
          dispatch({ type: 'SET_USER', payload: user })
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error)
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
      
      const response = await AuthService.signIn({ email, password })
      
      if (response.success && response.data?.user) {
        // Obtener el perfil completo del usuario
        const user = await AuthService.getCurrentUser()
        dispatch({ type: 'SET_USER', payload: user })
      } else {
        throw new Error(response.error || 'Error en el inicio de sesión')
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await AuthService.signUp({ name, email, password, confirmPassword: password })
      
      if (response.success && response.data?.user) {
        // Obtener el perfil completo del usuario
        const user = await AuthService.getCurrentUser()
        dispatch({ type: 'SET_USER', payload: user })
      } else {
        throw new Error(response.error || 'Error en el registro')
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const logout = async () => {
    try {
      const response = await AuthService.signOut()
      
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
      
      const response = await AuthService.updateProfile(state.user.id, updates)
      
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_USER', payload: response.data })
      } else {
        throw new Error(response.error || 'Error al actualizar usuario')
      }
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