<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  fetchGetGameCategoryList,
  fetchSaveGameCategory,
  fetchSetGameCategoryStatus,
  fetchUpdateGameCategorySort,
  fetchDeleteGameCategory
} from '@/api/lottery'

interface CategoryItem {
  id: number
  code: string
  name: string
  icon: string
  path: string
  sort: number
  status: number
}

const loading = ref(false)
const tableData = ref<CategoryItem[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('Thêm phân loại')
const formData = reactive({
  id: 0,
  code: '',
  name: '',
  icon: 'apps-o',
  path: '',
  sort: 0,
  status: 1
})

const iconOptions = [
  { label: 'Biểu tượng xu hướng', value: 'chart-trending-o' },
  { label: 'Biểu tượng máy tính', value: 'desktop-o' },
  { label: 'Biểu tượng ứng dụng', value: 'apps-o' },
  { label: 'Biểu tượng mời', value: 'invitation' },
  { label: 'Biểu tượng lửa', value: 'fire-o' },
  { label: 'Biểu tượng huy chương', value: 'medal-o' },
  { label: 'Biểu tượng liên kết', value: 'link-o' }
]

onMounted(() => fetchData())

async function fetchData() {
  loading.value = true
  try {
    const res = await fetchGetGameCategoryList()

    tableData.value = res?.list || []
  } catch (e) {
    console.error('Tải phân loại thất bại:', e)
    ElMessage.error('Tải thất bại')
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  dialogTitle.value = 'Thêm phân loại'
  Object.assign(formData, { id: 0, code: '', name: '', icon: 'apps-o', path: '', sort: 0, status: 1 })
  dialogVisible.value = true
}

function handleEdit(row: CategoryItem) {
  dialogTitle.value = 'Chỉnh sửa phân loại'
  Object.assign(formData, row)
  dialogVisible.value = true
}

async function handleSave() {
  if (!formData.code || !formData.name) return ElMessage.warning('Vui lòng điền mã phân loại và tên')
  try {
    await fetchSaveGameCategory({ ...formData, path: formData.path || `/lotteryMore?type=${formData.code}` })
    ElMessage.success('Lưu thành công')
    dialogVisible.value = false
    fetchData()
  } catch (e) { console.error(e) }
}

async function handleStatusChange(row: CategoryItem, status: number | string | boolean) {
  try {
    await fetchSetGameCategoryStatus({ id: row.id, status: Number(status) })
    ElMessage.success('Thao tác thành công')
  } catch (e) { row.status = status === 1 ? 0 : 1 }
}

async function handleSortChange(row: CategoryItem, sort: number | undefined) {
  try {
    await fetchUpdateGameCategorySort({ id: row.id, sort: sort ?? 0 })
  } catch (e) { console.error(e) }
}

function handleDelete(row: CategoryItem) {
  ElMessageBox.confirm(`Xác nhận xóa【${row.name}】？`, 'Thông báo', { type: 'warning' }).then(async () => {
    await fetchDeleteGameCategory(row.id)
    ElMessage.success('Xóa thành công')
    fetchData()
  })
}
</script>

<template>
  <div class="app-container">
    <el-card class="mb-4">
      <div class="flex justify-between items-center">
        <div class="text-lg font-bold">Quản lý phân loại trò chơi</div>
        <el-button type="primary" @click="handleAdd">
          <span class="i-ri:add-line mr-1"></span> Thêm phân loại
        </el-button>
      </div>
      <div class="text-sm text-gray-500 mt-2">Quản lý điều hướng phân loại trò chơi trang chủ, kiểm soát trạng thái hiển thị và sắp xếp</div>
    </el-card>

    <el-card>
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="sort" label="Loại trò chơi" width="120" align="center" />
        <el-table-column prop="name" label="Tên danh mục trò chơi" min-width="150" align="center" />
        <el-table-column label="Sắp xếp" width="120" align="center">
          <template #default="{ row }">
            <el-input-number v-model="row.sort" :min="0" :max="100" size="small" controls-position="right" @change="(val) => handleSortChange(row, val)" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Trạng thái bật/tắt" width="120" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="(val) => handleStatusChange(row, val)" />
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="120" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">Sửa</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="Mã phân loại" required>
          <el-input v-model="formData.code" placeholder="Ví dụ: slot, live, chess" :disabled="formData.id > 0" />
        </el-form-item>
        <el-form-item label="Tên phân loại" required>
          <el-input v-model="formData.name" placeholder="Ví dụ: Điện tử, Trực tiếp" />
        </el-form-item>
        <el-form-item label="Biểu tượng">
          <el-select v-model="formData.icon" placeholder="Chọn biểu tượng">
            <el-option v-for="item in iconOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Đường dẫn chuyển đến">
          <el-input v-model="formData.path" placeholder="Ví dụ: /slot, /lotteryMore?type=live" />
        </el-form-item>
        <el-form-item label="Sắp xếp">
          <el-input-number v-model="formData.sort" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="Trạng thái">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" active-text="Bật" inactive-text="Tắt" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="handleSave">Lưu</el-button>
      </template>
    </el-dialog>
  </div>
</template>
