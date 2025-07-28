# 🌙 Lista de Verificación - Modo Oscuro

## ✅ **Elementos que DEBEN tener modo oscuro:**

### **1. Textos:**
- [ ] `text-gray-900` → `text-gray-900 dark:text-white`
- [ ] `text-gray-600` → `text-gray-600 dark:text-gray-300`
- [ ] `text-gray-700` → `text-gray-700 dark:text-gray-300`
- [ ] `text-gray-500` → `text-gray-500 dark:text-gray-400`

### **2. Fondos:**
- [ ] `bg-white` → `bg-white dark:bg-gray-800`
- [ ] `bg-gray-50` → `bg-gray-50 dark:bg-gray-900`
- [ ] `bg-gray-100` → `bg-gray-100 dark:bg-gray-800`
- [ ] `bg-white/60` → `bg-white/60 dark:bg-gray-800/60`

### **3. Bordes:**
- [ ] `border-gray-200` → `border-gray-200 dark:border-gray-700`
- [ ] `border-gray-300` → `border-gray-300 dark:border-gray-600`
- [ ] `border-gray-100` → `border-gray-100 dark:border-gray-700`

### **4. Estados Hover:**
- [ ] `hover:bg-gray-50` → `hover:bg-gray-50 dark:hover:bg-gray-700`
- [ ] `hover:text-gray-600` → `hover:text-gray-600 dark:hover:text-gray-300`
- [ ] `hover:border-gray-300` → `hover:border-gray-300 dark:hover:border-gray-500`

### **5. Placeholders:**
- [ ] `placeholder-gray-500` → `placeholder-gray-500 dark:placeholder-gray-400`

### **6. Gradientes:**
- [ ] `from-gray-50` → `from-gray-50 dark:from-gray-800`
- [ ] `to-gray-100` → `to-gray-100 dark:to-gray-900`

## 📋 **Páginas a Verificar:**

### **1. Home (`/`)**
- [ ] Hero section - textos y fondos
- [ ] Botones CTA - fondos y bordes
- [ ] Tarjetas de beneficios - fondos y textos
- [ ] Sección de características - fondos y textos
- [ ] Sección "Cómo funciona" - fondos y textos
- [ ] Sección de beneficios - fondos y textos
- [ ] CTA final - botones y textos

### **2. Login (`/login`)**
- [ ] Fondo principal - gradiente
- [ ] Tarjeta de login - fondo y bordes
- [ ] Campos de formulario - fondos, bordes y textos
- [ ] Labels y placeholders - colores
- [ ] Mensajes de error - colores
- [ ] Botones - fondos y textos
- [ ] Sección derecha - todos los elementos

### **3. Registro (`/registro`)**
- [ ] Fondo principal - gradiente
- [ ] Tarjeta de registro - fondo y bordes
- [ ] Campos de formulario - fondos, bordes y textos
- [ ] Labels y placeholders - colores
- [ ] Mensajes de error - colores
- [ ] Botones - fondos y textos
- [ ] Sección derecha - todos los elementos

### **4. Header (todas las páginas)**
- [ ] Fondo del header - fondo y bordes
- [ ] Logo y texto - colores
- [ ] Enlaces de navegación - colores y hover
- [ ] Botón de tema - colores
- [ ] Menú móvil - fondos y textos

### **5. Footer (todas las páginas)**
- [ ] Fondo del footer - fondo y bordes
- [ ] Textos y enlaces - colores
- [ ] Iconos - colores

### **6. Dashboard (`/dashboard`)**
- [ ] Fondo principal - fondo
- [ ] Sidebar - fondo y bordes
- [ ] Tarjetas de tareas - fondos y textos
- [ ] Modales - fondos y textos
- [ ] Formularios - todos los elementos

## 🔧 **Comandos Útiles:**

### **Ejecutar script automático:**
```bash
cd frontend
node scripts/fix-dark-mode.js
```

### **Buscar elementos sin modo oscuro:**
```bash
# Buscar textos sin dark:
grep -r "text-gray-[0-9]" src/ | grep -v "dark:"

# Buscar fondos sin dark:
grep -r "bg-gray-[0-9]" src/ | grep -v "dark:"

# Buscar bordes sin dark:
grep -r "border-gray-[0-9]" src/ | grep -v "dark:"
```

## 🎯 **Verificación Manual:**

### **1. Cambiar tema y verificar:**
- [ ] Hacer clic en el botón de tema en el header
- [ ] Verificar que todos los elementos cambien correctamente
- [ ] Probar en todas las páginas principales

### **2. Verificar contraste:**
- [ ] Textos legibles en modo claro
- [ ] Textos legibles en modo oscuro
- [ ] Contraste suficiente en ambos modos

### **3. Verificar transiciones:**
- [ ] Transiciones suaves entre temas
- [ ] Sin parpadeos o saltos
- [ ] Animaciones funcionan en ambos modos

## 🐛 **Problemas Comunes:**

### **1. Elementos que no cambian:**
- Verificar que no tengan clases hardcodeadas
- Asegurar que usen clases de Tailwind
- Revisar que no tengan estilos inline

### **2. Contraste insuficiente:**
- Usar `dark:text-white` para textos principales
- Usar `dark:text-gray-300` para textos secundarios
- Evitar colores muy claros en modo oscuro

### **3. Fondos inconsistentes:**
- Usar `dark:bg-gray-800` para contenedores principales
- Usar `dark:bg-gray-900` para fondos de página
- Usar `dark:bg-gray-700` para elementos elevados

## 📝 **Notas Importantes:**

- **Siempre probar** en ambas resoluciones (desktop y móvil)
- **Verificar** que el tema se guarde correctamente
- **Comprobar** que funcione en todas las rutas
- **Revisar** que no haya elementos que se salgan del diseño

---

**¿Necesitas ayuda con algún elemento específico?** 