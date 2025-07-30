// =====================================================
// CONTROLADOR DE AUTENTICACIÓN - BACKEND (PRINCIPIOS SOLID)
// =====================================================

const { AuthServiceFactory, CookieManager } = require('../services/AuthService')

// =====================================================
// SINGLE RESPONSIBILITY PRINCIPLE
// =====================================================

/**
 * Controlador de Autenticación - Responsabilidad única: manejo de requests HTTP
 */
class AuthController {
  constructor() {
    this.authService = AuthServiceFactory.create()
  }

  // =====================================================
  // MÉTODOS PÚBLICOS
  // =====================================================

  /**
   * POST /api/auth/login
   * Inicia sesión de usuario
   */
  async login(req, res) {
    try {
      const { email, password, rememberMe } = req.body

      // Validación básica
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email y contraseña son requeridos'
        })
      }

      const result = await this.authService.signIn({
        email,
        password,
        rememberMe
      })

      if (result.success) {
        // Configurar cookies seguras
        const cookieOptions = {
          maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 días o 1 día
        }

        CookieManager.setSecureCookie(res, 'sessionToken', result.data.sessionToken, cookieOptions)
        CookieManager.setSecureCookie(res, 'accessToken', result.data.accessToken, cookieOptions)

        return res.status(200).json({
          success: true,
          data: {
            user: result.data.user,
            message: 'Sesión iniciada exitosamente'
          }
        })
      } else {
        return res.status(401).json({
          success: false,
          error: result.error
        })
      }
    } catch (error) {
      console.error('❌ Error en controlador de login:', error)
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  /**
   * POST /api/auth/register
   * Registra un nuevo usuario
   */
  async register(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body

      // Validación básica
      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'Todos los campos son requeridos'
        })
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'Las contraseñas no coinciden'
        })
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'La contraseña debe tener al menos 6 caracteres'
        })
      }

      const result = await this.authService.signUp({
        name,
        email,
        password
      })

      if (result.success) {
        return res.status(201).json({
          success: true,
          data: {
            user: result.data.user,
            message: result.data.message
          }
        })
      } else {
        return res.status(400).json({
          success: false,
          error: result.error
        })
      }
    } catch (error) {
      console.error('❌ Error en controlador de registro:', error)
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  /**
   * POST /api/auth/logout
   * Cierra la sesión del usuario
   */
  async logout(req, res) {
    try {
      const sessionToken = CookieManager.getCookie(req, 'sessionToken')

      if (!sessionToken) {
        return res.status(400).json({
          success: false,
          error: 'No hay sesión activa'
        })
      }

      const result = await this.authService.signOut(sessionToken)

      // Limpiar cookies
      CookieManager.clearCookie(res, 'sessionToken')
      CookieManager.clearCookie(res, 'accessToken')

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: 'Sesión cerrada exitosamente'
        })
      } else {
        return res.status(400).json({
          success: false,
          error: result.error
        })
      }
    } catch (error) {
      console.error('❌ Error en controlador de logout:', error)
      
      // Limpiar cookies incluso si hay error
      CookieManager.clearCookie(res, 'sessionToken')
      CookieManager.clearCookie(res, 'accessToken')
      
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  /**
   * GET /api/auth/me
   * Obtiene información del usuario actual
   */
  async getCurrentUser(req, res) {
    try {
      const sessionToken = CookieManager.getCookie(req, 'sessionToken')

      if (!sessionToken) {
        return res.status(401).json({
          success: false,
          error: 'No autenticado'
        })
      }

      const result = await this.authService.validateToken(sessionToken)

      if (result.success) {
        return res.status(200).json({
          success: true,
          data: {
            user: result.data.user
          }
        })
      } else {
        // Token inválido, limpiar cookies
        CookieManager.clearCookie(res, 'sessionToken')
        CookieManager.clearCookie(res, 'accessToken')
        
        return res.status(401).json({
          success: false,
          error: result.error
        })
      }
    } catch (error) {
      console.error('❌ Error en controlador getCurrentUser:', error)
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  /**
   * POST /api/auth/refresh
   * Refresca el token de sesión
   */
  async refreshToken(req, res) {
    try {
      const sessionToken = CookieManager.getCookie(req, 'sessionToken')

      if (!sessionToken) {
        return res.status(401).json({
          success: false,
          error: 'No hay sesión activa'
        })
      }

      const result = await this.authService.refreshToken(sessionToken)

      if (result.success) {
        // Actualizar cookie con nuevo token
        CookieManager.setSecureCookie(res, 'sessionToken', result.data.sessionToken)
        
        return res.status(200).json({
          success: true,
          message: 'Token refrescado exitosamente'
        })
      } else {
        return res.status(401).json({
          success: false,
          error: result.error
        })
      }
    } catch (error) {
      console.error('❌ Error en controlador refreshToken:', error)
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  /**
   * GET /api/auth/status
   * Verifica el estado de la autenticación
   */
  async getAuthStatus(req, res) {
    try {
      const sessionToken = CookieManager.getCookie(req, 'sessionToken')
      const accessToken = CookieManager.getCookie(req, 'accessToken')

      const isAuthenticated = !!sessionToken && !!accessToken

      return res.status(200).json({
        success: true,
        data: {
          isAuthenticated,
          hasSessionToken: !!sessionToken,
          hasAccessToken: !!accessToken
        }
      })
    } catch (error) {
      console.error('❌ Error en controlador getAuthStatus:', error)
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }
}

// =====================================================
// DEPENDENCY INVERSION PRINCIPLE
// =====================================================

/**
 * Factory para crear instancias del controlador
 */
class AuthControllerFactory {
  static create() {
    return new AuthController()
  }
}

module.exports = {
  AuthController,
  AuthControllerFactory
} 