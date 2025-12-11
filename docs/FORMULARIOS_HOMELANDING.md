# Formularios del HomeLanding

Esta documentación describe todos los formularios relacionados con la vista de HomeLanding (página principal de la plataforma).

## Tabla de Formularios

| Nombre del Formulario | Descripción | Ubicación | Acceso desde HomeLanding |
|----------------------|-------------|-----------|-------------------------|
| **Formulario de Accesibilidad** | Panel de configuración de accesibilidad que permite a los usuarios personalizar su experiencia de navegación. Incluye opciones para modo oscuro, tamaño de fuente, alto contraste, reducir movimiento y lector de pantalla. Las configuraciones se guardan en localStorage del navegador. | `src/views/HomeLandingView.vue` | Botón flotante en la esquina inferior derecha |
| **Formulario de Registro de Voluntario** | Permite a los usuarios registrarse como voluntarios en la plataforma. Recopila información personal (nombre, apellido, email, teléfono), información educativa (institución educativa) y credenciales de acceso (contraseña y confirmación). Incluye validación de campos y aceptación de términos y condiciones. | `src/components/forms/VoluntarioRegisterForm.vue` | Enlace "Regístrate ahora" en HeroBanner → Selector de registro → Opción Voluntario |
| **Formulario de Registro de Organización** | Permite a organizaciones registrarse en la plataforma para publicar proyectos de voluntariado. Recopila información de la organización (nombre, tipo de organización, dirección) y credenciales de acceso (email del representante, contraseña y confirmación). Incluye validación de campos y aceptación de términos. | `src/components/forms/OrganizationRegisterForm.vue` | Enlace "Regístrate ahora" en HeroBanner → Selector de registro → Opción Organización |
| **Formulario de Inicio de Sesión** | Permite a usuarios existentes (voluntarios u organizaciones) iniciar sesión en la plataforma usando su email y contraseña. Incluye validación de credenciales, manejo de errores y opción para recuperar contraseña. | `src/components/forms/UserLoginForm.vue` | Enlace "Entrar" en el header de navegación |
| **Formulario de Contacto y Soporte** | Permite a los usuarios enviar consultas, reportes o solicitudes de ayuda al equipo de soporte de la plataforma. Recopila información de contacto (nombre, email) y detalles del mensaje (asunto, mensaje). Muestra información de contacto adicional como email, teléfono y dirección física. | `src/views/ContactSupportView.vue` | Enlace en el menú de soporte del sidebar expandible o en el footer |
| **Formulario de Recuperación de Contraseña** | Permite a los usuarios recuperar acceso a su cuenta mediante el envío de un código OTP de 6 dígitos a su correo electrónico registrado. Incluye validación de email, envío de código, verificación de código y restablecimiento de contraseña. | `src/views/Auth/PasswordForgotView.vue` y `src/views/Auth/PasswordResetOtpView.vue` | Opción "¿Olvidaste tu contraseña?" en el formulario de inicio de sesión |

## Formularios Integrados en HomeLanding

### 1. Panel de Accesibilidad

**Ubicación:** `src/views/HomeLandingView.vue`

**Campos del Formulario:**
- Modo Oscuro (checkbox): Activa/desactiva el tema oscuro
- Tamaño de Fuente (controles + / -): Ajusta el tamaño de fuente del 80% al 150%
- Alto Contraste (checkbox): Activa modo de alto contraste para mejor legibilidad
- Reducir Movimiento (checkbox): Desactiva animaciones para usuarios sensibles al movimiento
- Lector de Pantalla (checkbox): Activa el lector de pantalla usando Web Speech API para leer el contenido de la página

**Funcionalidades:**
- Persistencia en localStorage
- Aplicación inmediata de cambios
- Botón para restablecer todas las configuraciones
- Compatibilidad con lectores de pantalla nativos

### 2. Sección FAQ (Preguntas Frecuentes)

**Ubicación:** `src/views/HomeLandingView.vue`

**Descripción:** 
Sección de preguntas frecuentes con acordeón expandible que no es un formulario propiamente dicho, sino un componente interactivo que permite a los usuarios consultar información sobre:
- Registro en la plataforma
- Tipos de proyectos disponibles
- Proceso de inscripción en proyectos
- Requisitos de experiencia
- Certificados y horas de voluntariado
- Participación en múltiples proyectos
- Gestión de participación en proyectos

## Notas Técnicas

### Validación de Formularios
- Todos los formularios incluyen validación del lado del cliente
- Los errores se muestran en tiempo real
- Mensajes de error están internacionalizados (español/inglés)

### Persistencia de Datos
- El formulario de accesibilidad guarda configuraciones en `localStorage`
- Los formularios de registro envían datos al backend (Supabase)
- Los formularios de inicio de sesión gestionan autenticación mediante Supabase Auth

### Accesibilidad
- Todos los formularios incluyen etiquetas ARIA apropiadas
- Navegación por teclado soportada
- Compatible con lectores de pantalla
- Contraste de colores ajustable

## Flujo de Usuario desde HomeLanding

```
HomeLanding
├── HeroBanner
│   ├── Botón "Regístrate ahora" → Registro de Voluntario/Organización
│   └── Botón "Conoce la plataforma" → Información Institucional
├── Sidebar Expandible
│   ├── Menú de Accesibilidad → Panel de Accesibilidad (en HomeLanding)
│   └── Menú de Soporte → Formulario de Contacto
├── Sección FAQ → Acordeón de Preguntas Frecuentes
└── Header
    └── Botón "Entrar" → Formulario de Inicio de Sesión
```

## Referencias

- **Componentes de Formulario Base:** `src/components/ui/InputField.vue`
- **Estilos de Formularios:** `src/assets/form-styles.css`
- **Servicios de Autenticación:** `src/services/authService.ts`
- **Traducciones:** `src/composables/useLanguage.ts`

