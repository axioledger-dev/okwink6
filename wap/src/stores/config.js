import { defineStore } from 'pinia'
import { ref } from 'vue'
import { homeApi } from '@/api/home'

export const useConfigStore = defineStore('config', () => {

  const siteName = ref('') // Tên trang web

  const siteLogo = ref('') // Logo trang web

  const serviceUrl = ref('') // URL dịch vụ khách hàng

  const loaded = ref(false) // Trạng thái đã tải

  const loading = ref(false) // Trạng thái đang tải

  const fetchConfig = async (force = false) => {

    // Nếu đã tải và không yêu cầu ép buộc làm mới thì bỏ qua
    if (loaded.value && !force) return

    // Nếu đang tải thì bỏ qua
    if (loading.value) return
    loading.value = true

    try {

      // Lấy dữ liệu từ bộ nhớ đệm (LocalStorage)
      const cached = localStorage.getItem('siteConfig')
      if (cached) {
        const cachedData = JSON.parse(cached)
        applySiteConfig(cachedData)
      }

      // Gọi API lấy cấu hình mới
      const res = await homeApi.getConfig()
      if (res.code === 0 && res.data) {
        applySiteConfig(res.data)

        // Lưu cấu hình mới vào bộ nhớ đệm
        localStorage.setItem('siteConfig', JSON.stringify(res.data))
      }
      loaded.value = true
    } catch (e) {
      console.error('Lấy cấu hình trang web thất bại:', e)
    } finally {
      loading.value = false
    }
  }

  const applySiteConfig = (data) => {

    // Áp dụng dữ liệu cấu hình vào các biến ref
    if (data.webtitle || data.siteName || data.site_name || data.name) {
      siteName.value = data.webtitle || data.siteName || data.site_name || data.name
    }
    if (data.siteLogo || data.site_logo || data.logo) {
      siteLogo.value = data.siteLogo || data.site_logo || data.logo
    }
    if (data.kefuthree || data.kefuqq || data.serviceUrl || data.service_url) {
      serviceUrl.value = data.kefuthree || data.kefuqq || data.serviceUrl || data.service_url
    }
  }

  return {
    siteName,
    siteLogo,
    serviceUrl,
    loaded,
    loading,
    fetchConfig
  }
})
