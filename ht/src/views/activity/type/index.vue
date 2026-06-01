<template>
  <div class="p-4">
    <div class="mb-4 bg-box p-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center">
        <el-button type="primary" @click="handleAdd">
          <template #icon><ArtSvgIcon icon="ri:add-line" /></template>
            Thêm phân loại
        </el-button>
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
      >
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />
        <el-table-column prop="code" label="Nhãn mã" min-width="120" align="center" />
        <el-table-column prop="name" label="Tên" min-width="150" align="center" />
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
        <el-table-column prop="sort" label="Sắp xếp" width="80" align="center" />
        <el-table-column prop="created_at" label="Thời gian tạo" width="180" align="center" />
        
        <el-table-column label="Thao tác" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="primary" 
              plain
              @click="handleEdit(row)"
            >Chỉnh sửa</el-button>
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
      :title="dialogType === 'add' ? 'Thêm phân loại' : 'Chỉnh sửa phân loại'"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="Tên phân loại" prop="name">
          <el-input v-model="form.name" placeholder="Tên hiển thị, ví dụ: Hoạt động VIP" />
        </el-form-item>
        <el-form-item label="Mã phân loại" prop="code">
          <el-input v-model="form.code" placeholder="Mã tiếng Anh, ví dụ: vip" />
        </el-form-item>
        <el-form-item label="Sắp xếp" prop="sort">
          <el-input-number v-model="form.sort" :min="0" controls-position="right" class="w-full" />
        </el-form-item>
        <el-form-item label="Trạng thái" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">Bật</el-radio>
            <el-radio :label="0">Tắt</el-radio>
          </el-radio-group>
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
  fetchActivityTypeList,
  createActivityType,
  updateActivityType,
  deleteActivityType,
  updateActivityTypeStatus,
  type ActivityType
} from '@/api/activity-type'

const loading = ref(false)
const tableData = ref<ActivityType[]>([])
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
  name: '',
  code: '',
  sort: 0,
  status: 1
})

const rules = {
  name: [{ required: true, message: 'Vui lòng nhập tên phân loại', trigger: 'blur' }],
  code: [{ required: true, message: 'Vui lòng nhập mã phân loại', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchActivityTypeList({
      page: pagination.page,
      limit: pagination.limit
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val: number) => {
  pagination.limit = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadData()
}

const handleStatusChange = async (row: ActivityType, val: number) => {
  try {
    await updateActivityTypeStatus(row.id, val)
    ElMessage.success('Cập nhật trạng thái thành công')
  } catch (error) {
    row.status = val === 1 ? 0 : 1
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.id = 0
  form.name = ''
  form.code = ''
  form.sort = 0
  form.status = 1
  dialogVisible.value = true
}

const handleEdit = (row: ActivityType) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.name = row.name
  form.code = row.code
  form.sort = row.sort
  form.status = row.status
  dialogVisible.value = true
}

const handleDelete = (row: ActivityType) => {
  ElMessageBox.confirm(`Bạn có chắc muốn xóa phân loại "${row.name}" không?`, 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await deleteActivityType(row.id)
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
          await createActivityType(form)
        } else {
          await updateActivityType(form)
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
