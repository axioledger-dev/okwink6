<template>
  <div class="app-container">
    <el-card shadow="never">
      
      <el-form :model="searchParams" inline class="mb-4 search-form">
        <el-form-item label="Tên người dùng">
          <el-input v-model="searchParams.username" placeholder="Nhập tên người dùng" clearable @keyup.enter="handleSearch" style="width: 150px" />
        </el-form-item>
        <el-form-item label="Trạng thái">
          <el-select v-model="searchParams.status" placeholder="Tất cả" clearable style="width: 120px">
            <el-option label="Tất cả" value="" />
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Khoảng thời gian">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="-"
            start-placeholder="Thời gian bắt đầu"
            end-placeholder="Thời gian kết thúc"
            value-format="YYYY-MM-DD HH:mm:ss"
            @change="handleDateChange"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <template #icon><ArtSvgIcon icon="ri:search-line" /></template>
            Tìm kiếm
          </el-button>
          <el-button @click="handleReset">
            <template #icon><ArtSvgIcon icon="ri:refresh-line" /></template>
            Đặt lại
          </el-button>
        </el-form-item>
      </el-form>

      
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />
        <el-table-column prop="order_no" label="Mã đơn" width="200" align="center" show-overflow-tooltip />
        <el-table-column prop="username" label="Tên người dùng" width="120" align="center" />
        <el-table-column label="Thay đổi cấp bậc" width="180" align="center">
          <template #default="{ row }">
            <span class="text-gray-500">{{ row.from_level_name || '-' }}</span>
            <i class="ri-arrow-right-line mx-2 text-blue-500"></i>
            <span class="text-orange-600 font-medium">{{ row.to_level_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reward_amount" label="Số tiền thưởng" width="120" align="center">
          <template #default="{ row }">
            <span class="text-orange-600 font-medium">{{ Number(row.reward_amount).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="balance_before" label="Số dư trước nhận" width="120" align="center">
          <template #default="{ row }">
            {{ Number(row.balance_before).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="balance_after" label="Số dư sau nhận" width="120" align="center">
          <template #default="{ row }">
            {{ Number(row.balance_after).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Trạng thái" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="claim_time" label="Thời gian nhận" width="170" align="center" />
        <el-table-column prop="gmt_create" label="Thời gian tạo" width="170" align="center" />
        <el-table-column prop="remark" label="Ghi chú" min-width="150" show-overflow-tooltip />
      </el-table>

      
      <div class="mt-5 flex justify-end">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :total="pagination.total"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  fetchRecordList,
  fetchStatusOptions,
  type LevelRewardRecord,
  type RecordListParams,
  type StatusOption
} from '@/api/levelReward'

const loading = ref(false)
const tableData = ref<LevelRewardRecord[]>([])
const statusOptions = ref<StatusOption[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const searchParams = reactive<RecordListParams>({
  username: '',
  status: '',
  start_date: '',
  end_date: ''
})

const dateRange = ref<[string, string] | null>(null)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await fetchRecordList({
      page: pagination.page,
      limit: pagination.limit,
      ...searchParams
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const loadStatusOptions = async () => {
  try {
    const res = await fetchStatusOptions()
    if (Array.isArray(res)) {
      statusOptions.value = res
    }
  } catch (error) {

    statusOptions.value = [
      { value: 0, label: 'Chờ nhận' },
      { value: 1, label: 'Đã nhận' },
      { value: 2, label: 'Đã hết hạn' }
    ]
  }
}

const getStatusType = (status: number) => {
  switch (status) {
    case 0: return 'warning'
    case 1: return 'success'
    case 2: return 'info'
    default: return 'info'
  }
}

const getStatusText = (status: number) => {
  const option = statusOptions.value.find(o => o.value === status)
  return option ? option.label : 'Không xác định'
}

const handleDateChange = (val: [string, string] | null) => {
  if (val) {
    searchParams.start_date = val[0]
    searchParams.end_date = val[1]
  } else {
    searchParams.start_date = ''
    searchParams.end_date = ''
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchParams.username = ''
  searchParams.status = ''
  searchParams.start_date = ''
  searchParams.end_date = ''
  dateRange.value = null
  handleSearch()
}

const handleSizeChange = (val: number) => {
  pagination.limit = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  fetchData()
}

onMounted(() => {
  loadStatusOptions()
  fetchData()
})
</script>

<style scoped>
.search-form .el-form-item {
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>
