<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/http'

interface Game {
  id: number
  game_id: string
  name: string
  platform: string
  type: string
  icon?: string
  cover?: string
  hot: number
  new: number
  status: string
  sort: number
}

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const platform = computed(() => route.params.platform as string)
const platformName = ref('')

const tableData = ref<Game[]>([])
const total = ref(0)
const queryParams = reactive({
  page: 1,
  limit: 10,
  platform: '',
  keyword: ''
})

const dialogVisible = ref(false)
const dialogTitle = ref('Thêm trò chơi')
const formData = reactive({
  id: 0,
  game_id: '',
  name: '',
  platform: '',
  type: '',
  icon: '',
  cover: '',
  hot: 0,
  new: 0,
  status: 'online',
  sort: 0
})

onMounted(() => {
  queryParams.platform = platform.value
  platformName.value = 'Quản lý trò chơi ' + platform.value
  fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    const res = await request.get<any>({
      url: '/app/admin/api/game/game-list',
      params: queryParams,
      returnFullResponse: true
    })
    tableData.value = res.data?.list || res.list || []
    total.value = res.count || res.data?.total || 0
  } catch (e) {
    console.error('Tải danh sách trò chơi thất bại:', e)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryParams.page = 1
  fetchData()
}

function handleAdd() {
  dialogTitle.value = 'Thêm trò chơi'
  Object.assign(formData, {
    id: 0,
    game_id: '',
    name: '',
    platform: platform.value,
    type: '',
    icon: '',
    cover: '',
    hot: 0,
    new: 0,
    status: 'online',
    sort: 0
  })
  dialogVisible.value = true
}

function handleEdit(row: Game) {
  dialogTitle.value = 'Chỉnh sửa trò chơi'
  Object.assign(formData, row)
  dialogVisible.value = true
}

async function handleSave() {
  if (!formData.game_id || !formData.name) {
    return ElMessage.warning('Vui lòng điền ID và tên trò chơi')
  }
  try {
    await request.post({
      url: '/app/admin/api/game/game-save',
      data: formData
    })
    ElMessage.success('Lưu thành công')
    dialogVisible.value = false
    fetchData()
  } catch (e) {
    console.error(e)
  }
}

async function handleStatusChange(row: Game, status: string) {
  try {
    await request.post({
      url: '/app/admin/api/game/game-status',
      data: { id: row.id, status }
    })
    ElMessage.success('Thao tác thành công')
    row.status = status
  } catch (e) {
    row.status = status === 'online' ? 'offline' : 'online'
  }
}

async function handleHotChange(row: Game, hot: number) {
  try {
    await request.post({
      url: '/app/admin/api/game/game-hot',
      data: { id: row.id, hot }
    })
    row.hot = hot
  } catch (e) {
    row.hot = hot === 1 ? 0 : 1
  }
}

function handleDelete(row: Game) {
  ElMessageBox.confirm(`Xác nhận xóa trò chơi【${row.name}】？`, 'Thông báo', { type: 'warning' }).then(async () => {
    await request.post({ url: '/app/admin/api/game/game-delete', data: { id: row.id } })
    ElMessage.success('Xóa thành công')
    fetchData()
  })
}

function handleSizeChange(val: number) {
  queryParams.limit = val
  fetchData()
}

function handleCurrentChange(val: number) {
  queryParams.page = val
  fetchData()
}

function goBack() {
  router.push('/lottery/game-list')
}
</script>

<template>
  <div class="app-container">
    
    <el-card class="mb-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <el-button @click="goBack">
            <span class="i-ri:arrow-left-line mr-1"></span> Quay lại
          </el-button>
          <span class="text-lg font-bold">{{ platformName }}</span>
        </div>
        <el-button type="primary" @click="handleAdd">
          <span class="i-ri:add-line mr-1"></span> Thêm hàng loạt
        </el-button>
      </div>
    </el-card>

    
    <el-card class="mb-4">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="Tên trò chơi">
          <el-input v-model="queryParams.keyword" placeholder="Mã/tên trò chơi" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">Truy vấn</el-button>
          <el-button @click="queryParams.keyword = ''; handleSearch()">Đặt lại</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    
    <el-card>
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="game_id" label="Mã trò chơi" width="150" align="center" />
        <el-table-column prop="name" label="Tên trò chơi" min-width="150" align="center" />
        <el-table-column label="Sắp xếp" width="100" align="center">
          <template #default="{ row }">
            <el-input-number v-model="row.sort" :min="0" size="small" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="Có phải ưu tiên" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.hot ? 'success' : 'info'" size="small">{{ row.hot ? 'Ưu tiên' : 'Không' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Có phải đề xuất" width="100" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.hot === 1" @change="(val) => handleHotChange(row, val ? 1 : 0)" />
          </template>
        </el-table-column>
        <el-table-column label="Loại thiết bị hỗ trợ" width="120" align="center">
          <template #default>
            <el-tag size="small" type="success">Di động và máy tính</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">Cài đặt sảnh</el-button>
            <el-button type="warning" link @click="handleEdit(row)">Cài đặt trò chơi</el-button>
            <el-button type="danger" link @click="handleDelete(row)">Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-between items-center mt-4">
        <span class="text-gray-500">Tổng {{ total }} bản ghi</span>
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="Mã trò chơi" required>
          <el-input v-model="formData.game_id" placeholder="Mã định danh duy nhất của trò chơi" />
        </el-form-item>
        <el-form-item label="Tên trò chơi" required>
          <el-input v-model="formData.name" placeholder="Tên hiển thị trò chơi" />
        </el-form-item>
        <el-form-item label="Loại trò chơi">
          <el-input v-model="formData.type" placeholder="Ví dụ: slot, live" />
        </el-form-item>
        <el-form-item label="URL biểu tượng">
          <el-input v-model="formData.icon" placeholder="Địa chỉ biểu tượng trò chơi" />
        </el-form-item>
        <el-form-item label="URL ảnh bìa">
          <el-input v-model="formData.cover" placeholder="Địa chỉ ảnh bìa trò chơi" />
        </el-form-item>
        <el-form-item label="Sắp xếp">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>
        <el-form-item label="Trạng thái">
          <el-switch v-model="formData.status" active-value="online" inactive-value="offline" active-text="Trực tuyến" inactive-text="Ngoại tuyến" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="handleSave">Lưu</el-button>
      </template>
    </el-dialog>
  </div>
</template>
