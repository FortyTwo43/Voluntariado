import { createRouter, createWebHistory,  type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {path: '/', redirect: '/dashboard'},
  {
    path: '/login',
    name: 'UserLogin',
    component: () => import('../views/Auth/UserLoginView.vue'),
    meta: { layout: 'auth' }
  },
  {
    path: '/registro-voluntario',
    name: 'RegistroVoluntario',
    component: () => import('../views/Auth/RegisterVolunteerView.vue'),
    meta: { layout: 'auth' }
  },
  {
    path: '/register-organization',
    name: 'RegisterOrganization',
    component: () => import('../views/organizations/RegisterOrganizationView.vue'),
    meta: { layout: 'auth' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;