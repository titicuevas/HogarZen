// Configuración para Gemini AI
// Las credenciales se cargan desde variables de entorno

export const geminiConfig = {
  projectId: import.meta.env.VITE_GEMINI_PROJECT_ID || 'hogarzen',
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  // Las credenciales se cargarán desde variables de entorno
}

// Función para verificar si las credenciales están disponibles
export const isGeminiConfigured = (): boolean => {
  return !!(geminiConfig.apiKey && geminiConfig.projectId)
}

// Función para obtener la configuración de Gemini
export const getGeminiConfig = () => {
  if (!isGeminiConfigured()) {
    console.warn('Gemini AI no está configurado. Verifica las variables de entorno.')
    return null
  }
  
  return {
    projectId: geminiConfig.projectId,
    apiKey: geminiConfig.apiKey
  }
} 