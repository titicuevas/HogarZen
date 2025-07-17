import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificación más detallada de las credenciales
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Supabase no está configurado correctamente')
  console.error('URL:', supabaseUrl ? '✅ Configurada' : '❌ Faltante')
  console.error('ANON KEY:', supabaseAnonKey ? '✅ Configurada' : '❌ Faltante')
  console.error('Verifica que el archivo .env.local existe en la carpeta frontend/')
} else {
  console.log('✅ Supabase configurado correctamente')
  // Solo mostrar parte de la URL por seguridad
  const urlParts = supabaseUrl.split('.')
  const safeUrl = urlParts.length > 2 ? `${urlParts[0]}.${urlParts[1]}.${urlParts[2]}` : supabaseUrl
  console.log('URL:', safeUrl)
  console.log('ANON KEY:', '***' + supabaseAnonKey.slice(-10))
}

// Crear cliente con configuración mejorada
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
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
  }
)

// Función para verificar la conectividad
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error) {
      console.error('❌ Error de conectividad con Supabase:', error)
      return false
    }
    console.log('✅ Conexión con Supabase exitosa')
    return true
  } catch (error) {
    console.error('❌ Error de red con Supabase:', error)
    return false
  }
} 