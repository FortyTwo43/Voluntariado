import { createRouter, createWebHistory,  type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {path: '/', redirect: '/dashboard'},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;