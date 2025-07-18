import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { environmentManager } from '../../config/environment';
import { testSupabaseConnection } from '../../config/supabase';
import { geminiService } from '../../services/geminiService';

// =====================================================
// COMPONENTE VERIFICADOR DE CONFIGURACIÓN - PRINCIPIOS SOLID
// =====================================================

interface ConfigStatus {
  supabase: {
    urlConfigured: boolean;
    keyConfigured: boolean;
    connected: boolean;
  };
  gemini: {
    keyConfigured: boolean;
    connected: boolean;
  };
  overall: boolean;
}

const ConfigChecker: React.FC = () => {
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Método para verificar configuración (Single Responsibility)
  const checkConfiguration = async () => {
    setIsChecking(true);
    
    try {
      // Verificar configuración básica
      const isConfigComplete = environmentManager.isConfigurationComplete();
      const debugInfo = environmentManager.getDebugInfo();
      
      // Verificar conectividad solo si las credenciales están configuradas y no son valores de ejemplo
      let supabaseConnected = false;
      let geminiConnected = false;

      const hasRealSupabaseConfig = debugInfo.supabase.urlConfigured && 
                                   debugInfo.supabase.keyConfigured &&
                                   debugInfo.supabase.keyPreview !== '***e_supabase';

      const hasRealGeminiConfig = debugInfo.gemini.keyConfigured &&
                                 debugInfo.gemini.keyPreview !== '***tu_api_k';

      if (hasRealSupabaseConfig) {
        try {
          supabaseConnected = await testSupabaseConnection();
        } catch (error) {
          console.warn('⚠️ No se pudo conectar con Supabase:', error);
        }
      }

      if (hasRealGeminiConfig) {
        try {
          geminiConnected = await geminiService.testConnection();
        } catch (error) {
          console.warn('⚠️ No se pudo conectar con Gemini:', error);
        }
      }

      const status: ConfigStatus = {
        supabase: {
          urlConfigured: debugInfo.supabase.urlConfigured,
          keyConfigured: debugInfo.supabase.keyConfigured,
          connected: supabaseConnected,
        },
        gemini: {
          keyConfigured: debugInfo.gemini.keyConfigured,
          connected: geminiConnected,
        },
        overall: isConfigComplete, // Permitir que la app funcione con valores de ejemplo
      };

      setConfigStatus(status);
    } catch (error) {
      console.error('Error verificando configuración:', error);
      setConfigStatus({
        supabase: { urlConfigured: false, keyConfigured: false, connected: false },
        gemini: { keyConfigured: false, connected: false },
        overall: false,
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Verificar al montar el componente
  useEffect(() => {
    checkConfiguration();
  }, []);

  // Si la configuración está bien, no mostrar nada
  if (configStatus?.overall) {
    return null;
  }

  // Si no hay configuración básica, mostrar el modal
  if (!configStatus) {
    return null; // Esperar a que se cargue la configuración
  }

  // Solo mostrar el modal si realmente faltan variables críticas
  const hasBasicConfig = configStatus.supabase.urlConfigured && 
                        configStatus.supabase.keyConfigured && 
                        configStatus.gemini.keyConfigured;

  if (hasBasicConfig) {
    return null; // Tiene configuración básica, permitir que funcione
  }

  // Método para recargar la página
  const handleReload = () => {
    window.location.reload();
  };

  // Método para abrir documentación
  const openDocumentation = () => {
    window.open('https://github.com/titicuevas/HogarZen', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Configuración Requerida
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Necesitas configurar las variables de entorno
            </p>
          </div>
        </div>

        {/* Estado de configuración */}
        {configStatus && (
          <div className="space-y-3 mb-6">
            {/* Supabase */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className={`w-4 h-4 ${configStatus.supabase.urlConfigured && configStatus.supabase.keyConfigured ? 'text-green-500' : 'text-red-500'}`} />
                <span className="text-sm font-medium">Supabase</span>
              </div>
              <div className="text-xs text-gray-500">
                {configStatus.supabase.urlConfigured && configStatus.supabase.keyConfigured ? '✅ Configurado' : '❌ Faltante'}
              </div>
            </div>

            {/* Gemini */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className={`w-4 h-4 ${configStatus.gemini.keyConfigured ? 'text-green-500' : 'text-red-500'}`} />
                <span className="text-sm font-medium">Gemini AI</span>
              </div>
              <div className="text-xs text-gray-500">
                {configStatus.gemini.keyConfigured ? '✅ Configurado' : '❌ Faltante'}
              </div>
            </div>
          </div>
        )}

        {/* Mensaje informativo */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>💡 Tip:</strong> La aplicación puede funcionar con valores de ejemplo para desarrollo. 
            Reemplaza con credenciales reales para funcionalidad completa.
          </p>
        </div>

        {/* Pasos para solucionarlo */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Para funcionalidad completa:
          </h3>
          <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 dark:text-blue-400 font-medium">1.</span>
              <span>Edita el archivo <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">.env.local</code></span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 dark:text-blue-400 font-medium">2.</span>
              <span>Reemplaza los valores de ejemplo con credenciales reales</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 dark:text-blue-400 font-medium">3.</span>
              <span>Reinicia el servidor de desarrollo</span>
            </li>
          </ol>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3">
          <button
            onClick={checkConfiguration}
            disabled={isChecking}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isChecking ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>Verificar de nuevo</span>
          </button>
          
          <button
            onClick={openDocumentation}
            className="flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ayuda</span>
          </button>
        </div>

        {/* Botones adicionales */}
        <div className="flex space-x-3 mt-3">
          <button
            onClick={() => setConfigStatus({ ...configStatus!, overall: true })}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Continuar con valores de ejemplo
          </button>
          
          <button
            onClick={handleReload}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Recargar
          </button>
        </div>
      </div>
    </div>
  );
};

export { ConfigChecker }; 