import { createClient } from '@supabase/supabase-js';
import { environmentManager } from './environment';

// =====================================================
// CONFIGURACIÓN DE SUPABASE - PRINCIPIOS SOLID
// =====================================================

// Clase para manejar la configuración de Supabase (Single Responsibility)
class SupabaseConfig {
  private client: any;

  constructor() {
    this.client = this.createClient();
  }

  // Método privado para crear el cliente (Encapsulation)
  private createClient() {
    const config = environmentManager.getSupabaseConfig();
    
    console.log('🔧 Configurando Supabase...');
    console.log('URL:', config.url ? `${config.url.split('.')[0]}...` : '❌ No configurada');
    console.log('Key:', config.anonKey ? '***' + config.anonKey.slice(-10) : '❌ No configurada');

    return createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
  }

  // Método público para obtener el cliente (Dependency Inversion)
  public getClient() {
    return this.client;
  }

  // Método para verificar conectividad
  public async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.client.from('users').select('count').limit(1);
      
      if (error) {
        console.error('❌ Error de conectividad con Supabase:', error);
        return false;
      }
      
      console.log('✅ Conexión con Supabase exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error de red con Supabase:', error);
      return false;
    }
  }

  // Método para obtener información de debug
  public getDebugInfo() {
    const config = environmentManager.getSupabaseConfig();
    return {
      urlConfigured: !!config.url,
      keyConfigured: !!config.anonKey,
      urlPreview: config.url ? `${config.url.split('.')[0]}...` : 'No configurada',
    };
  }
}

// Instancia singleton
const supabaseConfig = new SupabaseConfig();

// Exportar el cliente y métodos
export const supabase = supabaseConfig.getClient();
export const testSupabaseConnection = () => supabaseConfig.testConnection();
export const getSupabaseDebugInfo = () => supabaseConfig.getDebugInfo(); 