#!/usr/bin/env node

/**
 * Script de diagnóstico específico para problemas de login
 * Verifica configuración, conectividad y credenciales
 */

const fs = require('fs');
const path = require('path');

// =====================================================
// FUNCIONES DE DIAGNÓSTICO
// =====================================================

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ Archivo .env.local no encontrado');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  console.log('📋 Variables de entorno encontradas:');
  
  let hasSupabaseUrl = false;
  let hasSupabaseKey = false;
  let hasValidCredentials = true;

  lines.forEach(line => {
    if (line.includes('VITE_SUPABASE_URL=')) {
      hasSupabaseUrl = true;
      const url = line.split('=')[1];
      if (url && url !== 'tu_url_de_supabase') {
        console.log('  ✅ VITE_SUPABASE_URL: Configurada');
      } else {
        console.log('  ❌ VITE_SUPABASE_URL: Valor de ejemplo');
        hasValidCredentials = false;
      }
    }
    
    if (line.includes('VITE_SUPABASE_ANON_KEY=')) {
      hasSupabaseKey = true;
      const key = line.split('=')[1];
      if (key && key !== 'tu_clave_anonima_de_supabase') {
        console.log('  ✅ VITE_SUPABASE_ANON_KEY: Configurada');
      } else {
        console.log('  ❌ VITE_SUPABASE_ANON_KEY: Valor de ejemplo');
        hasValidCredentials = false;
      }
    }
  });

  if (!hasSupabaseUrl) {
    console.log('  ❌ VITE_SUPABASE_URL: No encontrada');
  }
  
  if (!hasSupabaseKey) {
    console.log('  ❌ VITE_SUPABASE_ANON_KEY: No encontrada');
  }

  return hasSupabaseUrl && hasSupabaseKey && hasValidCredentials;
}

function checkSupabaseConfig() {
  const configPath = path.join(process.cwd(), 'src/config/supabase.ts');
  
  if (!fs.existsSync(configPath)) {
    console.log('❌ Archivo de configuración de Supabase no encontrado');
    return false;
  }

  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Verificar que use createClient correctamente
  if (!configContent.includes('createClient')) {
    console.log('❌ No se usa createClient de Supabase');
    return false;
  }

  // Verificar configuración de auth
  if (!configContent.includes('auth:')) {
    console.log('❌ No hay configuración de auth');
    return false;
  }

  console.log('✅ Configuración de Supabase correcta');
  return true;
}

function checkAuthService() {
  const servicePath = path.join(process.cwd(), 'src/services/authService.ts');
  
  if (!fs.existsSync(servicePath)) {
    console.log('❌ Servicio de autenticación no encontrado');
    return false;
  }

  const serviceContent = fs.readFileSync(servicePath, 'utf8');
  
  // Verificar método signIn
  if (!serviceContent.includes('signInWithPassword')) {
    console.log('❌ No se usa signInWithPassword');
    return false;
  }

  // Verificar manejo de errores
  if (!serviceContent.includes('error.message')) {
    console.log('❌ Manejo de errores incompleto');
    return false;
  }

  console.log('✅ Servicio de autenticación correcto');
  return true;
}

function checkAuthContext() {
  const contextPath = path.join(process.cwd(), 'src/contexts/AuthContext.tsx');
  
  if (!fs.existsSync(contextPath)) {
    console.log('❌ Contexto de autenticación no encontrado');
    return false;
  }

  const contextContent = fs.readFileSync(contextPath, 'utf8');
  
  // Verificar método login
  if (!contextContent.includes('login')) {
    console.log('❌ Método login no encontrado');
    return false;
  }

  // Verificar manejo de errores
  if (!contextContent.includes('catch')) {
    console.log('❌ Manejo de errores incompleto');
    return false;
  }

  console.log('✅ Contexto de autenticación correcto');
  return true;
}

function checkLoginPage() {
  const loginPath = path.join(process.cwd(), 'src/pages/Login.tsx');
  
  if (!fs.existsSync(loginPath)) {
    console.log('❌ Página de login no encontrada');
    return false;
  }

  const loginContent = fs.readFileSync(loginPath, 'utf8');
  
  // Verificar que use useAuth
  if (!loginContent.includes('useAuth')) {
    console.log('❌ No usa useAuth hook');
    return false;
  }

  // Verificar manejo de formulario
  if (!loginContent.includes('handleSubmit')) {
    console.log('❌ No maneja envío de formulario');
    return false;
  }

  console.log('✅ Página de login correcta');
  return true;
}

