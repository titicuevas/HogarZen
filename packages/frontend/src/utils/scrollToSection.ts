// =====================================================
// UTILIDADES DE SCROLL
// =====================================================

/**
 * Hace scroll suave a una sección específica
 */
export const scrollToSection = (sectionId: string, offset: number = 0): void => {
  const element = document.getElementById(sectionId)
  if (element) {
    const elementPosition = element.offsetTop - offset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
}

/**
 * Hace scroll al inicio de la página
 */
export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * Hace scroll a un elemento específico
 */
export const scrollToElement = (element: HTMLElement, offset: number = 0): void => {
  const elementPosition = element.offsetTop - offset
  window.scrollTo({
    top: elementPosition,
    behavior: 'smooth'
  })
} 