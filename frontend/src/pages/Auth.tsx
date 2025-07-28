import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import { PublicLayout } from '../components/layout/Layout'
import { Shield, UserPlus, Sparkles, Home, Brain, Zap } from 'lucide-react'

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [isLogin, setIsLogin] = useState(true)

  // Detectar modo desde URL params
  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'register') {
      setIsLogin(false)
    }
  }, [searchParams])

  const handleSwitchToRegister = () => {
    setIsLogin(false)
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-zen-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-zen-50/50" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-zen-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

        <div className="relative flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left side - Auth Card */}
            <motion.div 
              className="w-full max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Card principal */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Header del card */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-10 text-center relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-primary-600/20" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
                  
                  <div className="relative z-10">
                    <motion.div
                      className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
                    >
                      {isLogin ? (
                        <Shield className="w-10 h-10 text-white" />
                      ) : (
                        <UserPlus className="w-10 h-10 text-white" />
                      )}
                    </motion.div>
                    <motion.h1 
                      className="text-3xl sm:text-4xl font-bold text-white mb-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      {isLogin ? 'Bienvenido de vuelta' : 'Únete a HogarZen'}
                    </motion.h1>
                    <motion.p 
                      className="text-primary-100 text-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      {isLogin 
                        ? 'Accede a tu hogar inteligente' 
                        : 'Comienza tu viaje hacia un hogar más inteligente'
                      }
                    </motion.p>
                  </div>
                </div>

                {/* Contenido del formulario */}
                <div className="px-8 py-10">
                  <AnimatePresence mode="wait">
                    {isLogin ? (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                      >
                        <LoginForm 
                          onSwitchToRegister={handleSwitchToRegister}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="register"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                      >
                        <RegisterForm 
                          onSwitchToLogin={handleSwitchToLogin}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Right side - Features showcase */}
            <motion.div 
              className="hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-6">
                    <Home className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Tu hogar,{' '}
                    <span className="bg-gradient-to-r from-primary-600 to-zen-600 bg-clip-text text-transparent">
                      más inteligente
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    HogarZen te ayuda a mantener tu hogar seguro y organizado con tecnología inteligente
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 max-w-md mx-auto lg:mx-0">
                  {[
                    {
                      icon: Brain,
                      title: "IA Personalizada",
                      description: "Sugerencias inteligentes basadas en tus patrones",
                      color: "from-purple-500 to-indigo-600"
                    },
                    {
                      icon: Zap,
                      title: "Automatización",
                      description: "Checklist automático que se adapta a tu rutina",
                      color: "from-orange-500 to-red-600"
                    },
                    {
                      icon: Shield,
                      title: "Seguridad Total",
                      description: "Confirma que todo está en orden antes de salir",
                      color: "from-green-500 to-emerald-600"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                      className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default Auth 