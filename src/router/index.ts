import { createRouter, createWebHistory } from 'vue-router'
import { loadUserSession } from '@/services/authService'
import PublicLayout from '@/layouts/PublicLayout.vue'
import UsuarioLayout from '@/layouts/UsuarioLayout.vue'
import VoluntarioLayout from '@/layouts/VoluntarioLayout.vue'
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
  // Rutas de Voluntarios con VoluntarioLayout
  {
    path: '/explorar-proyectos',
    component: VoluntarioLayout,
    children: [
      {
        path: '',
        name: 'explorar-proyectos',
        component: () => import('@/views/voluntarios/ExplorarProyectosView.vue'),
        meta: { title: 'Explorar Proyectos de Voluntariado', requiresAuth: true },
      },
      {
        path: ':id',
        name: 'proyectos-detalle-publico',
        component: () => import('@/views/voluntarios/DetalleProyectoView.vue'),
        meta: { title: 'Detalle del Proyecto', requiresAuth: true },
      },
      {
        path: ':idProyecto/historial-asistencias',
        name: 'voluntario-historial-asistencias',
        component: () => import('@/views/voluntarios/HistorialAsistenciasVoluntarioView.vue'),
        meta: { title: 'Historial de Asistencias', requiresAuth: true },
      },
    ],
  },
  // Ruta Mis Proyectos para Voluntarios
  {
    path: '/mis-proyectos',
    component: VoluntarioLayout,
    children: [
      {
        path: '',
        name: 'mis-proyectos',
        component: () => import('@/views/voluntarios/MisProyectosView.vue'),
        meta: { title: 'Mis Proyectos', requiresAuth: true },
      },
    ],
  },
  // Ruta Mis Asistencias para Voluntarios
  {
    path: '/mis-asistencias',
    component: VoluntarioLayout,
    children: [
      {
        path: '',
        name: 'mis-asistencias',
        component: () => import('@/views/voluntarios/VerAsistenciasView.vue'),
        meta: { title: 'Mis Asistencias', requiresAuth: true },
      },
    ],
  },
  // Ruta Mis Inscripciones para Voluntarios
  {
    path: '/mis-inscripciones',
    component: VoluntarioLayout,
    children: [
      {
        path: '',
        name: 'mis-inscripciones',
        component: () => import('@/views/voluntarios/MisInscripcionesView.vue'),
        meta: { title: 'Mis Inscripciones', requiresAuth: true },
      },
    ],
  },
  // Ruta Calendario para Voluntarios
  {
    path: '/calendario',
    component: VoluntarioLayout,
    children: [
      {
        path: '',
        name: 'calendario',
        component: () => import('@/views/voluntarios/CalendarioView.vue'),
        meta: { title: 'Mi Calendario', requiresAuth: true },
      },
    ],
  },
  // Rutas de Proyectos de Organizaciones con UsuarioLayout
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
        component: () => import('@/views/voluntarios/DetalleProyectoView.vue'),
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
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/Auth/AdminLoginView.vue'),
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
  },
  {
    path: "/profile-organization",
    name: "UserProfileOrganization",
    component: () => import('@/views/ProfileOrganizacionView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: () => import('@/views/admin/AdminDashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/validacion-organizaciones",
    name: "AdminValidacionOrganizaciones",
    component: () => import('@/views/admin/ValidacionOrganizacionesView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/gestion-proyectos",
    name: "AdminGestionProyectos",
    component: () => import('@/views/admin/GestionProyectosView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/reportes-estadisticas",
    name: "AdminReportesEstadisticas",
    component: () => import('@/views/admin/ReportesEstadisticasView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/eliminar-usuario-inactivo",
    name: "AdminEliminarUsuarioInactivo",
    component: () => import('@/views/admin/EliminarUsuarioInactivoView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global para rutas protegidas
router.beforeEach((to, _from, next) => {
  const requiresAuth = Boolean(to.meta && (to.meta as any).requiresAuth);
  const requiresAdmin = Boolean(to.meta && (to.meta as any).requiresAdmin);
  
  if (!requiresAuth && !requiresAdmin) return next();
  
  const user = loadUserSession();
  if (!user) {
    return next({ name: 'UserLogin', query: { redirect: to.fullPath } });
  }
  
  // Verificar si la ruta requiere ser administrador
  if (requiresAdmin && user.rol !== 'administrador') {
    // Redirigir a login si no es administrador
    return next({ name: 'UserLogin', query: { redirect: to.fullPath } });
  }
  
  return next();
});

export default router
