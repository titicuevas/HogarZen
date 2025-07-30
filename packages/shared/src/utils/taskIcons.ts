// =====================================================
// SISTEMA DE ICONOS PARA TAREAS Y CATEGORÍAS - MEJORADO
// =====================================================

import { 
  Home, 
  Wrench, 
  Droplets, 
  Zap, 
  ChefHat, 
  Tv, 
  Settings,
  Shield,
  Sparkles,
  Calendar,
  Briefcase,
  Plane,
  PartyPopper,
  Hammer,
  Sparkles as CleanIcon,
  FolderOpen,
  User,
  CheckSquare,
  Clock,
  Target,
  Star,
  Heart,
  Trophy,
  Lightbulb,
  BookOpen,
  Music,
  Camera,
  Gamepad2,
  Car,
  Bike,
  Dumbbell,
  Utensils,
  Coffee,
  ShoppingCart,
  Gift,
  TreePine,
  Flower2,
  Baby,
  Dog,
  Cat,
  Fish,
  Bird,
  Trash2,
  Paintbrush,
  Bell,
  Flame,
  Lock,
  Leaf,
  Filter,
  Bus,
  Users,
  Ghost,
  Sun,
  Snowflake,
  AlertTriangle,
  Scissors,
  Eye,
  Cloud,
  Video,
  Wifi,
  Pill,
  Bed,
  Monitor,
  Laptop,
  Mail,
  Phone,
  Train,
  Fuel,
  GraduationCap,
  CloudRain,
  CreditCard,
  FileText,
  Building,
  DollarSign,
  Calculator,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Smartphone,
  Tablet,
  Battery,
  RefreshCw,
  Download,
  Upload,
  HardDrive,
  Presentation
} from 'lucide-react'

// =====================================================
// ICONOS POR CATEGORÍA DE TAREA
// =====================================================

export const taskCategoryIcons = {
  seguridad: Shield,
  electrodomesticos: Zap,
  agua: Droplets,
  energia: Zap,
  cocina: ChefHat,
  entretenimiento: Tv,
  general: Settings,
  mantenimiento: Wrench,
  limpieza: CleanIcon,
  organizacion: FolderOpen,
  personal: User,
  hogar: Home,
  trabajo: Briefcase,
  viaje: Plane,
  evento: PartyPopper,
  otro: CheckSquare
}

// =====================================================
// ICONOS POR CATEGORÍA DE CHECKLIST
// =====================================================

export const checklistCategoryIcons = {
  hogar: Home,
  trabajo: Briefcase,
  viaje: Plane,
  evento: PartyPopper,
  mantenimiento: Wrench,
  limpieza: CleanIcon,
  organizacion: FolderOpen,
  personal: User,
  otro: CheckSquare
}

// =====================================================
// ICONOS ESPECÍFICOS PARA TAREAS COMUNES - SISTEMA MEJORADO
// =====================================================

