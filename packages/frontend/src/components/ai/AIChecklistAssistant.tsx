import React, { useState } from 'react'
import { Sparkles, Send, Loader2, X, CheckCircle, Plus, Brain, Target, Clock, Home, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { showNotification } from '../../utils/notifications'
import { geminiService } from '../../services/geminiService'

// =====================================================
// COMPONENTE ASISTENTE DE IA PARA CHECKLISTS
// =====================================================

interface AIChecklistAssistantProps {
  isOpen: boolean
  onClose: () => void
  onGenerateTasks: (tasks: GeneratedTask[]) => void
}

interface GeneratedTask {
  title: string
  description: string
  category: string
  priority: 'alta' | 'media' | 'baja'
  estimatedTime?: string
}

interface ChecklistSection {
  name: string
  description: string
  icon: React.ReactNode
  color: string
}

export const AIChecklistAssistant: React.FC<AIChecklistAssistantProps> = ({
  isOpen,
  onClose,
  onGenerateTasks
}) => {
  const [userInput, setUserInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([])
  const [selectedSections, setSelectedSections] = useState<string[]>([])

  // Secciones estándar disponibles
  const standardSections: ChecklistSection[] = [
    {
      name: 'Rutina Matutina',
      description: 'Actividades para comenzar el día con energía',
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
    },
    {
      name: 'Limpieza del Hogar',
      description: 'Tareas de limpieza y organización',
      icon: <Home className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      name: 'Productividad',
      description: 'Tareas laborales y proyectos personales',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      name: 'Bienestar',
      description: 'Ejercicio, salud mental y autocuidado',
      icon: <Award className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    },
    {
      name: 'Rutina Nocturna',
      description: 'Preparación para un descanso reparador',
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
    }
  ]

  // Ejemplos de prompts para el usuario
  const promptExamples = [
    "Soy una persona que trabaja desde casa y necesito organizar mi día entre trabajo y tareas domésticas",
    "Tengo una familia con niños pequeños y necesito una rutina que incluya tareas para todos",
    "Soy estudiante y quiero balancear mis estudios con el cuidado del hogar",
    "Trabajo fuera de casa y necesito optimizar mi tiempo en las mañanas y noches",
    "Soy una persona mayor y necesito una rutina que me ayude a mantener mi hogar organizado"
  ]

  const handleSectionToggle = (sectionName: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    )
  }

  const handleGenerateTasks = async () => {
    if (!userInput.trim() && selectedSections.length === 0) {
      showNotification('warning', 'Por favor, describe tu rutina o selecciona secciones')
      return
    }

    setIsGenerating(true)

    try {
      // Usar el servicio real de Gemini
      const generated = await geminiService.generatePersonalizedChecklist(userInput, selectedSections)
      
      setGeneratedTasks(generated)
      showNotification('success', '¡Checklist generada exitosamente!')
    } catch (error) {
      console.error('Error generando tareas:', error)
      showNotification('error', 'Error al generar la checklist. Usando tareas por defecto.')
      
      // Fallback a tareas por defecto
      const fallbackTasks = generateExampleTasks(userInput, selectedSections)
      setGeneratedTasks(fallbackTasks)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateExampleTasks = (input: string, sections: string[]): GeneratedTask[] => {
    const tasks: GeneratedTask[] = []

    // Tareas basadas en secciones seleccionadas
    if (sections.includes('Rutina Matutina')) {
      tasks.push(
        {
          title: 'Hacer la cama',
          description: 'Comenzar el día con orden y disciplina',
          category: 'hogar',
          priority: 'media'
        },
        {
          title: 'Ejercicio matutino',
          description: '15 minutos de estiramientos o yoga',
          category: 'bienestar',
          priority: 'alta'
        },
        {
          title: 'Preparar desayuno saludable',
          description: 'Incluir proteínas y frutas',
          category: 'bienestar',
          priority: 'alta'
        }
      )
    }

    if (sections.includes('Limpieza del Hogar')) {
      tasks.push(
        {
          title: 'Limpiar la cocina',
          description: 'Lavar platos y limpiar superficies',
          category: 'hogar',
          priority: 'alta'
        },
        {
          title: 'Hacer la colada',
          description: 'Separar ropa por colores y lavar',
          category: 'hogar',
          priority: 'media'
        },
        {
          title: 'Organizar el salón',
          description: 'Recoger objetos y ordenar espacios',
          category: 'hogar',
          priority: 'media'
        }
      )
    }

    if (sections.includes('Productividad')) {
      tasks.push(
        {
          title: 'Revisar agenda del día',
          description: 'Planificar tareas importantes',
          category: 'productividad',
          priority: 'alta'
        },
        {
          title: 'Responder emails urgentes',
          description: 'Priorizar mensajes importantes',
          category: 'productividad',
          priority: 'alta'
        },
        {
          title: 'Trabajar en proyecto principal',
          description: 'Dedicar tiempo a tareas importantes',
          category: 'productividad',
          priority: 'alta'
        }
      )
    }

    if (sections.includes('Bienestar')) {
      tasks.push(
        {
          title: 'Tomar agua',
          description: 'Beber al menos 8 vasos de agua',
          category: 'bienestar',
          priority: 'alta'
        },
        {
          title: 'Pausa para estirar',
          description: 'Hacer pausas activas cada hora',
          category: 'bienestar',
          priority: 'media'
        },
        {
          title: 'Meditar 10 minutos',
          description: 'Práctica de mindfulness',
          category: 'bienestar',
          priority: 'media'
        }
      )
    }

    if (sections.includes('Rutina Nocturna')) {
      tasks.push(
        {
          title: 'Preparar ropa del día siguiente',
          description: 'Organizar outfit para mañana',
          category: 'hogar',
          priority: 'media'
        },
        {
          title: 'Revisar agenda de mañana',
          description: 'Preparar mentalmente el día siguiente',
          category: 'productividad',
          priority: 'media'
        },
        {
          title: 'Rutina de cuidado nocturno',
          description: 'Limpieza facial y preparación para dormir',
          category: 'bienestar',
          priority: 'alta'
        }
      )
    }

    // Si hay input personalizado, agregar tareas específicas
    if (input.toLowerCase().includes('trabajo') || input.toLowerCase().includes('oficina')) {
      tasks.push(
        {
          title: 'Preparar almuerzo',
          description: 'Empacar comida para el trabajo',
          category: 'hogar',
          priority: 'alta'
        },
        {
          title: 'Revisar presentaciones',
          description: 'Preparar materiales para reuniones',
          category: 'productividad',
          priority: 'alta'
        }
      )
    }

    if (input.toLowerCase().includes('niños') || input.toLowerCase().includes('familia')) {
      tasks.push(
        {
          title: 'Preparar mochilas',
          description: 'Organizar materiales escolares',
          category: 'hogar',
          priority: 'alta'
        },
        {
          title: 'Planificar cena familiar',
          description: 'Preparar comida para todos',
          category: 'hogar',
          priority: 'alta'
        }
      )
    }

    return tasks.slice(0, 8) // Limitar a 8 tareas máximo
  }

  const handleApplyTasks = () => {
    onGenerateTasks(generatedTasks)
    onClose()
    setGeneratedTasks([])
    setUserInput('')
    setSelectedSections([])
  }

  const handleClose = () => {
    onClose()
    setGeneratedTasks([])
    setUserInput('')
    setSelectedSections([])
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Asistente de IA
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Genera tu checklist personalizada
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6">
                {/* Secciones estándar */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Secciones Estándar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {standardSections.map((section) => (
                      <div
                        key={section.name}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedSections.includes(section.name)
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                        onClick={() => handleSectionToggle(section.name)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${section.color}`}>
                            {section.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {section.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {section.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input personalizado */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Describe tu Rutina Personalizada
                  </h3>
                  <div className="space-y-4">
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Describe tu día a día, tus responsabilidades, horarios, o cualquier detalle que te ayude a crear una checklist personalizada..."
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl resize-none h-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    
                    {/* Ejemplos de prompts */}
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Ejemplos de descripciones:
                      </p>
                      <div className="space-y-2">
                        {promptExamples.map((example, index) => (
                          <button
                            key={index}
                            onClick={() => setUserInput(example)}
                            className="block w-full text-left p-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón generar */}
                <div className="flex justify-center mb-8">
                  <button
                    onClick={handleGenerateTasks}
                    disabled={isGenerating || (!userInput.trim() && selectedSections.length === 0)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generando...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" />
                        <span>Generar Checklist</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Tareas generadas */}
                {generatedTasks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Tareas Generadas ({generatedTasks.length})
                      </h3>
                      <button
                        onClick={handleApplyTasks}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Aplicar Tareas</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedTasks.map((task, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {task.title}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.priority === 'alta' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              task.priority === 'media' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {task.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {task.category}
                            </span>
                            {task.estimatedTime && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ⏱️ {task.estimatedTime}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 