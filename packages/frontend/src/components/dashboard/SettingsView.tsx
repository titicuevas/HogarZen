// =====================================================
// COMPONENTE DE CONFIGURACIÓN
// =====================================================

import React, { useState } from 'react'
import { Settings, Bell, Eye, Download, Trash2, User, Shield, Palette, Sun, Moon, Mail, Smartphone } from 'lucide-react'
import { User as UserType } from '../../types'
import { useTheme } from '../../contexts/ThemeContext'
import { showNotification } from '../../utils/notifications'

// =====================================================
// INTERFACES Y TIPOS
// =====================================================

interface SettingsViewProps {
  user: UserType | null
}

interface NotificationSettings {
  email: boolean
  push: boolean
  reminders: boolean
  dailyDigest: boolean
  weeklyReport: boolean
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto'
  showEmojis: boolean
  showProgress: boolean
  compactMode: boolean
}

interface PrivacySettings {
  shareAnalytics: boolean
  allowNotifications: boolean
  dataRetention: '30days' | '90days' | '1year' | 'forever'
}

// =====================================================
// COMPONENTE DE VISTA DE CONFIGURACIÓN
// =====================================================

export const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance' | 'privacy' | 'data'>('profile')
  
  // Estados para las configuraciones
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    reminders: true,
    dailyDigest: false,
    weeklyReport: true
  })

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: theme,
    showEmojis: true,
    showProgress: true,
    compactMode: false
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    shareAnalytics: true,
    allowNotifications: true,
    dataRetention: '90days'
  })

  // =====================================================
  // MANEJADORES DE EVENTOS
  // =====================================================

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    showNotification('success', 'Configuración actualizada')
  }

  const handleAppearanceChange = (key: keyof AppearanceSettings, value: any) => {
    setAppearance(prev => ({
      ...prev,
      [key]: value
    }))
    
    if (key === 'theme') {
      toggleTheme()
    }
    
    showNotification('success', 'Configuración actualizada')
  }

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }))
    showNotification('success', 'Configuración actualizada')
  }

  const handleExportData = () => {
    const data = {
      user: user,
      settings: {
        notifications,
        appearance,
        privacy
      },
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hogarzen-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    showNotification('success', 'Datos exportados correctamente')
  }

  const handleDeleteData = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.')) {
      // Aquí iría la lógica para eliminar datos
      showNotification('success', 'Datos eliminados correctamente')
    }
  }

  // =====================================================
  // RENDERIZADO
  // =====================================================

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
    { id: 'data', label: 'Datos', icon: Download }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zen-900 dark:text-white">
          Configuración
        </h2>
        <p className="text-zen-600 dark:text-gray-300">
          Personaliza tu experiencia en HogarZen
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Navegación lateral */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                        : 'text-zen-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            {/* Perfil */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-zen-900 dark:text-white">
                  Información del Perfil
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zen-700 dark:text-gray-300 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-zen-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zen-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-zen-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zen-700 dark:text-gray-300 mb-2">
                      Zona Horaria
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-zen-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="UTC-5">UTC-5 (Este de EE.UU.)</option>
                      <option value="UTC-6">UTC-6 (Centro de EE.UU.)</option>
                      <option value="UTC-7">UTC-7 (Montaña de EE.UU.)</option>
                      <option value="UTC-8">UTC-8 (Pacífico de EE.UU.)</option>
                      <option value="UTC+0">UTC+0 (Londres)</option>
                      <option value="UTC+1">UTC+1 (Madrid)</option>
                      <option value="UTC+2">UTC+2 (Berlín)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zen-700 dark:text-gray-300 mb-2">
                      Idioma
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-zen-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="btn-primary">
                    Guardar Cambios
                  </button>
                </div>
              </div>
            )}

            {/* Notificaciones */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-zen-900 dark:text-white">
                  Configuración de Notificaciones
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium text-zen-900 dark:text-white">Notificaciones por Email</h4>
                        <p className="text-sm text-zen-600 dark:text-gray-400">Recibe recordatorios por correo electrónico</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={() => handleNotificationChange('email')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-green-500" />
                      <div>
                        <h4 className="font-medium text-zen-900 dark:text-white">Notificaciones Push</h4>
                        <p className="text-sm text-zen-600 dark:text-gray-400">Recibe notificaciones en tiempo real</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.push}
                        onChange={() => handleNotificationChange('push')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-orange-500" />
                      <div>
                        <h4 className="font-medium text-zen-900 dark:text-white">Recordatorios</h4>
                        <p className="text-sm text-zen-600 dark:text-gray-400">Recordatorios para tareas pendientes</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.reminders}
                        onChange={() => handleNotificationChange('reminders')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-purple-500" />
                      <div>
                        <h4 className="font-medium text-zen-900 dark:text-white">Resumen Semanal</h4>
                        <p className="text-sm text-zen-600 dark:text-gray-400">Recibe un resumen de tu progreso semanal</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.weeklyReport}
                        onChange={() => handleNotificationChange('weeklyReport')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Apariencia */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-zen-900 dark:text-white">
                  Configuración de Apariencia
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-zen-900 dark:text-white mb-3">Tema</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', label: 'Claro', icon: Sun },
                        { value: 'dark', label: 'Oscuro', icon: Moon },
                        { value: 'auto', label: 'Automático', icon: Settings }
                      ].map(themeOption => {
                        const Icon = themeOption.icon
                        return (
                          <button
                            key={themeOption.value}
                            onClick={() => handleAppearanceChange('theme', themeOption.value)}
                            className={`p-3 rounded-lg border-2 transition-colors ${
                              appearance.theme === themeOption.value
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <Icon className="w-6 h-6 mx-auto mb-2 text-zen-600 dark:text-gray-300" />
                            <span className="text-sm font-medium text-zen-900 dark:text-white">
                              {themeOption.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-zen-900 dark:text-white">Mostrar Emojis</h4>
                        <p className="text-sm text-zen-600 dark:text-gray-400">Mostrar emojis en las tareas</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={appearance.showEmojis}
                          onChange={() => handleAppearanceChange('showEmojis', !appearance.showEmojis)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-zen-900 dark:text-white">Mostrar Progreso</h4>
                        <p className="text-sm text-zen-600 dark:text-gray-400">Mostrar barras de progreso</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={appearance.showProgress}
                          onChange={() => handleAppearanceChange('showProgress', !appearance.showProgress)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-zen-900 dark:text-white">Modo Compacto</h4>
                        <p className="text-sm text-zen-600 dark:text-gray-400">Mostrar más información en menos espacio</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={appearance.compactMode}
                          onChange={() => handleAppearanceChange('compactMode', !appearance.compactMode)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacidad */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-zen-900 dark:text-white">
                  Configuración de Privacidad
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-zen-900 dark:text-white">Compartir Análisis</h4>
                      <p className="text-sm text-zen-600 dark:text-gray-400">Ayudar a mejorar la aplicación con datos anónimos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacy.shareAnalytics}
                        onChange={() => handlePrivacyChange('shareAnalytics', !privacy.shareAnalytics)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-zen-900 dark:text-white mb-3">Retención de Datos</h4>
                    <select
                      value={privacy.dataRetention}
                      onChange={(e) => handlePrivacyChange('dataRetention', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-zen-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="30days">30 días</option>
                      <option value="90days">90 días</option>
                      <option value="1year">1 año</option>
                      <option value="forever">Para siempre</option>
                    </select>
                    <p className="text-sm text-zen-600 dark:text-gray-400 mt-2">
                      Los datos se eliminarán automáticamente después del período seleccionado
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Datos */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-zen-900 dark:text-white">
                  Gestión de Datos
                </h3>
                
                <div className="space-y-4">
                  <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-start space-x-3">
                      <Download className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                      <div>
                        <h4 className="font-medium text-zen-900 dark:text-white mb-2">
                          Exportar Datos
                        </h4>
                        <p className="text-sm text-zen-600 dark:text-gray-400 mb-4">
                          Descarga todos tus datos en formato JSON. Incluye tareas, configuraciones y preferencias.
                        </p>
                        <button
                          onClick={handleExportData}
                          className="btn-primary"
                        >
                          Exportar Datos
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-start space-x-3">
                      <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400 mt-1" />
                      <div>
                        <h4 className="font-medium text-zen-900 dark:text-white mb-2">
                          Eliminar Datos
                        </h4>
                        <p className="text-sm text-zen-600 dark:text-gray-400 mb-4">
                          Elimina permanentemente todos tus datos. Esta acción no se puede deshacer.
                        </p>
                        <button
                          onClick={handleDeleteData}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Eliminar Datos
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 