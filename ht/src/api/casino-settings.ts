import request from '@/utils/http'

// Casino Settings Management
// Auto-generated API module for HT Admin


export interface CasinoSettings {
  id: number
  logo_image: string
  logo_mobile: string
  name_page: string
  title: string
  min_deposit: number
  max_deposit: number
  min_withdraw: number
  max_withdraw: number
  fee: number
}

/**
 * Get settings
 */
export function fetchCasinoSettings(params?: any) {
  return request.get<any>({
    url: '/app/admin/casino/settings/get',
    params
  })
}

/**
 * Update settings
 */
export function updateCasinoSettings(data: any) {
  return request.post<any>({
    url: '/app/admin/casino/settings/update',
    data,
    showSuccessMessage: true
  })
}

