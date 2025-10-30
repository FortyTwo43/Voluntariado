# Plataforma de Voluntariado Juvenil

## 📋 Descripción General

Sistema web para gestión de voluntariado que conecta organizaciones con voluntarios. Permite publicar proyectos, gestionar inscripciones, registrar asistencia y generar certificados de participación.

**Stack Tecnológico:**
- **Frontend:** Vue 3 (Composition API) + TypeScript
- **Enrutamiento:** Vue Router 4
- **Estado:** Pinia
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Build:** Vite
- **Estilos:** CSS Modules + TailwindCSS (configurado)
- **Comunicación:** EmailJS para notificaciones

---

## 📁 Estructura del Proyecto

```
voluntariado/
├── src/                      # Código fuente principal
│   ├── assets/              # Recursos estáticos (imágenes, logos)
│   ├── components/          # Componentes Vue reutilizables
│   ├── composables/         # Lógica reutilizable (custom hooks)
│   ├── config/              # Configuraciones (Supabase, constantes)
│   ├── layouts/             # Plantillas de página (wrappers)
│   ├── modules/             # Módulos de funcionalidad aislada
│   ├── router/              # Configuración de rutas
│   ├── services/            # Servicios de API/backend
│   ├── stores/              # Estado global (Pinia)
│   ├── types/               # Definiciones TypeScript
│   ├── views/               # Componentes de página/vista
│   ├── App.vue              # Componente raíz
│   ├── main.ts              # Punto de entrada
│   └── style.css            # Estilos globales
├── public/                  # Archivos públicos estáticos
├── docs/                    # Documentación adicional
├── __trash_preview_do_not_commit/  # Archivos pendientes de eliminación
├── index.html               # HTML base
├── vite.config.ts           # Configuración de Vite
├── tsconfig.json            # Configuración TypeScript
└── package.json             # Dependencias y scripts
```

---

## 🧩 Detalle de Carpetas Principales

### 📂 `src/components/`
Componentes reutilizables organizados por funcionalidad.

**Estructura:**
```
components/
├── alerts/                  # Componentes de alertas/notificaciones
├── buttons/                 # Botones customizados
├── forms/                   # Componentes de formularios
├── profile/                 # Componentes de perfil de usuario
├── proyectos/              # Componentes específicos de proyectos
│   ├── ProyectoCard.vue    # Tarjeta de proyecto (unificada con prop showActions)
│   ├── PublicProyectoCard.vue  # Wrapper legado (usa ProyectoCard)
│   ├── FormPaso1.vue       # Formulario multipaso (paso 1)
│   ├── FormPaso2.vue       # Formulario multipaso (paso 2)
│   └── FormPaso3.vue       # Formulario multipaso (paso 3)
├── ui/                      # Componentes UI generales
├── AccessibilityToggle.vue # Toggle de accesibilidad
├── ExpandableSidebar.vue   # Menú lateral expandible
├── HeroBanner.vue          # Banner hero de landing
├── LanguageToggle.vue      # Selector de idioma
├── NewsCard.vue            # Tarjeta de noticias
├── PageIndicator.vue       # Breadcrumb/indicador de página
├── ProfileMenu.vue         # Menú de perfil desplegable
└── Sidebar.vue             # Sidebar genérico
```

**Componentes Clave:**
- **`ProyectoCard.vue`**: Tarjeta unificada para mostrar proyectos. Acepta prop `showActions` (boolean) para ocultar botones de acción en modo público/solo lectura.
- **`ExpandableSidebar.vue`**: Menú lateral con hover (desktop) y click (móvil). Incluye:
  - Navegación principal
  - Submenú de accesibilidad
  - Submenú de soporte
  - Atajos de teclado (Ctrl+R registro, Ctrl+L login)
- **`HeroBanner.vue`**: Banner de bienvenida con beneficios del voluntariado y CTAs ("Regístrate ahora", "Conoce la plataforma").

---

### 📂 `src/views/`
Componentes que representan páginas completas.

**Estructura:**
```
views/
├── Auth/                    # Vistas de autenticación
│   ├── UserLoginView.vue   # Login de usuarios
│   └── RegisterVolunteerView.vue  # Registro de voluntarios
├── organizations/          # Vistas de organizaciones
│   └── RegisterOrganizationView.vue  # Registro de org
├── proyectos/              # Vistas del área de proyectos
│   ├── ListaProyectosView.vue     # Lista interna de proyectos
│   ├── CrearProyectoView.vue      # Crear nuevo proyecto
│   ├── DetalleProyectoView.vue    # Detalle de proyecto
│   ├── AsistenciaProyectoView.vue # Registro de asistencia
│   └── HorasVoluntariosView.vue   # Registro de horas
├── voluntarios/            # Vistas de voluntarios
│   └── ExplorarProyectosView.vue  # Exploración (sin uso actual)
├── ContactSupportView.vue  # Página de soporte/contacto
├── DashboardView.vue       # Dashboard (área privada)
├── HomeLandingView.vue     # Landing page (home público)
├── InstitutionalInfoView.vue  # Información institucional
├── ProfileView.vue         # Perfil de usuario
├── ProjectsView.vue        # Vista pública de proyectos (usa ProyectoCard sin acciones)
├── RegistrationSelectorView.vue  # Selector tipo de registro
└── TermsPoliciesView.vue   # Políticas y términos
```

