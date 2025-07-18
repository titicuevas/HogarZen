import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Brain, Zap, ArrowRight, Sparkles, Home as HomeIcon, Clock, Bell } from 'lucide-react'

const Home: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: CheckCircle,
      title: "Checklist Inteligente",
      description: "Lista personalizable de tareas diarias con estado visual claro y orden automático.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Brain,
      title: "IA Personalizada",
      description: "Sugerencias inteligentes basadas en tus patrones y el clima local.",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: Zap,
      title: "Resumen Zen",
      description: "Un solo clic para confirmar que todo está bajo control antes de salir.",
      color: "from-orange-500 to-red-600"
    }
  ]

  const benefits = [
    { icon: HomeIcon, title: "Hogar Seguro", description: "Nunca más dudes si apagaste la plancha" },
    { icon: Clock, title: "Ahorra Tiempo", description: "Checklist rápido en segundos" },
    { icon: Bell, title: "Notificaciones", description: "Recordatorios inteligentes" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 relative">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="logo-container mx-auto mb-6 animate-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-zen-900 mb-6 leading-tight"
          >
            ¿Te pasa que sales de casa y{' '}
            <span className="gradient-text">dudas si apagaste la plancha?</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-zen-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            HogarZen es tu asistente doméstico inteligente que te ayuda a comprobar 
            fácilmente si has realizado todas las tareas importantes antes de salir.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <button 
              onClick={() => window.location.href = '/auth'}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
            >
              <span>Comenzar Ahora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => window.location.href = '/auth?mode=register'}
              className="btn-secondary text-lg px-8 py-4"
            >
              Registrarse Gratis
            </button>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 + index * 0.2, duration: 0.8 }}
                className="card-hover text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-zen-900 mb-2">{benefit.title}</h3>
                <p className="text-zen-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-zen-900 mb-4">Características Principales</h2>
          <p className="text-xl text-zen-600 max-w-2xl mx-auto">
            Todo lo que necesitas para mantener tu hogar seguro y organizado
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.2, duration: 0.8 }}
              className="card-hover text-center group"
            >
              <div className={`feature-icon bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-zen-900 mb-3">{feature.title}</h3>
              <p className="text-zen-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          className="cta-card relative overflow-hidden"
        >
          {/* Efecto de fondo animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-primary-600/20 to-primary-700/20 animate-pulse-slow"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para vivir sin ansiedad?</h2>
            <p className="text-primary-100 mb-6 text-lg">
              Únete a miles de personas que ya confían en HogarZen para mantener su hogar seguro.
            </p>
            <button 
              onClick={() => window.location.href = '/auth'}
              className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-xl hover:bg-primary-50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Comenzar Ahora
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Home 