import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cookie, Settings, Shield, Info } from 'lucide-react'

const Cookies: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const cookieTypes = [
    {
      icon: Settings,
      title: "Cookies esenciales",
      description: "Necesarias para el funcionamiento básico del sitio",
      examples: ["Autenticación", "Preferencias de sesión", "Seguridad"]
    },
    {
      icon: Info,
      title: "Cookies analíticas",
      description: "Nos ayudan a mejorar la experiencia del usuario",
      examples: ["Estadísticas de uso", "Rendimiento", "Errores"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Cookie className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zen-900 mb-6">
            Política de Cookies
          </h1>
          <p className="text-xl text-zen-600 mb-4">
            Cómo usamos las cookies para mejorar tu experiencia
          </p>
          <p className="text-zen-500">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
      </section>

      {/* Cookie Types */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {cookieTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
              className="card-hover"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6">
                <type.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-zen-900 mb-3">{type.title}</h3>
              <p className="text-zen-600 mb-4">{type.description}</p>
              <ul className="space-y-2">
                {type.examples.map((example, exampleIndex) => (
                  <li key={exampleIndex} className="flex items-center text-sm text-zen-600">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-3"></div>
                    {example}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Cookie Management */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="cta-card text-center max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Gestionar tus preferencias</h2>
          <p className="text-primary-100 mb-6">
            Puedes controlar qué cookies aceptas y cambiar tus preferencias en cualquier momento.
          </p>
          <button className="bg-white text-primary-600 font-semibold py-3 px-6 rounded-lg hover:bg-primary-50 transition-colors">
            Configurar Cookies
          </button>
        </motion.div>
      </section>
    </div>
  )
}

export default Cookies 