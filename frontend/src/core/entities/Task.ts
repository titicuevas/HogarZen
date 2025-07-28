// =====================================================
// DOMAIN ENTITY - TASK
// =====================================================

export interface TaskPriority {
  id: string
  name: string
  color: string
  level: number
}

export interface TaskCategory {
  id: string
  name: string
  color: string
  icon?: string
}

export interface TaskMetadata {
  estimatedTime?: number // en minutos
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
  notes?: string
  attachments?: string[]
}

/**
 * Entidad de dominio para Tarea
 */
export class Task {
  public readonly id: string
  public readonly title: string
  public readonly description?: string
  public readonly completed: boolean
  public readonly priority: TaskPriority
  public readonly category: TaskCategory
  public readonly metadata: TaskMetadata
  public readonly created_at: string
  public readonly updated_at: string
  public readonly completed_at?: string
  public readonly user_id: string
  public readonly order: number

  constructor(data: {
    id: string
    title: string
    description?: string
    completed?: boolean
    priority?: TaskPriority
    category?: TaskCategory
    metadata?: TaskMetadata
    created_at?: string
    updated_at?: string
    completed_at?: string
    user_id: string
    order?: number
  }) {
    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.completed = data.completed || false
    this.priority = data.priority || {
      id: 'normal',
      name: 'Normal',
      color: '#6b7280',
      level: 2
    }
    this.category = data.category || {
      id: 'general',
      name: 'General',
      color: '#3b82f6'
    }
    this.metadata = data.metadata || {}
    this.created_at = data.created_at || new Date().toISOString()
    this.updated_at = data.updated_at || new Date().toISOString()
    this.completed_at = data.completed_at
    this.user_id = data.user_id
    this.order = data.order || 0
  }

  /**
   * Valida si la tarea es válida
   */
  public isValid(): boolean {
    return !!(
      this.id &&
      this.title &&
      this.title.trim().length > 0 &&
      this.user_id
    )
  }

  /**
   * Marca la tarea como completada
   */
  public markAsCompleted(): Task {
    return new Task({
      ...this,
      completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Marca la tarea como pendiente
   */
  public markAsPending(): Task {
    return new Task({
      ...this,
      completed: false,
      completed_at: undefined,
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Cambia el estado de la tarea
   */
  public toggleStatus(): Task {
    return this.completed ? this.markAsPending() : this.markAsCompleted()
  }

  /**
   * Actualiza la tarea
   */
  public update(updates: Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>): Task {
    return new Task({
      ...this,
      ...updates,
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Verifica si la tarea está vencida
   */
  public isOverdue(): boolean {
    if (!this.metadata.estimatedTime) return false
    
    const createdDate = new Date(this.created_at)
    const estimatedEndDate = new Date(createdDate.getTime() + this.metadata.estimatedTime * 60000)
    
    return !this.completed && new Date() > estimatedEndDate
  }

  /**
   * Obtiene el tiempo transcurrido desde la creación
   */
  public getElapsedTime(): number {
    const createdDate = new Date(this.created_at)
    const now = new Date()
    return Math.floor((now.getTime() - createdDate.getTime()) / 60000) // en minutos
  }

  /**
   * Obtiene el tiempo restante estimado
   */
  public getRemainingTime(): number | null {
    if (!this.metadata.estimatedTime) return null
    
    const elapsed = this.getElapsedTime()
    const remaining = this.metadata.estimatedTime - elapsed
    
    return remaining > 0 ? remaining : 0
  }

  /**
   * Verifica si la tarea es de alta prioridad
   */
  public isHighPriority(): boolean {
    return this.priority.level >= 4
  }

  /**
   * Verifica si la tarea es urgente
   */
  public isUrgent(): boolean {
    return this.isHighPriority() && this.isOverdue()
  }

  /**
   * Convierte a objeto plano
   */
  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      priority: this.priority,
      category: this.category,
      metadata: this.metadata,
      created_at: this.created_at,
      updated_at: this.updated_at,
      completed_at: this.completed_at,
      user_id: this.user_id,
      order: this.order
    }
  }

  /**
   * Crea una instancia desde objeto plano
   */
  public static fromJSON(data: any): Task {
    return new Task(data)
  }

  /**
   * Crea una tarea de ejemplo
   */
  public static createSampleTask(userId: string, order: number = 0): Task {
    return new Task({
      id: `task-${Date.now()}`,
      title: 'Tarea de ejemplo',
      description: 'Esta es una tarea de ejemplo para demostrar la funcionalidad',
      user_id: userId,
      order,
      priority: {
        id: 'normal',
        name: 'Normal',
        color: '#6b7280',
        level: 2
      },
      category: {
        id: 'general',
        name: 'General',
        color: '#3b82f6'
      }
    })
  }
} 