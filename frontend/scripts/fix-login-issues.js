#!/usr/bin/env node

/**
 * Script para diagnosticar y arreglar problemas de login
 * Verifica configuración de Supabase y credenciales
 */

const fs = require('fs');
const path = require('path');

// Función para verificar archivo .env.local
function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ Archivo .env.local no encontrado');
    console.log('📝 Creando archivo .env.local con variables de ejemplo...');
    
    const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# Gemini AI Configuration
VITE_GEMINI_API_KEY=tu_api_key_de_gemini

# App Configuration
VITE_API_URL=http://localhost:8000
VITE_DOCKER=false

# Development Configuration
VITE_DEBUG=true
VITE_LOG_LEVEL=info`;
    
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ Archivo .env.local creado');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL=');
  const hasSupabaseKey = envContent.includes('VITE_SUPABASE_ANON_KEY=');
  
  if (!hasSupabaseUrl || !hasSupabaseKey) {
    console.log('❌ Variables de Supabase faltantes en .env.local');
    return false;
  }
  
  // Verificar si son valores de ejemplo
  const hasExampleValues = envContent.includes('tu_url_de_supabase') || 
                          envContent.includes('tu_clave_anonima_de_supabase');
  
  if (hasExampleValues) {
    console.log('⚠️  Variables de Supabase tienen valores de ejemplo');
    console.log('📝 Reemplaza con credenciales reales de tu proyecto Supabase');
    return false;
  }
  
  console.log('✅ Variables de Supabase configuradas correctamente');
  return true;
}

// Función para verificar configuración de Supabase
function checkSupabaseConfig() {
  const configPath = path.join(process.cwd(), 'src/config/supabase.ts');
  
  if (!fs.existsSync(configPath)) {
    console.log('❌ Archivo de configuración de Supabase no encontrado');
    return false;
  }
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Verificar que el archivo tenga la configuración básica
  const hasCreateClient = configContent.includes('createClient');
  const hasAuthConfig = configContent.includes('auth:');
  
  if (!hasCreateClient || !hasAuthConfig) {
    console.log('❌ Configuración de Supabase incompleta');
    return false;
  }
  
  console.log('✅ Configuración de Supabase correcta');
  return true;
}

// Función para verificar servicio de autenticación
function checkAuthService() {
  const servicePath = path.join(process.cwd(), 'src/services/authService.ts');
  
  if (!fs.existsSync(servicePath)) {
    console.log('❌ Servicio de autenticación no encontrado');
    return false;
  }
  
  const serviceContent = fs.readFileSync(servicePath, 'utf8');
  
  // Verificar métodos esenciales
  const hasSignIn = serviceContent.includes('signIn');
  const hasSignUp = serviceContent.includes('signUp');
  const hasSignOut = serviceContent.includes('signOut');
  
  if (!hasSignIn || !hasSignUp || !hasSignOut) {
    console.log('❌ Métodos de autenticación faltantes');
    return false;
  }
  
  console.log('✅ Servicio de autenticación correcto');
  return true;
}

// Función para verificar contexto de autenticación
function checkAuthContext() {
  const contextPath = path.join(process.cwd(), 'src/contexts/AuthContext.tsx');
  
  if (!fs.existsSync(contextPath)) {
    console.log('❌ Contexto de autenticación no encontrado');
    return false;
  }
  
  const contextContent = fs.readFileSync(contextPath, 'utf8');
  
  // Verificar que tenga el provider y métodos básicos
  const hasProvider = contextContent.includes('AuthProvider');
  const hasLogin = contextContent.includes('login');
  const hasLogout = contextContent.includes('logout');
  
  if (!hasProvider || !hasLogin || !hasLogout) {
    console.log('❌ Contexto de autenticación incompleto');
    return false;
  }
  
  console.log('✅ Contexto de autenticación correcto');
  return true;
}

// Función para crear archivo de configuración de ejemplo
function createExampleConfig() {
  console.log('\n📝 Creando archivo de configuración de ejemplo...');
  
  const configContent = `# =====================================================
# CONFIGURACIÓN DE SUPABASE - EJEMPLO
# =====================================================

# 1. Ve a https://supabase.com y crea un nuevo proyecto
# 2. En la configuración del proyecto, copia la URL y la anon key
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

  const configPath = path.join(process.cwd(), 'SUPABASE_SETUP.md');
  fs.writeFileSync(configPath, configContent, 'utf8');
  console.log('✅ Archivo SUPABASE_SETUP.md creado');
}

// Función para verificar responsive design
function checkResponsiveDesign() {
  const responsivePath = path.join(process.cwd(), 'src/styles/responsive.css');
  const loginResponsivePath = path.join(process.cwd(), 'src/styles/login-responsive.css');
  
  if (!fs.existsSync(responsivePath)) {
    console.log('❌ Archivo responsive.css no encontrado');
    return false;
  }
  
  if (!fs.existsSync(loginResponsivePath)) {
    console.log('❌ Archivo login-responsive.css no encontrado');
    return false;
  }
  
  console.log('✅ Archivos de responsive design encontrados');
  return true;
}

// Función principal
function main() {
  console.log('🔍 Iniciando diagnóstico de problemas de login...\n');
  
  let allChecksPassed = true;
  
  // Verificar archivo .env.local
  console.log('1. Verificando archivo .env.local...');
  if (!checkEnvFile()) {
    allChecksPassed = false;
  }
  
  // Verificar configuración de Supabase
  console.log('\n2. Verificando configuración de Supabase...');
  if (!checkSupabaseConfig()) {
    allChecksPassed = false;
  }
  
  // Verificar servicio de autenticación
  console.log('\n3. Verificando servicio de autenticación...');
  if (!checkAuthService()) {
    allChecksPassed = false;
  }
  
  // Verificar contexto de autenticación
  console.log('\n4. Verificando contexto de autenticación...');
  if (!checkAuthContext()) {
    allChecksPassed = false;
  }
  
  // Verificar responsive design
  console.log('\n5. Verificando responsive design...');
  if (!checkResponsiveDesign()) {
    allChecksPassed = false;
  }
  
  // Crear archivo de configuración de ejemplo si es necesario
  if (!allChecksPassed) {
    createExampleConfig();
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allChecksPassed) {
    console.log('✅ Todos los checks pasaron correctamente');
    console.log('🎉 El login debería funcionar correctamente');
  } else {
    console.log('❌ Se encontraron problemas en la configuración');
    console.log('📝 Revisa los archivos creados y sigue las instrucciones');
    console.log('🔧 Ejecuta este script nuevamente después de configurar');
  }
  
  console.log('\n📋 Próximos pasos:');
  console.log('1. Configura las credenciales reales de Supabase');
  console.log('2. Verifica que el usuario exista en tu proyecto Supabase');
  console.log('3. Comprueba que la autenticación esté habilitada');
  console.log('4. Prueba el login con credenciales válidas');
  console.log('5. Verifica el responsive design en diferentes dispositivos');
}

if (require.main === module) {
  main();
}

module.exports = {
  checkEnvFile,
  checkSupabaseConfig,
  checkAuthService,
  checkAuthContext,
  checkResponsiveDesign
}; 