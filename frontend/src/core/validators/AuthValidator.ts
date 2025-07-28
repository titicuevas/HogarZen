// =====================================================
// SINGLE RESPONSIBILITY PRINCIPLE - AUTH VALIDATION
// =====================================================

import { IAuthValidator } from '../interfaces/IAuthService'

/**
 * Validador de autenticación - Responsabilidad única: validar datos de auth
 */
export class AuthValidator implements IAuthValidator {
  
  /**
   * Valida credenciales de usuario
   */
  async validateCredentials(email: string, password: string): Promise<boolean> {
    return this.validateEmail(email) && this.validatePassword(password)
  }

  /**
   * Valida formato de email
   */
  validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  /**
   * Valida contraseña
   */
  validatePassword(password: string): boolean {
    if (!password || typeof password !== 'string') {
      return false
    }

    // Mínimo 6 caracteres
    if (password.length < 6) {
      return false
    }

    // Máximo 128 caracteres
    if (password.length > 128) {
      return false
    }

    return true
  }

  /**
   * Valida nombre de usuario
   */
  validateName(name: string): boolean {
    if (!name || typeof name !== 'string') {
      return false
    }

    const trimmedName = name.trim()
    
    // Mínimo 2 caracteres
    if (trimmedName.length < 2) {
      return false
    }

    // Máximo 50 caracteres
    if (trimmedName.length > 50) {
      return false
    }

    // Solo letras, números, espacios y caracteres especiales básicos
    const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-\.]+$/
    return nameRegex.test(trimmedName)
  }

  /**
   * Obtiene errores de validación de email
   */
  getEmailErrors(email: string): string[] {
    const errors: string[] = []

    if (!email) {
      errors.push('El email es requerido')
    } else if (!this.validateEmail(email)) {
      errors.push('El formato del email no es válido')
    }

    return errors
  }

  /**
   * Obtiene errores de validación de contraseña
   */
  getPasswordErrors(password: string): string[] {
    const errors: string[] = []

    if (!password) {
      errors.push('La contraseña es requerida')
    } else if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres')
    } else if (password.length > 128) {
      errors.push('La contraseña no puede tener más de 128 caracteres')
    }

    return errors
  }

  /**
   * Obtiene errores de validación de nombre
   */
  getNameErrors(name: string): string[] {
    const errors: string[] = []

    if (!name) {
      errors.push('El nombre es requerido')
    } else if (name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres')
    } else if (name.trim().length > 50) {
      errors.push('El nombre no puede tener más de 50 caracteres')
    } else if (!this.validateName(name)) {
      errors.push('El nombre contiene caracteres no válidos')
    }

    return errors
  }

  /**
   * Valida formulario de login completo
   */
  validateLoginForm(email: string, password: string): {
    isValid: boolean
    errors: Record<string, string>
  } {
    const emailErrors = this.getEmailErrors(email)
    const passwordErrors = this.getPasswordErrors(password)

    const errors: Record<string, string> = {}
    
    if (emailErrors.length > 0) {
      errors.email = emailErrors[0]
    }
    
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors[0]
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * Valida formulario de registro completo
   */
  validateRegisterForm(name: string, email: string, password: string): {
    isValid: boolean
    errors: Record<string, string>
  } {
    const nameErrors = this.getNameErrors(name)
    const emailErrors = this.getEmailErrors(email)
    const passwordErrors = this.getPasswordErrors(password)

    const errors: Record<string, string> = {}
    
    if (nameErrors.length > 0) {
      errors.name = nameErrors[0]
    }
    
    if (emailErrors.length > 0) {
      errors.email = emailErrors[0]
    }
    
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors[0]
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}

/**
 * Factory para crear instancias del validador
 */
export class AuthValidatorFactory {
  private static instance: AuthValidator

  static create(): IAuthValidator {
    if (!AuthValidatorFactory.instance) {
      AuthValidatorFactory.instance = new AuthValidator()
    }
    return AuthValidatorFactory.instance
  }
} 