// =====================================================
// SCRIPT PARA PROBAR GENERACIÓN DE CHECKLISTS PERSONALIZADAS
// =====================================================

const fs = require('fs');
const path = require('path');

// Cargar variables de entorno del backend
require('dotenv').config({ path: path.join(__dirname, '../packages/backend/.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

async function testChecklistGeneration() {
  console.log('🤖 Probando generación de checklists personalizadas...\n');
  
  if (!GEMINI_API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY no está configurada');
    return false;
  }

  // Casos de prueba
  const testCases = [
    {
      name: 'Usuario que trabaja desde casa',
      description: 'Soy una persona que trabaja desde casa y necesito organizar mi día entre trabajo y tareas domésticas',
      sections: ['Rutina Matutina', 'Productividad']
    },
    {
      name: 'Familia con niños',
      description: 'Tengo una familia con niños pequeños y necesito una rutina que incluya tareas para todos',
      sections: ['Limpieza del Hogar', 'Bienestar']
    },
    {
      name: 'Estudiante',
      description: 'Soy estudiante y quiero balancear mis estudios con el cuidado del hogar',
      sections: ['Productividad', 'Rutina Nocturna']
    }
  ];

  for (const testCase of testCases) {
    console.log(`📋 Probando: ${testCase.name}`);
    console.log(`📝 Descripción: ${testCase.description}`);
    console.log(`🏷️ Secciones: ${testCase.sections.join(', ')}`);
    
    try {
      const tasks = await generatePersonalizedChecklist(
        testCase.description, 
        testCase.sections
      );
      
      console.log(`✅ Generadas ${tasks.length} tareas:`);
      tasks.forEach((task, index) => {
        console.log(`  ${index + 1}. ${task.title} (${task.category}, ${task.priority})`);
        console.log(`     ${task.description}`);
      });
      
    } catch (error) {
      console.error(`❌ Error en caso "${testCase.name}":`, error.message);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
  }

  return true;
}

async function generatePersonalizedChecklist(userDescription, selectedSections = []) {
  const sectionsText = selectedSections.length > 0 
    ? `\nSecciones seleccionadas: ${selectedSections.join(', ')}` 
    : '';

  const prompt = `Como asistente especializado en organización del hogar, genera una checklist personalizada basada en la siguiente descripción del usuario:

${userDescription}${sectionsText}

Genera exactamente 8 tareas en formato JSON con la siguiente estructura:
[
  {
    "title": "Título de la tarea",
    "description": "Descripción detallada",
    "category": "hogar|productividad|bienestar",
    "priority": "alta|media|baja"
  }
]

Reglas importantes:
- Las tareas deben ser específicas y accionables
- Usa categorías: "hogar", "productividad", "bienestar"
- Prioridades: "alta" (críticas), "media" (importantes), "baja" (opcionales)
- No incluyas tiempo estimado
- Sé realista y adaptado al estilo de vida descrito
- Responde SOLO con el JSON válido, sin texto adicional`;

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  };

  const response = await fetch(`${BASE_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en la API: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No se recibió respuesta de la IA');
  }

  const responseText = data.candidates[0].content.parts[0].text.trim();
  
  // Intentar parsear la respuesta JSON
  try {
    const tasks = JSON.parse(responseText);
    if (Array.isArray(tasks)) {
      return tasks.slice(0, 8); // Limitar a 8 tareas
    }
  } catch (parseError) {
    console.error('❌ Error parseando JSON:', parseError.message);
    console.log('📄 Respuesta completa:', responseText);
    throw new Error('Respuesta no válida de la IA');
  }

  throw new Error('Formato de respuesta inesperado');
}

// Ejecutar el test
testChecklistGeneration()
  .then(success => {
    if (success) {
      console.log('🎉 ¡Pruebas de generación de checklists completadas!');
      process.exit(0);
    } else {
      console.log('❌ Hay problemas con la generación de checklists');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }); 