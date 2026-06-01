import request from '@/utils/http'

// Casino Game Management
// Auto-generated API module for HT Admin


export interface CasinoGame {
  id: number
  title: string
  providercode: string
  logo: string
  icon1: string
  icon2: string
  type: string
  gameid: string
  status: number
  percent: number
  created_at: string
}

export interface CasinoGameSearchParams {
  page?: number
  limit?: number
  title?: string
  providercode?: string
  type?: string
  status?: number
}

export interface CasinoGameList {
  list: CasinoGame[]
  total: number
}

/**
 * Get game list
 */
export function fetchCasinoGameList(params?: any) {
  return request.get<any>({
    url: '/app/admin/casino/game/list',
    params
  })
}

/**
 * Create game
 */
export function createCasinoGame(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/game/add',
    data,
    showSuccessMessage: true
  })
}

/**
 * Update game
 */
export function updateCasinoGame(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/game/edit',
    data,
    showSuccessMessage: true
  })
}

/**
 * Delete game
 */
export function deleteCasinoGame(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/game/delete',
    data,
    showSuccessMessage: true
  })
}

/**
 * Toggle status
 */
export function toggleCasinoGameStatus(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/game/toggle-status',
    data,
    showSuccessMessage: true
  })
}

