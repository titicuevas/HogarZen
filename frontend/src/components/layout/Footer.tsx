import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Github, Heart } from 'lucide-react'

// =====================================================
// COMPONENTE FOOTER
// =====================================================
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const supportLinks = [
    { name: 'Centro de ayuda', href: '/ayuda' },
    { name: 'Contacto', href: 'mailto:hola@hogarzen.com' }
  ]

  const legalLinks = [
    { name: 'Privacidad', href: '/privacidad' },
    { name: 'Términos', href: '/terminos' },
    { name: 'Cookies', href: '/cookies' }
  ]

  const socialLinks = [
    { name: 'Email', href: 'mailto:hola@hogarzen.com', icon: Mail },
    { name: 'GitHub', href: 'https://github.com/titicuevas/HogarZen', icon: Github }
  ]

  return (
    <footer className="bg-zen-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="logo-container">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-2xl font-bold text-white">HogarZen</span>
            </div>
            <p className="text-zen-300 mb-6 max-w-md leading-relaxed">
              Simplifica la gestión de tu hogar con tareas inteligentes, 
              recordatorios automáticos y análisis detallados para mantener 
              tu casa en perfecto estado.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zen-400 hover:text-primary-400 transition-colors duration-200 group"
                >
                  <span className="sr-only">{link.name}</span>
                  <link.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Soporte
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-zen-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-zen-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-zen-400 text-sm flex items-center">
              © {currentYear} HogarZen. Diseñado con{' '}
              <Heart className="w-4 h-4 mx-1 text-red-500" />
              {' '}para tu tranquilidad.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-zen-400 hover:text-primary-400 text-sm transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 