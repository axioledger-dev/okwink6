/**
 * Xổ Số (Vietnamese Lottery) Store
 * Pinia store for managing xoso state
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import xosoApi from '@/api/xoso'
import { xosoRegions, getAllProvinces, getProvincesByRegion } from '@/data/xosoProvinces'
import { XOSO_REGIONS } from '@/constants/xoso'

export const useXosoStore = defineStore('xoso', () => {
  // State
  const loading = ref(false)
  const error = ref(null)
  const selectedRegion = ref(XOSO_REGIONS.MIEN_BAC)
  const selectedProvince = ref(null)
  const currentPhien = ref(null)
  const countdownSeconds = ref(0)
  const latestResults = ref({})
  const currentResult = ref(null)
  const historyList = ref([])
  const betRates = ref({})
  const minBetAmounts = ref({})

  // Computed
  const provinces = computed(() => {
    return getProvincesByRegion(selectedRegion.value)
  })

  const allProvinces = computed(() => {
    return getAllProvinces()
  })

  // Actions

  /**
   * Initialize xoso data for a province
   * @param {string} provinceCode - Province code
   */
  const init = async (provinceCode) => {
    loading.value = true
    error.value = null
    selectedProvince.value = provinceCode

    try {
      // Fetch schedule and latest result
      const [scheduleRes, resultRes] = await Promise.all([
        xosoApi.getSchedule(provinceCode),
        xosoApi.getLatestResults({ province_code: provinceCode, limit: 1 })
      ])
      
      if (scheduleRes.code === 0 && scheduleRes.data.length > 0) {
        const schedule = scheduleRes.data[0]
        currentPhien.value = schedule.next_draw || new Date().toISOString()
        // Calculate countdown seconds
        if (schedule.next_draw) {
          const nextDrawTime = new Date(schedule.next_draw).getTime()
          const now = Date.now()
          countdownSeconds.value = Math.max(0, Math.floor((nextDrawTime - now) / 1000))
        }
      }

      if (resultRes.code === 0 && resultRes.data.length > 0) {
        currentResult.value = resultRes.data[0]
      }

      // Set default bet rates and min amounts
      betRates.value = {
        de: 80,
        lo2: 27,
        lo3so: 23,
        lo4so: 20,
        xien2: 17,
        xien3: 15,
        xien4: 13
      }
      minBetAmounts.value = {
        de: 1000,
        lo2: 1000,
        lo3so: 1000,
        lo4so: 1000,
        xien2: 1000,
        xien3: 1000,
        xien4: 1000
      }

    } catch (err) {
      error.value = err.message || 'Failed to initialize'
      console.error('Xoso init failed:', err)
      // Fallback to mock data
      currentPhien.value = Math.floor(Math.random() * 100000).toString()
      countdownSeconds.value = 3600
      currentResult.value = {
        province_code: provinceCode,
        result_date: new Date().toISOString().split('T')[0],
        result_data: generateMockResult()
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch latest results
   * @param {string} provinceCode - Optional province code filter
   */
  const fetchLatestResults = async (provinceCode = null) => {
    loading.value = true
    error.value = null

    try {
      const response = await xosoApi.getLatestResults({
        province_code: provinceCode,
        limit: 10
      })
      
      if (response.code === 0) {
        // Convert array to object keyed by province_code
        const resultsMap = {}
        response.data.forEach(result => {
          resultsMap[result.province_code] = result
        })
        latestResults.value = resultsMap
      } else {
        throw new Error(response.message || 'Failed to fetch results')
      }

      // Mock data for now
      const provincesToFetch = region ? getProvincesByRegion(region) : getAllProvinces()
      const mockResults = {}
      
      provincesToFetch.forEach(province => {
        mockResults[province.code] = {
          date: new Date().toLocaleDateString('vi-VN'),
          period: Math.floor(Math.random() * 100000).toString(),
          data: generateMockResult()
        }
      })
      
      latestResults.value = mockResults

    } catch (err) {
      error.value = err.message || 'Failed to fetch latest results'
      console.error('Error fetching latest results:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch history
   * @param {string} provinceCode - Province code
   * @param {number} limit - Number of records
   */
  const fetchHistory = async (provinceCode, limit = 20) => {
    loading.value = true
    error.value = null

    try {
      // TODO_BACKEND_INTEGRATION: Fetch real data
      // const response = await xosoApi.getResults({ 
      //   theloai: provinceCode,
      //   limit 
      // })
      // historyList.value = response.data

      // Mock data for now
      historyList.value = Array.from({ length: limit }, (_, i) => ({
        period: (100000 - i).toString(),
        date: new Date(Date.now() - i * 86400000).toLocaleDateString('vi-VN'),
        results: generateMockResult()
      }))

    } catch (err) {
      error.value = err.message || 'Failed to fetch history'
      console.error('Error fetching history:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Update countdown
   * @param {number} seconds - Remaining seconds
   */
  const updateCountdown = (seconds) => {
    countdownSeconds.value = seconds
  }

  /**
   * Set selected region
   * @param {string} region - Region key
   */
  const setSelectedRegion = (region) => {
    selectedRegion.value = region
  }

  /**
   * Set selected province
   * @param {string} provinceCode - Province code
   */
  const setSelectedProvince = (provinceCode) => {
    selectedProvince.value = provinceCode
  }

  /**
   * Reset store state
   */
  const resetState = () => {
    loading.value = false
    error.value = null
    selectedProvince.value = null
    currentPhien.value = null
    countdownSeconds.value = 0
    currentResult.value = null
    historyList.value = []
  }

  // Helper: Generate mock result
  function generateMockResult() {
    return {
      gdb: [generateRandomNumber(5)],
      g1: [generateRandomNumber(5)],
      g2: [generateRandomNumber(5), generateRandomNumber(5)],
      g3: [generateRandomNumber(5), generateRandomNumber(5), generateRandomNumber(5)],
      g4: [generateRandomNumber(5), generateRandomNumber(5), generateRandomNumber(5), generateRandomNumber(5)],
      g5: [generateRandomNumber(5), generateRandomNumber(5), generateRandomNumber(5), generateRandomNumber(5), generateRandomNumber(5), generateRandomNumber(5)],
      g6: [generateRandomNumber(5), generateRandomNumber(5), generateRandomNumber(5)],
      g7: [generateRandomNumber(5), generateRandomNumber(5), generateRandomNumber(5), generateRandomNumber(5)]
    }
  }

  function generateRandomNumber(length) {
    return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0')
  }

  return {
    // State
    loading,
    error,
    selectedRegion,
    selectedProvince,
    currentPhien,
    countdownSeconds,
    latestResults,
    currentResult,
    historyList,
    betRates,
    minBetAmounts,

    // Computed
    provinces,
    allProvinces,

    // Actions
    init,
    fetchLatestResults,
    fetchHistory,
    updateCountdown,
    setSelectedRegion,
    setSelectedProvince,
    resetState
  }
})

// Made with Bob
