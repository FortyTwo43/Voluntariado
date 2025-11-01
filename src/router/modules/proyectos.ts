import type { RouteRecordRaw } from 'vue-router';

const proyectosRoutes: RouteRecordRaw[] = [
  {
    path: '/proyectos',
    component: () => import('../../layouts/UsuarioLayout.vue'),
    children: [
      {
        path: '',
        name: 'proyectos',
        component: () => import('../../views/proyectos/ListaProyectosView.vue'),
        meta: {
          title: 'Proyectos de Voluntariado',
        },
      },
      {
        path: 'crear',
        name: 'proyectos-crear',
        component: () => import('../../views/proyectos/CrearProyectoView.vue'),
        meta: {
          title: 'Crear Nuevo Proyecto',
        },
      },
      {
        path: ':id',
        name: 'proyectos-detalle',
        component: () => import('../../views/proyectos/DetalleProyectoView.vue'),
        meta: {
          title: 'Detalle del Proyecto',
        },
      },
      {
        path: ':id/asistencia',
        name: 'proyectos-asistencia',
        component: () => import('../../views/proyectos/AsistenciaProyectoView.vue'),
        meta: {
          title: 'Asistencia del Proyecto',
        },
      },
      {
        path: 'horas',
        name: 'proyectos-horas',
        component: () => import('../../views/proyectos/HorasVoluntariosView.vue'),
        meta: {
          title: 'Registro de Horas de Voluntarios',
        },
      },
    ],
  },
];

export default proyectosRoutes;
