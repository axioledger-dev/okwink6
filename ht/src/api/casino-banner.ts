import request from '@/utils/http'

// Casino Banner Management
// Auto-generated API module for HT Admin


export interface CasinoBanner {
  id: number
  link: string
  image: string
  type: string
  status: number
  created_at: string
}

export interface CasinoBannerSearchParams {
  page?: number
  limit?: number
  type?: string
  status?: number
}

export interface CasinoBannerList {
  list: CasinoBanner[]
  total: number
}

/**
 * Get banner list
 */
export function fetchCasinoBannerList(params?: any) {
  return request.get<any>({
    url: '/app/admin/casino/banner/list',
    params
  })
}

/**
 * Create banner
 */
export function createCasinoBanner(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/banner/add',
    data,
    showSuccessMessage: true
  })
}

/**
 * Update banner
 */
export function updateCasinoBanner(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/banner/edit',
    data,
    showSuccessMessage: true
  })
}

/**
 * Delete banner
 */
export function deleteCasinoBanner(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/banner/delete',
    data,
    showSuccessMessage: true
  })
}

