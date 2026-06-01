<template>
  <div class="p-4">
    <div class="mb-4 bg-box p-4 rounded-lg shadow-sm">
      
      <div class="flex flex-wrap gap-6 mb-4 text-sm" v-if="stats">
        <div class="bg-hover-color px-4 py-2 rounded-md border-full-d">
          <span class="text-g-500">Tổng cược：</span>
          <span class="font-bold text-lg">{{ stats.total_bet }}</span>
        </div>
        <div class="bg-hover-color px-4 py-2 rounded-md border-full-d">
          <span class="text-g-500">Tổng trả thưởng：</span>
          <span class="text-success font-bold text-lg">{{ stats.total_win }}</span>
        </div>
        <div class="bg-hover-color px-4 py-2 rounded-md border-full-d">
          <span class="text-g-500">Tổng lãi lỗ：</span>
          <span :class="Number(stats.total_profit) >= 0 ? 'text-success' : 'text-danger'" class="font-bold text-lg">
            {{ stats.total_profit }}
          </span>
        </div>
      </div>

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
        <el-form-item label="Mã đơn hàng">
          <el-input v-model="searchForm.order_no" placeholder="Mã đơn hàng" clearable style="width: 160px" />
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
        <el-table-column prop="order_no" label="Mã đơn hàng" min-width="180" show-overflow-tooltip />
        <el-table-column prop="username" label="Tên người dùng" width="120" align="center" />
        <el-table-column prop="platform" label="Nền tảng" width="100" align="center">
          <template #default="{ row }">
            <el-tag effect="plain">{{ row.platform }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="game_name" label="Tên trò chơi" min-width="150" align="center" />
        
        <el-table-column prop="bet_amount" label="Số tiền cược" width="120" align="right">
          <template #default="{ row }">
            <span class="font-mono">{{ row.bet_amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="valid_bet" label="Cược hợp lệ" width="120" align="right">
          <template #default="{ row }">
            <span class="font-mono">{{ row.valid_bet }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="win_amount" label="Số tiền trả thưởng" width="120" align="right">
          <template #default="{ row }">
            <span class="font-mono font-bold text-success">{{ row.win_amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="profit" label="Lãi lỗ" width="120" align="right">
          <template #default="{ row }">
            <span :class="Number(row.profit) >= 0 ? 'text-success' : 'text-danger'" class="font-mono font-bold">
              {{ row.profit }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="Trạng thái" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="bet_time" label="Thời gian đặt cược" width="170" align="center" sortable />
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
  fetchBetList,
  fetchBetStatusOptions,
  type GameBet
} from '@/api/game-record'
import { fetchPlatformOptions, type PlatformOption } from '@/api/game-platform'

const loading = ref(false)
const tableData = ref<GameBet[]>([])
const platformOptions = ref<PlatformOption[]>([])
const statusOptions = ref<{value: string, label: string}[]>([])
const stats = ref<any>(null)

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const searchForm = reactive({
  username: '',
  platform: '',
  order_no: '',
  status: '',
  start_time: '',
  end_time: ''
})

const dateRange = ref<[string, string] | null>(null)

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchBetList({
      page: pagination.page,
      limit: pagination.limit,
      ...searchForm
    })
    tableData.value = res.list
    pagination.total = res.total
    stats.value = res.stats
  } finally {
    loading.value = false
  }
}

const loadOptions = async () => {
  try {
    const [platforms, statuses] = await Promise.all([
      fetchPlatformOptions(),
      fetchBetStatusOptions()
    ])
    platformOptions.value = platforms || []
    statusOptions.value = statuses || [
      { value: 'pending', label: 'Chưa quyết toán' },
      { value: 'settled', label: 'Đã quyết toán' },
      { value: 'cancelled', label: 'Đã hủy' }
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

const getStatusType = (status: string) => {
  if (status === 'settled') return 'success'
  if (status === 'cancelled') return 'info'
  return 'warning'
}

const getStatusLabel = (status: string) => {
  const opt = statusOptions.value.find(o => o.value === status)
  return opt ? opt.label : status
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const resetSearch = () => {
  searchForm.username = ''
  searchForm.platform = ''
  searchForm.order_no = ''
  searchForm.status = ''
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
