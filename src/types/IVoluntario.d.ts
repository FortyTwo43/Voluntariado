export interface IVoluntario {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  institucion_educativa: string;
  contrasena: string;
}

export interface IVoluntarioRegistro extends IVoluntario {
  confirmarContrasena: string;
  aceptaTerminos: boolean;
}
