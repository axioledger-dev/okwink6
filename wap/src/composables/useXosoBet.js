/**
 * useXosoBet Composable
 * Betting logic for Xổ Số (Lottery)
 */

import { ref, computed } from 'vue'
import { showToast } from 'vant'
import xosoApi from '@/api/xoso'
import { 
  BET_TYPES, 
  getBetTypeName, 
  isXienType,
  MAX_SELECTIONS,
  DEFAULT_MIN_BET 
} from '@/constants/xoso'

export function useXosoBet() {
  // State
  const loading = ref(false)
  const selectedBetType = ref('')
  const selectedNumbers = ref([])
  const betAmount = ref('')
  const minBet = ref(DEFAULT_MIN_BET)
  const maxBet = ref(10000000)
  const betHistory = ref([])

  // Computed
  const betTypeName = computed(() => {
    return getBetTypeName(selectedBetType.value)
  })

  const maxSelection = computed(() => {
    return MAX_SELECTIONS[selectedBetType.value] || null
  })

  const betCount = computed(() => {
    if (!selectedNumbers.value.length) return 0
    
    // For xiên types, calculate combinations
    if (isXienType(selectedBetType.value)) {
      const n = selectedNumbers.value.length
      const r = maxSelection.value
      if (n < r) return 0
      return calculateCombinations(n, r)
    }
    
    // For normal types, each number is one bet
    return selectedNumbers.value.length
  })

  const totalAmount = computed(() => {
    const amount = Number(betAmount.value) || 0
    return betCount.value * amount
  })

  const isValid = computed(() => {
    return (
      selectedBetType.value &&
      selectedNumbers.value.length > 0 &&
      Number(betAmount.value) >= minBet.value &&
      Number(betAmount.value) <= maxBet.value
    )
  })

  // Methods

  /**
   * Set bet type
   * @param {string} type - Bet type code
   */
  const setBetType = (type) => {
    selectedBetType.value = type
    // Clear numbers when changing bet type
    selectedNumbers.value = []
  }

  /**
   * Toggle number selection
   * @param {string} number - Number to toggle
   */
  const toggleNumber = (number) => {
    const index = selectedNumbers.value.indexOf(number)
    
    if (index > -1) {
      // Remove if already selected
      selectedNumbers.value.splice(index, 1)
    } else {
      // Check max selection limit
      if (maxSelection.value && selectedNumbers.value.length >= maxSelection.value) {
        showToast(`Chỉ được chọn tối đa ${maxSelection.value} số`)
        return
      }
      // Add if not selected
      selectedNumbers.value.push(number)
    }
  }

  /**
   * Set numbers (replace all)
   * @param {Array} numbers - Array of numbers
   */
  const setNumbers = (numbers) => {
    if (maxSelection.value && numbers.length > maxSelection.value) {
      showToast(`Chỉ được chọn tối đa ${maxSelection.value} số`)
      return
    }
    selectedNumbers.value = [...numbers]
  }

  /**
   * Add number
   * @param {string} number - Number to add
   */
  const addNumber = (number) => {
    if (selectedNumbers.value.includes(number)) {
      return
    }
    
    if (maxSelection.value && selectedNumbers.value.length >= maxSelection.value) {
      showToast(`Chỉ được chọn tối đa ${maxSelection.value} số`)
      return
    }
    
    selectedNumbers.value.push(number)
  }

  /**
   * Remove number
   * @param {string} number - Number to remove
   */
  const removeNumber = (number) => {
    const index = selectedNumbers.value.indexOf(number)
    if (index > -1) {
      selectedNumbers.value.splice(index, 1)
    }
  }

  /**
   * Clear all numbers
   */
  const clearNumbers = () => {
    selectedNumbers.value = []
  }

  /**
   * Set bet amount
   * @param {number} amount - Bet amount
   */
  const setBetAmount = (amount) => {
    betAmount.value = String(amount)
  }

  /**
   * Add to bet amount
   * @param {number} amount - Amount to add
   */
  const addToBetAmount = (amount) => {
    const current = Number(betAmount.value) || 0
    betAmount.value = String(current + amount)
  }

  /**
   * Validate bet
   * @returns {boolean} - Is valid
   */
  const validateBet = () => {
    if (!selectedBetType.value) {
      showToast('Vui lòng chọn loại cược')
      return false
    }

    if (selectedNumbers.value.length === 0) {
      showToast('Vui lòng chọn số')
      return false
    }

    // Check min selection for xiên types
    if (isXienType(selectedBetType.value)) {
      const required = maxSelection.value
      if (selectedNumbers.value.length < required) {
        showToast(`Vui lòng chọn ít nhất ${required} số`)
        return false
      }
    }

    const amount = Number(betAmount.value)
    if (!amount || amount < minBet.value) {
      showToast(`Số tiền tối thiểu ${minBet.value.toLocaleString()} VND`)
      return false
    }

    if (amount > maxBet.value) {
      showToast(`Số tiền tối đa ${maxBet.value.toLocaleString()} VND`)
      return false
    }

    return true
  }

  /**
   * Submit bet
   * @param {Object} additionalData - Additional bet data (province_code, result_date, etc.)
   * @returns {Promise} - Bet result
   */
  const submitBet = async (additionalData = {}) => {
    if (!validateBet()) {
      return { success: false, message: 'Validation failed' }
    }

    loading.value = true

    try {
      const betData = {
        province_code: additionalData.province_code || additionalData.province,
        bet_type: selectedBetType.value,
        numbers: selectedNumbers.value,
        amount: Number(betAmount.value),
        result_date: additionalData.result_date || new Date().toISOString().split('T')[0]
      }

      const response = await xosoApi.placeBet(betData)
      
      if (response.code === 0) {
        showToast('Đặt cược thành công!')
        
        // Add to history
        betHistory.value.unshift({
          ...response.data,
          timestamp: new Date().toISOString(),
          betCount: betCount.value
        })

        clearBet()
        return { success: true, data: response.data }
      } else {
        throw new Error(response.message || 'Đặt cược thất bại')
      }

    } catch (error) {
      console.error('Error submitting bet:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Đặt cược thất bại'
      showToast(errorMsg)
      return { success: false, message: errorMsg }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch user bet history
   * @param {Object} params - Query parameters
   */
  const fetchBetHistory = async (params = {}) => {
    loading.value = true

    try {
      const response = await xosoApi.getMyBets(params)
      
      if (response.code === 0) {
        betHistory.value = response.data.data || []
        return {
          success: true,
          data: response.data.data,
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit
        }
      } else {
        throw new Error(response.message || 'Failed to fetch bet history')
      }

    } catch (error) {
      console.error('Error fetching bet history:', error)
      // Fallback to mock data on error
      betHistory.value = Array.from({ length: 5 }, (_, i) => ({
        bet_type: 'de',
        numbers: ['12', '34', '56'],
        amount: 10000,
        total_amount: 30000,
        created_at: new Date(Date.now() - i * 3600000).toISOString(),
        status: i === 0 ? 'pending' : i === 1 ? 'win' : 'lose'
      }))
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch bet detail
   * @param {number} id - Bet ID
   */
  const fetchBetDetail = async (id) => {
    loading.value = true

    try {
      const response = await xosoApi.getBetDetail(id)
      
      if (response.code === 0) {
        return { success: true, data: response.data }
      } else {
        throw new Error(response.message || 'Failed to fetch bet detail')
      }

    } catch (error) {
      console.error('Error fetching bet detail:', error)
      showToast(error.message || 'Không thể tải chi tiết cược')
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear bet form
   */
  const clearBet = () => {
    selectedNumbers.value = []
    betAmount.value = ''
  }

  /**
   * Reset all state
   */
  const resetState = () => {
    selectedBetType.value = ''
    selectedNumbers.value = []
    betAmount.value = ''
    betHistory.value = []
    loading.value = false
  }

  /**
   * Set min/max bet limits
   * @param {number} min - Minimum bet
   * @param {number} max - Maximum bet
   */
  const setBetLimits = (min, max) => {
    minBet.value = min
    maxBet.value = max
  }

  // Helper: Calculate combinations (nCr)
  function calculateCombinations(n, r) {
    if (r > n) return 0
    if (r === 0 || r === n) return 1
    
    let result = 1
    for (let i = 1; i <= r; i++) {
      result = result * (n - i + 1) / i
    }
    return Math.round(result)
  }

  return {
    // State
    loading,
    selectedBetType,
    selectedNumbers,
    betAmount,
    minBet,
    maxBet,
    betHistory,

    // Computed
    betTypeName,
    maxSelection,
    betCount,
    totalAmount,
    isValid,

    // Methods
    setBetType,
    toggleNumber,
    setNumbers,
    addNumber,
    removeNumber,
    clearNumbers,
    setBetAmount,
    addToBetAmount,
    validateBet,
    submitBet,
    fetchBetHistory,
    clearBet,
    resetState,
    setBetLimits
  }
}

// Made with Bob
