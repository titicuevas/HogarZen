// =====================================================
// COMPONENTE DE ANÁLISIS Y ESTADÍSTICAS
// =====================================================

import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { BarChart3, TrendingUp, Target, Award, Calendar, CheckCircle, Clock, Zap } from 'lucide-react'
import { UserTask } from '../../types'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'

// =====================================================
// INTERFACES Y TIPOS
// =====================================================

interface AnalyticsViewProps {
  tasks: UserTask[]
}

interface WeeklyData {
  day: string
  completed: number
  pending: number
  total: number
}

interface CategoryData {
  name: string
  value: number
  color: string
}

// =====================================================
// COMPONENTE DE VISTA DE ANÁLISIS
// =====================================================

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks }) => {
  
  // =====================================================
  // CÁLCULOS Y DATOS
  // =====================================================

  const analytics = useMemo(() => {
    const completedTasks = tasks.filter(task => task.status)
    const pendingTasks = tasks.filter(task => !task.status)
    const totalTasks = tasks.length
    
    // Calcular porcentaje de completado
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0
    
    // Calcular puntuación de productividad (0-100)
    const productivityScore = Math.min(100, Math.round(completionRate * 1.2))
    
    // Calcular racha actual
    const today = new Date()
    const lastWeek = eachDayOfInterval({
      start: subDays(today, 7),
      end: today
    })
    
    let currentStreak = 0
    for (let i = lastWeek.length - 1; i >= 0; i--) {
      const dayTasks = tasks.filter(task => 
        task.date && format(new Date(task.date), 'yyyy-MM-dd') === format(lastWeek[i], 'yyyy-MM-dd')
      )
      const dayCompleted = dayTasks.filter(task => task.status)
      
      if (dayCompleted.length > 0) {
        currentStreak++
      } else {
        break
      }
    }
    
    return {
      totalTasks,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      completionRate,
      productivityScore,
      currentStreak
    }
  }, [tasks])

  const weeklyData = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 })
    const end = endOfWeek(new Date(), { weekStartsOn: 1 })
    const weekDays = eachDayOfInterval({ start, end })
    
    return weekDays.map(day => {
      const dayTasks = tasks.filter(task => 
        task.date && format(new Date(task.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )
      
      return {
        day: format(day, 'EEE', { locale: es }),
        completed: dayTasks.filter(task => task.status).length,
        pending: dayTasks.filter(task => !task.status).length,
        total: dayTasks.length
      }
    })
  }, [tasks])

  const categoryData = useMemo(() => {
    const categoryCounts: { [key: string]: number } = {}
    
    tasks.forEach(task => {
      const category = task.task?.category || 'general'
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16']
    
    return Object.entries(categoryCounts).map(([category, count], index) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count,
      color: colors[index % colors.length]
    }))
  }, [tasks])

  const getProductivityLevel = (score: number) => {
    if (score >= 80) return { level: 'Excelente', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 60) return { level: 'Bueno', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 40) return { level: 'Regular', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: 'Necesita Mejora', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const productivityLevel = getProductivityLevel(analytics.productivityScore)

  // =====================================================
  // RENDERIZADO
  // =====================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zen-900 dark:text-white">
          Análisis de Productividad
        </h2>
        <p className="text-zen-600 dark:text-gray-300">
          Descubre tus patrones y mejora tu eficiencia
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Puntuación de Productividad */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zen-600 dark:text-gray-400">
                Puntuación de Productividad
              </p>
              <p className="text-2xl font-bold text-zen-900 dark:text-white">
                {analytics.productivityScore}/100
              </p>
            </div>
            <div className={`p-3 rounded-full ${productivityLevel.bg} dark:bg-opacity-20`}>
              <Target className={`w-6 h-6 ${productivityLevel.color}`} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zen-600 dark:text-gray-400">Progreso</span>
              <span className={`font-medium ${productivityLevel.color}`}>
                {productivityLevel.level}
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  productivityLevel.color.replace('text-', 'bg-')
                }`}
                style={{ width: `${analytics.productivityScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tareas Completadas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zen-600 dark:text-gray-400">
                Tareas Completadas
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {analytics.completedTasks}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-zen-600 dark:text-gray-400">
            {analytics.completionRate.toFixed(1)}% de completado
          </p>
        </div>

        {/* Tareas Pendientes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zen-600 dark:text-gray-400">
                Tareas Pendientes
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {analytics.pendingTasks}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-zen-600 dark:text-gray-400">
            Requieren atención
          </p>
        </div>

        {/* Racha Actual */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zen-600 dark:text-gray-400">
                Racha Actual
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {analytics.currentStreak} días
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-zen-600 dark:text-gray-400">
            ¡Mantén el ritmo!
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gráfico de progreso semanal */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-zen-900 dark:text-white mb-4">
            Progreso Semanal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Bar dataKey="completed" fill="#10b981" name="Completadas" />
              <Bar dataKey="pending" fill="#f59e0b" name="Pendientes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de categorías */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-zen-900 dark:text-white mb-4">
            Distribución por Categorías
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights y recomendaciones */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-zen-900 dark:text-white mb-4">
          Insights y Recomendaciones
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-zen-900 dark:text-white mb-3">
              💡 Insights
            </h4>
            <ul className="space-y-2 text-sm text-zen-600 dark:text-gray-400">
              <li>• Tu tasa de completado es del {analytics.completionRate.toFixed(1)}%</li>
              <li>• Llevas {analytics.currentStreak} días consecutivos completando tareas</li>
              <li>• Tienes {analytics.pendingTasks} tareas que requieren atención</li>
              {analytics.productivityScore < 60 && (
                <li>• Considera establecer recordatorios más frecuentes</li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-zen-900 dark:text-white mb-3">
              🎯 Recomendaciones
            </h4>
            <ul className="space-y-2 text-sm text-zen-600 dark:text-gray-400">
              {analytics.pendingTasks > 5 && (
                <li>• Prioriza las tareas más importantes</li>
              )}
              {analytics.currentStreak < 3 && (
                <li>• Intenta mantener una racha de al menos 3 días</li>
              )}
              <li>• Revisa tu progreso diariamente</li>
              <li>• Celebra tus logros para mantener la motivación</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 