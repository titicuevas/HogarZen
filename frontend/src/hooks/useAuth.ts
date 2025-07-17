import { useState, useEffect, useCallback } from 'react'
import { AuthService } from '../services/authService'
import { AuthState, User } from '../types'

// =====================================================
// HOOK DE AUTENTICACIÓN OPTIMIZADO
// =====================================================

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false
  })

  // Función optimizada para obtener el usuario
  const getCurrentUser = useCallback(async (session: any) => {
    if (!session?.user) return null
    
    try {
      // Primero intentar obtener de la sesión directamente
      const userFromSession = session.user
      
      // Si tenemos datos básicos, usarlos inmediatamente
      if (userFromSession.email) {
        return {
          id: userFromSession.id,
          email: userFromSession.email,
          name: userFromSession.user_metadata?.name || '',
          created_at: userFromSession.created_at,
          updated_at: userFromSession.updated_at
        } as User
      }
      
      // Si no, obtener del perfil completo
      return await AuthService.getCurrentUser()
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  }, [])

  useEffect(() => {
    let mounted = true

    // Obtener sesión inicial de forma optimizada
    const getInitialSession = async () => {
      try {
        console.log('🔄 Inicializando autenticación...')
        const session = await AuthService.getCurrentSession()
        
        if (!mounted) return

        if (session) {
          const user = await getCurrentUser(session)
          setAuthState({
            user,
            loading: false,
            isAuthenticated: !!user
          })
          console.log('✅ Sesión inicial cargada')
        } else {
          // Verificar si hay parámetros de confirmación en la URL
          const urlParams = new URLSearchParams(window.location.search)
          const accessToken = urlParams.get('access_token')
          const refreshToken = urlParams.get('refresh_token')
          
          if (accessToken && refreshToken) {
            console.log('🔄 Detectada confirmación de email en URL')
            try {
              // Establecer la sesión con los tokens de la URL
              const { data, error } = await AuthService.supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              })
              
              if (!error && data.session) {
                const user = await getCurrentUser(data.session)
                setAuthState({
                  user,
                  loading: false,
                  isAuthenticated: !!user
                })
                console.log('✅ Sesión establecida desde confirmación de email')
                
                // Limpiar la URL
                window.history.replaceState({}, document.title, window.location.pathname)
                return
              }
            } catch (error) {
              console.error('❌ Error al establecer sesión desde confirmación:', error)
            }
          }
          
          setAuthState({
            user: null,
            loading: false,
            isAuthenticated: false
          })
          console.log('ℹ️ No hay sesión activa')
        }
      } catch (error) {
        console.error('❌ Error getting initial session:', error)
        if (mounted) {
          setAuthState({
            user: null,
            loading: false,
            isAuthenticated: false
          })
        }
      }
    }

    getInitialSession()

    // Escuchar cambios en la autenticación de forma optimizada
    const { data: { subscription } } = AuthService.supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('🔄 Cambio de estado de autenticación:', event)
        
        if (session) {
          const user = await getCurrentUser(session)
          setAuthState({
            user,
            loading: false,
            isAuthenticated: !!user
          })
          console.log('✅ Usuario autenticado:', user?.email)
        } else {
          setAuthState({
            user: null,
            loading: false,
            isAuthenticated: false
          })
          console.log('ℹ️ Usuario desautenticado')
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [getCurrentUser])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔄 Iniciando sesión...')
      setAuthState(prev => ({ ...prev, loading: true }))
      
      const response = await AuthService.signIn({ email, password })
      
      if (response.success) {
        console.log('✅ Sesión iniciada correctamente')
        // El onAuthStateChange se encargará de actualizar el estado
      } else {
        console.error('❌ Error al iniciar sesión:', response.error)
      }

      return response
    } catch (error) {
      console.error('❌ Error inesperado al iniciar sesión:', error)
      return { success: false, error: 'Error inesperado al iniciar sesión' }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      console.log('🔄 Registrando usuario...')
      setAuthState(prev => ({ ...prev, loading: true }))
      
      const response = await AuthService.signUp({ email, password, name, confirmPassword: password })
      
      if (response.success) {
        console.log('✅ Usuario registrado correctamente')
        // Si hay sesión inmediata, el onAuthStateChange se encargará
        // Si no, el usuario necesitará confirmar email
      } else {
        console.error('❌ Error al registrar:', response.error)
      }

      return response
    } catch (error) {
      console.error('❌ Error inesperado al registrar:', error)
      return { success: false, error: 'Error inesperado al crear cuenta' }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      console.log('🔄 Cerrando sesión...')
      setAuthState(prev => ({ ...prev, loading: true }))
      
      const response = await AuthService.signOut()
      
      if (response.success) {
        console.log('✅ Sesión cerrada correctamente')
        // El onAuthStateChange se encargará de actualizar el estado
      } else {
        console.error('❌ Error al cerrar sesión:', response.error)
      }

      return response
    } catch (error) {
      console.error('❌ Error inesperado al cerrar sesión:', error)
      return { success: false, error: 'Error inesperado al cerrar sesión' }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  // Alias para compatibilidad con el Dashboard
  const logout = signOut

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!authState.user) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    try {
      const response = await AuthService.updateProfile(authState.user.id, updates)
      
      if (response.success) {
        setAuthState(prev => ({
          ...prev,
          user: response.data || prev.user
        }))
      }

      return response
    } catch (error) {
      console.error('Error updating profile:', error)
      return { success: false, error: 'Error inesperado al actualizar perfil' }
    }
  }, [authState.user])

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    logout,
    updateProfile
  }
} 