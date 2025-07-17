import React, { useState, useEffect } from 'react'
import { testSupabaseConnection } from '../../config/supabase'

// =====================================================
// COMPONENTE VERIFICADOR DE CONFIGURACIÓN
// =====================================================
export const ConfigChecker: React.FC = () => {
  const [configStatus, setConfigStatus] = useState<{
    supabaseUrl: boolean
    supabaseKey: boolean
    connection: boolean
  }>({
    supabaseUrl: false,
    supabaseKey: false,
    connection: false
  })
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    setIsChecking(true)
    
    // Verificar variables de entorno
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    const hasUrl = !!supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co'
    const hasKey = !!supabaseKey && supabaseKey !== 'placeholder-key'
    
    setConfigStatus(prev => ({
      ...prev,
      supabaseUrl: hasUrl,
      supabaseKey: hasKey
    }))

    // Verificar conectividad si las credenciales están configuradas
    if (hasUrl && hasKey) {
      try {
        const isConnected = await testSupabaseConnection()
        setConfigStatus(prev => ({
          ...prev,
          connection: isConnected
        }))
      } catch (error) {
        console.error('Error verificando conectividad:', error)
        setConfigStatus(prev => ({
          ...prev,
          connection: false
        }))
      }
    }
    
    setIsChecking(false)
  }

  const allConfigured = configStatus.supabaseUrl && configStatus.supabaseKey && configStatus.connection

  if (isChecking) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando configuración...</p>
          </div>
        </div>
      </div>
    )
  }

  if (allConfigured) {
    return null // No mostrar nada si todo está bien configurado
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Configuración Requerida
          </h2>
          <p className="text-gray-600">
            Necesitas configurar las variables de entorno para que HogarZen funcione correctamente.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${configStatus.supabaseUrl ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">
              {configStatus.supabaseUrl ? '✅' : '❌'} URL de Supabase
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${configStatus.supabaseKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">
              {configStatus.supabaseKey ? '✅' : '❌'} Clave de Supabase
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${configStatus.connection ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">
              {configStatus.connection ? '✅' : '❌'} Conexión con Supabase
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Pasos para solucionarlo:</h3>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Crea un archivo <code className="bg-gray-200 px-1 rounded">.env.local</code> en la carpeta <code className="bg-gray-200 px-1 rounded">frontend/</code></li>
            <li>Agrega las variables de Supabase (ver <code className="bg-gray-200 px-1 rounded">ENV_SETUP.md</code>)</li>
            <li>Reinicia el servidor de desarrollo</li>
          </ol>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={checkConfiguration}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Verificar de nuevo
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
          >
            Recargar
          </button>
        </div>
      </div>
    </div>
  )
} 