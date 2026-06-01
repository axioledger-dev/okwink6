<template>
  <div class="p-4">
    <div class="mb-4 bg-box p-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center">
        <el-form :inline="true" :model="searchForm" class="flex-1">
          <el-form-item label="Tên người dùng">
            <el-input v-model="searchForm.username" placeholder="Tên người dùng" clearable />
          </el-form-item>
          <el-form-item label="Tiêu đề">
            <el-input v-model="searchForm.title" placeholder="Tiêu đề thao tác" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <template #icon><ArtSvgIcon icon="ri:search-line" /></template>
            Tìm kiếm
            </el-button>
            <el-button @click="resetSearch">Đặt lại</el-button>
          </el-form-item>
        </el-form>
        
        <div class="flex gap-2">
          <el-button type="danger" :disabled="!selection.length" @click="handleBatchDelete">
            <ArtSvgIcon icon="ri:delete-bin-line" class="mr-1" />Xóa
          </el-button>
          <el-button type="danger" plain @click="handleClear">
            <i class="ri-delete-bin-2-line mr-1"></i>Xóa tất cả
          </el-button>
        </div>
      </div>
    </div>

    <div class="bg-box p-4 rounded-lg shadow-sm">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />
        <el-table-column prop="username" label="Tên người dùng" width="120" align="center" />
        <el-table-column prop="type" label="Loại thao tác" width="150" align="center" />
        <el-table-column prop="info" label="Nội dung/Chi tiết" min-width="200" show-overflow-tooltip />
        <el-table-column prop="ip" label="Địa chỉ IP" width="140" align="center" />
        <el-table-column prop="iparea" label="Vị trí IP" width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="created_at" label="Thời gian thao tác" width="180" align="center" sortable />
        <el-table-column label="Chi tiết yêu cầu" min-width="250">
          <template #default="{ row }">
            <div class="text-xs">
              <div class="font-bold text-g-700 mb-1">
                <el-tag size="small" effect="plain" class="mr-1">{{ row.method || 'GET' }}</el-tag>
                {{ row.path || row.url }}
              </div>
              <div class="text-g-500 truncate" :title="row.params">
                {{ row.params }}
              </div>
            </div>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  fetchLogList,
  deleteLog,
  clearLog,
  type AdminLog
} from '@/api/system-admin'

const loading = ref(false)
const tableData = ref<AdminLog[]>([])
const selection = ref<AdminLog[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const searchForm = reactive({
  username: '',
  title: ''
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchLogList({
      page: pagination.page,
      limit: pagination.limit,
      username: searchForm.username,
      title: searchForm.title
    })
    console.log('Admin Log List Response:', res)
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const resetSearch = () => {
  searchForm.username = ''
  searchForm.title = ''
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

const handleSelectionChange = (val: AdminLog[]) => {
  selection.value = val
}

const handleBatchDelete = () => {
  if (!selection.value.length) return
  ElMessageBox.confirm(`Xác nhận xóa ${selection.value.length} mục nhật ký đã chọn?`, 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await deleteLog(selection.value.map(item => item.id))
    loadData()
  })
}

const handleClear = () => {
  ElMessageBox.confirm('Xác nhận xóa tất cả nhật ký thao tác? Thao tác này không thể khôi phục!', 'Cảnh báo', {
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  }).then(async () => {
    await clearLog()
    loadData()
  })
}

onMounted(() => {
  loadData()
})
</script>
