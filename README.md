# HogarZen - Gestión Inteligente del Hogar

Una aplicación web moderna para gestionar tareas del hogar de manera inteligente, con asistente de IA y checklist de salida.

## 🚀 Características

- **Dashboard Inteligente**: Resumen visual de tareas y estadísticas
- **Estado Vacío para Usuarios Nuevos**: Experiencia personalizada para nuevos usuarios
- **Asistente de IA Personalizado**: Generación de checklists basadas en rutina diaria
- **Sugerencias de Secciones**: Secciones estándar y personalizadas para checklists
- **Checklist de Salida**: Verificaciones de seguridad antes de salir de casa
- **Sistema de Notificaciones**: Alertas y recordatorios personalizados
- **Modo Oscuro/Claro**: Interfaz adaptable a preferencias del usuario
- **Calendario de Tareas**: Vista temporal de actividades
- **Configuración Personalizada**: Ajustes de usuario y preferencias

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Framer Motion
- **Iconos**: Lucide React
- **Base de Datos**: Supabase
- **IA**: Gemini AI (Google)
- **Notificaciones**: SweetAlert2

## 📦 Instalación

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta en Supabase (para la base de datos)
- API Key de Gemini AI (opcional, para funcionalidades de IA)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd hogarzen
   ```

2. **Instalar dependencias**
   ```bash
   # Instalar todo desde la raíz (Recomendado)
   npm run install:all
   
   # O instalar por separado
   npm run install:frontend
   npm run install:backend
   ```

3. **Configurar variables de entorno**
   
   Crear un archivo `.env` en la carpeta `frontend`:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   VITE_GEMINI_API_KEY=tu_api_key_de_gemini
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_de_supabase
   ```

