export interface IOrganizacion {
    id_organizacion: string; // UUID
    nombre: string;
    tipo: string;
    direccion: string;
    email: string;
    estado_validacion: boolean | string; // Puede ser boolean o string ('pendiente' | 'cancelada' | 'aceptada')
    contrasena: string;
}

export interface IOrganizacionRegistro extends Omit<IOrganizacion, 'id_organizacion' | 'estado_validacion'> {
    confirmarContrasena: string;
    aceptaTerminos: boolean;
  }