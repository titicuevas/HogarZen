const fs = require('fs')
const path = require('path')

console.log('🔧 Configurando variables de entorno para HogarZen Backend...\n')

const envPath = path.join(__dirname, '.env.local')

// Verificar si ya existe el archivo
if (fs.existsSync(envPath)) {
  console.log('⚠️  El archivo .env.local ya existe.')
  console.log('Si necesitas actualizarlo, edítalo manualmente o elimínalo y ejecuta este script de nuevo.\n')
  process.exit(0)
}

// Contenido del archivo .env.local para el backend
const envContent = `# =====================================================
# CONFIGURACIÓN DE SUPABASE - BACKEND
# =====================================================

# URL del proyecto de Supabase
# Obtén esto desde: https://supabase.com/dashboard/project/[tu-proyecto]/settings/api
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Clave anónima pública de Supabase
# Obtén esto desde: https://supabase.com/dashboard/project/[tu-proyecto]/settings/api
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Clave de servicio de Supabase (opcional, para operaciones administrativas)
# Obtén esto desde: https://supabase.com/dashboard/project/[tu-proyecto]/settings/api
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# =====================================================
# CONFIGURACIÓN DE GEMINI AI
# =====================================================

# Clave API de Gemini
# Obtén esto desde: https://makersuite.google.com/app/apikey
VITE_GEMINI_API_KEY=your-gemini-api-key-here

# ID del proyecto de Google Cloud (opcional)
VITE_GEMINI_PROJECT_ID=your-gemini-project-id

# =====================================================
# CONFIGURACIÓN DEL SERVIDOR
# =====================================================

# Puerto del servidor
PORT=8000

# Entorno de ejecución
NODE_ENV=development

# Origen permitido para CORS
CORS_ORIGIN=http://localhost:5173

# =====================================================
# CONFIGURACIÓN DE SEGURIDAD
# =====================================================

# Clave secreta para JWT (cambiar en producción)
JWT_SECRET=hogarzen-jwt-secret-key-change-in-production

# Clave secreta para cookies (cambiar en producción)
COOKIE_SECRET=hogarzen-cookie-secret-change-in-production

# Tiempo de expiración del token JWT
JWT_EXPIRES_IN=24h

# Tiempo de expiración del token de refresco
REFRESH_TOKEN_EXPIRES_IN=7d

# Tiempo máximo de vida de las cookies (en milisegundos)
COOKIE_MAX_AGE=604800000

# Número de rondas para bcrypt
BCRYPT_ROUNDS=12

# =====================================================
# CONFIGURACIÓN DE RATE LIMITING
# =====================================================

# Ventana de tiempo para rate limiting general (en milisegundos)
RATE_LIMIT_WINDOW_MS=900000

# Número máximo de requests por ventana de tiempo
RATE_LIMIT_MAX_REQUESTS=100

# Ventana de tiempo para rate limiting de autenticación
AUTH_RATE_LIMIT_WINDOW_MS=900000

# Número máximo de requests de autenticación por ventana
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# =====================================================
# CONFIGURACIÓN DE PRODUCCIÓN
# =====================================================

# Orígenes permitidos en producción (separados por comas)
ALLOWED_ORIGINS=https://hogarzen.com,https://www.hogarzen.com

# =====================================================
# INSTRUCCIONES DE CONFIGURACIÓN
# =====================================================
# 1. Reemplaza los valores "your-*" con tus credenciales reales
# 2. Para Supabase: https://supabase.com/dashboard
# 3. Para Gemini: https://makersuite.google.com/app/apikey
# 4. En producción, cambia las claves secretas por valores seguros
# 5. Reinicia el servidor después de actualizar las credenciales
`

try {
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Archivo .env.local creado exitosamente!')
  console.log('📁 Ubicación:', envPath)
  console.log('\n📋 Próximos pasos:')
  console.log('1. Edita el archivo .env.local con tus credenciales reales')
  console.log('2. Obtén las credenciales de Supabase desde: https://supabase.com/dashboard')
  console.log('3. Obtén la clave API de Gemini desde: https://makersuite.google.com/app/apikey')
  console.log('4. Reemplaza los valores placeholder con tus credenciales reales')
  console.log('5. Instala las dependencias: npm install')
  console.log('6. Inicia el servidor: npm run dev')
  console.log('\n🔒 Nota: En producción, asegúrate de cambiar las claves secretas por valores seguros')
  console.log('\n📖 Para más información, consulta la documentación del proyecto')
} catch (error) {
  console.error('❌ Error creando el archivo .env.local:', error.message)
  process.exit(1)
} 