4. **Configurar Supabase**
   
   - Crear un proyecto en [Supabase](https://supabase.com)
   - Configurar las tablas necesarias:
     
     **Opción A: Usando el SQL Editor de Supabase (Recomendado)**
     1. Ve al SQL Editor en tu proyecto de Supabase
     2. Copia y pega el contenido del archivo `frontend/scripts/supabase-schema.sql`
     3. Ejecuta el script completo
     
     **Opción B: Usando el script automatizado**
     ```bash
     # Instalar dependencias adicionales para el script
     npm install @supabase/supabase-js dotenv
     
     # Ejecutar el script de actualización de la base de datos
     node scripts/update-database.js
     ```
   - Copiar las credenciales al archivo `.env`
   - **Importante**: Para la Opción B necesitarás la `SUPABASE_SERVICE_ROLE_KEY`

## 🚀 Ejecutar la Aplicación

### 1. Configurar Variables de Entorno

#### Frontend (.env.local)
Crea un archivo `.env.local` en el directorio `packages/frontend`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=tu_url_real_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_real_de_supabase

# Gemini AI Configuration
VITE_GEMINI_API_KEY=tu_api_key_real_de_gemini

# App Configuration
VITE_API_URL=http://localhost:8000
VITE_DOCKER=false
```

#### Backend (.env)
Crea un archivo `.env` en el directorio `packages/backend`:

```bash
# Supabase Configuration
SUPABASE_URL=tu_url_real_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima_real_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_de_supabase

# Gemini AI Configuration
GEMINI_API_KEY=tu_api_key_real_de_gemini

# Server Configuration
PORT=8000
NODE_ENV=development
```

### 2. Corregir Base de Datos

Ejecuta el script de corrección en el SQL Editor de Supabase:

```sql
-- Copia y pega el contenido de scripts/fix-database.sql
```

### 3. Probar Conexión con Gemini

```bash
# Probar conexión básica
node scripts/test-gemini.js

# Probar generación de checklists personalizadas
node scripts/test-checklist-generation.js
```

### 4. Ejecutar la Aplicación

#### Opción A: Ejecutar todo desde la raíz (Recomendado)
```bash
# Instalar dependencias
npm run install:all

# Ejecutar ambos servicios
npm run dev
```

#### Opción B: Ejecutar servicios por separado
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

- Backend estará disponible en `http://localhost:8000`
- Frontend estará disponible en `http://localhost:5173`

### Producción

```bash
# Construir la aplicación
npm run build

# Previsualizar la versión de producción
npm run preview
```

## 🛠️ Scripts Disponibles

### Workspace (Raíz)
```bash
# Desarrollo
npm run dev              # Ejecutar frontend y backend simultáneamente
npm run dev:frontend     # Solo frontend
npm run dev:backend      # Solo backend

# Instalación
npm run install:all      # Instalar dependencias de todos los paquetes
npm run install:frontend # Solo frontend
npm run install:backend  # Solo backend

# Utilidades globales
node scripts/test-gemini.js                    # Probar conexión con Gemini
node scripts/test-checklist-generation.js      # Probar generación de checklists
```

### Frontend (packages/frontend)
```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build de producción

# Testing
npm run test         # Ejecutar tests unitarios
npm run test:e2e     # Ejecutar tests end-to-end
```

### Backend (packages/backend)
```bash
# Desarrollo
npm start            # Iniciar servidor de desarrollo
npm run dev          # Iniciar servidor con nodemon
```

## 📁 Estructura del Proyecto (SOLID)

```
hogarzen/
├── packages/
│   ├── frontend/               # Aplicación React (UI Layer)
│   │   ├── src/
│   │   │   ├── presentation/   # Componentes de UI
│   │   │   ├── infrastructure/ # Servicios y configuración
│   │   │   └── core/           # Lógica de negocio
│   │   └── package.json
│   ├── backend/                # Servidor Node.js (Business Logic)
│   │   ├── src/
│   │   │   ├── config/         # Configuración
│   │   │   ├── controllers/    # Controladores
│   │   │   ├── middleware/     # Middleware
│   │   │   ├── routes/         # Rutas
│   │   │   └── services/       # Servicios
│   │   └── package.json
│   └── shared/                 # Tipos y utilidades compartidas
│       ├── src/
│       │   ├── types/          # Tipos TypeScript
│       │   ├── interfaces/     # Interfaces
│       │   └── utils/          # Utilidades
│       └── package.json
├── scripts/                    # Scripts globales
│   ├── test-gemini.js         # Prueba conexión Gemini
│   └── fix-database.sql       # Corrección BD
├── docs/                       # Documentación
├── package.json                # Workspace root
└── README.md
```

## 🎯 Funcionalidades Principales

### Dashboard
- Resumen de tareas completadas y pendientes
- Estadísticas de productividad
- Acciones rápidas para crear tareas
- Vista de tareas recientes

### Estado Vacío para Usuarios Nuevos
- Experiencia personalizada cuando el usuario no tiene tareas
- Sugerencias de secciones para comenzar
- Botones de acción rápida para crear primera tarea
- Integración con asistente de IA

### Asistente de IA Personalizado
- Generación de checklists basadas en rutina diaria del usuario
- Secciones estándar predefinidas (Rutina Matutina, Limpieza, Productividad, etc.)
- Descripción personalizada del estilo de vida
- Categorización automática de tareas (hogar, productividad, bienestar)
- Priorización inteligente (alta, media, baja)
- Integración con Gemini AI para sugerencias inteligentes

### Checklist de Salida
- Verificaciones de seguridad críticas
- Tareas importantes y opcionales
- Progreso visual y estadísticas
- Vista especial para usuarios nuevos

### Sistema de Notificaciones
- Notificaciones en tiempo real
- Diferentes tipos (info, warning, success, urgent)
- Contador de no leídas
- Marcado como leído

## 🔧 Configuración Avanzada

### Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase | Sí |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima de Supabase | Sí |
| `VITE_GEMINI_API_KEY` | API Key de Gemini AI | No (opcional) |

### Personalización

- **Temas**: Modificar `tailwind.config.js` para cambiar colores
- **Componentes**: Editar componentes en `src/presentation/components/`
- **Servicios**: Configurar servicios en `src/infrastructure/services/`

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:coverage

# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration
```

## 📝 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Previsualiza la versión de producción |
| `npm run lint` | Ejecuta el linter |
| `npm test` | Ejecuta los tests |

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🎉 Agradecimientos

- [React](https://reactjs.org/) - Framework de UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [Supabase](https://supabase.com/) - Backend como servicio
- [Gemini AI](https://ai.google.dev/) - Inteligencia artificial
- [Lucide](https://lucide.dev/) - Iconos
- [Framer Motion](https://www.framer.com/motion/) - Animaciones 