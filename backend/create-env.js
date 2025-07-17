const fs = require('fs');
const path = require('path');

const envContent = `# =====================================================
# CONFIGURACIÓN DE SUPABASE
# =====================================================
# Reemplaza estos valores con tus credenciales reales de Supabase
# Puedes encontrarlas en: https://supabase.com/dashboard/project/[TU-PROYECTO]/settings/api

VITE_SUPABASE_URL=https://placeholder.supabase.co
VITE_SUPABASE_ANON_KEY=placeholder-key

# =====================================================
# INSTRUCCIONES
# =====================================================
# 1. Ve a https://supabase.com/dashboard
# 2. Selecciona tu proyecto
# 3. Ve a Settings > API
# 4. Copia la "Project URL" y reemplaza VITE_SUPABASE_URL
# 5. Copia la "anon public" key y reemplaza VITE_SUPABASE_ANON_KEY
# 6. Guarda este archivo y reinicia el servidor de desarrollo
`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado exitosamente');
  console.log('📝 Reemplaza los valores placeholder con tus credenciales reales de Supabase');
  console.log('🔄 Reinicia el servidor de desarrollo después de actualizar las credenciales');
} catch (error) {
  console.error('❌ Error creando .env.local:', error.message);
} 