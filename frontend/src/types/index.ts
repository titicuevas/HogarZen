// =====================================================
// TIPOS Y INTERFACES CENTRALIZADOS PARA HOGARZEN
// =====================================================

// =====================================================
// TIPOS DE AUTENTICACIÓN
// =====================================================
export interface User {
  id: string
  name: string
  email: string
  zone: string
  settings: UserSettings
  created_at: string
  updated_at: string
}

export interface UserSettings {
  theme?: 'light' | 'dark'
  notifications?: boolean
  demo_mode?: boolean
}

export interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

// =====================================================
// TIPOS DE TAREAS
// =====================================================
export interface Task {
  id: string
  title: string
  description: string
  category: TaskCategory
  default_status: boolean
  icon: string
  created_at: string
}

export interface UserTask {
  id: string
  user_id: string
  task_id: string
  date: string
  status: boolean
  completed_at: string | null
  created_at: string
  task?: Task // Relación con la tarea
}

export type TaskCategory = 
  | 'seguridad'
  | 'electrodomesticos'
  | 'agua'
  | 'energia'
  | 'cocina'
  | 'entretenimiento'
  | 'general'

// =====================================================
// TIPOS DE RECOMENDACIONES
// =====================================================
export interface Recommendation {
  id: string
  user_id: string
  text: string
  type: 'general' | 'pattern' | 'weather' | 'reminder'
  date_generated: string
  is_read: boolean
  created_at: string
}

// =====================================================
// TIPOS DE FORMULARIOS
// =====================================================
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

// =====================================================
// TIPOS DE API RESPONSES
// =====================================================
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface AuthResponse {
  success: boolean
  user?: User | null
  message?: string
  error?: string
}

// =====================================================
// TIPOS DE CONFIGURACIÓN
// =====================================================
export interface AppConfig {
  supabase: {
    url: string
    anonKey: string
  }
  gemini?: {
    projectId: string
    apiKey: string
  }
}

// =====================================================
// TIPOS DE EVENTOS
// =====================================================
export interface TaskCompletedEvent {
  taskId: string
  userId: string
  date: string
  completedAt: string
}

export interface UserActionEvent {
  type: 'login' | 'register' | 'logout' | 'task_complete' | 'task_create'
  userId?: string
  data?: any
  timestamp: string
}

// =====================================================
// TIPOS DE CHECKLISTS
// =====================================================
export interface Checklist {
  id: string
  user_id: string
  title: string
  description: string
  category: ChecklistCategory
  items: ChecklistItem[]
  created_at: string
  updated_at: string
}

export interface ChecklistItem {
  id: string
  checklist_id: string
  title: string
  description?: string
  order: number
  is_completed: boolean
  completed_at?: string
  created_at: string
}

export type ChecklistCategory = 
  | 'hogar'
  | 'trabajo'
  | 'viaje'
  | 'evento'
  | 'mantenimiento'
  | 'limpieza'
  | 'organizacion'
  | 'personal'
  | 'otro'

export interface ChecklistTemplate {
  id: string
  title: string
  description: string
  category: ChecklistCategory
  items: Omit<ChecklistItem, 'id' | 'checklist_id' | 'is_completed' | 'completed_at' | 'created_at'>[]
}

export interface AIChecklistRequest {
  description: string
  category?: ChecklistCategory
  complexity?: 'simple' | 'moderado' | 'complejo'
}

export interface AIChecklistResponse {
  success: boolean
  checklist?: ChecklistTemplate
  error?: string
} 