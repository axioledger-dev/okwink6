export default [
  {
    path: '/activity',
    name: 'ActivityIndex',
    component: () => import('@/views/activity/ActivityIndexNew.vue'),
    meta: { title: 'Trung tâm hoạt động', tabIndex: 0 }
  },
  {
    path: '/vip',
    name: 'VipCenter',
    component: () => import('@/views/activity/ActivityIndexNew.vue'),
    meta: { title: 'Trung tâm VIP', tabIndex: 1 }
  },
  {
    path: '/cashback',
    name: 'Cashback',
    component: () => import('@/views/activity/ActivityIndexNew.vue'),
    meta: { title: 'Hoàn trả', tabIndex: 2 }
  },
  {
    path: '/pending',
    name: 'PendingReward',
    component: () => import('@/views/activity/ActivityIndexNew.vue'),
    meta: { title: 'Chờ nhận thưởng', tabIndex: 3 }
  },
  {
    path: '/interest',
    name: 'InterestTreasure',
    component: () => import('@/views/activity/ActivityIndexNew.vue'),
    meta: { title: 'Tiền gửi tích lũy', tabIndex: 4 }
  },
  {
    path: '/reward-record',
    name: 'RewardRecord',
    component: () => import('@/views/activity/ActivityIndexNew.vue'),
    meta: { title: 'Lịch sử nhận thưởng', tabIndex: 5 }
  },
  {
    path: '/activity/detail/:id',
    name: 'ActivityDetail',
    component: () => import('@/views/activity/ActivityDetailNew.vue'),
    meta: { title: 'Chi tiết hoạt động' }
  },
  {
    path: '/activity/lucky-order/:id',
    name: 'LuckyOrderActivity',
    component: () => import('@/views/activity/LuckyOrderActivity.vue'),
    meta: { title: 'Vé cược may mắn' }
  },
  {
    path: '/activity/loss-rescue/:id',
    name: 'LossRescueActivity',
    component: () => import('@/views/activity/LossRescueActivity.vue'),
    meta: { title: 'Tiền cứu trợ thua cược' }
  },
  {
    path: '/activity/weekly-salary/:id',
    name: 'WeeklySalaryActivity',
    component: () => import('@/views/activity/WeeklySalaryActivity.vue'),
    meta: { title: 'Lương tuần' }
  },
  {
    path: '/activity/pg-betting-king/:id',
    name: 'PgBettingKingActivity',
    component: () => import('@/views/activity/PgBettingKingActivity.vue'),
    meta: { title: 'Vua cược PG' }
  },
  {
    path: '/activity/reward/:id',
    name: 'ActivityReward',
    component: () => import('@/views/activity/ActivityRewardDetail.vue'),
    meta: { title: 'Phần thưởng hoạt động' }
  }
]
