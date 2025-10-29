// ================================================================
// CONFIGURACIÓN DE EMAILJS
// ================================================================
// Para obtener estas claves:
// 1. Crea una cuenta gratuita en https://www.emailjs.com/
// 2. Agrega un servicio de email (Gmail, Outlook, etc.)
// 3. Crea un template con las variables: to_email, code, app_name, expires_minutes
// 4. Copia tus claves aquí

export const EMAILJS_SERVICE_ID = 'service_v1aje5e'; // Ej: 'service_abc123'
export const EMAILJS_TEMPLATE_ID = 'template_5jb4b7s'; // Ej: 'template_xyz789'
export const EMAILJS_PUBLIC_KEY = 'dwxJg735YTgRClZ5I'; // Ej: 'user_def456'

// Ejemplo de template en EmailJS:
/*
Asunto: Código de recuperación de contraseña

Hola,

Tu código de recuperación para {{app_name}} es:

{{code}}

Este código expira en {{expires_minutes}} minutos.

Si no solicitaste este código, ignora este mensaje.

Saludos,
Equipo de {{app_name}}
*/
