# Funcionalidad de Edición y Historial de Proyectos

## Descripción

Esta funcionalidad permite a las organizaciones editar sus proyectos y ver un historial completo de todos los cambios realizados, **sin necesidad de modificar la base de datos** (usando LocalStorage).

## Características Implementadas

### 1. **Botón "Editar"**
- Aparece en cada proyecto de la lista
- Abre un modal con un formulario pre-llenado
- Permite editar:
  - Nombre del proyecto
  - Descripción
  - Categoría
  - Fecha de inicio
  - Fecha de fin
  - Cupo máximo
  - Estado

### 2. **Botón "Ver Historial de Cambios"**
- Muestra un timeline con todos los cambios realizados
- Cada registro incluye:
  - Fecha y hora del cambio
  - Usuario que hizo el cambio
  - Campos modificados
  - Valores anterior y nuevo
- Permite limpiar el historial

## Archivos Creados

### Servicios
- **`src/services/historialProyectos.service.ts`**: Gestiona el historial usando LocalStorage

### Componentes
- **`src/components/proyectos/ModalEditarProyecto.vue`**: Modal para editar proyectos
- **`src/components/proyectos/ModalHistorialProyecto.vue`**: Modal para ver historial

### Modificaciones
- **`src/views/proyectos/ListaProyectosView.vue`**: Agregados botones y modales

## Cómo Funciona

### Edición de Proyecto

1. El usuario presiona "Editar" en un proyecto
2. Se abre un modal con los datos actuales
3. El usuario modifica los campos necesarios
4. Al guardar:
   - Se actualiza el proyecto en la base de datos
   - Se registra el cambio en LocalStorage
   - Se actualiza la lista

### Historial de Cambios

1. El usuario presiona "Ver Historial"
2. Se muestra un timeline con todos los cambios
3. Cada cambio muestra:
   - Qué campo cambió
   - Valor anterior → Valor nuevo
   - Cuándo y quién lo cambió

## Almacenamiento

### LocalStorage
- **Clave**: `historial_proyectos`
- **Estructura**:
```typescript
{
  id: string;           // ID único del registro
  idProyecto: string;   // ID del proyecto
  nombreProyecto: string;
  timestamp: number;    // Timestamp del cambio
  fecha: string;        // Fecha formateada
  usuario: string;      // Nombre de la organización
  cambios: [
    {
      campo: string;    // Nombre legible del campo
      valorAnterior: any;
      valorNuevo: any;
    }
  ]
}
```

### Límites
- Se guardan hasta 100 registros por proyecto
- Aproximadamente 5-10MB de espacio total

## Ventajas de esta Implementación

✅ **Sin modificar la base de datos**: No requiere crear nuevas tablas
✅ **Implementación rápida**: Funcional de inmediato
✅ **Datos persistentes**: Se mantienen mientras no se limpie el navegador
✅ **Funciona offline**: No requiere conexión para ver historial
✅ **Traducción automática**: Los nombres de campos se muestran en español

## Limitaciones

⚠️ **Solo disponible en el navegador actual**: El historial no se comparte entre dispositivos
⚠️ **Pérdida de datos**: Si se limpia el LocalStorage, se pierde el historial
⚠️ **No centralizado**: Cada usuario ve solo los cambios que hizo en su navegador

## Migración Futura a Base de Datos

Si en el futuro necesitas que el historial sea persistente y compartido, puedes crear una tabla:

```sql
CREATE TABLE historial_proyectos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_proyecto UUID REFERENCES proyectos(id_proyecto),
  id_organizacion UUID REFERENCES organizaciones(id_organizacion),
  campo VARCHAR(100),
  valor_anterior TEXT,
  valor_nuevo TEXT,
  fecha_cambio TIMESTAMP DEFAULT NOW(),
  usuario VARCHAR(255)
);
```

El servicio `historialProyectos.service.ts` puede adaptarse fácilmente para usar esta tabla en lugar de LocalStorage.

## Uso

### Para Organizaciones

1. Inicia sesión como organización
2. Ve a la lista de proyectos
3. En cada proyecto verás dos nuevos botones:
   - 🖊️ **Editar**: Para modificar el proyecto
   - ⏱️ **Historial**: Para ver los cambios

### Para Desarrolladores

```typescript
// Importar el servicio
import { HistorialProyectosService } from '@/services/historialProyectos.service';

// Registrar un cambio
HistorialProyectosService.registrarCambio(proyectoAnterior, proyectoNuevo);

// Obtener historial
const historial = HistorialProyectosService.obtenerHistorialProyecto(idProyecto);

// Limpiar historial
HistorialProyectosService.limpiarHistorialProyecto(idProyecto);
```

## Pruebas

Para probar la funcionalidad:

1. Inicia sesión como organización
2. Edita un proyecto (cambia nombre, descripción, etc.)
3. Guarda los cambios
4. Presiona "Ver Historial"
5. Verifica que se muestre el cambio en el timeline

## Soporte

Si encuentras algún problema o necesitas agregar funcionalidades, contacta al equipo de desarrollo.
