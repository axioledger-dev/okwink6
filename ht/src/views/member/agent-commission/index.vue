<template>
  <div class="agent-commission-container">
    
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="ID đại lý">
          <el-input v-model="searchForm.agentId" placeholder="Vui lòng nhập ID đại lý" clearable />
        </el-form-item>
        <el-form-item label="Trạng thái">
          <el-select v-model="searchForm.status" placeholder="Tất cả trạng thái" clearable>
            <el-option label="Chờ nhận" :value="1" />
            <el-option label="Đã nhận" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="Khoảng ngày">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="đến"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">Truy vấn</el-button>
          <el-button @click="handleReset">Đặt lại</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    
    <el-card class="agent-list-card">
      <template #header>
        <div class="card-header">
          <span>Danh sách đại lý</span>
          <el-input
            v-model="agentSearch"
            placeholder="Tìm kiếm tài khoản đại lý"
            style="width: 200px; margin-left: auto;"
            clearable
            @keyup.enter="fetchAgents"
          >
            <template #append>
              <el-button @click="fetchAgents">Tìm kiếm</el-button>
            </template>
          </el-input>
        </div>
      </template>
      <el-table :data="agentList" stripe max-height="300">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="Tài khoản đại lý" width="120" />
        <el-table-column prop="subCount" label="Số người cấp dưới" width="100" />
        <el-table-column prop="totalPerformance" label="Tổng doanh số" width="120">
          <template #default="{ row }">{{ formatMoney(row.totalPerformance) }}</template>
        </el-table-column>
        <el-table-column prop="totalCommission" label="Tổng hoa hồng" width="120">
          <template #default="{ row }">
            <span class="text-success">{{ formatMoney(row.totalCommission) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pendingCommission" label="Chờ nhận" width="100">
          <template #default="{ row }">
            <span class="text-warning">{{ formatMoney(row.pendingCommission) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="regtime" label="Thời gian đăng ký" width="160" />
        <el-table-column label="Thao tác" width="180" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button size="small" type="primary" @click="viewAgentDetail(row)">Chi tiết</el-button>
              <el-button size="small" type="danger" @click="removeAgent(row)">Hủy đại lý</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-value">{{ formatMoney(stats.totalCommission) }}</div>
          <div class="stat-label">Tích lũy hoa hồng</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-value success">{{ formatMoney(stats.claimed) }}</div>
          <div class="stat-label">Đã nhận</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-value warning">{{ formatMoney(stats.pending) }}</div>
          <div class="stat-label">Chờ nhận</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-value">{{ stats.agentCount }}</div>
          <div class="stat-label">Số lượng đại lý</div>
        </el-card>
      </el-col>
    </el-row>

    
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Ghi chép hoa hồng đại lý</span>
          <el-button type="primary" size="small" @click="handleExport">Xuất</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="agentUsername" label="Tài khoản đại lý" width="120" />
        <el-table-column prop="subCount" label="Số người cấp dưới" width="100" />
        <el-table-column prop="performance" label="Số tiền doanh số" width="120">
          <template #default="{ row }">
            {{ formatMoney(row.performance) }}
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="Tỷ lệ hoàn hoa hồng" width="100">
          <template #default="{ row }">
            {{ row.rate }}%
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Số tiền hoa hồng" width="120">
          <template #default="{ row }">
            <span class="text-success">{{ formatMoney(row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Trạng thái" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 2 ? 'success' : 'warning'">
              {{ row.status === 2 ? 'Đã nhận' : 'Chờ nhận' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="settleDate" label="Ngày quyết toán" width="120" />
        <el-table-column prop="claimedAt" label="Thời gian nhận" width="160" />
        <el-table-column prop="createdAt" label="Thời gian tạo" width="160" />
        <el-table-column label="Thao tác" width="120" fixed="right">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 1" 
              type="primary" 
              size="small" 
              @click="handleManualClaim(row)"
            >
              Phát thủ công
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
      />
    </el-card>

    
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>Cấu hình hệ thống đại lý</span>
          <el-button type="primary" size="small" @click="saveSettings">Lưu cài đặt</el-button>
        </div>
      </template>
      <el-form :model="settingsForm" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Chế độ đại lý">
              <el-select v-model="settingsForm.agentMode" style="width: 100%">
                <el-option label="Lợi nhuận ròng cấp 1" value="Lợi nhuận ròng cấp 1" />
                <el-option label="Lợi nhuận ròng đa cấp" value="Lợi nhuận ròng đa cấp" />
                <el-option label="Cược hợp lệ" value="Cược hợp lệ" />
                <el-option label="Chế độ vòng cược" value="Chế độ vòng cược" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Chu kỳ quyết toán">
              <el-select v-model="settingsForm.settlementCycle" style="width: 100%">
                <el-option label="Quyết toán ngày" value="daily" />
                <el-option label="Quyết toán tuần" value="weekly" />
                <el-option label="Quyết toán tháng" value="monthly" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Ngày quyết toán">
              <el-input-number v-model="settingsForm.settlementDay" :min="1" :max="28" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">Ngưỡng thành viên hợp lệ</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Số tiền nạp tối thiểu">
              <el-input-number v-model="settingsForm.validRecharge" :min="0" :step="10" style="width: 100%">
                <template #suffix>đồng</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Dòng tiền đặt cược tối thiểu">
              <el-input-number v-model="settingsForm.validBet" :min="0" :step="100" style="width: 100%">
                <template #suffix>đồng</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Hệ số kiểm tra vòng cược">
              <el-input-number v-model="settingsForm.auditMultiple" :min="0" :max="10" :precision="1" style="width: 100%">
                <template #suffix>lần</template>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">Giới hạn chống gian lận</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Giới hạn đăng ký cùng IP mỗi ngày">
              <el-input-number v-model="settingsForm.ipLimit" :min="1" :max="50" style="width: 100%">
                <template #suffix>cái</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Giới hạn đăng ký cùng thiết bị">
              <el-input-number v-model="settingsForm.deviceLimit" :min="1" :max="20" style="width: 100%">
                <template #suffix>cái</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="success" @click="handleSettlement">Thực thi quyết toán</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    
    <el-card class="rate-config-card">
      <template #header>
        <div class="card-header">
          <span>Cấu hình tỷ lệ hoàn hoa hồng</span>
          <el-button type="primary" size="small" @click="showRateDialog = true">Chỉnh sửa cấu hình</el-button>
        </div>
      </template>
      <el-table :data="rateList" stripe>
        <el-table-column prop="effectiveCount" label="Số người hợp lệ" />
        <el-table-column prop="performance" label="Yêu cầu doanh số">
          <template #default="{ row }">
            {{ formatMoney(row.performance) }}
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="Tỷ lệ hoàn hoa hồng">
          <template #default="{ row }">
            {{ row.rate }}%
          </template>
        </el-table-column>
        <el-table-column prop="commission" label="Ví dụ hoàn hoa hồng">
          <template #default="{ row }">
            {{ formatMoney(row.commission) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    
    <el-dialog v-model="showRateDialog" title="Chỉnh sửa cấu hình tỷ lệ hoàn hoa hồng" width="600px">
      <el-form :model="rateForm" label-width="100px">
        <el-form-item 
          v-for="(item, index) in rateForm.rates" 
          :key="index"
          :label="`Cấp độ${index + 1}`"
        >
          <el-row :gutter="10">
            <el-col :span="6">
              <el-input-number v-model="item.effectiveCount" :min="1" placeholder="Số người hợp lệ" />
            </el-col>
            <el-col :span="8">
              <el-input-number v-model="item.performance" :min="0" placeholder="Yêu cầu doanh số" />
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="item.rate" :min="0" :max="100" placeholder="Tỷ lệ%" />
            </el-col>
            <el-col :span="4">
              <el-button type="danger" size="small" @click="removeRate(index)">Xóa</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addRate">Thêm cấp độ</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRateDialog = false">Hủy</el-button>
        <el-button type="primary" @click="saveRateConfig">Lưu</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { agentCommissionApi, type CommissionRecord, type RateConfig } from '@/api/agent-commission'

const searchForm = reactive({
  agentId: '',
  status: '',
  dateRange: []
})

const stats = reactive({
  totalCommission: 0,
  claimed: 0,
  pending: 0,
  agentCount: 0
})

const tableData = ref<CommissionRecord[]>([])
const loading = ref(false)

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const rateList = ref<RateConfig[]>([])
const showRateDialog = ref(false)
const rateForm = reactive({
  rates: [] as any[]
})

const settingsForm = reactive({
  agentMode: 'Lợi nhuận ròng cấp 1',
  settlementCycle: 'monthly',
  settlementDay: 1,
  validRecharge: 100,
  validBet: 500,
  auditMultiple: 1,
  ipLimit: 5,
  deviceLimit: 3
})

const agentSearch = ref('')
const agentList = ref<any[]>([])

const formatMoney = (val: any) => {
  const num = parseFloat(val) || 0
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agentCommissionApi.getList({
      agentId: searchForm.agentId,
      status: searchForm.status as any,
      startDate: searchForm.dateRange?.[0],
      endDate: searchForm.dateRange?.[1],
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    tableData.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const res = await agentCommissionApi.getStats()
    if (res) {
      Object.assign(stats, res)
    }
  } catch (e) {
    console.error(e)
  }
}

const fetchRates = async () => {
  try {
    const res = await agentCommissionApi.getRates()
    if (res) {
      rateList.value = res.list || []
      rateForm.rates = JSON.parse(JSON.stringify(rateList.value))
    }
  } catch (e) {
    console.error(e)
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.agentId = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchData()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchData()
}

const handleExport = () => {
  ElMessage.info('Chức năng xuất đang phát triển')
}

const handleManualClaim = async (row: any) => {
  try {
    await ElMessageBox.confirm(`Xác nhận phát thủ công hoa hồng ${formatMoney(row.amount)} đồng cho đại lý ${row.agentUsername}?`, 'Xác nhận phát')
    await agentCommissionApi.manualClaim({ id: row.id })
    ElMessage.success('Phát thành công')
    fetchData()
    fetchStats()
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error(e?.message || 'Phát thất bại')
    }
  }
}

const addRate = () => {
  rateForm.rates.push({
    effectiveCount: rateForm.rates.length + 1,
    performance: 0,
    rate: 0
  })
}

const removeRate = (index: number) => {
  rateForm.rates.splice(index, 1)
}

const saveRateConfig = async () => {
  try {
    await agentCommissionApi.saveRates({ rates: rateForm.rates })
    ElMessage.success('Lưu thành công')
    showRateDialog.value = false
    fetchRates()
  } catch (e: any) {
    ElMessage.error(e?.message || 'Lưu thất bại')
  }
}

const fetchSettings = async () => {
  try {
    const res = await agentCommissionApi.getSettings()
    if (res) {
      Object.assign(settingsForm, res)
    }
  } catch (e) {
    console.error(e)
  }
}

const saveSettings = async () => {
  try {
    await agentCommissionApi.saveSettings(settingsForm as any)
    ElMessage.success('Lưu cài đặt thành công')
  } catch (e: any) {
    ElMessage.error(e?.message || 'Lưu thất bại')
  }
}

const handleSettlement = async () => {
  try {
    await ElMessageBox.confirm('Xác nhận thực thi quyết toán hoa hồng? Thao tác này sẽ tạo bản ghi hoa hồng cho tất cả đại lý', 'Xác nhận quyết toán')
    const res = await agentCommissionApi.settlement()
    ElMessage.success(`Quyết toán hoàn tất, tổng cộng tạo ${res?.count || 0} bản ghi`)
    fetchData()
    fetchStats()
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error(e?.message || 'Quyết toán thất bại')
    }
  }
}

const fetchAgents = async () => {
  try {
    const res = await agentCommissionApi.getAgentList({ search: agentSearch.value })
    agentList.value = res?.list || []
  } catch (e) {
    console.error(e)
  }
}

const viewAgentDetail = (row: any) => {
  ElMessage.info(`Xem chi tiết đại lý ${row.username}`)

}

const removeAgent = async (row: any) => {
  try {
    await ElMessageBox.confirm(`Xác nhận hủy tư cách đại lý của ${row.username}?`, 'Xác nhận thao tác')
    await agentCommissionApi.removeAgent({ id: row.id })
    ElMessage.success('Đã hủy tư cách đại lý')
    fetchAgents()
    fetchStats()
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error(e?.message || 'Thao tác thất bại')
    }
  }
}

onMounted(() => {
  fetchData()
  fetchStats()
  fetchRates()
  fetchSettings()
  fetchAgents()
})
</script>

<style scoped lang="scss">
.agent-commission-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 16px;
}

.stats-row {
  margin-bottom: 16px;
}

.stat-card {
  text-align: center;
  
  .stat-value {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    
    &.success {
      color: #67c23a;
    }
    
    &.warning {
      color: #e6a23c;
    }
  }
  
  .stat-label {
    font-size: 14px;
    color: #999;
    margin-top: 8px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}

.text-success {
  color: #67c23a;
  font-weight: 500;
}

.text-warning {
  color: #e6a23c;
  font-weight: 500;
}

.agent-list-card {
  margin-bottom: 16px;
}

.settings-card {
  margin-top: 16px;
}

.rate-config-card {
  margin-top: 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
