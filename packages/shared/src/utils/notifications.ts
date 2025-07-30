import Swal from 'sweetalert2'

// =====================================================
// UTILIDADES DE NOTIFICACIONES - DRY PRINCIPLE
// =====================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'question'

interface NotificationOptions {
  title?: string
  text?: string
  confirmButtonText?: string
  cancelButtonText?: string
}

export class NotificationUtils {
  private static readonly CONFIRM_BUTTON_COLOR = '#0ea5e9'

  /**
   * Muestra una notificación de éxito
   */
  static success(title: string, text?: string) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: this.CONFIRM_BUTTON_COLOR
    })
  }

  /**
   * Muestra una notificación de error
   */
  static error(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: this.CONFIRM_BUTTON_COLOR
    })
  }

  /**
   * Muestra una notificación de advertencia
   */
  static warning(title: string, text?: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: this.CONFIRM_BUTTON_COLOR
    })
  }

  /**
   * Muestra una notificación informativa
   */
  static info(title: string, text?: string) {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonColor: this.CONFIRM_BUTTON_COLOR
    })
  }

  /**
   * Muestra una notificación de confirmación
   */
  static confirm(title: string, text?: string) {
    return Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: this.CONFIRM_BUTTON_COLOR,
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    })
  }

  /**
   * Muestra una notificación con opciones personalizadas
   */
  static question(title: string, options?: NotificationOptions) {
    return Swal.fire({
      icon: 'question',
      title,
      text: options?.text,
      showCancelButton: true,
      confirmButtonColor: this.CONFIRM_BUTTON_COLOR,
      cancelButtonColor: '#6b7280',
      confirmButtonText: options?.confirmButtonText || 'Sí',
      cancelButtonText: options?.cancelButtonText || 'Cancelar'
    })
  }

  /**
   * Muestra una notificación de carga
   */
  static loading(title: string = 'Cargando...') {
    return Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }

  /**
   * Cierra la notificación actual
   */
  static close() {
    Swal.close()
  }

  /**
   * Muestra notificación de login exitoso
   */
  static loginSuccess() {
    return this.success(
      '¡Bienvenido de vuelta!',
      'Has iniciado sesión correctamente'
    )
  }

  /**
   * Muestra notificación de registro exitoso
   */
  static registerSuccess() {
    return this.success(
      '¡Cuenta creada exitosamente!',
      'Bienvenido a HogarZen'
    )
  }

  /**
   * Muestra notificación de registro con confirmación de email
   */
  static registerWithEmailConfirmation() {
    return this.info(
      '¡Cuenta creada exitosamente!',
      'Por favor, revisa tu email y confirma tu cuenta antes de iniciar sesión.'
    )
  }

  /**
   * Muestra notificación de logout exitoso
   */
  static logoutSuccess() {
    return this.success(
      'Sesión cerrada',
      'Has cerrado sesión correctamente'
    )
  }

  /**
   * Muestra notificación de tarea completada
   */
  static taskCompleted() {
    return this.success(
      '¡Tarea completada!',
      'Has marcado la tarea como completada'
    )
  }

  /**
   * Muestra notificación de error de autenticación
   */
  static authError(errorMessage: string) {
    return this.error(
      'Error de autenticación',
      errorMessage
    )
  }

  /**
   * Muestra notificación de campos requeridos
   */
  static requiredFields() {
    return this.warning(
      'Campos requeridos',
      'Por favor, completa todos los campos'
    )
  }

  /**
   * Muestra notificación de validación de contraseña
   */
  static passwordValidationError() {
    return this.warning(
      'Contraseña débil',
      'La contraseña debe tener al menos 6 caracteres'
    )
  }

  /**
   * Muestra notificación de contraseñas que no coinciden
   */
  static passwordMismatch() {
    return this.error(
      'Contraseñas no coinciden',
      'Las contraseñas deben ser iguales'
    )
  }

  /**
   * Muestra notificación de email inválido
   */
  static invalidEmail() {
    return this.warning(
      'Email inválido',
      'Por favor, introduce un email válido'
    )
  }
}

// =====================================================
// FUNCIÓN HELPER PARA NOTIFICACIONES SIMPLES
// =====================================================

/**
 * Función helper para mostrar notificaciones simples
 */
export const showNotification = async (
  type: NotificationType, 
  message: string | NotificationOptions
): Promise<boolean> => {
  try {
    if (typeof message === 'string') {
      switch (type) {
        case 'success':
          await NotificationUtils.success(message)
          return true
        case 'error':
          await NotificationUtils.error(message)
          return false
        case 'warning':
          await NotificationUtils.warning(message)
          return true
        case 'info':
          await NotificationUtils.info(message)
          return true
        case 'question':
          const result = await NotificationUtils.question(message)
          return result.isConfirmed
        default:
          await NotificationUtils.info(message)
          return true
      }
    } else {
      // Para notificaciones con opciones (como confirmaciones)
      const result = await NotificationUtils.question(message.title || '', message)
      return result.isConfirmed
    }
  } catch (error) {
    console.error('Error al mostrar notificación:', error)
    return false
  }
} 