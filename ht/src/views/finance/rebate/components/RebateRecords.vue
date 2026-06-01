<template>
  <div class="rebate-records">
    
    <el-card class="mb-4">
      <el-form :model="searchForm" inline>
        <el-form-item label="Tên người dùng">
          <el-input v-model="searchForm.username" placeholder="Vui lòng nhập tên người dùng" clearable />
        </el-form-item>
        <el-form-item label="Trạng thái">
          <el-select v-model="searchForm.status" placeholder="Tất cả" clearable>
            <el-option label="Chờ duyệt" :value="0" />
            <el-option label="Đã duyệt" :value="1" />
            <el-option label="Đã từ chối" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="Loại">
          <el-select v-model="searchForm.type" placeholder="Tất cả" clearable>
            <el-option label="Hoàn trả người chơi" value="daily" />
            <el-option label="Hoàn trả đại lý" value="vendor" />
          </el-select>
        </el-form-item>
        <el-form-item label="Ngày">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">Truy vấn</el-button>
          <el-button @click="resetSearch">Đặt lại</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    
    <el-row :gutter="16" class="mb-4">
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="Phát hôm nay" :value="stats.today?.total || 0" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="Số lượt hôm nay" :value="stats.today?.count || 0" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="Chờ duyệt" :value="stats.totalPending || 0" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="Lũy kế tháng này" :value="stats.month?.total || 0" prefix="¥" />
        </el-card>
      </el-col>
    </el-row>

    
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Danh sách bản ghi hoàn trả</span>
          <div>
            <el-button type="success" size="small" @click="batchAuditHandler('pass')" :disabled="!selectedIds.length">
              Duyệt hàng loạt
            </el-button>
            <el-button type="danger" size="small" @click="batchAuditHandler('reject')" :disabled="!selectedIds.length">
              Từ chối hàng loạt
            </el-button>
          </div>
        </div>
      </template>

      <el-table 
        :data="list" 
        v-loading="loading" 
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="trano" label="Mã đơn hàng" width="180" />
        <el-table-column prop="username" label="Tên người dùng" width="120" />
        <el-table-column prop="groupname" label="Cấp VIP" width="80" />
        <el-table-column prop="type_label" label="Loại" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'daily' ? 'primary' : 'success'" size="small">
              {{ row.type_label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="touzhuedu" label="Số tiền cược" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.touzhuedu?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="bili" label="Tỷ lệ" width="80" align="center">
          <template #default="{ row }">
            {{ row.bili }}%
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Số tiền hoàn trả" width="120" align="right">
          <template #default="{ row }">
            <span class="text-primary">¥{{ row.amount?.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="oddtime" label="Thời gian" width="160" />
        <el-table-column prop="shenhe" label="Trạng thái" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.shenhe)" size="small">
              {{ getStatusText(row.shenhe) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="120" fixed="right">
          <template #default="{ row }">
            <template v-if="row.shenhe === 0">
              <el-button type="success" link size="small" @click="auditHandler(row.id, 'pass')">
                Duyệt
              </el-button>
              <el-button type="danger" link size="small" @click="auditHandler(row.id, 'reject')">
                Từ chối
              </el-button>
            </template>
            <span v-else class="text-gray-400">Đã xử lý</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper mt-4">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  fetchRebateList, fetchRebateStats, auditRebate, batchAuditRebate,
  type RebateRecord, type RebateStats
} from '@/api/rebate'

const loading = ref(false)
const list = ref<RebateRecord[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const selectedIds = ref<number[]>([])

const stats = ref<RebateStats>({
  today: { total: 0, count: 0, pending: 0 },
  month: { total: 0, count: 0 },
  totalPending: 0
})

const searchForm = reactive({
  username: '',
  status: '' as string | number,
  type: '',
  dateRange: [] as string[]
})

const getStatusText = (status: number) => {
  const map: Record<number, string> = { 0: 'Chờ duyệt', 1: 'Đã duyệt', 2: 'Đã từ chối' }
  return map[status] || 'Không xác định'
}

const getStatusType = (status: number): 'success' | 'warning' | 'danger' | 'info' | 'primary' => {
  const map: Record<number, 'warning' | 'success' | 'danger' | 'info'> = { 0: 'warning', 1: 'success', 2: 'danger' }
  return map[status] || 'info'
}

const loadData = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: page.value,
      pageSize: pageSize.value
    }
    if (searchForm.username) params.username = searchForm.username
    if (searchForm.status !== '') params.status = searchForm.status
    if (searchForm.type) params.type = searchForm.type
    if (searchForm.dateRange?.length === 2) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }

    const data = await fetchRebateList(params)
    if (data) {
      list.value = data.list || []
      total.value = data.total || 0
    }
  } catch (e) {
    ElMessage.error('Tải dữ liệu thất bại')
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const data = await fetchRebateStats()
    if (data) {
      stats.value = data
    }
  } catch (e) {
    console.error('Tải thống kê thất bại', e)
  }
}

const resetSearch = () => {
  searchForm.username = ''
  searchForm.status = ''
  searchForm.type = ''
  searchForm.dateRange = []
  page.value = 1
  loadData()
}

const handleSelectionChange = (rows: RebateRecord[]) => {
  selectedIds.value = rows.filter(r => r.shenhe === 0).map(r => r.id)
}

const auditHandler = async (id: number, action: 'pass' | 'reject') => {
  const actionText = action === 'pass' ? 'Duyệt' : 'Từ chối'
  try {
    await ElMessageBox.confirm(`Xác nhận ${actionText} đơn hoàn trả này không?`, 'Thông báo', {
      type: 'warning'
    })

    await auditRebate(id, action)
    ElMessage.success(`Đã ${actionText}`)
    loadData()
    loadStats()
  } catch (e) {

  }
}

const batchAuditHandler = async (action: 'pass' | 'reject') => {
  if (!selectedIds.value.length) return

  const actionText = action === 'pass' ? 'Duyệt' : 'Từ chối'
  try {
    await ElMessageBox.confirm(`Xác nhận ${actionText} hàng loạt ${selectedIds.value.length} bản ghi đã chọn không?`, 'Thông báo', {
      type: 'warning'
    })

    const result = await batchAuditRebate(selectedIds.value, action)
    ElMessage.success(`Đã xử lý ${result?.count || 0} bản ghi`)
    loadData()
    loadStats()
  } catch (e) {

  }
}

onMounted(() => {
  loadData()
  loadStats()
})
</script>

<style scoped>
.rebate-records {
  padding: 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mb-4 {
  margin-bottom: 16px;
}
.mt-4 {
  margin-top: 16px;
}
.text-primary {
  color: #409eff;
  font-weight: 500;
}
.text-gray-400 {
  color: #c0c4cc;
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
