// =====================================================
// COMPONENTE DE CALENDARIO FUNCIONAL
// =====================================================

import React, { useState, useMemo } from 'react'
import { Calendar as CalendarIcon, Plus, CheckCircle, Clock, Calendar as CalendarComponent } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { UserTask } from '../../types'

// =====================================================
// INTERFACES Y TIPOS
// =====================================================

interface CalendarViewProps {
  tasks: UserTask[]
  onAddTask: () => void
  onToggleTask: (taskId: string, status: boolean) => Promise<void>
}

interface CalendarDay {
  date: Date
  tasks: UserTask[]
  completedTasks: UserTask[]
  pendingTasks: UserTask[]
}

// =====================================================
// COMPONENTE DE VISTA DE CALENDARIO
// =====================================================

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onAddTask, onToggleTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')

  // =====================================================
  // FUNCIONES DE UTILIDAD
  // =====================================================

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start, end })

    return days.map((date: Date) => {
      const dayTasks = tasks.filter(task => 
        task.date && isSameDay(new Date(task.date), date)
      )
      
      return {
        date,
        tasks: dayTasks,
        completedTasks: dayTasks.filter(task => task.status),
        pendingTasks: dayTasks.filter(task => !task.status)
      }
    })
  }, [currentDate, tasks])

  const selectedDayTasks = useMemo(() => {
    if (!selectedDate) return []
    return tasks.filter(task => 
      task.date && isSameDay(new Date(task.date), selectedDate)
    )
  }, [selectedDate, tasks])

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date)
  }

  const handleToggleTask = async (taskId: string, status: boolean) => {
    await onToggleTask(taskId, status)
  }

  // =====================================================
  // RENDERIZADO
  // =====================================================

  return (
    <div className="space-y-6">
      {/* Header del calendario */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zen-900 dark:text-white">
            Calendario de Tareas
          </h2>
          <p className="text-zen-600 dark:text-gray-300">
            Organiza y visualiza tus tareas por fecha
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'month'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-zen-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Mes
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'week'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-zen-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Semana
          </button>
          <button
            onClick={onAddTask}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* Navegación del calendario */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5 text-zen-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold text-zen-900 dark:text-white">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h3>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5 text-zen-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendario principal */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {/* Días de la semana */}
            <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-zen-600 dark:text-gray-300">
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`
                    min-h-[100px] p-2 border-r border-b border-gray-200 dark:border-gray-700 cursor-pointer
                    hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                    ${isToday(day.date) ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                    ${selectedDate && isSameDay(day.date, selectedDate) ? 'ring-2 ring-primary-500' : ''}
                    ${!isSameMonth(day.date, currentDate) ? 'bg-gray-50 dark:bg-gray-800 text-gray-400' : ''}
                  `}
                >
                  <div className="text-sm font-medium text-zen-900 dark:text-white mb-1">
                    {format(day.date, 'd')}
                  </div>
                  
                  {/* Indicadores de tareas */}
                  {day.tasks.length > 0 && (
                    <div className="space-y-1">
                      {day.completedTasks.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">
                            {day.completedTasks.length}
                          </span>
                        </div>
                      )}
                      {day.pendingTasks.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-orange-500" />
                          <span className="text-xs text-orange-600 dark:text-orange-400">
                            {day.pendingTasks.length}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel de tareas del día seleccionado */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h4 className="text-lg font-semibold text-zen-900 dark:text-white mb-4">
              {selectedDate ? (
                <>
                  <CalendarIcon className="w-5 h-5 inline mr-2" />
                  {format(selectedDate, 'EEEE, d \'de\' MMMM', { locale: es })}
                </>
              ) : (
                'Selecciona un día'
              )}
            </h4>

            {selectedDate && (
              <div className="space-y-4">
                {selectedDayTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarComponent className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No hay tareas para este día
                    </p>
                    <button
                      onClick={onAddTask}
                      className="mt-3 btn-primary text-sm"
                    >
                      Agregar Tarea
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayTasks.map(task => (
                      <div
                        key={task.id}
                                                 className={`
                           p-3 rounded-lg border transition-colors cursor-pointer
                           ${task.status 
                             ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                             : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                           }
                         `}
                         onClick={() => handleToggleTask(task.id, !task.status)}
                       >
                         <div className="flex items-start justify-between">
                           <div className="flex-1">
                             <h5 className={`font-medium text-sm ${
                               task.status 
                                 ? 'text-green-700 dark:text-green-300 line-through' 
                                 : 'text-zen-900 dark:text-white'
                             }`}>
                               {task.task?.title || 'Tarea sin título'}
                             </h5>
                             {task.task?.description && (
                               <p className={`text-xs mt-1 ${
                                 task.status 
                                   ? 'text-green-600 dark:text-green-400' 
                                   : 'text-zen-600 dark:text-gray-400'
                               }`}>
                                 {task.task.description}
                               </p>
                             )}
                           </div>
                           <div className="ml-2">
                             {task.status ? (
                               <CheckCircle className="w-4 h-4 text-green-500" />
                             ) : (
                               <Clock className="w-4 h-4 text-orange-500" />
                             )}
                           </div>
                         </div>
                       </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 