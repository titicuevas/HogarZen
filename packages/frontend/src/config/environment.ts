// =====================================================
// CONFIGURACIÓN DE ENTORNO - PRINCIPIOS SOLID
// =====================================================

// Extender ImportMeta para incluir env
declare global {
  interface ImportMeta {
    env: {
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
      VITE_GEMINI_API_KEY?: string;
      VITE_API_URL?: string;
      VITE_DOCKER?: string;
      MODE?: string;
    };
  }
}

// Interface para la configuración (Interface Segregation Principle)
interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  gemini: {
    apiKey: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
    apiUrl: string;
  };
}

// Clase de configuración (Single Responsibility Principle)
class EnvironmentManager {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
  }

  // Método privado para cargar configuración (Encapsulation)
  private loadConfiguration(): EnvironmentConfig {
    return {
      supabase: {
        url: import.meta.env.VITE_SUPABASE_URL || '',
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      },
      gemini: {
        apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
      },
      app: {
        name: 'HogarZen',
        version: '1.0.0',
        environment: (import.meta.env.MODE as 'development' | 'production' | 'test') || 'development',
        apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      },
    };
  }

  // Método para validar configuración (Open/Closed Principle)
  private validateConfiguration(): void {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar Supabase
    if (!this.config.supabase.url) {
      errors.push('VITE_SUPABASE_URL no está configurada');
    } else if (!this.isValidUrl(this.config.supabase.url)) {
      errors.push('VITE_SUPABASE_URL no es una URL válida');
    }

    if (!this.config.supabase.anonKey) {
      errors.push('VITE_SUPABASE_ANON_KEY no está configurada');
    } else if (this.config.supabase.anonKey === 'tu_clave_anonima_de_supabase') {
      warnings.push('VITE_SUPABASE_ANON_KEY tiene valor de ejemplo');
    }

    // Validar Gemini
    if (!this.config.gemini.apiKey) {
      errors.push('VITE_GEMINI_API_KEY no está configurada');
    } else if (this.config.gemini.apiKey === 'tu_api_key_de_gemini') {
      warnings.push('VITE_GEMINI_API_KEY tiene valor de ejemplo');
    }

    // Validar API URL
    if (this.config.app.apiUrl && !this.isValidUrl(this.config.app.apiUrl)) {
      errors.push('VITE_API_URL no es una URL válida');
    }

    // Mostrar warnings en desarrollo
    if (this.config.app.environment === 'development' && warnings.length > 0) {
      console.warn('⚠️ Advertencias de configuración:', warnings);
    }

    if (errors.length > 0) {
      console.error('❌ Errores de configuración:', errors);
      console.error('📝 Crea un archivo .env.local con las variables requeridas');
      console.error('📖 Consulta CONFIGURATION.md para más información');
      throw new Error(`Configuración incompleta: ${errors.join(', ')}`);
    }
  }

  // Método de utilidad para validar URLs
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Métodos públicos para acceder a la configuración (Dependency Inversion Principle)
  public getSupabaseConfig() {
    return { ...this.config.supabase };
  }

  public getGeminiConfig() {
    return { ...this.config.gemini };
  }

  public getAppConfig() {
    return { ...this.config.app };
  }

  // Método para verificar si la configuración está completa
  public isConfigurationComplete(): boolean {
    try {
      // En desarrollo, ser más permisivo
      if (this.config.app.environment === 'development') {
        const hasBasicConfig = this.config.supabase.url && 
                              this.config.supabase.anonKey && 
                              this.config.gemini.apiKey;
        
        if (!hasBasicConfig) {
          return false;
        }

        // Permitir valores de ejemplo en desarrollo
        const hasExampleValues = this.config.supabase.anonKey === 'tu_clave_anonima_de_supabase' ||
                                this.config.gemini.apiKey === 'tu_api_key_de_gemini';
        
        if (hasExampleValues) {
          console.warn('⚠️ Usando valores de ejemplo. Reemplaza con credenciales reales para funcionalidad completa.');
          return true; // Permitir continuar con valores de ejemplo
        }
      }

      this.validateConfiguration();
      return true;
    } catch {
      return false;
    }
  }

  // Método para obtener información de debug (sin exponer credenciales)
  public getDebugInfo() {
    return {
      supabase: {
        urlConfigured: !!this.config.supabase.url,
        keyConfigured: !!this.config.supabase.anonKey,
        urlPreview: this.config.supabase.url ? `${this.config.supabase.url.split('.')[0]}...` : 'No configurada',
      },
      gemini: {
        keyConfigured: !!this.config.gemini.apiKey,
        keyPreview: this.config.gemini.apiKey ? `${this.config.gemini.apiKey.substring(0, 10)}...` : 'No configurada',
      },
      app: this.config.app,
    };
  }

  // Método para verificar si estamos en Docker
  public isDockerEnvironment(): boolean {
    return import.meta.env.VITE_DOCKER === 'true' || 
           process.env.DOCKER === 'true' ||
           window.location.hostname === 'localhost' && window.location.port === '5173';
  }
}

// Instancia singleton (Singleton Pattern)
const environmentManager = new EnvironmentManager();

// Exportar la instancia y tipos
export { environmentManager, EnvironmentConfig };
export default environmentManager; 