import Swal from 'sweetalert2'

// =====================================================
// UTILIDADES DE NOTIFICACIONES - VERSIÓN SIMPLIFICADA
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
    return Swal.close()
  }

  /**
   * Muestra notificación de login exitoso
   */
  static loginSuccess() {
    return Swal.fire({
      icon: 'success',
      title: '¡Bienvenido de vuelta!',
      text: 'Has iniciado sesión exitosamente',
      confirmButtonColor: this.CONFIRM_BUTTON_COLOR,
      timer: 2000,
      timerProgressBar: true
    })
  }

  /**
   * Muestra notificación de registro exitoso
   */
  static registerSuccess() {
    return Swal.fire({
      icon: 'success',
      title: '¡Cuenta creada exitosamente!',
      text: 'Bienvenido a HogarZen',
      confirmButtonColor: this.CONFIRM_BUTTON_COLOR,
      timer: 2000,
      timerProgressBar: true
    })
  }

  /**
   * Muestra notificación de error de autenticación
   */
  static authError(message: string) {
    return Swal.fire({
      icon: 'error',
      title: 'Error de autenticación',
      text: message,
      confirmButtonColor: this.CONFIRM_BUTTON_COLOR
    })
  }

  /**
   * Muestra notificación de campos requeridos
   */
  static requiredFields() {
    return Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Por favor, completa todos los campos obligatorios',
      confirmButtonColor: this.CONFIRM_BUTTON_COLOR
    })
  }
}

// Función helper para mostrar notificaciones
export const showNotification = async (
  type: NotificationType, 
  message: string | NotificationOptions
): Promise<boolean> => {
  if (typeof message === 'string') {
    switch (type) {
      case 'success':
        await NotificationUtils.success(message)
        break
      case 'error':
        await NotificationUtils.error(message)
        break
      case 'warning':
        await NotificationUtils.warning(message)
        break
      case 'info':
        await NotificationUtils.info(message)
        break
      case 'question':
        const result = await NotificationUtils.confirm(message)
        return result.isConfirmed
    }
  } else {
    await NotificationUtils.question(message.title || '', message)
  }
  return true
} 