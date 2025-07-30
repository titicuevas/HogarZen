// =====================================================
// SCRIPT GLOBAL PARA PROBAR CONEXIÓN CON GEMINI
// =====================================================

const fs = require('fs');
const path = require('path');

// Cargar variables de entorno del backend
require('dotenv').config({ path: path.join(__dirname, '../packages/backend/.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

async function testGeminiConnection() {
  console.log('🔍 Probando conexión con Gemini...\n');
  
  if (!GEMINI_API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY no está configurada');
    console.log('📝 Crea un archivo .env en el directorio packages/backend con:');
    console.log('GEMINI_API_KEY=tu_api_key_real_de_gemini');
    return false;
  }

  if (GEMINI_API_KEY === 'tu_api_key_de_gemini') {
    console.error('❌ Error: GEMINI_API_KEY tiene valor de ejemplo');
    console.log('📝 Reemplaza con tu API key real de Gemini');
    return false;
  }

  console.log('✅ API Key configurada:', `${GEMINI_API_KEY.substring(0, 10)}...`);
  console.log('🌐 URL de la API:', BASE_URL);

  try {
    // Test básico de conexión
    const testPrompt = 'Hola, responde solo con "OK"';
    
    const requestBody = {
      contents: [{
        parts: [{
          text: testPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 10,
      }
    };

    console.log('\n📡 Enviando request de prueba...');

    const response = await fetch(`${BASE_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📊 Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error en la respuesta:', errorText);
      return false;
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('❌ No se recibió respuesta válida de Gemini');
      return false;
    }

    const responseText = data.candidates[0].content.parts[0].text.trim();
    console.log('✅ Respuesta recibida:', responseText);

    // Test de generación de tareas personalizadas
    console.log('\n🤖 Probando generación de tareas personalizadas...');
    
    const taskPrompt = `Analiza la siguiente rutina diaria del usuario y genera 2 tareas personalizadas que se adapten a su estilo de vida. 

Rutina del usuario: "Mi dia a dia suelo ir a entrenar al crossfit, suelo apagar la lavadora, el fuego, bajar la persina y apagar la plancha"

Genera las tareas en el siguiente formato JSON exacto (sin texto adicional):

[
  {
    "id": "1",
    "title": "Título de la tarea",
    "description": "Descripción detallada de la tarea",
    "category": "general",
    "priority": "media",
    "reasoning": "Explicación de por qué esta tarea es relevante para su rutina"
  }
]

Responde SOLO con el JSON, sin texto adicional.`;

    const taskRequestBody = {
      contents: [{
        parts: [{
          text: taskPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    const taskResponse = await fetch(`${BASE_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskRequestBody)
    });

    if (!taskResponse.ok) {
      const errorText = await taskResponse.text();
      console.error('❌ Error generando tareas:', errorText);
      return false;
    }

    const taskData = await taskResponse.json();
    const taskResponseText = taskData.candidates[0].content.parts[0].text.trim();
    
    console.log('📄 Respuesta de tareas recibida:');
    console.log(taskResponseText);

    // Intentar parsear el JSON
    try {
      const tasks = JSON.parse(taskResponseText);
      console.log('✅ JSON parseado correctamente');
      console.log('📋 Tareas generadas:', tasks.length);
      tasks.forEach((task, index) => {
        console.log(`  ${index + 1}. ${task.title} (${task.category}, ${task.priority})`);
      });
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError.message);
      console.log('📄 Respuesta completa:', taskResponseText);
    }

    console.log('\n🎉 ¡Conexión con Gemini exitosa!');
    return true;

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

// Ejecutar el test
testGeminiConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Gemini está configurado correctamente');
      process.exit(0);
    } else {
      console.log('\n❌ Hay problemas con la configuración de Gemini');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }); 