**Vistas Públicas:**
- **`HomeLandingView.vue`**: Landing principal (hero + noticias).
- **`ProjectsView.vue`**: Lista pública de proyectos disponibles sin interacción (modo solo visualización).

**Vistas Privadas:**
- Área `/proyectos/*`: Gestión completa de proyectos (CRUD, asistencia, horas).
- `DashboardView.vue`: Panel de control post-login.

---

### 📂 `src/layouts/`
Plantillas de página que envuelven las vistas.

```
layouts/
├── AuthLayout.vue          # Layout para auth (login/registro)
├── DashboardLayout.vue     # Layout del dashboard privado
├── MainLayout.vue          # Layout genérico
├── ProyectoLayout.vue      # Layout del área de proyectos
└── PublicLayout.vue        # Layout público (header, footer, sidebar)
```

**Layout Principal Público (`PublicLayout.vue`):**
- **Header:** Logo, idioma, botones login/registro.
- **ExpandableSidebar:** Menú lateral con accesibilidad y soporte.
- **PageIndicator:** Breadcrumb de navegación.
- **Footer:** 4 secciones (Info institucional, Soporte, Políticas, Redes sociales).

**Layout de Proyectos (`ProyectoLayout.vue`):**
- Usado para las rutas internas `/proyectos/*`.
- Incluye navegación específica del módulo de proyectos.

---

### 📂 `src/router/`
Configuración de rutas de Vue Router.

```
router/
├── index.ts                # Router principal
└── modules/
    └── proyectos.ts        # Rutas modularizadas del área de proyectos
```

**Rutas Principales (`index.ts`):**
- `/` → `HomeLandingView` (landing público)
- `/proyectos-view` → `ProjectsView` (lista pública de proyectos)
- `/informacion` → `InstitutionalInfoView`
- `/contacto` → `ContactSupportView`
- `/politicas` → `TermsPoliciesView`
- `/registro` → `RegistrationSelectorView`
- `/login` → `UserLoginView`
- `/registro-voluntario` → `RegisterVolunteerView`
- `/register-organization` → `RegisterOrganizationView`

**Rutas Modulares (`modules/proyectos.ts`):**
- `/proyectos` → `ListaProyectosView` (área privada)
- `/proyectos/crear` → `CrearProyectoView`
- `/proyectos/:id` → `DetalleProyectoView`
- `/proyectos/:id/asistencia` → `AsistenciaProyectoView`
- `/proyectos/horas` → `HorasVoluntariosView`

---

### 📂 `src/composables/`
Lógica reutilizable (custom hooks de Vue).

**Composables Clave:**
```
composables/
├── useLanguage.ts          # Manejo de i18n (español/inglés)
├── useProjects.ts          # Fetch y gestión de proyectos
└── useNews.ts              # Fetch de noticias
```

**`useLanguage.ts`:**
- Gestiona idioma actual y traducciones.
- Exporta: `t` (traducciones), `currentLanguage`, `changeLanguage()`.

**`useProjects.ts`:**
- Fetch de proyectos desde Supabase (`/rest/v1/proyectos`).
- Estado: `projects`, `loading`, `error`.
- Métodos: `fetchProjects()`, `getProjectById()`.
- **Nota:** Incluye logs de debug en consola para ver URLs y status.

**`useNews.ts`:**
- Fetch de noticias desde Supabase.
- Similar estructura a `useProjects`.

---

### 📂 `src/services/`
Servicios de comunicación con APIs externas.

```
services/
└── projectsService.ts      # Servicio de proyectos con Supabase
```

**`projectsService.ts`:**
- `getAllProjects()`: Obtiene todos los proyectos.
- `getProjectsByCategory(categoria)`: Filtra por categoría.
- Usa headers de Supabase (`SUPABASE_HEADERS`) del archivo de config.

---

### 📂 `src/config/`
Configuraciones centralizadas.

```
config/
├── supabase.ts             # Configuración de Supabase
└── sampleData.ts           # Datos de ejemplo para seed
```

