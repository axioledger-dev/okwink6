import request from '@/utils/http'

// Casino Prize Management
// Auto-generated API module for HT Admin


export interface CasinoPrize {
  id: number
  title: string
  value: number
  type: string
  probability: number
  status: number
}

export interface CasinoPrizeList {
  list: CasinoPrize[]
  total: number
}

export interface CasinoPrizeHistory {
  id: number
  username: string
  prize_value: number
  prize_type: string
  created_at: string
}

/**
 * Get prize list
 */
export function fetchCasinoPrizeList(params?: any) {
  return request.get<any>({
    url: '/app/admin/casino/prize/list',
    params
  })
}

/**
 * Create prize
 */
export function createCasinoPrize(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/prize/add',
    data,
    showSuccessMessage: true
  })
}

/**
 * Update prize
 */
export function updateCasinoPrize(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/prize/edit',
    data,
    showSuccessMessage: true
  })
}

/**
 * Delete prize
 */
export function deleteCasinoPrize(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/prize/delete',
    data,
    showSuccessMessage: true
  })
}

/**
 * Get prize history
 */
export function fetchCasinoPrizeHistory(params?: any) {
  return request.get<any>({
    url: '/app/admin/casino/prize/history',
    params
  })
}

