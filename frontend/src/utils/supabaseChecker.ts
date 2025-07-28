// =====================================================
// VERIFICADOR DE CONECTIVIDAD SUPABASE
// =====================================================

import { supabase } from '../config/supabase'
import { environmentManager } from '../config/environment'

export class SupabaseChecker {
  /**
   * Verifica la conectividad con Supabase
   */
  static async checkConnection(): Promise<{
    isConnected: boolean
    error?: string
    details?: any
  }> {
    try {
      console.log('🔍 Verificando conectividad con Supabase...')
      
      // Verificar configuración
      const config = environmentManager.getSupabaseConfig()
      
      if (!config.url || !config.anonKey) {
        return {
          isConnected: false,
          error: 'Configuración de Supabase incompleta',
          details: {
            urlConfigured: !!config.url,
            keyConfigured: !!config.anonKey
          }
        }
      }

      // Verificar si las credenciales son de ejemplo
      if (config.anonKey === 'tu_clave_anonima_de_supabase') {
        return {
          isConnected: false,
          error: 'Credenciales de Supabase no configuradas (usando valores de ejemplo)',
          details: {
            url: config.url,
            keyPreview: '***' + config.anonKey.slice(-10)
          }
        }
      }

      // Intentar una consulta simple
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)
        .timeout(5000) // 5 segundos de timeout

      if (error) {
        console.error('❌ Error de conectividad:', error)
        return {
          isConnected: false,
          error: this.getErrorMessage(error.message),
          details: {
            errorCode: error.code,
            errorMessage: error.message,
            errorDetails: error.details
          }
        }
      }

      console.log('✅ Conexión con Supabase exitosa')
      return {
        isConnected: true,
        details: {
          url: config.url,
          responseTime: 'OK'
        }
      }

    } catch (error: any) {
      console.error('❌ Error inesperado verificando Supabase:', error)
      
      let errorMessage = 'Error de conectividad con Supabase'
      
      if (error.message?.includes('fetch')) {
        errorMessage = 'No se puede conectar con Supabase. Verifica tu conexión a internet y que el proyecto esté activo.'
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Timeout al conectar con Supabase. El servicio puede estar lento.'
      } else if (error.message?.includes('CORS')) {
        errorMessage = 'Error de CORS. Verifica la configuración del proyecto de Supabase.'
      }

      return {
        isConnected: false,
        error: errorMessage,
        details: {
          originalError: error.message,
          stack: error.stack
        }
      }
    }
  }

  /**
   * Verifica la configuración del proyecto
   */
  static async checkProjectConfiguration(): Promise<{
    isConfigured: boolean
    issues: string[]
    recommendations: string[]
  }> {
    const issues: string[] = []
    const recommendations: string[] = []

    try {
      // Verificar configuración básica
      const config = environmentManager.getSupabaseConfig()
      
      if (!config.url) {
        issues.push('URL de Supabase no configurada')
        recommendations.push('Configura VITE_SUPABASE_URL en tu archivo .env.local')
      }

      if (!config.anonKey) {
        issues.push('Clave anónima de Supabase no configurada')
        recommendations.push('Configura VITE_SUPABASE_ANON_KEY en tu archivo .env.local')
      }

      if (config.anonKey === 'tu_clave_anonima_de_supabase') {
        issues.push('Usando credenciales de ejemplo')
        recommendations.push('Reemplaza las credenciales de ejemplo con las reales de tu proyecto')
      }

      // Verificar conectividad
      const connectionCheck = await this.checkConnection()
      
      if (!connectionCheck.isConnected) {
        issues.push(`Error de conectividad: ${connectionCheck.error}`)
        recommendations.push('Verifica que tu proyecto de Supabase esté activo')
        recommendations.push('Asegúrate de que las credenciales sean correctas')
      }

      // Verificar tablas necesarias
      if (connectionCheck.isConnected) {
        const tablesCheck = await this.checkRequiredTables()
        issues.push(...tablesCheck.issues)
        recommendations.push(...tablesCheck.recommendations)
      }

      return {
        isConfigured: issues.length === 0,
        issues,
        recommendations
      }

    } catch (error: any) {
      issues.push(`Error verificando configuración: ${error.message}`)
      return {
        isConfigured: false,
        issues,
        recommendations: ['Revisa la consola para más detalles']
      }
    }
  }

  /**
   * Verifica que las tablas necesarias existan
   */
  private static async checkRequiredTables(): Promise<{
    issues: string[]
    recommendations: string[]
  }> {
    const issues: string[] = []
    const recommendations: string[] = []
    const requiredTables = ['users', 'tasks', 'user_tasks']

    try {
      for (const tableName of requiredTables) {
        const { error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)

        if (error) {
          issues.push(`Tabla '${tableName}' no encontrada o sin permisos`)
          recommendations.push(`Crea la tabla '${tableName}' en tu proyecto de Supabase`)
        }
      }
    } catch (error: any) {
      issues.push(`Error verificando tablas: ${error.message}`)
    }

    return { issues, recommendations }
  }

  /**
   * Obtiene información de debug
   */
  static getDebugInfo() {
    const config = environmentManager.getSupabaseConfig()
    const debugInfo = environmentManager.getDebugInfo()
    
    return {
      supabase: {
        urlConfigured: !!config.url,
        keyConfigured: !!config.anonKey,
        urlPreview: config.url ? `${config.url.split('.')[0]}...` : 'No configurada',
        keyPreview: config.anonKey ? '***' + config.anonKey.slice(-10) : 'No configurada',
        isExampleKey: config.anonKey === 'tu_clave_anonima_de_supabase'
      },
      environment: debugInfo.app,
      cookies: {
        hasAuthToken: false, // Se verifica dinámicamente
        hasUserData: false,  // Se verifica dinámicamente
        totalCookies: 0      // Se verifica dinámicamente
      }
    }
  }

  /**
   * Convierte mensajes de error de Supabase a mensajes amigables
   */
  private static getErrorMessage(supabaseError: string): string {
    const errorMessages: Record<string, string> = {
      'JWT expired': 'Token de sesión expirado',
      'Invalid JWT': 'Token de sesión inválido',
      'Not authenticated': 'No autenticado',
      'Permission denied': 'Permiso denegado',
      'Relation does not exist': 'Tabla no encontrada',
      'Connection timeout': 'Timeout de conexión',
      'Network error': 'Error de red',
      'CORS error': 'Error de CORS'
    }

    return errorMessages[supabaseError] || supabaseError
  }
}

export default SupabaseChecker 