# 🏗️ Arquitectura de HogarZen

## 📋 Resumen

HogarZen ha sido refactorizado siguiendo patrones de diseño sólidos y mejores prácticas de React. Esta documentación describe la nueva arquitectura y cómo utilizarla.

## 🎯 Patrones de Diseño Implementados

### 1. **Patrón Context + Provider**
- **AuthContext**: Manejo centralizado del estado de autenticación
- **TaskContext**: Gestión global de tareas y estado relacionado
- **Beneficios**: Estado global accesible, separación de responsabilidades

### 2. **Patrón de Custom Hooks**
- **useLocalStorage**: Manejo seguro de localStorage
- **useAsync**: Operaciones asíncronas con estados de carga/error
- **useCRUD**: Operaciones CRUD reutilizables
- **usePagination**: Paginación con estado
- **Beneficios**: Lógica reutilizable, separación de concerns

### 3. **Patrón de Component Composition**
- **Layout Components**: Estructura consistente
- **UI Components**: Componentes reutilizables (Button, Modal, etc.)
- **Beneficios**: Flexibilidad, reutilización, mantenibilidad

### 4. **Patrón Error Boundary**
- **ErrorBoundary**: Captura y maneja errores de manera elegante
- **Beneficios**: UX mejorada, debugging facilitado

## 📁 Estructura de Directorios

```
src/
├── components/
│   ├── auth/           # Componentes de autenticación
│   ├── common/         # Componentes comunes (ErrorBoundary)
│   ├── dashboard/      # Componentes del dashboard
│   ├── layout/         # Componentes de layout
│   └── ui/            # Componentes UI reutilizables
├── contexts/          # Contextos de React
├── hooks/             # Hooks personalizados
├── pages/             # Páginas principales
├── services/          # Servicios de API
├── types/             # Tipos TypeScript
└── utils/             # Utilidades
```

## 🔧 Componentes Principales

### Contextos

#### AuthContext
```typescript
const { user, login, register, logout, isAuthenticated, loading } = useAuth()
```

#### TaskContext
```typescript
const { 
  tasks, 
  userTasks, 
  createUserTask, 
  updateUserTask, 
  deleteUserTask,
  getCompletionRate 
} = useTasks()
```

### Hooks Personalizados

#### useLocalStorage
```typescript
const [value, setValue] = useLocalStorage('key', initialValue)
const { theme, toggleTheme } = useTheme()
const { notifications, updateNotificationSettings } = useNotifications()
```

#### useAsync
```typescript
const { data, loading, error, execute } = useAsync(asyncFunction)
const { items, create, update, remove } = useCRUD(createFn, updateFn, deleteFn, fetchFn)
```

### Componentes UI

#### Button
```typescript
<Button variant="primary" size="md" loading={isLoading}>
  Texto del botón
</Button>
```

#### Modal
```typescript
const { isOpen, open, close } = useModal()

<Modal isOpen={isOpen} onClose={close} title="Título">
  Contenido del modal
</Modal>
```

## 🎨 Layouts

### AuthLayout
Para páginas de autenticación (login/register)

### PublicLayout
Para páginas públicas con header y footer

### DashboardLayout
Para páginas del dashboard con sidebar

## 🛡️ Manejo de Errores

### ErrorBoundary
```typescript
<ErrorBoundary>
  <ComponenteQuePuedeFallar />
</ErrorBoundary>
```

### useAsyncError
Para errores asíncronos en hooks:
```typescript
const throwError = useAsyncError()
// En catch block:
throwError(new Error('Error message'))
```

## 🔄 Flujo de Datos

1. **Contextos** manejan el estado global
2. **Hooks personalizados** encapsulan lógica reutilizable
3. **Componentes** consumen contextos y hooks
4. **Servicios** manejan comunicación con APIs
5. **Error Boundaries** capturan errores

## 📝 Mejores Prácticas

### 1. **Uso de Contextos**
- Usar contextos para estado global
- Evitar prop drilling
- Mantener contextos específicos y enfocados

### 2. **Custom Hooks**
- Extraer lógica reutilizable a hooks
- Mantener hooks simples y enfocados
- Usar TypeScript para tipado fuerte

### 3. **Componentes**
- Componentes pequeños y enfocados
- Props tipadas con TypeScript
- Separación de responsabilidades

### 4. **Manejo de Estado**
- Estado local para UI
- Estado global para datos compartidos
- Inmutabilidad en actualizaciones

## 🚀 Migración

### Antes
```typescript
// Estado local en cada componente
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(false)

// Props drilling
<Component user={user} setUser={setUser} />
```

### Después
```typescript
// Estado global con contexto
const { user, loading } = useAuth()

// Sin props drilling
<Component />
```

## 🔮 Próximos Pasos

1. **Testing**: Implementar tests unitarios y de integración
2. **Performance**: Optimización con React.memo, useMemo, useCallback
3. **Accessibility**: Mejorar accesibilidad con ARIA labels
4. **Internationalization**: Soporte multiidioma
5. **PWA**: Convertir a Progressive Web App

## 📚 Recursos

- [React Context API](https://react.dev/reference/react/createContext)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [TypeScript](https://www.typescriptlang.org/docs/) 