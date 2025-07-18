import React, { createContext, useContext, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Notification, { NotificationProps } from '../components/ui/Notification'

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationProps, 'id' | 'onClose'>) => void
  showSuccess: (title: string, message: string, duration?: number) => void
  showError: (title: string, message: string, duration?: number) => void
  showWarning: (title: string, message: string, duration?: number) => void
  showInfo: (title: string, message: string, duration?: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const showNotification = useCallback((notification: Omit<NotificationProps, 'id' | 'onClose'>) => {
    const id = uuidv4()
    const newNotification: NotificationProps = {
      ...notification,
      id,
      onClose: removeNotification
    }
    setNotifications(prev => [...prev, newNotification])
  }, [removeNotification])

  const showSuccess = useCallback((title: string, message: string, duration = 5000) => {
    showNotification({ type: 'success', title, message, duration })
  }, [showNotification])

  const showError = useCallback((title: string, message: string, duration = 7000) => {
    showNotification({ type: 'error', title, message, duration })
  }, [showNotification])

  const showWarning = useCallback((title: string, message: string, duration = 6000) => {
    showNotification({ type: 'warning', title, message, duration })
  }, [showNotification])

  const showInfo = useCallback((title: string, message: string, duration = 5000) => {
    showNotification({ type: 'info', title, message, duration })
  }, [showNotification])

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
} 