<template>
  <div class="app-container">
    <el-card shadow="never">
      
      <el-form :model="searchParams" inline class="mb-4 search-form">
        <el-form-item label="Loại">
          <el-select v-model="searchParams.type" placeholder="Tất cả" clearable style="width: 160px">
            <el-option label="Tất cả" value="" />
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-form-item label="Tên người dùng">
          <el-input v-model="searchParams.username" placeholder="Nhập tên người dùng" clearable @keyup.enter="handleSearch" style="width: 150px" />
        </el-form-item>
        <el-form-item label="Mã đơn">
          <el-input v-model="searchParams.trano" placeholder="Nhập mã đơn" clearable @keyup.enter="handleSearch" style="width: 180px" />
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
        <el-table-column prop="trano" label="Mã đơn" width="200" align="center" show-overflow-tooltip />
        <el-table-column prop="username" label="Tên người dùng" width="120" align="center" />
        <el-table-column prop="typename" label="Tên loại" width="120" align="center">
          <template #default="{ row }">
            <el-tag effect="plain">{{ row.typename }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Số tiền" width="120" align="center">
          <template #default="{ row }">
            <span :class="Number(row.amount) >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
              {{ Number(row.amount).toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="amountbefor" label="Trước biến động" width="120" align="center">
          <template #default="{ row }">
            {{ Number(row.amountbefor).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="amountafter" label="Sau biến động" width="120" align="center">
          <template #default="{ row }">
            {{ Number(row.amountafter).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="Ghi chú" min-width="200" align="center" show-overflow-tooltip />
        <el-table-column prop="oddtime_text" label="Thời gian" width="170" align="center" />
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
import { fetchBalanceLog, type BalanceLogItem, type BalanceLogSearchParams } from '@/api/member'
import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'

const loading = ref(false)
const tableData = ref<BalanceLogItem[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const searchParams = reactive<BalanceLogSearchParams>({
  username: '',
  type: '',
  trano: '',
  sDate: '',
  eDate: ''
})

const dateRange = ref<[string, string] | null>(null)

const typeOptions = [

  { value: 'order', label: 'Đại lý mua' },
  { value: 'cancel', label: 'Hủy đơn' },
  { value: 'reward', label: 'Hoàn thưởng' },
  { value: 'rollback', label: 'Hủy đơn từ hệ thống' },

  { value: 'yeb_dq', label: 'Tiết kiệm có kỳ hạn' },
  { value: 'yeb_hq', label: 'Tiết kiệm không kỳ hạn' },
  { value: 'yeb_lixi', label: 'Lãi suất tiết kiệm' },
  { value: 'yuebao_claim', label: 'Thu nhập lãi suất' },

  { value: 'fanshui', label: 'Thưởng thêm hàng ngày' },
  { value: 'jinjishenhe', label: 'Thưởng thăng cấp' },
  { value: 'Thưởng thăng cấp', label: 'Thưởng thăng cấp (cũ)' },
  { value: 'yongjinshenhe', label: 'Hoàn điểm đại lý' },
  { value: 'Hoa hồng đại lý', label: 'Hoa hồng đại lý' },
  { value: 'xima', label: 'Hoàn mã' },
  { value: 'Hoàn trả', label: 'Hoàn trả' },
  { value: 'point', label: 'Tích lũy' },

  { value: 'activity_bindcard', label: 'Tặng khi liên kết ngân hàng' },
  { value: 'activity_cz', label: 'Hoạt động nạp tiền' },
  { value: 'activity_czzs', label: 'Hoạt động tặng khi nạp tiền' },
  { value: 'activity_rxf', label: 'Tặng tiêu dùng hàng ngày' },
  { value: 'activity_rks', label: 'Tặng lỗ hàng ngày' },
  { value: 'activity_yxf', label: 'Tặng tiêu dùng hàng tháng' },
  { value: 'activity_yks', label: 'Tặng lỗ hàng tháng' },
  { value: 'Thưởng hoạt động', label: 'Thưởng hoạt động' },
  { value: 'Thưởng điểm danh', label: 'Thưởng điểm danh' },

  { value: 'recharge', label: 'Nạp tiền' },
  { value: 'withdraw', label: 'Rút tiền' },
  { value: 'withdraw_reject', label: 'Hoàn trả rút tiền' },
  { value: 'withdraw_cancel', label: 'Hủy rút tiền' },
  { value: 'adminadd', label: 'Quản trị viên cộng' },
  { value: 'adminjian', label: 'Quản trị viên trừ' }
]

const fetchData = async () => {
  loading.value = true
  try {
    const res = await fetchBalanceLog({
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

const handleDateChange = (val: [string, string] | null) => {
  if (val) {
    searchParams.sDate = val[0]
    searchParams.eDate = val[1]
  } else {
    searchParams.sDate = ''
    searchParams.eDate = ''
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchParams.username = ''
  searchParams.type = ''
  searchParams.trano = ''
  searchParams.sDate = ''
  searchParams.eDate = ''
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
  fetchData()
})
</script>

<style scoped>
.search-form .el-form-item {
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>
