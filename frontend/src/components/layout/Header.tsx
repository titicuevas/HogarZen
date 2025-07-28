import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { ThemeToggle } from '../ui/ThemeToggle'

// =====================================================
// COMPONENTE HEADER RESPONSIVE
// =====================================================
export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)

  // =====================================================
  // EFECTOS
  // =====================================================
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // =====================================================
  // MANEJADORES
  // =====================================================
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Error en logout:', error)
    }
  }

  // =====================================================
  // RENDERIZADO
  // =====================================================
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
        : 'bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                HogarZen
              </span>
            </Link>
          </motion.div>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Botón de cambio de tema */}
            <ThemeToggle variant="minimal" size="sm" />
            
            {isAuthenticated ? (
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              <AuthButtons />
            )}


          </div>
        </div>


      </div>
    </header>
  )
}



// =====================================================
// COMPONENTE MENÚ DE USUARIO RESPONSIVE
// =====================================================
interface UserMenuProps {
  user: any
  onLogout: () => void
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.user-menu')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative user-menu">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-md">
          <span className="text-white font-medium text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <span className="hidden sm:block text-gray-700 font-medium">{user?.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Información del usuario */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            {/* Opciones del menú */}
            <div className="py-1">
              <Link
                to="/profile"
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Perfil</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4" />
                <span>Configuración</span>
              </Link>
            </div>

            {/* Separador */}
            <div className="border-t border-gray-100 my-1" />

            {/* Cerrar sesión */}
            <button
              onClick={() => {
                onLogout()
                setIsOpen(false)
              }}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// =====================================================
// COMPONENTE BOTONES DE AUTENTICACIÓN RESPONSIVE
// =====================================================
const AuthButtons: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      <Link
        to="/login"
        className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50"
      >
        Iniciar sesión
      </Link>
      <Link
        to="/registro"
        className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Registrarse
      </Link>
    </div>
  )
} 