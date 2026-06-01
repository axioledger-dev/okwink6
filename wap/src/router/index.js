import { createRouter, createWebHistory } from 'vue-router'

// Import route modules
import authRoutes from './modules/auth'
import activityRoutes from './modules/activity'
import gameRoutes from './modules/game'
import imRoutes from './modules/im'
import lotteryRoutes from './modules/lottery'
import memberRoutes from './modules/member'
import paymentRoutes from './modules/payment'
import serviceRoutes from './modules/service'
import legacyRoutes from './modules/legacy'

// Combine all routes
const routes = [
  {
    path: '/',
    redirect: '/home-new'
  },
  {
    path: '/home-new',
    name: 'Home',
    component: () => import('@/views/home/HomeV5.vue'),
    meta: { title: 'Trang chủ' }
  },
  ...authRoutes,
  ...activityRoutes,
  ...gameRoutes,
  ...imRoutes,
  ...lotteryRoutes,
  ...memberRoutes,
  ...paymentRoutes,
  ...serviceRoutes,
  ...legacyRoutes
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router

// Made with Bob
