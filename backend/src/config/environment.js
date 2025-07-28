// =====================================================
// CONFIGURACIÓN DE VARIABLES DE ENTORNO - BACKEND
// =====================================================

require('dotenv').config({ path: '.env.local' })

class EnvironmentManager {
  constructor() {
    this.validateEnvironment()
  }

  // =====================================================
  // VALIDACIÓN DE VARIABLES DE ENTORNO
  // =====================================================
  validateEnvironment() {
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_GEMINI_API_KEY'
    ]

    const missingVars = requiredVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      console.warn('⚠️ Variables de entorno faltantes:', missingVars)
      console.warn('📝 Asegúrate de que el archivo .env.local esté configurado correctamente')
    }
  }

  // =====================================================
  // CONFIGURACIÓN DE SUPABASE
  // =====================================================
  get supabase() {
    return {
      url: process.env.VITE_SUPABASE_URL,
      anonKey: process.env.VITE_SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      isConfigured: !!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY)
    }
  }

  // =====================================================
  // CONFIGURACIÓN DE GEMINI
  // =====================================================
  get gemini() {
    return {
      apiKey: process.env.VITE_GEMINI_API_KEY,
      projectId: process.env.VITE_GEMINI_PROJECT_ID,
      isConfigured: !!process.env.VITE_GEMINI_API_KEY
    }
  }

  // =====================================================
  // CONFIGURACIÓN DEL SERVIDOR
  // =====================================================
  get server() {
    return {
      port: process.env.PORT || 8000,
      nodeEnv: process.env.NODE_ENV || 'development',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      jwtSecret: process.env.JWT_SECRET || 'hogarzen-secret-key-change-in-production',
      cookieSecret: process.env.COOKIE_SECRET || 'hogarzen-cookie-secret-change-in-production'
    }
  }

  // =====================================================
  // CONFIGURACIÓN DE SEGURIDAD
  // =====================================================
  get security() {
    return {
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
      refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
      cookieMaxAge: process.env.COOKIE_MAX_AGE || 7 * 24 * 60 * 60 * 1000, // 7 días
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
    }
  }

  // =====================================================
  // CONFIGURACIÓN DE RATE LIMITING
  // =====================================================
  get rateLimit() {
    return {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      authWindowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
      authMaxRequests: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5
    }
  }

  // =====================================================
  // INFORMACIÓN DE DEBUG
  // =====================================================
  getDebugInfo() {
    return {
      supabase: {
        urlConfigured: !!this.supabase.url,
        keyConfigured: !!this.supabase.anonKey,
        urlPreview: this.supabase.url ? `${this.supabase.url.substring(0, 20)}...` : 'No configurado',
        keyPreview: this.supabase.anonKey ? `${this.supabase.anonKey.substring(0, 10)}...` : 'No configurado'
      },
      gemini: {
        keyConfigured: !!this.gemini.apiKey,
        keyPreview: this.gemini.apiKey ? `${this.gemini.apiKey.substring(0, 10)}...` : 'No configurado',
        projectIdConfigured: !!this.gemini.projectId
      },
      server: {
        port: this.server.port,
        nodeEnv: this.server.nodeEnv,
        corsOrigin: this.server.corsOrigin
      }
    }
  }

  // =====================================================
  // VALIDACIÓN DE CONFIGURACIÓN COMPLETA
  // =====================================================
  isConfigurationComplete() {
    return this.supabase.isConfigured && this.gemini.isConfigured
  }

  // =====================================================
  // OBTENER CONFIGURACIÓN PARA DIFERENTES ENTORNOS
  // =====================================================
  getConfigForEnvironment(env = 'development') {
    const configs = {
      development: {
        cors: {
          origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
          credentials: true
        },
        logging: true,
        debug: true
      },
      production: {
        cors: {
          origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://hogarzen.com'],
          credentials: true
        },
        logging: false,
        debug: false
      },
      test: {
        cors: {
          origin: ['http://localhost:3000'],
          credentials: true
        },
        logging: false,
        debug: true
      }
    }

    return configs[env] || configs.development
  }
}

// Crear instancia singleton
const environmentManager = new EnvironmentManager()

module.exports = {
  environmentManager,
  EnvironmentManager
} 