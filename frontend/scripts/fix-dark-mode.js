#!/usr/bin/env node

/**
 * Script para verificar y arreglar automáticamente el modo oscuro
 * Busca elementos comunes que necesitan clases dark: y los agrega
 */

const fs = require('fs');
const path = require('path');

// Elementos que necesitan modo oscuro
const darkModePatterns = [
  // Textos
  { pattern: /text-gray-900(?!\s*dark:)/g, replacement: 'text-gray-900 dark:text-white' },
  { pattern: /text-gray-600(?!\s*dark:)/g, replacement: 'text-gray-600 dark:text-gray-300' },
  { pattern: /text-gray-700(?!\s*dark:)/g, replacement: 'text-gray-700 dark:text-gray-300' },
  { pattern: /text-gray-500(?!\s*dark:)/g, replacement: 'text-gray-500 dark:text-gray-400' },
  
  // Fondos
  { pattern: /bg-white(?!\s*dark:)/g, replacement: 'bg-white dark:bg-gray-800' },
  { pattern: /bg-gray-50(?!\s*dark:)/g, replacement: 'bg-gray-50 dark:bg-gray-900' },
  { pattern: /bg-gray-100(?!\s*dark:)/g, replacement: 'bg-gray-100 dark:bg-gray-800' },
  
  // Bordes
  { pattern: /border-gray-200(?!\s*dark:)/g, replacement: 'border-gray-200 dark:border-gray-700' },
  { pattern: /border-gray-300(?!\s*dark:)/g, replacement: 'border-gray-300 dark:border-gray-600' },
  { pattern: /border-gray-100(?!\s*dark:)/g, replacement: 'border-gray-100 dark:border-gray-700' },
  
  // Hover states
  { pattern: /hover:bg-gray-50(?!\s*dark:)/g, replacement: 'hover:bg-gray-50 dark:hover:bg-gray-700' },
  { pattern: /hover:text-gray-600(?!\s*dark:)/g, replacement: 'hover:text-gray-600 dark:hover:text-gray-300' },
  { pattern: /hover:border-gray-300(?!\s*dark:)/g, replacement: 'hover:border-gray-300 dark:hover:border-gray-500' },
  
  // Placeholders
  { pattern: /placeholder-gray-500(?!\s*dark:)/g, replacement: 'placeholder-gray-500 dark:placeholder-gray-400' },
  
  // Gradientes
  { pattern: /from-gray-50(?!\s*dark:)/g, replacement: 'from-gray-50 dark:from-gray-800' },
  { pattern: /to-gray-100(?!\s*dark:)/g, replacement: 'to-gray-100 dark:to-gray-900' },
];

// Archivos a verificar
const filesToCheck = [
  'src/pages/Home.tsx',
  'src/pages/Login.tsx',
  'src/pages/Registro.tsx',
  'src/pages/Help.tsx',
  'src/pages/Privacy.tsx',
  'src/pages/Terms.tsx',
  'src/pages/Cookies.tsx',
  'src/pages/Contact.tsx',
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/layout/Layout.tsx',
  'src/components/auth/LoginForm.tsx',
  'src/components/auth/RegisterForm.tsx',
  'src/components/dashboard/Dashboard.tsx',
  'src/components/dashboard/TaskItem.tsx',
  'src/components/dashboard/AddTaskModal.tsx',
];

function applyDarkModePatterns(content) {
  let updatedContent = content;
  
  darkModePatterns.forEach(({ pattern, replacement }) => {
    updatedContent = updatedContent.replace(pattern, replacement);
  });
  
  return updatedContent;
}

function processFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return;
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const updatedContent = applyDarkModePatterns(content);
    
    if (content !== updatedContent) {
      fs.writeFileSync(fullPath, updatedContent, 'utf8');
      console.log(`✅ Actualizado: ${filePath}`);
    } else {
      console.log(`✅ Ya está actualizado: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🌙 Iniciando verificación de modo oscuro...\n');
  
  filesToCheck.forEach(file => {
    processFile(file);
  });
  
  console.log('\n🎉 Verificación completada!');
  console.log('\n📝 Notas:');
  console.log('- Revisa manualmente los archivos actualizados');
  console.log('- Algunos elementos pueden necesitar ajustes específicos');
  console.log('- Prueba el modo oscuro en todas las páginas');
}

if (require.main === module) {
  main();
}

module.exports = { applyDarkModePatterns, processFile }; 