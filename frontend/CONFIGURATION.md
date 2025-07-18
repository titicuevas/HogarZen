# ⚙️ Configuración - HogarZen Frontend

Este documento explica cómo configurar el frontend de HogarZen para diferentes entornos.

## 🚀 Configuración Rápida

### 1. Variables de Entorno

Crea un archivo `.env.local` en la carpeta `frontend/`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# Gemini AI Configuration
VITE_GEMINI_API_KEY=tu_api_key_de_gemini

# API Configuration (opcional)
VITE_API_URL=http://localhost:8000

# Docker Configuration (opcional)
VITE_DOCKER=false
```

### 2. Obtener Credenciales

#### Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un proyecto o accede a uno existente
3. Ve a **Settings > API**
4. Copia:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJ...` (empieza con eyJ)

#### Gemini AI
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la clave generada

## 🐳 Configuración Docker

### Desarrollo
```bash
# Usar docker-compose.yml
docker-compose up --build
```

### Producción
```bash
# Usar docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up --build
```

### Variables de Entorno en Docker

```bash
# En docker-compose.yml
environment:
  - VITE_SUPABASE_URL=${SUPABASE_URL}
  - VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
  - VITE_GEMINI_API_KEY=${GEMINI_API_KEY}
  - VITE_API_URL=${API_URL}
  - VITE_DOCKER=true
```

## 🔧 Entornos

### Desarrollo Local
```bash
npm run dev
```

### Producción
```bash
npm run build
npm run preview
```

### Docker
```bash
docker-compose up --build
```

## 🛡️ Seguridad

- **NUNCA** subas `.env.local` a GitHub
- Usa variables de entorno diferentes para cada entorno
- Las credenciales se validan automáticamente al iniciar
- El sistema muestra errores claros si falta configuración

## 🔍 Solución de Problemas

### Error: "Configuración Requerida"
- Verifica que `.env.local` existe
- Asegúrate de que las variables empiecen con `VITE_`
- Revisa que no haya espacios extra

### Error: "Invalid URL"
- Verifica que las URLs incluyan `https://`
- Asegúrate de que las URLs sean válidas

### Error: "API key no válida"
- Verifica que las API keys sean correctas
- Asegúrate de que tengan los permisos necesarios

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador
2. Verifica la configuración con el ConfigChecker
3. Contacta: hola@hogarzen.com 