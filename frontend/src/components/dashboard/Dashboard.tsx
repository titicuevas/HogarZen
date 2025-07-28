import React, { useState, useEffect } from 'react'
import { Plus, LogOut, User, Calendar, RefreshCw, Sun, Moon, BarChart3, Settings, Home, Clock, TrendingUp, Award, Target } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTasks } from '../../hooks/useTasks'
import { useTheme } from '../../contexts/ThemeContext'
import { TasksSummary } from './TasksSummary'
import { AddTaskModal } from './AddTaskModal'
import { CalendarView } from './CalendarView'
import { AnalyticsView } from './AnalyticsView'
import { SettingsView } from './SettingsView'
import { showNotification } from '../../utils/notifications'
import { useLocation, useNavigate } from 'react-router-dom'

// =====================================================
// COMPONENTE DASHBOARD - VISTA DE RESUMEN GENERAL
// =====================================================

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Determinar la vista actual basada en la ruta
  const getCurrentViewFromPath = (): 'dashboard' | 'calendar' | 'analytics' | 'settings' => {
    switch (location.pathname) {
      case '/dashboard':
        return 'dashboard'
      case '/calendario':
        return 'calendar'
      case '/analisis':
        return 'analytics'
      case '/configuracion':
        return 'settings'
      default:
        return 'dashboard'
    }
  }
  
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'analytics' | 'settings'>(getCurrentViewFromPath)
  const {
    userTasks,
    systemTasks,
    summary,
    loading,
    error,
    addUserTask,
    toggleTaskStatus,
    removeUserTask,
    refreshSummary,
    clearError
  } = useTasks()

  const [showAddModal, setShowAddModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentDate] = useState(new Date().toISOString().split('T')[0])

  // =====================================================
  // FUNCIONES DE MANIPULACIÓN
  // =====================================================

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut()
      showNotification('success', 'Sesión cerrada correctamente')
    } catch (error) {
      showNotification('error', 'Error al cerrar sesión')
    }
  }

  const handleAddTask = async (taskId: string): Promise<void> => {
    try {
      await addUserTask(taskId, currentDate)
    } catch (error) {
      console.error('Error al agregar tarea:', error)
    }
  }

  const handleToggleTask = async (userTaskId: string, status: boolean): Promise<void> => {
    try {
      await toggleTaskStatus(userTaskId, status)
      
      // Mostrar confeti si se completó la última tarea
      if (status && summary.total > 0 && summary.completed + 1 === summary.total) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    } catch (error) {
      console.error('Error al cambiar estado de tarea:', error)
    }
  }

  const handleRemoveTask = async (userTaskId: string): Promise<void> => {
    try {
      await removeUserTask(userTaskId)
    } catch (error) {
      console.error('Error al eliminar tarea:', error)
    }
  }

  const handleRefresh = async (): Promise<void> => {
    try {
      await refreshSummary()
      showNotification('success', 'Datos actualizados')
    } catch (error) {
      showNotification('error', 'Error al actualizar datos')
    }
  }

  // =====================================================
  // EFECTOS
  // =====================================================

  useEffect(() => {
    if (error) {
      showNotification('error', error)
      clearError()
    }
  }, [error, clearError])

  // Sincronizar la vista con la ruta
  useEffect(() => {
    const viewFromPath = getCurrentViewFromPath()
    setCurrentView(viewFromPath)
  }, [location.pathname])

  // =====================================================
  // FUNCIONES DE UTILIDAD
  // =====================================================

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getGreeting = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  // =====================================================
  // RENDERIZADO
  // =====================================================

  return (
    <div>
      {/* Confeti para celebración */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Simulación de confeti con CSS */}
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-0 left-3/4 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute top-0 left-1/3 w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
          <div className="absolute top-0 left-2/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }}></div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Contenido dinámico basado en la vista */}
        {currentView === 'dashboard' && (
          <>
            {/* Saludo */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-zen-900 dark:text-white mb-2">
                {getGreeting()}, {user?.name} 👋
              </h2>
              <p className="text-zen-600 dark:text-gray-300">
                Bienvenido a tu centro de control del hogar. Aquí tienes una vista general de todo.
              </p>
            </div>

            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tareas Pendientes</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tareas Completadas</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Productividad</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.percentage}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Racha Actual</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">5 días</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <Plus className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nueva Tarea</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Crear una nueva tarea</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Crear Tarea
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Checklist IA</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Generar con inteligencia artificial</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checklists')}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Ir a Checklists
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ver Análisis</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Revisar tu progreso</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/analisis')}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Ver Análisis
                </button>
              </div>
            </div>

            {/* Resumen y estadísticas */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Columna izquierda - Resumen */}
              <div className="lg:col-span-1">
                <TasksSummary
                  total={summary.total}
                  completed={summary.completed}
                  pending={summary.pending}
                  percentage={summary.percentage}
                  loading={loading}
                />
              </div>

              {/* Columna derecha - Estadísticas rápidas */}
              <div className="lg:col-span-2">
                <div className="card">
                  {/* Header de la lista */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-zen-900 dark:text-white">
                      Resumen del Día
                    </h3>
                    <button
                      onClick={handleRefresh}
                      disabled={loading}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center space-x-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      <span>Actualizar</span>
                    </button>
                  </div>

                  {/* Estadísticas */}
                  <div className="space-y-4">
                    {loading ? (
                      // Skeleton loading
                      [...Array(3)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="h-16 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                        </div>
                      ))
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Tareas del Hogar</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{summary.total} tareas totales</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{summary.percentage}%</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Completado</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                              <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Racha Actual</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Días consecutivos</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">5</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Días</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Tendencia</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Esta semana</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">+12%</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Mejora</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {currentView === 'calendar' && (
          <CalendarView
            tasks={userTasks}
            onAddTask={() => setShowAddModal(true)}
            onToggleTask={handleToggleTask}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView tasks={userTasks} />
        )}

        {currentView === 'settings' && (
          <SettingsView user={user} />
        )}
      </main>

      {/* Modal para agregar tareas */}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddTask={handleAddTask}
        systemTasks={systemTasks}
        loading={loading}
      />
    </div>
  )
} 