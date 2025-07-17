import React, { useState, useEffect } from 'react'
import { Plus, LogOut, User, Calendar, RefreshCw } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTasks } from '../../hooks/useTasks'
import { TasksSummary } from './TasksSummary'
import { TaskItem } from './TaskItem'
import { AddTaskModal } from './AddTaskModal'
import { showNotification } from '../../utils/notifications'
import confetti from 'react-confetti'

// =====================================================
// COMPONENTE PRINCIPAL DEL DASHBOARD - PRINCIPIOS SOLID Y DRY
// =====================================================

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
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
      await logout()
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
    <div className="min-h-screen bg-zen-50">
      {/* Confeti para celebración */}
      {showConfetti && (
        <confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y título */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HZ</span>
              </div>
              <h1 className="text-xl font-bold text-zen-900">HogarZen</h1>
            </div>

            {/* Información del usuario y acciones */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-zen-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(currentDate)}</span>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Actualizar datos"
              >
                <RefreshCw className={`w-4 h-4 text-zen-400 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-zen-400" />
                <span className="text-sm text-zen-600">{user?.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-zen-600 hover:text-zen-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Saludo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zen-900 mb-2">
            {getGreeting()}, {user?.name} 👋
          </h2>
          <p className="text-zen-600">
            Gestiona tus tareas del hogar de manera inteligente y mantén tu casa segura.
          </p>
        </div>

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

          {/* Columna derecha - Lista de tareas */}
          <div className="lg:col-span-2">
            <div className="card">
              {/* Header de la lista */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-zen-900">
                  Mis Tareas de Hoy
                </h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Tarea</span>
                </button>
              </div>

              {/* Lista de tareas */}
              <div className="space-y-4">
                {loading ? (
                  // Skeleton loading para tareas
                  [...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))
                ) : userTasks.length === 0 ? (
                  // Estado vacío
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-zen-900 mb-2">
                      No tienes tareas para hoy
                    </h3>
                    <p className="text-zen-600 mb-6">
                      Agrega algunas tareas para comenzar a organizar tu día.
                    </p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="btn-primary flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Primera Tarea</span>
                    </button>
                  </div>
                ) : (
                  // Lista de tareas
                  userTasks.map(userTask => (
                    <TaskItem
                      key={userTask.id}
                      userTask={userTask}
                      onToggleStatus={handleToggleTask}
                      onRemove={handleRemoveTask}
                      loading={loading}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
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