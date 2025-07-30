import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Brain, Zap, ArrowRight, Sparkles, Home as HomeIcon, Clock, Bell, Shield, Smartphone, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {

  const features = [
    {
      icon: CheckCircle,
      title: "Checklist Inteligente",
      description: "Lista personalizable de tareas diarias con estado visual claro y orden automático.",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Brain,
      title: "IA Personalizada",
      description: "Sugerencias inteligentes basadas en tus patrones y el clima local.",
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Zap,
      title: "Resumen Zen",
      description: "Un solo clic para confirmar que todo está bajo control antes de salir.",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50"
    }
  ]

  const benefits = [
    { 
      icon: Shield, 
      title: "Hogar Seguro", 
      description: "Nunca más dudes si apagaste la plancha o cerraste la puerta",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      icon: Clock, 
      title: "Ahorra Tiempo", 
      description: "Checklist rápido en segundos, sin complicaciones",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      icon: Bell, 
      title: "Notificaciones", 
      description: "Recordatorios inteligentes cuando los necesites",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]



  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-zen-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-zen-50/50" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-zen-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-1000" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-3000" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32 relative">
          <div className="text-center max-w-5xl mx-auto">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-tight"
            >
              ¿Te pasa que sales de casa y{' '}
              <span className="bg-gradient-to-r from-primary-600 to-zen-600 bg-clip-text text-transparent">
                dudas si apagaste la plancha?
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-600 dark:text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed"
            >
              HogarZen es tu asistente doméstico inteligente que te ayuda a comprobar 
              fácilmente si has realizado todas las tareas importantes antes de salir.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link 
                to="/login"
                className="group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold text-lg lg:text-xl px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex items-center space-x-3"
              >
                <span>Comenzar Ahora</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              <Link 
                to="/registro"
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-lg lg:text-xl px-10 py-5 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                Registrarse Ahora
              </Link>
            </motion.div>

            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {[
                {
                  icon: CheckCircle,
                  title: "Listo para usar",
                  description: "5 tareas esenciales incluidas desde el primer día",
                  color: "from-green-500 to-emerald-600"
                },
                {
                  icon: Smartphone,
                  title: "Totalmente personalizable",
                  description: "Añade, modifica o elimina tareas según tus necesidades",
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  icon: Shield,
                  title: "Sin complicaciones",
                  description: "Interfaz simple e intuitiva para toda la familia",
                  color: "from-purple-500 to-pink-600"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl mx-auto mb-4 shadow-lg`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              Características Principales
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Todo lo que necesitas para mantener tu hogar seguro y organizado
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className={`${feature.bgColor} dark:bg-gray-800/50 rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 dark:border-gray-700`}
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-50 to-zen-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 sm:p-12"
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                ¿Cómo funciona?
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                En solo 3 pasos tendrás tu hogar bajo control
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Configura tu checklist",
                  description: "Personaliza las tareas que necesitas verificar antes de salir de casa",
                  icon: CheckCircle,
                  color: "from-green-500 to-emerald-600"
                },
                {
                  step: "2", 
                  title: "Usa la app diariamente",
                  description: "Marca las tareas completadas con un simple toque",
                  icon: Smartphone,
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  step: "3",
                  title: "Sal tranquilo",
                  description: "Confirma que todo está en orden con el resumen final",
                  icon: Shield,
                  color: "from-purple-500 to-pink-600"
                }
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {step.step}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              ¿Por qué elegir HogarZen?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Diseñado para hacer tu vida más fácil y tu hogar más seguro
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className={`${benefit.bgColor} dark:bg-gray-800/50 rounded-3xl p-10 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-200 dark:border-gray-700`}
              >
                <div className={`w-20 h-20 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg`}>
                  <benefit.icon className={`w-10 h-10 ${benefit.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-r from-primary-600 to-zen-600 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-zen-600/90" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8">
              ¿Listo para empezar?
            </h2>
            <p className="text-xl lg:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Únete a miles de usuarios que ya confían en HogarZen para mantener sus hogares seguros
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/login"
                className="bg-white text-primary-600 hover:bg-gray-50 font-semibold text-lg lg:text-xl px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                Comenzar Ahora
              </Link>
              <Link 
                to="/ayuda"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold text-lg lg:text-xl px-10 py-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                Saber Más
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home 