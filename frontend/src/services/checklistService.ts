// =====================================================
// SERVICIO DE CHECKLISTS CON IA - FRONTEND
// =====================================================

import { 
  Checklist, 
  ChecklistItem, 
  ChecklistTemplate, 
  AIChecklistRequest, 
  AIChecklistResponse,
  ChecklistCategory 
} from '../types'
import { environmentManager } from '../config/environment'

// =====================================================
// INTERFACE SEGREGATION PRINCIPLE
// =====================================================

interface IChecklistService {
  createChecklistWithAI(request: AIChecklistRequest): Promise<AIChecklistResponse>
  saveChecklist(checklist: Checklist): Promise<{ success: boolean; error?: string }>
  getChecklists(userId: string): Promise<Checklist[]>
  updateChecklistItem(itemId: string, updates: Partial<ChecklistItem>): Promise<{ success: boolean; error?: string }>
  deleteChecklist(checklistId: string): Promise<{ success: boolean; error?: string }>
}

// =====================================================
// SINGLE RESPONSIBILITY PRINCIPLE
// =====================================================

/**
 * Servicio de Checklists con IA - Responsabilidad única: gestión de checklists
 */
export class ChecklistService implements IChecklistService {
  private geminiApiKey: string

  constructor() {
    const config = environmentManager.getGeminiConfig()
    this.geminiApiKey = config.apiKey
  }

