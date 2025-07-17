import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react'
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="card">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-zen-900 mb-2">Crear Cuenta</h2>
          <p className="text-zen-600">Únete a HogarZen y vive sin ansiedad</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zen-700 mb-2">
              Nombre de usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zen-400 w-5 h-5" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input-field pl-10 ${hasFieldError('name') ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Tu nombre de usuario"
                required
              />
            </div>
            {hasFieldError('name') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zen-700 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zen-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input-field pl-10 ${hasFieldError('email') ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="tu@email.com"
                required
              />
            </div>
            {hasFieldError('email') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zen-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zen-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`input-field pl-10 pr-10 ${hasFieldError('password') ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zen-400 hover:text-zen-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {hasFieldError('password') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zen-700 mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zen-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`input-field pl-10 pr-10 ${hasFieldError('confirmPassword') ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zen-400 hover:text-zen-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {hasFieldError('confirmPassword') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('confirmPassword')}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creando cuenta...</span>
              </>
            ) : (
              <span>Crear Cuenta</span>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 text-center">
          <p className="text-zen-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default RegisterForm 