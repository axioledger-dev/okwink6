import request from '@/utils/http'

// Casino Discount Management
// Auto-generated API module for HT Admin


export interface CasinoDiscount {
  id: number
  title: string
  sub_title: string
  money_min_get: number
  money_max_get: number
  phantram: number
  vongcuoc: number
  status: number
  start: string
  end: string
}

export interface CasinoDiscountSearchParams {
  page?: number
  limit?: number
  status?: number
}

export interface CasinoDiscountList {
  list: CasinoDiscount[]
  total: number
}

/**
 * Get discount list
 */
export function fetchCasinoDiscountList(params?: any) {
  return request.get<any>({
    url: '/app/admin/casino/discount/list',
    params
  })
}

/**
 * Create discount
 */
export function createCasinoDiscount(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/discount/add',
    data,
    showSuccessMessage: true
  })
}

/**
 * Update discount
 */
export function updateCasinoDiscount(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/discount/edit',
    data,
    showSuccessMessage: true
  })
}

/**
 * Delete discount
 */
export function deleteCasinoDiscount(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/discount/delete',
    data,
    showSuccessMessage: true
  })
}

