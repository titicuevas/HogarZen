import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { ValidationUtils } from '../../utils/validation'
import { NotificationUtils } from '../../utils/notifications'
import { RegisterFormData } from '../../types'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth()
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const validation = ValidationUtils.validateRegisterForm(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword
    )
    
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
      await register(formData.name, formData.email, formData.password)
      await NotificationUtils.registerSuccess()
    } catch (error) {
      console.error('Error in register form:', error)
      await NotificationUtils.authError('Error inesperado al crear cuenta')
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

  // Validación en tiempo real para la contraseña
  const getPasswordStrength = () => {
    if (!formData.password) return { strength: 0, color: 'gray', text: '' }
    
    let strength = 0
    if (formData.password.length >= 8) strength++
    if (/[a-z]/.test(formData.password)) strength++
    if (/[A-Z]/.test(formData.password)) strength++
    if (/[0-9]/.test(formData.password)) strength++
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++

    if (strength <= 2) return { strength, color: 'red', text: 'Débil' }
    if (strength <= 3) return { strength, color: 'yellow', text: 'Media' }
    if (strength <= 4) return { strength, color: 'blue', text: 'Buena' }
    return { strength, color: 'green', text: 'Excelente' }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre completo
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                hasFieldError('name') 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              placeholder="Tu nombre completo"
              disabled={isLoading}
            />
            {hasFieldError('name') && (
              <motion.p 
                className="mt-1 text-sm text-red-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {getFieldError('name')}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                hasFieldError('email') 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              placeholder="tu@email.com"
              disabled={isLoading}
            />
            {hasFieldError('email') && (
              <motion.p 
                className="mt-1 text-sm text-red-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {getFieldError('email')}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-12 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                hasFieldError('password') 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            {hasFieldError('password') && (
              <motion.p 
                className="mt-1 text-sm text-red-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {getFieldError('password')}
              </motion.p>
            )}
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <motion.div
              className="mt-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.color === 'red' ? 'bg-red-500' :
                      passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                      passwordStrength.color === 'blue' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength.color === 'red' ? 'text-red-600' :
                  passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                  passwordStrength.color === 'blue' ? 'text-blue-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength.text}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <CheckCircle className={`w-3 h-3 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Mínimo 8 caracteres</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className={`w-3 h-3 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Una mayúscula</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className={`w-3 h-3 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Un número</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className={`w-3 h-3 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>Un símbolo</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Confirm Password Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            Confirmar contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-12 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                hasFieldError('confirmPassword') 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            {hasFieldError('confirmPassword') && (
              <motion.p 
                className="mt-1 text-sm text-red-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {getFieldError('confirmPassword')}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creando cuenta...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>Crear cuenta</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </motion.button>
        </motion.div>

        {/* Switch to Login */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
              disabled={isLoading}
            >
              Inicia sesión aquí
            </button>
          </p>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default RegisterForm 