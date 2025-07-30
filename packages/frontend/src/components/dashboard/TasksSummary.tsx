import React from 'react'
import { CheckCircle, Clock, Target } from 'lucide-react'

// =====================================================
// COMPONENTE DE RESUMEN DE TAREAS - PRINCIPIOS SOLID Y DRY
// =====================================================

interface TasksSummaryProps {
  total: number
  completed: number
  pending: number
  percentage: number
  loading?: boolean
}

export const TasksSummary: React.FC<TasksSummaryProps> = ({
  total,
  completed,
  pending,
  percentage,
  loading = false
}) => {
  // =====================================================
  // FUNCIONES DE UTILIDAD
  // =====================================================

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    if (percentage >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getProgressText = (percentage: number): string => {
    if (percentage === 100) return '¡Perfecto! Todo completado'
    if (percentage >= 80) return '¡Excelente progreso!'
    if (percentage >= 60) return 'Buen trabajo, sigue así'
    if (percentage >= 40) return 'Vas por buen camino'
    if (percentage >= 20) return 'Empieza con las tareas más importantes'
    return '¡Comienza con tu checklist!'
  }

  // =====================================================
  // RENDERIZADO
  // =====================================================

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="flex space-x-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card dark:bg-gray-800 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zen-900 dark:text-white flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary-600" />
          Progreso del Día
        </h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-zen-900 dark:text-white">{percentage}%</div>
          <div className="text-sm text-zen-600 dark:text-gray-300">{completed} de {total}</div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Mensaje motivacional */}
      <p className="text-zen-600 dark:text-gray-300 mb-4 text-sm">
        {getProgressText(percentage)}
      </p>

      {/* Estadísticas detalladas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <div>
            <div className="font-semibold text-green-900 dark:text-green-400">{completed}</div>
            <div className="text-sm text-green-600 dark:text-green-300">Completadas</div>
          </div>
        </div>

        <div className="flex items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <Clock className="w-5 h-5 text-orange-600 mr-2" />
          <div>
            <div className="font-semibold text-orange-900 dark:text-orange-400">{pending}</div>
            <div className="text-sm text-orange-600 dark:text-orange-300">Pendientes</div>
          </div>
        </div>
      </div>

      {/* Mensaje especial para 100% */}
      {percentage === 100 && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 dark:text-green-300 font-medium">
              ¡Felicidades! Has completado todas las tareas del día
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 