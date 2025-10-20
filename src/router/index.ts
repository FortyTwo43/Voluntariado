import { createRouter, createWebHistory } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import HomeLandingView from '@/views/HomeLandingView.vue'
import TermsPoliciesView from '@/views/TermsPoliciesView.vue'
import InstitutionalInfoView from '@/views/InstitutionalInfoView.vue'
import ContactSupportView from '@/views/ContactSupportView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
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
    ]
  },
  {
    path: '/app',
    component: DashboardLayout,
    children: [
      { path: '', name: 'dashboard', component: DashboardView },
      { path: 'proyectos', name: 'projects', component: ProjectsView },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
