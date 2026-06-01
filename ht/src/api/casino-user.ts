import request from '@/utils/http'

// Casino User Management
// Auto-generated API module for HT Admin


export interface CasinoUser {
  id: number
  username: string
  fullname: string
  phone: string
  money: number
  money_bet: number
  coin: number
  spin_number: number
  status: number
  level: string
  created_at: string
}

export interface CasinoUserSearchParams {
  page?: number
  limit?: number
  username?: string
  phone?: string
  status?: number
  level?: string
}

export interface CasinoUserList {
  list: CasinoUser[]
  total: number
}

/**
 * Get user list
 */
export function fetchCasinoUserList(params?: any) {
  return request.get<any>({
    url: '/app/admin/casino/user/list',
    params
  })
}

/**
 * Get user detail
 */
export function fetchCasinoUserDetail(params?: any) {
  return request.get<any>({
    url: '/app/admin/casino/user/detail',
    params
  })
}

/**
 * Update user
 */
export function updateCasinoUser(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/user/update',
    data,
    showSuccessMessage: true
  })
}

/**
 * Update balance
 */
export function updateCasinoUserBalance(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/user/update-balance',
    data,
    showSuccessMessage: true
  })
}

/**
 * Ban user
 */
export function banCasinoUser(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/user/ban',
    data,
    showSuccessMessage: true
  })
}

