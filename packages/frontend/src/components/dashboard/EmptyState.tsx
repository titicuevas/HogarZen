import React from 'react'
import { Plus, Sparkles, Target, Award, Home, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

// =====================================================
// COMPONENTE ESTADO VACÍO - PARA USUARIOS NUEVOS
// =====================================================

interface EmptyStateProps {
  onAddFirstTask: () => void
  onOpenAIAssistant: () => void
  userName?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddFirstTask,
  onOpenAIAssistant,
  userName = 'Usuario'
}) => {
  const getGreeting = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Saludo personalizado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-zen-900 dark:text-white mb-4">
          {getGreeting()}, {userName}! 👋
        </h1>
        <p className="text-lg text-zen-600 dark:text-gray-300 max-w-2xl mx-auto">
          ¡Bienvenido a HogarZen! Tu asistente inteligente para gestionar las tareas del hogar.
          Comienza creando tu primera tarea o deja que la IA te ayude a generar una checklist personalizada.
        </p>
      </motion.div>

      {/* Tarjetas de acción principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Crear primera tarea */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-all duration-300"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Crear Mi Primera Tarea
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comienza agregando una tarea simple a tu lista. Puedes elegir entre las tareas predefinidas o crear una personalizada.
            </p>
            <button
              onClick={onAddFirstTask}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Tarea</span>
            </button>
          </div>
        </motion.div>

        {/* Asistente IA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-all duration-300"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Checklist Inteligente
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Nuestro asistente de IA te ayudará a crear una checklist personalizada basada en tu rutina diaria y preferencias.
            </p>
            <button
              onClick={onOpenAIAssistant}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generar con IA</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Sugerencias de secciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Sugerencias de Secciones para tu Checklist
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sección Hogar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Hogar</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Limpieza, organización y mantenimiento del hogar
            </p>
          </div>

          {/* Sección Productividad */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Productividad</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tareas laborales, proyectos y objetivos personales
            </p>
          </div>

          {/* Sección Bienestar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Bienestar</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ejercicio, salud mental y autocuidado
            </p>
          </div>

          {/* Sección Rutina Matutina */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Rutina Matutina</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Actividades para comenzar el día con energía
            </p>
          </div>

          {/* Sección Rutina Nocturna */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Rutina Nocturna</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Preparación para un descanso reparador
            </p>
          </div>

          {/* Sección Personalizada */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Personalizada</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Crea tu propia sección con la ayuda de la IA
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Estas son solo algunas sugerencias. Nuestro asistente de IA puede crear secciones completamente personalizadas basadas en tu estilo de vida.
          </p>
          <button
            onClick={onOpenAIAssistant}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            <Sparkles className="w-5 h-5" />
            <span>Crear Checklist Personalizada</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
} 