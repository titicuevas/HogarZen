#!/usr/bin/env node

/**
 * Script para verificar la estructura de archivos y principios SOLID
 * Analiza la organización del proyecto y sugiere mejoras
 */

const fs = require('fs');
const path = require('path');

// =====================================================
// CONFIGURACIÓN DE VERIFICACIÓN
// =====================================================

const expectedStructure = {
  'src/': {
    'core/': {
      'interfaces/': ['IAuthService.ts', 'ITaskService.ts', 'INotificationService.ts', 'IContext.ts'],
      'entities/': ['User.ts', 'Task.ts'],
      'validators/': ['AuthValidator.ts']
    },
    'config/': ['environment.ts', 'supabase.ts', 'gemini.ts'],
    'contexts/': ['AuthContext.tsx', 'TaskContext.tsx', 'NotificationContext.tsx', 'ThemeContext.tsx'],
    'services/': ['authService.ts', 'taskService.ts', 'geminiService.ts'],
    'components/': {
      'auth/': ['LoginForm.tsx', 'RegisterForm.tsx', 'ProtectedRoute.tsx'],
      'common/': ['LoginDiagnostic.tsx', 'ConfigChecker.tsx', 'ErrorBoundary.tsx'],
      'dashboard/': ['Dashboard.tsx', 'TaskItem.tsx', 'AddTaskModal.tsx', 'TasksSummary.tsx'],
      'layout/': ['Header.tsx', 'Footer.tsx', 'Layout.tsx', 'Sidebar.tsx'],
      'ui/': ['Button.tsx', 'Modal.tsx', 'LoadingSpinner.tsx', 'ThemeToggle.tsx']
    },
    'pages/': ['Home.tsx', 'Login.tsx', 'Registro.tsx', 'Dashboard.tsx', 'Help.tsx', 'Privacy.tsx', 'Terms.tsx'],
    'hooks/': ['useAuth.ts', 'useTasks.ts', 'useAsync.ts', 'useLocalStorage.ts'],
    'utils/': ['validation.ts', 'notifications.ts', 'cookies.ts'],
    'types/': ['index.ts'],
    'styles/': ['responsive.css', 'login-responsive.css', 'mobile.css', 'tablet.css', 'desktop.css']
  }
};

// =====================================================
// FUNCIONES DE VERIFICACIÓN
// =====================================================

function checkFileStructure(basePath, structure, level = 0) {
  const results = {
    exists: true,
    missing: [],
    extra: [],
    details: {}
  };

  for (const [item, expected] of Object.entries(structure)) {
    const itemPath = path.join(basePath, item);
    
    if (Array.isArray(expected)) {
      // Es un array de archivos
      if (!fs.existsSync(itemPath)) {
        results.missing.push(`${item}/`);
        results.exists = false;
      } else {
        const files = fs.readdirSync(itemPath);
        const missingFiles = expected.filter(file => !files.includes(file));
        const extraFiles = files.filter(file => !expected.includes(file) && !file.startsWith('.'));
        
        if (missingFiles.length > 0) {
          results.missing.push(...missingFiles.map(file => `${item}/${file}`));
          results.exists = false;
        }
        
        if (extraFiles.length > 0) {
          results.extra.push(...extraFiles.map(file => `${item}/${file}`));
        }
        
        results.details[item] = { files, missing: missingFiles, extra: extraFiles };
      }
    } else {
      // Es un objeto (subdirectorio)
      if (!fs.existsSync(itemPath)) {
        results.missing.push(`${item}/`);
        results.exists = false;
      } else {
        const subResults = checkFileStructure(itemPath, expected, level + 1);
        if (!subResults.exists) {
          results.exists = false;
        }
        results.missing.push(...subResults.missing.map(missing => `${item}/${missing}`));
        results.extra.push(...subResults.extra.map(extra => `${item}/${extra}`));
        results.details[item] = subResults.details;
      }
    }
  }

  return results;
}

function checkSOLIDPrinciples() {
  const results = {
    singleResponsibility: [],
    openClosed: [],
    liskovSubstitution: [],
    interfaceSegregation: [],
    dependencyInversion: []
  };

  // Verificar Single Responsibility Principle
  const filesToCheck = [
    'src/services/authService.ts',
    'src/services/taskService.ts',
    'src/contexts/AuthContext.tsx',
    'src/utils/validation.ts',
    'src/core/entities/User.ts',
    'src/core/entities/Task.ts'
  ];

  filesToCheck.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Verificar SRP - contar clases y responsabilidades
      const classCount = (content.match(/class\s+\w+/g) || []).length;
      const methodCount = (content.match(/async\s+\w+\(|function\s+\w+\(|\w+\([^)]*\)\s*{/g) || []).length;
      
      if (classCount > 1) {
        results.singleResponsibility.push(`${filePath}: Múltiples clases (${classCount})`);
      }
      
      if (methodCount > 10) {
        results.singleResponsibility.push(`${filePath}: Muchos métodos (${methodCount})`);
      }
    }
  });

  // Verificar Open/Closed Principle
  const configFiles = [
    'src/config/environment.ts',
    'src/config/supabase.ts'
  ];

  configFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes('switch') || content.includes('if.*else')) {
        results.openClosed.push(`${filePath}: Usa condicionales que podrían violar OCP`);
      }
    }
  });

  // Verificar Interface Segregation
  const interfaceFiles = [
    'src/core/interfaces/IAuthService.ts',
    'src/core/interfaces/ITaskService.ts'
  ];

  interfaceFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const methodCount = (content.match(/[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/g) || []).length;
      
      if (methodCount > 8) {
        results.interfaceSegregation.push(`${filePath}: Interfaz muy grande (${methodCount} métodos)`);
      }
    }
  });

  // Verificar Dependency Inversion
  const serviceFiles = [
    'src/services/authService.ts',
    'src/services/taskService.ts'
  ];

  serviceFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes('new ') && !content.includes('interface')) {
        results.dependencyInversion.push(`${filePath}: Instancia clases directamente`);
      }
    }
  });

  return results;
}

