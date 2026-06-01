import api from '@/utils/http'

/**
 * Xổ Số API Service for Admin Panel
 */

// ============================================
// Category Management APIs
// ============================================

/**
 * Get all Xổ Số categories
 */
export function fetchXosoCategories(params?: any) {
  return api.get({
    url: '/v1/xoso/categories',
    params
  })
}

/**
 * Create new category
 */
export function createXosoCategory(data: any) {
  return api.post({
    url: '/v1/admin/xoso/category',
    data
  })
}

/**
 * Update category
 */
export function updateXosoCategory(id: number, data: any) {
  return api.put({
    url: `/v1/admin/xoso/category/${id}`,
    data
  })
}

/**
 * Delete category
 */
export function deleteXosoCategory(id: number) {
  return api.del({
    url: `/v1/admin/xoso/category/${id}`
  })
}

// ============================================
// Province Management APIs
// ============================================

/**
 * Get provinces with optional category filter
 */
export function fetchXosoProvinces(params?: any) {
  return api.get({
    url: '/v1/xoso/provinces',
    params
  })
}

/**
 * Create new province
 */
export function createXosoProvince(data: any) {
  return api.post({
    url: '/v1/admin/xoso/province',
    data
  })
}

/**
 * Update province
 */
export function updateXosoProvince(id: number, data: any) {
  return api.put({
    url: `/v1/admin/xoso/province/${id}`,
    data
  })
}

/**
 * Delete province
 */
export function deleteXosoProvince(id: number) {
  return api.del({
    url: `/v1/admin/xoso/province/${id}`
  })
}

// ============================================
// Result Management APIs
// ============================================

/**
 * Get Xổ Số results with pagination
 */
export function fetchXosoResults(params: any) {
  return api.get({
    url: '/v1/xoso/latest-results',
    params
  })
}

/**
 * Get result detail
 */
export function fetchXosoResultDetail(id: number) {
  return api.get({
    url: `/v1/xoso/result/${id}`
  })
}

/**
 * Create/Import result
 */
export function createXosoResult(data: any) {
  return api.post({
    url: '/v1/admin/xoso/result',
    data
  })
}

/**
 * Update result
 */
export function updateXosoResult(id: number, data: any) {
  return api.put({
    url: `/v1/admin/xoso/result/${id}`,
    data
  })
}

/**
 * Delete result
 */
export function deleteXosoResult(id: number) {
  return api.del({
    url: `/v1/admin/xoso/result/${id}`
  })
}

// ============================================
// Bet Management APIs
// ============================================

/**
 * Get all bets with filters
 */
export function fetchXosoBets(params: any) {
  return api.get({
    url: '/v1/admin/xoso/bets',
    params
  })
}

/**
 * Get bet detail
 */
export function fetchXosoBetDetail(id: number) {
  return api.get({
    url: `/v1/xoso/bet/${id}`
  })
}

/**
 * Update bet status (for admin operations)
 */
export function updateXosoBetStatus(id: number, data: any) {
  return api.put({
    url: `/v1/admin/xoso/bet/${id}/status`,
    data
  })
}

/**
 * Cancel bet (admin)
 */
export function cancelXosoBet(id: number, reason: string) {
  return api.post({
    url: `/v1/admin/xoso/bet/${id}/cancel`,
    data: { reason }
  })
}

// ============================================
// Schedule APIs
// ============================================

/**
 * Get draw schedule
 */
export function fetchXosoSchedule(params?: any) {
  return api.get({
    url: '/v1/xoso/schedule',
    params
  })
}

// ============================================
// Statistics APIs
// ============================================

/**
 * Get Xổ Số statistics
 */
export function fetchXosoStatistics(params: any) {
  return api.get({
    url: '/v1/admin/xoso/statistics',
    params
  })
}

/**
 * Get bet statistics by province
 */
export function fetchXosoBetStatsByProvince(params: any) {
  return api.get({
    url: '/v1/admin/xoso/statistics/province',
    params
  })
}

/**
 * Get bet statistics by category
 */
export function fetchXosoBetStatsByCategory(params: any) {
  return api.get({
    url: '/v1/admin/xoso/statistics/category',
    params
  })
}

/**
 * Get revenue statistics
 */
export function fetchXosoRevenueStats(params: any) {
  return api.get({
    url: '/v1/admin/xoso/statistics/revenue',
    params
  })
}

// Made with Bob
