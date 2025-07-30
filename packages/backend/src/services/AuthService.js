// =====================================================
// SERVICIO DE AUTENTICACIÓN - BACKEND (PRINCIPIOS SOLID)
// =====================================================

const { createClient } = require('@supabase/supabase-js')
const { environmentManager } = require('../config/environment')

// =====================================================
// INTERFACE SEGREGATION PRINCIPLE
// =====================================================

/**
 * Interface para operaciones de autenticación
 */
class IAuthService {
  async signIn(credentials) { throw new Error('Método no implementado') }
  async signUp(userData) { throw new Error('Método no implementado') }
  async signOut(token) { throw new Error('Método no implementado') }
  async validateToken(token) { throw new Error('Método no implementado') }
  async refreshToken(token) { throw new Error('Método no implementado') }
}

// =====================================================
// SINGLE RESPONSIBILITY PRINCIPLE
// =====================================================

/**
 * Cliente de Supabase - Responsabilidad única: conexión con Supabase
 */
class SupabaseClient {
  constructor() {
    const { url, anonKey } = environmentManager.supabase
    
    if (!url || !anonKey) {
      throw new Error('❌ Configuración de Supabase incompleta. Verifica VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local')
    }
    
    this.client = createClient(url, anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false // En backend no persistimos sesión
      }
    })
  }

  getClient() {
    return this.client
  }

  async testConnection() {
    try {
      const { data, error } = await this.client
        .from('users')
        .select('count')
        .limit(1)
      
      return { success: !error, error }
    } catch (error) {
      return { success: false, error }
    }
  }
}

/**
 * Gestor de Tokens - Responsabilidad única: manejo de tokens JWT
 */
class TokenManager {
  static generateSessionToken(userId, rememberMe = false) {
    const payload = {
      userId,
      type: 'session',
      rememberMe,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60) // 30 días o 1 día
    }
    
    // En producción, usar una librería como jsonwebtoken
    return Buffer.from(JSON.stringify(payload)).toString('base64')
  }

  static validateSessionToken(token) {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString())
      const now = Math.floor(Date.now() / 1000)
      
      if (payload.exp < now) {
        return { valid: false, error: 'Token expirado' }
      }
      
      return { valid: true, payload }
    } catch (error) {
      return { valid: false, error: 'Token inválido' }
    }
  }
}

/**
 * Gestor de Cookies - Responsabilidad única: manejo de cookies
 */
class CookieManager {
  static setSecureCookie(res, name, value, options = {}) {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 día por defecto
      path: '/'
    }
    
    res.cookie(name, value, { ...defaultOptions, ...options })
  }

  static clearCookie(res, name) {
    res.clearCookie(name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    })
  }

  static getCookie(req, name) {
    return req.cookies[name]
  }
}

// =====================================================
// OPEN/CLOSED PRINCIPLE
// =====================================================

/**
 * Servicio de Autenticación - Extensible sin modificar
 */
class AuthService extends IAuthService {
  constructor() {
    super()
    this.supabaseClient = new SupabaseClient()
    this.supabase = this.supabaseClient.getClient()
  }

  // =====================================================
  // MÉTODOS PÚBLICOS
  // =====================================================

  /**
   * Inicia sesión con email y contraseña
   */
  async signIn(credentials) {
    try {
      console.log('🔄 Iniciando sesión:', credentials.email)
      
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        console.error('❌ Error de autenticación:', error.message)
        return {
          success: false,
          error: this.getErrorMessage(error.message)
        }
      }

      if (data.session && data.user) {
        // Generar token de sesión personalizado
        const sessionToken = TokenManager.generateSessionToken(
          data.user.id, 
          credentials.rememberMe || false
        )

        console.log('✅ Sesión iniciada exitosamente')
        
        return {
          success: true,
          data: {
            user: {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || data.user.email
            },
            sessionToken,
            accessToken: data.session.access_token
          }
        }
      }

      return {
        success: false,
        error: 'No se pudo establecer la sesión'
      }
    } catch (error) {
      console.error('❌ Error inesperado en login:', error)
      return {
        success: false,
        error: this.getErrorMessage(error.message || 'Error de conectividad')
      }
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async signUp(userData) {
    try {
      console.log('🔄 Registrando usuario:', userData.email)
      
      const { data, error } = await this.supabase.auth.signUp({
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
        data: {
          user: data.user,
          message: 'Usuario registrado. Verifica tu email para confirmar la cuenta.'
        }
      }
    } catch (error) {
      console.error('❌ Error inesperado en registro:', error)
      return {
        success: false,
        error: this.getErrorMessage(error.message || 'Error de conectividad')
      }
    }
  }

  /**
   * Cierra la sesión
   */
  async signOut(token) {
    try {
      console.log('🔄 Cerrando sesión...')
      
      // Validar token antes de cerrar sesión
      const tokenValidation = TokenManager.validateSessionToken(token)
      if (!tokenValidation.valid) {
        return {
          success: false,
          error: 'Token de sesión inválido'
        }
      }

      const { error } = await this.supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Error al cerrar sesión:', error.message)
        return {
          success: false,
          error: this.getErrorMessage(error.message)
        }
      }

      console.log('✅ Sesión cerrada exitosamente')
      return { success: true }
    } catch (error) {
      console.error('❌ Error inesperado al cerrar sesión:', error)
      return {
        success: false,
        error: this.getErrorMessage(error.message)
      }
    }
  }

  /**
   * Valida un token de sesión
   */
  async validateToken(token) {
    try {
      const validation = TokenManager.validateSessionToken(token)
      
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        }
      }

      // Verificar que el usuario aún existe en Supabase
      const { data: { user }, error } = await this.supabase.auth.getUser()
      
      if (error || !user || user.id !== validation.payload.userId) {
        return {
          success: false,
          error: 'Usuario no encontrado o sesión inválida'
        }
      }

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email
          }
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Error validando token'
      }
    }
  }

  /**
   * Refresca un token de sesión
   */
  async refreshToken(token) {
    try {
      const validation = TokenManager.validateSessionToken(token)
      
      if (!validation.valid) {
        return {
          success: false,
          error: 'Token inválido'
        }
      }

      // Generar nuevo token
      const newToken = TokenManager.generateSessionToken(
        validation.payload.userId,
        validation.payload.rememberMe
      )

      return {
        success: true,
        data: { sessionToken: newToken }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Error refrescando token'
      }
    }
  }

  // =====================================================
  // MÉTODOS PRIVADOS
  // =====================================================

  /**
   * Convierte mensajes de error de Supabase a mensajes amigables
   */
  getErrorMessage(supabaseError) {
    const errorMessages = {
      'Invalid login credentials': 'Email o contraseña incorrectos',
      'Email not confirmed': 'Por favor, confirma tu email antes de iniciar sesión',
      'User already registered': 'Ya existe una cuenta con este email',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
      'Unable to validate email address: invalid format': 'Formato de email inválido',
      'Signup is disabled': 'El registro está deshabilitado temporalmente',
      'JWT expired': 'Sesión expirada',
      'Invalid JWT': 'Token de sesión inválido'
    }

    return errorMessages[supabaseError] || 'Ha ocurrido un error inesperado'
  }
}

// =====================================================
// DEPENDENCY INVERSION PRINCIPLE
// =====================================================

/**
 * Factory para crear instancias del servicio de autenticación
 */
class AuthServiceFactory {
  static create() {
    return new AuthService()
  }
}

module.exports = {
  AuthService,
  AuthServiceFactory,
  TokenManager,
  CookieManager,
  SupabaseClient,
  IAuthService
} 