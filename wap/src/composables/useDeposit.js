/**
 * useDeposit.js - Deposit Composable
 *
 * Quản lý toàn bộ logic nạp tiền (deposit) cho ứng dụng
 *
 * Features:
 * - Quản lý state nạp tiền (balance, methods, orders)
 * - Polling tỷ giá với memory leak prevention
 * - Polling đơn hàng với auto-expiration (15 phút)
 * - Validation số tiền
 * - Tích hợp clipboard
 * - Quản lý lịch sử nạp tiền
 *
 * @example
 * import { useDeposit } from '@/composables/useDeposit'
 *
 * const {
 *   balance,
 *   methods,
 *   selectedMethod,
 *   amount,
 *   isAmountValid,
 *   submitDeposit,
 *   loadMethods
 * } = useDeposit()
 */

import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { rechargeApi } from '@/api/recharge'
import { copyToClipboard } from '@/utils/clipboard'
import { formatCurrency, parseCurrency, normalizeAmount, validateAmountRange } from '@/utils/currency'
import { validateRequired, validateAmount } from '@/utils/validation'
import { useUserStore } from '@/stores/user'

// ============================================================================
// SHARED STATE (singleton pattern như useWithdraw)
// ============================================================================

const balance = ref(0)
const minAmount = ref(30000) // 30k VND
const maxAmount = ref(300000000) // 300M VND

// Payment methods
const methods = ref([])
const selectedMethod = ref(null)
const selectedChannel = ref(null)

// Crypto specific
const cryptoConfig = ref({
  trc20Address: '',
  erc20Address: '',
  rate: 24000, // VND per USDT
  minAmount: 30000,
  maxAmount: 300000000
})
const selectedNetwork = ref('TRC20') // TRC20 or ERC20

// Deposit records
const records = ref([])
const recordsPage = ref(1)
const recordsTotal = ref(0)
const isRecordsLoading = ref(false)

// Current order tracking
const currentOrder = ref(null)
const orderExpireTime = ref(null)
const orderCountdown = ref('')

// Loading states
const isLoading = ref(false)
const isRefreshing = ref(false)
const isBalanceRefreshing = ref(false)

// Filter states
const timeFilter = ref(0)
const statusFilter = ref('')
const showAllHistoryMode = ref(false)

const timeOptions = [
  { text: 'Hôm nay', value: 'today' },
  { text: 'Hôm qua', value: 'yesterday' },
  { text: '7 ngày', value: 'week' },
  { text: '30 ngày', value: 'month' },
  { text: 'Tùy chỉnh', value: 'custom' }
]

const statusOptions = [
  { text: 'Tất cả', value: '' },
  { text: 'Chờ xử lý', value: 0 },
  { text: 'Thành công', value: 1 },
  { text: 'Thất bại', value: 2 },
  { text: 'Đã hủy', value: 3 }
]

const customStartDate = ref('')
const customEndDate = ref('')

// Timers for cleanup
let ratePollingTimer = null
let orderPollingTimer = null
let countdownTimer = null

// ============================================================================
// COMPOSABLE FUNCTION
// ============================================================================

