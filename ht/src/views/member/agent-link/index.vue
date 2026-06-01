<template>
  <div class="app-container">
    <el-card shadow="never">
      
      <el-form :model="searchParams" inline class="mb-4 search-form">
        <el-form-item label="Tên người dùng">
          <el-input v-model="searchParams.username" placeholder="Nhập tên người dùng" clearable @keyup.enter="handleSearch" style="width: 160px" />
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
          <el-button type="success" @click="handleAdd">
            <template #icon><ArtSvgIcon icon="ri:add-line" /></template>
            Thêm liên kết
          </el-button>
        </el-form-item>
      </el-form>

      
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />
        <el-table-column prop="username" label="Tên người dùng" width="150" align="center" />
        <el-table-column prop="type" label="Loại đăng ký" width="120" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.type === 1" type="warning">Đại lý</el-tag>
            <el-tag v-else type="info">Hội viên</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="total_count" label="Tổng số lần" width="120" align="center">
          <template #default="{ row }">
            <span v-if="row.total_count === -1">Không giới hạn</span>
            <span v-else>{{ row.total_count }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="used_count" label="Số lần sử dụng" width="120" align="center" />
        <el-table-column prop="template" label="Mẫu sử dụng" width="150" align="center" />
        <el-table-column prop="created_at" label="Thời gian tạo" width="180" align="center" />
        <el-table-column label="Thao tác" min-width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleCopy(row)">Sao chép liên kết</el-button>
            <el-button size="small" type="warning" @click="handleEdit(row)">Chỉnh sửa</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">Xóa</el-button>
          </template>
        </el-table-column>
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

    
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? 'Thêm liên kết' : 'Chỉnh sửa liên kết'"
      width="500px"
      append-to-body
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="Tên người dùng" prop="username">
          <el-input v-model="form.username" placeholder="Vui lòng nhập tên người dùng" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="Loại đăng ký" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">Đại lý</el-radio>
            <el-radio :label="0">Hội viên</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Số lần sử dụng" prop="total_count">
          <el-input-number v-model="form.total_count" :min="-1" placeholder="-1 là không giới hạn" />
          <span class="ml-2 text-gray-400 text-xs">(-1 nghĩa là không giới hạn số lần)</span>
        </el-form-item>
        <el-form-item label="Mẫu sử dụng" prop="template">
          <el-input v-model="form.template" placeholder="Vui lòng nhập tên mẫu" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">Xác nhận</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchAgentLinkList, saveAgentLink, deleteAgentLink, type AgentLink, type AgentLinkSearchParams } from '@/api/agent-link'

const toClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {

    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}
const loading = ref(false)
const submitting = ref(false)
const tableData = ref<AgentLink[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const searchParams = reactive<AgentLinkSearchParams>({
  username: ''
})

const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = reactive<Partial<AgentLink>>({
  id: undefined,
  username: '',
  type: 1,
  total_count: -1,
  template: ''
})

const rules = {
  username: [{ required: true, message: 'Vui lòng nhập tên người dùng', trigger: 'blur' }],
  type: [{ required: true, message: 'Vui lòng chọn loại đăng ký', trigger: 'change' }],
  total_count: [{ required: true, message: 'Vui lòng nhập số lần sử dụng', trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await fetchAgentLinkList({
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

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchParams.username = ''
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

const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(form, {
    id: undefined,
    username: '',
    type: 1,
    total_count: -1,
    template: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: AgentLink) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = (row: AgentLink) => {
  ElMessageBox.confirm('Xác nhận xóa liên kết này?', 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await deleteAgentLink(row.id)
    ElMessage.success('Xóa thành công')
    fetchData()
  })
}

const handleCopy = async (row: AgentLink) => {
  if (!row.url) {
    ElMessage.warning('Địa chỉ liên kết trống')
    return
  }
  try {
    await toClipboard(row.url)
    ElMessage.success('Sao chép thành công')
  } catch (e) {
    ElMessage.error('Sao chép thất bại')
  }
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        await saveAgentLink(form)
        ElMessage.success(dialogType.value === 'add' ? 'Thêm thành công' : 'Sửa thành công')
        dialogVisible.value = false
        fetchData()
      } finally {
        submitting.value = false
      }
    }
  })
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
