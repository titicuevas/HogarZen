import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Shield, Lock } from 'lucide-react'

// =====================================================
// FOOTER PARA PÁGINAS DE AUTENTICACIÓN
// =====================================================

export const AuthFooter: React.FC = () => {
  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HogarZen</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Tu compañero inteligente para gestionar las tareas del hogar de manera eficiente y organizada.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Lock className="w-4 h-4" />
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Privacidad Garantizada</span>
              </div>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/ayuda"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  to="/demo"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Ver Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terminos"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link
                  to="/privacidad"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © 2024 HogarZen. Todos los derechos reservados.
            </p>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>en España</span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default AuthFooter 