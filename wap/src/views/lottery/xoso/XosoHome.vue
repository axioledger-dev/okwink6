<template>
  <div class="xoso-home-page">
    <!-- Header -->
    <Header cptitle="Xổ Số" class="xoso-header" />

    <!-- Region Tabs -->
    <div class="region-tabs">
      <XosoProvinceTabs
        v-model:activeRegion="activeRegion"
        :regions="regions"
      />
    </div>

    <!-- Content -->
    <div class="page-content custom-scrollbar">
      <!-- Loading State -->
      <XosoLoading v-if="loading" />

      <!-- Empty State -->
      <XosoEmpty v-else-if="!loading && provinces.length === 0" message="Không có dữ liệu" />

      <!-- Province List -->
      <div v-else class="province-list">
        <div
          v-for="province in provinces"
          :key="province.code"
          class="province-card"
          @click="goToProvince(province.code)"
        >
          <div class="province-header">
            <div class="province-name">{{ province.name }}</div>
            <div class="province-short">{{ province.shortName }}</div>
          </div>
          
          <!-- Latest Result Preview -->
          <div v-if="latestResults[province.code]" class="result-preview">
            <div class="result-info">
              <span class="result-date">{{ latestResults[province.code].date }}</span>
              <span class="result-period">Kỳ {{ latestResults[province.code].period }}</span>
            </div>
            <XosoResultTable
              :results="latestResults[province.code].data"
              :compact="true"
            />
          </div>
          
          <!-- Placeholder if no result -->
          <div v-else class="no-result">
            <span>Chưa có kết quả</span>
          </div>
        </div>
      </div>

      <div class="footer-spacing"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Header from '@/components/headers/Header.vue'
import XosoProvinceTabs from './components/XosoProvinceTabs.vue'
import XosoResultTable from './components/XosoResultTable.vue'
import XosoLoading from './components/XosoLoading.vue'
import XosoEmpty from './components/XosoEmpty.vue'
import { useXosoStore } from '@/stores/xoso'
import { xosoRegions } from '@/data/xosoProvinces'
import { XOSO_REGIONS } from '@/constants/xoso'

const router = useRouter()
const xosoStore = useXosoStore()

// Get state from store
const { loading, latestResults, selectedRegion } = storeToRefs(xosoStore)

// Use selectedRegion from store as activeRegion
const activeRegion = computed({
  get: () => selectedRegion.value,
  set: (val) => xosoStore.setSelectedRegion(val)
})

// Computed
const regions = computed(() => {
  return xosoRegions.map(region => ({
    key: region.key,
    name: region.name
  }))
})

const provinces = computed(() => {
  return xosoStore.provinces
})

// Methods
const goToProvince = (provinceCode) => {
  router.push({
    name: 'XosoProvince',
    params: { province: provinceCode }
  })
}

const fetchLatestResults = async () => {
  await xosoStore.fetchLatestResults(activeRegion.value)
}

// Watch region change
watch(activeRegion, () => {
  fetchLatestResults()
})

// Lifecycle
onMounted(() => {
  fetchLatestResults()
})
</script>

<style scoped lang="scss">
.xoso-home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 20px;
}

.xoso-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.region-tabs {
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
}

.page-content {
  padding: 16px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.province-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.province-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-2px);
  }
}

.province-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.province-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.province-short {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 12px;
}

.result-preview {
  margin-top: 12px;
}

.result-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}

.result-date {
  font-weight: 500;
}

.result-period {
  color: #999;
}

.no-result {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

.footer-spacing {
  height: 20px;
}

/* Custom scrollbar */
.custom-scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>