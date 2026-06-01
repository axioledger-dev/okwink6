import request from './request'

/**
 * Xổ Số API Client
 * All API calls for Xổ Số functionality
 */
export const xosoApi = {
  /**
   * Get all active categories
   * @returns {Promise}
   */
  getCategories() {
    return request({
      url: '/v1/xoso/categories',
      method: 'get'
    })
  },

  /**
   * Get provinces by category or all provinces
   * @param {string} categoryCode - Optional category code filter
   * @returns {Promise}
   */
  getProvinces(categoryCode = null) {
    return request({
      url: '/v1/xoso/provinces',
      method: 'get',
      params: categoryCode ? { category_code: categoryCode } : {}
    })
  },

  /**
   * Get draw schedule
   * @param {string} provinceCode - Optional province code filter
   * @returns {Promise}
   */
  getSchedule(provinceCode = null) {
    return request({
      url: '/v1/xoso/schedule',
      method: 'get',
      params: provinceCode ? { province_code: provinceCode } : {}
    })
  },

  /**
   * Get latest results
   * @param {Object} params - Query parameters
   * @param {string} params.province_code - Optional province code filter
   * @param {number} params.limit - Number of results to return (default: 10, max: 50)
   * @returns {Promise}
   */
  getLatestResults(params = {}) {
    return request({
      url: '/v1/xoso/latest-results',
      method: 'get',
      params
    })
  },

  /**
   * Get result detail by ID
   * @param {number} id - Result ID
   * @returns {Promise}
   */
  getResultDetail(id) {
    return request({
      url: `/v1/xoso/result/${id}`,
      method: 'get'
    })
  },

  /**
   * Place a bet
   * @param {Object} data - Bet data
   * @param {string} data.province_code - Province code
   * @param {string} data.bet_type - Bet type (de, lo2, xien2, etc.)
   * @param {Array<string>} data.numbers - Array of numbers to bet on
   * @param {number} data.amount - Bet amount per number
   * @param {string} data.result_date - Expected result date (YYYY-MM-DD)
   * @returns {Promise}
   */
  placeBet(data) {
    return request({
      url: '/v1/xoso/bet',
      method: 'post',
      data
    })
  },

  /**
   * Get user's bets
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 20, max: 50)
   * @param {string} params.status - Filter by status (pending, win, lose)
   * @param {string} params.province_code - Filter by province code
   * @returns {Promise}
   */
  getMyBets(params = {}) {
    return request({
      url: '/v1/xoso/my-bets',
      method: 'get',
      params
    })
  },

  /**
   * Get bet detail
   * @param {number} id - Bet ID
   * @returns {Promise}
   */
  getBetDetail(id) {
    return request({
      url: `/v1/xoso/bet/${id}`,
      method: 'get'
    })
  }
}

export default xosoApi

// Made with Bob