function checkCodeQuality() {
  const results = {
    imports: [],
    exports: [],
    types: [],
    comments: []
  };

  const filesToCheck = [
    'src/services/authService.ts',
    'src/contexts/AuthContext.tsx',
    'src/pages/Login.tsx',
    'src/pages/Registro.tsx'
  ];

  filesToCheck.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Verificar imports organizados
      const importLines = content.match(/import.*from.*['"]/g) || [];
      if (importLines.length > 10) {
        results.imports.push(`${filePath}: Muchos imports (${importLines.length})`);
      }
      
      // Verificar exports
      const exportLines = content.match(/export.*/g) || [];
      if (exportLines.length > 5) {
        results.exports.push(`${filePath}: Muchos exports (${exportLines.length})`);
      }
      
      // Verificar tipos TypeScript
      const typeUsage = content.match(/:\s*\w+/g) || [];
      if (typeUsage.length < 5) {
        results.types.push(`${filePath}: Poco uso de tipos TypeScript`);
      }
      
      // Verificar comentarios
      const commentLines = content.match(/\/\/.*/g) || [];
      if (commentLines.length < 3) {
        results.comments.push(`${filePath}: Pocos comentarios`);
      }
    }
  });

  return results;
}

// =====================================================
// FUNCIÓN PRINCIPAL
// =====================================================

function main() {
  console.log('🔍 Verificando arquitectura del proyecto...\n');
  
  const basePath = path.join(process.cwd(), 'src');
  
  // 1. Verificar estructura de archivos
  console.log('📁 Verificando estructura de archivos...');
  const structureResults = checkFileStructure(basePath, expectedStructure['src/']);
  
  if (structureResults.exists) {
    console.log('✅ Estructura de archivos correcta');
  } else {
    console.log('❌ Problemas en la estructura:');
    if (structureResults.missing.length > 0) {
      console.log('   Archivos/directorios faltantes:');
      structureResults.missing.forEach(item => console.log(`   - ${item}`));
    }
    if (structureResults.extra.length > 0) {
      console.log('   Archivos extra:');
      structureResults.extra.forEach(item => console.log(`   - ${item}`));
    }
  }
  
  // 2. Verificar principios SOLID
  console.log('\n🏗️ Verificando principios SOLID...');
  const solidResults = checkSOLIDPrinciples();
  
  let solidIssues = 0;
  Object.entries(solidResults).forEach(([principle, issues]) => {
    if (issues.length > 0) {
      console.log(`❌ ${principle}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
      solidIssues += issues.length;
    }
  });
  
  if (solidIssues === 0) {
    console.log('✅ Principios SOLID bien aplicados');
  }
  
  // 3. Verificar calidad del código
  console.log('\n📝 Verificando calidad del código...');
  const qualityResults = checkCodeQuality();
  
  let qualityIssues = 0;
  Object.entries(qualityResults).forEach(([aspect, issues]) => {
    if (issues.length > 0) {
      console.log(`⚠️ ${aspect}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
      qualityIssues += issues.length;
    }
  });
  
  if (qualityIssues === 0) {
    console.log('✅ Calidad del código buena');
  }
  
  // 4. Resumen
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN DE VERIFICACIÓN');
  console.log('='.repeat(50));
  
  console.log(`📁 Estructura: ${structureResults.exists ? '✅ Correcta' : '❌ Problemas'}`);
  console.log(`🏗️ SOLID: ${solidIssues === 0 ? '✅ Correcto' : `❌ ${solidIssues} problemas`}`);
  console.log(`📝 Calidad: ${qualityIssues === 0 ? '✅ Buena' : `⚠️ ${qualityIssues} mejoras`}`);
  
  // 5. Recomendaciones
  if (structureResults.missing.length > 0 || solidIssues > 0 || qualityIssues > 0) {
    console.log('\n💡 RECOMENDACIONES:');
    
    if (structureResults.missing.length > 0) {
      console.log('1. Crear los archivos/directorios faltantes');
    }
    
    if (solidIssues > 0) {
      console.log('2. Revisar y refactorizar código que viola principios SOLID');
    }
    
    if (qualityIssues > 0) {
      console.log('3. Mejorar la calidad del código (tipos, comentarios, organización)');
    }
  } else {
    console.log('\n🎉 ¡Excelente! El proyecto está bien organizado y sigue los principios SOLID');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkFileStructure,
  checkSOLIDPrinciples,
  checkCodeQuality
}; 