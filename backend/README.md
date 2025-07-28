# 🏠 HogarZen Backend

Backend API para HogarZen - Gestión inteligente del hogar con autenticación y servicios de IA.

## 🚀 Características

- **Autenticación Segura**: Sistema de autenticación con JWT y cookies HTTP-only
- **Integración con Supabase**: Base de datos y autenticación de usuarios
- **Servicios de IA**: Integración con Gemini AI para análisis de tareas y sugerencias
- **Arquitectura SOLID**: Código organizado siguiendo principios SOLID
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **CORS Configurado**: Seguridad para aplicaciones web
- **Logging**: Sistema de logs para debugging
- **Validación**: Validación de datos de entrada
- **Error Handling**: Manejo centralizado de errores

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- npm >= 8.0.0
- Cuenta en [Supabase](https://supabase.com)
- Clave API de [Google Gemini](https://makersuite.google.com/app/apikey)

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   npm run setup-backend
   ```

4. **Editar el archivo `.env.local`**
   - Reemplaza los valores placeholder con tus credenciales reales
   - Obtén las credenciales de Supabase desde: https://supabase.com/dashboard
   - Obtén la clave API de Gemini desde: https://makersuite.google.com/app/apikey

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

## 🔧 Configuración

### Variables de Entorno Requeridas

```env
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Gemini AI
VITE_GEMINI_API_KEY=your-gemini-api-key-here

# Servidor
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Seguridad
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret
```

### Configuración de Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a Settings > API
4. Copia la "Project URL" y la "anon public" key
5. Actualiza las variables en `.env.local`

### Configuración de Gemini AI

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva clave API
3. Copia la clave y actualiza `VITE_GEMINI_API_KEY` en `.env.local`

## 📡 Endpoints de la API

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/status` - Estado de autenticación

### Servicios de IA

- `GET /api/ai/status` - Estado del servicio de IA
- `GET /api/ai/config` - Configuración del servicio
- `POST /api/ai/generate` - Generar respuesta con IA
- `POST /api/ai/analyze-task` - Analizar tarea con IA
- `POST /api/ai/suggest-improvements` - Sugerir mejoras
- `POST /api/ai/validate-content` - Validar contenido

### Información del Sistema

- `GET /api/health` - Estado del servidor
- `GET /api/info` - Información de la API
- `GET /api/docs` - Documentación de la API

## 🏗️ Arquitectura

El backend sigue los principios SOLID y está organizado en capas:

```
src/
├── config/           # Configuración y variables de entorno
├── services/         # Lógica de negocio (AuthService, GeminiService)
├── controllers/      # Controladores HTTP (AuthController)
├── middleware/       # Middleware personalizado (AuthMiddleware)
├── routes/           # Definición de rutas (authRoutes, aiRoutes)
└── server.js         # Punto de entrada del servidor
```

### Principios SOLID Aplicados

- **Single Responsibility**: Cada clase tiene una responsabilidad única
- **Open/Closed**: Extensible sin modificar código existente
- **Interface Segregation**: Interfaces específicas para cada servicio
- **Dependency Inversion**: Dependencias a través de abstracciones

## 🔒 Seguridad

- **JWT Tokens**: Autenticación basada en tokens
- **HTTP-Only Cookies**: Almacenamiento seguro de sesiones
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **CORS**: Configuración de orígenes permitidos
- **Input Validation**: Validación de datos de entrada
- **Error Handling**: No exposición de información sensible

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con coverage
npm test -- --coverage
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo con nodemon
npm start           # Servidor de producción
npm test            # Ejecutar tests
npm run lint        # Verificar código con ESLint
npm run lint:fix    # Corregir errores de ESLint
npm run setup-backend # Configurar variables de entorno
```

## 🚀 Despliegue

### Variables de Entorno para Producción

```env
NODE_ENV=production
PORT=8000
CORS_ORIGIN=https://hogarzen.com
JWT_SECRET=your-secure-jwt-secret
COOKIE_SECRET=your-secure-cookie-secret
ALLOWED_ORIGINS=https://hogarzen.com,https://www.hogarzen.com
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

## 📊 Monitoreo

- **Logs**: Sistema de logging estructurado
- **Health Checks**: Endpoint `/api/health` para monitoreo
- **Error Tracking**: Captura y logging de errores
- **Performance**: Métricas de rendimiento básicas

## 🤝 Contribución

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
2. Verifica las variables de entorno
3. Revisa los logs del servidor
4. Abre un issue en GitHub

## 🔗 Enlaces Útiles

- [Documentación de Supabase](https://supabase.com/docs)
- [API de Gemini](https://ai.google.dev/docs)
- [Express.js](https://expressjs.com/)
- [JWT](https://jwt.io/) 