export interface IOrganizacion {
    id_organizacion: number;
    nombre: string;
    tipo: string;
    direccion: string;
    email: string;
    estado_validacion: boolean;
    contrasena: string;
}

export interface IOrganizacionRegistro extends Omit<IOrganizacion, 'id_organizacion' | 'estado_validacion'> {
    confirmarContrasena: string;
    aceptaTerminos: boolean;
  }