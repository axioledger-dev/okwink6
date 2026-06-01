<template>
  <div class="statistics-lottery" v-loading="loading">
    
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
        <ElFormItem label="Chọn loại xổ số" class="!mb-0">
          <ElSelect v-model="queryParams.lotteryId" placeholder="Tất cả loại xổ số" class="w-40" clearable>
            <ElOption label="Tất cả" value="" />
            <ElOption v-for="item in lotteryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem class="!mb-0">
          <ElButton type="primary" @click="handleSearch" :loading="loading">Truy vấn</ElButton>
          <ElButton @click="resetSearch">Đặt lại</ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    
    <ElRow :gutter="20">
      <ElCol :xl="8" :lg="8" :xs="24">
        <BetPie :data="lotteryStats?.pieData" :loading="loading" />
      </ElCol>
      <ElCol :xl="16" :lg="16" :xs="24">
        <BetTimeAnalysis :data="lotteryStats?.peakHours" :loading="loading" />
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :xl="16" :lg="16" :xs="24">
        <LotteryTable :data="lotteryStats?.list" :loading="loading" />
      </ElCol>
      <ElCol :xl="8" :lg="8" :xs="24">
        <ElRow :gutter="20">
          <ElCol :span="24">
            <HotPlay :data="lotteryStats?.hotPlay" :loading="loading" />
          </ElCol>
          <ElCol :span="24">
            <BigWinList :data="lotteryStats?.bigWins" :loading="loading" />
          </ElCol>
        </ElRow>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import LotteryTable from './modules/lottery-table.vue'
  import BetPie from './modules/bet-pie.vue'
  import HotPlay from './modules/hot-play.vue'
  import BetTimeAnalysis from './modules/bet-time-analysis.vue'
  import BigWinList from './modules/big-win-list.vue'
  import { fetchLotteryStats } from '@/api/statistics'

  defineOptions({ name: 'StatisticsLottery' })

  const queryParams = reactive({
    dateRange: [] as string[],
    lotteryId: ''
  })

  const loading = ref(false)
  const lotteryStats = ref<Api.Statistics.LotteryStats | null>(null)


  const lotteryOptions = ref([
    { label: 'Lucky28', value: '1' },
    { label: 'Bắc Kinh Kuai San', value: '2' },
    { label: 'Trùng Khánh Thời Thời Thái', value: '3' }
  ])

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

  const getLotteryStats = async () => {
    try {
      loading.value = true
      const params: Api.Statistics.LotteryParams = {}
      if (queryParams.dateRange?.length === 2) {
        params.startDate = queryParams.dateRange[0]
        params.endDate = queryParams.dateRange[1]
      }
      if (queryParams.lotteryId) {
        params.lotteryType = queryParams.lotteryId
      }
      lotteryStats.value = await fetchLotteryStats(params)
    } catch (error) {
      console.error('Lấy thống kê xổ số thất bại:', error)
    } finally {
      loading.value = false
    }
  }

  const handleSearch = () => {
    getLotteryStats()
  }

  const resetSearch = () => {
    queryParams.dateRange = []
    queryParams.lotteryId = ''
    getLotteryStats()
  }

  onMounted(() => {
    getLotteryStats()
  })
</script>
