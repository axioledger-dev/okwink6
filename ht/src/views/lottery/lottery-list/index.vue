<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  fetchGetLotteryList,
  fetchSetLotteryStatus,
  fetchDeleteLottery
} from '@/api/lottery'
import EditLottery from './components/EditLottery.vue'


interface LotteryItem {
  id: number
  name: string
  title: string
  typeid: string
  typeid_name?: string
  ftitle: string
  expecttime: number
  ftime: number
  qishu: number
  issys: number
  issd: number
  closetime1: string
  closetime2: string
  isopen: number
  iswh: number
  sort: number
  lotterytype: number
  periods?: number
}

const loading = ref(false)
const tableData = ref<LotteryItem[]>([])
const total = ref(0)

const queryParams = reactive({
  current: 1,
  size: 20,
  typeid: '',
  status: '',
  lotterytype: '',
  keyword: ''
})


const stats = reactive({
  total: 0,
  active: 0,
  maintenance: 0,
  disabled: 0
})


const editVisible = ref(false)
const currentLotteryId = ref(0)


const lotteryTypes = [
  { label: 'Xổ số thời gian', value: 'ssc' },
  { label: 'K3', value: 'k3' },
  { label: '11chọn5', value: 'x5' },
  { label: 'Xổ số nhanh', value: 'keno' },
  { label: 'Lucky28', value: 'xy28' },
  { label: 'PK10', value: 'pk10' },
  { label: 'Xổ số động vật', value: 'dwc' },
  { label: 'Xổ số tần suất thấp', value: 'dpc' },
  { label: 'Lục hợp', value: 'lhc' }
]

const statusOptions = [
  { label: 'Bật', value: '1' },
  { label: 'Tắt', value: '0' }
]

const typeOptions = [
  { label: 'Xổ số hệ thống', value: '1' },
  { label: 'Bên thứ ba', value: '2' }
]

onMounted(() => {
  fetchData()
})

