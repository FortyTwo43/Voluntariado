import { createRouter, createWebHistory,  type RouteRecordRaw } from 'vue-router';
import proyectosRoutes from './modules/proyectos';

const routes: RouteRecordRaw[] = [
  {path: '/', redirect: '/proyectos'},
  ...proyectosRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;