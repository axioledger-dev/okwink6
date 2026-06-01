import request from '@/utils/http'

// Casino Transaction Management
// Auto-generated API module for HT Admin


export interface CasinoTransaction {
  id: number
  username: string
  type: string
  amount: number
  status: number
  bank: string
  bank_number: string
  created_at: string
}

export interface CasinoTransactionSearchParams {
  page?: number
  limit?: number
  username?: string
  type?: string
  status?: number
  start_date?: string
  end_date?: string
}

export interface CasinoTransactionList {
  list: CasinoTransaction[]
  total: number
}

/**
 * Get transaction list
 */
export function fetchCasinoTransactionList(params?: any) {
  return request.get<any>({
    url: '/app/admin/casino/transaction/list',
    params
  })
}

/**
 * Approve transaction
 */
export function approveCasinoTransaction(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/transaction/approve',
    data,
    showSuccessMessage: true
  })
}

/**
 * Reject transaction
 */
export function rejectCasinoTransaction(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/transaction/reject',
    data,
    showSuccessMessage: true
  })
}

