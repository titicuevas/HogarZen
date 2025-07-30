import React from 'react'
import { Heart, Sparkles, Star, Zap, Shield, Brain, Home, Users, Globe } from 'lucide-react'

// =====================================================
// COMPONENTE FOOTER COMPACTO Y ELEGANTE
// =====================================================

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-r from-slate-900 to-purple-900 border-t border-purple-800/50 mt-auto">
      {/* Efecto sutil de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-8">
        {/* Contenido principal en una sola fila */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo y copyright */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-lg">HZ</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                HogarZen
              </h3>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>© {currentYear}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <span>Hecho con</span>
                  <Heart className="w-3 h-3 text-red-500 animate-pulse" />
                  <span>para tu hogar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Características compactas */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-sm font-medium">Seguro</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm font-medium">Rápido</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm font-medium">Inteligente</span>
            </div>
          </div>

          {/* Enlaces legales */}
          <div className="flex items-center space-x-4">
            <a href="/privacidad" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
              Privacidad
            </a>
            <a href="/terminos" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
              Términos
            </a>
            <a href="/ayuda" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
              Ayuda
            </a>
            <a href="/contacto" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span>Contacto</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 