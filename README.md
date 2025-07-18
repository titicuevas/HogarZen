# 🏠 HogarZen - Gestión Inteligente del Hogar

HogarZen es una aplicación web moderna para la gestión inteligente de tareas del hogar, construida con React, Supabase y Gemini AI.

## 🚀 Características

- ✅ **Gestión de Tareas**: CRUD completo con categorización
- ✅ **Autenticación**: Sistema seguro con Supabase Auth
- ✅ **IA Integrada**: Chatbot inteligente con Gemini AI
- ✅ **Interfaz Moderna**: Diseño responsive con Tailwind CSS
- ✅ **Tiempo Real**: Notificaciones y actualizaciones en vivo
- ✅ **Tema Oscuro**: Soporte para modo claro/oscuro

## 🏗️ Arquitectura

```
hogarzen/
├── frontend/          # Aplicación React + Vite
│   ├── src/
│   │   ├── components/    # Componentes UI reutilizables
│   │   ├── contexts/      # Contextos de React
│   │   ├── hooks/         # Hooks personalizados
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── services/      # Servicios de API
│   │   └── config/        # Configuración centralizada
│   ├── Dockerfile         # Configuración Docker
│   └── docker-compose.yml # Orquestación de servicios
├── backend/           # API y servicios backend
│   ├── src/
│   ├── Dockerfile
│   └── docker-compose.yml
└── README.md          # Este archivo
```

## 🛠️ Tecnologías

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router** - Navegación
- **Lucide React** - Iconos

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Base de datos
- **Row Level Security** - Seguridad de datos

### IA
- **Gemini AI** - Chatbot inteligente
- **Google AI Studio** - Gestión de API keys

## 🚀 Inicio Rápido

### Opción 1: Desarrollo Local

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
npm install
npm run dev
```

### Opción 2: Docker (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/titicuevas/HogarZen.git
cd HogarZen

# Configurar variables de entorno
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env.local

# Editar archivos .env.local con tus credenciales

# Iniciar con Docker
docker-compose up --build
```

## ⚙️ Configuración

### Variables de Entorno

#### Frontend (.env.local)
```bash
# Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima

# Gemini AI
VITE_GEMINI_API_KEY=tu_api_key_gemini
```

#### Backend (.env.local)
```bash
# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### Obtener Credenciales

1. **Supabase**: [supabase.com](https://supabase.com)
   - Crea un proyecto
   - Ve a Settings > API
   - Copia URL y keys

2. **Gemini AI**: [makersuite.google.com](https://makersuite.google.com/app/apikey)
   - Crea una API key
   - Copia la clave generada

## 📁 Estructura del Proyecto

### Frontend
```
frontend/src/
├── components/          # Componentes UI
│   ├── auth/           # Componentes de autenticación
│   ├── common/         # Componentes comunes
│   ├── dashboard/      # Componentes del dashboard
│   ├── layout/         # Layouts y navegación
│   └── ui/             # Componentes base UI
├── contexts/           # Contextos de React
├── hooks/              # Hooks personalizados
├── pages/              # Páginas de la aplicación
├── services/           # Servicios de API
├── config/             # Configuración centralizada
└── types/              # Tipos TypeScript
```

### Backend
```
backend/src/
├── api/                # Endpoints de la API
├── services/           # Lógica de negocio
├── models/             # Modelos de datos
├── middleware/         # Middleware personalizado
└── utils/              # Utilidades
```

## 🎯 Principios Aplicados

- **SOLID**: Separación de responsabilidades
- **DRY**: No repetición de código
- **Clean Architecture**: Arquitectura limpia
- **Type Safety**: Tipado completo con TypeScript
- **Security First**: Seguridad desde el diseño

## 🐳 Docker

### Desarrollo
```bash
docker-compose up --build
```

### Producción
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 📝 Scripts Disponibles

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting
npm run test         # Tests
```

### Backend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run test         # Tests
```

## 🔧 Desarrollo

### Estructura de Commits
```
feat: nueva característica
fix: corrección de bug
docs: documentación
style: cambios de estilo
refactor: refactorización
test: tests
chore: tareas de mantenimiento
```

### Branches
- `main` - Código de producción
- `develop` - Código en desarrollo
- `feature/*` - Nuevas características
- `hotfix/*` - Correcciones urgentes

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

- **Email**: hola@hogarzen.com
- **GitHub**: [Issues](https://github.com/titicuevas/HogarZen/issues)
- **Documentación**: [Wiki](https://github.com/titicuevas/HogarZen/wiki)

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) por el backend as a service
- [Google AI](https://ai.google.dev/) por Gemini AI
- [Vite](https://vitejs.dev/) por el build tool
- [Tailwind CSS](https://tailwindcss.com/) por el framework de estilos 