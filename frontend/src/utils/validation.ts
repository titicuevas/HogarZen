// =====================================================
// UTILIDADES DE VALIDACIÓN - DRY PRINCIPLE
// =====================================================

export class ValidationUtils {
  /**
   * Valida formato de email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Valida contraseña (mínimo 6 caracteres)
   */
  static isValidPassword(password: string): boolean {
    return password.length >= 6
  }

  /**
   * Valida que las contraseñas coincidan
   */
  static doPasswordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword
  }

  /**
   * Valida que un campo no esté vacío
   */
  static isNotEmpty(value: string): boolean {
    return value.trim().length > 0
  }

  /**
   * Valida longitud mínima
   */
  static hasMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength
  }

  /**
   * Valida longitud máxima
   */
  static hasMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength
  }

  /**
   * Valida que sea un nombre de usuario válido (letras, números, guiones y guiones bajos)
   */
  static isValidName(name: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_-]+$/
    return usernameRegex.test(name) && name.trim().length >= 3 && name.trim().length <= 20
  }

  /**
   * Obtiene mensaje de error para validación de email
   */
  static getEmailError(email: string): string | null {
    if (!this.isNotEmpty(email)) {
      return 'El email es requerido'
    }
    if (!this.isValidEmail(email)) {
      return 'Formato de email inválido'
    }
    return null
  }

  /**
   * Obtiene mensaje de error para validación de contraseña
   */
  static getPasswordError(password: string): string | null {
    if (!this.isNotEmpty(password)) {
      return 'La contraseña es requerida'
    }
    if (!this.isValidPassword(password)) {
      return 'La contraseña debe tener al menos 6 caracteres'
    }
    return null
  }

  /**
   * Obtiene mensaje de error para validación de confirmación de contraseña
   */
  static getConfirmPasswordError(password: string, confirmPassword: string): string | null {
    if (!this.isNotEmpty(confirmPassword)) {
      return 'Confirma tu contraseña'
    }
    if (!this.doPasswordsMatch(password, confirmPassword)) {
      return 'Las contraseñas no coinciden'
    }
    return null
  }

  /**
   * Obtiene mensaje de error para validación de nombre de usuario
   */
  static getNameError(name: string): string | null {
    if (!this.isNotEmpty(name)) {
      return 'El nombre de usuario es requerido'
    }
    if (!this.isValidName(name)) {
      return 'El nombre de usuario debe tener entre 3 y 20 caracteres y solo puede contener letras, números, guiones (-) y guiones bajos (_)'
    }
    return null
  }

  /**
   * Valida formulario de login completo
   */
  static validateLoginForm(email: string, password: string): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    const emailError = this.getEmailError(email)
    if (emailError) errors.email = emailError

    const passwordError = this.getPasswordError(password)
    if (passwordError) errors.password = passwordError

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * Valida formulario de registro completo
   */
  static validateRegisterForm(name: string, email: string, password: string, confirmPassword: string): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    const nameError = this.getNameError(name)
    if (nameError) errors.name = nameError

    const emailError = this.getEmailError(email)
    if (emailError) errors.email = emailError

    const passwordError = this.getPasswordError(password)
    if (passwordError) errors.password = passwordError

    const confirmPasswordError = this.getConfirmPasswordError(password, confirmPassword)
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
} 