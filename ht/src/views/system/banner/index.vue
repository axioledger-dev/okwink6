<template>
  <div class="p-4">
    <div class="mb-4 bg-box p-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <el-button type="primary" @click="handleAdd">
            <template #icon><ArtSvgIcon icon="ri:add-line" /></template>
            Thêm banner
          </el-button>
          <el-button type="danger" @click="handleBatchDelete" :disabled="!selection.length">
            <ArtSvgIcon icon="ri:delete-bin-line" class="mr-1" />Xóa hàng loạt
          </el-button>
        </div>
        <el-button @click="loadData">
          <template #icon><ArtSvgIcon icon="ri:refresh-line" /></template>
            Làm mới
        </el-button>
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
        <el-table-column label="Ảnh" width="180" align="center">
          <template #default="{ row }">
            <el-image 
              v-if="row.url" 
              :src="row.url" 
              class="h-16 w-auto rounded object-contain bg-g-50" 
              :preview-src-list="[row.url]"
              preview-teleported
              fit="contain"
            />
            <span v-else class="text-g-400">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Tiêu đề/Ghi chú" min-width="150" align="center" />
        <el-table-column prop="type" label="Loại" width="120" align="center" sortable>
          <template #default="{ row }">
            <el-tag :type="row.type === 0 ? 'info' : row.type === 1 ? 'warning' : 'success'">
              {{ row.type === 0 ? 'Tất cả' : row.type === 1 ? 'PC' : 'APP' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="link" label="Liên kết chuyển đến" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column label="Trạng thái" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="(val) => handleStatusChange(row, val as number)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="listorder" label="Sắp xếp" width="100" align="center" sortable>
          <template #default="{ row }">
            <el-input-number 
              v-model="row.listorder" 
              :min="0" 
              size="small" 
              controls-position="right"
              class="!w-20"
              @change="() => handleSortChange(row)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="Thao tác" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="primary" 
              plain
              @click="handleEdit(row)"
            >Sửa</el-button>
            <el-button 
              size="small" 
              type="danger" 
              plain
              @click="handleDelete(row)"
            >Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? 'Thêm banner' : 'Sửa đổi banner'"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="Tiêu đề/Ghi chú" prop="title">
          <el-input v-model="form.title" placeholder="Vui lòng nhập tiêu đề hoặc ghi chú" />
        </el-form-item>
        <el-form-item label="Loại" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="0">Tất cả</el-radio>
            <el-radio :label="1">PC</el-radio>
            <el-radio :label="2">APP</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Hình ảnh banner" prop="url">
          <div class="w-full">
            
            <div class="flex gap-2 mb-2">
              <el-input v-model="form.url" placeholder="Vui lòng nhập URL hình ảnh hoặc nhấn tải lên" class="flex-1" />
              <el-button type="primary" @click="triggerUpload">
                <ArtSvgIcon icon="ri:upload-line" class="mr-1" />Tải lên
              </el-button>
            </div>
            
            <div v-if="form.url" class="h-32 w-full bg-g-50 rounded flex items-center justify-center border border-g-300 overflow-hidden">
              <img :src="form.url" class="h-full object-contain" />
            </div>
            <input type="file" ref="fileInputRef" style="display: none" accept="image/*" @change="handleFileChange" />
          </div>
        </el-form-item>
        <el-form-item label="Liên kết chuyển đến" prop="link">
          <el-input v-model="form.link" placeholder="Vui lòng nhập liên kết chuyển đến (tùy chọn)" />
        </el-form-item>
        <el-form-item label="Sắp xếp" prop="listorder">
          <el-input-number v-model="form.listorder" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            Xác nhận
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import {
  fetchBannerList,
  createBanner,
  updateBanner,
  deleteBanner,
  deleteAllBanner,
  updateBannerOrder,
  updateBannerStatus,
  type Banner
} from '@/api/system-banner'
import { uploadImage } from '@/api/common'

const loading = ref(false)
const tableData = ref<Banner[]>([])
const selection = ref<Banner[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})


const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  id: 0,
  title: '',
  type: 0,
  url: '',
  link: '',
  listorder: 0
})

const rules = {
  title: [{ required: true, message: 'Vui lòng nhập tiêu đề', trigger: 'blur' }],
  url: [{ required: true, message: 'Vui lòng tải lên hình ảnh', trigger: 'change' }]
}


const fileInputRef = ref<HTMLInputElement>()
const triggerUpload = () => {
  fileInputRef.value?.click()
}

const handleFileChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  try {
    ElMessage.info('Đang tải lên...')
    const res = await uploadImage(files[0])
    form.url = res.url
    ElMessage.success('Tải lên thành công')
  } catch (error) {
    console.error('Tải lên thất bại:', error)
    ElMessage.error('Tải lên thất bại')
  } finally {
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchBannerList({
      page: pagination.page,
      limit: pagination.limit
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const handleSelectionChange = (val: Banner[]) => {
  selection.value = val
}

const handleSizeChange = (val: number) => {
  pagination.limit = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadData()
}

const handleSortChange = async (row: Banner) => {
  try {
    await updateBannerOrder([{ id: row.id, listorder: row.listorder || 0 }])
    ElMessage.success('Cập nhật sắp xếp thành công')
  } catch (error) {
    loadData()
  }
}

const handleStatusChange = async (row: Banner, val: number) => {
  try {
    await updateBannerStatus(row.id, val)
    ElMessage.success('Cập nhật trạng thái thành công')
  } catch (error) {
    row.status = val === 1 ? 0 : 1
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.id = 0
  form.title = ''
  form.type = 0
  form.url = ''
  form.link = ''
  form.listorder = 0
  dialogVisible.value = true
}

const handleEdit = (row: Banner) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.title = row.title
  form.type = row.type ?? 0
  form.url = row.url ?? ''
  form.link = row.link || ''
  form.listorder = row.listorder || 0
  dialogVisible.value = true
}

const handleDelete = (row: Banner) => {
  ElMessageBox.confirm('Xác nhận xóa banner này?', 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await deleteBanner(row.id)
    loadData()
  })
}

const handleBatchDelete = () => {
  if (!selection.value.length) return
  ElMessageBox.confirm(`Xác nhận xóa ${selection.value.length} mục đã chọn?`, 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await deleteAllBanner(selection.value.map(item => item.id))
    loadData()
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (dialogType.value === 'add') {
          await createBanner(form)
        } else {
          await updateBanner(form)
        }
        dialogVisible.value = false
        loadData()
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  loadData()
})
</script>
