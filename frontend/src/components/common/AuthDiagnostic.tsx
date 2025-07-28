import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { AuthService } from '../../services/authService'
import { CookieManager } from '../../utils/cookies'

interface AuthDiagnosticProps {
  onClose: () => void
}

const AuthDiagnostic: React.FC<AuthDiagnosticProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [diagnosticResults, setDiagnosticResults] = useState<any>({})
  const [isRunning, setIsRunning] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testPassword, setTestPassword] = useState('')

  useEffect(() => {
    setIsOpen(true)
  }, [])

  const runDiagnostic = async () => {
    setIsRunning(true)
    const results: any = {}

    try {
      // 1. Verificar configuración de Supabase
      console.log('🔍 Iniciando diagnóstico de autenticación...')
      
      const debugInfo = AuthService.getDebugInfo()
      results.config = {
        supabaseUrl: debugInfo.supabaseUrl,
        supabaseKey: debugInfo.supabaseKey,
        environment: debugInfo.environment
      }

      // 2. Probar conexión con Supabase
      const connectionTest = await AuthService.testConnection()
      results.connection = connectionTest

      // 3. Verificar cookies
      const authToken = CookieManager.getAuthToken()
      const userData = CookieManager.getUserData()
      const rememberMe = CookieManager.getRememberMe()

      results.cookies = {
        hasAuthToken: !!authToken,
        hasUserData: !!userData,
        rememberMe: rememberMe,
        authTokenLength: authToken ? authToken.length : 0
      }

      // 4. Probar autenticación si hay credenciales
      if (testEmail && testPassword) {
        const authService = new AuthService()
        const credentialsTest = await authService.verifyCredentials(testEmail, testPassword)
        results.credentials = credentialsTest
      }

      // 5. Verificar sesión actual
      const authService = new AuthService()
      const sessionTest = await authService.validateToken()
      results.session = sessionTest

      setDiagnosticResults(results)
      console.log('✅ Diagnóstico completado:', results)

    } catch (error) {
      console.error('❌ Error en diagnóstico:', error)
      results.error = error
      setDiagnosticResults(results)
    } finally {
      setIsRunning(false)
    }
  }

  const clearAllData = async () => {
    try {
      // Limpiar cookies
      CookieManager.clearAuthToken()
      CookieManager.clearUserData()
      CookieManager.clearRememberMe()

      // Limpiar localStorage
      localStorage.clear()

      // Limpiar sessionStorage
      sessionStorage.clear()

      console.log('✅ Todos los datos locales limpiados')
      alert('✅ Todos los datos locales han sido limpiados. Recarga la página.')
    } catch (error) {
      console.error('❌ Error limpiando datos:', error)
      alert('❌ Error limpiando datos: ' + error)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 300)
  }

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    )
  }

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600'
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">🔍 Diagnóstico de Autenticación</h2>
              <p className="text-primary-100 mt-1">Identifica y soluciona problemas de login</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-primary-100 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Test Credentials */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Credenciales de Prueba
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="demo@demo.es"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showCredentials ? 'text' : 'password'}
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCredentials(!showCredentials)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCredentials ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={runDiagnostic}
              disabled={isRunning}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Ejecutando...</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  <span>Ejecutar Diagnóstico</span>
                </>
              )}
            </button>
            <button
              onClick={clearAllData}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Limpiar Datos
            </button>
          </div>

          {/* Results */}
          {Object.keys(diagnosticResults).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Resultados del Diagnóstico</h3>
              
              {/* Configuration */}
              {diagnosticResults.config && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">⚙️ Configuración</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(diagnosticResults.config.supabaseUrl === 'Configurada')}
                      <span className={getStatusColor(diagnosticResults.config.supabaseUrl === 'Configurada')}>
                        URL de Supabase: {diagnosticResults.config.supabaseUrl}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(diagnosticResults.config.supabaseKey === 'Configurada')}
                      <span className={getStatusColor(diagnosticResults.config.supabaseKey === 'Configurada')}>
                        Clave de Supabase: {diagnosticResults.config.supabaseKey}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      Entorno: {diagnosticResults.config.environment}
                    </div>
                  </div>
                </div>
              )}

              {/* Connection */}
              {diagnosticResults.connection !== undefined && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-semibold text-green-800 mb-2">🌐 Conexión</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(diagnosticResults.connection)}
                    <span className={getStatusColor(diagnosticResults.connection)}>
                      {diagnosticResults.connection ? 'Conexión exitosa con Supabase' : 'Error de conexión con Supabase'}
                    </span>
                  </div>
                </div>
              )}

              {/* Cookies */}
              {diagnosticResults.cookies && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">🍪 Cookies</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(diagnosticResults.cookies.hasAuthToken)}
                      <span className={getStatusColor(diagnosticResults.cookies.hasAuthToken)}>
                        Token de autenticación: {diagnosticResults.cookies.hasAuthToken ? 'Presente' : 'Ausente'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(diagnosticResults.cookies.hasUserData)}
                      <span className={getStatusColor(diagnosticResults.cookies.hasUserData)}>
                        Datos de usuario: {diagnosticResults.cookies.hasUserData ? 'Presentes' : 'Ausentes'}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      Recordar sesión: {diagnosticResults.cookies.rememberMe ? 'Sí' : 'No'}
                    </div>
                    {diagnosticResults.cookies.authTokenLength > 0 && (
                      <div className="text-gray-600">
                        Longitud del token: {diagnosticResults.cookies.authTokenLength} caracteres
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Credentials */}
              {diagnosticResults.credentials !== undefined && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">🔐 Credenciales</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(diagnosticResults.credentials)}
                    <span className={getStatusColor(diagnosticResults.credentials)}>
                      {diagnosticResults.credentials ? 'Credenciales válidas' : 'Credenciales inválidas'}
                    </span>
                  </div>
                </div>
              )}

              {/* Session */}
              {diagnosticResults.session && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <h4 className="font-semibold text-indigo-800 mb-2">🔑 Sesión</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(diagnosticResults.session.success)}
                      <span className={getStatusColor(diagnosticResults.session.success)}>
                        Estado: {diagnosticResults.session.success ? 'Válida' : 'Inválida'}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      Mensaje: {diagnosticResults.session.message}
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {diagnosticResults.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Error</h4>
                  <div className="text-sm text-red-600">
                    {diagnosticResults.error.toString()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendations */}
          {Object.keys(diagnosticResults).length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Recomendaciones</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {!diagnosticResults.connection && (
                  <li>• Verifica que las credenciales de Supabase sean correctas</li>
                )}
                {diagnosticResults.cookies?.hasAuthToken && !diagnosticResults.session?.success && (
                  <li>• El token de autenticación está corrupto. Usa "Limpiar Datos"</li>
                )}
                {diagnosticResults.credentials === false && (
                  <li>• Las credenciales de prueba son incorrectas. Verifica el email y contraseña</li>
                )}
                {diagnosticResults.config?.supabaseUrl !== 'Configurada' && (
                  <li>• Configura las variables de entorno de Supabase</li>
                )}
                <li>• Si el problema persiste, contacta al administrador</li>
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AuthDiagnostic 