export const taskSpecificIcons = {
  // =====================================================
  // LIMPIEZA Y ORGANIZACIÓN
  // =====================================================
  'limpiar': CleanIcon,
  'limpiar casa': CleanIcon,
  'limpiar habitación': CleanIcon,
  'limpiar cocina': CleanIcon,
  'limpiar baño': CleanIcon,
  'limpiar sala': CleanIcon,
  'aspirar': CleanIcon,
  'barrer': CleanIcon,
  'fregar': CleanIcon,
  'pulir': CleanIcon,
  'lavar': Droplets,
  'lavar ropa': Droplets,
  'lavar platos': Droplets,
  'secar': Sparkles,
  'planchar': Sparkles,
  'ordenar': FolderOpen,
  'organizar': FolderOpen,
  'ordenar habitación': FolderOpen,
  'organizar armario': FolderOpen,
  'clasificar': FolderOpen,
  'archivar': FolderOpen,
  'tirar basura': Trash2,
  'reciclar': Trash2,
  'hacer la cama': Heart,
  'tender cama': Heart,
  
  // =====================================================
  // COCINA Y ALIMENTACIÓN
  // =====================================================
  'cocinar': ChefHat,
  'preparar comida': ChefHat,
  'hacer comida': ChefHat,
  'cocinar cena': ChefHat,
  'cocinar almuerzo': ChefHat,
  'desayunar': Coffee,
  'café': Coffee,
  'té': Coffee,
  'hacer compras': ShoppingCart,
  'ir al supermercado': ShoppingCart,
  'comprar comida': ShoppingCart,
  'comprar víveres': ShoppingCart,
  'utensilios': Utensils,
  'platos': Utensils,
  'cubiertos': Utensils,
  
  // =====================================================
  // MANTENIMIENTO Y REPARACIONES
  // =====================================================
  'reparar': Wrench,
  'arreglar': Wrench,
  'mantener': Wrench,
  'revisar': Wrench,
  'herramientas': Hammer,
  'pintar': Paintbrush,
  'jardín': TreePine,
  'jardinería': TreePine,
  'plantas': Flower2,
  'flores': Flower2,
  'regar': Droplets,
  'podar': Scissors,
  'cortar': Scissors,
  
  // =====================================================
  // SEGURIDAD
  // =====================================================
  'cerrar': Lock,
  'cerrar puertas': Lock,
  'cerrar ventanas': Lock,
  'cerrar con llave': Lock,
  'revisar alarmas': Bell,
  'alarma': Bell,
  'seguridad': Shield,
  'extintor': Flame,
  'candados': Lock,
  'vigilar': Eye,
  
  // =====================================================
  // ENERGÍA Y UTILIDADES
  // =====================================================
  'luz': Lightbulb,
  'luces': Lightbulb,
  'apagar luces': Lightbulb,
  'encender luces': Lightbulb,
  'electricidad': Zap,
  'desconectar': Zap,
  'conectar': Zap,
  'ahorrar energía': Leaf,
  'energía': Zap,
  'agua': Droplets,
  'revisar grifos': Droplets,
  'grifos': Droplets,
  'limpiar filtros': Filter,
  'filtros': Filter,
  'ahorrar agua': Droplets,
  'gas': Flame,
  'calefacción': Flame,
  'aire acondicionado': Snowflake,
  'clima': Cloud,
  
  // =====================================================
  // ENTRETENIMIENTO Y OCIO
  // =====================================================
  'tv': Tv,
  'televisión': Tv,
  'ver tv': Tv,
  'música': Music,
  'escuchar música': Music,
  'leer': BookOpen,
  'libro': BookOpen,
  'estudiar': BookOpen,
  'juegos': Gamepad2,
  'jugar': Gamepad2,
  'fotos': Camera,
  'fotografías': Camera,
  'video': Video,
  'película': Video,
  'internet': Wifi,
  'wifi': Wifi,
  
  // =====================================================
  // SALUD Y BIENESTAR
  // =====================================================
  'ejercicio': Dumbbell,
  'gimnasio': Dumbbell,
  'correr': Dumbbell,
  'caminar': Dumbbell,
  'medicina': Pill,
  'medicamentos': Pill,
  'doctor': User,
  'médico': User,
  'farmacia': Pill,
  'vitaminas': Pill,
  'descansar': Bed,
  'dormir': Bed,
  'siesta': Bed,
  
  // =====================================================
  // TRABAJO Y PRODUCTIVIDAD
  // =====================================================
  'trabajo': Briefcase,
  'oficina': Briefcase,
  'proyecto': Briefcase,
  'reunión': Users,
  'presentación': Presentation,
  'cliente': User,
  'jefe': User,
  'equipo': Users,
  'despacho': Briefcase,
  'computadora': Monitor,
  'laptop': Laptop,
  'email': Mail,
  'correo': Mail,
  'llamada': Phone,
  'teléfono': Phone,
  
  // =====================================================
  // TRANSPORTE Y MOVILIDAD
  // =====================================================
  'coche': Car,
  'auto': Car,
  'carro': Car,
  'bicicleta': Bike,
  'bici': Bike,
  'transporte': Bus,
  'bus': Bus,
  'metro': Train,
  'tren': Train,
  'taxi': Car,
  'uber': Car,
  'gasolina': Fuel,
  'combustible': Fuel,
  'estacionar': Car,
  'parking': Car,
  
  // =====================================================
  // MASCOTAS
  // =====================================================
  'perro': Dog,
  'gato': Cat,
  'peces': Fish,
  'pájaros': Bird,
  'mascota': Dog,
  'alimentar': Dog,
  'pasear': Dog,
  'veterinario': User,
  'veterinaria': User,
  
  // =====================================================
  // FAMILIA Y RELACIONES
  // =====================================================
  'familia': Heart,
  'hijos': Baby,
  'niños': Baby,
  'bebé': Baby,
  'padres': Users,
  'abuelos': Users,
  'amigos': Users,
  'pareja': Heart,
  'esposo': User,
  'esposa': User,
  
  // =====================================================
  // EVENTOS Y CELEBRACIONES
  // =====================================================
  'cumpleaños': Gift,
  'fiesta': PartyPopper,
  'celebración': Trophy,
  'reunión': Users,
  'boda': Heart,
  'aniversario': Heart,
  'graduación': GraduationCap,
  'regalo': Gift,
  'invitados': Users,
  'decoración': Sparkles,
  
  // =====================================================
  // TEMPORADAS Y CLIMA
  // =====================================================
  'navidad': TreePine,
  'halloween': Ghost,
  'verano': Sun,
  'invierno': Snowflake,
  'primavera': Flower2,
  'otoño': Leaf,
  'lluvia': CloudRain,
  'sol': Sun,
  'nublado': Cloud,
  
  // =====================================================
  // FINANZAS Y ADMINISTRACIÓN
  // =====================================================
  'pagar': CreditCard,
  'factura': FileText,
  'impuestos': FileText,
  'banco': Building,
  'dinero': DollarSign,
  'presupuesto': Calculator,
  'gastos': TrendingDown,
  'ingresos': TrendingUp,
  'ahorrar': PiggyBank,
  
  // =====================================================
  // TECNOLOGÍA Y DISPOSITIVOS
  // =====================================================
  'celular': Smartphone,
  'móvil': Smartphone,
  'tablet': Tablet,
  'cargar': Battery,
  'batería': Battery,
  'actualizar': RefreshCw,
  'descargar': Download,
  'subir': Upload,
  'backup': HardDrive,
  'respaldo': HardDrive
}

