import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProjectsView from '@/views/ProjectsView.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', name: 'dashboard', component: DashboardView },
      { path: 'proyectos', name: 'projects', component: ProjectsView },
      // puedes agregar más rutas aquí
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
