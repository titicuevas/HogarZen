// =====================================================
// MIDDLEWARE DE AUTENTICACIÓN - BACKEND (PRINCIPIOS SOLID)
// =====================================================

const { AuthServiceFactory, CookieManager } = require('../services/AuthService')

// =====================================================
// SINGLE RESPONSIBILITY PRINCIPLE
// =====================================================

/**
 * Middleware de Autenticación - Responsabilidad única: verificación de autenticación
 */
class AuthMiddleware {
  constructor() {
    this.authService = AuthServiceFactory.create()
  }

  // =====================================================
  // MÉTODOS PÚBLICOS
  // =====================================================

  /**
   * Middleware para verificar autenticación
   * Requiere que el usuario esté autenticado
   */
  requireAuth() {
    return async (req, res, next) => {
      try {
        const sessionToken = CookieManager.getCookie(req, 'sessionToken')

        if (!sessionToken) {
          return res.status(401).json({
            success: false,
            error: 'Acceso denegado. Inicia sesión para continuar.'
          })
        }

        const result = await this.authService.validateToken(sessionToken)

        if (!result.success) {
          // Token inválido, limpiar cookies
          CookieManager.clearCookie(res, 'sessionToken')
          CookieManager.clearCookie(res, 'accessToken')
          
          return res.status(401).json({
            success: false,
            error: result.error || 'Sesión expirada. Inicia sesión nuevamente.'
          })
        }

        // Agregar información del usuario al request
        req.user = result.data.user
        req.sessionToken = sessionToken
        
        next()
      } catch (error) {
        console.error('❌ Error en middleware requireAuth:', error)
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor'
        })
      }
    }
  }

  /**
   * Middleware para verificar autenticación opcional
   * No requiere autenticación pero agrega información si está disponible
   */
  optionalAuth() {
    return async (req, res, next) => {
      try {
        const sessionToken = CookieManager.getCookie(req, 'sessionToken')

        if (sessionToken) {
          const result = await this.authService.validateToken(sessionToken)

          if (result.success) {
            req.user = result.data.user
            req.sessionToken = sessionToken
            req.isAuthenticated = true
          } else {
            // Token inválido, limpiar cookies
            CookieManager.clearCookie(res, 'sessionToken')
            CookieManager.clearCookie(res, 'accessToken')
            req.isAuthenticated = false
          }
        } else {
          req.isAuthenticated = false
        }

        next()
      } catch (error) {
        console.error('❌ Error en middleware optionalAuth:', error)
        req.isAuthenticated = false
        next()
      }
    }
  }

  /**
   * Middleware para verificar roles de usuario
   * Requiere autenticación y rol específico
   */
  requireRole(requiredRole) {
    return [
      this.requireAuth(),
      (req, res, next) => {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            error: 'Usuario no autenticado'
          })
        }

        // Verificar si el usuario tiene el rol requerido
        const userRole = req.user.role || 'user'
        
        if (userRole !== requiredRole && userRole !== 'admin') {
          return res.status(403).json({
            success: false,
            error: 'Acceso denegado. No tienes permisos suficientes.'
          })
        }

        next()
      }
    ]
  }

  /**
   * Middleware para verificar si el usuario es propietario del recurso
   * Requiere autenticación y que el usuario sea propietario
   */
  requireOwnership(resourceIdField = 'userId') {
    return [
      this.requireAuth(),
      (req, res, next) => {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            error: 'Usuario no autenticado'
          })
        }

        const resourceUserId = req.params[resourceIdField] || req.body[resourceIdField]
        
        if (!resourceUserId) {
          return res.status(400).json({
            success: false,
            error: 'ID de recurso no proporcionado'
          })
        }

        // Verificar si el usuario es propietario o admin
        const userRole = req.user.role || 'user'
        const isOwner = resourceUserId === req.user.id
        const isAdmin = userRole === 'admin'

        if (!isOwner && !isAdmin) {
          return res.status(403).json({
            success: false,
            error: 'Acceso denegado. Solo puedes acceder a tus propios recursos.'
          })
        }

        next()
      }
    ]
  }

  /**
   * Middleware para rate limiting
   * Limita el número de requests por IP
   */
  rateLimit(maxRequests = 100, windowMs = 15 * 60 * 1000) { // 100 requests por 15 minutos
    const requests = new Map()

    return (req, res, next) => {
      const ip = req.ip || req.connection.remoteAddress
      const now = Date.now()
      const windowStart = now - windowMs

      // Limpiar requests antiguos
      if (requests.has(ip)) {
        requests.set(ip, requests.get(ip).filter(timestamp => timestamp > windowStart))
      } else {
        requests.set(ip, [])
      }

      const userRequests = requests.get(ip)

      if (userRequests.length >= maxRequests) {
        return res.status(429).json({
          success: false,
          error: 'Demasiadas requests. Intenta nuevamente más tarde.'
        })
      }

      userRequests.push(now)
      next()
    }
  }

  /**
   * Middleware para logging de requests
   */
  requestLogger() {
    return (req, res, next) => {
      const start = Date.now()
      
      res.on('finish', () => {
        const duration = Date.now() - start
        const method = req.method
        const url = req.url
        const status = res.statusCode
        const userAgent = req.get('User-Agent')
        const ip = req.ip || req.connection.remoteAddress
        
        console.log(`${method} ${url} ${status} ${duration}ms - ${ip} - ${userAgent}`)
      })

      next()
    }
  }

  /**
   * Middleware para manejo de errores
   */
  errorHandler() {
    return (error, req, res, next) => {
      console.error('❌ Error no manejado:', error)

      // Determinar el tipo de error
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Datos de entrada inválidos',
          details: error.message
        })
      }

      if (error.name === 'UnauthorizedError') {
        return res.status(401).json({
          success: false,
          error: 'No autorizado'
        })
      }

      if (error.name === 'ForbiddenError') {
        return res.status(403).json({
          success: false,
          error: 'Acceso denegado'
        })
      }

      // Error por defecto
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  /**
   * Middleware para CORS
   */
  cors() {
    return (req, res, next) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://hogarzen.com',
        'https://www.hogarzen.com'
      ]

      const origin = req.headers.origin
      
      if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin)
      }

      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      res.header('Access-Control-Allow-Credentials', 'true')

      if (req.method === 'OPTIONS') {
        return res.status(200).end()
      }

      next()
    }
  }
}

// =====================================================
// DEPENDENCY INVERSION PRINCIPLE
// =====================================================

/**
 * Factory para crear instancias del middleware
 */
class AuthMiddlewareFactory {
  static create() {
    return new AuthMiddleware()
  }
}

module.exports = {
  AuthMiddleware,
  AuthMiddlewareFactory
} 