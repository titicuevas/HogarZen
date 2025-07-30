import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTasks } from '../../hooks/useTasks'
import { TaskItem } from './TaskItem'
import { AddTaskModal } from './AddTaskModal'
import { TasksSummary } from './TasksSummary'
import { Plus, Filter, Search, Calendar, Clock, CheckCircle } from 'lucide-react'
import { showNotification } from '../../utils/notifications'

// =====================================================
// COMPONENTE VISTA DE TAREAS ESPECÍFICA
// =====================================================

export const TasksView: React.FC = () => {
  const { user } = useAuth()
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks()
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showConfetti, setShowConfetti] = useState(false)

  // =====================================================
  // MANEJADORES
  // =====================================================
  const handleAddTask = async (taskData: { title: string; description: string; category: string; priority: string; dueDate: string }) => {
    try {
      await addTask(taskData)
      setShowAddModal(false)
      showNotification('Tarea creada exitosamente', 'success')
    } catch (error) {
      showNotification('Error al crear la tarea', 'error')
    }
  }

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await updateTask(taskId, { completed })
      if (completed) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
        showNotification('¡Tarea completada! 🎉', 'success')
      }
    } catch (error) {
      showNotification('Error al actualizar la tarea', 'error')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      showNotification('Tarea eliminada', 'success')
    } catch (error) {
      showNotification('Error al eliminar la tarea', 'error')
    }
  }

  // =====================================================
  // FILTRADO Y BÚSQUEDA
  // =====================================================
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'pending' && !task.completed)
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory

    return matchesSearch && matchesStatus && matchesCategory
  })

  const pendingTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  // =====================================================
  // CATEGORÍAS ÚNICAS
  // =====================================================
  const categories = Array.from(new Set(tasks.map(task => task.category)))

  // =====================================================
  // RENDERIZADO
  // =====================================================
  return (
    <div className="space-y-6">
      {/* Confeti para celebración */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-0 left-3/4 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute top-0 left-1/3 w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
          <div className="absolute top-0 left-2/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }}></div>
        </div>
      )}

      {/* Header de la vista */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-primary-600" />
              <span>Mis Tareas</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gestiona y organiza todas tus tareas del hogar
            </p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2 px-6 py-3"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* Resumen de tareas */}
      <TasksSummary 
        totalTasks={tasks.length}
        completedTasks={completedTasks.length}
        pendingTasks={pendingTasks.length}
      />

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro de estado */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'completed')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completadas</option>
            </select>
          </div>

          {/* Filtro de categoría */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Cargando tareas...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <CheckCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' 
                ? 'No se encontraron tareas' 
                : 'No hay tareas aún'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando tu primera tarea'}
            </p>
            {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Crear Primera Tarea</span>
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>

      {/* Modal para agregar tarea */}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTask}
      />
    </div>
  )
} 