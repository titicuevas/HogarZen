// =====================================================
// RUTAS DE AUTENTICACIÓN - BACKEND (PRINCIPIOS SOLID)
// =====================================================

const express = require('express')
const { AuthControllerFactory } = require('../controllers/AuthController')
const { AuthMiddlewareFactory } = require('../middleware/AuthMiddleware')

// =====================================================
// SINGLE RESPONSIBILITY PRINCIPLE
// =====================================================

/**
 * Router de Autenticación - Responsabilidad única: definición de rutas de auth
 */
class AuthRouter {
  constructor() {
    this.router = express.Router()
    this.authController = AuthControllerFactory.create()
    this.authMiddleware = AuthMiddlewareFactory.create()
    
    this.setupRoutes()
  }

  // =====================================================
  // MÉTODOS PRIVADOS
  // =====================================================

  /**
   * Configura las rutas de autenticación
   */
  setupRoutes() {
    // Middleware global para todas las rutas de auth
    this.router.use(this.authMiddleware.requestLogger())
    this.router.use(this.authMiddleware.cors())
    this.router.use(this.authMiddleware.rateLimit(50, 15 * 60 * 1000)) // 50 requests por 15 minutos

    // =====================================================
    // RUTAS PÚBLICAS (sin autenticación requerida)
    // =====================================================

    /**
     * POST /api/auth/login
     * Inicia sesión de usuario
     */
    this.router.post('/login', async (req, res) => {
      await this.authController.login(req, res)
    })

    /**
     * POST /api/auth/register
     * Registra un nuevo usuario
     */
    this.router.post('/register', async (req, res) => {
      await this.authController.register(req, res)
    })

    /**
     * GET /api/auth/status
     * Verifica el estado de la autenticación
     */
    this.router.get('/status', async (req, res) => {
      await this.authController.getAuthStatus(req, res)
    })

    // =====================================================
    // RUTAS PROTEGIDAS (requieren autenticación)
    // =====================================================

    /**
     * POST /api/auth/logout
     * Cierra la sesión del usuario
     */
    this.router.post('/logout', 
      this.authMiddleware.requireAuth(),
      async (req, res) => {
        await this.authController.logout(req, res)
      }
    )

    /**
     * GET /api/auth/me
     * Obtiene información del usuario actual
     */
    this.router.get('/me',
      this.authMiddleware.requireAuth(),
      async (req, res) => {
        await this.authController.getCurrentUser(req, res)
      }
    )

    /**
     * POST /api/auth/refresh
     * Refresca el token de sesión
     */
    this.router.post('/refresh',
      this.authMiddleware.requireAuth(),
      async (req, res) => {
        await this.authController.refreshToken(req, res)
      }
    )

    // =====================================================
    // RUTAS DE ADMINISTRACIÓN (requieren rol admin)
    // =====================================================

    /**
     * GET /api/auth/users
     * Lista todos los usuarios (solo admin)
     */
    this.router.get('/users',
      ...this.authMiddleware.requireRole('admin'),
      async (req, res) => {
        try {
          // Implementar lógica para listar usuarios
          res.status(200).json({
            success: true,
            data: {
              users: [],
              message: 'Lista de usuarios (funcionalidad en desarrollo)'
            }
          })
        } catch (error) {
          console.error('❌ Error listando usuarios:', error)
          res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
          })
        }
      }
    )

    // =====================================================
    // RUTAS DE DIAGNÓSTICO (solo en desarrollo)
    // =====================================================

    if (process.env.NODE_ENV === 'development') {
      /**
       * GET /api/auth/debug
       * Información de debug (solo en desarrollo)
       */
      this.router.get('/debug', async (req, res) => {
        try {
          const debugInfo = {
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
            cookies: req.cookies,
            headers: {
              'user-agent': req.get('User-Agent'),
              'origin': req.get('Origin'),
              'referer': req.get('Referer')
            },
            supabase: {
              url: process.env.VITE_SUPABASE_URL ? 'Configurada' : 'No configurada',
              key: process.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'No configurada'
            }
          }

          res.status(200).json({
            success: true,
            data: debugInfo
          })
        } catch (error) {
          console.error('❌ Error en debug:', error)
          res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
          })
        }
      })
    }

    // =====================================================
    // MANEJO DE ERRORES
    // =====================================================

    // Middleware para manejar rutas no encontradas
    this.router.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method
      })
    })

    // Middleware para manejo de errores
    this.router.use(this.authMiddleware.errorHandler())
  }

  // =====================================================
  // MÉTODOS PÚBLICOS
  // =====================================================

  /**
   * Obtiene el router configurado
   */
  getRouter() {
    return this.router
  }

  /**
   * Obtiene información sobre las rutas disponibles
   */
  getRoutesInfo() {
    return {
      public: [
        { method: 'POST', path: '/api/auth/login', description: 'Iniciar sesión' },
        { method: 'POST', path: '/api/auth/register', description: 'Registrar usuario' },
        { method: 'GET', path: '/api/auth/status', description: 'Estado de autenticación' }
      ],
      protected: [
        { method: 'POST', path: '/api/auth/logout', description: 'Cerrar sesión' },
        { method: 'GET', path: '/api/auth/me', description: 'Obtener usuario actual' },
        { method: 'POST', path: '/api/auth/refresh', description: 'Refrescar token' }
      ],
      admin: [
        { method: 'GET', path: '/api/auth/users', description: 'Listar usuarios (admin)' }
      ],
      development: process.env.NODE_ENV === 'development' ? [
        { method: 'GET', path: '/api/auth/debug', description: 'Información de debug' }
      ] : []
    }
  }
}

// =====================================================
// DEPENDENCY INVERSION PRINCIPLE
// =====================================================

/**
 * Factory para crear instancias del router
 */
class AuthRouterFactory {
  static create() {
    return new AuthRouter()
  }
}

module.exports = {
  AuthRouter,
  AuthRouterFactory
} 