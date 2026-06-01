<template>
  <div class="app-container p-4">
    
    <TeamCards :data="overviewData" />

    
    <ElRow :gutter="20">
      <ElCol :xl="16" :lg="16" :xs="24">
        <PerformanceChart :data="performanceTrend" />
      </ElCol>
      <ElCol :xl="8" :lg="8" :xs="24">
        <TeamStructure :data="levelData || []" />
      </ElCol>
    </ElRow>

    
    <ElRow :gutter="20">
      <ElCol :xl="16" :lg="16" :xs="24">
        <CommissionTrend :data="commissionTrend" />
      </ElCol>
      <ElCol :xl="8" :lg="8" :xs="24">
        <AgentRank :data="rankData || []" />
      </ElCol>
    </ElRow>

    <el-card shadow="never">
      
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
        <el-form-item label="Thời gian thống kê">
          <div class="flex items-center">
            <el-date-picker
              v-model="queryParams.sDate"
              type="date"
              placeholder="Ngày bắt đầu"
              value-format="YYYYMMDD"
              style="width: 140px"
            />
            <span class="mx-2">-</span>
            <el-date-picker
              v-model="queryParams.eDate"
              type="date"
              placeholder="Ngày kết thúc"
              value-format="YYYYMMDD"
              style="width: 140px"
            />
          </div>
        </el-form-item>
        <el-form-item label="Tên người dùng" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="Nhập tên người dùng"
            clearable
            style="width: 160px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">Truy vấn</el-button>
          <el-button icon="Refresh" @click="resetQuery">Đặt lại</el-button>
        </el-form-item>
      </el-form>

      
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column label="Tên người dùng" align="center" prop="username" min-width="100" />
        <el-table-column label="Tổng số" align="center" prop="totalcount" width="80" />
        <el-table-column label="Số đại lý" align="center" prop="agentcount" width="80" />
        <el-table-column label="Số hội viên" align="center" prop="usercount" width="80" />
        <el-table-column label="Số trực tuyến" align="center" prop="onlinecount" width="80" />
        <el-table-column label="Nạp tiền tự động" align="center" prop="zdrecharge" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.zdrecharge) }}
          </template>
        </el-table-column>
        <el-table-column label="Cộng tiền thủ công" align="center" prop="sdjiarecharge" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.sdjiarecharge) }}
          </template>
        </el-table-column>
        <el-table-column label="Trừ tiền thủ công" align="center" prop="sdjianrecharge" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.sdjianrecharge) }}
          </template>
        </el-table-column>
        <el-table-column label="Rút tiền" align="center" prop="withdraw" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.withdraw) }}
          </template>
        </el-table-column>
        <el-table-column label="Lãi lỗ nạp rút" align="center" prop="ctyingkui" min-width="100">
          <template #default="scope">
            <span :class="getProfitClass(scope.row.ctyingkui)">
              {{ formatAmount(scope.row.ctyingkui) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Cược" align="center" prop="touzhu" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.touzhu) }}
          </template>
        </el-table-column>
        <el-table-column label="Trả thưởng" align="center" prop="zhongjiang" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.zhongjiang) }}
          </template>
        </el-table-column>
        <el-table-column label="Hoạt động" align="center" prop="huodong" min-width="100">
          <template #default="scope">
            {{ formatAmount(scope.row.huodong) }}
          </template>
        </el-table-column>
        <el-table-column label="Lãi lỗ đặt cược" align="center" prop="tzyingkui" min-width="100">
          <template #default="scope">
            <span :class="getProfitClass(scope.row.tzyingkui)">
              {{ formatAmount(scope.row.tzyingkui) }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      
      <div class="flex justify-end mt-4">
        <el-pagination
          v-show="total > 0"
          v-model:current-page="queryParams.current"
          v-model:page-size="queryParams.size"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      
      <div class="statistics-bottom mt-4 p-3 bg-hover-color border-t-d text-sm text-g-700">
        <div class="flex flex-wrap gap-x-5 gap-y-2 items-center">
          <span>Tổng số：<strong class="text-primary">{{ pageStats.totalCount }}</strong></span>
          <span>Số đại lý：<strong class="text-primary">{{ pageStats.agentCount }}</strong></span>
          <span>Số hội viên：<strong class="text-primary">{{ pageStats.userCount }}</strong></span>
          <span>Số trực tuyến：<strong class="text-primary">{{ pageStats.onlineCount }}</strong></span>
          <span>Nạp tiền tự động：<strong class="text-primary">{{ formatAmount(pageStats.zdRecharge) }}</strong></span>
          <span>Cộng tiền thủ công：<strong class="text-primary">{{ formatAmount(pageStats.sdJiaRecharge) }}</strong></span>
          <span>Trừ tiền thủ công：<strong class="text-primary">{{ formatAmount(pageStats.sdJianRecharge) }}</strong></span>
          <span>Rút tiền：<strong class="text-primary">{{ formatAmount(pageStats.withdraw) }}</strong></span>
          <span>Lãi lỗ nạp rút：<strong :class="getProfitClass(pageStats.ctProfit)">{{ formatAmount(pageStats.ctProfit) }}</strong></span>
          <span>Cược：<strong class="text-primary">{{ formatAmount(pageStats.bet) }}</strong></span>
          <span>Trả thưởng：<strong class="text-primary">{{ formatAmount(pageStats.prize) }}</strong></span>
          <span>Hoạt động：<strong class="text-primary">{{ formatAmount(pageStats.activity) }}</strong></span>
          <span>Lãi lỗ đặt cược：<strong :class="getProfitClass(pageStats.tzProfit)">{{ formatAmount(pageStats.tzProfit) }}</strong></span>
          <span class="ml-auto">Tổng <strong class="text-primary">{{ total }}</strong> bản ghi</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import TeamCards from './modules/team-cards.vue'
import TeamStructure from './modules/team-structure.vue'
import CommissionTrend from './modules/commission-trend.vue'
import PerformanceChart from './modules/performance-chart.vue'
import AgentRank from './modules/agent-rank.vue'
import { fetchTeamList, fetchTeamOverview, fetchTeamLevels, fetchTeamCommissionTrend, fetchTeamPerformanceTrend, fetchTeamRank } from '@/api/statistics'
import type { FormInstance } from 'element-plus'

defineOptions({ name: 'StatisticsTeam' })

const loading = ref(false)
const showSearch = ref(true)
const total = ref(0)
const tableData = ref<Api.Statistics.TeamListItem[]>([])


const overviewData = ref<Api.Statistics.TeamStats | null>(null)
const levelData = ref<Api.Statistics.TeamLevelItem[] | null>(null)
const commissionTrend = ref<Api.Statistics.TrendData | null>(null)
const performanceTrend = ref<Api.Statistics.TrendData | null>(null)
const rankData = ref<Api.Statistics.TeamRankItem[] | null>(null)

const queryFormRef = ref<FormInstance>()
const queryParams = reactive<Api.Statistics.TeamListParams>({
  current: 1,
  size: 20,
  username: '',
  sDate: '',
  eDate: ''
})


const pageStats = computed(() => {
  let totalCount = 0
  let agentCount = 0
  let userCount = 0
  let onlineCount = 0
  let zdRecharge = 0
  let sdJiaRecharge = 0
  let sdJianRecharge = 0
  let withdrawAmt = 0
  let ctProfit = 0
  let betAmt = 0
  let prizeAmt = 0
  let activityAmt = 0
  let tzProfit = 0

  tableData.value.forEach(item => {
    totalCount += Number(item.totalcount || 0)
    agentCount += Number(item.agentcount || 0)
    userCount += Number(item.usercount || 0)
    onlineCount += Number(item.onlinecount || 0)
    zdRecharge += Number(item.zdrecharge || 0)
    sdJiaRecharge += Number(item.sdjiarecharge || 0)
    sdJianRecharge += Number(item.sdjianrecharge || 0)
    withdrawAmt += Number(item.withdraw || 0)
    ctProfit += Number(item.ctyingkui || 0)
    betAmt += Number(item.touzhu || 0)
    prizeAmt += Number(item.zhongjiang || 0)
    activityAmt += Number(item.huodong || 0)
    tzProfit += Number(item.tzyingkui || 0)
  })

  return {
    totalCount,
    agentCount,
    userCount,
    onlineCount,
    zdRecharge,
    sdJiaRecharge,
    sdJianRecharge,
    withdraw: withdrawAmt,
    ctProfit,
    bet: betAmt,
    prize: prizeAmt,
    activity: activityAmt,
    tzProfit
  }
})


const getList = async () => {
  loading.value = true
  try {
    const res: any = await fetchTeamList(queryParams)
    let rows: any[] = []
    let totalNum = 0
    if (Array.isArray(res)) {
      rows = res
      totalNum = res.length
    } else if (res) {
      rows = res.records || res.list || res.rows || res.data || []
      totalNum = res.total ?? res.count ?? rows.length ?? 0
    }
    tableData.value = rows
    total.value = Number(totalNum) || 0
  } catch (error) {
    console.error('Lấy thống kê đội nhóm thất bại:', error)
  } finally {
    loading.value = false
  }
}


const handleQuery = () => {
  queryParams.current = 1
  getList()
}


const resetQuery = () => {
  queryFormRef.value?.resetFields()
  queryParams.sDate = ''
  queryParams.eDate = ''
  handleQuery()
}


const handleSizeChange = (val: number) => {
  queryParams.size = val
  getList()
}


const handleCurrentChange = (val: number) => {
  queryParams.current = val
  getList()
}


const formatAmount = (amount: number | string) => {
  return Number(amount || 0).toFixed(2)
}


const getProfitClass = (amount: number | string) => {
  const val = Number(amount)
  if (val > 0) return 'text-success'
  if (val < 0) return 'text-danger'
  return ''
}

onMounted(async () => {
  getList()

  try {
    overviewData.value = await fetchTeamOverview()
  } catch (e) { console.error('Lấy tổng quan đội nhóm thất bại:', e) }
  try {
    levelData.value = await fetchTeamLevels()
  } catch (e) { console.error('Lấy phân bố cấp bậc thất bại:', e) }
  try {
    commissionTrend.value = await fetchTeamCommissionTrend()
  } catch (e) { console.error('Lấy xu hướng hoa hồng thất bại:', e) }
  try {
    performanceTrend.value = await fetchTeamPerformanceTrend()
  } catch (e) { console.error('Lấy xu hướng hiệu suất thất bại:', e) }
  try {
    rankData.value = await fetchTeamRank({ by: 'performance', limit: 10 })
  } catch (e) { console.error('Lấy bảng xếp hạng đại lý thất bại:', e) }
})
</script>

<style scoped>
.statistics-bottom strong {
  /* font-weight: bold; */
}
</style>
