// =====================================================
// HOOK DE CHECKLISTS CON IA
// =====================================================

import { useState, useCallback, useEffect } from 'react'
import { ChecklistService } from '../services/checklistService'
import { 
  Checklist, 
  ChecklistItem, 
  ChecklistTemplate, 
  AIChecklistRequest, 
  AIChecklistResponse 
} from '../types'
import { useAuth } from './useAuth'

interface UseChecklistsState {
  checklists: Checklist[]
  loading: boolean
  generating: boolean
  error: string | null
}

export const useChecklists = () => {
  const { user } = useAuth()
  const [state, setState] = useState<UseChecklistsState>({
    checklists: [],
    loading: false,
    generating: false,
    error: null
  })

  const checklistService = new ChecklistService()

  // Cargar checklists al montar el componente
  useEffect(() => {
    if (user?.id) {
      loadChecklists()
    }
  }, [user?.id])

  /**
   * Carga todos los checklists del usuario
   */
  const loadChecklists = useCallback(async () => {
    if (!user?.id) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const checklists = await checklistService.getChecklists(user.id)
      
      setState(prev => ({ 
        ...prev, 
        checklists, 
        loading: false 
      }))
      
      console.log(`✅ ${checklists.length} checklists cargados`)
    } catch (error) {
      console.error('❌ Error cargando checklists:', error)
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error cargando checklists' 
      }))
    }
  }, [user?.id])

  /**
   * Genera un checklist usando IA
   */
  const generateChecklistWithAI = useCallback(async (request: AIChecklistRequest): Promise<ChecklistTemplate | null> => {
    if (!user?.id) {
      setState(prev => ({ ...prev, error: 'Usuario no autenticado' }))
      return null
    }

    try {
      setState(prev => ({ ...prev, generating: true, error: null }))
      
      const response: AIChecklistResponse = await checklistService.createChecklistWithAI(request)
      
      if (!response.success || !response.checklist) {
        throw new Error(response.error || 'Error generando checklist')
      }

      setState(prev => ({ ...prev, generating: false }))
      
      console.log('✅ Checklist generado con IA:', response.checklist.title)
      return response.checklist

    } catch (error) {
      console.error('❌ Error generando checklist con IA:', error)
      setState(prev => ({ 
        ...prev, 
        generating: false, 
        error: error instanceof Error ? error.message : 'Error inesperado' 
      }))
      return null
    }
  }, [user?.id])

  /**
   * Guarda un checklist generado por IA
   */
  const saveGeneratedChecklist = useCallback(async (template: ChecklistTemplate): Promise<boolean> => {
    if (!user?.id) {
      setState(prev => ({ ...prev, error: 'Usuario no autenticado' }))
      return false
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      // Convertir template a checklist completo
      const checklist: Checklist = {
        id: `checklist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: user.id,
        title: template.title,
        description: template.description,
        category: template.category,
        items: template.items.map((item, index) => ({
          id: `item_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
          checklist_id: `checklist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: item.title,
          description: item.description,
          order: item.order,
          is_completed: false,
          created_at: new Date().toISOString()
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const result = await checklistService.saveChecklist(checklist)
      
      if (!result.success) {
        throw new Error(result.error || 'Error guardando checklist')
      }

      // Recargar checklists
      await loadChecklists()
      
      setState(prev => ({ ...prev, loading: false }))
      
      console.log('✅ Checklist guardado exitosamente')
      return true

    } catch (error) {
      console.error('❌ Error guardando checklist:', error)
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error inesperado' 
      }))
      return false
    }
  }, [user?.id, loadChecklists])

  /**
   * Actualiza un item de checklist
   */
  const updateChecklistItem = useCallback(async (itemId: string, updates: Partial<ChecklistItem>): Promise<boolean> => {
    try {
      const result = await checklistService.updateChecklistItem(itemId, updates)
      
      if (!result.success) {
        throw new Error(result.error || 'Error actualizando item')
      }

      // Recargar checklists para obtener el estado actualizado
      await loadChecklists()
      
      console.log('✅ Item actualizado exitosamente')
      return true

    } catch (error) {
      console.error('❌ Error actualizando item:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error inesperado' 
      }))
      return false
    }
  }, [loadChecklists])

  /**
   * Elimina un checklist
   */
  const deleteChecklist = useCallback(async (checklistId: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const result = await checklistService.deleteChecklist(checklistId)
      
      if (!result.success) {
        throw new Error(result.error || 'Error eliminando checklist')
      }

      // Recargar checklists
      await loadChecklists()
      
      setState(prev => ({ ...prev, loading: false }))
      
      console.log('✅ Checklist eliminado exitosamente')
      return true

    } catch (error) {
      console.error('❌ Error eliminando checklist:', error)
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error inesperado' 
      }))
      return false
    }
  }, [loadChecklists])

  /**
   * Marca un item como completado
   */
  const toggleItemCompletion = useCallback(async (itemId: string, isCompleted: boolean): Promise<boolean> => {
    const updates: Partial<ChecklistItem> = {
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : undefined
    }

    return await updateChecklistItem(itemId, updates)
  }, [updateChecklistItem])

  /**
   * Limpia el error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    // Estado
    checklists: state.checklists,
    loading: state.loading,
    generating: state.generating,
    error: state.error,
    
    // Acciones
    generateChecklistWithAI,
    saveGeneratedChecklist,
    updateChecklistItem,
    deleteChecklist,
    toggleItemCompletion,
    clearError,
    loadChecklists
  }
} 