  /**
   * Crea un checklist usando IA
   */
  async createChecklistWithAI(request: AIChecklistRequest): Promise<AIChecklistResponse> {
    try {
      console.log('🤖 Generando checklist con IA:', request.description)

      const prompt = this.buildAIPrompt(request)
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`Error en la API de Gemini: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.candidates[0].content.parts[0].text

      // Parsear la respuesta de la IA
      const checklist = this.parseAIResponse(generatedText, request)
      
      if (!checklist) {
        throw new Error('No se pudo generar el checklist')
      }

      console.log('✅ Checklist generado exitosamente')
      return {
        success: true,
        checklist
      }

    } catch (error) {
      console.error('❌ Error generando checklist con IA:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error inesperado'
      }
    }
  }

  /**
   * Construye el prompt para la IA
   */
  private buildAIPrompt(request: AIChecklistRequest): string {
    const category = request.category || 'otro'
    const complexity = request.complexity || 'moderado'
    
    return `
Eres un asistente experto en organización y productividad. Necesito que me ayudes a crear un checklist basado en la siguiente descripción:

DESCRIPCIÓN: ${request.description}
CATEGORÍA: ${category}
COMPLEJIDAD: ${complexity}

Por favor, genera un checklist estructurado en el siguiente formato JSON:

{
  "title": "Título del checklist",
  "description": "Descripción breve del checklist",
  "category": "${category}",
  "items": [
    {
      "title": "Título del item",
      "description": "Descripción opcional del item",
      "order": 1
    }
  ]
}

INSTRUCCIONES:
1. El título debe ser claro y conciso
2. La descripción debe explicar el propósito del checklist
3. Los items deben estar ordenados lógicamente
4. Cada item debe ser específico y accionable
5. Incluye entre 5-15 items dependiendo de la complejidad
6. Usa un lenguaje claro y directo
7. Considera las mejores prácticas para la categoría especificada

Responde SOLO con el JSON válido, sin texto adicional.
`
  }

  /**
   * Parsea la respuesta de la IA
   */
  private parseAIResponse(response: string, request: AIChecklistRequest): ChecklistTemplate | null {
    try {
      // Extraer JSON de la respuesta
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error('❌ No se encontró JSON en la respuesta de la IA')
        return null
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      // Validar estructura
      if (!parsed.title || !parsed.items || !Array.isArray(parsed.items)) {
        console.error('❌ Estructura JSON inválida')
        return null
      }

      // Convertir a ChecklistTemplate
      const checklist: ChecklistTemplate = {
        id: `temp_${Date.now()}`,
        title: parsed.title,
        description: parsed.description || request.description,
        category: parsed.category as ChecklistCategory || request.category || 'otro',
        items: parsed.items.map((item: any, index: number) => ({
          title: item.title,
          description: item.description || '',
          order: item.order || index + 1
        }))
      }

      return checklist

    } catch (error) {
      console.error('❌ Error parseando respuesta de la IA:', error)
      return null
    }
  }

  /**
   * Guarda un checklist en el almacenamiento local (temporal)
   */
  async saveChecklist(checklist: Checklist): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('💾 Guardando checklist:', checklist.title)
      
      // Por ahora, guardamos en localStorage
      const existingChecklists = this.getChecklistsFromStorage(checklist.user_id)
      const updatedChecklists = [...existingChecklists, checklist]
      
      localStorage.setItem(`checklists_${checklist.user_id}`, JSON.stringify(updatedChecklists))
      
      console.log('✅ Checklist guardado exitosamente')
      return { success: true }

    } catch (error) {
      console.error('❌ Error guardando checklist:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error inesperado' 
      }
    }
  }

  /**
   * Obtiene todos los checklists de un usuario
   */
  async getChecklists(userId: string): Promise<Checklist[]> {
    try {
      console.log('📋 Obteniendo checklists para usuario:', userId)
      
      const checklists = this.getChecklistsFromStorage(userId)
      
      console.log(`✅ ${checklists.length} checklists encontrados`)
      return checklists

    } catch (error) {
      console.error('❌ Error obteniendo checklists:', error)
      return []
    }
  }

  /**
   * Actualiza un item de checklist
   */
  async updateChecklistItem(itemId: string, updates: Partial<ChecklistItem>): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔄 Actualizando item de checklist:', itemId)
      
      // Por ahora, actualizamos en localStorage
      const userId = this.getCurrentUserId()
      if (!userId) {
        throw new Error('Usuario no autenticado')
      }

      const checklists = this.getChecklistsFromStorage(userId)
      let updated = false

      const updatedChecklists = checklists.map(checklist => {
        const updatedItems = checklist.items.map(item => {
          if (item.id === itemId) {
            updated = true
            return { ...item, ...updates }
          }
          return item
        })
        return { ...checklist, items: updatedItems }
      })

      if (!updated) {
        throw new Error('Item no encontrado')
      }

      localStorage.setItem(`checklists_${userId}`, JSON.stringify(updatedChecklists))
      
      console.log('✅ Item actualizado exitosamente')
      return { success: true }

    } catch (error) {
      console.error('❌ Error actualizando item:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error inesperado' 
      }
    }
  }

  /**
   * Elimina un checklist
   */
  async deleteChecklist(checklistId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🗑️ Eliminando checklist:', checklistId)
      
      const userId = this.getCurrentUserId()
      if (!userId) {
        throw new Error('Usuario no autenticado')
      }

      const checklists = this.getChecklistsFromStorage(userId)
      const filteredChecklists = checklists.filter(c => c.id !== checklistId)

      if (filteredChecklists.length === checklists.length) {
        throw new Error('Checklist no encontrado')
      }

      localStorage.setItem(`checklists_${userId}`, JSON.stringify(filteredChecklists))
      
      console.log('✅ Checklist eliminado exitosamente')
      return { success: true }

    } catch (error) {
      console.error('❌ Error eliminando checklist:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error inesperado' 
      }
    }
  }

  /**
   * Obtiene checklists del almacenamiento local
   */
  private getChecklistsFromStorage(userId: string): Checklist[] {
    try {
      const stored = localStorage.getItem(`checklists_${userId}`)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('❌ Error leyendo checklists del almacenamiento:', error)
      return []
    }
  }

  /**
   * Obtiene el ID del usuario actual
   */
  private getCurrentUserId(): string | null {
    try {
      const userData = localStorage.getItem('userData')
      if (userData) {
        const user = JSON.parse(userData)
        return user.id
      }
      return null
    } catch (error) {
      console.error('❌ Error obteniendo ID de usuario:', error)
      return null
    }
  }

  /**
   * Genera un ID único
   */
  private generateId(): string {
    return `checklist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// =====================================================
// DEPENDENCY INVERSION PRINCIPLE
// =====================================================

export class ChecklistServiceFactory {
  static create(): IChecklistService {
    return new ChecklistService()
  }
}

export default ChecklistService 