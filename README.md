# 🏠 HogarZen - Gestión Inteligente del Hogar

## 📋 Descripción

HogarZen es una aplicación web moderna para la gestión inteligente de tareas del hogar, construida con React, TypeScript y Supabase. La aplicación incluye funcionalidades avanzadas como generación de checklists con IA, análisis de productividad, calendario interactivo y sistema de notificaciones.

## ✨ Características Principales

### 🎯 Dashboard Inteligente
- **Vista principal** con resumen de tareas diarias
- **Progreso visual** con barras de progreso animadas
- **Sistema de iconos** inteligente con 200+ emojis contextuales
- **Modo oscuro** completo y persistente
- **Interfaz responsive** para todos los dispositivos

### 🤖 Checklists con IA
- **Generación automática** de checklists usando Gemini AI
- **Detección automática** de categorías basada en texto
- **Interfaz intuitiva** para crear checklists personalizados
- **Guardado local** con sincronización
- **Progreso visual** de completado

### 📅 Calendario Interactivo
- **Vista semanal y mensual** con navegación
- **Detección automática** de tareas por fecha
- **Interacción directa** - hacer clic en días para ver tareas
- **Indicadores visuales** de tareas completadas/pendientes
- **Resumen diario** con estadísticas

### 📊 Análisis y Estadísticas
- **Métricas de productividad** con puntuación inteligente
- **Gráficos de progreso** semanal
- **Estadísticas por categoría** con emojis
- **Insights personalizados** y recomendaciones
- **Tendencias** y patrones de uso

### ⚙️ Configuración Avanzada
- **Notificaciones personalizables** (email, push, recordatorios)
- **Preferencias de apariencia** (tema, emojis, progreso)
- **Configuración de privacidad** y datos
- **Exportación de datos** en JSON
- **Gestión de cuenta** y preferencias

### 🔐 Autenticación Segura
- **Sistema de registro y login** con Supabase
- **Rutas protegidas** para usuarios autenticados
- **Gestión de sesiones** persistente
- **Validación de formularios** robusta

## 🏗️ Arquitectura del Proyecto

### 📁 Estructura Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/           # Componentes de autenticación
│   │   ├── dashboard/      # Componentes del dashboard
│   │   ├── layout/         # Componentes de layout
│   │   └── ui/            # Componentes UI reutilizables
│   ├── config/            # Configuraciones
│   ├── contexts/          # Contextos de React
│   ├── core/              # Entidades y interfaces
│   ├── hooks/             # Hooks personalizados
│   ├── pages/             # Páginas de la aplicación
│   ├── services/          # Servicios de API
│   ├── types/             # Tipos TypeScript
│   └── utils/             # Utilidades
```

### 📁 Estructura Backend
```
backend/
├── src/
│   ├── config/            # Configuraciones
│   ├── controllers/       # Controladores
│   ├── middleware/        # Middlewares
│   ├── routes/           # Rutas de API
│   └── services/         # Servicios
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Vite** - Build tool
- **React Router** - Enrutamiento
- **Lucide React** - Iconos
- **Supabase** - Backend as a Service

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Supabase** - Base de datos y autenticación
- **Google Gemini AI** - Generación de contenido

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Git** - Control de versiones

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- API Key de Google Gemini

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/hogarzen.git
cd hogarzen
```

### 2. Configurar variables de entorno
```bash
# Frontend (.env)
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
VITE_GEMINI_API_KEY=tu_api_key_de_gemini
VITE_API_URL=http://localhost:3001

# Backend (.env)
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_KEY=tu_service_key_de_supabase
GEMINI_API_KEY=tu_api_key_de_gemini
PORT=3001
```

### 3. Instalar dependencias
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 4. Ejecutar el proyecto
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📱 Uso de la Aplicación

### 1. Registro y Login
- Crear una cuenta nueva o iniciar sesión
- Verificar email (opcional)
- Acceder al dashboard

### 2. Dashboard Principal
- Ver resumen de tareas del día
- Agregar nuevas tareas
- Marcar tareas como completadas
- Ver progreso visual

### 3. Checklists con IA
- Ir a "Checklists IA"
- Describir lo que necesitas
- La IA generará automáticamente el checklist
- Guardar y gestionar checklists

### 4. Calendario
- Navegar entre semanas/meses
- Ver tareas por fecha
- Interactuar con días específicos
- Gestionar tareas desde el calendario

### 5. Análisis
- Ver métricas de productividad
- Analizar tendencias
- Obtener recomendaciones
- Exportar datos

### 6. Configuración
- Personalizar notificaciones
- Ajustar apariencia
- Gestionar privacidad
- Exportar datos

## 🎨 Principios SOLID Implementados

### Single Responsibility Principle (SRP)
- Cada componente tiene una responsabilidad específica
- Separación clara entre lógica de negocio y presentación

### Open/Closed Principle (OCP)
- Sistema de iconos extensible
- Componentes configurables a través de props
- Hooks reutilizables

### Liskov Substitution Principle (LSP)
- Interfaces consistentes entre componentes
- Props tipadas correctamente
- Comportamiento predecible

### Interface Segregation Principle (ISP)
- Interfaces específicas para cada funcionalidad
- Props mínimas necesarias
- Hooks especializados por dominio

### Dependency Inversion Principle (DIP)
- Dependencias inyectadas a través de props
- Hooks como abstracciones de lógica
- Servicios separados de componentes

## 🔧 Scripts Disponibles

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting
npm run test         # Tests
```

### Backend
```bash
npm run dev          # Desarrollo
npm start            # Producción
npm run lint         # Linting
```

## 📊 Métricas del Proyecto

- **Líneas de código**: ~15,000
- **Componentes React**: 25+
- **Hooks personalizados**: 8
- **Servicios**: 5
- **Tipos TypeScript**: 50+
- **Iconos/Emojis**: 200+

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuUsuario](https://github.com/TuUsuario)

## 🙏 Agradecimientos

- **Supabase** por el backend as a service
- **Google Gemini** por la IA
- **Tailwind CSS** por el framework de estilos
- **React Team** por la biblioteca

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.

---

**HogarZen** - Haciendo la gestión del hogar más inteligente y zen 🧘‍♀️ 