import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, AlertTriangle, Scale } from 'lucide-react'

const Terms: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const termsSections = [
    {
      icon: CheckCircle,
      title: "Aceptación de términos",
      content: "Al usar HogarZen, aceptas estos términos y condiciones. Si no estás de acuerdo con alguna parte, no debes usar nuestro servicio."
    },
    {
      icon: Scale,
      title: "Uso del servicio",
      content: "HogarZen se proporciona para uso personal y doméstico. No puedes usar el servicio para fines comerciales sin autorización previa."
    },
    {
      icon: AlertTriangle,
      title: "Limitaciones de responsabilidad",
      content: "HogarZen se proporciona 'tal como está'. No garantizamos que el servicio esté libre de errores o interrupciones."
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
            <FileText className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zen-900 mb-6">
            Términos y Condiciones
          </h1>
          <p className="text-xl text-zen-600 mb-4">
            Condiciones de uso de HogarZen
          </p>
          <p className="text-zen-500">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
      </section>

      {/* Terms Sections */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {termsSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
              className="card-hover"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zen-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-zen-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="cta-card text-center max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4">¿Tienes preguntas sobre los términos?</h2>
          <p className="text-primary-100 mb-6">
            Nuestro equipo legal está aquí para aclarar cualquier duda sobre nuestros términos y condiciones.
          </p>
          <a
            href="mailto:hola@hogarzen.com"
            className="bg-white text-primary-600 font-semibold py-3 px-6 rounded-lg hover:bg-primary-50 transition-colors inline-block"
          >
            Contactar Equipo Legal
          </a>
        </motion.div>
      </section>
    </div>
  )
}

export default Terms 