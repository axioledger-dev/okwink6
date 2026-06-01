<template>
  <div class="p-4">
    <div class="mb-4 bg-box p-4 rounded-lg shadow-sm">
      
      <div class="flex flex-wrap gap-6 mb-4 text-sm" v-if="statistics">
        <div class="bg-hover-color px-4 py-2 rounded-md border-full-d">
          <span class="text-g-500">Tổng rút tiền：</span>
          <span class="text-warning font-bold text-lg">{{ statistics.total_amount || '0.00' }}</span>
          <span class="text-g-500 ml-1">đồng</span>
          <span class="text-g-400 mx-2">|</span>
          <span class="font-bold">{{ statistics.total_count || 0 }}</span>
          <span class="text-g-500 ml-1">lượt</span>
        </div>
        <div class="bg-hover-color px-4 py-2 rounded-md border-full-d">
          <span class="text-g-500">Thành công：</span>
          <span class="text-success font-bold text-lg">{{ statistics.success_amount || '0.00' }}</span>
          <span class="text-g-500 ml-1">đồng</span>
        </div>
      </div>

      
      <el-form :inline="true" :model="searchForm" class="flex flex-wrap items-center">
        <el-form-item label="Trạng thái">
          <el-select v-model="searchForm.state" placeholder="Tất cả" clearable style="width: 120px">
            <el-option label="Tất cả" value="" />
            <el-option label="Chưa duyệt" :value="0" />
            <el-option label="Đã hoàn tất" :value="1" />
            <el-option label="Hoàn trả" :value="2" />
            <el-option label="Hủy" :value="3" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Thời gian">
          <div class="flex items-center">
            <el-date-picker
              v-model="searchForm.sDate"
              type="date"
              placeholder="Thời gian bắt đầu"
              value-format="YYYYMMDD"
              style="width: 140px"
            />
            <span class="mx-2">-</span>
            <el-date-picker
              v-model="searchForm.eDate"
              type="date"
              placeholder="Thời gian kết thúc"
              value-format="YYYYMMDD"
              style="width: 140px"
            />
          </div>
        </el-form-item>

        <el-form-item label="Số tiền">
          <div class="flex items-center">
            <el-input v-model="searchForm.sAmout" placeholder="Số tiền tối thiểu" style="width: 100px" />
            <span class="mx-2">-</span>
            <el-input v-model="searchForm.eAmout" placeholder="Số tiền tối đa" style="width: 100px" />
          </div>
        </el-form-item>

        <el-form-item label="Tên người dùng">
          <el-input v-model="searchForm.username" placeholder="Nhập tên người dùng" clearable style="width: 150px" />
        </el-form-item>

        <el-form-item label="Mã đơn">
          <el-input v-model="searchForm.trano" placeholder="Nhập mã đơn" clearable style="width: 180px" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <template #icon><ArtSvgIcon icon="ri:search-line" /></template>
            Tìm kiếm
          </el-button>
          <el-button @click="resetSearch">
            <template #icon><ArtSvgIcon icon="ri:refresh-line" /></template>
            Đặt lại
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    
    <div class="bg-box p-4 rounded-lg shadow-sm">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
        size="small"
      >
        <el-table-column prop="trano" label="Mã đơn nền tảng" min-width="180" sortable show-overflow-tooltip />
        <el-table-column prop="username" label="Tên người dùng" min-width="120" sortable />
        <el-table-column prop="accountname" label="Họ tên" min-width="100" sortable />
        <el-table-column prop="paytype" label="Phương thức thanh toán" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.paytype === 'bank'" type="primary" size="small">Thẻ ngân hàng</el-tag>
            <el-tag v-else-if="row.paytype === 'usdt'" type="warning" size="small">USDT</el-tag>
            <el-tag v-else-if="row.paytype === 'alipay'" size="small" class="!bg-cyan-500 !text-white !border-cyan-500">Alipay</el-tag>
            <el-tag v-else-if="row.paytype === 'wechat'" type="success" size="small">WeChat</el-tag>
            <span v-else>{{ row.paytypename || row.paytype || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bankname" label="Ngân hàng/Kênh" min-width="120" sortable show-overflow-tooltip />
        <el-table-column prop="banknumber" label="Tài khoản/Địa chỉ" min-width="180" sortable show-overflow-tooltip />
        <el-table-column label="Mã nhận tiền" width="80" align="center">
          <template #default="{ row }">
            <el-image 
              v-if="row.qr_code" 
              :src="row.qr_code" 
              :preview-src-list="[row.qr_code]"
              fit="cover"
              style="width: 40px; height: 40px; cursor: pointer;"
              preview-teleported
            />
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="amount" label="Số tiền" min-width="100" sortable align="right">
          <template #default="{ row }">
            <span class="font-bold">{{ row.amount }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="actualamount" label="Số tiền thực nhận" min-width="100" sortable align="right">
          <template #default="{ row }">
            <span class="text-green-600 font-bold">{{ row.actualamount }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="fee" label="Phí giao dịch" min-width="80" sortable align="right" />
        
        <el-table-column label="Thay đổi số dư" min-width="140" align="center">
          <template #default="{ row }">
            <div class="text-xs">
              <div>Trước: {{ row.oldaccountmoney }}</div>
              <div>Sau: {{ row.newaccountmoney }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="oddtime" label="Thời gian" min-width="160" sortable />
        
        <el-table-column prop="state" label="Trạng thái" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.state === 0" type="warning">Chưa duyệt</el-tag>
            <el-tag v-else-if="row.state === 1" type="success">Đã hoàn tất</el-tag>
            <el-tag v-else-if="row.state === 2" type="danger">Hoàn trả</el-tag>
            <el-tag v-else-if="row.state === 3" type="info">Hủy</el-tag>
            <span v-else>{{ row.state }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="Thao tác" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <div v-if="row.state === 0">
              <el-button 
                size="small" 
                type="primary" 
                plain
                @click="handleApprove(row)"
              >Duyệt</el-button>
              <el-button 
                size="small" 
                type="danger" 
                plain
                @click="handleReject(row)"
              >Hoàn trả</el-button>
            </div>
            <span v-else class="text-g-400 text-xs">Đã xử lý</span>
          </template>
        </el-table-column>
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
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  fetchWithdrawList,
  approveWithdraw,
  rejectWithdraw,
  type Withdraw,
  type WithdrawStatistics
} from '@/api/finance-withdraw'
import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'

const loading = ref(false)
const tableData = ref<Withdraw[]>([])
const statistics = ref<WithdrawStatistics>()

const searchForm = reactive({
  state: '' as string | number,
  sDate: '',
  eDate: '',
  sAmout: '',
  eAmout: '',
  username: '',
  trano: ''
})

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchWithdrawList({
      ...searchForm,
      page: pagination.page,
      limit: pagination.limit
    })
    tableData.value = res.list
    pagination.total = res.total
    statistics.value = res.statistics
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const resetSearch = () => {
  searchForm.state = ''
  searchForm.sDate = ''
  searchForm.eDate = ''
  searchForm.sAmout = ''
  searchForm.eAmout = ''
  searchForm.username = ''
  searchForm.trano = ''
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

const handleApprove = (row: Withdraw) => {
  ElMessageBox.confirm(
    'Xác nhận duyệt yêu cầu rút tiền này?',
    'Thông báo',
    {
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await approveWithdraw(row.id)

      loadData()
    } catch (error) {

    }
  })
}

const handleReject = (row: Withdraw) => {
  ElMessageBox.confirm(
    'Xác nhận hoàn trả yêu cầu rút tiền này? Số tiền sẽ được hoàn lại cho người dùng',
    'Thông báo',
    {
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await rejectWithdraw(row.id)

      loadData()
    } catch (error) {

    }
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
:deep(.el-form-item) {
  margin-bottom: 12px;
  margin-right: 12px;
}
</style>
