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

export async function actualizarVoluntario(id: string, datos: Partial<IVoluntario>): Promise<boolean> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/voluntarios?id_voluntario=eq.${id}`;
    
    // Remover campos que no deben actualizarse o que son undefined
    const { contrasena, ...datosActualizar } = datos;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: SUPABASE_HEADERS,
      body: JSON.stringify(datosActualizar),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Error al actualizar el voluntario');
    }

    return true;
  } catch (error) {
    console.error('Error al actualizar voluntario:', error);
    throw error;
  }
}

export async function actualizarOrganizacion(id: string, datos: Partial<{ nombre: string; tipo: string; direccion: string; email: string }>): Promise<boolean> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/organizaciones?id_organizacion=eq.${id}`;
    
    // Remover campos que no deben actualizarse (contrasena, estado_validacion, id)
    const { ...datosActualizar } = datos;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: SUPABASE_HEADERS,
      body: JSON.stringify(datosActualizar),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Error al actualizar la organización');
    }

    return true;
  } catch (error) {
    console.error('Error al actualizar organización:', error);
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
    rol: 'voluntario' | 'organizacion' | 'administrador'; // Indica el tipo de usuario
    // Campos específicos de voluntario
    apellido?: string;
    telefono?: string;
    institucion_educativa?: string;
    // Campos específicos de organización
    tipo?: string; // Tipo de organización (Educativo, ONG, etc.)
    direccion?: string;
    estado_validacion?: boolean;
  };
}

// Función para autenticar voluntarios
export async function autenticarVoluntario(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const select = 'id:id_voluntario,nombre,apellido,email,telefono,institucion_educativa,contrasena';
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
        rol: 'voluntario',
        apellido: voluntario.apellido,
        telefono: voluntario.telefono,
        institucion_educativa: voluntario.institucion_educativa
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
    const select = 'id:id_organizacion,nombre,tipo,direccion,email,estado_validacion,contrasena';
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
        rol: 'organizacion',
        tipo: organizacion.tipo,
        direccion: organizacion.direccion,
        estado_validacion: organizacion.estado_validacion
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

// Función para autenticar administradores
export async function autenticarAdministrador(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const select = 'id:id_admin,nombre,email,contrasena';
    const url = `${SUPABASE_URL}/rest/v1/administradores?email=eq.${encodeURIComponent(credentials.email)}&select=${encodeURIComponent(select)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: SUPABASE_HEADERS,
    });

    if (!response.ok) {
      // Obtener más información del error
      const errorText = await response.text();
      console.error('Error en respuesta de administradores:', response.status, errorText);
      // Si es 404 o 400, probablemente la tabla no existe o hay un problema con la consulta
      if (response.status === 404 || response.status === 400) {
        // Retornar como si no se encontró, para que continúe con otros tipos de usuario
        return {
          success: false,
          message: 'Credenciales incorrectas'
        };
      }
      throw new Error(`Error al verificar credenciales: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.length === 0) {
      return {
        success: false,
        message: 'Credenciales incorrectas'
      };
    }

    const administrador = data[0];
    
    // Verificar contraseña (en un caso real, esto sería con hash)
    if (administrador.contrasena !== credentials.password) {
      return {
        success: false,
        message: 'Credenciales incorrectas'
      };
    }

    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: administrador.id || administrador.id_admin, // Usar id renombrado o el original
        email: administrador.email,
        nombre: administrador.nombre,
        rol: 'administrador'
      }
    };
  } catch (error) {
    console.error('Error al autenticar administrador:', error);
    // Si hay un error de conexión o la tabla no existe, retornar como fallo silencioso
    // para que continúe intentando con otros tipos de usuario
    return {
      success: false,
      message: 'Credenciales incorrectas'
    };
  }
}

// Función principal de autenticación que intenta voluntarios y organizaciones (NO administradores)
export async function autenticarUsuario(credentials: LoginCredentials): Promise<LoginResponse> {
  // Intentar como voluntario
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

// =============================
// Persistencia de sesión (Recordarme)
// =============================

// Tipo base para usuario en sesión
export type BasicUser = {
  id: string;
  email: string;
  nombre: string;
  rol: 'voluntario' | 'organizacion' | 'administrador'; // Indica el tipo de usuario
  // Campos específicos de voluntario
  apellido?: string;
  telefono?: string;
  institucion_educativa?: string;
  // Campos específicos de organización
  tipo?: string; // Tipo de organización (Educativo, ONG, etc.)
  direccion?: string;
  estado_validacion?: boolean;
};

const SESSION_STORAGE_KEY = 'user_session';

type StoredSession = {
  user: BasicUser;
  expiresAt: number; // epoch ms
};

export function persistUserSession(user: BasicUser, remember: boolean) {
  // TTL: 7 días si recuerda, 2 horas si no
  const ttlMs = remember ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 2;
  const payload: StoredSession = { user, expiresAt: Date.now() + ttlMs };

  // Limpiar anteriores en ambos almacenes
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (_) {
    // ignorar
  }

  const storage = remember ? localStorage : sessionStorage;
  try {
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
  } catch (_) {
    // ignorar problemas de cuota
  }

  // Compatibilidad: mantener 'user' para código existente
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (_) {
    // ignorar
  }
}

export function loadUserSession(): BasicUser | null {
  const raw =
    sessionStorage.getItem(SESSION_STORAGE_KEY) ??
    localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as StoredSession;
    if (!data?.user || !data?.expiresAt) return null;
    if (Date.now() > data.expiresAt) {
      // expiró: limpiar ambas y también la clave legacy
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        localStorage.removeItem(SESSION_STORAGE_KEY);
        localStorage.removeItem('user');
      } catch (_) {}
      return null;
    }
    return data.user;
  } catch {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (_) {}
    return null;
  }
}

export function clearUserSession() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem('user');
  } catch (_) {
    // ignorar
  }
}