// =====================================================
// VERIFICADOR DE CONFIGURACIÓN DE SUPABASE
// =====================================================

export interface SupabaseConfig {
  url: string
  anonKey: string
}

export interface SupabaseCheckResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export class SupabaseChecker {
  /**
   * Verifica la configuración de Supabase
   */
  static checkConfig(config: SupabaseConfig): SupabaseCheckResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Verificar URL
    if (!config.url) {
      errors.push('URL de Supabase no configurada')
    } else if (!this.isValidUrl(config.url)) {
      errors.push('URL de Supabase inválida')
    } else if (!config.url.includes('supabase.co')) {
      warnings.push('URL no parece ser de Supabase')
    }

    // Verificar clave anónima
    if (!config.anonKey) {
      errors.push('Clave anónima de Supabase no configurada')
    } else if (config.anonKey.length < 50) {
      errors.push('Clave anónima parece ser inválida')
    } else if (config.anonKey.includes('your_anon_key')) {
      errors.push('Clave anónima no ha sido configurada (valor por defecto)')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
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
   * Obtiene la configuración desde las variables de entorno
   */
  static getConfigFromEnv(): SupabaseConfig {
    return {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    }
  }

  /**
   * Verifica la configuración actual
   */
  static checkCurrentConfig(): SupabaseCheckResult {
    const config = this.getConfigFromEnv()
    return this.checkConfig(config)
  }
}

export default SupabaseChecker 