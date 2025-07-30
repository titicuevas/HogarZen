import { environmentManager } from '../config/environment';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface GeneratedTask {
  title: string;
  description: string;
  category: string;
  priority: 'alta' | 'media' | 'baja';
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// =====================================================
// SERVICIO GEMINI - PRINCIPIOS SOLID
// =====================================================

class GeminiService {
  private baseUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

  // Método para obtener la configuración (Dependency Inversion)
  private getConfig() {
    return environmentManager.getGeminiConfig();
  }

  // Método para obtener el prompt del sistema (Single Responsibility)
  private getSystemPrompt(): string {
    return `Eres un asistente virtual especializado en HogarZen, una aplicación de gestión de tareas del hogar. 

Tu función es ayudar a los usuarios con:

1. **Uso de la aplicación:**
   - Cómo crear, editar y eliminar tareas
   - Cómo marcar tareas como completadas
   - Cómo organizar tareas por categorías
   - Cómo usar las funciones de búsqueda y filtrado

2. **Consejos de organización:**
   - Sugerencias para mantener el hogar ordenado
   - Rutinas de limpieza eficientes
   - Tips para motivarse con las tareas
   - Ideas para dividir tareas grandes

3. **Solución de problemas:**
   - Ayuda con errores comunes
   - Guías paso a paso
   - Alternativas cuando algo no funciona

4. **Características de la app:**
   - Explicar funcionalidades específicas
   - Mejores prácticas de uso
   - Trucos y atajos

**Reglas importantes:**
- Responde siempre en español de manera amigable y motivadora
- Sé conciso pero completo
- Si no sabes algo específico de la app, sugiere contactar soporte
- Incluye emojis ocasionalmente para hacer las respuestas más amigables
- Enfócate en ser útil y práctico
- Si el usuario tiene problemas técnicos, guíalo paso a paso

**Contexto de la app:**
HogarZen es una aplicación web moderna con:
- Autenticación de usuarios
- CRUD completo de tareas
- Categorización de tareas
- Búsqueda y filtrado
- Interfaz responsive
- Notificaciones en tiempo real
- Tema claro/oscuro

Responde de manera natural y conversacional, como si fueras un amigo experto en organización del hogar.`;
  }

  // Método principal para enviar mensajes (Single Responsibility)
  async sendMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      const config = this.getConfig();
      
      if (!config.apiKey) {
        throw new Error('API key de Gemini no configurada');
      }

      // Construir el historial de conversación para contexto
      const conversationText = conversationHistory
        .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
        .join('\n');

      const fullPrompt = `${this.getSystemPrompt()}

${conversationHistory.length > 0 ? `Historial de la conversación:
${conversationText}

` : ''}Usuario: ${userMessage}

Asistente:`;

      const requestBody = {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };

      console.log('🤖 Enviando request a Gemini...');

      const response = await fetch(`${this.baseUrl}?key=${config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Respuesta de Gemini:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response body:', errorText);
        throw new Error(`Error en la API: ${response.status} - ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No se recibió respuesta de la IA');
      }

      return data.candidates[0].content.parts[0].text.trim();

    } catch (error) {
      console.error('❌ Error al comunicarse con Gemini:', error);
      throw new Error('Lo siento, no puedo procesar tu mensaje en este momento. Por favor, intenta de nuevo o contacta con soporte.');
    }
  }

  // Método para obtener sugerencias rápidas (Single Responsibility)
  async getQuickSuggestions(): Promise<string[]> {
    try {
      const response = await this.sendMessage('Dame 5 sugerencias rápidas de tareas comunes del hogar que los usuarios podrían querer agregar a su lista.');
      return response.split('\n').filter(line => line.trim().length > 0).slice(0, 5);
    } catch (error) {
      return [
        'Hacer la cama',
        'Lavar los platos',
        'Limpiar el baño',
        'Hacer la compra',
        'Organizar la ropa'
      ];
    }
  }

  // Método para generar checklist personalizada (Single Responsibility)
  async generatePersonalizedChecklist(
    userDescription: string, 
    selectedSections: string[] = []
  ): Promise<GeneratedTask[]> {
    try {
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

      const response = await this.sendMessage(prompt);
      
      // Intentar parsear la respuesta JSON
      try {
        const tasks = JSON.parse(response);
        if (Array.isArray(tasks)) {
          return tasks.slice(0, 8); // Limitar a 8 tareas
        }
      } catch (parseError) {
        console.error('Error parseando JSON de Gemini:', parseError);
      }

      // Si falla el parsing, generar tareas por defecto
      return this.generateDefaultTasks(userDescription, selectedSections);

    } catch (error) {
      console.error('Error generando checklist personalizada:', error);
      return this.generateDefaultTasks(userDescription, selectedSections);
    }
  }

  // Método para generar tareas por defecto (Single Responsibility)
  private generateDefaultTasks(userDescription: string, selectedSections: string[]): GeneratedTask[] {
    const tasks: GeneratedTask[] = [];
    const description = userDescription.toLowerCase();

    // Tareas basadas en secciones seleccionadas
    if (selectedSections.includes('Rutina Matutina')) {
      tasks.push(
        {
          title: 'Hacer la cama',
          description: 'Comenzar el día con orden y disciplina',
          category: 'hogar',
          priority: 'media'
        },
        {
          title: 'Ejercicio matutino',
          description: '15 minutos de estiramientos o yoga',
          category: 'bienestar',
          priority: 'alta'
        }
      );
    }

    if (selectedSections.includes('Limpieza del Hogar')) {
      tasks.push(
        {
          title: 'Limpiar la cocina',
          description: 'Lavar platos y limpiar superficies',
          category: 'hogar',
          priority: 'alta'
        },
        {
          title: 'Organizar espacios comunes',
          description: 'Recoger objetos y ordenar el salón',
          category: 'hogar',
          priority: 'media'
        }
      );
    }

    if (selectedSections.includes('Productividad')) {
      tasks.push(
        {
          title: 'Revisar agenda del día',
          description: 'Planificar tareas importantes',
          category: 'productividad',
          priority: 'alta'
        },
        {
          title: 'Trabajar en proyecto principal',
          description: 'Dedicar tiempo a tareas importantes',
          category: 'productividad',
          priority: 'alta'
        }
      );
    }

    if (selectedSections.includes('Bienestar')) {
      tasks.push(
        {
          title: 'Tomar agua',
          description: 'Beber al menos 8 vasos de agua',
          category: 'bienestar',
          priority: 'alta'
        },
        {
          title: 'Pausa para estirar',
          description: 'Hacer pausas activas cada hora',
          category: 'bienestar',
          priority: 'media'
        }
      );
    }

    // Tareas basadas en la descripción del usuario
    if (description.includes('trabajo') || description.includes('oficina')) {
      tasks.push(
        {
          title: 'Preparar almuerzo',
          description: 'Empacar comida para el trabajo',
          category: 'hogar',
          priority: 'alta'
        }
      );
    }

    if (description.includes('niños') || description.includes('familia')) {
      tasks.push(
        {
          title: 'Preparar mochilas',
          description: 'Organizar materiales escolares',
          category: 'hogar',
          priority: 'alta'
        }
      );
    }

    return tasks.slice(0, 8);
  }

  // Método para probar la conectividad (Single Responsibility)
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.getConfig().apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hola, responde solo con "OK"'
            }]
          }]
        })
      });

      console.log('🔍 Test connection response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Test connection error:', errorText);
        return false;
      }

      const data = await response.json();
      console.log('✅ Test connection success:', data);
      return true;
    } catch (error) {
      console.error('❌ Test connection failed:', error);
      return false;
    }
  }

  // Método para obtener información de debug
  public getDebugInfo() {
    const config = this.getConfig();
    return {
      keyConfigured: !!config.apiKey,
      keyPreview: config.apiKey ? `${config.apiKey.substring(0, 10)}...` : 'No configurada',
      baseUrl: this.baseUrl,
    };
  }
}

// Instancia singleton
export const geminiService = new GeminiService();
export type { ChatMessage }; 