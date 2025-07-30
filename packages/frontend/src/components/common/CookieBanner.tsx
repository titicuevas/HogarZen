import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie, Shield, Info } from 'lucide-react'
import CookieManager from '../../utils/cookies'

interface CookieBannerProps {
  onAccept?: () => void
  onDecline?: () => void
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Verificar si el usuario ya ha tomado una decisión sobre las cookies
    const cookieConsent = CookieManager.getCookie('hogarzen_cookie_consent')
    
    // Mostrar el banner si no hay consentimiento previo
    if (!cookieConsent) {
      // Pequeño delay para asegurar que el DOM esté listo
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    CookieManager.setCookie('hogarzen_cookie_consent', 'accepted', {
      maxAge: 365 * 24 * 60 * 60, // 1 año
      path: '/',
      sameSite: 'Lax'
    })
    
    setIsVisible(false)
    onAccept?.()
  }

  const handleDecline = () => {
    CookieManager.setCookie('hogarzen_cookie_consent', 'declined', {
      maxAge: 365 * 24 * 60 * 60, // 1 año
      path: '/',
      sameSite: 'Lax'
    })
    
    // Limpiar cookies existentes
    CookieManager.clearAll()
    
    setIsVisible(false)
    onDecline?.()
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-gray-800 border-t-4 border-primary-500 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Cookie className="w-8 h-8 text-primary-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Utilizamos cookies para mejorar tu experiencia
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  HogarZen utiliza cookies esenciales para el funcionamiento de la aplicación y cookies de análisis para mejorar nuestros servicios. 
                  Al continuar navegando, aceptas nuestro uso de cookies.
                </p>

                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Tipos de cookies que utilizamos:
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span><strong>Esenciales:</strong> Necesarias para el funcionamiento básico</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span><strong>Autenticación:</strong> Para mantener tu sesión activa</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Cookie className="w-4 h-4 text-purple-500" />
                        <span><strong>Preferencias:</strong> Para recordar tus configuraciones</span>
                      </li>
                    </ul>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAccept}
                    className="btn-primary px-6 py-2 text-sm"
                  >
                    Aceptar todas las cookies
                  </button>
                  
                  <button
                    onClick={handleDecline}
                    className="btn-secondary px-6 py-2 text-sm"
                  >
                    Rechazar cookies no esenciales
                  </button>
                  
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CookieBanner 