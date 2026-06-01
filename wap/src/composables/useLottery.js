/**
 * useLottery.js - Lottery/Betting Composable
 *
 * Quản lý logic betting chung cho tất cả loại lottery
 *
 * Features:
 * - Bet cart state management
 * - Bet selection logic (toggle, add, remove)
 * - SessionStorage persistence với expiration
 * - Bet amount validation
 * - Submit handling với cart cleanup
 * - Memory leak prevention
 *
 * @example
 * import { useLottery } from '@/composables/useLottery'
 *
 * const {
 *   betCart,
 *   addToBetCart,
 *   removeFromBetCart,
 *   clearBetCart,
 *   submitBets
 * } = useLottery('k3')
 */

import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast, showConfirmDialog } from 'vant'
import { validateAmount } from '@/utils/validation'
import { formatCurrency, parseCurrency } from '@/utils/currency'
import { useUserStore } from '@/stores/user'

// ============================================================================
// CONSTANTS
// ============================================================================

const BET_CART_EXPIRY = 15 * 60 * 1000 // 15 minutes
const STORAGE_KEY_PREFIX = 'lottery_bet_cart_'
const MIN_BET_AMOUNT = 1000 // 1k VND
const MAX_BET_AMOUNT = 10000000 // 10M VND

// ============================================================================
// STORAGE HELPERS
// ============================================================================

/**
 * Save bet cart to SessionStorage with expiration
 */
const saveBetCartToStorage = (lotteryType, cart) => {
  try {
    const key = `${STORAGE_KEY_PREFIX}${lotteryType}`
    const data = {
      cart,
      timestamp: Date.now(),
      expiresAt: Date.now() + BET_CART_EXPIRY
    }
    sessionStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save bet cart:', e)
  }
}

/**
 * Load bet cart from SessionStorage with expiration check
 */
const loadBetCartFromStorage = (lotteryType) => {
  try {
    const key = `${STORAGE_KEY_PREFIX}${lotteryType}`
    const stored = sessionStorage.getItem(key)

    if (!stored) return null

    const data = JSON.parse(stored)
    const now = Date.now()

    // Check if expired
    if (data.expiresAt && now >= data.expiresAt) {
      console.log('Bet cart expired, clearing...')
      sessionStorage.removeItem(key)
      return null
    }

    return data.cart
  } catch (e) {
    console.error('Failed to load bet cart:', e)
    return null
  }
}

/**
 * Clear bet cart from SessionStorage
 */
const clearBetCartFromStorage = (lotteryType) => {
  try {
    const key = `${STORAGE_KEY_PREFIX}${lotteryType}`
    sessionStorage.removeItem(key)
  } catch (e) {
    console.error('Failed to clear bet cart:', e)
  }
}

/**
 * Clear all expired bet carts
 */
const clearExpiredBetCarts = () => {
  try {
    const now = Date.now()
    const keys = Object.keys(sessionStorage)

    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        try {
          const stored = sessionStorage.getItem(key)
          if (stored) {
            const data = JSON.parse(stored)
            if (data.expiresAt && now >= data.expiresAt) {
              sessionStorage.removeItem(key)
            }
          }
        } catch (e) {
          // Invalid data, remove it
          sessionStorage.removeItem(key)
        }
      }
    })
  } catch (e) {
    console.error('Failed to clear expired carts:', e)
  }
}

// ============================================================================
// COMPOSABLE FUNCTION
// ============================================================================

