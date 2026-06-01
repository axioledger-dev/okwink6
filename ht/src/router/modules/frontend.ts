import { AppRouteRecord } from '@/types/router'

export const frontendRoutes: AppRouteRecord = {
  path: '/frontend',
  name: 'Frontend',
  component: 'Layout',
  meta: {
    title: 'Frontend điều khiển',
    icon: 'ri:computer-line',
    sort: 96
  },
  children: [
    {
      path: '/outside/iframe/client-casino',
      name: 'ClientCasinoControl',
      component: '',
      meta: {
        title: 'Client Casino',
        icon: 'ri:apps-2-line',
        keepAlive: false,
        link: import.meta.env.VITE_CLIENT_CASINO_URL,
        isIframe: true
      }
    }
  ]
}
