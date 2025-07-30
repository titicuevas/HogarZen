// =====================================================
// SERVICIO DE AUTENTICACIÓN - FRONTEND (PRINCIPIOS SOLID)
// =====================================================

import { LoginFormData, RegisterFormData, AuthResponse, User } from '../types'
import CookieManager from '../utils/cookies'
import { createClient } from '@supabase/supabase-js'

// =====================================================
// INTERFACE SEGREGATION PRINCIPLE
// =====================================================

interface IAuthService {
  signIn(credentials: LoginFormData): Promise<AuthResponse>
  signUp(userData: RegisterFormData): Promise<AuthResponse>
  signOut(): Promise<AuthResponse>
  getCurrentUser(): Promise<User | null>
  validateToken(): Promise<AuthResponse>
  refreshToken(): Promise<AuthResponse>
}

// =====================================================
// SINGLE RESPONSIBILITY PRINCIPLE
// =====================================================

/**
 * Cliente Supabase - Responsabilidad única: comunicación con Supabase
 */
class SupabaseClient {
  private static instance: SupabaseClient
  private client: any

  constructor() {
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL
    const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('❌ Configuración de Supabase incompleta. Verifica VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local')
    }

    this.client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  }

  static getInstance(): SupabaseClient {
    if (!SupabaseClient.instance) {
      SupabaseClient.instance = new SupabaseClient()
    }
    return SupabaseClient.instance
  }

  getClient() {
    return this.client
  }
}

// =====================================================
// OPEN/CLOSED PRINCIPLE
// =====================================================

/**
 * Servicio de Autenticación - Extensible sin modificar
 */
export class AuthService implements IAuthService {
  public supabase: any

  constructor() {
    this.supabase = SupabaseClient.getInstance().getClient()
  }

  /**
   * Inicia sesión del usuario
   */
  async signIn(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      console.log('🔄 Iniciando sesión con:', credentials.email)

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        console.error('❌ Error en Supabase signIn:', error)
        throw new Error(error.message || 'Error al iniciar sesión')
      }

      if (!data.user) {
        throw new Error('No se pudo obtener información del usuario')
      }

