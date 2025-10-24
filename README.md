# Voluntariado Juvenil – Plataforma de Voluntariado en Ecuador (Vue 3 + TS)

Esta plataforma conecta voluntarios con organizaciones sin fines de lucro en Ecuador, facilitando la búsqueda y postulación a proyectos de impacto social. El diseño prioriza la usabilidad según ISO 9241-110 y la accesibilidad WCAG 2.1 AA.

**Tecnologías:** Vue 3 (Composition API), TypeScript, Vite, Supabase, NewsData.io API, Material Symbols.

## 🌟 Características principales

- **Landing pública** con hero banner y noticias actualizadas
- **Búsqueda de proyectos** con filtros por categoría, ubicación y búsqueda por texto
- **Integración con API de noticias** de voluntariado en Ecuador
- **Registro unificado** para voluntarios y organizaciones
- **Base de datos Supabase** para gestión de proyectos y organizaciones
- **Diseño responsive** con menú dropdown y navegación intuitiva

## 🧭 Estructura de navegación

### Componentes principales

- **PublicLayout.vue**: Layout principal con header sticky, menú dropdown, background image y footer
- **HomeLandingView.vue**: Vista de inicio con hero banner y grid de noticias
- **ProjectsView.vue**: Búsqueda y exploración de proyectos con paginación
- **RegistrationSelectorView.vue**: Selector de tipo de registro (voluntario/organización)

### Rutas públicas

- `/` - Página de inicio
- `/proyectos` - Búsqueda de proyectos de voluntariado
- `/registro` - Selector de tipo de registro
- `/registro-voluntario` - Formulario de registro para voluntarios
- `/register-organization` - Formulario de registro para organizaciones
- `/politicas` - Términos y políticas de privacidad
- `/informacion` - Información institucional
- `/contacto` - Contacto y soporte
- `/login` - Inicio de sesión

## 🔌 Integración de APIs

### NewsData.io API

La aplicación consume noticias relacionadas con voluntariado en Ecuador mediante **NewsData.io API**:

- **API Key**: `pub_62982cb22555c8ecea62d2f638ada91fe4c74`
- **Plan**: Free tier (200 requests/día)
- **Búsqueda**: Keywords: "voluntariado", "volunteer", "ayuda social", "ONG"
- **Filtros**: País Ecuador (ec), idioma español (es)
- **Fallback**: Datos locales de ejemplo si la API no responde

**Composable**: `src/composables/useNews.ts`

```typescript
// Uso en componentes
const { news, loading, error, fetchNews } = useNews()
await fetchNews(4) // Obtiene las 4 noticias más recientes
```

### Supabase Database

- **URL**: `https://mcgpiwbyveohilfrpgwl.supabase.co`
- **Tablas**:
  - `id_proyecto`: Proyectos de voluntariado
  - `id_organizacion`: Organizaciones registradas

**Composable**: `src/composables/useProjects.ts`

```typescript
// Uso en componentes
const { projects, loading, error, fetchProjects } = useProjects()
await fetchProjects({ categoria: 'Educación', ubicacion: 'Quito' })
```

## 🎨 Identidad visual (color corporativo)

En `src/style.css` se aplicó la paleta primaria en rojo:

```css
:root {
   --color-primary: #e53935;      /* rojo corporativo */
   --color-primary-dark: #c62828; /* rojo oscuro */
}
```

Los botones y estados de foco/hover usan esta paleta de forma consistente.

## ✅ Mapeo contra la rúbrica

### 1) Cognitiva
- Diseño limpio: sin banners rotativos ni animaciones automáticas.
- Foco visible en enlaces y botones (`:focus-visible`).
- Mensajería clara: CTA “Soporte/Contacto” visible; textos breves.
- Skip-link: enlace “Saltar al contenido” para evitar navegación redundante con teclado.

Pruebas sugeridas:
- Evaluación cualitativa (1–5) de claridad visual y brevedad.
- Recorrido con Tab desde el skip-link; el foco debe ser siempre visible.

### 2) Responsive
- Header sticky, grid fluido.
- Menú móvil “hamburguesa” con dropdown simple.

Prueba y métrica:
- 320–1440 px sin scroll lateral. Tiempo de carga percibido < 2 s (Lighthouse orientativo).

