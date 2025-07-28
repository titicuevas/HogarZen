// =====================================================
// SERVICIO DE GEMINI AI - BACKEND (PRINCIPIOS SOLID)
// =====================================================

const { environmentManager } = require('../config/environment')

// =====================================================
// INTERFACE SEGREGATION PRINCIPLE
// =====================================================

/**
 * Interface para operaciones de IA
 */
class IAIService {
  async generateResponse(prompt) { throw new Error('Método no implementado') }
  async analyzeTask(task) { throw new Error('Método no implementado') }
  async suggestImprovements(context) { throw new Error('Método no implementado') }
  async validateConfiguration() { throw new Error('Método no implementado') }
}

// =====================================================
// SINGLE RESPONSIBILITY PRINCIPLE
// =====================================================

/**
 * Cliente de Gemini - Responsabilidad única: conexión con Gemini AI
 */
class GeminiClient {
  constructor() {
    const { apiKey } = environmentManager.gemini
    
    if (!apiKey) {
      throw new Error('❌ Configuración de Gemini incompleta. Verifica VITE_GEMINI_API_KEY en .env.local')
    }
    
    this.apiKey = apiKey
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models'
    this.model = 'gemini-pro'
  }

  async makeRequest(prompt, options = {}) {
    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        topK: options.topK || 40,
        topP: options.topP || 0.95,
        maxOutputTokens: options.maxTokens || 1024
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('❌ Error en petición a Gemini:', error)
      throw error
    }
  }

  async testConnection() {
    try {
      const response = await this.makeRequest('Hola, ¿puedes confirmar que estás funcionando correctamente?', {
        maxTokens: 50
      })
      
      return {
        success: true,
        response: response.candidates?.[0]?.content?.parts?.[0]?.text || 'Respuesta recibida'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

/**
 * Procesador de Prompts - Responsabilidad única: formateo y procesamiento de prompts
 */
class PromptProcessor {
  static createTaskAnalysisPrompt(task) {
    return `Analiza la siguiente tarea del hogar y proporciona sugerencias para optimizarla:

Tarea: ${task.title}
Descripción: ${task.description || 'Sin descripción'}
Prioridad: ${task.priority || 'Media'}
Categoría: ${task.category || 'General'}

Por favor proporciona:
1. Sugerencias para optimizar la tarea
2. Tiempo estimado de realización
3. Herramientas o recursos recomendados
4. Consejos de seguridad si aplica
5. Posibles variaciones o subtareas

Responde de manera clara y estructurada.`
  }

  static createImprovementPrompt(context) {
    return `Basándote en el siguiente contexto de gestión del hogar, proporciona sugerencias de mejora:

Contexto: ${context}

Considera:
- Organización del tiempo
- Eficiencia en las tareas
- Distribución de responsabilidades
- Herramientas o tecnologías útiles
- Hábitos saludables

Proporciona 3-5 sugerencias prácticas y específicas.`
  }

  static createValidationPrompt(input) {
    return `Valida si el siguiente contenido es apropiado para una aplicación de gestión del hogar:

Contenido: ${input}

Responde solo con "APROPIADO" o "INAPROPIADO" seguido de una breve explicación.`
  }
}

/**
 * Gestor de Respuestas - Responsabilidad única: procesamiento y formateo de respuestas
 */
class ResponseProcessor {
  static parseTaskAnalysis(response) {
    try {
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || ''
      
      // Extraer información estructurada de la respuesta
      const analysis = {
        suggestions: [],
        estimatedTime: '',
        tools: [],
        safetyTips: [],
        subtasks: [],
        rawResponse: text
      }

      // Procesar la respuesta para extraer información específica
      const lines = text.split('\n')
      let currentSection = ''

      for (const line of lines) {
        const trimmedLine = line.trim()
        
        if (trimmedLine.includes('Sugerencias') || trimmedLine.includes('1.')) {
          currentSection = 'suggestions'
        } else if (trimmedLine.includes('Tiempo') || trimmedLine.includes('2.')) {
          currentSection = 'time'
        } else if (trimmedLine.includes('Herramientas') || trimmedLine.includes('3.')) {
          currentSection = 'tools'
        } else if (trimmedLine.includes('Seguridad') || trimmedLine.includes('4.')) {
          currentSection = 'safety'
        } else if (trimmedLine.includes('Subtareas') || trimmedLine.includes('5.')) {
          currentSection = 'subtasks'
        } else if (trimmedLine && currentSection) {
          switch (currentSection) {
            case 'suggestions':
              analysis.suggestions.push(trimmedLine.replace(/^[-•*]\s*/, ''))
              break
            case 'time':
              analysis.estimatedTime = trimmedLine
              break
            case 'tools':
              analysis.tools.push(trimmedLine.replace(/^[-•*]\s*/, ''))
              break
            case 'safety':
              analysis.safetyTips.push(trimmedLine.replace(/^[-•*]\s*/, ''))
              break
            case 'subtasks':
              analysis.subtasks.push(trimmedLine.replace(/^[-•*]\s*/, ''))
              break
          }
        }
      }

      return analysis
    } catch (error) {
      console.error('❌ Error procesando respuesta de análisis:', error)
      return {
        suggestions: ['Error procesando la respuesta'],
        estimatedTime: 'No disponible',
        tools: [],
        safetyTips: [],
        subtasks: [],
        rawResponse: response.candidates?.[0]?.content?.parts?.[0]?.text || ''
      }
    }
  }

  static parseImprovements(response) {
    try {
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const suggestions = text
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0)

      return {
        suggestions,
        rawResponse: text
      }
    } catch (error) {
      console.error('❌ Error procesando sugerencias:', error)
      return {
        suggestions: ['Error procesando las sugerencias'],
        rawResponse: text
      }
    }
  }
}

// =====================================================
// OPEN/CLOSED PRINCIPLE
// =====================================================

/**
 * Servicio de Gemini - Extiende la funcionalidad base
 */
class GeminiService extends IAIService {
  constructor() {
    super()
    this.geminiClient = new GeminiClient()
  }

  async generateResponse(prompt, options = {}) {
    try {
      console.log('🤖 Generando respuesta con Gemini...')
      const response = await this.geminiClient.makeRequest(prompt, options)
      
      return {
        success: true,
        data: response.candidates?.[0]?.content?.parts?.[0]?.text || '',
        fullResponse: response
      }
    } catch (error) {
      console.error('❌ Error generando respuesta:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async analyzeTask(task) {
    try {
      const prompt = PromptProcessor.createTaskAnalysisPrompt(task)
      const response = await this.geminiClient.makeRequest(prompt, {
        temperature: 0.3,
        maxTokens: 800
      })
      
      const analysis = ResponseProcessor.parseTaskAnalysis(response)
      
      return {
        success: true,
        data: analysis
      }
    } catch (error) {
      console.error('❌ Error analizando tarea:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async suggestImprovements(context) {
    try {
      const prompt = PromptProcessor.createImprovementPrompt(context)
      const response = await this.geminiClient.makeRequest(prompt, {
        temperature: 0.5,
        maxTokens: 600
      })
      
      const improvements = ResponseProcessor.parseImprovements(response)
      
      return {
        success: true,
        data: improvements
      }
    } catch (error) {
      console.error('❌ Error generando sugerencias:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async validateConfiguration() {
    try {
      const testResult = await this.geminiClient.testConnection()
      
      return {
        success: testResult.success,
        data: {
          isConfigured: environmentManager.gemini.isConfigured,
          connectionTest: testResult,
          debugInfo: environmentManager.getDebugInfo().gemini
        },
        error: testResult.error
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  async validateContent(content) {
    try {
      const prompt = PromptProcessor.createValidationPrompt(content)
      const response = await this.geminiClient.makeRequest(prompt, {
        temperature: 0.1,
        maxTokens: 100
      })
      
      const result = response.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const isAppropriate = result.toLowerCase().includes('apropiado')
      
      return {
        success: true,
        data: {
          isAppropriate,
          validation: result
        }
      }
    } catch (error) {
      console.error('❌ Error validando contenido:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// =====================================================
// DEPENDENCY INVERSION PRINCIPLE
// =====================================================

/**
 * Factory para crear instancias del servicio de IA
 */
class AIServiceFactory {
  static create() {
    return new GeminiService()
  }
}

module.exports = {
  GeminiService,
  AIServiceFactory,
  GeminiClient,
  PromptProcessor,
  ResponseProcessor,
  IAIService
} 