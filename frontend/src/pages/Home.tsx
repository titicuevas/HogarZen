import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Brain, Zap, ArrowRight } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-zen-900 mb-6"
          >
            ¿Te pasa que sales de casa y{' '}
            <span className="text-gradient">dudas si apagaste la plancha?</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-zen-600 mb-8 max-w-2xl mx-auto"
          >
            HogarZen es tu asistente doméstico inteligente que te ayuda a comprobar 
            fácilmente si has realizado todas las tareas importantes antes de salir.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={() => window.location.href = '/auth'}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
            >
              <span>Comenzar Ahora</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => window.location.href = '/auth?mode=register'}
              className="btn-secondary text-lg px-8 py-4"
            >
              Registrarse Gratis
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-zen-900 mb-3">Checklist Inteligente</h3>
            <p className="text-zen-600">
              Lista personalizable de tareas diarias con estado visual claro y orden automático.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-zen-900 mb-3">IA Personalizada</h3>
            <p className="text-zen-600">
              Sugerencias inteligentes basadas en tus patrones y el clima local.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-zen-900 mb-3">Resumen Zen</h3>
            <p className="text-zen-600">
              Un solo clic para confirmar que todo está bajo control antes de salir.
            </p>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="card text-center max-w-2xl mx-auto bg-gradient-to-r from-primary-500 to-primary-600 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">¿Listo para vivir sin ansiedad?</h2>
          <p className="text-primary-100 mb-6">
            Únete a miles de personas que ya confían en HogarZen para mantener su hogar seguro.
          </p>
          <button 
            onClick={() => window.location.href = '/auth'}
            className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Comenzar Ahora
          </button>
        </motion.div>
      </section>
    </div>
  )
}

export default Home 