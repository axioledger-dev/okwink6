/**
 * Game Category Configuration
 * Centralized mapping for all game categories with numeric IDs
 */

export const GAME_CATEGORY_MAP = {
  CASINO: {
    id: 1,
    code: 'CASINO_TRUC_TUYEN',
    name: 'Casino',
    launchType: 'lobby'
  },
  FISHING: {
    id: 2,
    code: 'BAN_CA',
    name: 'Bắn Cá',
    launchType: 'game'
  },
  SLOTS: {
    id: 3,
    code: 'NO_HU',
    name: 'Nổ Hũ',
    launchType: 'game'
  },
  CARD: {
    id: 4,
    code: 'GAME_BAI',
    name: 'Game Bài',
    launchType: 'game'
  },
  SPORTS: {
    id: 5,
    code: 'THE_THAO',
    name: 'Thể Thao',
    launchType: 'lobby'
  },
  COCKFIGHT: {
    id: 6,
    code: 'DA_GA',
    name: 'Đá Gà',
    launchType: 'lobby'
  },
  BLOCKCHAIN: {
    id: 7,
    code: 'BLOCKCHAIN',
    name: 'Blockchain',
    launchType: 'game'
  },
  LOTTERY: {
    id: 8,
    code: 'XO_SO',
    name: 'Xổ Số',
    launchType: 'game'
  }
}

export const GAME_CATEGORY_ID_MAP = Object.values(GAME_CATEGORY_MAP).reduce((map, item) => {
  map[item.id] = item
  return map
}, {})

export function getGameCategoryById(id) {
  return GAME_CATEGORY_ID_MAP[Number(id)] || null
}

export function getGameCategoryByCode(code) {
  return Object.values(GAME_CATEGORY_MAP).find(item => item.code === code) || null
}

export function isLobbyCategory(id) {
  const category = getGameCategoryById(id)
  return category?.launchType === 'lobby'
}

export function isGameCategory(id) {
  const category = getGameCategoryById(id)
  return category?.launchType === 'game'
}

// Made with Bob