// =====================================================
// EMOJIS POR CATEGORÍA
// =====================================================

export const categoryEmojis = {
  seguridad: '🛡️',
  electrodomesticos: '⚡',
  agua: '💧',
  energia: '⚡',
  cocina: '👨‍🍳',
  entretenimiento: '📺',
  general: '⚙️',
  mantenimiento: '🔧',
  limpieza: '🧹',
  organizacion: '📁',
  personal: '👤',
  hogar: '🏠',
  trabajo: '💼',
  viaje: '✈️',
  evento: '🎉',
  otro: '📋'
}

export const checklistCategoryEmojis = {
  hogar: '🏠',
  trabajo: '💼',
  viaje: '✈️',
  evento: '🎉',
  mantenimiento: '🔧',
  limpieza: '🧹',
  organizacion: '📁',
  personal: '👤',
  otro: '📋'
}

// =====================================================
// FUNCIONES DE UTILIDAD
// =====================================================

/**
 * Obtiene el icono apropiado para una tarea basado en su título
 */
export const getTaskIcon = (taskTitle: string, category?: string) => {
  const title = taskTitle.toLowerCase()
  
  // Buscar coincidencias específicas
  for (const [key, icon] of Object.entries(taskSpecificIcons)) {
    if (title.includes(key)) {
      return icon
    }
  }
  
  // Si no hay coincidencia específica, usar el icono de categoría
  if (category && taskCategoryIcons[category as keyof typeof taskCategoryIcons]) {
    return taskCategoryIcons[category as keyof typeof taskCategoryIcons]
  }
  
  // Icono por defecto
  return CheckSquare
}

/**
 * Obtiene el emoji apropiado para una tarea
 */
