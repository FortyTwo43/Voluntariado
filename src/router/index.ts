import { createRouter, createWebHistory } from 'vue-router'
import { loadUserSession } from '@/services/authService'
import PublicLayout from '@/layouts/PublicLayout.vue'
import UsuarioLayout from '@/layouts/UsuarioLayout.vue'
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
      { path: 'recuperar', name: 'password-forgot', component: () => import('@/views/Auth/PasswordForgotView.vue') },
      { path: 'restablecer', name: 'password-reset-otp', component: () => import('@/views/Auth/PasswordResetOtpView.vue') },
    ]
  },
  // Rutas de Proyectos con UsuarioLayout
  {
    path: '/explorar-proyectos',
    component: UsuarioLayout,
    children: [
      {
        path: '',
        name: 'explorar-proyectos',
        component: () => import('@/views/voluntarios/ExplorarProyectosView.vue'),
        meta: { title: 'Explorar Proyectos de Voluntariado', requiresAuth: true },
      },
    ],
  },
  {
    path: '/proyectos',
    component: UsuarioLayout,
    children: [
      {
        path: '',
        name: 'proyectos',
        component: () => import('@/views/proyectos/ListaProyectosView.vue'),
        meta: { title: 'Proyectos de Voluntariado', requiresAuth: true },
      },
      {
        path: 'crear',
        name: 'proyectos-crear',
        component: () => import('@/views/proyectos/CrearProyectoView.vue'),
        meta: { title: 'Crear Nuevo Proyecto', requiresAuth: true },
      },
      {
        path: ':id',
        name: 'proyectos-detalle',
        component: () => import('@/views/proyectos/DetalleProyectoView.vue'),
        meta: { title: 'Detalle del Proyecto', requiresAuth: true },
      },
      {
        path: ':id/asistencia',
        name: 'proyectos-asistencia',
        component: () => import('@/views/proyectos/AsistenciaProyectoView.vue'),
        meta: { title: 'Asistencia del Proyecto', requiresAuth: true },
      },
      {
        path: 'horas',
        name: 'proyectos-horas',
        component: () => import('@/views/proyectos/HorasVoluntariosView.vue'),
        meta: { title: 'Registro de Horas de Voluntarios', requiresAuth: true },
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
  {
    path: "/profile",
    name: "UserProfile",
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global para rutas protegidas
router.beforeEach((to, _from, next) => {
  const requiresAuth = Boolean(to.meta && (to.meta as any).requiresAuth);
  if (!requiresAuth) return next();
  const user = loadUserSession();
  if (!user) {
    return next({ name: 'UserLogin', query: { redirect: to.fullPath } });
  }
  return next();
});

export default router
