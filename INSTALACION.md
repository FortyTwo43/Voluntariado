# 🚀 GUÍA DE INSTALACIÓN Y EJECUCIÓN

## 📋 Requisitos Previos

- **Node.js**: v18 o superior
- **npm** o **yarn**: Para gestión de paquetes
- **Cuenta de Supabase**: Para el backend (gratuita)
- **Editor de Código**: VS Code recomendado

## 🔧 Paso 1: Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- Vue 3
- TypeScript
- Vue Router
- Vite
- Y más...

## 🗄️ Paso 2: Configurar Supabase

### 2.1 Crear Proyecto en Supabase

1. Ve a https://supabase.com
2. Crea una cuenta (si no tienes una)
3. Crea un nuevo proyecto
4. Anota la URL y API Key (ya están en `src/config/supabase.ts`)

### 2.2 Crear Tablas en Supabase

1. Ve a tu proyecto en Supabase
2. Click en "SQL Editor" en el menú lateral
3. Abre el archivo `supabase_schema.sql` de este proyecto
4. Copia todo el contenido
5. Pégalo en el SQL Editor de Supabase
6. Click en "Run" o presiona `Ctrl + Enter`
7. Verifica que las tablas se crearon en "Table Editor"

**Tablas creadas:**
- ✅ `proyectos` - Proyectos de voluntariado
- ✅ `organizaciones` - Organizaciones (opcional)

## ▶️ Paso 3: Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
```

El proyecto se ejecutará en: **http://localhost:5173**

### Modo Producción

```bash
# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🌐 Paso 4: Acceder a la Aplicación

Una vez ejecutado, abre tu navegador y ve a:

```
http://localhost:5173/proyectos/crear
```

O navega desde:
- **Lista de proyectos**: http://localhost:5173/proyectos
- **Crear proyecto**: http://localhost:5173/proyectos/crear

## 🧪 Paso 5: Probar el Módulo

### Flujo de Prueba Completo

1. **Acceder al asistente**
   - Ve a `/proyectos/crear`

2. **Paso 1: Nombre del Proyecto**
   - Ingresa un nombre (mínimo 5 caracteres)
   - Ejemplo: "Urban Beekeeping Project"
   - Debes ver: ✅ "¡Nombre genial! Es claro e inspirador."
   - Click en "Next Step"

3. **Paso 2: Detalles**
   - Descripción (opcional): "A community garden to grow fresh produce"
   - Categoría (obligatorio): Selecciona "Ambiental"
   - Fecha inicio: Selecciona una fecha
   - Fecha fin: Selecciona una fecha posterior
   - Click en "Next Step"

4. **Paso 3: Confirmación**
   - Capacidad: Ingresa un número (ej: 50)
   - ID Organización: Ingresa un ID (ej: "ORG-12345")
   - Revisa el resumen
   - Click en "Confirm and Create Project"

5. **Verificar Creación**
   - Deberías ver: "¡Proyecto creado exitosamente!"
   - Serás redirigido a `/proyectos`
   - Tu proyecto debe aparecer en la lista

### Probar Guardar Borrador

1. Completa solo el Paso 1
2. Click en "Save Draft"
3. Cierra el navegador
4. Vuelve a abrir y ve a `/proyectos/crear`
5. Deberías ver: "Se encontró un borrador guardado..."
6. Click en "Aceptar" para continuar

## 🐛 Solución de Problemas Comunes

### Error: "No se encuentra el módulo 'vue'"

**Solución:**
```bash
# Eliminar node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar dependencias
npm install
```

### Error: TypeScript "Promise no disponible"

**Causa:** TypeScript configurado con target ES5

**Solución:** Edita `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "lib": ["ES2015", "DOM", "DOM.Iterable"]
  }
}
```

### Error: "Cannot connect to Supabase"

**Verificar:**
1. URL y API Key correctas en `src/config/supabase.ts`
2. Tablas creadas en Supabase
3. Permisos de RLS deshabilitados o configurados correctamente

**Solución rápida:** Deshabilitar RLS en Supabase:
1. Ve a "Authentication" > "Policies"
2. Desactiva RLS temporalmente para pruebas

### Puerto 5173 ya en uso

**Solución:**
```bash
# Usar otro puerto
npm run dev -- --port 3000
```

### Módulo '@' no resuelve correctamente

**Verificar:** El archivo `vite.config.ts` tiene:

```typescript
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }
}
```

## 📱 Probar en Dispositivos Móviles

### Opción 1: Usar la IP Local

1. Encuentra tu IP local:
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

2. Ejecuta con host:
   ```bash
   npm run dev -- --host
   ```

3. Accede desde tu móvil:
   ```
   http://TU_IP_LOCAL:5173/proyectos/crear
   ```

### Opción 2: Usar ngrok (Túnel HTTP)

```bash
# Instalar ngrok
npm install -g ngrok

# Crear túnel
ngrok http 5173
```

## 🔍 Verificar que Todo Funciona

### Checklist de Verificación

- [ ] El servidor inicia sin errores
- [ ] La página carga en el navegador
- [ ] Se puede navegar entre los 3 pasos
- [ ] Las validaciones funcionan correctamente
- [ ] Se puede guardar un borrador
- [ ] Se puede crear un proyecto completo
- [ ] El proyecto aparece en la lista
- [ ] Los estilos se ven correctamente
- [ ] Funciona en móvil (responsive)

## 📊 Estructura de URLs

```
/                           → Redirige a /proyectos
/proyectos                  → Lista de proyectos
/proyectos/crear            → Asistente de creación (wizard)
/proyectos/:id              → Detalle de un proyecto
```

## 🎨 Personalización Rápida

### Cambiar Colores

Edita `src/style.css`:

```css
:root {
  --color-primary: #3b82f6;      /* Tu color primario */
  --color-secondary: #667eea;    /* Tu color secundario */
  --color-success: #10b981;      /* Color de éxito */
  --color-error: #ef4444;        /* Color de error */
}
```

### Cambiar Puerto por Defecto

Edita `package.json`:

```json
{
  "scripts": {
    "dev": "vite --port 3000"
  }
}
```

## 📚 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting (si está configurado)
npm run lint

# Type checking
npm run type-check

# Limpiar caché
rm -rf node_modules .vite dist
npm install
```

## 🎓 Recursos Adicionales

- **Documentación Vue 3**: https://vuejs.org/
- **Documentación TypeScript**: https://www.typescriptlang.org/
- **Documentación Supabase**: https://supabase.com/docs
- **Documentación Vite**: https://vitejs.dev/

## 🆘 Soporte

Si encuentras algún problema:

1. Revisa la consola del navegador (F12)
2. Revisa la terminal donde ejecutas `npm run dev`
3. Verifica que las dependencias estén instaladas
4. Verifica que Supabase esté configurado correctamente

## ✅ ¡Todo Listo!

Si seguiste todos los pasos, tu aplicación debería estar funcionando perfectamente. Ahora puedes:

1. Crear proyectos de voluntariado
2. Ver la lista de proyectos
3. Guardar borradores
4. Personalizar el diseño
5. Agregar más funcionalidades

**¡Disfruta desarrollando! 🎉**

---

**Última actualización:** Octubre 2025  
**Versión del módulo:** 1.0.0
