#!/usr/bin/env node

/**
 * Script para crear un usuario de prueba en Supabase
 * Proporciona instrucciones paso a paso
 */

const fs = require('fs');
const path = require('path');

// =====================================================
// CONFIGURACIÓN DEL USUARIO DE PRUEBA
// =====================================================

const testUser = {
  email: 'test@hogarzen.com',
  password: 'test123456',
  name: 'Usuario Test',
  description: 'Usuario de prueba para desarrollo'
};

// =====================================================
// FUNCIONES DE AYUDA
// =====================================================

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ Archivo .env.local no encontrado');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL=');
  const hasSupabaseKey = envContent.includes('VITE_SUPABASE_ANON_KEY=');

  if (!hasSupabaseUrl || !hasSupabaseKey) {
    console.log('❌ Variables de Supabase faltantes');
    return false;
  }

  // Verificar si son valores de ejemplo
  const hasExampleValues = envContent.includes('tu_url_de_supabase') ||
                          envContent.includes('tu_clave_anonima_de_supabase');

  if (hasExampleValues) {
    console.log('⚠️ Variables de Supabase tienen valores de ejemplo');
    return false;
  }

  return true;
}

function showInstructions() {
  console.log('\n📋 INSTRUCCIONES PARA CREAR USUARIO DE PRUEBA');
  console.log('='.repeat(50));
  
  console.log('\n🔧 PASO 1: Acceder a Supabase');
  console.log('1. Ve a https://supabase.com');
  console.log('2. Inicia sesión en tu cuenta');
  console.log('3. Selecciona tu proyecto HogarZen');
  
  console.log('\n👥 PASO 2: Ir a Authentication');
  console.log('1. En el menú lateral, haz clic en "Authentication"');
  console.log('2. Luego haz clic en "Users"');
  console.log('3. Verás la lista de usuarios (probablemente vacía)');
  
  console.log('\n➕ PASO 3: Agregar Usuario');
  console.log('1. Haz clic en el botón "Add user" o "Invite user"');
  console.log('2. Completa el formulario con estos datos:');
  console.log(`   📧 Email: ${testUser.email}`);
  console.log(`   🔑 Contraseña: ${testUser.password}`);
  console.log(`   👤 Nombre: ${testUser.name}`);
  console.log('3. Asegúrate de que "Confirm email" esté DESACTIVADO');
  console.log('4. Haz clic en "Add user" o "Create user"');
  
  console.log('\n⚙️ PASO 4: Configurar Autenticación');
  console.log('1. Ve a "Authentication" > "Settings"');
  console.log('2. Busca la opción "Enable email confirmations"');
  console.log('3. Asegúrate de que esté DESACTIVADA (para desarrollo)');
  console.log('4. Guarda los cambios');
  
  console.log('\n🧪 PASO 5: Probar Login');
  console.log('1. Ve a tu aplicación HogarZen');
  console.log('2. Ve a la página de login');
  console.log(`3. Usa las credenciales: ${testUser.email} / ${testUser.password}`);
  console.log('4. Deberías poder iniciar sesión sin problemas');
}

function showTroubleshooting() {
  console.log('\n🔧 SOLUCIÓN DE PROBLEMAS');
  console.log('='.repeat(30));
  
  console.log('\n❌ Si el login sigue fallando:');
  console.log('1. Verifica que el usuario se creó correctamente en Supabase');
  console.log('2. Asegúrate de que "Confirm email" esté desactivado');
  console.log('3. Verifica que las credenciales en .env.local sean correctas');
  console.log('4. Revisa la consola del navegador para errores específicos');
  
  console.log('\n🔍 Para verificar la configuración:');
  console.log('1. Ejecuta: node scripts/diagnose-login.cjs');
  console.log('2. Revisa que todas las verificaciones pasen');
  
  console.log('\n📞 Si necesitas ayuda:');
  console.log('1. Revisa los logs en la consola del navegador');
  console.log('2. Verifica la configuración de Supabase');
  console.log('3. Asegúrate de que el proyecto esté activo');
}

function createQuickTest() {
  console.log('\n⚡ PRUEBA RÁPIDA');
  console.log('='.repeat(20));
  
  console.log('\n📝 Credenciales de prueba:');
  console.log(`Email: ${testUser.email}`);
  console.log(`Contraseña: ${testUser.password}`);
  
  console.log('\n🎯 Para probar rápidamente:');
  console.log('1. Abre tu aplicación en el navegador');
  console.log('2. Ve a /login');
  console.log('3. Usa las credenciales de arriba');
  console.log('4. Si funciona, ¡perfecto!');
  console.log('5. Si no, sigue las instrucciones completas');
}

// =====================================================
// FUNCIÓN PRINCIPAL
// =====================================================

function main() {
  console.log('🔧 Creando usuario de prueba para HogarZen...\n');
  
  // Verificar configuración
  console.log('1. Verificando configuración...');
  if (!checkEnvFile()) {
    console.log('❌ Configuración incompleta');
    console.log('📝 Primero configura tu archivo .env.local');
    console.log('🔧 Ejecuta: node scripts/diagnose-login.cjs');
    return;
  }
  
  console.log('✅ Configuración correcta');
  
  // Mostrar información del usuario de prueba
  console.log('\n📋 USUARIO DE PRUEBA');
  console.log('='.repeat(25));
  console.log(`📧 Email: ${testUser.email}`);
  console.log(`🔑 Contraseña: ${testUser.password}`);
  console.log(`👤 Nombre: ${testUser.name}`);
  console.log(`📝 Descripción: ${testUser.description}`);
  
  // Mostrar instrucciones
  showInstructions();
  
  // Mostrar solución de problemas
  showTroubleshooting();
  
  // Mostrar prueba rápida
  createQuickTest();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 ¡Listo! Sigue las instrucciones para crear el usuario');
  console.log('💡 Si tienes problemas, revisa la sección de solución de problemas');
}

if (require.main === module) {
  main();
}

module.exports = {
  testUser,
  checkEnvFile,
  showInstructions,
  showTroubleshooting,
  createQuickTest
}; 