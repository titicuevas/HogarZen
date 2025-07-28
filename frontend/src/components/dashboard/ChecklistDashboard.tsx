// =====================================================
// DASHBOARD DE CHECKLISTS CON IA - PRINCIPIOS SOLID
// =====================================================

import React, { useState } from 'react'
import { Plus, LogOut, User, Calendar, RefreshCw, Wand2, CheckCircle, Circle, Trash2, Edit3, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useChecklists } from '../../hooks/useChecklists'
import { Checklist, ChecklistItem, ChecklistTemplate, ChecklistCategory } from '../../types'
import { showNotification } from '../../utils/notifications'
import { useTheme } from '../../contexts/ThemeContext'
import { getChecklistCategoryEmoji } from '../../utils/taskIcons'

// =====================================================
// COMPONENTES AUXILIARES
// =====================================================

interface ChecklistCardProps {
  checklist: Checklist
  onToggleItem: (itemId: string, isCompleted: boolean) => Promise<void>
  onDelete: (checklistId: string) => Promise<void>
  loading: boolean
}

const ChecklistCard: React.FC<ChecklistCardProps> = ({ 
  checklist, 
  onToggleItem, 
  onDelete, 
  loading 
}) => {
  const completedCount = checklist.items.filter(item => item.is_completed).length
  const totalCount = checklist.items.length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const getCategoryIcon = (category: ChecklistCategory) => {
    return getChecklistCategoryEmoji(category) || '📋'
  }

  const getCategoryColor = (category: ChecklistCategory) => {
    const colors = {
      hogar: 'bg-blue-100 text-blue-800',
      trabajo: 'bg-purple-100 text-purple-800',
      viaje: 'bg-green-100 text-green-800',
      evento: 'bg-pink-100 text-pink-800',
      mantenimiento: 'bg-orange-100 text-orange-800',
      limpieza: 'bg-cyan-100 text-cyan-800',
      organizacion: 'bg-indigo-100 text-indigo-800',
      personal: 'bg-yellow-100 text-yellow-800',
      otro: 'bg-gray-100 text-gray-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header del checklist */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryIcon(checklist.category)}</span>
          <div>
            <h3 className="text-lg font-semibold text-zen-900 dark:text-white">{checklist.title}</h3>
            <p className="text-sm text-zen-600 dark:text-gray-300">{checklist.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(checklist.category)}`}>
            {checklist.category}
          </span>
          <button
            onClick={() => onDelete(checklist.id)}
            disabled={loading}
            className="p-1 text-red-500 hover:text-red-700 transition-colors"
            title="Eliminar checklist"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progreso */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-zen-600 dark:text-gray-300 mb-2">
          <span>Progreso</span>
          <span>{completedCount} de {totalCount} completados</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-right text-xs text-zen-500 dark:text-gray-400 mt-1">{percentage}%</div>
      </div>

      {/* Lista de items */}
      <div className="space-y-2">
        {checklist.items
          .sort((a, b) => a.order - b.order)
          .map(item => (
            <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <button
                onClick={() => onToggleItem(item.id, !item.is_completed)}
                disabled={loading}
                className="flex-shrink-0"
              >
                {item.is_completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-primary-500" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className={`text-sm ${item.is_completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-zen-900 dark:text-white'}`}>
                  {item.title}
                </div>
                {item.description && (
                  <div className={`text-xs ${item.is_completed ? 'text-gray-400 dark:text-gray-500' : 'text-zen-600 dark:text-gray-300'}`}>
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

// =====================================================
// MODAL DE GENERACIÓN CON IA
// =====================================================

interface AIGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (request: { description: string; category?: ChecklistCategory; complexity?: 'simple' | 'moderado' | 'complejo' }) => Promise<void>
  generating: boolean
}

const AIGenerationModal: React.FC<AIGenerationModalProps> = ({ 
  isOpen, 
  onClose, 
  onGenerate, 
  generating 
}) => {
  const [description, setDescription] = useState('')
  const [detectedCategory, setDetectedCategory] = useState<ChecklistCategory>('otro')
  const [complexity, setComplexity] = useState<'simple' | 'moderado' | 'complejo'>('moderado')

  // =====================================================
  // DETECCIÓN AUTOMÁTICA DE CATEGORÍA
  // =====================================================

  const detectCategory = (text: string): ChecklistCategory => {
    const lowerText = text.toLowerCase()
    
    // Palabras clave por categoría
    const categoryKeywords = {
      hogar: ['casa', 'hogar', 'habitación', 'sala', 'cocina', 'baño', 'dormitorio', 'jardín', 'terraza', 'balcón'],
      trabajo: ['oficina', 'trabajo', 'proyecto', 'reunión', 'presentación', 'cliente', 'jefe', 'equipo', 'despacho'],
      viaje: ['viaje', 'vacaciones', 'hotel', 'maleta', 'pasaporte', 'vuelo', 'destino', 'turismo', 'excursión'],
      evento: ['fiesta', 'cumpleaños', 'boda', 'celebración', 'evento', 'reunión', 'ceremonia', 'aniversario'],
      mantenimiento: ['reparar', 'arreglar', 'mantener', 'revisar', 'herramientas', 'técnico', 'servicio'],
      limpieza: ['limpiar', 'lavar', 'ordenar', 'organizar', 'aspirar', 'barrer', 'fregar', 'pulir'],
      organizacion: ['organizar', 'clasificar', 'archivar', 'ordenar', 'estructurar', 'planificar'],
      personal: ['ejercicio', 'meditación', 'estudiar', 'leer', 'hobby', 'pasatiempo', 'rutina']
    }

    // Contar coincidencias por categoría
    const scores: Record<ChecklistCategory, number> = {
      hogar: 0, trabajo: 0, viaje: 0, evento: 0, mantenimiento: 0, limpieza: 0, organizacion: 0, personal: 0, otro: 0
    }

    Object.entries(categoryKeywords).forEach(([cat, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          scores[cat as ChecklistCategory] += 1
        }
      })
    })

    // Encontrar la categoría con más coincidencias
    const maxScore = Math.max(...Object.values(scores))
    const detectedCat = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as ChecklistCategory

    return detectedCat || 'otro'
  }

  // =====================================================
  // MANEJADORES DE EVENTOS
  // =====================================================

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setDescription(text)
    
    // Detectar categoría automáticamente
    if (text.trim()) {
      const category = detectCategory(text)
      setDetectedCategory(category)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    await onGenerate({ 
      description: description.trim(), 
      category: detectedCategory, 
      complexity 
    })
    setDescription('')
    setDetectedCategory('otro')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zen-900 dark:text-white">Generar Checklist con IA</h2>
            <p className="text-sm text-zen-600 dark:text-gray-300">Describe lo que necesitas y la IA lo creará automáticamente</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de descripción */}
          <div>
            <label className="block text-sm font-medium text-zen-700 dark:text-gray-300 mb-3">
              ¿Qué checklist necesitas?
            </label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Ej: Checklist para preparar un viaje de fin de semana, organizar mi oficina en casa, limpiar la cocina completamente, preparar una fiesta de cumpleaños..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-zen-900 dark:text-white placeholder-zen-400 dark:placeholder-gray-400"
              rows={4}
              required
            />
          </div>

          {/* Información automática */}
          {description.trim() && (
            <div className="bg-zen-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-medium text-zen-700 dark:text-gray-300">Información detectada automáticamente:</h3>
              
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getChecklistCategoryEmoji(detectedCategory)}</span>
                <div>
                  <div className="text-sm font-medium text-zen-900 dark:text-white">
                    Categoría: {detectedCategory.charAt(0).toUpperCase() + detectedCategory.slice(1)}
                  </div>
                  <div className="text-xs text-zen-600 dark:text-gray-400">
                    Detectada automáticamente según tu descripción
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zen-700 dark:text-gray-300 mb-2">
                Categoría detectada
              </label>
              <div className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getChecklistCategoryEmoji(detectedCategory)}</span>
                  <span className="text-zen-900 dark:text-white font-medium">
                    {detectedCategory.charAt(0).toUpperCase() + detectedCategory.slice(1)}
                  </span>
                </div>
                <div className="text-xs text-zen-600 dark:text-gray-400 mt-1">
                  Detectada automáticamente
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zen-700 dark:text-gray-300 mb-2">
                Nivel de detalle
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'simple', label: 'Simple', desc: '5-8 items' },
                  { value: 'moderado', label: 'Moderado', desc: '8-12 items' },
                  { value: 'complejo', label: 'Complejo', desc: '12+ items' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setComplexity(option.value as 'simple' | 'moderado' | 'complejo')}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      complexity === option.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-zen-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="font-medium text-xs">{option.label}</div>
                    <div className="text-xs opacity-75">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-zen-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={generating || !description.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>✨ Generar Checklist</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export const ChecklistDashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const {
    checklists,
    loading,
    generating,
    error,
    generateChecklistWithAI,
    saveGeneratedChecklist,
    toggleItemCompletion,
    deleteChecklist,
    clearError
  } = useChecklists()

  const [showAIModal, setShowAIModal] = useState(false)
  const [generatedTemplate, setGeneratedTemplate] = useState<ChecklistTemplate | null>(null)
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

  const handleGenerateWithAI = async (request: { 
    description: string; 
    category?: ChecklistCategory; 
    complexity?: 'simple' | 'moderado' | 'complejo' 
  }): Promise<void> => {
    try {
      const template = await generateChecklistWithAI(request)
      if (template) {
        setGeneratedTemplate(template)
        setShowAIModal(false)
        showNotification('success', 'Checklist generado exitosamente')
      }
    } catch (error) {
      showNotification('error', 'Error generando checklist')
    }
  }

  const handleSaveGeneratedChecklist = async (): Promise<void> => {
    if (!generatedTemplate) return

    try {
      const success = await saveGeneratedChecklist(generatedTemplate)
      if (success) {
        setGeneratedTemplate(null)
        showNotification('success', 'Checklist guardado exitosamente')
      }
    } catch (error) {
      showNotification('error', 'Error guardando checklist')
    }
  }

  const handleToggleItem = async (itemId: string, isCompleted: boolean): Promise<void> => {
    try {
      await toggleItemCompletion(itemId, isCompleted)
      
      // Mostrar confeti si se completó el último item
      const checklist = checklists.find(c => c.items.some(item => item.id === itemId))
      if (checklist && isCompleted) {
        const completedCount = checklist.items.filter(item => item.is_completed).length + 1
        if (completedCount === checklist.items.length) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      }
    } catch (error) {
      showNotification('error', 'Error actualizando item')
    }
  }

  const handleDeleteChecklist = async (checklistId: string): Promise<void> => {
    try {
      await deleteChecklist(checklistId)
      showNotification('success', 'Checklist eliminado exitosamente')
    } catch (error) {
      showNotification('error', 'Error eliminando checklist')
    }
  }

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Saludo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zen-900 dark:text-white mb-2">
            {getGreeting()}, {user?.name} 👋
          </h2>
          <p className="text-zen-600 dark:text-gray-300">
            Crea y gestiona tus checklists de manera inteligente con la ayuda de IA.
          </p>
        </div>

        {/* Botón de generación con IA */}
        <div className="mb-8">
          <button
            onClick={() => setShowAIModal(true)}
            disabled={generating}
            className="btn-primary flex items-center space-x-2"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generar Checklist con IA</span>
          </button>
        </div>

        {/* Checklist generado por IA (preview) */}
        {generatedTemplate && (
          <div className="mb-8 p-4 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zen-900">
                Checklist Generado por IA
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setGeneratedTemplate(null)}
                  className="px-3 py-1 text-zen-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Descartar
                </button>
                <button
                  onClick={handleSaveGeneratedChecklist}
                  className="px-3 py-1 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Guardar Checklist
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-zen-900 mb-2">{generatedTemplate.title}</h4>
              <p className="text-sm text-zen-600 mb-3">{generatedTemplate.description}</p>
              <div className="space-y-2">
                {generatedTemplate.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Circle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-zen-900">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lista de checklists */}
        <div className="space-y-6">
          {loading ? (
            // Skeleton loading
            [...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            ))
          ) : checklists.length === 0 ? (
            // Estado vacío
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-zen-900 mb-2">
                No tienes checklists aún
              </h3>
              <p className="text-zen-600 mb-6">
                Crea tu primer checklist usando IA o manualmente.
              </p>
              <button
                onClick={() => setShowAIModal(true)}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Wand2 className="w-4 h-4" />
                <span>Crear Primer Checklist</span>
              </button>
            </div>
          ) : (
            // Lista de checklists
            checklists.map(checklist => (
              <ChecklistCard
                key={checklist.id}
                checklist={checklist}
                onToggleItem={handleToggleItem}
                onDelete={handleDeleteChecklist}
                loading={loading}
              />
            ))
          )}
        </div>
      </main>

      {/* Modal de generación con IA */}
      <AIGenerationModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleGenerateWithAI}
        generating={generating}
      />
    </div>
  )
} 