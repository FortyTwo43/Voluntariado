import { createRouter, createWebHistory } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import HomeLandingView from '@/views/HomeLandingView.vue'
import TermsPoliciesView from '@/views/TermsPoliciesView.vue'
import InstitutionalInfoView from '@/views/InstitutionalInfoView.vue'
import ContactSupportView from '@/views/ContactSupportView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import RegistrationSelectorView from '@/views/RegistrationSelectorView.vue'

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: HomeLandingView },
      { path: 'politicas', name: 'policies', component: TermsPoliciesView },
      { path: 'informacion', name: 'institutional', component: InstitutionalInfoView },
      { path: 'contacto', name: 'contact', component: ContactSupportView },
      { path: 'proyectos', name: 'projects', component: ProjectsView },
      { path: 'registro', name: 'registration', component: RegistrationSelectorView },
    ]
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
