import React, { useState } from 'react'
import { CheckCircle, Circle, Trash2, MoreVertical } from 'lucide-react'
import { UserTask } from '../../types'
import { showNotification } from '../../utils/notifications'

// =====================================================
// COMPONENTE DE TAREA INDIVIDUAL - PRINCIPIOS SOLID Y DRY
// =====================================================

interface TaskItemProps {
  userTask: UserTask
  onToggleStatus: (userTaskId: string, status: boolean) => Promise<void>
  onRemove: (userTaskId: string) => Promise<void>
  loading?: boolean
}

export const TaskItem: React.FC<TaskItemProps> = ({
  userTask,
  onToggleStatus,
  onRemove,
  loading = false
}) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  // =====================================================
  // FUNCIONES DE MANIPULACIÓN
  // =====================================================

  const handleToggleStatus = async (): Promise<void> => {
    if (loading || isUpdating) return

    setIsUpdating(true)
    try {
      await onToggleStatus(userTask.id, !userTask.status)
    } catch (error) {
      console.error('Error al cambiar estado de tarea:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async (): Promise<void> => {
    if (loading || isUpdating) return

    // Confirmar eliminación
    const confirmed = await showNotification('question', {
      title: 'Eliminar tarea',
      text: `¿Estás seguro de que quieres eliminar "${userTask.task?.title}"?`,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (!confirmed) return

    setIsUpdating(true)
    try {
      await onRemove(userTask.id)
    } catch (error) {
      console.error('Error al eliminar tarea:', error)
    } finally {
      setIsUpdating(false)
      setShowMenu(false)
    }
  }

  const handleMenuToggle = (): void => {
    setShowMenu(!showMenu)
  }

  // =====================================================
  // FUNCIONES DE UTILIDAD
  // =====================================================

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      seguridad: 'bg-red-100 text-red-800',
      electrodomesticos: 'bg-blue-100 text-blue-800',
      agua: 'bg-cyan-100 text-cyan-800',
      energia: 'bg-yellow-100 text-yellow-800',
      cocina: 'bg-orange-100 text-orange-800',
      entretenimiento: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors.general
  }

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      seguridad: '🔒',
      electrodomesticos: '🔌',
      agua: '💧',
      energia: '⚡',
      cocina: '🍳',
      entretenimiento: '📺',
      general: '📋'
    }
    return icons[category] || icons.general
  }

  // =====================================================
  // RENDERIZADO
  // =====================================================

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`card transition-all duration-200 ${
      userTask.status 
        ? 'bg-green-50 border-green-200' 
        : 'hover:shadow-md'
    }`}>
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <button
          onClick={handleToggleStatus}
          disabled={isUpdating}
          className={`flex-shrink-0 mt-1 transition-all duration-200 ${
            isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          }`}
        >
          {userTask.status ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 hover:text-primary-500" />
          )}
        </button>

        {/* Contenido de la tarea */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-medium text-zen-900 ${
                userTask.status ? 'line-through text-zen-500' : ''
              }`}>
                {userTask.task?.title}
              </h3>
              
              {userTask.task?.description && (
                <p className={`text-sm mt-1 ${
                  userTask.status ? 'text-zen-400' : 'text-zen-600'
                }`}>
                  {userTask.task.description}
                </p>
              )}

              {/* Categoría */}
              <div className="flex items-center mt-2 space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(userTask.task?.category || 'general')}`}>
                  <span className="mr-1">{getCategoryIcon(userTask.task?.category || 'general')}</span>
                  {userTask.task?.category}
                </span>

                {/* Tiempo de completado */}
                {userTask.status && userTask.completed_at && (
                  <span className="text-xs text-zen-500">
                    Completada a las {new Date(userTask.completed_at).toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                )}
              </div>
            </div>

            {/* Menú de opciones */}
            <div className="relative flex-shrink-0">
              <button
                onClick={handleMenuToggle}
                disabled={isUpdating}
                className={`p-1 rounded-full transition-colors ${
                  isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
              >
                <MoreVertical className="w-4 h-4 text-zen-400" />
              </button>

              {/* Dropdown menu */}
              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={handleRemove}
                    disabled={isUpdating}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar tarea
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay de carga */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
} 