async function fetchData() {
  loading.value = true
  console.log('[LotteryList] Bắt đầu yêu cầu, tham số:', JSON.stringify(queryParams))
  try {
    const res = await fetchGetLotteryList(queryParams)
    console.log('[LotteryList] Yêu cầu thành công, phản hồi:', res)
    tableData.value = (res.list || []) as unknown as LotteryItem[]
    total.value = res.total || 0


    if (res.stats) {
      stats.total = res.stats.total || 0
      stats.active = res.stats.active || 0
      stats.maintenance = res.stats.maintenance || 0
      stats.disabled = res.stats.disabled || 0
    } else {
      stats.total = res.total || 0
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('Tải thất bại')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryParams.current = 1
  fetchData()
}

function handleReset() {
  queryParams.typeid = ''
  queryParams.status = ''
  queryParams.lotterytype = ''
  queryParams.keyword = ''
  handleSearch()
}

function handleEdit(row: LotteryItem) {
  currentLotteryId.value = row.id
  editVisible.value = true
}

function handleAdd() {
  currentLotteryId.value = 0
  editVisible.value = true
}

async function handleStatusChange(row: LotteryItem, field: string, value: any) {
  try {
    await fetchSetLotteryStatus({ id: row.id, field, value })
    ElMessage.success('Thao tác thành công')

    if (field === 'isopen') row.isopen = value
    if (field === 'iswh') row.iswh = value
  } catch (error) {

    ;(row as any)[field] = value === 1 ? 0 : 1
    console.error(error)
  }
}

function handleDelete(row: LotteryItem) {
  ElMessageBox.confirm(`Xác nhận xóa loại xổ số【${row.title}】?`, 'Thông báo', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    type: 'warning'
  }).then(async () => {
    try {
      await fetchDeleteLottery(row.id)
      ElMessage.success('Xóa thành công')
      fetchData()
    } catch (error) {
      console.error(error)
    }
  })
}

function handleSizeChange(val: number) {
  queryParams.size = val
  fetchData()
}

function handleCurrentChange(val: number) {
  queryParams.current = val
  fetchData()
}

function onEditSuccess() {
  fetchData()
}

function formatType(typeid: string) {
  const find = lotteryTypes.find(item => item.value === typeid)
  return find ? find.label : typeid
}
</script>

<template>
  <div class="app-container">
    
    <el-row :gutter="20" class="mb-4">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Tất cả loại xổ số</span>
              <el-tag type="info">Total</el-tag>
            </div>
          </template>
          <div class="card-value">{{ stats.total }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Đã bật</span>
              <el-tag type="success">Active</el-tag>
            </div>
          </template>
          <div class="card-value">{{ stats.active }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Đang bảo trì</span>
              <el-tag type="warning">Maintenance</el-tag>
            </div>
          </template>
          <div class="card-value">{{ stats.maintenance }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Đã dừng</span>
              <el-tag type="danger">Disabled</el-tag>
            </div>
          </template>
          <div class="card-value">{{ stats.disabled }}</div>
        </el-card>
      </el-col>
    </el-row>

    
    <el-card class="mb-4">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="Phân loại xổ số">
          <el-select v-model="queryParams.typeid" placeholder="Tất cả phân loại" clearable style="width: 140px">
            <el-option
              v-for="item in lotteryTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Loại xổ số">
          <el-select v-model="queryParams.lotterytype" placeholder="Tất cả loại" clearable style="width: 120px">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Trạng thái">
          <el-select v-model="queryParams.status" placeholder="Tất cả trạng thái" clearable style="width: 120px">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryParams.keyword" placeholder="Tên loại xổ số/Mã định danh" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <span class="i-ri:search-line mr-1"></span> Truy vấn
          </el-button>
          <el-button @click="handleReset">
            <span class="i-ri:refresh-line mr-1"></span> Đặt lại
          </el-button>
          <el-button type="success" @click="handleAdd">
            <span class="i-ri:add-line mr-1"></span> Thêm loại xổ số
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    
    <el-card>
      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="sort" label="Sắp xếp" width="80" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="typeid" label="Phân loại" width="100" align="center">
          <template #default="{ row }">
            <el-tag>{{ formatType(row.typeid) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Tên loại xổ số" min-width="120" align="center" />
        <el-table-column prop="name" label="Mã định danh" width="120" align="center" />
        <el-table-column prop="ftime" label="Khoảng cách dừng cược" width="100" align="center">
          <template #default="{ row }">
            {{ row.ftime }}giây
          </template>
        </el-table-column>
        <el-table-column prop="ftitle" label="Giới thiệu" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="lotterytype" label="Loại" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.lotterytype == 1 ? 'primary' : 'warning'">
              {{ row.lotterytype == 1 ? 'Xổ số hệ thống' : 'Bên thứ ba' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="qishu" label="Số kỳ" width="80" align="center" />
        <el-table-column prop="iswh" label="Bảo trì" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.iswh"
              :active-value="1"
              :inactive-value="0"
              inline-prompt
              active-text="Bảo trì"
              inactive-text="Bình thường"
              @change="(val) => handleStatusChange(row, 'iswh', val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="isopen" label="Trạng thái" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.isopen"
              :active-value="1"
              :inactive-value="0"
              inline-prompt
              active-text="Bật"
              inactive-text="Tắt"
              @change="(val) => handleStatusChange(row, 'isopen', val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="250" fixed="right" align="center">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" size="small" @click="handleEdit(row)">
                Chỉnh sửa
              </el-button>
              <el-button type="info" size="small" @click="$router.push(`/lottery/play-list?typeid=${row.typeid}`)">
                Cách chơi
              </el-button>
              <el-button type="warning" size="small" @click="$router.push(`/lottery/result-list?name=${row.name}`)">
                Mở thưởng
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)">
                Xóa
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="queryParams.current"
          v-model:page-size="queryParams.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    
    <EditLottery
      v-model="editVisible"
      :lottery-id="currentLotteryId"
      @success="onEditSuccess"
    />
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
</style>
