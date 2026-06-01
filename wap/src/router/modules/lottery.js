export default [
  {
    path: '/lottery/ssc/:code?',
    name: 'LotterySsc',
    component: () => import('@/views/lottery/ssc/Index.vue'),
    meta: {
      title: 'Xổ số siêu tốc',
      requiresAuth: false,
      keepAlive: true
    }
  },
  {
    path: '/lottery/x5/:code?',
    name: 'LotteryX5',
    component: () => import('@/views/lottery/x5/Index.vue'),
    meta: {
      title: '11 chọn 5',
      requiresAuth: false,
      keepAlive: true
    }
  },
  {
    path: '/lottery/kl8/:code?',
    name: 'LotteryKl8',
    component: () => import('@/views/lottery/kl8/Index.vue'),
    meta: {
      title: 'Keno',
      requiresAuth: false,
      keepAlive: true
    }
  },
  {
    path: '/lottery/kl10/:code?',
    name: 'LotteryKl10',
    component: () => import('@/views/lottery/kl10/Index.vue'),
    meta: {
      title: 'Số đề miền Nam',
      requiresAuth: false,
      keepAlive: true
    }
  },
  {
    path: '/lottery/k3/:code?',
    name: 'LotteryK3',
    component: () => import('@/views/lottery/k3/K3.vue'),
    meta: {
      title: 'Tài xỉu (K3)',
      requiresAuth: false,
      keepAlive: true
    }
  },
  {
    path: '/lottery/k3-double/:code?',
    name: 'LotteryK3Double',
    component: () => import('@/views/lottery/k3/K3Double.vue'),
    meta: { title: 'Tài xỉu (K3) - Cược đôi' }
  },
  {
    path: '/lottery/pk10/:code?',
    name: 'LotteryPk10',
    component: () => import('@/views/lottery/pk10/Pk10.vue'),
    meta: {
      title: 'Đua xe PK10',
      requiresAuth: false,
      keepAlive: true
    }
  },
  {
    path: '/lottery/pk10-animal/:code?',
    name: 'LotteryPk10Animal',
    component: () => import('@/views/lottery/pk10/Pk10Animal.vue'),
    meta: { title: 'Đua xe (Giao diện thú)' }
  },
  {
    path: '/lottery/fc3d/:code?',
    name: 'LotteryFc3d',
    component: () => import('@/views/lottery/fc3d/Fc3d.vue'),
    meta: { title: 'Phúc Lộc 3D' }
  },
  {
    path: '/lottery/pl3/:code?',
    name: 'LotteryPl3',
    component: () => import('@/views/lottery/pl3/Pl3.vue'),
    meta: { title: 'Xổ số 3 số' }
  },
  {
    path: '/lottery/hn7xc/:code?',
    name: 'LotteryHn7xc',
    component: () => import('@/views/lottery/hn7xc/Hn7xc.vue'),
    meta: { title: 'Xổ số Hải Nam' }
  },
  {
    path: '/lottery/hn7xc-new',
    name: 'LotteryHn7xcNew',
    component: () => import('@/views/lottery/hn7xc/components/1.vue'),
    meta: { title: 'Xổ số Hải Nam (Bản mới)' }
  },
  {
    path: '/lottery/xy28-chat/:code?',
    name: 'Xy28Chat',
    component: () => import('@/views/lottery/xy28/Xy28Chat.vue'),
    meta: { title: 'Chat 28' }
  },
  {
    path: '/lottery/xy28/:code?',
    redirect: to => ({ path: `/lottery/xy28-chat/${to.params.code || 'yfxy28'}` })
  },
  {
    path: '/lottery/xy28/:code/:mode',
    redirect: to => ({ path: `/lottery/xy28-chat/${to.params.code || 'yfxy28'}` })
  },
  {
    path: '/lottery/xy28-help',
    name: 'Xy28Help',
    component: () => import('@/views/lottery/xy28/Xy28Help.vue'),
    meta: { title: 'Hướng dẫn cược' }
  },
  {
    path: '/lottery/xy28-history/:code?',
    name: 'Xy28History',
    component: () => import('@/views/lottery/xy28/Xy28History.vue'),
    meta: { title: 'Lịch sử mở thưởng' }
  },
  {
    path: '/lottery/room-settings/:code?',
    name: 'RoomSettings',
    component: () => import('@/views/lottery/xy28/RoomSettings.vue'),
    meta: { title: 'Cài đặt phòng' }
  },
  {
    path: '/lottery/room-members/:code?',
    name: 'RoomMembers',
    component: () => import('@/views/lottery/xy28/RoomMembers.vue'),
    meta: { title: 'Thành viên phòng' }
  },
  {
    path: '/lottery/lhc/:code?',
    name: 'LotteryLhc',
    component: () => import('@/views/lottery/lhc/Lhc.vue'),
    meta: { title: 'Lô đề (Lotto)' }
  },
  {
    path: '/lottery/lhc/:code/:mode',
    name: 'LotteryLhcHot',
    component: () => import('@/views/lottery/lhc/Lhc.vue'),
    meta: { title: 'Lô đề - Chế độ đôi' }
  },
  {
    path: '/lottery/xoso',
    name: 'XosoHome',
    component: () => import('@/views/lottery/xoso/XosoHome.vue'),
    meta: {
      title: 'Xổ Số',
      requiresAuth: false,
      keepAlive: true
    }
  },
  {
    path: '/lottery/xoso/:province',
    name: 'XosoProvince',
    component: () => import('@/views/lottery/xoso/XosoProvince.vue'),
    meta: {
      title: 'Xổ Số',
      requiresAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/lottery/xoso/:province/:date',
    name: 'XosoDetail',
    component: () => import('@/views/lottery/xoso/XosoDetail.vue'),
    meta: {
      title: 'Chi Tiết Xổ Số',
      requiresAuth: false,
      keepAlive: false
    }
  },
  {
    path: '/lottery/hall',
    name: 'LotteryHall',
    component: () => import('@/views/game/LotteryHall.vue'),
    meta: { title: 'Sảnh xổ số' }
  },
  {
    path: '/lottery/hall/hemai',
    name: 'LotteryHemaiHall',
    component: () => import('@/views/game/LotteryAllHemaiTech.vue'),
    meta: { title: 'Sảnh cược chung' }
  },
  {
    path: '/hemai/records',
    name: 'LotteryHemaiRecords',
    component: () => import('@/views/game/LotteryHemaiRecords.vue'),
    meta: { title: 'Cược chung của tôi' }
  },
  {
    path: '/hemai/create',
    name: 'LotteryHemaiCreate',
    component: () => import('@/views/game/LotteryHemaiCreate.vue'),
    meta: { title: 'Tạo cược chung' }
  },
  {
    path: '/hemai/detail',
    name: 'LotteryHemaiDetail',
    component: () => import('@/views/game/LotteryHemaiDetail.vue'),
    meta: { title: 'Chi tiết cược chung' }
  },
  {
    path: '/lottery/signin',
    name: 'LotterySignIn',
    component: () => import('@/views/game/LotterySignIn.vue'),
    meta: { title: 'Điểm danh hàng ngày', requiresAuth: true }
  },
  {
    path: '/lottery/trend/:type?',
    name: 'LotteryTrend',
    component: () => import('@/views/game/Trend.vue'),
    meta: { title: 'Xu hướng mở thưởng' }
  },
  {
    path: '/lottery/details/:id?',
    name: 'LotteryDetails',
    component: () => import('@/views/game/GameDetails.vue'),
    meta: { title: 'Chi tiết trò chơi' }
  }
]