export function useDeposit() {
  const router = useRouter()
  const userStore = useUserStore()

  // ==========================================================================
  // COMPUTED PROPERTIES
  // ==========================================================================

  const hasMoreRecords = computed(() => records.value.length < recordsTotal.value)

  const walletAddress = computed(() => {
    if (selectedNetwork.value === 'TRC20') {
      return cryptoConfig.value.trc20Address
    }
    return cryptoConfig.value.erc20Address
  })

  const qrCodeUrl = computed(() => {
    if (!walletAddress.value) return ''
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(walletAddress.value)}`
  })

  const isOrderExpired = computed(() => {
    if (!orderExpireTime.value) return false
    return Date.now() >= orderExpireTime.value
  })

  const canSubmitOrder = computed(() => {
    return currentOrder.value && !isOrderExpired.value && !isLoading.value
  })

  // ==========================================================================
  // HELPER FUNCTIONS
  // ==========================================================================

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatCountdown = (ms) => {
    if (ms <= 0) return '00:00'
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  // ==========================================================================
  // BALANCE MANAGEMENT
  // ==========================================================================

  const loadBalance = async () => {
    try {
      // Sync with user store
      balance.value = userStore.balance
    } catch (e) {
      console.error('Load balance failed:', e)
    }
  }

  const refreshBalance = async () => {
    if (isBalanceRefreshing.value) return

    try {
      isBalanceRefreshing.value = true
      await loadBalance()
      showToast('Đã cập nhật số dư')
    } catch (e) {
      showToast('Cập nhật số dư thất bại')
    } finally {
      setTimeout(() => {
        isBalanceRefreshing.value = false
      }, 1000)
    }
  }

  // ==========================================================================
  // PAYMENT METHODS
  // ==========================================================================

  const loadMethods = async () => {
    try {
      isLoading.value = true
      const res = await rechargeApi.getMethods()

      if (res.code === 0) {
        methods.value = res.data || []

        // Auto-select first method if none selected
        if (!selectedMethod.value && methods.value.length > 0) {
          selectedMethod.value = methods.value[0]
        }
      }
    } catch (e) {
      console.error('Load methods failed:', e)
      showToast('Tải phương thức thanh toán thất bại')
    } finally {
      isLoading.value = false
    }
  }

  const selectMethod = (method) => {
    selectedMethod.value = method
    selectedChannel.value = null // Reset channel when method changes
  }

  const selectChannel = (channel) => {
    selectedChannel.value = channel
  }

  const selectNetwork = (network) => {
    selectedNetwork.value = network
  }

  // ==========================================================================
  // CRYPTO CONFIG
  // ==========================================================================

  const loadCryptoConfig = async () => {
    try {
      isLoading.value = true
      showLoadingToast({
        message: 'Đang tải cấu hình...',
        forbidClick: true,
        duration: 0
      })

      const res = await rechargeApi.getConfig('USDT')

      if (res.code === 0 && res.data) {
        // Update wallet addresses
        if (res.data.trc20Address) {
          cryptoConfig.value.trc20Address = res.data.trc20Address
        }
        if (res.data.erc20Address) {
          cryptoConfig.value.erc20Address = res.data.erc20Address
        }

        // Update rate
        if (res.data.rate) {
          cryptoConfig.value.rate = res.data.rate
        }

        // Update limits
        if (res.data.minAmount) {
          cryptoConfig.value.minAmount = res.data.minAmount
          minAmount.value = res.data.minAmount
        }
        if (res.data.maxAmount) {
          cryptoConfig.value.maxAmount = res.data.maxAmount
          maxAmount.value = res.data.maxAmount
        }

        closeToast()

        // Start rate polling
        startRatePolling()
      } else {
        throw new Error(res.msg || 'Không thể tải cấu hình')
      }
    } catch (error) {
      console.error('Load crypto config failed:', error)
      closeToast()
      showToast({
        message: error.message || 'Lỗi tải cấu hình',
        duration: 2000
      })
    } finally {
      isLoading.value = false
    }
  }

  // ==========================================================================
  // RATE POLLING (with memory leak prevention)
  // ==========================================================================

  const startRatePolling = () => {
    // Clear existing timer
    stopRatePolling()

    // Poll every 30 seconds
    ratePollingTimer = setInterval(async () => {
      try {
        const res = await rechargeApi.getConfig('USDT')
        if (res.code === 0 && res.data?.rate) {
          cryptoConfig.value.rate = res.data.rate
        }
      } catch (e) {
        console.error('Rate polling failed:', e)
      }
    }, 30000)
  }

  const stopRatePolling = () => {
    if (ratePollingTimer) {
      clearInterval(ratePollingTimer)
      ratePollingTimer = null
    }
  }

  // ==========================================================================
  // AMOUNT VALIDATION
  // ==========================================================================

  const validateDepositAmount = (amount) => {
    const numAmount = parseCurrency(amount)

    // Required check
    const requiredCheck = validateRequired(numAmount, 'Số tiền')
    if (!requiredCheck.isValid) {
      return requiredCheck
    }

    // Amount range check
    const rangeCheck = validateAmountRange(numAmount, minAmount.value, maxAmount.value)
    if (!rangeCheck.isValid) {
      return rangeCheck
    }

    return { isValid: true, error: null }
  }

  const calculateUsdtAmount = (vndAmount) => {
    const amount = parseCurrency(vndAmount)
    if (!amount || !cryptoConfig.value.rate) return '0.00'

    const usdt = amount / cryptoConfig.value.rate
    return usdt.toFixed(2)
  }

  const calculateVndAmount = (usdtAmount) => {
    const amount = Number(usdtAmount)
    if (!amount || !cryptoConfig.value.rate) return 0

    return Math.round(amount * cryptoConfig.value.rate)
  }

  // ==========================================================================
  // CLIPBOARD INTEGRATION
  // ==========================================================================

  const copyWalletAddress = async () => {
    if (!walletAddress.value) {
      showToast('Địa chỉ ví không khả dụng')
      return false
    }

    const result = await copyToClipboard(walletAddress.value, {
      onSuccess: () => showToast('Đã sao chép địa chỉ ví'),
      onError: () => showToast('Sao chép thất bại')
    })

    return result
  }

  const copyOrderInfo = async (orderNo) => {
    if (!orderNo) {
      showToast('Mã đơn hàng không khả dụng')
      return false
    }

    const result = await copyToClipboard(orderNo, {
      onSuccess: () => showToast('Đã sao chép mã đơn hàng'),
      onError: () => showToast('Sao chép thất bại')
    })

    return result
  }

  // ==========================================================================
  // ORDER MANAGEMENT
  // ==========================================================================

  const createOrder = async (depositData) => {
    try {
      isLoading.value = true
      showLoadingToast({
        message: 'Đang tạo đơn hàng...',
        forbidClick: true,
        duration: 0
      })

      const res = await rechargeApi.submit(depositData)

      if (res.code === 0) {
        currentOrder.value = res.data

        // Set expiration time (15 minutes from now)
        const ORDER_TIMEOUT = 15 * 60 * 1000 // 15 minutes
        orderExpireTime.value = Date.now() + ORDER_TIMEOUT

        closeToast()
        showToast('Tạo đơn hàng thành công')

        // Start countdown and polling
        startOrderCountdown()
        startOrderPolling()

        return { success: true, order: res.data }
      } else {
        throw new Error(res.msg || 'Tạo đơn hàng thất bại')
      }
    } catch (error) {
      console.error('Create order failed:', error)
      closeToast()
      showToast(error.message || 'Tạo đơn hàng thất bại')
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  const confirmOrder = async (orderNo) => {
    if (!orderNo) {
      showToast('Mã đơn hàng không hợp lệ')
      return { success: false }
    }

    if (isOrderExpired.value) {
      showToast('Đơn hàng đã hết hạn')
      return { success: false }
    }

    try {
      isLoading.value = true
      showLoadingToast({
        message: 'Đang xác nhận...',
        forbidClick: true,
        duration: 0
      })

      const res = await rechargeApi.confirm(orderNo)

      if (res.code === 0) {
        closeToast()
        showToast('Xác nhận thành công')

        // Clear current order
        clearCurrentOrder()

        // Refresh balance
        await refreshBalance()

        return { success: true }
      } else {
        throw new Error(res.msg || 'Xác nhận thất bại')
      }
    } catch (error) {
      console.error('Confirm order failed:', error)
      closeToast()
      showToast(error.message || 'Xác nhận thất bại')
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  const checkOrderStatus = async (orderNo) => {
    try {
      const res = await rechargeApi.getStatus(orderNo)

      if (res.code === 0) {
        return res.data
      }
      return null
    } catch (e) {
      console.error('Check order status failed:', e)
      return null
    }
  }

  // ==========================================================================
  // ORDER COUNTDOWN (with auto-expiration)
  // ==========================================================================

  const startOrderCountdown = () => {
    // Clear existing timer
    stopOrderCountdown()

    const updateCountdown = () => {
      if (!orderExpireTime.value) {
        orderCountdown.value = ''
        return
      }

      const remaining = orderExpireTime.value - Date.now()

      if (remaining <= 0) {
        orderCountdown.value = '00:00'
        handleOrderExpired()
        stopOrderCountdown()
        return
      }

      orderCountdown.value = formatCountdown(remaining)
    }

    // Update immediately
    updateCountdown()

    // Update every second
    countdownTimer = setInterval(updateCountdown, 1000)
  }

  const stopOrderCountdown = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }

  const handleOrderExpired = () => {
    showToast('Đơn hàng đã hết hạn')
    clearCurrentOrder()
  }

  const clearCurrentOrder = () => {
    currentOrder.value = null
    orderExpireTime.value = null
    orderCountdown.value = ''
    stopOrderCountdown()
    stopOrderPolling()
  }

  // ==========================================================================
  // ORDER POLLING (with memory leak prevention)
  // ==========================================================================

  const startOrderPolling = () => {
    if (!currentOrder.value?.orderNo) return

    // Clear existing timer
    stopOrderPolling()

    // Poll every 5 seconds
    orderPollingTimer = setInterval(async () => {
      if (!currentOrder.value?.orderNo) {
        stopOrderPolling()
        return
      }

      // Check if expired
      if (isOrderExpired.value) {
        handleOrderExpired()
        return
      }

      try {
        const status = await checkOrderStatus(currentOrder.value.orderNo)

        if (status) {
          // Update order status
          currentOrder.value = { ...currentOrder.value, ...status }

          // If completed or failed, stop polling
          if (status.status === 1 || status.status === 2) {
            showToast(status.status === 1 ? 'Nạp tiền thành công' : 'Nạp tiền thất bại')
            clearCurrentOrder()
            await refreshBalance()
          }
        }
      } catch (e) {
        console.error('Order polling failed:', e)
      }
    }, 5000)
  }

  const stopOrderPolling = () => {
    if (orderPollingTimer) {
      clearInterval(orderPollingTimer)
      orderPollingTimer = null
    }
  }

  // ==========================================================================
  // DEPOSIT RECORDS
  // ==========================================================================

  const buildRecordParams = (page = 1) => {
    const params = { page, pageSize: 20 }

    if (!showAllHistoryMode.value) {
      const timeValue = timeOptions[timeFilter.value]?.value
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      if (timeValue === 'today') {
        params.startDate = formatDate(today)
        params.endDate = formatDate(today)
      } else if (timeValue === 'yesterday') {
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        params.startDate = formatDate(yesterday)
        params.endDate = formatDate(yesterday)
      } else if (timeValue === 'week') {
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 6)
        params.startDate = formatDate(weekAgo)
        params.endDate = formatDate(today)
      } else if (timeValue === 'month') {
        const monthAgo = new Date(today)
        monthAgo.setDate(monthAgo.getDate() - 29)
        params.startDate = formatDate(monthAgo)
        params.endDate = formatDate(today)
      } else if (timeValue === 'custom' && customStartDate.value && customEndDate.value) {
        params.startDate = customStartDate.value
        params.endDate = customEndDate.value
      }
    }

    if (statusFilter.value !== '') {
      params.status = statusFilter.value
    }

    return params
  }

  const loadRecords = async (isLoadMore = false) => {
    if (isRecordsLoading.value) return

    try {
      isRecordsLoading.value = true

      if (!isLoadMore) {
        recordsPage.value = 1
        records.value.splice(0, records.value.length)
      }

      const params = buildRecordParams(recordsPage.value)
      const res = await rechargeApi.getRecords(params)

      if (res.code === 0) {
        const list = res.data.list || res.data || []
        if (isLoadMore) {
          records.value.push(...list)
        } else {
          records.value.splice(0, records.value.length, ...list)
        }
        recordsTotal.value = res.data.total || list.length
      }
    } catch (e) {
      console.error('Load records failed:', e)
    } finally {
      isRecordsLoading.value = false
    }
  }

  const refreshRecords = async () => {
    if (isRecordsLoading.value) return

    isRecordsLoading.value = true
    const startTime = Date.now()

    try {
      recordsPage.value = 1
      const params = buildRecordParams(1)
      const res = await rechargeApi.getRecords(params)

      if (res.code === 0) {
        const list = res.data.list || res.data || []
        records.value.splice(0, records.value.length, ...list)
        recordsTotal.value = res.data.total || list.length
      }

      // Ensure minimum refresh time for better UX
      const elapsed = Date.now() - startTime
      if (elapsed < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - elapsed))
      }
    } catch (e) {
      console.error('Refresh records failed:', e)
    } finally {
      isRecordsLoading.value = false
    }
  }

  const loadMoreRecords = async () => {
    if (!hasMoreRecords.value || isRecordsLoading.value) return

    recordsPage.value++
    await loadRecords(true)
  }

  const setTimeFilter = (index) => {
    timeFilter.value = index
    loadRecords()
  }

  const setStatusFilter = (status) => {
    statusFilter.value = status
    loadRecords()
  }

  const setCustomDateRange = (startDate, endDate) => {
    customStartDate.value = startDate
    customEndDate.value = endDate
    timeFilter.value = timeOptions.findIndex(opt => opt.value === 'custom')
    loadRecords()
  }

  const toggleHistoryMode = () => {
    showAllHistoryMode.value = !showAllHistoryMode.value
    loadRecords()
  }

  // ==========================================================================
  // CLEANUP (prevent memory leaks)
  // ==========================================================================

  const cleanup = () => {
    stopRatePolling()
    stopOrderPolling()
    stopOrderCountdown()
  }

  // Auto cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })

  // ==========================================================================
  // RETURN PUBLIC API
  // ==========================================================================

  return {
    // State
    balance,
    minAmount,
    maxAmount,
    methods,
    selectedMethod,
    selectedChannel,
    cryptoConfig,
    selectedNetwork,
    records,
    recordsPage,
    recordsTotal,
    currentOrder,
    orderExpireTime,
    orderCountdown,
    isLoading,
    isRefreshing,
    isBalanceRefreshing,
    isRecordsLoading,
    timeFilter,
    statusFilter,
    showAllHistoryMode,
    customStartDate,
    customEndDate,

    // Computed
    hasMoreRecords,
    walletAddress,
    qrCodeUrl,
    isOrderExpired,
    canSubmitOrder,

    // Constants
    timeOptions,
    statusOptions,

    // Balance
    loadBalance,
    refreshBalance,

    // Methods
    loadMethods,
    selectMethod,
    selectChannel,
    selectNetwork,

    // Crypto
    loadCryptoConfig,
    calculateUsdtAmount,
    calculateVndAmount,

    // Validation
    validateDepositAmount,

    // Clipboard
    copyWalletAddress,
    copyOrderInfo,

    // Orders
    createOrder,
    confirmOrder,
    checkOrderStatus,
    clearCurrentOrder,

    // Records
    loadRecords,
    refreshRecords,
    loadMoreRecords,
    setTimeFilter,
    setStatusFilter,
    setCustomDateRange,
    toggleHistoryMode,

    // Cleanup
    cleanup
  }
}

export default useDeposit

// Made with Bob
