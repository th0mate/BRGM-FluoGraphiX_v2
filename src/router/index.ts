import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/accueil',
    },
    {
      path: '/accueil',
      name: 'accueil',
      component: () => import('@/views/VueAccueil.vue')
    },
    {
      path: '/documentation',
      name: 'documentation',
      component: () => import('@/views/VueDocumentation.vue')
    },
    {
      path: '/telecharger',
      name: 'telecharger',
      component: () => import('@/views/VueTelecharger.vue')
    },
    {
      path: '/calibration',
      name: 'calibration',
      component: () => import('@/views/VueCalibration.vue')
    },
    {
      path: '/visualisation',
      name: 'visualisation',
      component: () => import('@/views/VueVisualisation.vue')
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  },
})


/**
 * Permet de fermer le menu responsive lors d'un changement de route
 */
router.beforeEach((to, from, next) => {
  const menu = document.querySelector('.menu') as HTMLElement | null;
  if (menu && menu.style.display === 'flex') {
    menu.style.display = 'none';
  }
  next();
});

export default router
