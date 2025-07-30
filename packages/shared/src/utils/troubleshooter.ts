// =====================================================
// DIAGNÓSTICO Y SOLUCIÓN DE PROBLEMAS - HOGARZEN
// =====================================================

import { environmentManager } from '../config/environment'
import SupabaseChecker from './supabaseChecker'
import CookieManager from './cookies'

export interface TroubleshootingResult {
  issue: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  solution: string
  automated?: boolean
}

export class Troubleshooter {
  /**
   * Ejecuta un diagnóstico completo del sistema
   */
  static async runFullDiagnostic(): Promise<TroubleshootingResult[]> {
    const results: TroubleshootingResult[] = []
    
    console.log('🔍 Iniciando diagnóstico completo de HogarZen...')
    
    // 1. Verificar configuración básica
    results.push(...this.checkBasicConfiguration())
    
    // 2. Verificar conectividad
    const connectivityResults = await this.checkConnectivity()
    results.push(...connectivityResults)
    
    // 3. Verificar cookies y sesión
    results.push(...this.checkCookiesAndSession())
    
    // 4. Verificar entorno
    results.push(...this.checkEnvironment())
    
    console.log(`✅ Diagnóstico completado. ${results.length} problemas encontrados.`)
    
    return results
  }

  /**
   * Verifica la configuración básica
   */
  private static checkBasicConfiguration(): TroubleshootingResult[] {
    const results: TroubleshootingResult[] = []
    const config = environmentManager.getSupabaseConfig()
    const debugInfo = environmentManager.getDebugInfo()
    
    // Verificar URL de Supabase
    if (!config.url) {
      results.push({
        issue: 'URL de Supabase no configurada',
        severity: 'critical',
        description: 'La variable VITE_SUPABASE_URL no está configurada en el archivo .env.local',
        solution: 'Configura VITE_SUPABASE_URL con la URL de tu proyecto de Supabase (ej: https://tu-proyecto.supabase.co)',
        automated: false
      })
    } else if (!this.isValidUrl(config.url)) {
      results.push({
        issue: 'URL de Supabase inválida',
        severity: 'critical',
        description: `La URL configurada "${config.url}" no es válida`,
        solution: 'Verifica que la URL incluya https:// y sea una URL válida de Supabase',
        automated: false
      })
    }

    // Verificar clave anónima de Supabase
    if (!config.anonKey) {
      results.push({
        issue: 'Clave anónima de Supabase no configurada',
        severity: 'critical',
        description: 'La variable VITE_SUPABASE_ANON_KEY no está configurada',
        solution: 'Configura VITE_SUPABASE_ANON_KEY con la clave anónima de tu proyecto de Supabase',
        automated: false
      })
    } else if (config.anonKey === 'tu_clave_anonima_de_supabase') {
      results.push({
        issue: 'Usando credenciales de ejemplo',
        severity: 'high',
        description: 'Estás usando las credenciales de ejemplo en lugar de las reales',
        solution: 'Reemplaza las credenciales de ejemplo con las reales de tu proyecto de Supabase',
        automated: false
      })
    }

    // Verificar configuración de Gemini
    const geminiConfig = environmentManager.getGeminiConfig()
    if (!geminiConfig.apiKey) {
      results.push({
        issue: 'API Key de Gemini no configurada',
        severity: 'medium',
        description: 'La variable VITE_GEMINI_API_KEY no está configurada',
        solution: 'Configura VITE_GEMINI_API_KEY con tu clave de API de Google AI Studio',
        automated: false
      })
    } else if (geminiConfig.apiKey === 'tu_api_key_de_gemini') {
      results.push({
        issue: 'Usando API Key de ejemplo de Gemini',
        severity: 'medium',
        description: 'Estás usando la API Key de ejemplo de Gemini',
        solution: 'Reemplaza con tu API Key real de Google AI Studio',
        automated: false
      })
    }

    return results
  }

  /**
   * Verifica la conectividad
   */
  private static async checkConnectivity(): Promise<TroubleshootingResult[]> {
    const results: TroubleshootingResult[] = []
    
    try {
      const connectionCheck = await SupabaseChecker.checkConnection()
      
      if (!connectionCheck.isConnected) {
        results.push({
          issue: 'Error de conectividad con Supabase',
          severity: 'critical',
          description: connectionCheck.error || 'No se puede conectar con Supabase',
          solution: this.getConnectivitySolution(connectionCheck.error),
          automated: false
        })
      }
    } catch (error: any) {
      results.push({
        issue: 'Error verificando conectividad',
        severity: 'high',
        description: `Error inesperado: ${error.message}`,
        solution: 'Revisa la consola para más detalles y verifica tu conexión a internet',
        automated: false
      })
    }

    return results
  }

