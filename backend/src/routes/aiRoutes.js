// =====================================================
// RUTAS DE IA - BACKEND (PRINCIPIOS SOLID)
// =====================================================

const express = require('express')
const { AIServiceFactory } = require('../services/GeminiService')
const { AuthMiddlewareFactory } = require('../middleware/AuthMiddleware')

class AIRouter {
  constructor() {
    this.router = express.Router()
    this.aiService = AIServiceFactory.create()
    this.authMiddleware = AuthMiddlewareFactory.create()
    this.setupRoutes()
  }

  setupRoutes() {
    // Middleware global para todas las rutas de IA
    this.router.use(this.authMiddleware.requestLogger())
    this.router.use(this.authMiddleware.cors())
    this.router.use(this.authMiddleware.rateLimit(50, 15 * 60 * 1000)) // 50 requests por 15 minutos

    // Rutas públicas
    this.router.get('/status', this.getAIStatus.bind(this))
    this.router.get('/config', this.getAIConfig.bind(this))

    // Rutas protegidas (requieren autenticación)
    this.router.use(this.authMiddleware.requireAuth())
    
    this.router.post('/generate', this.generateResponse.bind(this))
    this.router.post('/analyze-task', this.analyzeTask.bind(this))
    this.router.post('/suggest-improvements', this.suggestImprovements.bind(this))
    this.router.post('/validate-content', this.validateContent.bind(this))

    // Rutas de administración (requieren rol admin)
    this.router.use('/admin', this.authMiddleware.requireRole('admin'))
    this.router.get('/admin/debug', this.getDebugInfo.bind(this))
    this.router.post('/admin/test-connection', this.testConnection.bind(this))

    // Manejador 404 para rutas no encontradas
    this.router.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint de IA no encontrado',
        availableEndpoints: this.getRoutesInfo()
      })
    })

    // Manejador de errores
    this.router.use(this.authMiddleware.errorHandler())
  }

  // =====================================================
  // ENDPOINTS PÚBLICOS
  // =====================================================

  async getAIStatus(req, res) {
    try {
      const status = await this.aiService.validateConfiguration()
      
      res.json({
        success: true,
        data: {
          service: 'Gemini AI',
          status: status.success ? 'Operativo' : 'Error',
          configured: status.data?.isConfigured || false,
          timestamp: new Date().toISOString()
        },
        error: status.error
      })
    } catch (error) {
      console.error('❌ Error obteniendo estado de IA:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  async getAIConfig(req, res) {
    try {
      const config = await this.aiService.validateConfiguration()
      
      res.json({
        success: true,
        data: {
          service: 'Gemini AI',
          model: 'gemini-pro',
          features: [
            'Análisis de tareas',
            'Sugerencias de mejora',
            'Validación de contenido',
            'Generación de respuestas'
          ],
          configuration: config.data
        }
      })
    } catch (error) {
      console.error('❌ Error obteniendo configuración de IA:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  // =====================================================
  // ENDPOINTS PROTEGIDOS
  // =====================================================

  async generateResponse(req, res) {
    try {
      const { prompt, options = {} } = req.body

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'El prompt es requerido y debe ser una cadena de texto'
        })
      }

      if (prompt.length > 1000) {
        return res.status(400).json({
          success: false,
          error: 'El prompt no puede exceder 1000 caracteres'
        })
      }

      const result = await this.aiService.generateResponse(prompt, options)
      
      if (result.success) {
        res.json({
          success: true,
          data: {
            response: result.data,
            prompt: prompt,
            timestamp: new Date().toISOString()
          }
        })
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Error generando respuesta'
        })
      }
    } catch (error) {
      console.error('❌ Error en generateResponse:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  async analyzeTask(req, res) {
    try {
      const { task } = req.body

      if (!task || !task.title) {
        return res.status(400).json({
          success: false,
          error: 'La tarea es requerida y debe tener un título'
        })
      }

      const result = await this.aiService.analyzeTask(task)
      
      if (result.success) {
        res.json({
          success: true,
          data: {
            analysis: result.data,
            task: task,
            timestamp: new Date().toISOString()
          }
        })
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Error analizando tarea'
        })
      }
    } catch (error) {
      console.error('❌ Error en analyzeTask:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  async suggestImprovements(req, res) {
    try {
      const { context } = req.body

      if (!context || typeof context !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'El contexto es requerido y debe ser una cadena de texto'
        })
      }

      if (context.length > 2000) {
        return res.status(400).json({
          success: false,
          error: 'El contexto no puede exceder 2000 caracteres'
        })
      }

      const result = await this.aiService.suggestImprovements(context)
      
      if (result.success) {
        res.json({
          success: true,
          data: {
            improvements: result.data,
            context: context,
            timestamp: new Date().toISOString()
          }
        })
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Error generando sugerencias'
        })
      }
    } catch (error) {
      console.error('❌ Error en suggestImprovements:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  async validateContent(req, res) {
    try {
      const { content } = req.body

      if (!content || typeof content !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'El contenido es requerido y debe ser una cadena de texto'
        })
      }

      if (content.length > 1000) {
        return res.status(400).json({
          success: false,
          error: 'El contenido no puede exceder 1000 caracteres'
        })
      }

      const result = await this.aiService.validateContent(content)
      
      if (result.success) {
        res.json({
          success: true,
          data: {
            validation: result.data,
            content: content,
            timestamp: new Date().toISOString()
          }
        })
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Error validando contenido'
        })
      }
    } catch (error) {
      console.error('❌ Error en validateContent:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  // =====================================================
  // ENDPOINTS DE ADMINISTRACIÓN
  // =====================================================

  async getDebugInfo(req, res) {
    try {
      const config = await this.aiService.validateConfiguration()
      
      res.json({
        success: true,
        data: {
          service: 'Gemini AI',
          configuration: config.data,
          endpoints: this.getRoutesInfo(),
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('❌ Error obteniendo información de debug:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  async testConnection(req, res) {
    try {
      const result = await this.aiService.validateConfiguration()
      
      res.json({
        success: true,
        data: {
          connectionTest: result,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('❌ Error en test de conexión:', error)
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  // =====================================================
  // UTILIDADES
  // =====================================================

  getRouter() {
    return this.router
  }

  getRoutesInfo() {
    return {
      public: [
        'GET /api/ai/status - Estado del servicio de IA',
        'GET /api/ai/config - Configuración del servicio'
      ],
      protected: [
        'POST /api/ai/generate - Generar respuesta',
        'POST /api/ai/analyze-task - Analizar tarea',
        'POST /api/ai/suggest-improvements - Sugerir mejoras',
        'POST /api/ai/validate-content - Validar contenido'
      ],
      admin: [
        'GET /api/ai/admin/debug - Información de debug',
        'POST /api/ai/admin/test-connection - Probar conexión'
      ]
    }
  }
}

class AIRouterFactory {
  static create() {
    return new AIRouter()
  }
}

module.exports = {
  AIRouter,
  AIRouterFactory
} 