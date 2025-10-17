# Voluntariado Juvenil

Plataforma web para gestionar proyectos de voluntariado juvenil. Desarrollado con Vue 3, TypeScript y CSS tradicional.

## 🚀 Características

- ✅ Dashboard interactivo con estadísticas
- ✅ Exploración de proyectos de voluntariado
- ✅ Sistema de navegación con sidebar colapsable
- ✅ Header con búsqueda y perfil de usuario
- ✅ **Sistema de idiomas (ES/EN)** con persistencia
- ✅ Panel de accesibilidad con opciones de:
  - Modo oscuro
  - Ajuste de tamaño de fuente
  - Alto contraste
  - Reducción de movimiento
- ✅ Diseño responsive
- ✅ **CSS tradicional (sin Tailwind)** para mayor control y facilidad de mantenimiento

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── AccessibilityToggle.vue   # Panel de opciones de accesibilidad
│   ├── HeaderBar.vue              # Barra superior con búsqueda y selector de idioma
│   ├── ProfileMenu.vue            # Menú desplegable del perfil
│   └── Sidebar.vue                # Navegación lateral
├── composables/
│   └── useLanguage.ts             # Composable para gestión de idiomas (i18n)
├── layouts/
│   └── DashboardLayout.vue        # Layout principal con sidebar y header
├── views/
│   ├── DashboardView.vue          # Vista principal con estadísticas
│   └── ProjectsView.vue           # Vista de exploración de proyectos
├── router/
│   └── index.ts                   # Configuración de rutas
├── config/
│   └── supabase.ts                # Configuración de Supabase
├── App.vue                        # Componente raíz
├── main.ts                        # Punto de entrada
└── style.css                      # Estilos globales CSS tradicional
```

## 🛠️ Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en `http://localhost:5173`

## 🎨 Estilos CSS Tradicional

El proyecto usa **CSS tradicional** en lugar de frameworks como Tailwind. Los estilos están organizados de la siguiente manera:

- **`src/style.css`**: Variables CSS globales, reset, utilidades básicas
- **Componentes**: Cada componente Vue tiene sus estilos `scoped`
- **Variables CSS**: Sistema de colores y tamaño con variables CSS nativas

### Variables CSS disponibles:

```css
--color-primary: #4f46e5
--color-secondary: #f59e0b
--color-background: #f9fafb
--color-surface: #ffffff
--color-text: #111827
--color-text-secondary: #6b7280
--color-border: #e5e7eb
```

## 📱 Rutas Disponibles

- `/` - Dashboard principal
- `/proyectos` - Exploración de proyectos
- `/organizaciones` - Organizaciones (pendiente)
- `/perfil` - Perfil de usuario (pendiente)
- `/mensajes` - Mensajes (pendiente)
- `/configuracion` - Configuración (pendiente)

## ♿ Accesibilidad

El proyecto incluye un panel de accesibilidad flotante (botón en la esquina inferior derecha) con:

- **Modo oscuro**: Cambia el tema de claro a oscuro
- **Tamaño de fuente**: Ajusta el tamaño del texto (80% - 150%)
- **Alto contraste**: Mejora la visibilidad del contenido
- **Reducir movimiento**: Desactiva animaciones para usuarios sensibles

## 🌐 Internacionalización

El proyecto soporta **cambio de idioma en tiempo real** entre:
- **Español (ES)** - Idioma por defecto
- **English (EN)**

**Características del sistema i18n:**
- ✅ Botones de cambio de idioma en el HeaderBar
- ✅ Persistencia en localStorage
- ✅ Composable reutilizable `useLanguage()`
- ✅ Traducciones centralizadas
- ✅ Reactivo en toda la aplicación

Ver documentación completa en [`docs/IDIOMAS.md`](docs/IDIOMAS.md)

## 🔧 Tecnologías Utilizadas

- **Vue 3** - Framework JavaScript progresivo
- **TypeScript** - Superset tipado de JavaScript
- **Vue Router** - Enrutamiento oficial para Vue.js
- **Vite** - Build tool y dev server
- **CSS tradicional** - Estilos puros sin frameworks
- **Material Symbols** - Iconos de Google

## 📝 Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Preview de la build de producción
npm run type-check   # Verifica los tipos de TypeScript
```

## 🎯 Próximas Características

- [ ] Sistema de autenticación con Supabase
- [ ] CRUD completo de proyectos
- [ ] Sistema de postulaciones
- [ ] Mensajería entre usuarios
- [ ] Perfil de usuario editable
- [ ] Sistema de notificaciones
- [ ] Filtros avanzados en proyectos
- [ ] Calendario de actividades

## 📄 Licencia

Proyecto educativo para la asignatura de Interfaz Humano-Computador.

