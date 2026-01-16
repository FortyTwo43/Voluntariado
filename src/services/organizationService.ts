import type { IOrganizacion } from '../types/IOrganizacion';
import { SUPABASE_URL, SUPABASE_HEADERS } from '../config/supabase';
import type { IOrganizacionRegistro } from '../types/IOrganizacion';

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function registrarOrganizacion(organizacion: IOrganizacion): Promise<ApiResponse> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/organizaciones`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: SUPABASE_HEADERS,
      body: JSON.stringify(organizacion),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error al registrar la organización: ${errorData}`);
    }

    return {
      success: true,
      message: 'Organización registrada exitosamente',
      data: await response.json().catch(() => null)
    };
  } catch (error) {
    console.error('Error al registrar organización:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al registrar la organización'
    };
  }
}

export async function verificarEmailExistente(email: string): Promise<boolean> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/organizaciones?email=eq.${encodeURIComponent(email)}&select=email`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: SUPABASE_HEADERS,
    });

    if (!response.ok) {
      throw new Error('Error al verificar email');
    }

    const data = await response.json();
    return data.length > 0;
  } catch (error) {
    console.error('Error al verificar email existente:', error);
    throw error;
  }
}

export function validarEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validarCampos(organizacion: IOrganizacionRegistro): string[] {
  const errores: string[] = [];

  if (!organizacion.nombre.trim()) {
    errores.push('El nombre de la organización es requerido');
  }

  if (!organizacion.tipo.trim()) {
    errores.push('El tipo de organización es requerido');
  }

  if (!organizacion.direccion.trim()) {
    errores.push('La dirección es requerida');
  }

  if (!organizacion.email.trim()) {
    errores.push('El correo electrónico es requerido');
  } else if (!validarEmail(organizacion.email)) {
    errores.push('El formato del correo electrónico no es válido');
  }

  if (!organizacion.contrasena.trim()) {
    errores.push('La contraseña es requerida');
  } else if (organizacion.contrasena.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (!organizacion.confirmarContrasena.trim()) {
    errores.push('Debe confirmar la contraseña');
  } else if (organizacion.contrasena !== organizacion.confirmarContrasena) {
    errores.push('Las contraseñas no coinciden');
  }

  if (!organizacion.aceptaTerminos) {
    errores.push('Debe aceptar los términos y condiciones');
  }

  return errores;
}

export async function validarCamposCompleto(organizacion: IOrganizacionRegistro): Promise<string[]> {
  const errores = validarCampos(organizacion);

  // Verificar si el email ya existe solo si no hay errores de formato
  if (organizacion.email.trim() && validarEmail(organizacion.email)) {
    try {
      const emailExiste = await verificarEmailExistente(organizacion.email);
      if (emailExiste) {
        errores.push('Este correo electrónico ya está registrado');
      }
    } catch (error) {
      console.error('Error al verificar email:', error);
      errores.push('Error al verificar el correo electrónico');
    }
  }

  return errores;
}

/**
 * Obtiene una organización por su ID
 */
export async function obtenerOrganizacionPorId(id: string): Promise<IOrganizacion | null> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/organizaciones?id_organizacion=eq.${encodeURIComponent(id)}&select=*`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: SUPABASE_HEADERS,
    });

    if (!response.ok) {
      throw new Error('Error al obtener organización');
    }

    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error al obtener organización:', error);
    throw error;
  }
}
