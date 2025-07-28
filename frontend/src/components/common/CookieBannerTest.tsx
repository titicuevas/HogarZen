import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Cookie, RefreshCw, Eye, EyeOff } from 'lucide-react'
import CookieManager from '../../utils/cookies'

// =====================================================
// COMPONENTE DE PRUEBA PARA BANNER DE COOKIES
// =====================================================

const CookieBannerTest: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false)
  const [cookieInfo, setCookieInfo] = useState<any>({})

  const checkCookieStatus = () => {
    const consent = CookieManager.getCookie('hogarzen_cookie_consent')
    const authToken = CookieManager.getCookie('hogarzen_auth_token')
    const userData = CookieManager.getCookie('hogarzen_user_data')
    
    setCookieInfo({
      consent: consent || 'No encontrado',
      authToken: authToken ? 'Presente' : 'No encontrado',
      userData: userData ? 'Presente' : 'No encontrado',
      allCookies: CookieManager.getDebugInfo()
    })
  }

  const clearAllCookies = () => {
    CookieManager.clearAll()
    checkCookieStatus()
  }

  const simulateFirstVisit = () => {
    clearAllCookies()
    window.location.reload()
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Cookie className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Debug Cookies</h3>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600"
          >
            {showDebug ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showDebug ? 'Ocultar' : 'Mostrar'} información</span>
          </button>

          {showDebug && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2 text-xs"
            >
              <div className="bg-gray-50 p-2 rounded">
                <strong>Consentimiento:</strong> {cookieInfo.consent}
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <strong>Token Auth:</strong> {cookieInfo.authToken}
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <strong>Datos Usuario:</strong> {cookieInfo.userData}
              </div>
            </motion.div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={checkCookieStatus}
              className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Verificar</span>
            </button>

            <button
              onClick={clearAllCookies}
              className="flex items-center space-x-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
            >
              <Cookie className="w-3 h-3" />
              <span>Limpiar</span>
            </button>

            <button
              onClick={simulateFirstVisit}
              className="flex items-center space-x-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieBannerTest 