// =====================================================
// SERVIDOR PRINCIPAL - BACKEND (PRINCIPIOS SOLID)
// =====================================================

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const compression = require('compression')
require('dotenv').config({ path: '.env.local' })

const { AuthRouterFactory } = require('./routes/authRoutes')
const { AIRouterFactory } = require('./routes/aiRoutes')
const { AuthMiddlewareFactory } = require('./middleware/AuthMiddleware')

// =====================================================
// SINGLE RESPONSIBILITY PRINCIPLE
// =====================================================

/**
 * Configurador de Middleware - Responsabilidad única: configuración de middleware
 */
class MiddlewareConfigurator {
  static configure(app) {
    // Seguridad
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }))

    // CORS
    app.use(cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://hogarzen.com',
        'https://www.hogarzen.com'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }))

    // Parsing
    app.use(express.json({ limit: '10mb' }))
    app.use(express.urlencoded({ extended: true, limit: '10mb' }))
    app.use(cookieParser())

    // Compresión
    app.use(compression())

    // Logging
    const authMiddleware = AuthMiddlewareFactory.create()
    app.use(authMiddleware.requestLogger())

    console.log('✅ Middleware configurado correctamente')
  }
}

/**
 * Configurador de Rutas - Responsabilidad única: configuración de rutas
 */
class RouteConfigurator {
  static configure(app) {
    // Rutas de autenticación
    const authRouter = AuthRouterFactory.create()
    app.use('/api/auth', authRouter.getRouter())

    // Rutas de IA
    const aiRouter = AIRouterFactory.create()
    app.use('/api/ai', aiRouter.getRouter())

    // Ruta de salud
    app.get('/api/health', (req, res) => {
      res.status(200).json({
        success: true,
        data: {
          status: 'OK',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
          version: '1.0.0'
        }
      })
    })

    // Ruta de información de la API
    app.get('/api/info', (req, res) => {
      const authRoutes = authRouter.getRoutesInfo()
      
      res.status(200).json({
        success: true,
        data: {
          name: 'HogarZen API',
          version: '1.0.0',
          description: 'API de autenticación y gestión de tareas del hogar',
          environment: process.env.NODE_ENV || 'development',
          routes: authRoutes,
          documentation: '/api/docs'
        }
      })
    })

    // Ruta de documentación
    app.get('/api/docs', (req, res) => {
      const authRoutes = authRouter.getRoutesInfo()
      
      let docs = `# 🏠 HogarZen API Documentation\n\n`
      docs += `**Versión:** 1.0.0\n`
      docs += `**Entorno:** ${process.env.NODE_ENV || 'development'}\n\n`
      
      docs += `## 🔐 Autenticación\n\n`
      
      docs += `### Rutas Públicas\n`
      authRoutes.public.forEach(route => {
        docs += `- **${route.method}** \`${route.path}\` - ${route.description}\n`
      })
      
      docs += `\n### Rutas Protegidas\n`
      authRoutes.protected.forEach(route => {
        docs += `- **${route.method}** \`${route.path}\` - ${route.description}\n`
      })
      
      if (authRoutes.admin.length > 0) {
        docs += `\n### Rutas de Administración\n`
        authRoutes.admin.forEach(route => {
          docs += `- **${route.method}** \`${route.path}\` - ${route.description}\n`
        })
      }
      
      if (authRoutes.development.length > 0) {
        docs += `\n### Rutas de Desarrollo\n`
        authRoutes.development.forEach(route => {
          docs += `- **${route.method}** \`${route.path}\` - ${route.description}\n`
        })
      }

      res.setHeader('Content-Type', 'text/markdown')
      res.status(200).send(docs)
    })

    // Manejo de rutas no encontradas
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method,
        availableRoutes: '/api/info'
      })
    })

    console.log('✅ Rutas configuradas correctamente')
  }
}

/**
 * Configurador de Errores - Responsabilidad única: manejo de errores
 */
class ErrorConfigurator {
  static configure(app) {
    const authMiddleware = AuthMiddlewareFactory.create()
    
    // Middleware de manejo de errores
    app.use(authMiddleware.errorHandler())

    // Manejo de errores no capturados
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
    })

    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error)
      process.exit(1)
    })

    console.log('✅ Manejo de errores configurado correctamente')
  }
}

// =====================================================
// OPEN/CLOSED PRINCIPLE
// =====================================================

/**
 * Servidor de Aplicación - Extensible sin modificar
 */
class AppServer {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 8000
    this.configure()
  }

  /**
   * Configura la aplicación
   */
  configure() {
    // Configurar middleware
    MiddlewareConfigurator.configure(this.app)
    
    // Configurar rutas
    RouteConfigurator.configure(this.app)
    
    // Configurar manejo de errores
    ErrorConfigurator.configure(this.app)
  }

  /**
   * Inicia el servidor
   */
  start() {
    return new Promise((resolve, reject) => {
      try {
        const server = this.app.listen(this.port, () => {
          console.log('🚀 Servidor iniciado correctamente')
          console.log(`📍 Puerto: ${this.port}`)
          console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`)
          console.log(`📚 Documentación: http://localhost:${this.port}/api/docs`)
          console.log(`💚 Salud: http://localhost:${this.port}/api/health`)
          console.log(`ℹ️  Info: http://localhost:${this.port}/api/info`)
          
          resolve(server)
        })

        server.on('error', (error) => {
          console.error('❌ Error iniciando servidor:', error)
          reject(error)
        })
      } catch (error) {
        console.error('❌ Error configurando servidor:', error)
        reject(error)
      }
    })
  }

  /**
   * Detiene el servidor
   */
  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('🛑 Servidor detenido correctamente')
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  /**
   * Obtiene la aplicación Express
   */
  getApp() {
    return this.app
  }
}

// =====================================================
// DEPENDENCY INVERSION PRINCIPLE
// =====================================================

/**
 * Factory para crear instancias del servidor
 */
class AppServerFactory {
  static create() {
    return new AppServer()
  }
}

// =====================================================
// INICIALIZACIÓN DEL SERVIDOR
// =====================================================

if (require.main === module) {
  const server = AppServerFactory.create()
  
  server.start()
    .then(() => {
      console.log('✅ HogarZen Backend iniciado exitosamente')
    })
    .catch((error) => {
      console.error('❌ Error iniciando HogarZen Backend:', error)
      process.exit(1)
    })

  // Manejo de señales para cierre graceful
  process.on('SIGTERM', () => {
    console.log('🔄 Recibida señal SIGTERM, cerrando servidor...')
    server.stop().then(() => process.exit(0))
  })

  process.on('SIGINT', () => {
    console.log('🔄 Recibida señal SIGINT, cerrando servidor...')
    server.stop().then(() => process.exit(0))
  })
}

module.exports = {
  AppServer,
  AppServerFactory,
  MiddlewareConfigurator,
  RouteConfigurator,
  ErrorConfigurator
} 