function createTestUser() {
  console.log('\n🔧 Creando usuario de prueba...');
  
  const testUser = {
    email: 'test@hogarzen.com',
    password: 'test123456',
    name: 'Usuario Test'
  };

  console.log('📝 Usuario de prueba:');
  console.log(`  Email: ${testUser.email}`);
  console.log(`  Contraseña: ${testUser.password}`);
  console.log(`  Nombre: ${testUser.name}`);

  console.log('\n📋 Para crear este usuario en Supabase:');
  console.log('1. Ve a tu proyecto Supabase');
  console.log('2. Authentication > Users');
  console.log('3. Add user');
  console.log('4. Usa los datos de arriba');
  console.log('5. Asegúrate de que "Confirm email" esté desactivado');

  return testUser;
}

function createEnvTemplate() {
  console.log('\n📝 Creando plantilla de .env.local...');
  
  const envTemplate = `# =====================================================
# CONFIGURACIÓN DE SUPABASE - HOGARZEN
# =====================================================

# 1. Ve a https://supabase.com y crea un nuevo proyecto
# 2. En Settings > API, copia la URL y anon key
# 3. Reemplaza los valores de ejemplo con los reales

VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# =====================================================
# CONFIGURACIÓN DE GEMINI AI
# =====================================================

# 1. Ve a https://makersuite.google.com/app/apikey
# 2. Crea una nueva API key
# 3. Reemplaza el valor de ejemplo

VITE_GEMINI_API_KEY=tu_api_key_de_gemini

# =====================================================
# CONFIGURACIÓN DE LA APLICACIÓN
# =====================================================

VITE_API_URL=http://localhost:8000
VITE_DOCKER=false
VITE_DEBUG=true
VITE_LOG_LEVEL=info`;

  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envTemplate, 'utf8');
    console.log('✅ Archivo .env.local creado');
    console.log('📝 Edita el archivo con tus credenciales reales');
  } else {
    console.log('⚠️ Archivo .env.local ya existe');
    console.log('📝 Verifica que tenga las credenciales correctas');
  }
}

// =====================================================
// FUNCIÓN PRINCIPAL
// =====================================================

function main() {
  console.log('🔍 Diagnóstico de problemas de login...\n');
  
  let allChecksPassed = true;

  // 1. Verificar archivo .env.local
  console.log('1. Verificando variables de entorno...');
  if (!checkEnvFile()) {
    allChecksPassed = false;
  }

  // 2. Verificar configuración de Supabase
  console.log('\n2. Verificando configuración de Supabase...');
  if (!checkSupabaseConfig()) {
    allChecksPassed = false;
  }

  // 3. Verificar servicio de autenticación
  console.log('\n3. Verificando servicio de autenticación...');
  if (!checkAuthService()) {
    allChecksPassed = false;
  }

  // 4. Verificar contexto de autenticación
  console.log('\n4. Verificando contexto de autenticación...');
  if (!checkAuthContext()) {
    allChecksPassed = false;
  }

  // 5. Verificar página de login
  console.log('\n5. Verificando página de login...');
  if (!checkLoginPage()) {
    allChecksPassed = false;
  }

  // 6. Crear usuario de prueba
  createTestUser();

  // 7. Crear plantilla de .env.local si es necesario
  createEnvTemplate();

  console.log('\n' + '='.repeat(50));
  
  if (allChecksPassed) {
    console.log('✅ Todos los checks pasaron');
    console.log('🎯 El problema puede ser:');
    console.log('   - Usuario no existe en Supabase');
    console.log('   - Credenciales incorrectas');
    console.log('   - Autenticación deshabilitada en Supabase');
  } else {
    console.log('❌ Se encontraron problemas de configuración');
    console.log('🔧 Sigue las instrucciones arriba para solucionarlos');
  }

  console.log('\n📋 Próximos pasos:');
  console.log('1. Verifica que las credenciales en .env.local sean reales');
  console.log('2. Crea un usuario en Supabase con las credenciales de prueba');
  console.log('3. Asegúrate de que la autenticación esté habilitada');
  console.log('4. Prueba el login con las credenciales de prueba');
}

if (require.main === module) {
  main();
}

module.exports = {
  checkEnvFile,
  checkSupabaseConfig,
  checkAuthService,
  checkAuthContext,
  checkLoginPage,
  createTestUser,
  createEnvTemplate
}; 