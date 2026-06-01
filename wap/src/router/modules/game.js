export default [
  {
    path: '/games',
    name: 'GamesHome',
    component: () => import('@/views/games/GamesHome.vue'),
    meta: { title: 'Trò Chơi' }
  },
  {
    path: '/game/search',
    name: 'GameSearch',
    component: () => import('@/views/game/SearchGame.vue'),
    meta: { title: 'Tìm kiếm trò chơi' }
  },
  {
    path: '/game/slot',
    name: 'GameSlot',
    component: () => import('@/views/game/SlotHall.vue'),
    meta: { title: 'Slot', type: 'slot', gameCategoryId: 3 }
  },
  {
    path: '/game/chess',
    name: 'GameChess',
    component: () => import('@/views/game/SlotHall.vue'),
    meta: { title: 'Game bài', type: 'chess', gameCategoryId: 4 }
  },
  {
    path: '/game/live',
    name: 'GameLive',
    component: () => import('@/views/game/SlotHall.vue'),
    meta: { title: 'Casino trực tuyến', type: 'live', gameCategoryId: 1 }
  },
  {
    path: '/game/fish',
    name: 'GameFish',
    component: () => import('@/views/game/SlotHall.vue'),
    meta: { title: 'Bắn cá', type: 'fish', gameCategoryId: 2 }
  },
  {
    path: '/game/lottery',
    name: 'GameLottery',
    component: () => import('@/views/game/SlotHall.vue'),
    meta: { title: 'Xổ số', type: 'lottery', gameCategoryId: 8 }
  },
  {
    path: '/game/sport',
    name: 'GameSport',
    component: () => import('@/views/game/SlotHall.vue'),
    meta: { title: 'Thể thao', type: 'sport', gameCategoryId: 5 }
  },
  {
    path: '/game/esport',
    name: 'GameEsport',
    component: () => import('@/views/game/SlotHall.vue'),
    meta: { title: 'Thể thao điện tử', type: 'esport', gameCategoryId: 5 }
  },
  {
    path: '/game/blockchain',
    name: 'GameBlockchain',
    component: () => import('@/views/game/SlotHall.vue'),
    meta: { title: 'Blockchain', type: 'blockchain', gameCategoryId: 7 }
  },
  {
    path: '/game/cockfight',
    name: 'GameCockfight',
    component: () => import('@/views/game/SlotHall.vue'),
    meta: { title: 'Đá gà', type: 'cockfight', gameCategoryId: 6 }
  },
  {
    path: '/home/subgame',
    name: 'SubGame',
    component: () => import('@/views/game/SlotHall.vue'),
    meta: { title: 'Trò chơi', gameCategoryId: 3 }
  }
]
