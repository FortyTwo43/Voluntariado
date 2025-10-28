import type { IVoluntario } from '../types/IVoluntario';
import { SUPABASE_URL, SUPABASE_HEADERS } from '../config/supabase';

export async function registrarVoluntario(voluntario: IVoluntario): Promise<boolean> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/voluntarios`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: SUPABASE_HEADERS,
      body: JSON.stringify(voluntario),
    });

    if (!response.ok) {
      throw new Error('Error al registrar el voluntario');
    }

    return true;
  } catch (error) {
    console.error('Error al registrar voluntario:', error);
    throw error;
  }
}

export async function verificarCorreoExistente(email: string): Promise<boolean> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/voluntarios?email=eq.${encodeURIComponent(email)}&select=email`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: SUPABASE_HEADERS,
    });

    if (!response.ok) {
      throw new Error('Error al verificar correo');
    }

    const data = await response.json();
    return data.length > 0;
  } catch (error) {
    console.error('Error al verificar correo existente:', error);
    throw error;
  }
}

export async function obtenerVoluntarios(): Promise<IVoluntario[]> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/voluntarios`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: SUPABASE_HEADERS,
    });

    if (!response.ok) {
      throw new Error('Error al obtener voluntarios');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener voluntarios:', error);
    throw error;
  }
}

export function validarEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validarCampos(voluntario: IVoluntario): string[] {
  const errores: string[] = [];

  if (!voluntario.nombre.trim()) {
    errores.push('El nombre es requerido');
  }

  if (!voluntario.apellido.trim()) {
    errores.push('El apellido es requerido');
  }

  if (!voluntario.email.trim()) {
    errores.push('El correo electrónico es requerido');
  } else if (!validarEmail(voluntario.email)) {
    errores.push('El formato del correo electrónico no es válido');
  }

  if (!voluntario.telefono.trim()) {
    errores.push('El teléfono es requerido');
  }

  if (!voluntario.institucion_educativa.trim()) {
    errores.push('La institución educativa es requerida');
  }

  if (!voluntario.contrasena.trim()) {
    errores.push('La contraseña es requerida');
  } else if (voluntario.contrasena.length < 6) {
    errores.push('La contraseña debe tener al menos 6 caracteres');
  }

  return errores;
}

export function validarCamposRegistro(voluntario: any): string[] {
  const errores: string[] = [];

  if (!voluntario.nombre.trim()) {
    errores.push('El nombre es requerido');
  }

  if (!voluntario.apellido.trim()) {
    errores.push('El apellido es requerido');
  }

  if (!voluntario.email.trim()) {
    errores.push('El correo electrónico es requerido');
  } else if (!validarEmail(voluntario.email)) {
    errores.push('El formato del correo electrónico no es válido');
  }

  if (!voluntario.telefono.trim()) {
    errores.push('El teléfono es requerido');
  }

  if (!voluntario.institucion_educativa.trim()) {
    errores.push('La institución educativa es requerida');
  }

  if (!voluntario.contrasena.trim()) {
    errores.push('La contraseña es requerida');
  } else if (voluntario.contrasena.length < 6) {
    errores.push('La contraseña debe tener al menos 6 caracteres');
  }

  if (!voluntario.confirmarContrasena.trim()) {
    errores.push('Debe confirmar la contraseña');
  } else if (voluntario.contrasena !== voluntario.confirmarContrasena) {
    errores.push('Las contraseñas no coinciden');
  }

  if (!voluntario.aceptaTerminos) {
    errores.push('Debe aceptar los términos y condiciones');
  }

  return errores;
}

export async function validarCamposCompleto(voluntario: IVoluntario): Promise<string[]> {
  const errores = validarCampos(voluntario);

  // Verificar si el correo ya existe solo si no hay errores de formato
  if (voluntario.email.trim() && validarEmail(voluntario.email)) {
    const correoExiste = await verificarCorreoExistente(voluntario.email);
    if (correoExiste) {
      errores.push('Este correo electrónico ya está registrado');
    }
  }

  return errores;
}

// Interfaces para autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    nombre: string;
    apellido?: string;
    tipo: 'voluntario' | 'organizacion';
  };
}

// Función para autenticar voluntarios
export async function autenticarVoluntario(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const select = 'id:id_voluntario,nombre,apellido,email,contrasena';
    const url = `${SUPABASE_URL}/rest/v1/voluntarios?email=eq.${encodeURIComponent(credentials.email)}&select=${encodeURIComponent(select)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: SUPABASE_HEADERS,
    });

    if (!response.ok) {
      throw new Error('Error al verificar credenciales');
    }

    const data = await response.json();
    
    if (data.length === 0) {
      return {
        success: false,
        message: 'Credenciales incorrectas'
      };
    }

  const voluntario = data[0];
    
    // Verificar contraseña (en un caso real, esto sería con hash)
    if (voluntario.contrasena !== credentials.password) {
      return {
        success: false,
        message: 'Credenciales incorrectas'
      };
    }

    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: voluntario.id,
        email: voluntario.email,
        nombre: voluntario.nombre,
        apellido: voluntario.apellido,
        tipo: 'voluntario'
      }
    };
  } catch (error) {
    console.error('Error al autenticar voluntario:', error);
    return {
      success: false,
      message: 'Error al iniciar sesión. Intenta nuevamente.'
    };
  }
}

// Función para autenticar organizaciones
export async function autenticarOrganizacion(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const select = 'id:id_organizacion,nombre,email,contrasena';
    const url = `${SUPABASE_URL}/rest/v1/organizaciones?email=eq.${encodeURIComponent(credentials.email)}&select=${encodeURIComponent(select)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: SUPABASE_HEADERS,
    });

    if (!response.ok) {
      throw new Error('Error al verificar credenciales');
    }

    const data = await response.json();
    
    if (data.length === 0) {
      return {
        success: false,
        message: 'Credenciales incorrectas'
      };
    }

  const organizacion = data[0];
    
    // Verificar contraseña (en un caso real, esto sería con hash)
    if (organizacion.contrasena !== credentials.password) {
      return {
        success: false,
        message: 'Credenciales incorrectas'
      };
    }

    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: organizacion.id,
        email: organizacion.email,
        nombre: organizacion.nombre,
        tipo: 'organizacion'
      }
    };
  } catch (error) {
    console.error('Error al autenticar organización:', error);
    return {
      success: false,
      message: 'Error al iniciar sesión. Intenta nuevamente.'
    };
  }
}

// Función principal de autenticación que intenta ambos tipos
export async function autenticarUsuario(credentials: LoginCredentials): Promise<LoginResponse> {
  // Primero intentar como voluntario
  const resultadoVoluntario = await autenticarVoluntario(credentials);
  if (resultadoVoluntario.success) {
    return resultadoVoluntario;
  }

  // Si no es voluntario, intentar como organización
  const resultadoOrganizacion = await autenticarOrganizacion(credentials);
  if (resultadoOrganizacion.success) {
    return resultadoOrganizacion;
  }

  // Si ninguno funciona, devolver error
  return {
    success: false,
    message: 'Credenciales incorrectas'
  };
}