**`supabase.ts`:**
```typescript
export const SUPABASE_URL = "https://...supabase.co";
export const SUPABASE_API_KEY = "eyJh...";
export const SUPABASE_HEADERS = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_API_KEY,
  "Authorization": `Bearer ${SUPABASE_API_KEY}`
};
```

**`sampleData.ts`:**
- `insertSampleProjects()`: Inserta 8 proyectos de prueba en la BD.

---

### 📂 `src/types/`
Definiciones de TypeScript.

```
types/
└── proyecto.ts             # Tipos de Proyecto
```

**`proyecto.ts`:**
```typescript
export type CategoriaProyecto = 'social' | 'educativo' | 'ambiental';

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: CategoriaProyecto;
  fecha_inicio: string;
  fecha_fin: string;
  cupo_maximo: number;
  id_organizacion: string;
  estado?: 'activo' | 'inactivo' | 'completado';
}
```

---

### 📂 `src/stores/`
Estado global con Pinia.

```
stores/
└── (archivos de stores si existen)
```

**Uso esperado:**
- Almacenar estado de usuario autenticado.
- Configuraciones globales (tema, idioma persistente).
- Cache de datos de proyectos.

---

### 📂 `src/modules/`
Módulos de funcionalidad aislada (arquitectura modular).

```
modules/
└── landing/                # Módulo de landing page
    ├── components/         # Componentes del módulo
    │   └── LandingProjectCard.vue
    └── views/              # Vistas del módulo
        └── (vacío actualmente)
```

**Propósito:**
- Organizar funcionalidades grandes en módulos independientes.
- El módulo `landing` fue creado para aislar componentes de la página de inicio.
- **Nota:** `LandingProjectCard.vue` está deprecado; se usa `ProyectoCard` unificado.

---

## 🔑 Conceptos Clave de Arquitectura

### 1. **Tarjeta de Proyecto Unificada**
- **Componente:** `src/components/proyectos/ProyectoCard.vue`
- **Props:**
  - `proyecto: Proyecto` (obligatorio)
  - `showActions?: boolean` (opcional, default: `true`)
- **Modos:**
  - **Con acciones** (`showActions=true`): Muestra botones "Ver Detalles" e "Inscribirse". Usado en área privada.
  - **Solo visualización** (`showActions=false`): Sin botones, pointer-events deshabilitados. Usado en vista pública (`ProjectsView.vue`).
- **Estilos:** Gradiente de header según categoría (social/educativo/ambiental), badge "Nuevo" si tiene menos de 30 días.

### 2. **Internacionalización (i18n)**
- **Archivo:** `src/composables/useLanguage.ts`
- **Idiomas:** Español (ES) e Inglés (EN)
- **Uso:**
  ```typescript
  const { t, currentLanguage, changeLanguage } = useLanguage()
  // En template: {{ t.heroTitle }}
  ```
- **Ubicaciones:**
  - Todos los textos visibles usan `t.clave` en lugar de strings hardcoded.
  - El objeto `t` contiene todas las traducciones según el idioma activo.

### 3. **Layouts y Rutas**
- **Layout Público:** `PublicLayout.vue` → Usado por landing, info, contacto, políticas.
- **Layout Proyectos:** `ProyectoLayout.vue` → Usado por `/proyectos/*`.
- **Enrutamiento Modular:** Las rutas de proyectos están en `router/modules/proyectos.ts` y se importan en `router/index.ts` para evitar duplicación.

### 4. **Integración con Supabase**
- **REST API:** Fetch directo con `fetch()` y headers de `config/supabase.ts`.
- **Tablas principales:**
  - `proyectos`: Proyectos de voluntariado.
  - `organizaciones`: Organizaciones publicadoras.
  - `noticias`: Noticias del sistema.
- **Autenticación:** Supabase Auth (configuración pendiente en stores).

### 5. **Accesibilidad**
- **Componente:** `ExpandableSidebar.vue` incluye submenú de accesibilidad.
- **Funciones:**
  - Aumentar/disminuir tamaño de fuente.
  - Modo alto contraste.
  - Lector de pantalla (simulado).
- **Atajos de teclado:**
  - `Ctrl+R`: Ir a registro.
  - `Ctrl+L`: Ir a login.

---

## 🗂️ Archivos de Configuración

### `vite.config.ts`
```typescript
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```
- Alias `@` apunta a `src/`.
- Importaciones: `import X from '@/components/X.vue'`.

### `tsconfig.json`
- Configuración base de TypeScript.
- Strict mode activado.

### `package.json`
**Scripts:**
- `npm run dev`: Servidor de desarrollo (Vite).
- `npm run build`: Build de producción (TypeScript + Vite).
- `npm run preview`: Preview del build.