  /**
   * Verifica cookies y sesión
   */
  private static checkCookiesAndSession(): TroubleshootingResult[] {
    const results: TroubleshootingResult[] = []
    const debugInfo = CookieManager.getDebugInfo()
    
    // Verificar si las cookies están habilitadas
    if (debugInfo.totalCookies === 0 && !this.areCookiesEnabled()) {
      results.push({
        issue: 'Cookies deshabilitadas',
        severity: 'high',
        description: 'Las cookies están deshabilitadas en el navegador',
        solution: 'Habilita las cookies en tu navegador para que la aplicación funcione correctamente',
        automated: false
      })
    }

    // Verificar consentimiento de cookies
    const cookieConsent = CookieManager.getCookie('hogarzen_cookie_consent')
    if (!cookieConsent) {
      results.push({
        issue: 'Consentimiento de cookies no dado',
        severity: 'low',
        description: 'El usuario no ha dado consentimiento para el uso de cookies',
        solution: 'Acepta las cookies en el banner que aparece en la parte inferior de la página',
        automated: false
      })
    }

    return results
  }

  /**
   * Verifica el entorno
   */
  private static checkEnvironment(): TroubleshootingResult[] {
    const results: TroubleshootingResult[] = []
    const appConfig = environmentManager.getAppConfig()
    
    // Verificar si estamos en desarrollo
    if (appConfig.environment === 'development') {
      results.push({
        issue: 'Ejecutando en modo desarrollo',
        severity: 'low',
        description: 'La aplicación está ejecutándose en modo desarrollo',
        solution: 'Para producción, ejecuta npm run build y sirve los archivos estáticos',
        automated: false
      })
    }

    // Verificar si estamos en Docker
    if (environmentManager.isDockerEnvironment()) {
      results.push({
        issue: 'Ejecutando en contenedor Docker',
        severity: 'low',
        description: 'La aplicación está ejecutándose en un contenedor Docker',
        solution: 'Verifica que las variables de entorno estén configuradas en docker-compose.yml',
        automated: false
      })
    }

    return results
  }

  /**
   * Obtiene la solución específica para problemas de conectividad
   */
  private static getConnectivitySolution(error?: string): string {
    if (!error) return 'Verifica tu conexión a internet y que el proyecto de Supabase esté activo'
    
    if (error.includes('fetch')) {
      return 'Error de red. Verifica tu conexión a internet y que el proyecto de Supabase esté activo'
    }
    
    if (error.includes('timeout')) {
      return 'Timeout de conexión. El servicio puede estar lento. Intenta nuevamente en unos minutos'
    }
    
    if (error.includes('CORS')) {
      return 'Error de CORS. Verifica la configuración de tu proyecto de Supabase en Settings > API'
    }
    
    if (error.includes('ejemplo')) {
      return 'Reemplaza las credenciales de ejemplo con las reales de tu proyecto de Supabase'
    }
    
    return 'Verifica que las credenciales sean correctas y que el proyecto esté activo'
  }

  /**
   * Verifica si las cookies están habilitadas
   */
  private static areCookiesEnabled(): boolean {
    try {
      document.cookie = 'test=1'
      const enabled = document.cookie.indexOf('test=') !== -1
      document.cookie = 'test=1; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      return enabled
    } catch {
      return false
    }
  }

  /**
   * Verifica si una URL es válida
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * Genera un reporte de diagnóstico
   */
  static generateReport(results: TroubleshootingResult[]): string {
    const critical = results.filter(r => r.severity === 'critical')
    const high = results.filter(r => r.severity === 'high')
    const medium = results.filter(r => r.severity === 'medium')
    const low = results.filter(r => r.severity === 'low')

    let report = `# 🔍 Reporte de Diagnóstico - HogarZen\n\n`
    report += `**Fecha:** ${new Date().toLocaleString('es-ES')}\n`
    report += `**Total de problemas:** ${results.length}\n\n`
    
    report += `## 📊 Resumen\n`
    report += `- 🔴 Críticos: ${critical.length}\n`
    report += `- 🟠 Altos: ${high.length}\n`
    report += `- 🟡 Medios: ${medium.length}\n`
    report += `- 🟢 Bajos: ${low.length}\n\n`

    if (critical.length > 0) {
      report += `## 🔴 Problemas Críticos\n`
      critical.forEach(result => {
        report += `### ${result.issue}\n`
        report += `**Descripción:** ${result.description}\n`
        report += `**Solución:** ${result.solution}\n\n`
      })
    }

    if (high.length > 0) {
      report += `## 🟠 Problemas Altos\n`
      high.forEach(result => {
        report += `### ${result.issue}\n`
        report += `**Descripción:** ${result.description}\n`
        report += `**Solución:** ${result.solution}\n\n`
      })
    }

    if (medium.length > 0) {
      report += `## 🟡 Problemas Medios\n`
      medium.forEach(result => {
        report += `### ${result.issue}\n`
        report += `**Descripción:** ${result.description}\n`
        report += `**Solución:** ${result.solution}\n\n`
      })
    }

    if (low.length > 0) {
      report += `## 🟢 Problemas Bajos\n`
      low.forEach(result => {
        report += `### ${result.issue}\n`
        report += `**Descripción:** ${result.description}\n`
        report += `**Solución:** ${result.solution}\n\n`
      })
    }

    return report
  }
}

export default Troubleshooter 