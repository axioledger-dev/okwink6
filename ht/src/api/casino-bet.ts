import request from '@/utils/http'

// Casino Bet History
// Auto-generated API module for HT Admin


export interface CasinoBet {
  id: number
  username: string
  type: string
  phien: string
  amount: number
  win: number
  status: number
  created_at: string
}

export interface CasinoBetSearchParams {
  page?: number
  limit?: number
  username?: string
  type?: string
  status?: number
  start_date?: string
  end_date?: string
}

export interface CasinoBetList {
  list: CasinoBet[]
  total: number
}

export interface CasinoBetStatistics {
  total_bets: number
  total_amount: number
  total_win: number
  total_loss: number
}

/**
 * Get bet list
 */
export function fetchCasinoBetList(params?: any) {
  return request.get<any>({
    url: '/app/admin/casino/bet/list',
    params
  })
}

/**
 * Get bet detail
 */
export function fetchCasinoBetDetail(params?: any) {
  return request.get<any>({
    url: '/app/admin/casino/bet/detail',
    params
  })
}

/**
 * Get statistics
 */
export function fetchCasinoBetStatistics(params?: any) {
  return request.get<any>({
    url: '/app/admin/casino/bet/statistics',
    params
  })
}

