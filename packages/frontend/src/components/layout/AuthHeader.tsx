import React from 'react'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

// =====================================================
// HEADER PARA PÁGINAS DE AUTENTICACIÓN
// =====================================================

interface AuthHeaderProps {
  showBackButton?: boolean
  backTo?: string
  title?: string
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  showBackButton = false,
  backTo = '/',
  title = 'HogarZen'
}) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          {/* Logo y título centrado */}
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <Link
                to={backTo}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            
            <Link
              to="/"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">{title}</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default AuthHeader 