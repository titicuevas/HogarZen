# 🏗️ Estructura del Proyecto HogarZen

## 📁 Estructura General

```
hogarzen/
├── 📁 frontend/                 # Aplicación React/TypeScript
│   ├── 📁 src/
│   │   ├── 📁 core/            # Principio SOLID - Core Business Logic
│   │   │   ├── 📁 entities/    # Entidades de dominio
│   │   │   ├── 📁 interfaces/  # Contratos/Interfaces
│   │   │   ├── 📁 usecases/    # Casos de uso
│   │   │   └── 📁 validators/  # Validaciones de dominio
│   │   ├── 📁 infrastructure/ # Principio SOLID - Infrastructure Layer
│   │   │   ├── 📁 services/    # Servicios externos (Supabase, APIs)
│   │   │   ├── 📁 storage/     # Almacenamiento local
│   │   │   └── 📁 config/      # Configuraciones
│   │   ├── 📁 presentation/    # Principio SOLID - Presentation Layer
│   │   │   ├── 📁 components/  # Componentes React
│   │   │   ├── 📁 pages/       # Páginas
│   │   │   ├── 📁 hooks/       # Custom hooks
│   │   │   └── 📁 contexts/    # Contextos de React
│   │   └── 📁 shared/          # Código compartido
│   │       ├── 📁 utils/       # Utilidades
│   │       ├── 📁 types/       # Tipos TypeScript
│   │       └── 📁 styles/      # Estilos
│   ├── 📁 tests/               # Tests del frontend
│   └── 📁 docs/                # Documentación frontend
├── 📁 backend/                 # API Node.js/Express
│   ├── 📁 src/
│   │   ├── 📁 core/            # Principio SOLID - Core Business Logic
│   │   │   ├── 📁 entities/    # Entidades de dominio
│   │   │   ├── 📁 interfaces/  # Contratos/Interfaces
│   │   │   ├── 📁 usecases/    # Casos de uso
│   │   │   └── 📁 validators/  # Validaciones de dominio
│   │   ├── 📁 infrastructure/ # Principio SOLID - Infrastructure Layer
│   │   │   ├── 📁 database/    # Configuración de base de datos
│   │   │   ├── 📁 services/    # Servicios externos
│   │   │   └── 📁 config/      # Configuraciones
│   │   ├── 📁 presentation/    # Principio SOLID - Presentation Layer
│   │   │   ├── 📁 controllers/ # Controladores
│   │   │   ├── 📁 routes/      # Rutas
│   │   │   └── 📁 middleware/  # Middlewares
│   │   └── 📁 shared/          # Código compartido
│   │       ├── 📁 utils/       # Utilidades
│   │       └── 📁 types/       # Tipos
│   ├── 📁 tests/               # Tests del backend
│   └── 📁 docs/                # Documentación backend
├── 📁 shared/                  # Código compartido entre frontend y backend
│   ├── 📁 types/               # Tipos compartidos
│   ├── 📁 constants/           # Constantes compartidas
│   └── 📁 utils/               # Utilidades compartidas
└── 📁 docs/                    # Documentación general del proyecto
```

## 🎯 Principios SOLID Aplicados

### **S - Single Responsibility Principle (SRP)**
- Cada clase/componente tiene una sola responsabilidad
- Separación clara entre lógica de negocio, presentación e infraestructura

### **O - Open/Closed Principle (OCP)**
- Las entidades están abiertas para extensión, cerradas para modificación
- Uso de interfaces para permitir extensiones

### **L - Liskov Substitution Principle (LSP)**
- Las implementaciones pueden ser sustituidas por sus interfaces
- Polimorfismo en servicios y repositorios

### **I - Interface Segregation Principle (ISP)**
- Interfaces pequeñas y específicas
- Separación de contratos por responsabilidad

### **D - Dependency Inversion Principle (DIP)**
- Dependencias hacia abstracciones, no implementaciones
- Inyección de dependencias en servicios

## 🧪 Estrategia de Testing

### **Frontend Tests**
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Componentes y hooks
- **E2E Tests**: Playwright o Cypress

### **Backend Tests**
- **Unit Tests**: Jest
- **Integration Tests**: Supertest + Jest
- **API Tests**: Tests de endpoints

### **Shared Tests**
- **Type Tests**: Verificación de tipos TypeScript
- **Contract Tests**: Tests de interfaces compartidas 