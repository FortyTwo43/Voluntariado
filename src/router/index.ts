import { createRouter, createWebHistory } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import ProyectoLayout from '@/layouts/ProyectoLayout.vue'
import HomeLandingView from '@/views/HomeLandingView.vue'
import TermsPoliciesView from '@/views/TermsPoliciesView.vue'
import InstitutionalInfoView from '@/views/InstitutionalInfoView.vue'
import ContactSupportView from '@/views/ContactSupportView.vue'
import RegistrationSelectorView from '@/views/RegistrationSelectorView.vue'
import ProjectsView from '@/views/ProjectsView.vue'

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: HomeLandingView },
      { path: 'politicas', name: 'policies', component: TermsPoliciesView },
      { path: 'informacion', name: 'institutional', component: InstitutionalInfoView },
      { path: 'contacto', name: 'contact', component: ContactSupportView },
      { path: 'proyectos-view', name: 'projects', component: ProjectsView },
      { path: 'registro', name: 'registration', component: RegistrationSelectorView },
    ]
  },
  // Rutas de Proyectos con ProyectoLayout
  {
    path: '/proyectos',
    component: ProyectoLayout,
    children: [
      {
        path: '',
        name: 'proyectos',
        component: () => import('@/views/proyectos/ListaProyectosView.vue'),
        meta: { title: 'Proyectos de Voluntariado' },
      },
      {
        path: 'crear',
        name: 'proyectos-crear',
        component: () => import('@/views/proyectos/CrearProyectoView.vue'),
        meta: { title: 'Crear Nuevo Proyecto' },
      },
      {
        path: ':id',
        name: 'proyectos-detalle',
        component: () => import('@/views/proyectos/DetalleProyectoView.vue'),
        meta: { title: 'Detalle del Proyecto' },
      },
      {
        path: ':id/asistencia',
        name: 'proyectos-asistencia',
        component: () => import('@/views/proyectos/AsistenciaProyectoView.vue'),
        meta: { title: 'Asistencia del Proyecto' },
      },
      {
        path: 'horas',
        name: 'proyectos-horas',
        component: () => import('@/views/proyectos/HorasVoluntariosView.vue'),
        meta: { title: 'Registro de Horas de Voluntarios' },
      },
    ],
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: () => import('@/views/Auth/UserLoginView.vue'),
  },
  {
    path: '/registro-voluntario',
    name: 'RegistroVoluntario',
    component: () => import('@/views/Auth/RegisterVolunteerView.vue'),
  },
  {
    path: '/register-organization',
    name: 'RegisterOrganization',
    component: () => import('@/views/organizations/RegisterOrganizationView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
