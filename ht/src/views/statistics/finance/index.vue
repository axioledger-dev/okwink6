<template>
  <div class="statistics-finance">
    
    <div class="art-card p-5 mb-5 max-sm:mb-4">
      <ElForm :inline="true" :model="queryParams" class="flex flex-wrap gap-2">
        <ElFormItem label="Khoảng thời gian" class="!mb-0">
          <ElDatePicker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="đến"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
          />
        </ElFormItem>
        <ElFormItem class="!mb-0">
          <ElButton type="primary" @click="handleSearch" :loading="loading">Truy vấn</ElButton>
          <ElButton @click="resetSearch">Đặt lại</ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    
    <FinanceCards :data="financeStats" :loading="loading" />

    
    <ElRow :gutter="20">
      <ElCol :xl="16" :lg="16" :xs="24">
        <FinanceTrend :data="financeStats?.trendData" :loading="loading" />
      </ElCol>
      <ElCol :xl="8" :lg="8" :xs="24">
        <ChannelTable :data="financeStats" :loading="loading" />
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :xl="12" :lg="12" :xs="24">
        <LargeTransaction :data="financeStats?.largeTransactions" :loading="loading" />
      </ElCol>
      <ElCol :xl="12" :lg="12" :xs="24">
        <ChannelTrend :data="financeStats?.channelTrend" :loading="loading" />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import FinanceCards from './modules/finance-cards.vue'
  import FinanceTrend from './modules/finance-trend.vue'
  import ChannelTable from './modules/channel-table.vue'
  import LargeTransaction from './modules/large-transaction.vue'
  import ChannelTrend from './modules/channel-trend.vue'
  import { fetchFinanceStats } from '@/api/statistics'

  defineOptions({ name: 'StatisticsFinance' })

  const queryParams = reactive({
    dateRange: [] as string[]
  })

  const loading = ref(false)
  const financeStats = ref<Api.Statistics.FinanceStats | null>(null)

  const shortcuts = [
    { text: 'Hôm nay', value: () => {
      const today = new Date()
      return [today, today]
    }},
    { text: 'Một tuần gần đây', value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }},
    { text: 'Một tháng gần đây', value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }}
  ]

  const getFinanceStats = async () => {
    try {
      loading.value = true
      const params: { startDate?: string; endDate?: string } = {}
      if (queryParams.dateRange?.length === 2) {
        params.startDate = queryParams.dateRange[0]
        params.endDate = queryParams.dateRange[1]
      }
      financeStats.value = await fetchFinanceStats(params)
    } catch (error) {
      console.error('Lấy thống kê nạp rút thất bại:', error)
    } finally {
      loading.value = false
    }
  }

  const handleSearch = () => {
    getFinanceStats()
  }

  const resetSearch = () => {
    queryParams.dateRange = []
    getFinanceStats()
  }

  onMounted(() => {
    getFinanceStats()
  })
</script>
