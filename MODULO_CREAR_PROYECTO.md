# 📂 Módulo "Crear Proyecto" - Plataforma de Voluntariado Juvenil

## 🎯 Descripción

Módulo completo de creación de proyectos de voluntariado con un asistente paso a paso (wizard form) diseñado en Vue 3 + TypeScript + Pinia + Vue Router.

## 🧩 Estructura del Módulo

```
src/
├── config/
│   └── supabase.ts                     # Configuración de Supabase
├── types/
│   ├── proyecto.ts                     # Tipos para proyectos
│   └── organizacion.ts                 # Tipos para organizaciones
├── services/
│   └── proyectos.service.ts            # Servicio para gestionar proyectos
├── components/
│   └── proyectos/
│       ├── FormPaso1.vue               # Paso 1: Nombre del proyecto
│       ├── FormPaso2.vue               # Paso 2: Detalles, categoría y fechas
│       └── FormPaso3.vue               # Paso 3: Capacidad, org ID y resumen
├── views/
│   └── proyectos/
│       └── CrearProyectoView.vue       # Vista principal del asistente
└── router/
    └── modules/
        └── proyectos.ts                # Rutas de proyectos
```

## 🧰 Características Implementadas

### ✅ Tipos TypeScript

- **`ProyectoNuevo`**: Interface para crear nuevos proyectos
- **`Proyecto`**: Interface completa del proyecto con campos del backend
- **`BorradorProyecto`**: Interface para manejar borradores en localStorage
- **`CategoriaProyecto`**: Tipo literal para categorías ('social' | 'educativo' | 'ambiental')

### ✅ Servicio de Proyectos (`proyectos.service.ts`)

- `crearProyecto(data: ProyectoNuevo): Promise<Proyecto>`
- `obtenerProyectos(): Promise<Proyecto[]>`
- `obtenerProyectoPorId(id: string): Promise<Proyecto>`
- `actualizarProyecto(id: string, data: Partial<ProyectoNuevo>): Promise<Proyecto>`
- `eliminarProyecto(id: string): Promise<void>`

### ✅ Componentes del Formulario

#### **FormPaso1.vue** - Nombre del Proyecto
- Input validado con retroalimentación visual
- Validación de longitud mínima (5 caracteres) y máxima (100 caracteres)
- Mensajes de éxito y error dinámicos
- Integración con v-model

#### **FormPaso2.vue** - Detalles y Timeline
- Textarea para descripción del proyecto
- Dropdown para selección de categoría
- Inputs de fecha con validación (fecha fin no puede ser antes de fecha inicio)
- Mensajes de validación en tiempo real

#### **FormPaso3.vue** - Capacidad y Confirmación
- Input numérico para capacidad máxima
- Input para ID de organización con validación
- Resumen visual de todos los datos ingresados
- Botón para editar detalles de pasos anteriores

### ✅ Vista Principal (`CrearProyectoView.vue`)

- Asistente de 3 pasos con navegación fluida
- Barra de progreso animada (25%, 50%, 100%)
- Gestión de estado con `reactive` y `computed`
- Funcionalidad de "Guardar Borrador" en localStorage
- Recuperación automática de borradores (válidos por 7 días)
- Validación completa antes de enviar
- Manejo de errores con feedback visual
- Loader durante el envío del formulario
- Redirección automática al completar

### ✅ Rutas

```typescript
/proyectos                  # Lista de proyectos
/proyectos/crear            # Crear nuevo proyecto (wizard)
/proyectos/:id              # Detalle de un proyecto
```

### ✅ Estilos

- Variables CSS globales para consistencia visual
- Tema de colores profesional
- Diseño responsive para móviles y tablets
- Animaciones suaves y transiciones
- Componentes accesibles (ARIA-friendly)

## 🚀 Cómo Usar

### 1. Navegar al Asistente

```typescript
router.push({ name: 'proyectos-crear' });
```

O acceder directamente a `/proyectos/crear`

### 2. Completar los 3 Pasos

**Paso 1**: Ingresar el nombre del proyecto
- Mínimo 5 caracteres
- Máximo 100 caracteres

**Paso 2**: Agregar detalles
- Descripción (opcional)
- Categoría (requerida): Social, Educativo o Ambiental
- Fecha de inicio (requerida)
- Fecha de fin (requerida, debe ser posterior a fecha de inicio)

