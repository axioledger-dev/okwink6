<template>
  <div class="p-4">
    <div class="mb-4 bg-box p-4 rounded-lg shadow-sm">
      <el-form :inline="true" :model="searchForm" class="flex-1">
        <el-form-item label="Tên người dùng">
          <el-input v-model="searchForm.username" placeholder="Tên người dùng" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="Nền tảng">
          <el-select v-model="searchForm.platform" placeholder="Tất cả" clearable style="width: 120px">
            <el-option
              v-for="item in platformOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Mã giao dịch">
          <el-input v-model="searchForm.trano" placeholder="Mã giao dịch" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="Loại">
          <el-select v-model="searchForm.type" placeholder="Tất cả" clearable style="width: 120px">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Trạng thái">
          <el-select v-model="searchForm.status" placeholder="Tất cả" clearable style="width: 120px">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Thời gian">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="-"
            start-placeholder="Thời gian bắt đầu"
            end-placeholder="Thời gian kết thúc"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 340px"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <template #icon><ArtSvgIcon icon="ri:search-line" /></template>
            Tìm kiếm
          </el-button>
          <el-button @click="resetSearch">Đặt lại</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="bg-box p-4 rounded-lg shadow-sm">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="trano" label="Mã giao dịch" min-width="180" show-overflow-tooltip />
        <el-table-column prop="username" label="Tên người dùng" width="120" align="center" />
        <el-table-column prop="platform" label="Nền tảng" width="100" align="center">
          <template #default="{ row }">
            <el-tag effect="plain">{{ row.platform }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="Loại" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === 'in' ? 'success' : 'warning'">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="amount" label="Số tiền giao dịch" width="120" align="right">
          <template #default="{ row }">
            <span class="font-mono font-bold">{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="before_amount" label="Trước biến động" width="120" align="right">
           <template #default="{ row }">
            <span class="font-mono text-g-500">{{ row.before_amount || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="after_amount" label="Sau biến động" width="120" align="right">
           <template #default="{ row }">
            <span class="font-mono text-g-500">{{ row.after_amount || '-' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="Trạng thái" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="created_at" label="Thời gian tạo" width="170" align="center" sortable />
        
        <el-table-column prop="remark" label="Ghi chú" min-width="150" show-overflow-tooltip />
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  fetchTransferList,
  fetchTransferTypeOptions,
  fetchTransferStatusOptions,
  type GameTransfer
} from '@/api/game-record'
import { fetchPlatformOptions, type PlatformOption } from '@/api/game-platform'

const loading = ref(false)
const tableData = ref<GameTransfer[]>([])
const platformOptions = ref<PlatformOption[]>([])
const statusOptions = ref<{value: number, label: string}[]>([])
const typeOptions = ref<{value: string, label: string}[]>([])

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const searchForm = reactive({
  username: '',
  platform: '',
  trano: '',
  type: '',
  status: undefined as number | undefined,
  start_time: '',
  end_time: ''
})

const dateRange = ref<[string, string] | null>(null)

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchTransferList({
      page: pagination.page,
      limit: pagination.limit,
      ...searchForm
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const loadOptions = async () => {
  try {
    const [platforms, statuses, types] = await Promise.all([
      fetchPlatformOptions(),
      fetchTransferStatusOptions(),
      fetchTransferTypeOptions()
    ])
    platformOptions.value = platforms || []
    statusOptions.value = statuses || [
      { value: 0, label: 'Đang xử lý' },
      { value: 1, label: 'Thành công' },
      { value: 2, label: 'Thất bại' }
    ]
    typeOptions.value = types || [
        { value: 'in', label: 'Chuyển vào' },
        { value: 'out', label: 'Chuyển ra' }
    ]
  } catch (error) {
    console.error(error)
  }
}

const handleDateChange = (val: [string, string] | null) => {
  if (val) {
    searchForm.start_time = val[0]
    searchForm.end_time = val[1]
  } else {
    searchForm.start_time = ''
    searchForm.end_time = ''
  }
}

const getStatusType = (status: number) => {
  if (status === 1) return 'success'
  if (status === 2) return 'danger'
  return 'warning'
}

const getStatusLabel = (status: number) => {
  const opt = statusOptions.value.find(o => o.value === status)
  return opt ? opt.label : (status === 1 ? 'Thành công' : (status === 2 ? 'Thất bại' : 'Đang xử lý'))
}

const getTypeLabel = (type: string) => {
    const opt = typeOptions.value.find(o => o.value === type)
    return opt ? opt.label : (type === 'in' ? 'Chuyển vào' : 'Chuyển ra')
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const resetSearch = () => {
  searchForm.username = ''
  searchForm.platform = ''
  searchForm.trano = ''
  searchForm.type = ''
  searchForm.status = undefined
  searchForm.start_time = ''
  searchForm.end_time = ''
  dateRange.value = null
  handleSearch()
}

const handleSizeChange = (val: number) => {
  pagination.limit = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadData()
}

onMounted(() => {
  loadData()
  loadOptions()
})
</script>
