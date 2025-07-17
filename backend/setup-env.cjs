#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔧 Configurando variables de entorno para HogarZen...\n')

const envPath = path.join(__dirname, '.env.local')

// Verificar si ya existe el archivo
if (fs.existsSync(envPath)) {
  console.log('⚠️  El archivo .env.local ya existe.')
  console.log('Si necesitas actualizarlo, edítalo manualmente o elimínalo y ejecuta este script de nuevo.\n')
  process.exit(0)
}

// Contenido del archivo .env.local
const envContent = `# =====================================================
# CONFIGURACIÓN DE SUPABASE
# =====================================================

# URL del proyecto de Supabase
# Obtén esto desde: https://supabase.com/dashboard/project/[tu-proyecto]/settings/api
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Clave anónima pública de Supabase
# Obtén esto desde: https://supabase.com/dashboard/project/[tu-proyecto]/settings/api
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# =====================================================
# CONFIGURACIÓN DE GEMINI AI (OPCIONAL)
# =====================================================

# ID del proyecto de Google Cloud
VITE_GEMINI_PROJECT_ID=your-gemini-project-id

# Clave API de Gemini
VITE_GEMINI_API_KEY=your-gemini-api-key

# =====================================================
# CONFIGURACIÓN DE DESARROLLO
# =====================================================

# Modo de desarrollo
VITE_APP_ENV=development

# URL base de la aplicación
VITE_APP_URL=http://localhost:5173
`

try {
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Archivo .env.local creado exitosamente!')
  console.log('📁 Ubicación:', envPath)
  console.log('\n📋 Próximos pasos:')
  console.log('1. Edita el archivo .env.local con tus credenciales reales')
  console.log('2. Obtén las credenciales desde: https://supabase.com/dashboard')
  console.log('3. Reemplaza los valores placeholder con tus credenciales reales')
  console.log('4. Reinicia el servidor de desarrollo: npm run dev')
  console.log('\n📖 Para más información, consulta: ENV_SETUP.md')
} catch (error) {
  console.error('❌ Error creando el archivo .env.local:', error.message)
  process.exit(1)
} 