export function useLottery(lotteryType = 'default') {
  const router = useRouter()
  const userStore = useUserStore()

  // ==========================================================================
  // STATE
  // ==========================================================================

  // Bet cart: Array of bet items
  const betCart = ref([])

  // Bet settings
  const betAmount = ref(1000) // Default 1k VND
  const betMultiplier = ref(1)

  // Loading states
  const isSubmitting = ref(false)
  const isLoading = ref(false)

  // Timer for expiration check
  let expirationCheckTimer = null

  // ==========================================================================
  // COMPUTED PROPERTIES
  // ==========================================================================

  const totalBets = computed(() => {
    return betCart.value.reduce((total, item) => {
      return total + (item.count || 1)
    }, 0)
  })

  const totalAmount = computed(() => {
    return betCart.value.reduce((total, item) => {
      const itemAmount = item.amount || betAmount.value
      const itemMultiplier = item.multiplier || betMultiplier.value
      const itemCount = item.count || 1
      return total + (itemAmount * itemMultiplier * itemCount)
    }, 0)
  })

  const hasItems = computed(() => betCart.value.length > 0)

  const canSubmit = computed(() => {
    return hasItems.value &&
           !isSubmitting.value &&
           totalAmount.value >= MIN_BET_AMOUNT &&
           totalAmount.value <= MAX_BET_AMOUNT
  })

  // ==========================================================================
  // BET CART MANAGEMENT
  // ==========================================================================

  /**
   * Add item to bet cart
   */
  const addToBetCart = (item) => {
    if (!item) {
      showToast('Dữ liệu cược không hợp lệ')
      return false
    }

    // Check if item already exists
    const existingIndex = betCart.value.findIndex(cartItem => {
      return cartItem.id === item.id ||
             (cartItem.playId === item.playId &&
              JSON.stringify(cartItem.numbers) === JSON.stringify(item.numbers))
    })

    if (existingIndex > -1) {
      // Update existing item
      betCart.value[existingIndex] = {
        ...betCart.value[existingIndex],
        ...item,
        updatedAt: Date.now()
      }
    } else {
      // Add new item
      betCart.value.push({
        ...item,
        id: item.id || `${Date.now()}_${Math.random()}`,
        addedAt: Date.now(),
        updatedAt: Date.now()
      })
    }

    // Save to storage
    saveBetCartToStorage(lotteryType, betCart.value)

    showToast('Đã thêm vào giỏ cược')
    return true
  }

  /**
   * Remove item from bet cart
   */
  const removeFromBetCart = (itemId) => {
    const index = betCart.value.findIndex(item => item.id === itemId)

    if (index > -1) {
      betCart.value.splice(index, 1)
      saveBetCartToStorage(lotteryType, betCart.value)
      showToast('Đã xóa khỏi giỏ cược')
      return true
    }

    return false
  }

  /**
   * Update item in bet cart
   */
  const updateBetCartItem = (itemId, updates) => {
    const index = betCart.value.findIndex(item => item.id === itemId)

    if (index > -1) {
      betCart.value[index] = {
        ...betCart.value[index],
        ...updates,
        updatedAt: Date.now()
      }
      saveBetCartToStorage(lotteryType, betCart.value)
      return true
    }

    return false
  }

  /**
   * Clear all items from bet cart
   */
  const clearBetCart = () => {
    betCart.value = []
    clearBetCartFromStorage(lotteryType)
    showToast('Đã xóa tất cả')
  }

  /**
   * Toggle item in bet cart
   */
  const toggleBetCartItem = (item) => {
    const existingIndex = betCart.value.findIndex(cartItem => {
      return cartItem.id === item.id ||
             (cartItem.playId === item.playId &&
              JSON.stringify(cartItem.numbers) === JSON.stringify(item.numbers))
    })

    if (existingIndex > -1) {
      removeFromBetCart(betCart.value[existingIndex].id)
    } else {
      addToBetCart(item)
    }
  }

  /**
   * Check if item is in cart
   */
  const isInBetCart = (item) => {
    return betCart.value.some(cartItem => {
      return cartItem.id === item.id ||
             (cartItem.playId === item.playId &&
              JSON.stringify(cartItem.numbers) === JSON.stringify(item.numbers))
    })
  }

  // ==========================================================================
  // BET AMOUNT & MULTIPLIER
  // ==========================================================================

  const setBetAmount = (amount) => {
    const numAmount = parseCurrency(amount)

    if (numAmount < MIN_BET_AMOUNT) {
      showToast(`Số tiền tối thiểu ${formatCurrency(MIN_BET_AMOUNT)}`)
      return false
    }

    if (numAmount > MAX_BET_AMOUNT) {
      showToast(`Số tiền tối đa ${formatCurrency(MAX_BET_AMOUNT)}`)
      return false
    }

    betAmount.value = numAmount
    return true
  }

  const setBetMultiplier = (multiplier) => {
    const num = Number(multiplier)

    if (!num || num < 1) {
      showToast('Bội số tối thiểu là 1')
      return false
    }

    if (num > 10000) {
      showToast('Bội số tối đa là 10,000')
      return false
    }

    betMultiplier.value = num
    return true
  }

  const increaseBetMultiplier = () => {
    setBetMultiplier(betMultiplier.value + 1)
  }

  const decreaseBetMultiplier = () => {
    if (betMultiplier.value > 1) {
      setBetMultiplier(betMultiplier.value - 1)
    }
  }

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  const validateBetCart = () => {
    if (!hasItems.value) {
      showToast('Giỏ cược trống')
      return false
    }

    if (totalAmount.value < MIN_BET_AMOUNT) {
      showToast(`Tổng tiền tối thiểu ${formatCurrency(MIN_BET_AMOUNT)}`)
      return false
    }

    if (totalAmount.value > MAX_BET_AMOUNT) {
      showToast(`Tổng tiền tối đa ${formatCurrency(MAX_BET_AMOUNT)}`)
      return false
    }

    // Check user balance
    if (userStore.balance < totalAmount.value) {
      showToast('Số dư không đủ')
      return false
    }

    return true
  }

  const validateBetItem = (item) => {
    if (!item) {
      return { isValid: false, error: 'Dữ liệu cược không hợp lệ' }
    }

    if (!item.playId) {
      return { isValid: false, error: 'Thiếu loại cược' }
    }

    if (!item.numbers || item.numbers.length === 0) {
      return { isValid: false, error: 'Chưa chọn số' }
    }

    const amount = item.amount || betAmount.value
    const amountValidation = validateAmount(amount, MIN_BET_AMOUNT, MAX_BET_AMOUNT)

    if (!amountValidation.isValid) {
      return amountValidation
    }

    return { isValid: true, error: null }
  }

  // ==========================================================================
  // SUBMIT HANDLING
  // ==========================================================================

  const submitBets = async (apiSubmitFn, options = {}) => {
    if (!validateBetCart()) {
      return { success: false, error: 'Validation failed' }
    }

    // Confirm dialog
    if (options.confirm !== false) {
      try {
        await showConfirmDialog({
          title: 'Xác nhận đặt cược',
          message: `Tổng ${totalBets.value} cược\nSố tiền: ${formatCurrency(totalAmount.value)}`,
          confirmButtonText: 'Đặt cược',
          cancelButtonText: 'Hủy'
        })
      } catch (e) {
        return { success: false, error: 'User cancelled' }
      }
    }

    try {
      isSubmitting.value = true
      showLoadingToast({
        message: 'Đang đặt cược...',
        forbidClick: true,
        duration: 0
      })

      // Prepare bet data
      const betData = {
        lotteryType,
        bets: betCart.value.map(item => ({
          playId: item.playId,
          numbers: item.numbers,
          amount: item.amount || betAmount.value,
          multiplier: item.multiplier || betMultiplier.value,
          count: item.count || 1
        })),
        totalAmount: totalAmount.value,
        totalBets: totalBets.value,
        ...options.extraData
      }

      // Call API
      const result = await apiSubmitFn(betData)

      closeToast()

      if (result.success || result.code === 0) {
        showToast('Đặt cược thành công')

        // Clear cart after successful submission
        clearBetCart()

        // Refresh balance
        if (options.refreshBalance !== false) {
          await userStore.loadBalance?.()
        }

        // Callback
        if (options.onSuccess) {
          options.onSuccess(result)
        }

        return { success: true, data: result.data }
      } else {
        throw new Error(result.message || result.msg || 'Đặt cược thất bại')
      }
    } catch (error) {
      console.error('Submit bets failed:', error)
      closeToast()
      showToast(error.message || 'Đặt cược thất bại')

      if (options.onError) {
        options.onError(error)
      }

      return { success: false, error: error.message }
    } finally {
      isSubmitting.value = false
    }
  }

  // ==========================================================================
  // STORAGE PERSISTENCE
  // ==========================================================================

  const loadBetCart = () => {
    const stored = loadBetCartFromStorage(lotteryType)
    if (stored && Array.isArray(stored)) {
      betCart.value = stored
    }
  }

  const saveBetCart = () => {
    saveBetCartToStorage(lotteryType, betCart.value)
  }

  // ==========================================================================
  // EXPIRATION CHECK (with memory leak prevention)
  // ==========================================================================

  const startExpirationCheck = () => {
    // Clear existing timer
    stopExpirationCheck()

    // Check every minute
    expirationCheckTimer = setInterval(() => {
      const stored = loadBetCartFromStorage(lotteryType)

      // If cart expired in storage, clear local cart
      if (!stored && betCart.value.length > 0) {
        betCart.value = []
        showToast('Giỏ cược đã hết hạn')
      }
    }, 60000) // Check every 1 minute
  }

  const stopExpirationCheck = () => {
    if (expirationCheckTimer) {
      clearInterval(expirationCheckTimer)
      expirationCheckTimer = null
    }
  }

  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================

  // Load cart on init
  loadBetCart()

  // Start expiration check
  startExpirationCheck()

  // Clear expired carts on init
  clearExpiredBetCarts()

  // Watch cart changes and save to storage
  watch(betCart, (newCart) => {
    if (newCart.length > 0) {
      saveBetCartToStorage(lotteryType, newCart)
    }
  }, { deep: true })

  // Cleanup on unmount
  onUnmounted(() => {
    stopExpirationCheck()
  })

  // ==========================================================================
  // RETURN PUBLIC API
  // ==========================================================================

  return {
    // State
    betCart,
    betAmount,
    betMultiplier,
    isSubmitting,
    isLoading,

    // Computed
    totalBets,
    totalAmount,
    hasItems,
    canSubmit,

    // Cart management
    addToBetCart,
    removeFromBetCart,
    updateBetCartItem,
    clearBetCart,
    toggleBetCartItem,
    isInBetCart,

    // Amount & multiplier
    setBetAmount,
    setBetMultiplier,
    increaseBetMultiplier,
    decreaseBetMultiplier,

    // Validation
    validateBetCart,
    validateBetItem,

    // Submit
    submitBets,

    // Storage
    loadBetCart,
    saveBetCart,

    // Cleanup
    stopExpirationCheck
  }
}

export default useLottery

// Export helpers for external use
export {
  BET_CART_EXPIRY,
  MIN_BET_AMOUNT,
  MAX_BET_AMOUNT,
  clearExpiredBetCarts,
  clearBetCartFromStorage
}

// Made with Bob
