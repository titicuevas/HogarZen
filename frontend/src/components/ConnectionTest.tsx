import React, { useState } from 'react'
import { testSupabaseConnection } from '../config/supabase'

// =====================================================
// COMPONENTE DE PRUEBA DE CONECTIVIDAD
// =====================================================

export const ConnectionTest: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false)
  const [result, setResult] = useState<string>('')

  const handleTestConnection = async () => {
    setIsTesting(true)
    setResult('')
    
    try {
      const isConnected = await testSupabaseConnection()
      setResult(isConnected ? '✅ Conexión exitosa' : '❌ Error de conexión')
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Prueba de Conectividad</h3>
      <button
        onClick={handleTestConnection}
        disabled={isTesting}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isTesting ? 'Probando...' : 'Probar Conexión'}
      </button>
      {result && (
        <p className="mt-2 text-sm">{result}</p>
      )}
    </div>
  )
} 