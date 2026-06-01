<template>
  <div class="xoso-province-page">
    <!-- Header -->
    <Header :cptitle="provinceName" class="xoso-header" />

    <!-- Province Info & Countdown -->
    <div class="fixed-info-container">
      <div class="province-info-card">
        <div class="info-row">
          <div class="info-item">
            <span class="label">Kỳ hiện tại:</span>
            <span class="value">{{ currentPhien || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Thời gian còn lại:</span>
            <XosoCountdown
              v-if="countdownTime"
              :endTime="countdownTime"
              @expired="onCountdownExpired"
            />
            <span v-else class="value">--:--:--</span>
          </div>
        </div>
        <div class="action-row">
          <button class="btn-secondary" @click="showDateFilter = true">
            <van-icon name="calendar-o" />
            Chọn ngày
          </button>
          <button class="btn-secondary" @click="showHistory = true">
            <van-icon name="clock-o" />
            Lịch sử
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="page-content custom-scrollbar">
      <!-- Loading -->
      <XosoLoading v-if="loading" />

      <!-- Empty -->
      <XosoEmpty v-else-if="!loading && !currentResult" message="Chưa có kết quả" />

      <!-- Result Table -->
      <div v-else class="result-section">
        <div class="result-header">
          <h3>Kết Quả Xổ Số</h3>
          <span class="result-date">{{ resultDate }}</span>
        </div>
        <XosoResultTable :results="currentResult" />
      </div>

      <!-- Betting Section -->
      <div v-if="!bettingClosed" class="betting-section">
        <XosoCategory
          v-model:activeCategory="activeCategory"
          :categories="betCategories"
        />

        <XosoBetForm
          :category="activeCategory"
          :province="provinceCode"
          :minBet="minBet"
          @submit="onBetSubmit"
        />
      </div>

      <!-- Closed Message -->
      <div v-else class="betting-closed">
        <van-icon name="warning-o" size="48" color="#ff6b6b" />
        <p>Đã hết thời gian đặt cược</p>
        <p class="sub-text">Vui lòng chờ kỳ tiếp theo</p>
      </div>

      <div class="footer-spacing"></div>
    </div>

    <!-- Date Filter Popup -->
    <van-popup v-model:show="showDateFilter" position="bottom" round :style="{ height: '50%' }">
      <XosoDateFilter
        v-model:selectedDate="selectedDate"
        @confirm="onDateConfirm"
        @close="showDateFilter = false"
      />
    </van-popup>

    <!-- History Popup -->
    <van-popup v-model:show="showHistory" position="bottom" round :style="{ height: '70%' }">
      <div class="history-container">
        <div class="history-header">
          <h3>Lịch Sử Kết Quả</h3>
          <van-icon name="cross" @click="showHistory = false" />
        </div>
        <div class="history-content custom-scrollbar">
          <XosoLoading v-if="loadingHistory" />
          <XosoEmpty v-else-if="historyList.length === 0" message="Chưa có lịch sử" />
          <div v-else class="history-list">
            <div
              v-for="item in historyList"
              :key="item.period"
              class="history-item"
              @click="viewHistoryDetail(item)"
            >
              <div class="history-info">
                <span class="period">Kỳ {{ item.period }}</span>
                <span class="date">{{ item.date }}</span>
              </div>
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Popup as VanPopup, Icon as VanIcon, showSuccessToast } from 'vant'
import Header from '@/components/headers/Header.vue'
import XosoCountdown from './components/XosoCountdown.vue'
import XosoResultTable from './components/XosoResultTable.vue'
import XosoCategory from './components/XosoCategory.vue'
import XosoBetForm from './components/XosoBetForm.vue'
import XosoDateFilter from './components/XosoDateFilter.vue'
import XosoLoading from './components/XosoLoading.vue'
import XosoEmpty from './components/XosoEmpty.vue'
import { useXosoStore } from '@/stores/xoso'
import { useXosoBet } from '@/composables/useXosoBet'
import { getProvinceByCode } from '@/data/xosoProvinces'
import { xosoConfig } from '@/config/xoso'

const route = useRoute()
const router = useRouter()
const xosoStore = useXosoStore()
const { submitBet } = useXosoBet()

// Props from route
const provinceCode = computed(() => route.params.province)

// Get state from store
const { loading, currentPhien, countdownSeconds, currentResult, historyList, betRates, minBetAmounts } = storeToRefs(xosoStore)

// Local state
const loadingHistory = ref(false)
const bettingClosed = ref(false)
const resultDate = ref('')
const selectedDate = ref(new Date())
const activeCategory = ref('baolo')
const showDateFilter = ref(false)
const showHistory = ref(false)

// Computed
const province = computed(() => getProvinceByCode(provinceCode.value))
const provinceName = computed(() => province.value?.name || 'Xổ Số')
const betCategories = computed(() => xosoConfig.betTypeCategories)
const minBet = computed(() => minBetAmounts.value[activeCategory.value] || 1000)
const countdownTime = computed(() => {
  if (countdownSeconds.value > 0) {
    return new Date(Date.now() + countdownSeconds.value * 1000)
  }
  return null
})

// Methods
const fetchProvinceData = async () => {
  await xosoStore.init(provinceCode.value)
  resultDate.value = new Date().toLocaleDateString('vi-VN')
}

const fetchHistory = async () => {
  try {
    loadingHistory.value = true
    await xosoStore.fetchHistory(provinceCode.value, 20)
    
    // Mock data
    historyList.value = Array.from({ length: 10 }, (_, i) => ({
      period: `1234${i}`,
      date: new Date(Date.now() - i * 86400000).toLocaleDateString('vi-VN')
    }))
  } catch (error) {
    console.error('Error fetching history:', error)
  } finally {
    loadingHistory.value = false
  }
}

const onCountdownExpired = () => {
  bettingClosed.value = true
  xosoStore.updateCountdown(0)
  showToast('Đã hết thời gian đặt cược')
}

const onBetSubmit = async (betData) => {
  const success = await submitBet({
    ...betData,
    province: provinceCode.value,
    phien: currentPhien.value
  })
  
  if (success) {
    showSuccessToast('Đặt cược thành công!')
  }
}

const onDateConfirm = () => {
  showDateFilter.value = false
  fetchProvinceData()
}

const viewHistoryDetail = (item) => {
  router.push({
    name: 'XosoDetail',
    params: {
      province: provinceCode.value,
      date: item.date
    }
  })
}

// Watch province change
watch(provinceCode, () => {
  fetchProvinceData()
})

// Lifecycle
onMounted(() => {
  if (!province.value) {
    router.back()
    return
  }
  fetchProvinceData()
})
</script>

<style scoped lang="scss">
.xoso-province-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.xoso-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.fixed-info-container {
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
}

.province-info-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
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
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}

.action-row {
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.btn-secondary {
  flex: 1;
  padding: 8px 16px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    background: #e0e0e0;
  }
}

.page-content {
  padding: 16px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.result-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .result-date {
    font-size: 14px;
    color: #666;
  }
}

.betting-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 16px;
}

.betting-closed {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;

  p {
    margin: 12px 0 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .sub-text {
    font-size: 14px;
    font-weight: 400;
    color: #999;
  }
}

.history-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
}

.history-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    background: #f0f0f0;
  }
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .period {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .date {
    font-size: 12px;
    color: #666;
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