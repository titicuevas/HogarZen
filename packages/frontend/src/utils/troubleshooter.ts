// =====================================================
// UTILIDADES DE DIAGNÓSTICO Y SOLUCIÓN DE PROBLEMAS
// =====================================================

export interface DiagnosticResult {
  isValid: boolean
  issues: string[]
  suggestions: string[]
}

export class Troubleshooter {
  /**
   * Diagnostica problemas de configuración
   */
  static diagnoseConfiguration(): DiagnosticResult {
    const issues: string[] = []
    const suggestions: string[] = []

    // Verificar variables de entorno
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!supabaseUrl) {
      issues.push('VITE_SUPABASE_URL no está configurada')
      suggestions.push('Configura la URL de tu proyecto Supabase en el archivo .env.local')
    }

    if (!supabaseKey) {
      issues.push('VITE_SUPABASE_ANON_KEY no está configurada')
      suggestions.push('Configura la clave anónima de Supabase en el archivo .env.local')
    }

    if (!geminiKey) {
      suggestions.push('VITE_GEMINI_API_KEY no está configurada (opcional para funcionalidades de IA)')
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    }
  }

  /**
   * Diagnostica problemas de conectividad
   */
  static async diagnoseConnectivity(): Promise<DiagnosticResult> {
    const issues: string[] = []
    const suggestions: string[] = []

    try {
      // Verificar conectividad básica
      const response = await fetch('https://httpbin.org/get', { 
        method: 'GET',
        mode: 'cors'
      })
      
      if (!response.ok) {
        issues.push('Problemas de conectividad detectados')
        suggestions.push('Verifica tu conexión a internet')
      }
    } catch (error) {
      issues.push('No se puede conectar a internet')
      suggestions.push('Verifica tu conexión a internet y firewall')
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    }
  }

  /**
   * Diagnostica problemas del navegador
   */
  static diagnoseBrowser(): DiagnosticResult {
    const issues: string[] = []
    const suggestions: string[] = []

    // Verificar características del navegador
    if (!window.fetch) {
      issues.push('Fetch API no está disponible')
      suggestions.push('Actualiza tu navegador a una versión más reciente')
    }

    if (!window.localStorage) {
      issues.push('LocalStorage no está disponible')
      suggestions.push('Habilita las cookies y el almacenamiento local')
    }

    if (!window.crypto) {
      issues.push('Crypto API no está disponible')
      suggestions.push('Actualiza tu navegador a una versión más reciente')
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    }
  }

  /**
   * Ejecuta diagnóstico completo
   */
  static async runFullDiagnostic(): Promise<{
    configuration: DiagnosticResult
    connectivity: DiagnosticResult
    browser: DiagnosticResult
    overall: boolean
  }> {
    const configuration = this.diagnoseConfiguration()
    const connectivity = await this.diagnoseConnectivity()
    const browser = this.diagnoseBrowser()

    const overall = configuration.isValid && connectivity.isValid && browser.isValid

    return {
      configuration,
      connectivity,
      browser,
      overall
    }
  }
} 