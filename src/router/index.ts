import { createRouter, createWebHashHistory } from 'vue-router'
import { generateDocRoutes } from '@/docs/docsConfig';

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
      component: () => import('@/views/VueDocumentation.vue'),
      children: [
        ...generateDocRoutes(), // Ajout des routes de documentation
        {
          path: '',
          redirect: '/documentation/guide/introduction'
        }
      ]
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
    {
      path: '/cookies',
      name: 'cookies',
      component: () => import('@/views/VueCookies.vue')
    },
    {
      path: '/legal',
      name: 'legal',
      component: () => import('@/views/VueMentionsLegales.vue')
    },
    {
      path: '/credits',
      name: 'credits',
      component: () => import('@/views/VueSources.vue')
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
