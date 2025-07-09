# 🏠 HogarZen - Tu Asistente Doméstico Inteligente

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39.0-3ECF8E.svg)](https://supabase.com/)

> ¿Te pasa que sales de casa y dudas si apagaste la plancha? HogarZen es tu solución.

## 🎯 Descripción

HogarZen es una aplicación web inteligente que te ayuda a comprobar fácilmente si has realizado todas las tareas importantes del hogar antes de salir, reduciendo la ansiedad y los olvidos comunes.

### ✨ Características Principales

- ✅ **Checklist Diario Inteligente** - Lista personalizable de tareas con estado visual
- 🧠 **IA Personalizada** - Sugerencias basadas en patrones y clima local (Gemini AI)
- 🧘 **Modo "Resumen Zen"** - Confirmación rápida de que todo está bajo control
- 📊 **Historial y Patrones** - Visualización semanal de hábitos y olvidos
- 👤 **Perfil Personalizado** - Configuración según zona climática y preferencias
- 🎮 **Modo Demo** - Prueba la app sin registrarte

## 🚀 Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS + Framer Motion
- **Base de Datos**: Supabase (PostgreSQL)
- **IA**: Google Gemini AI
- **Notificaciones**: SweetAlert2 + React Confetti
- **Enrutamiento**: React Router DOM

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/titicuevas/HogarZen.git
cd HogarZen
```

2. **Instala las dependencias del frontend**
```bash
cd frontend
npm install
```

3. **Configura las variables de entorno**
```bash
# Crea un archivo .env.local en la carpeta frontend
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

4. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
hogarzen/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utilidades y helpers
│   │   ├── types/          # Tipos TypeScript
│   │   ├── config/         # Configuración (Supabase, Gemini)
│   │   └── styles/         # Archivos de estilos CSS
│   ├── public/             # Archivos estáticos
│   └── package.json
├── backend/                # Futura API y lógica de servidor
└── README.md
```

## 🎨 Características de Diseño

- **Diseño Responsivo** - Funciona en móvil, tablet y desktop
- **Animaciones Suaves** - Transiciones con Framer Motion
- **Paleta de Colores Zen** - Colores relajantes y profesionales
- **Tipografía Inter** - Fuente moderna y legible
- **Componentes Reutilizables** - Sistema de diseño consistente

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Vista previa de la build
npm run lint         # Ejecuta ESLint
```

## 🗄️ Base de Datos (Supabase)

### Tablas Principales

- **users** - Información de usuarios
- **tasks** - Tareas disponibles
- **user_tasks** - Tareas del usuario por fecha
- **recommendations** - Recomendaciones de IA

## 🤖 Integración con IA (Gemini)

- Análisis de patrones de uso
- Sugerencias personalizadas basadas en clima
- Recomendaciones para reducir olvidos
- Resúmenes semanales inteligentes

## 🔒 Seguridad

- Credenciales protegidas con `.gitignore`
- Autenticación segura con Supabase
- Variables de entorno para configuraciones sensibles

## 🚀 Roadmap

- [ ] Dashboard principal con checklist
- [ ] Sistema de autenticación
- [ ] Integración completa con Gemini AI
- [ ] Modo demo funcional
- [ ] Notificaciones push
- [ ] App móvil (React Native)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Titicuevas** - [GitHub](https://github.com/titicuevas)

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub! 