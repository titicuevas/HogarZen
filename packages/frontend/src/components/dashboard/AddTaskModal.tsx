import React, { useState, useEffect } from 'react'
import { X, Search, Plus, Filter } from 'lucide-react'
import { Task, TaskCategory } from '../../types'

// =====================================================
// MODAL PARA AGREGAR TAREAS - PRINCIPIOS SOLID Y DRY
// =====================================================

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (taskId: string) => Promise<void>
  systemTasks: Task[]
  loading?: boolean
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  systemTasks,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // =====================================================
  // FUNCIONES DE FILTRADO
  // =====================================================

  const filteredTasks = systemTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories: Array<{ value: TaskCategory | 'all', label: string, icon: string }> = [
    { value: 'all', label: 'Todas', icon: '📋' },
    { value: 'seguridad', label: 'Seguridad', icon: '🔒' },
    { value: 'electrodomesticos', label: 'Electrodomésticos', icon: '🔌' },
    { value: 'agua', label: 'Agua', icon: '💧' },
    { value: 'energia', label: 'Energía', icon: '⚡' },
    { value: 'cocina', label: 'Cocina', icon: '🍳' },
    { value: 'entretenimiento', label: 'Entretenimiento', icon: '📺' },
    { value: 'general', label: 'General', icon: '📋' }
  ]

  // =====================================================
  // FUNCIONES DE MANIPULACIÓN
  // =====================================================

  const handleAddTask = async (): Promise<void> => {
    if (!selectedTaskId || isAdding) return

    setIsAdding(true)
    try {
      await onAddTask(selectedTaskId)
      handleClose()
    } catch (error) {
      console.error('Error al agregar tarea:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleClose = (): void => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedTaskId(null)
    setIsAdding(false)
    onClose()
  }

  const handleTaskSelect = (taskId: string): void => {
    setSelectedTaskId(taskId)
  }

  // =====================================================
  // EFECTOS
  // =====================================================

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
      setSelectedCategory('all')
      setSelectedTaskId(null)
    }
  }, [isOpen])

  // =====================================================
  // RENDERIZADO
  // =====================================================

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-zen-900 dark:text-white">Agregar Tarea</h2>
          <button
            onClick={handleClose}
            disabled={isAdding}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-zen-400 dark:text-gray-400" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Filtros */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            {/* Búsqueda */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zen-400 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Filtro por categoría */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-zen-400 dark:text-gray-400 flex-shrink-0" />
              {categories.map(category => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                    selectedCategory === category.value
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-zen-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lista de tareas */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              // Skeleton loading
              <div className="space-y-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-zen-400 dark:text-gray-400 mb-2">🔍</div>
                <p className="text-zen-600 dark:text-gray-400">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'No se encontraron tareas con los filtros aplicados'
                    : 'No hay tareas disponibles'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskSelect(task.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedTaskId === task.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-400 hover:bg-primary-25 dark:hover:bg-primary-900/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-zen-900 dark:text-white mb-1">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-zen-600 dark:text-gray-400 mb-2">{task.description}</p>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          task.category === 'seguridad' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                          task.category === 'electrodomesticos' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                          task.category === 'agua' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300' :
                          task.category === 'energia' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                          task.category === 'cocina' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                          task.category === 'entretenimiento' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}>
                          {task.category}
                        </span>
                      </div>
                      {selectedTaskId === task.id && (
                        <div className="flex-shrink-0 ml-3">
                          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                            <Plus className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={isAdding}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddTask}
              disabled={!selectedTaskId || isAdding}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Agregando...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Agregar Tarea</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 