// =====================================================
// ICONOS Y EMOJIS PARA TAREAS Y CHECKLISTS
// =====================================================

export type TaskCategory = 
  | 'seguridad'
  | 'electrodomesticos'
  | 'agua'
  | 'energia'
  | 'cocina'
  | 'entretenimiento'
  | 'general'

export type ChecklistCategory = 
  | 'hogar'
  | 'trabajo'
  | 'viaje'
  | 'evento'
  | 'mantenimiento'
  | 'limpieza'
  | 'organizacion'
  | 'personal'
  | 'otro'

/**
 * Obtiene el emoji para una categoría de tarea
 */
export const getTaskCategoryEmoji = (category: TaskCategory): string => {
  const emojis: Record<TaskCategory, string> = {
    seguridad: '🔒',
    electrodomesticos: '🔌',
    agua: '💧',
    energia: '⚡',
    cocina: '🍳',
    entretenimiento: '🎮',
    general: '📋'
  }
  return emojis[category] || '📋'
}

/**
 * Obtiene el emoji para una categoría de checklist
 */
export const getChecklistCategoryEmoji = (category: ChecklistCategory): string => {
  const emojis: Record<ChecklistCategory, string> = {
    hogar: '🏠',
    trabajo: '💼',
    viaje: '✈️',
    evento: '🎉',
    mantenimiento: '🔧',
    limpieza: '🧹',
    organizacion: '📁',
    personal: '👤',
    otro: '📝'
  }
  return emojis[category] || '📝'
}

/**
 * Obtiene el nombre de la categoría en español
 */
export const getTaskCategoryName = (category: TaskCategory): string => {
  const names: Record<TaskCategory, string> = {
    seguridad: 'Seguridad',
    electrodomesticos: 'Electrodomésticos',
    agua: 'Agua',
    energia: 'Energía',
    cocina: 'Cocina',
    entretenimiento: 'Entretenimiento',
    general: 'General'
  }
  return names[category] || 'General'
}

/**
 * Obtiene el nombre de la categoría de checklist en español
 */
export const getChecklistCategoryName = (category: ChecklistCategory): string => {
  const names: Record<ChecklistCategory, string> = {
    hogar: 'Hogar',
    trabajo: 'Trabajo',
    viaje: 'Viaje',
    evento: 'Evento',
    mantenimiento: 'Mantenimiento',
    limpieza: 'Limpieza',
    organizacion: 'Organización',
    personal: 'Personal',
    otro: 'Otro'
  }
  return names[category] || 'Otro'
} 