**Paso 3**: Finalizar
- Capacidad máxima de voluntarios (requerida, > 0)
- ID de la organización (requerida, mínimo 3 caracteres)
- Revisar resumen
- Confirmar y crear

### 3. Funciones Especiales

#### Guardar Borrador
- Click en "Save Draft" (disponible en pasos 1 y 2)
- Se guarda automáticamente en localStorage
- Al volver, se ofrece recuperar el borrador

#### Validaciones Automáticas
- Cada campo se valida en tiempo real
- Los botones "Next Step" y "Confirm" se deshabilitan si hay errores
- Feedback visual inmediato con iconos y colores

## 📦 Integración con Backend (Supabase)

### Configuración

El archivo `src/config/supabase.ts` contiene:

```typescript
export const SUPABASE_URL = "https://mcgpiwbyveohilfrpgwl.supabase.co";
export const SUPABASE_API_KEY = "...";
export const SUPABASE_HEADERS = { ... };
```

### Estructura de Tabla Esperada

```sql
CREATE TABLE proyectos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(20) CHECK (categoria IN ('social', 'educativo', 'ambiental')),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  cupo_maximo INTEGER NOT NULL CHECK (cupo_maximo > 0),
  id_organizacion VARCHAR(50) NOT NULL,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `src/style.css`:

```css
:root {
  --color-primary: #3b82f6;      /* Azul principal */
  --color-secondary: #667eea;    /* Morado */
  --color-success: #10b981;      /* Verde */
  --color-error: #ef4444;        /* Rojo */
}
```

### Agregar Más Pasos

1. Crear nuevo componente `FormPaso4.vue`
2. Importarlo en `CrearProyectoView.vue`
3. Agregar condición en el template
4. Actualizar lógica de porcentaje y validación

### Cambiar Categorías

Edita el tipo en `src/types/proyecto.ts`:

```typescript
export type CategoriaProyecto = 'social' | 'educativo' | 'ambiental' | 'salud' | 'tecnologia';
```

Y actualiza el dropdown en `FormPaso2.vue`.

## 🐛 Solución de Problemas

### Error: "No se encuentra el módulo 'vue'"

Instala las dependencias:

```bash
npm install
```

### Error: TypeScript "Promise" no disponible

Este es un warning de TypeScript configurado con ES5. El código funciona correctamente en navegadores modernos. Para eliminar el warning, actualiza `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "lib": ["ES2015", "DOM"]
  }
}
```

### Borrador no se guarda

Verifica que el navegador permita localStorage. Algunos navegadores en modo incógnito bloquean esta funcionalidad.

## 📝 Ejemplos de Uso

### Crear Proyecto Programáticamente

```typescript
import ProyectosService from '@/services/proyectos.service';

const nuevoProyecto = {
  nombre: 'Eco Warriors Initiative',
  descripcion: 'Proyecto de limpieza de playas',
  categoria: 'ambiental',
  fecha_inicio: '2024-08-15',
  fecha_fin: '2025-02-15',
  cupo_maximo: 50,
  id_organizacion: 'ORG-12345',
};

try {
  const proyecto = await ProyectosService.crearProyecto(nuevoProyecto);
  console.log('Proyecto creado:', proyecto);
} catch (error) {
  console.error('Error:', error);
}
```

### Obtener Todos los Proyectos

```typescript
const proyectos = await ProyectosService.obtenerProyectos();
console.log(proyectos);
```

## 🎓 Buenas Prácticas Implementadas

✅ **Tipado fuerte** con TypeScript  
✅ **Composables** de Vue 3 (Composition API)  
✅ **Validación en tiempo real**  
✅ **Manejo de errores robusto**  
✅ **Código modular y reutilizable**  
✅ **Comentarios JSDoc** en funciones  
✅ **Diseño responsive**  
✅ **Accesibilidad (a11y)**  
✅ **UX fluida** con animaciones  
✅ **Persistencia de datos** (localStorage)  

## 📄 Licencia

Este módulo es parte del proyecto de Voluntariado Juvenil.

---

**Desarrollado con ❤️ usando Vue 3, TypeScript y Supabase**