**Dependencias Clave:**
- `vue`: Framework principal.
- `vue-router`: Enrutamiento.
- `pinia`: Estado global.
- `@supabase/supabase-js`: Cliente de Supabase.
- `@emailjs/browser`: Envío de emails.

---

## 🚀 Comandos Rápidos

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev
# → Abre http://localhost:5173

# Build producción
npm run build

# Preview build
npm run preview
```

---

## 🧹 Limpieza y Refactorización Reciente

### Archivos Movidos a `__trash_preview_do_not_commit/`
Componentes sin uso detectados y movidos temporalmente:
- `HeaderBar.vue`
- `PublicTopBar.vue`
- `PublicFooter.vue`

**Razón:** No hay referencias en el código. El header/footer público está integrado en `PublicLayout.vue`.

**Acción recomendada:** Revisar funcionamiento y eliminar carpeta si todo funciona correctamente.

### Duplicaciones Eliminadas
- **Tarjetas de proyecto:** Se unificó `PublicProyectoCard` como wrapper de `ProyectoCard` con prop `showActions=false`.
- **Rutas de proyectos:** Se extrajeron a módulo `router/modules/proyectos.ts`.

---

## 📌 Notas Importantes para Mantenimiento

### 1. **Problema actual: Error 400 en fetch de proyectos**
- **Ubicación:** `src/composables/useProjects.ts`
- **Causa probable:** Nombres de columnas o tabla incorrectos en Supabase, o RLS bloqueando la petición.
- **Debug:** Se agregaron logs de consola (`console.log`) en el fetch para ver URL exacta y status HTTP.
- **Solución:** Verificar esquema de BD y ajustar nombres de columnas/tabla en el composable.

### 2. **Vistas sin uso**
- `src/views/voluntarios/ExplorarProyectosView.vue`: No referenciada en el router. Candidato a eliminación si no se usa en futuro.

### 3. **Idioma y traducciones**
- Todas las traducciones están en `useLanguage.ts`. Si se añaden nuevos textos:
  1. Agregar clave en español e inglés dentro del composable.
  2. Usar `{{ t.nuevaClave }}` en templates.

### 4. **Supabase RLS (Row Level Security)**
- Si los fetch fallan con 403/401, revisar políticas de RLS en Supabase.
- Para testing, se puede desactivar RLS temporalmente en la tabla.

### 5. **Estilo y CSS**
- Estilos globales: `src/style.css`
- Componentes usan `<style scoped>` para evitar colisiones.
- TailwindCSS está configurado pero no se usa extensivamente; preferir CSS custom en componentes.

---

## 🔗 Rutas Públicas vs Privadas

### **Rutas Públicas** (sin autenticación)
- `/` (Home landing)
- `/proyectos-view` (Lista pública de proyectos)
- `/informacion` (Info institucional)
- `/contacto` (Soporte)
- `/politicas` (Términos)
- `/login`, `/registro`, `/registro-voluntario`, `/register-organization`

### **Rutas Privadas** (requieren auth)
- `/proyectos/*` (Gestión interna)
- Dashboard y perfiles

**Guard de rutas:** Pendiente implementar en `router/index.ts` para proteger rutas privadas.

---

## 📧 Contacto y Soporte

Para dudas sobre el código:
- Revisar este README.
- Buscar en `docs/` si hay documentación adicional.
- Contactar al equipo de desarrollo.

---

## 📝 Checklist de Desarrollo

Antes de hacer cambios:
- [ ] Revisar si el componente ya existe en `src/components/`.
- [ ] Usar `ProyectoCard` unificado en lugar de crear nuevas tarjetas.
- [ ] Agregar traducciones en `useLanguage.ts` si se añaden textos.
- [ ] Testear en móvil (sidebar debe funcionar con click).
- [ ] Verificar accesibilidad (navegación con teclado).
- [ ] Confirmar que el build pasa (`npm run build`).

---

## 🎯 Roadmap Técnico

### Pendientes de implementación:
1. **Autenticación completa:** Integrar Supabase Auth y proteger rutas privadas.
2. **Store de usuario:** Crear `stores/user.ts` para sesión activa.
3. **Gestión de estado persistente:** Guardar idioma y tema en localStorage.
4. **Tests unitarios:** Configurar Vitest para testing de componentes.
5. **CI/CD:** Pipeline de deploy automático.
6. **Optimización de bundle:** Code splitting por ruta.
7. **PWA:** Convertir en Progressive Web App.

---

**Última actualización:** Octubre 2025  
**Versión del proyecto:** 0.0.0  
**Mantenedores:** Equipo de Voluntariado Juvenil
