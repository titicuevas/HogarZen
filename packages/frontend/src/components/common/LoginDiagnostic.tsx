import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { environmentManager } from '../../config/environment'
import { testSupabaseConnection, getSupabaseDebugInfo } from '../../config/supabase'

interface DiagnosticResult {
  name: string
  status: 'success' | 'error' | 'warning' | 'loading'
  message: string
  details?: string
}

export const LoginDiagnostic: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostic = async () => {
    setIsRunning(true)
    setResults([])

    const diagnosticResults: DiagnosticResult[] = []

    // 1. Verificar variables de entorno
    try {
      const envInfo = environmentManager.getDebugInfo()
      
      diagnosticResults.push({
        name: 'Variables de Entorno',
        status: envInfo.supabase.urlConfigured && envInfo.supabase.keyConfigured ? 'success' : 'error',
        message: envInfo.supabase.urlConfigured && envInfo.supabase.keyConfigured 
          ? 'Variables de entorno configuradas correctamente' 
          : 'Variables de entorno faltantes',
        details: `URL: ${envInfo.supabase.urlConfigured ? '✅' : '❌'}, Key: ${envInfo.supabase.keyConfigured ? '✅' : '❌'}`
      })
    } catch (error) {
      diagnosticResults.push({
        name: 'Variables de Entorno',
        status: 'error',
        message: 'Error al verificar variables de entorno',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    }

    // 2. Verificar conexión con Supabase
    try {
      const connectionResult = await testSupabaseConnection()
      diagnosticResults.push({
        name: 'Conexión Supabase',
        status: connectionResult ? 'success' : 'error',
        message: connectionResult 
          ? 'Conexión con Supabase exitosa' 
          : 'No se puede conectar con Supabase',
        details: connectionResult 
          ? 'La base de datos responde correctamente' 
          : 'Verifica tu URL y clave de Supabase'
      })
    } catch (error) {
      diagnosticResults.push({
        name: 'Conexión Supabase',
        status: 'error',
        message: 'Error al verificar conexión',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    }

    // 3. Verificar configuración de Supabase
    try {
      const supabaseInfo = getSupabaseDebugInfo()
      diagnosticResults.push({
        name: 'Configuración Supabase',
        status: supabaseInfo.urlConfigured && supabaseInfo.keyConfigured ? 'success' : 'error',
        message: supabaseInfo.urlConfigured && supabaseInfo.keyConfigured 
          ? 'Cliente de Supabase configurado correctamente' 
          : 'Cliente de Supabase mal configurado',
        details: `URL: ${supabaseInfo.urlPreview}`
      })
    } catch (error) {
      diagnosticResults.push({
        name: 'Configuración Supabase',
        status: 'error',
        message: 'Error al verificar configuración',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    }

    // 4. Verificar autenticación habilitada
    try {
      const envConfig = environmentManager.getSupabaseConfig()
      const hasValidCredentials = envConfig.url && envConfig.anonKey && 
                                 envConfig.anonKey !== 'tu_clave_anonima_de_supabase'
      
      diagnosticResults.push({
        name: 'Credenciales de Autenticación',
        status: hasValidCredentials ? 'success' : 'warning',
        message: hasValidCredentials 
          ? 'Credenciales de autenticación válidas' 
          : 'Credenciales de ejemplo detectadas',
        details: hasValidCredentials 
          ? 'Las credenciales parecen ser reales' 
          : 'Reemplaza las credenciales de ejemplo con las reales'
      })
    } catch (error) {
      diagnosticResults.push({
        name: 'Credenciales de Autenticación',
        status: 'error',
        message: 'Error al verificar credenciales',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    }

    // 5. Verificar entorno de desarrollo
    try {
      const appConfig = environmentManager.getAppConfig()
      const isDevelopment = appConfig.environment === 'development'
      
      diagnosticResults.push({
        name: 'Entorno de Desarrollo',
        status: isDevelopment ? 'success' : 'warning',
        message: isDevelopment 
          ? 'Ejecutando en modo desarrollo' 
          : 'Ejecutando en modo producción',
        details: `Entorno: ${appConfig.environment}`
      })
    } catch (error) {
      diagnosticResults.push({
        name: 'Entorno de Desarrollo',
        status: 'error',
        message: 'Error al verificar entorno',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    }

    setResults(diagnosticResults)
    setIsRunning(false)
  }

  useEffect(() => {
    runDiagnostic()
  }, [])

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'loading':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return null
    }
  }

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'loading':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
    }
  }

  return (
    <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Diagnóstico de Login
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {isVisible && (
        <div className="space-y-3">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 border rounded-lg ${getStatusColor(result.status)}`}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {result.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {result.message}
                  </p>
                  {result.details && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {result.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 Soluciones Comunes
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Verifica que tu archivo <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">.env.local</code> tenga las variables correctas</li>
              <li>• Asegúrate de que las credenciales de Supabase sean reales, no de ejemplo</li>
              <li>• Verifica que el usuario exista en tu proyecto de Supabase</li>
              <li>• Comprueba que la autenticación esté habilitada en Supabase</li>
              <li>• Revisa la consola del navegador para errores adicionales</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
} 