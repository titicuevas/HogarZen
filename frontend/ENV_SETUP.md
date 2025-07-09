# Configuración de Variables de Entorno

Para que HogarZen funcione correctamente, necesitas configurar las siguientes variables de entorno.

## Crear archivo .env.local

Crea un archivo `.env.local` en la carpeta `frontend/` con el siguiente contenido:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# Gemini AI Configuration
VITE_GEMINI_PROJECT_ID=tu_proyecto_gemini
VITE_GEMINI_API_KEY=tu_api_key_de_gemini
```

## Obtener las credenciales

### Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings > API
4. Copia la URL y la anon key

### Gemini AI
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la clave generada

## Seguridad

- **NUNCA** subas el archivo `.env.local` a GitHub
- El archivo `.gitignore` ya está configurado para proteger las credenciales
- Mantén las credenciales seguras y no las compartas 