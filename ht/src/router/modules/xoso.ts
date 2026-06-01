import { AppRouteRecord } from '@/types/router'

export const xosoRoutes: AppRouteRecord = {
  path: '/xoso',
  name: 'Xoso',
  component: 'Layout',
  meta: {
    title: 'Quản lý Xổ Số',
    icon: 'ri:trophy-line',
    sort: 3,
    roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
  },
  children: [
    {
      path: 'categories',
      name: 'XosoCategories',
      component: '/xoso/categories/index',
      meta: {
        title: 'Danh mục Xổ Số',
        icon: 'ri:list-settings-line',
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'provinces',
      name: 'XosoProvinces',
      component: '/xoso/provinces/index',
      meta: {
        title: 'Quản lý Tỉnh thành',
        icon: 'ri:map-pin-line',
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'results',
      name: 'XosoResults',
      component: '/xoso/results/index',
      meta: {
        title: 'Kết quả xổ số',
        icon: 'ri:calendar-check-line',
        roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
      }
    },
    {
      path: 'bets',
      name: 'XosoBets',
      component: '/xoso/bets/index',
      meta: {
        title: 'Lịch sử đặt cược',
        icon: 'ri:file-list-3-line',
        roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
      }
    },
    {
      path: 'schedule',
      name: 'XosoSchedule',
      component: '/xoso/schedule/index',
      meta: {
        title: 'Lịch quay số',
        icon: 'ri:calendar-2-line',
        roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
      }
    },
    {
      path: 'statistics',
      name: 'XosoStatistics',
      component: '/xoso/statistics/index',
      meta: {
        title: 'Thống kê Xổ Số',
        icon: 'ri:bar-chart-box-line',
        roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
      }
    }
  ]
}

// Made with Bob
