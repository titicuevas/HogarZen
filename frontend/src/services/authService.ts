import { supabase } from '../config/supabase'
import { LoginFormData, RegisterFormData, AuthResponse, User } from '../types'

// =====================================================
// SERVICIO DE AUTENTICACIÓN - SINGLE RESPONSIBILITY
// =====================================================

export class AuthService {
  // Exponer la instancia de supabase para uso en hooks
  static readonly supabase = supabase

  /**
   * Inicia sesión con email y contraseña
   */
  static async signIn(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error.message)
        }
      }

      return {
        success: true,
        data
      }
    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error.message)
      }
    }
  }

  /**
   * Registra un nuevo usuario
   */
  static async signUp(userData: RegisterFormData): Promise<AuthResponse> {
    try {
      console.log('🔄 Iniciando registro de usuario:', userData.email)
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name
          }
        }
      })

      if (error) {
        console.error('❌ Error en registro:', error)
        return {
          success: false,
          error: this.getErrorMessage(error.message)
        }
      }

      console.log('✅ Usuario registrado exitosamente:', data.user?.email)
      return {
        success: true,
        data
      }
    } catch (error: any) {
      console.error('❌ Error inesperado en registro:', error)
      
      // Información adicional para depuración
      if (error.message?.includes('fetch')) {
        console.error('🔍 Error de red detectado. Verificando conectividad...')
        console.error('¿Está el proyecto de Supabase activo?')
        console.error('Verifica que las credenciales en .env.local sean correctas')
      }
      
      return {
        success: false,
        error: this.getErrorMessage(error.message || 'Error de conectividad con Supabase')
      }
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  static async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error.message)
        }
      }

      return {
        success: true
      }
    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error.message)
      }
    }
  }

  /**
   * Obtiene la sesión actual
   */
  static async getCurrentSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  }

  /**
   * Obtiene el perfil del usuario actual
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      return profile
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  /**
   * Actualiza el perfil del usuario
   */
  static async updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error.message)
        }
      }

      return {
        success: true,
        data
      }
    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error.message)
      }
    }
  }

  /**
   * Maneja la confirmación de email y establece la sesión
   */
  static async handleEmailConfirmation(): Promise<AuthResponse> {
    try {
      console.log('🔄 Verificando confirmación de email...')
      
      // Obtener la sesión actual después de la confirmación
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Error al obtener sesión después de confirmación:', error)
        return {
          success: false,
          error: this.getErrorMessage(error.message)
        }
      }

      if (session) {
        console.log('✅ Sesión establecida después de confirmación de email')
        return {
          success: true,
          data: { session }
        }
      } else {
        console.log('ℹ️ No hay sesión activa después de confirmación')
        return {
          success: false,
          error: 'Por favor, inicia sesión con tu email y contraseña'
        }
      }
    } catch (error: any) {
      console.error('❌ Error inesperado en confirmación de email:', error)
      return {
        success: false,
        error: this.getErrorMessage(error.message || 'Error al verificar confirmación de email')
      }
    }
  }

  /**
   * Verifica si el usuario está en el proceso de confirmación de email
   */
  static async checkEmailConfirmation(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user ? !user.email_confirmed_at : false
    } catch (error) {
      console.error('Error checking email confirmation:', error)
      return false
    }
  }

  /**
   * Convierte mensajes de error de Supabase a mensajes amigables
   */
  private static getErrorMessage(supabaseError: string): string {
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Email o contraseña incorrectos',
      'Email not confirmed': 'Por favor, confirma tu email antes de iniciar sesión',
      'User already registered': 'Ya existe una cuenta con este email. Intenta iniciar sesión.',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
      'Unable to validate email address: invalid format': 'Formato de email inválido',
      'Signup is disabled': 'El registro está deshabilitado temporalmente'
    }

    return errorMessages[supabaseError] || 'Ha ocurrido un error inesperado'
  }
} 