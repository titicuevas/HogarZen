// =====================================================
// INTERFACE SEGREGATION PRINCIPLE - NOTIFICATION SERVICE
// =====================================================

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: Date
  read: boolean
}

export interface NotificationOptions {
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Interfaz para operaciones básicas de notificaciones
 */
export interface INotificationService {
  show(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>, options?: NotificationOptions): string
  hide(id: string): void
  clear(): void
  getNotifications(): Notification[]
  markAsRead(id: string): void
  markAllAsRead(): void
}

/**
 * Interfaz para operaciones de notificaciones específicas
 */
export interface INotificationManager {
  showSuccess(message: string, title?: string, options?: NotificationOptions): string
  showError(message: string, title?: string, options?: NotificationOptions): string
  showWarning(message: string, title?: string, options?: NotificationOptions): string
  showInfo(message: string, title?: string, options?: NotificationOptions): string
}

/**
 * Interfaz para operaciones de persistencia de notificaciones
 */
export interface INotificationStorage {
  saveNotifications(notifications: Notification[]): void
  loadNotifications(): Notification[]
  clearStorage(): void
  markAsRead(id: string): void
}

/**
 * Interfaz para operaciones de notificaciones del sistema
 */
export interface ISystemNotification {
  requestPermission(): Promise<boolean>
  showSystemNotification(title: string, options?: NotificationOptions): void
  isSupported(): boolean
} 