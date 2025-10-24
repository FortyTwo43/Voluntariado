# Sistema de Internacionalización (i18n)

## ✅ Implementación Completada

El proyecto ahora cuenta con un **sistema de cambio de idioma funcional** entre Español (ES) e Inglés (EN).

## 🎯 Características

- ✅ **Cambio de idioma en tiempo real** mediante botones en el HeaderBar
- ✅ **Persistencia en localStorage** - El idioma se mantiene al recargar
- ✅ **Composable reutilizable** `useLanguage()` para cualquier componente
- ✅ **Traducciones centralizadas** en un solo archivo
- ✅ **Reactivo** - Los cambios se aplican instantáneamente en toda la aplicación

## 📁 Archivos Modificados

### 1. **`src/composables/useLanguage.ts`** (NUEVO)
Composable que gestiona el estado global del idioma:

```typescript
import { useLanguage } from '@/composables/useLanguage'

const { currentLanguage, t, changeLanguage } = useLanguage()
```

- `currentLanguage`: Ref reactivo con el idioma actual ('es' | 'en')
- `t`: Objeto computed con todas las traducciones del idioma actual
- `changeLanguage(lang)`: Función para cambiar el idioma

### 2. **Componentes Actualizados**

#### `HeaderBar.vue`
- Botones de idioma funcionales (ES/EN)
- Placeholder del buscador traducido
- Menú del perfil traducido
- Estilos actualizados para botones

#### `Sidebar.vue`
- Todos los elementos de navegación traducidos
- Menú de accesibilidad traducido

#### `DashboardView.vue`
- Título y subtítulo traducidos
- Estadísticas traducidas
- Secciones y botones traducidos

## 🔧 Cómo Usar

### En cualquier componente Vue:

```vue
<script setup>
import { useLanguage } from '@/composables/useLanguage'

const { t, currentLanguage, changeLanguage } = useLanguage()
</script>

<template>
  <div>
    <h1>{{ t.greeting }}</h1>
    <p>{{ t.dashboardSubtitle }}</p>
    
    <!-- Mostrar idioma actual -->
    <p>Idioma: {{ currentLanguage }}</p>
    
    <!-- Cambiar idioma -->
    <button @click="changeLanguage('es')">Español</button>
    <button @click="changeLanguage('en')">English</button>
  </div>
</template>
```

## 📝 Agregar Nuevas Traducciones

Edita `src/composables/useLanguage.ts`:

```typescript
const translations = {
  es: {
    // ... traducciones existentes
    miNuevaKey: 'Mi nuevo texto en español'
  },
  en: {
    // ... traducciones existentes
    miNuevaKey: 'My new text in English'
  }
}
```

Luego úsala en cualquier componente:
```vue
<p>{{ t.miNuevaKey }}</p>
```

## 🌐 Traducciones Disponibles

El archivo incluye traducciones para:
- ✅ Header (búsqueda, perfil, logout)
- ✅ Sidebar (navegación completa)
- ✅ Dashboard (estadísticas, proyectos)
- ✅ Projects View (filtros, botones)
- ✅ Accessibility (opciones de accesibilidad)

## 💾 Persistencia

El idioma seleccionado se guarda automáticamente en `localStorage` con la key `'language'` y se carga al iniciar la aplicación.

## 🎨 Estilos del Selector de Idioma

Los botones de idioma tienen estados visuales claros:

- **Activo**: Color primario (`--color-primary`), negrita
- **Inactivo**: Color secundario (`--color-text-secondary`)
- **Hover**: Cambia a color primario

## 🚀 Próximos Pasos (Opcional)

Para expandir el sistema:

1. **Agregar más idiomas**: Francés, Alemán, etc.
2. **Fechas localizadas**: Usar `Intl.DateTimeFormat`
3. **Números localizados**: Usar `Intl.NumberFormat`
4. **Detectar idioma del navegador**: `navigator.language`
5. **Pluralización**: Manejar singular/plural según el idioma

## ✨ Ejemplo de Uso Completo

```vue
<template>
  <div>
    <h1>{{ t.greeting }}</h1>
    <button @click="toggleLanguage">
      {{ currentLanguage === 'es' ? '🇬🇧 Switch to English' : '🇪🇸 Cambiar a Español' }}
    </button>
  </div>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'

const { t, currentLanguage, changeLanguage } = useLanguage()

const toggleLanguage = () => {
  changeLanguage(currentLanguage.value === 'es' ? 'en' : 'es')
}
</script>
```

---

**¡El sistema de idiomas ya está funcionando!** 🎉

Ahora al hacer clic en "ES" o "EN" en el header, toda la interfaz cambia de idioma instantáneamente y el cambio persiste al recargar la página.
