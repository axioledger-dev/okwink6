<template>
  <div class="app-container">
    <el-card shadow="never">
      
      <el-form :model="searchParams" inline class="mb-4 search-form">
        <el-form-item label="Trạng thái">
          <el-select v-model="searchParams.state" placeholder="Tất cả" clearable style="width: 120px">
            <el-option label="Tất cả" value="" />
            <el-option label="Chờ xử lý" :value="0" />
            <el-option label="Đang xác nhận" :value="1" />
            <el-option label="Thành công" :value="2" />
            <el-option label="Thất bại" :value="3" />
            <el-option label="Đã hủy" :value="4" />
            <el-option label="Quá thời gian" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="Khoảng thời gian">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="Thời gian bắt đầu"
            end-placeholder="Thời gian kết thúc"
            value-format="YYYYMMDD"
            @change="handleDateChange"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="Số tiền">
          <div class="flex items-center">
            <el-input v-model="searchParams.sAmout" placeholder="Số tiền tối thiểu" style="width: 100px" />
            <span class="mx-2">-</span>
            <el-input v-model="searchParams.eAmout" placeholder="Số tiền tối đa" style="width: 100px" />
          </div>
        </el-form-item>
        <el-form-item label="Tên người dùng">
          <el-input v-model="searchParams.username" placeholder="Nhập tên người dùng" clearable @keyup.enter="handleSearch" style="width: 140px" />
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

      
      <el-table v-loading="loading" :data="tableData" border stripe show-summary :summary-method="getSummaries">
        <el-table-column prop="trano" label="Mã đơn nền tảng" width="200" align="center" sortable show-overflow-tooltip />
        <el-table-column prop="username" label="Tên người dùng" width="120" align="center" sortable />
        <el-table-column prop="paytype" label="Tài khoản thanh toán" width="120" align="center" sortable />
        <el-table-column prop="paytypetitle" label="Phương thức nạp" width="120" align="center" sortable />
        <el-table-column prop="oldaccountmoney" label="Trước nạp" width="120" align="center" sortable>
          <template #default="{ row }">
            {{ Number(row.oldaccountmoney || 0).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Số tiền" width="120" align="center" sortable>
          <template #default="{ row }">
            <span class="text-red-500 font-medium">{{ Number(row.amount || 0).toFixed(0) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="newaccountmoney" label="Sau nạp" width="120" align="center" sortable>
          <template #default="{ row }">
            {{ Number(row.newaccountmoney || 0).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="Ghi chú" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="isauto_text" label="Loại" width="100" align="center" sortable />
        <el-table-column prop="oddtime" label="Thời gian" width="160" align="center" sortable />
        <el-table-column prop="state" label="Trạng thái" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.state === 0" type="warning">Chờ xử lý</el-tag>
            <el-tag v-else-if="row.state === 1" type="info">Đang xác nhận</el-tag>
            <el-tag v-else-if="row.state === 2" type="success">Thành công</el-tag>
            <el-tag v-else-if="row.state === 3" type="danger">Thất bại</el-tag>
            <el-tag v-else-if="row.state === 4" type="danger">Đã hủy</el-tag>
            <el-tag v-else-if="row.state === 5" type="warning">Quá thời gian</el-tag>
            <span v-else>{{ row.state }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.state === 0 || row.state === 1" size="small" type="primary" @click="handleApprove(row)">Duyệt</el-button>
            <el-button v-if="row.state === 0 || row.state === 1" size="small" type="danger" @click="handleReject(row)">Từ chối</el-button>
            <el-button v-if="row.state !== 2" size="small" type="danger" @click="handleDelete(row)">Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>

      
      <div class="mt-4 p-4 bg-box border-full-d rounded text-sm flex flex-wrap gap-6" v-if="statistics">
        <div class="text-g-700">Thành công：<strong class="text-warning">{{ Number(statistics.page_success_amount || 0).toFixed(0) }}</strong> đồng</div>
        <div class="text-g-700">Tổng nạp tiền: <strong class="text-warning">{{ Number(statistics.total_amount || 0).toFixed(0) }}</strong> ({{ statistics.total_count }} lượt)</div>
        <div class="text-g-700">Nạp tự động: <strong class="text-warning">{{ Number(statistics.auto_amount || 0).toFixed(0) }}</strong> ({{ statistics.auto_count }} lượt)</div>
        <div class="text-g-700">Nạp thủ công: <strong class="text-warning">{{ Number(statistics.manual_amount || 0).toFixed(0) }}</strong> ({{ statistics.manual_count }} lượt)</div>
        <div class="text-g-700">Tổng số dữ liệu: <strong class="text-warning">{{ pagination.total }}</strong> bản ghi</div>
      </div>

      
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchRechargeList, approveRecharge, rejectRecharge, deleteRecharge, type Recharge, type RechargeSearchParams, type RechargeStatistics } from '@/api/finance'
import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'

const loading = ref(false)
const tableData = ref<Recharge[]>([])
const statistics = ref<RechargeStatistics>()
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const searchParams = reactive<RechargeSearchParams>({
  state: '',
  sDate: '',
  eDate: '',
  sAmout: '',
  eAmout: '',
  username: '',
  trano: ''
})

const dateRange = ref<[string, string] | null>(null)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await fetchRechargeList({
      page: pagination.page,
      limit: pagination.limit,
      ...searchParams
    })
    tableData.value = res.list
    pagination.total = res.total
    statistics.value = res.statistics
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
  searchParams.state = ''
  searchParams.sDate = ''
  searchParams.eDate = ''
  searchParams.sAmout = ''
  searchParams.eAmout = ''
  searchParams.username = ''
  searchParams.trano = ''
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

const handleApprove = (row: Recharge) => {
  ElMessageBox.confirm('Xác nhận duyệt đơn nạp tiền này không?', 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await approveRecharge(row.id)
    ElMessage.success('Duyệt thành công')
    fetchData()
  })
}

const handleReject = (row: Recharge) => {
  ElMessageBox.prompt('Vui lòng nhập lý do từ chối (tùy chọn)', 'Từ chối đơn nạp tiền', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    inputPlaceholder: 'Lý do từ chối',
    type: 'warning'
  }).then(async ({ value }) => {
    await rejectRecharge(row.id, value || '')
    ElMessage.success('Đã từ chối')
    fetchData()
  })
}

const handleDelete = (row: Recharge) => {
  ElMessageBox.confirm('Xác nhận xóa bản ghi nạp tiền này không?', 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await deleteRecharge(row.id)
    ElMessage.success('Xóa thành công')
    fetchData()
  })
}

const getSummaries = () => []

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
