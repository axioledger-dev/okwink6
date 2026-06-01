<template>
  <div class="xoso-detail-page">
    <!-- Header -->
    <Header :cptitle="`${provinceName} - ${displayDate}`" class="xoso-header" />

    <!-- Content -->
    <div class="page-content custom-scrollbar">
      <!-- Loading -->
      <XosoLoading v-if="loading" />

      <!-- Empty -->
      <XosoEmpty v-else-if="!loading && !resultData" message="Không tìm thấy kết quả" />

      <!-- Result Detail -->
      <div v-else class="result-detail">
        <!-- Info Card -->
        <div class="info-card">
          <div class="info-row">
            <div class="info-item">
              <span class="label">Tỉnh/Thành:</span>
              <span class="value">{{ provinceName }}</span>
            </div>
            <div class="info-item">
              <span class="label">Ngày quay:</span>
              <span class="value">{{ displayDate }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="label">Kỳ quay:</span>
              <span class="value">{{ resultData.period || '--' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Thời gian:</span>
              <span class="value">{{ resultData.time || '--' }}</span>
            </div>
          </div>
        </div>

        <!-- Result Table -->
        <div class="result-card">
          <h3 class="card-title">Kết Quả Xổ Số</h3>
          <XosoResultTable :results="resultData.results" :compact="false" />
        </div>

        <!-- Statistics -->
        <div class="stats-card">
          <h3 class="card-title">Thống Kê Đầu Đuôi</h3>
          <div class="stats-grid">
            <div class="stat-section">
              <h4>Đầu</h4>
              <div class="number-grid">
                <div
                  v-for="n in 10"
                  :key="`head-${n-1}`"
                  class="number-cell"
                  :class="{ active: headStats[n-1] > 0 }"
                >
                  <span class="number">{{ n-1 }}</span>
                  <span class="count">{{ headStats[n-1] || 0 }}</span>
                </div>
              </div>
            </div>
            <div class="stat-section">
              <h4>Đuôi</h4>
              <div class="number-grid">
                <div
                  v-for="n in 10"
                  :key="`tail-${n-1}`"
                  class="number-cell"
                  :class="{ active: tailStats[n-1] > 0 }"
                >
                  <span class="number">{{ n-1 }}</span>
                  <span class="count">{{ tailStats[n-1] || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lô Gan -->
        <div class="stats-card">
          <h3 class="card-title">Lô Gan</h3>
          <div class="loto-grid">
            <div
              v-for="n in 100"
              :key="`loto-${n-1}`"
              class="loto-cell"
              :class="{ 
                active: lotoNumbers.includes(String(n-1).padStart(2, '0')),
                gan: !lotoNumbers.includes(String(n-1).padStart(2, '0'))
              }"
            >
              {{ String(n-1).padStart(2, '0') }}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="action-buttons">
          <button class="btn-primary" @click="goToProvince">
            <van-icon name="arrow-left" />
            Quay lại
          </button>
          <button class="btn-secondary" @click="shareResult">
            <van-icon name="share-o" />
            Chia sẻ
          </button>
        </div>
      </div>

      <div class="footer-spacing"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon as VanIcon, showSuccessToast } from 'vant'
import Header from '@/components/headers/Header.vue'
import XosoResultTable from './components/XosoResultTable.vue'
import XosoLoading from './components/XosoLoading.vue'
import XosoEmpty from './components/XosoEmpty.vue'
import { useXoso } from '@/composables/useXoso'
import { getProvinceByCode } from '@/data/xosoProvinces'

const route = useRoute()
const router = useRouter()
const { fetchResultByDate, loading, error } = useXoso()

// Props from route
const provinceCode = computed(() => route.params.province)
const dateParam = computed(() => route.params.date)

// State
const resultData = ref(null)
const headStats = ref(Array(10).fill(0))
const tailStats = ref(Array(10).fill(0))
const lotoNumbers = ref([])

// Computed
const province = computed(() => getProvinceByCode(provinceCode.value))
const provinceName = computed(() => province.value?.name || 'Xổ Số')
const displayDate = computed(() => {
  if (!dateParam.value) return new Date().toLocaleDateString('vi-VN')
  return dateParam.value
})

// Methods
const fetchResultDetail = async () => {
  const result = await fetchResultByDate(provinceCode.value, dateParam.value)
  
  if (result) {
    resultData.value = {
      period: result.period || '12345',
      time: result.time || '18:30:00',
      results: result.results || result
    }
    
    // Calculate statistics
    calculateStats(resultData.value.results)
  }
}

const calculateStats = (results) => {
  // Reset stats
  headStats.value = Array(10).fill(0)
  tailStats.value = Array(10).fill(0)
  const lotoSet = new Set()

  // Process all numbers
  Object.values(results).flat().forEach(num => {
    if (num && num.length >= 2) {
      const last2 = num.slice(-2)
      lotoSet.add(last2)
      
      const head = parseInt(last2[0])
      const tail = parseInt(last2[1])
      
      if (!isNaN(head)) headStats.value[head]++
      if (!isNaN(tail)) tailStats.value[tail]++
    }
  })

  lotoNumbers.value = Array.from(lotoSet)
}

const goToProvince = () => {
  router.push({
    name: 'XosoProvince',
    params: { province: provinceCode.value }
  })
}

const shareResult = () => {
  // TODO_BACKEND_INTEGRATION: Implement share functionality
  const shareText = `Kết quả ${provinceName.value} - ${displayDate.value}\nKỳ ${resultData.value.period}`
  
  if (navigator.share) {
    navigator.share({
      title: 'Kết Quả Xổ Số',
      text: shareText
    }).then(() => {
      showSuccessToast('Chia sẻ thành công')
    }).catch(() => {
      // User cancelled or error
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      showSuccessToast('Đã sao chép vào clipboard')
    }).catch(() => {
      showToast('Không thể chia sẻ')
    })
  }
}

// Lifecycle
onMounted(() => {
  if (!province.value) {
    showToast('Tỉnh không hợp lệ')
    router.back()
    return
  }
  fetchResultDetail()
})
</script>

<style scoped lang="scss">
.xoso-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.xoso-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.page-content {
  padding: 16px;
  max-height: calc(100vh - 60px);
  overflow-y: auto;
}

.result-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card,
.result-card,
.stats-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 12px;
    color: #666;
  }

  .value {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-section {
  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin: 0 0 12px 0;
    text-align: center;
  }
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.number-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: #f8f8f8;
  border-radius: 8px;
  transition: all 0.3s ease;

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .number {
    font-size: 16px;
    font-weight: 600;
  }

  .count {
    font-size: 12px;
    margin-top: 4px;
  }
}

.loto-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
}

.loto-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  background: #f8f8f8;
  color: #999;
  transition: all 0.3s ease;

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &.gan {
    background: #fff;
    border: 1px solid #e0e0e0;
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;

  &:active {
    background: #f8f8f8;
  }
}

.footer-spacing {
  height: 20px;
}

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