      // Guardar datos en cookies
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuario',
        zone: 'default',
        settings: {
          theme: 'light' as const,
          notifications: true,
          demo_mode: false
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      CookieManager.setAuthToken(data.session?.access_token || '')
      CookieManager.setUserData(userData)

      if (credentials.rememberMe) {
        CookieManager.setRememberMe(true)
      }

      console.log('✅ Sesión iniciada exitosamente')
      return {
        success: true,
        user: userData,
        message: 'Sesión iniciada exitosamente'
      }

    } catch (error) {
      console.error('❌ Error inesperado en signIn:', error)
      throw error
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async signUp(userData: RegisterFormData): Promise<AuthResponse> {
    try {
      console.log('🔄 Registrando usuario:', userData.email)
      
      const { data, error } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            avatar_url: null
          }
        }
      })

      if (error) {
        console.error('❌ Error en Supabase signUp:', error)
        throw new Error(error.message || 'Error al registrar usuario')
      }

      if (!data.user) {
        throw new Error('No se pudo crear el usuario')
      }

              // Si el email no requiere confirmación, iniciar sesión automáticamente
        if (data.session) {
          const user = {
            id: data.user.id,
            email: data.user.email,
            name: userData.name,
            zone: 'default',
            settings: {
              theme: 'light' as const,
              notifications: true,
              demo_mode: false
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          CookieManager.setAuthToken(data.session.access_token)
          CookieManager.setUserData(user)

        console.log('✅ Usuario registrado e iniciado sesión')
        return {
          success: true,
          user,
          message: 'Usuario registrado exitosamente'
        }
      } else {
        console.log('✅ Usuario registrado, requiere confirmación de email')
      return {
        success: true,
          user: null,
          message: 'Usuario registrado. Revisa tu email para confirmar la cuenta.'
        }
      }

    } catch (error) {
      console.error('❌ Error inesperado en signUp:', error)
      throw error
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  async signOut(): Promise<AuthResponse> {
    try {
      console.log('🔄 Cerrando sesión')

      const { error } = await this.supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Error en Supabase signOut:', error)
        throw new Error(error.message || 'Error al cerrar sesión')
      }

      // Limpiar cookies
      CookieManager.clearAuthToken()
      CookieManager.clearUserData()
      CookieManager.clearRememberMe()

      console.log('✅ Sesión cerrada exitosamente')
      return {
        success: true,
        user: null,
        message: 'Sesión cerrada exitosamente'
      }

    } catch (error) {
      console.error('❌ Error inesperado en signOut:', error)
      throw error
    }
  }

  /**
   * Configura el listener de cambios de autenticación
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  /**
   * Obtiene la sesión actual
   */
  async getCurrentSession(): Promise<any> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Error obteniendo sesión actual:', error)
        return null
      }
      
      return session
    } catch (error) {
      console.error('❌ Error inesperado en getCurrentSession:', error)
      return null
    }
  }

  /**
   * Obtiene el usuario actual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()

      if (error) {
        console.error('❌ Error obteniendo usuario actual:', error)
        
        // Si el error es de JWT corrupto, limpiar sesión
        if (error.message?.includes('JWT') || error.message?.includes('sub claim')) {
          console.log('🔄 Limpiando sesión corrupta...')
          await this.clearCorruptedSession()
        }
        
        return null
      }

      if (!user) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
        zone: 'default',
        settings: {
          theme: 'light' as const,
          notifications: true,
          demo_mode: false
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

    } catch (error) {
      console.error('❌ Error inesperado en getCurrentUser:', error)
      
      // Limpiar sesión en caso de error inesperado
      await this.clearCorruptedSession()
      return null
    }
  }

  /**
   * Limpia sesión corrupta
   */
  private async clearCorruptedSession(): Promise<void> {
    try {
      // Limpiar cookies
      CookieManager.clearAuthToken()
      CookieManager.clearUserData()
      CookieManager.clearRememberMe()
      
      // Limpiar sesión de Supabase
      await this.supabase.auth.signOut()
      
      console.log('✅ Sesión corrupta limpiada')
    } catch (error) {
      console.error('❌ Error limpiando sesión corrupta:', error)
    }
  }

  /**
   * Valida el token actual
   */
  async validateToken(): Promise<AuthResponse> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()

      if (error) {
        console.error('❌ Error validando token:', error)
        
        // Si el error es de JWT corrupto, limpiar sesión
        if (error.message?.includes('JWT') || error.message?.includes('sub claim')) {
          await this.clearCorruptedSession()
        }
        
        return {
          success: false,
          user: null,
          message: 'Token inválido'
        }
      }

      if (!session) {
        return {
          success: false,
          user: null,
          message: 'No hay sesión activa'
        }
      }

      const user = await this.getCurrentUser()
      
      if (!user) {
        // Si no se puede obtener el usuario, limpiar sesión
        await this.clearCorruptedSession()
        return {
          success: false,
          user: null,
          message: 'Usuario no encontrado'
        }
      }

      return {
        success: true,
        user,
        message: 'Token válido'
      }

    } catch (error) {
      console.error('❌ Error inesperado en validateToken:', error)
      
      // Limpiar sesión en caso de error
      await this.clearCorruptedSession()
      
      return {
        success: false,
        user: null,
        message: 'Error validando token'
      }
    }
  }

  /**
   * Actualiza el perfil del usuario
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      console.log('🔄 Actualizando perfil del usuario:', userId)
      
      const { data, error } = await this.supabase.auth.updateUser({
        data: updates
      })

      if (error) {
        console.error('❌ Error actualizando perfil:', error)
        throw new Error(error.message || 'Error al actualizar perfil')
      }

      if (!data.user) {
        throw new Error('No se pudo actualizar el usuario')
      }

      const updatedUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuario',
        zone: 'default',
        settings: {
          theme: 'light' as const,
          notifications: true,
          demo_mode: false
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Actualizar cookies
      CookieManager.setUserData(updatedUser)

      console.log('✅ Perfil actualizado exitosamente')
      return {
        success: true,
        user: updatedUser,
        message: 'Perfil actualizado exitosamente'
      }

    } catch (error) {
      console.error('❌ Error inesperado en updateProfile:', error)
      throw error
    }
  }

  /**
   * Refresca el token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession()
      
      if (error) {
        console.error('❌ Error refrescando token:', error)
        throw new Error(error.message || 'Error al refrescar token')
      }

      if (!data.session) {
        throw new Error('No se pudo refrescar la sesión')
      }

      // Actualizar token en cookies
      CookieManager.setAuthToken(data.session.access_token)

      const user = await this.getCurrentUser()

        return {
          success: true,
        user,
        message: 'Token refrescado exitosamente'
      }

    } catch (error) {
      console.error('❌ Error inesperado en refreshToken:', error)
      throw error
    }
  }

  /**
   * Prueba la conexión con Supabase
   */
  static async testConnection(): Promise<boolean> {
    try {
      const supabase = SupabaseClient.getInstance().getClient()
      
      // Verificar configuración
      const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL
      const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Configuración de Supabase incompleta')
        return false
      }
      
      console.log('🔍 Verificando configuración de Supabase...')
      console.log('URL:', supabaseUrl)
      console.log('Anon Key:', supabaseAnonKey.substring(0, 20) + '...')
      
      // Probar conexión básica
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Error de conexión con Supabase:', error)
        return false
      }
      
      console.log('✅ Conexión con Supabase exitosa')
      return true
    } catch (error) {
      console.error('❌ Error inesperado en testConnection:', error)
      return false
    }
  }

  /**
   * Verifica las credenciales de un usuario
   */
  async verifyCredentials(email: string, password: string): Promise<boolean> {
    try {
      console.log('🔍 Verificando credenciales para:', email)
      
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('❌ Error verificando credenciales:', error)
        return false
      }
      
      if (data.user) {
        console.log('✅ Credenciales válidas')
        // Cerrar sesión inmediatamente después de verificar
        await this.supabase.auth.signOut()
        return true
      }
      
      return false
    } catch (error) {
      console.error('❌ Error inesperado verificando credenciales:', error)
      return false
    }
  }

  /**
   * Obtiene información de debug
   */
  static getDebugInfo() {
    return {
      supabaseUrl: (import.meta as any).env?.VITE_SUPABASE_URL ? 'Configurada' : 'No configurada',
      supabaseKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'No configurada',
      environment: (import.meta as any).env?.MODE || 'development'
    }
  }
}

// =====================================================
// DEPENDENCY INVERSION PRINCIPLE
// =====================================================

export class AuthServiceFactory {
  static create(): IAuthService {
    return new AuthService()
  }
} 
export default AuthService 