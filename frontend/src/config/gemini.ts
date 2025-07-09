// Configuración para Gemini AI
// Las credenciales se cargan desde el archivo gemini-credentials.json

export const geminiConfig = {
  projectId: 'hogarzen',
  // Las credenciales se cargarán dinámicamente desde el archivo JSON
  credentialsPath: './src/config/gemini-credentials.json'
}

// Función para cargar las credenciales de Gemini
export const loadGeminiCredentials = async () => {
  try {
    const response = await fetch(geminiConfig.credentialsPath)
    const credentials = await response.json()
    return credentials
  } catch (error) {
    console.error('Error cargando credenciales de Gemini:', error)
    return null
  }
} 