import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AuthHeader } from './AuthHeader'
import { AuthFooter } from './AuthFooter'
import CookieBanner from '../common/CookieBanner'
import { Shield, Zap, Users, Star } from 'lucide-react'

// =====================================================
// LAYOUT MEJORADO PARA PÁGINAS DE AUTENTICACIÓN
// =====================================================

interface EnhancedAuthLayoutProps {
  children: ReactNode
  type: 'login' | 'register'
  showBackButton?: boolean
  backTo?: string
}

export const EnhancedAuthLayout: React.FC<EnhancedAuthLayoutProps> = ({
  children,
  type,
  showBackButton = false,
  backTo = '/'
}) => {
  const features = [
    {
      icon: Shield,
      title: '100% Seguro',
      description: 'Tus datos están protegidos con encriptación de nivel bancario'
    },
    {
      icon: Zap,
      title: 'Fácil de Usar',
      description: 'Interfaz intuitiva diseñada para toda la familia'
    },
    {
      icon: Users,
      title: 'Colaborativo',
      description: 'Comparte tareas con todos los miembros del hogar'
    },
    {
      icon: Star,
      title: 'Inteligente',
      description: 'Recomendaciones personalizadas con IA'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-zen-50 flex flex-col">
      {/* Header específico para auth */}
      <AuthHeader showBackButton={showBackButton} backTo={backTo} />
      
      {/* Contenido principal */}
      <main className="flex-1 flex">
        {/* Panel izquierdo - Información */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-700 text-white p-8">
          <div className="max-w-md mx-auto flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-6">
                {type === 'login' ? '¡Bienvenido de vuelta!' : 'Únete a HogarZen'}
              </h1>
              
              <p className="text-xl mb-8 text-primary-100">
                {type === 'login' 
                  ? 'Continúa gestionando tu hogar de manera inteligente y organizada.'
                  : 'Comienza a transformar la gestión de tu hogar con nuestra plataforma inteligente.'
                }
              </p>

              {/* Características */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">¿Por qué elegir HogarZen?</h2>
                <div className="grid grid-cols-1 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                        <p className="text-primary-100">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Testimonios */}
              <div className="mt-12 p-6 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-300" />
                  ))}
                </div>
                <p className="text-primary-100 italic">
                  "HogarZen ha transformado completamente la forma en que organizamos las tareas del hogar. ¡Es increíble!"
                </p>
                <p className="text-sm text-primary-200 mt-2">- María G., Usuaria desde 2023</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Panel derecho - Formulario */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md"
          >
            {/* Información adicional para móviles */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {type === 'login' ? 'Inicia Sesión' : 'Crea tu Cuenta'}
              </h2>
              <p className="text-gray-600">
                {type === 'login' 
                  ? 'Accede a tu panel de control personalizado'
                  : 'Únete a miles de familias que ya confían en HogarZen'
                }
              </p>
            </div>

            {/* Formulario */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {children}
            </div>

            {/* Información adicional debajo del formulario */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>SSL Seguro</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>Rápido</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Colaborativo</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      {/* Footer específico para auth */}
      <AuthFooter />
      
      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  )
}

export default EnhancedAuthLayout 