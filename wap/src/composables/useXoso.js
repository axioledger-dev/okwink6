/**
 * useXoso Composable
 * Main logic for Xổ Số (Lottery) functionality
 */

import { ref, computed } from 'vue'
import xosoApi from '@/api/xoso'
import { xosoRegions, getAllProvinces, getProvincesByRegion, getProvinceByCode } from '@/data/xosoProvinces'
import { XOSO_REGIONS } from '@/constants/xoso'

export function useXoso() {
  // State
  const loading = ref(false)
  const error = ref(null)
  const categories = ref([])
  const provinces = ref([])
  const selectedRegion = ref(XOSO_REGIONS.MIEN_BAC)
  const selectedProvince = ref(null)
  const latestResults = ref({})
  const resultDetail = ref(null)
  const historyList = ref([])

  // Computed
  const allProvinces = computed(() => getAllProvinces())
  
  const provincesByRegion = computed(() => {
    return getProvincesByRegion(selectedRegion.value)
  })

  const currentProvince = computed(() => {
    if (!selectedProvince.value) return null
    return getProvinceByCode(selectedProvince.value)
  })

  // Methods
  
  /**
   * Fetch categories
   */
  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await xosoApi.getCategories()
      if (response.code === 0) {
        categories.value = response.data
      } else {
        // Fallback to local data if API fails
        categories.value = xosoRegions
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch categories'
      console.error('Error fetching categories:', err)
      // Fallback to local data
      categories.value = xosoRegions
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch provinces by region
   * @param {string} region - Region key
   */
  const fetchProvinces = async (region = null) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await xosoApi.getProvinces(region)
      if (response.code === 0) {
        provinces.value = response.data
      } else {
        // Fallback to local data if API fails
        if (region) {
          provinces.value = getProvincesByRegion(region)
        } else {
          provinces.value = getAllProvinces()
        }
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch provinces'
      console.error('Error fetching provinces:', err)
      // Fallback to local data
      if (region) {
        provinces.value = getProvincesByRegion(region)
      } else {
        provinces.value = getAllProvinces()
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch latest results for all provinces
   * @param {string} provinceCode - Optional province code filter
   * @param {number} limit - Number of results
   */
  const fetchLatestResults = async (provinceCode = null, limit = 10) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await xosoApi.getLatestResults({
        province_code: provinceCode,
        limit
      })
      
      if (response.code === 0) {
        // Convert array to object keyed by province_code for easier access
        const resultsMap = {}
        response.data.forEach(result => {
          resultsMap[result.province_code] = result
        })
        latestResults.value = resultsMap
      } else {
        // Fallback to mock data
        const provincesToFetch = provinceCode ? [getProvinceByCode(provinceCode)] : getAllProvinces()
        const mockResults = {}
        
        provincesToFetch.forEach(province => {
          if (province) {
            mockResults[province.code] = {
              date: new Date().toLocaleDateString('vi-VN'),
              period: Math.floor(Math.random() * 100000).toString(),
              data: generateMockResult()
            }
          }
        })
        
        latestResults.value = mockResults
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch latest results'
      console.error('Error fetching latest results:', err)
      // Fallback to mock data on error
      const provincesToFetch = provinceCode ? [getProvinceByCode(provinceCode)] : getAllProvinces()
      const mockResults = {}
      
      provincesToFetch.forEach(province => {
        if (province) {
          mockResults[province.code] = {
            date: new Date().toLocaleDateString('vi-VN'),
            period: Math.floor(Math.random() * 100000).toString(),
            data: generateMockResult()
          }
        }
      })
      
      latestResults.value = mockResults
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch result by province
   * @param {string} provinceCode - Province code
   */
  const fetchResultByProvince = async (provinceCode) => {
    loading.value = true
    error.value = null
    selectedProvince.value = provinceCode
    
    try {
      // TODO_BACKEND_INTEGRATION: Replace with real API call
      // const response = await xosoApi.getResultByDate({ 
      //   province: provinceCode,
      //   date: new Date().toISOString().split('T')[0]
      // })
      // resultDetail.value = response.data
      
      // Mock data for now
      resultDetail.value = {
        province: provinceCode,
        date: new Date().toLocaleDateString('vi-VN'),
        period: Math.floor(Math.random() * 100000).toString(),
        time: '18:30:00',
        results: generateMockResult()
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch result'
      console.error('Error fetching result by province:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch result detail by ID
   * @param {number} id - Result ID
   */
  const fetchResultDetail = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await xosoApi.getResultDetail(id)
      
      if (response.code === 0) {
        resultDetail.value = response.data
      } else {
        throw new Error(response.message || 'Failed to fetch result detail')
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch result detail'
      console.error('Error fetching result detail:', err)
      // Fallback to mock data
      resultDetail.value = {
        id,
        province_code: 'ha-noi',
        date: new Date().toLocaleDateString('vi-VN'),
        period: Math.floor(Math.random() * 100000).toString(),
        time: '18:30:00',
        results: generateMockResult()
      }
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
      // TODO_BACKEND_INTEGRATION: Replace with real API call
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
   * Set selected region
   * @param {string} region - Region key
   */
  const setSelectedRegion = (region) => {
    selectedRegion.value = region
    fetchProvinces(region)
  }

  /**
   * Set selected province
   * @param {string} provinceCode - Province code
   */
  const setSelectedProvince = (provinceCode) => {
    selectedProvince.value = provinceCode
  }

  /**
   * Reset state
   */
  const resetState = () => {
    loading.value = false
    error.value = null
    selectedProvince.value = null
    resultDetail.value = null
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
    categories,
    provinces,
    selectedRegion,
    selectedProvince,
    latestResults,
    resultDetail,
    historyList,
    
    // Computed
    allProvinces,
    provincesByRegion,
    currentProvince,
    
    // Methods
    fetchCategories,
    fetchProvinces,
    fetchLatestResults,
    fetchResultByProvince,
    fetchResultByDate,
    fetchHistory,
    setSelectedRegion,
    setSelectedProvince,
    resetState
  }
}

// Made with Bob
