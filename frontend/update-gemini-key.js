#!/usr/bin/env node

/**
 * Script para actualizar la API key de Gemini
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_API_KEY = 'AIzaSyDCUR3IhigMo6a3JQxPeQ9wKgYommLU7X4';
const envPath = path.join(__dirname, '.env.local');

try {
  // Leer el archivo actual
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Actualizar o agregar la API key de Gemini
  const lines = envContent.split('\n');
  let geminiKeyUpdated = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('VITE_GEMINI_API_KEY=')) {
      lines[i] = `VITE_GEMINI_API_KEY=${GEMINI_API_KEY}`;
      geminiKeyUpdated = true;
      break;
    }
  }

  // Si no se encontró la línea, agregarla
  if (!geminiKeyUpdated) {
    lines.push(`VITE_GEMINI_API_KEY=${GEMINI_API_KEY}`);
  }

  // Escribir el archivo actualizado
  fs.writeFileSync(envPath, lines.join('\n'));
  
  console.log('✅ API key de Gemini actualizada exitosamente');
  console.log('🔑 Key:', GEMINI_API_KEY.substring(0, 10) + '...');
  console.log('');
  console.log('📝 Reinicia el servidor de desarrollo para aplicar los cambios');
  
} catch (error) {
  console.error('❌ Error al actualizar la API key:', error.message);
} 