### 3) Plantilla común de formularios
- Form de `ContactSupportView.vue` usa estilos globales coherentes (inputs, focus rojo, botones).

Prueba:
- Checklist visual de consistencia de campos/labels/placeholders. Likert 1–5.

### 4) Cabecera
- Logo + nombre, selector de idioma ES/EN persistente (`useLanguage.ts`).
- Búsqueda visible en desktop (UI). 
- Estado de navegación: enlace activo resaltado en topbar y menú móvil.

Pruebas y métricas:
- Nº de clics para llegar a políticas/contacto ≤ 3.
- Cambio de idioma persiste tras recargar (localStorage).

### 5) Menú
- Ítems con etiquetas claras y submenú “Información”.
- Apertura por hover y por foco (teclado). Cierra con Esc.
- Roles/atributos: `aria-haspopup`, `aria-expanded`, `aria-controls` en el toggler.

Pruebas y métricas:
- Teclado: Tab al botón “Información” → submenú visible; navegar items con Tab/Shift+Tab; Enter para ir. 
- Tasa de error < 0.5% en 10 intentos (usuarios internos). Evaluación de intuición 1–5.

### 6) Cuerpo
- Hero de bienvenida y tarjetas de “Novedades y noticias”.
- Componentización para modularidad y mantenimiento.

Métrica sugerida:
- Tiempo de lectura y nº de scrolls para ubicar información clave; abandono < 10% (test guiado).

### 7) Pie de página
- Enlaces operativos: 100% (Contacto, Información, Políticas).
- Nº de clics ≤ 2 para acceder.

## 🧪 Guía de pruebas (paso a paso)

1) Teclado y accesibilidad
- Presiona Tab al cargar: aparece “Saltar al contenido”; Enter te lleva al `<main>`.
- Sigue con Tab: al enfocarte en “Información” el submenú se abre (focus-within).
- Pulsa Esc: el submenú se cierra.
- Cambia a EN/ES con los botones; recarga y verifica persistencia.

2) Flujo y eficiencia
- Tarea A: Ir a Políticas desde Home → ≤ 2 clics.
- Tarea B: Ir a Contacto → ≤ 2 clics.
- Tarea C: Regresar a Home → ≤ 2 clics.

3) Responsive rápido
- Revisa la vista en 320 px y 1440 px; no debe haber scroll horizontal.

4) Consistencia de formularios
- En Contacto: los inputs tienen el mismo padding, borde y foco rojo; botón principal en rojo.

5) Lighthouse (opcional)
- Corre Lighthouse y verifica A11y ≥ 90, Best Practices/Performance aceptables.

## 📁 Estructura mínima relevante

```
src/
├─ components/
│  ├─ PublicTopBar.vue      # Cabecera con menú accesible y búsqueda desktop
│  ├─ PublicFooter.vue      # Pie con enlaces informativos
│  ├─ HeroBanner.vue        # Hero de bienvenida
│  └─ NewsCard.vue          # Tarjetas de novedades
├─ views/
│  ├─ HomeLandingView.vue
│  ├─ TermsPoliciesView.vue
│  ├─ InstitutionalInfoView.vue
│  └─ ContactSupportView.vue
├─ layouts/
│  └─ PublicLayout.vue      # Skip-link + layout público
├─ composables/
│  └─ useLanguage.ts        # i18n simple (ES/EN) con persistencia
├─ router/
│  └─ index.ts              # Rutas públicas
└─ style.css                # Variables, utilidades y foco rojo
```

## �️ Cómo ejecutar

Instala y levanta el proyecto en local.

```bash
npm install
npm run dev
```

Build de producción (ya verificado en esta rama):

```bash
npm run build
npm run preview
```

## 📌 Notas y límites

- Esta rama elimina la navegación de dashboard; el foco está en la landing pública y páginas informativas.
- El campo de búsqueda es UI (no conectado a backend todavía). Si se requiere, puedo enlazarlo a un filtro local o a un servicio.

## 📚 Evidencia de cumplimiento

- Color corporativo rojo aplicado globalmente.
- Menú accesible (hover + teclado + Esc + aria).
- Enlace activo visible en navegación.
- Skip-link para salto directo al contenido.
- Formulario de contacto coherente con la plantilla de estilos.

Con esta guía y las pruebas propuestas, puedes sustentar cada ítem de la rúbrica de manera objetiva.

