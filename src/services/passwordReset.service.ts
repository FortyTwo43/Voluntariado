import { SUPABASE_URL, SUPABASE_HEADERS } from '../config/supabase';
import emailjs from '@emailjs/browser';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from '../config/email';

// ================================================================
// TIPOS
// ================================================================

type FoundUser =
  | { userType: 'voluntario'; id: string; email: string }
  | { userType: 'organizacion'; id: string; email: string };

// ================================================================
// FUNCIONES AUXILIARES
// ================================================================

/**
 * Genera un código OTP de 6 dígitos aleatorio
 */
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Busca un usuario (voluntario u organización) por email
 */
async function findUserByEmail(email: string): Promise<FoundUser | null> {
  try {
    // Buscar en voluntarios
    let url = `${SUPABASE_URL}/rest/v1/voluntarios?select=id_voluntario,email&email=eq.${encodeURIComponent(email)}&limit=1`;
    let response = await fetch(url, {
      method: 'GET',
      headers: SUPABASE_HEADERS,
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          userType: 'voluntario',
          id: data[0].id_voluntario,
          email: data[0].email,
        };
      }
    }

    // Buscar en organizaciones
    url = `${SUPABASE_URL}/rest/v1/organizaciones?select=id_organizacion,email&email=eq.${encodeURIComponent(email)}&limit=1`;
    response = await fetch(url, {
      method: 'GET',
      headers: SUPABASE_HEADERS,
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          userType: 'organizacion',
          id: data[0].id_organizacion,
          email: data[0].email,
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error al buscar usuario:', error);
    return null;
  }
}

/**
 * Envía el código de recuperación por email usando EmailJS
 */
async function sendResetCodeEmail(email: string, code: string): Promise<boolean> {
  // Verificar si EmailJS está configurado
  const isConfigured = 
    EMAILJS_SERVICE_ID !== 'tu_service_id' &&
    EMAILJS_TEMPLATE_ID !== 'tu_template_id' &&
    EMAILJS_PUBLIC_KEY !== 'tu_public_key';

  if (!isConfigured) {
    // Si EmailJS no está configurado, mostrar código en consola para testing
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 CÓDIGO DE RECUPERACIÓN (EmailJS no configurado)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${email}`);
    console.log(`Código: ${code}`);
    console.log('Expira en: 15 minutos');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 Para enviar emails reales, configura EmailJS en src/config/email.ts');
    console.log('   Visita: https://www.emailjs.com/');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return true;
  }

  // Parámetros del template (incluimos aliases comunes para compatibilidad)
  const templateParams: Record<string, string> = {
    // EmailJS: Asegúrate que el campo "To" del template use {{to_email}}
    to_email: email,
    // Aliases comunes en plantillas
    user_email: email,
    reply_to: email,
    to: email,
    // Contenido del mensaje
    code: code,
    app_name: 'Plataforma de Voluntariado Juvenil',
    expires_minutes: '15',
    // Opcionales
    to_name: 'Usuario',
    from_name: 'Plataforma de Voluntariado Juvenil',
  };

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: EMAILJS_PUBLIC_KEY,
      }
    );
    console.log('✅ Email enviado exitosamente a:', email);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    console.warn('Revisa tu template en EmailJS: configura el campo "To" con la variable {{to_email}} o asigna un destinatario fijo.');
    console.warn('También verifica que EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID y EMAILJS_PUBLIC_KEY estén correctamente configurados en src/config/email.ts');
    // Fallback: mostrar código en consola si falla el envío
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 CÓDIGO DE RECUPERACIÓN (Fallback)');
    console.log(`Email: ${email}`);
    console.log(`Código: ${code}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return false;
  }
}

// ================================================================
// FUNCIONES PÚBLICAS
// ================================================================

/**
 * Solicita un código de recuperación de contraseña
 * Genera un código OTP, lo guarda en BD y lo envía por email
 */
export async function requestPasswordCode(email: string): Promise<void> {
  try {
    // Buscar usuario
    const user = await findUserByEmail(email);
    
    // Por seguridad, no revelamos si el email existe o no
    // Siempre respondemos que se envió el código
    if (!user) {
      console.log('Usuario no encontrado, pero respondemos genéricamente');
      return;
    }

    // Generar código
    const code = generateCode();
    
    // Calcular fecha de expiración (15 minutos)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Guardar código en BD
    const url = `${SUPABASE_URL}/rest/v1/password_reset_codes`;
    const response = await fetch(url, {
      method: 'POST',
      headers: SUPABASE_HEADERS,
      body: JSON.stringify({
        email: user.email,
        user_type: user.userType,
        user_id: user.id,
        code: code,
        expires_at: expiresAt,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al guardar código de recuperación');
    }

    // Enviar email
    await sendResetCodeEmail(user.email, code);
  } catch (error) {
    console.error('Error al solicitar código de recuperación:', error);
    throw error;
  }
}

/**
 * Busca el código más reciente y válido para un email
 */
async function fetchLatestValidCode(email: string, code: string) {
  try {
    const url =
      `${SUPABASE_URL}/rest/v1/password_reset_codes` +
      `?email=eq.${encodeURIComponent(email)}` +
      `&code=eq.${encodeURIComponent(code)}` +
      `&used=is.false` +
      `&order=created_at.desc` +
      `&limit=1`;

    const response = await fetch(url, {
      method: 'GET',
      headers: SUPABASE_HEADERS,
    });

    if (!response.ok) {
      throw new Error('Error al validar código');
    }

    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error al buscar código válido:', error);
    throw error;
  }
}

/**
 * Restablece la contraseña usando el código OTP
 */
export async function resetPasswordWithCode(params: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<void> {
  try {
    // Buscar código válido
    const codeRecord = await fetchLatestValidCode(params.email, params.code);

    if (!codeRecord) {
      throw new Error('Código inválido o ya usado');
    }

    // Verificar que no haya expirado
    const expiresAt = new Date(codeRecord.expires_at).getTime();
    const now = Date.now();

    if (now > expiresAt) {
      throw new Error('El código ha expirado');
    }

    // Actualizar contraseña según tipo de usuario
    let updateUrl = '';
    if (codeRecord.user_type === 'voluntario') {
      updateUrl = `${SUPABASE_URL}/rest/v1/voluntarios?email=eq.${encodeURIComponent(params.email)}`;
    } else if (codeRecord.user_type === 'organizacion') {
      updateUrl = `${SUPABASE_URL}/rest/v1/organizaciones?email=eq.${encodeURIComponent(params.email)}`;
    } else {
      throw new Error('Tipo de usuario inválido');
    }

    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: SUPABASE_HEADERS,
      body: JSON.stringify({ contrasena: params.newPassword }),
    });

    if (!updateResponse.ok) {
      throw new Error('Error al actualizar contraseña');
    }

    // Marcar código como usado
    const markUsedUrl = `${SUPABASE_URL}/rest/v1/password_reset_codes?id=eq.${codeRecord.id}`;
    const markUsedResponse = await fetch(markUsedUrl, {
      method: 'PATCH',
      headers: SUPABASE_HEADERS,
      body: JSON.stringify({
        used: true,
        used_at: new Date().toISOString(),
      }),
    });

    if (!markUsedResponse.ok) {
      console.warn('Advertencia: No se pudo marcar el código como usado');
    }

    console.log('✅ Contraseña actualizada exitosamente');
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    throw error;
  }
}
