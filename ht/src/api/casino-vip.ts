import request from '@/utils/http'

// Casino VIP Management
// Auto-generated API module for HT Admin


export interface CasinoVip {
  id: number
  title: string
  level: number
  month_reward: number
  up_level_reward: number
  week_reward: number
  birth_day_reward: number
  bet_amount: number
  deposit_amount: number
}

export interface CasinoVipList {
  list: CasinoVip[]
  total: number
}

/**
 * Get VIP list
 */
export function fetchCasinoVipList(params?: any) {
  return request.get<any>({
    url: '/app/admin/casino/vip/list',
    params
  })
}

/**
 * Create VIP level
 */
export function createCasinoVip(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/vip/add',
    data,
    showSuccessMessage: true
  })
}

/**
 * Update VIP level
 */
export function updateCasinoVip(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/vip/edit',
    data,
    showSuccessMessage: true
  })
}

/**
 * Delete VIP level
 */
export function deleteCasinoVip(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/vip/delete',
    data,
    showSuccessMessage: true
  })
}

