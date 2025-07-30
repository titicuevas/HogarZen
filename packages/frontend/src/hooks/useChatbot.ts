import { useState, useCallback } from 'react';
import { geminiService, ChatMessage } from '../services/geminiService';

interface UseChatbotReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  quickSuggestions: string[];
  loadQuickSuggestions: () => Promise<void>;
}

export const useChatbot = (): UseChatbotReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await geminiService.sendMessage(content, messages);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error al comunicarse con Gemini:', err);
      
      // Proporcionar respuestas predefinidas cuando la IA no está disponible
      const fallbackResponse = getFallbackResponse(content);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setError('La IA no está disponible en este momento. Usando respuestas predefinidas.');
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  // Función para obtener respuestas predefinidas
  const getFallbackResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('crear') || message.includes('nueva tarea')) {
      return 'Para crear una nueva tarea en HogarZen:\n\n1. Ve al dashboard\n2. Haz clic en "Nueva Tarea"\n3. Completa el formulario\n4. Guarda la tarea\n\n¡Es así de simple! 🎯';
    }
    
    if (message.includes('categoría') || message.includes('organizar')) {
      return 'Para organizar tareas por categorías:\n\n1. Al crear una tarea, selecciona una categoría\n2. Usa los filtros en el dashboard\n3. Agrupa tareas similares\n\nEsto te ayudará a mantener todo ordenado! 📁';
    }
    
    if (message.includes('completar') || message.includes('terminar')) {
      return 'Si no puedes completar una tarea:\n\n1. Marca como "En progreso"\n2. Divide la tarea en subtareas más pequeñas\n3. Programa recordatorios\n4. No te estreses, ¡mañana es otro día! 🌅';
    }
    
    if (message.includes('motivación') || message.includes('motivar')) {
      return 'Tips para mantener motivación:\n\n1. Celebra las pequeñas victorias 🎉\n2. Establece metas realistas\n3. Usa el sistema de recompensas\n4. Recuerda por qué empezaste\n\n¡Tú puedes con todo! 💪';
    }
    
    if (message.includes('limpiar') || message.includes('limpieza')) {
      return 'Tips para limpiar eficientemente:\n\n1. Empieza por arriba y termina abajo\n2. Usa el método de 15 minutos\n3. Limpia una habitación a la vez\n4. Mantén productos organizados\n\n¡La limpieza puede ser zen! 🧹✨';
    }
    
    if (message.includes('hola') || message.includes('ayuda')) {
      return '¡Hola! Soy tu asistente de HogarZen. Puedo ayudarte con:\n\n• Crear y organizar tareas\n• Consejos de limpieza\n• Mantener motivación\n• Usar la aplicación\n\n¿En qué puedo ayudarte hoy? 😊';
    }
    
    return 'Gracias por tu pregunta. En este momento la IA no está disponible, pero puedes:\n\n1. Revisar la documentación\n2. Contactar soporte en hola@hogarzen.com\n3. Probar las funciones básicas de la app\n\n¡La aplicación funciona perfectamente sin la IA! 🚀';
  };

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const loadQuickSuggestions = useCallback(async () => {
    try {
      // Primero probar la conectividad
      const isConnected = await geminiService.testConnection();
      console.log('Gemini connection test:', isConnected);
      
      if (!isConnected) {
        console.warn('⚠️ Gemini no está disponible, usando sugerencias por defecto');
        setQuickSuggestions([
          '¿Cómo crear una nueva tarea?',
          '¿Cómo organizar mis tareas por categorías?',
          '¿Qué hacer si no puedo completar una tarea?',
          '¿Cómo mantener motivación con las tareas?',
          '¿Tips para limpiar más eficientemente?'
        ]);
        return;
      }

      const suggestions = await geminiService.getQuickSuggestions();
      setQuickSuggestions(suggestions);
    } catch (err) {
      console.error('Error al cargar sugerencias:', err);
      // Usar sugerencias por defecto si falla
      setQuickSuggestions([
        '¿Cómo crear una nueva tarea?',
        '¿Cómo organizar mis tareas por categorías?',
        '¿Qué hacer si no puedo completar una tarea?',
        '¿Cómo mantener motivación con las tareas?',
        '¿Tips para limpiar más eficientemente?'
      ]);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    quickSuggestions,
    loadQuickSuggestions
  };
}; 