export const getTaskEmoji = (taskTitle: string, category?: string) => {
  const title = taskTitle.toLowerCase()
  
  // Buscar coincidencias específicas en el título
  const specificEmojis: Record<string, string> = {
    'limpiar': '🧹',
    'lavar': '💧',
    'cocinar': '👨‍🍳',
    'comprar': '🛒',
    'reparar': '🔧',
    'ordenar': '📁',
    'ejercicio': '💪',
    'leer': '📖',
    'música': '🎵',
    'tv': '📺',
    'juego': '🎮',
    'foto': '📸',
    'café': '☕',
    'comida': '🍽️',
    'agua': '💧',
    'luz': '💡',
    'seguridad': '🛡️',
    'mascota': '🐕',
    'familia': '👨‍👩‍👧‍👦',
    'trabajo': '💼',
    'viaje': '✈️',
    'fiesta': '🎉',
    'cumpleaños': '🎂',
    'regalo': '🎁',
    'jardín': '🌱',
    'plantas': '🌿',
    'flores': '🌸',
    'herramientas': '🔨',
    'pintar': '🎨',
    'cama': '🛏️',
    'ropa': '👕',
    'platos': '🍽️',
    'basura': '🗑️',
    'reciclar': '♻️',
    'alarma': '🔔',
    'puertas': '🚪',
    'ventanas': '🪟',
    'grifos': '🚰',
    'filtros': '🔍',
    'gas': '🔥',
    'calefacción': '🔥',
    'aire': '❄️',
    'internet': '🌐',
    'wifi': '📶',
    'medicina': '💊',
    'doctor': '👨‍⚕️',
    'farmacia': '💊',
    'gimnasio': '🏋️',
    'correr': '🏃',
    'caminar': '🚶',
    'dormir': '😴',
    'descansar': '😴',
    'oficina': '🏢',
    'proyecto': '📋',
    'reunión': '👥',
    'presentación': '📊',
    'computadora': '💻',
    'laptop': '💻',
    'email': '📧',
    'teléfono': '📞',
    'coche': '🚗',
    'auto': '🚗',
    'bicicleta': '🚲',
    'transporte': '🚌',
    'metro': '🚇',
    'tren': '🚆',
    'gasolina': '⛽',
    'perro': '🐕',
    'gato': '🐱',
    'peces': '🐠',
    'pájaros': '🐦',
    'hijos': '👶',
    'niños': '👶',
    'bebé': '👶',
    'padres': '👨‍👩‍👧‍👦',
    'amigos': '👥',
    'pareja': '💑',
    'boda': '💒',
    'aniversario': '💕',
    'graduación': '🎓',
    'invitados': '👥',
    'decoración': '🎨',
    'navidad': '🎄',
    'halloween': '🎃',
    'verano': '☀️',
    'invierno': '❄️',
    'primavera': '🌸',
    'otoño': '🍂',
    'lluvia': '🌧️',
    'sol': '☀️',
    'nublado': '☁️',
    'pagar': '💳',
    'factura': '📄',
    'banco': '🏦',
    'dinero': '💰',
    'presupuesto': '📊',
    'gastos': '📉',
    'ingresos': '📈',
    'ahorrar': '🏦',
    'celular': '📱',
    'móvil': '📱',
    'tablet': '📱',
    'batería': '🔋',
    'cargar': '🔌',
    'actualizar': '🔄',
    'descargar': '⬇️',
    'subir': '⬆️',
    'backup': '💾',
    'respaldo': '💾'
  }
  
  for (const [key, emoji] of Object.entries(specificEmojis)) {
    if (title.includes(key)) {
      return emoji
    }
  }
  
  // Si no hay coincidencia específica, usar el emoji de categoría
  if (category && categoryEmojis[category as keyof typeof categoryEmojis]) {
    return categoryEmojis[category as keyof typeof categoryEmojis]
  }
  
  // Emoji por defecto
  return '📋'
}

/**
 * Obtiene el icono para una categoría de checklist
 */
export const getChecklistCategoryIcon = (category: string) => {
  return checklistCategoryIcons[category as keyof typeof checklistCategoryIcons] || CheckSquare
}

/**
 * Obtiene el emoji para una categoría de checklist
 */
export const getChecklistCategoryEmoji = (category: string) => {
  return checklistCategoryEmojis[category as keyof typeof checklistCategoryEmojis] || '📋'
}

// =====================================================
// ICONOS DE ESTADO
// =====================================================

export const statusIcons = {
  completed: CheckSquare,
  pending: Clock,
  inProgress: Target,
  overdue: AlertTriangle,
  starred: Star,
  important: Heart,
  urgent: Zap
}

export const statusEmojis = {
  completed: '✅',
  pending: '⏰',
  inProgress: '🎯',
  overdue: '⚠️',
  starred: '⭐',
  important: '❤️',
  urgent: '⚡'
} 