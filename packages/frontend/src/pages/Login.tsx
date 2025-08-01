import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, Shield, Sparkles, Home, Brain, Zap, CheckCircle, Clock, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ValidationUtils } from '../utils/validation'
import { NotificationUtils } from '../utils/notifications'
import { LoginFormData } from '../types'
import { PublicLayout } from '../components/layout/Layout'
import { LoginDiagnostic } from '../components/common/LoginDiagnostic'
import '../styles/login-responsive.css'

const Login: React.FC = () => {
  const { login } = useAuth()
  
  // Scroll al inicio de la página al cargar
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  // PublicRoute ya maneja la redirección automáticamente
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const validation = ValidationUtils.validateLoginForm(formData.email, formData.password)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      NotificationUtils.requiredFields()
      return false
    }
    
    setErrors({})
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
      await NotificationUtils.loginSuccess()
      // La redirección se manejará automáticamente por PublicRoute
    } catch (error) {
      console.error('Error in login form:', error)
      await NotificationUtils.authError('Error inesperado al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldError = (fieldName: string): string => {
    return errors[fieldName] || ''
  }

  const hasFieldError = (fieldName: string): boolean => {
    return !!errors[fieldName]
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-zen-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-zen-50/50 dark:from-gray-900/50" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-zen-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

        <div className="relative flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md mx-auto">
            
            {/* Login Card */}
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-primary-600/20" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
                  <p className="text-primary-100 text-lg">Inicia sesión en tu cuenta</p>
                </div>
              </div>

              {/* Form */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-200 ${
                          hasFieldError('email') ? 'border-red-500 dark:border-red-400' : ''
                        }`}
                        placeholder="tu@email.com"
                        disabled={isLoading}
                      />
                    </div>
                    {getFieldError('email') && (
                      <p className="text-sm text-red-600 dark:text-red-400">{getFieldError('email')}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-12 py-3 border rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-200 ${
                          hasFieldError('password') ? 'border-red-500 dark:border-red-400' : ''
                        }`}
                        placeholder="••••••••"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {getFieldError('password') && (
                      <p className="text-sm text-red-600 dark:text-red-400">{getFieldError('password')}</p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        disabled={isLoading}
                      />
                      <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Recordarme
                      </label>
                    </div>
                    <Link
                      to="/ayuda"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Iniciando sesión...</span>
                      </>
                    ) : (
                      <>
                        <span>Iniciar sesión</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">¿No tienes cuenta?</span>
                    </div>
                  </div>
                </div>

                {/* Register Link */}
                <Link
                  to="/registro"
                  className="w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Crear cuenta nueva</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>

            {/* Login Diagnostic */}
            <LoginDiagnostic />
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default Login 