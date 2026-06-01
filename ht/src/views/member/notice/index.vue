<template>
  <div class="app-container">
    <el-card shadow="never">
      
      <div class="mb-4">
        <el-button type="primary" @click="handleAdd">
          <template #icon><ArtSvgIcon icon="ri:add-line" /></template>
          Thêm thông báo
        </el-button>
      </div>

      
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />
        <el-table-column prop="title" label="Tiêu đề" min-width="200" show-overflow-tooltip />
        <el-table-column prop="content" label="Nội dung" min-width="300">
          <template #default="{ row }">
            <div class="content-preview" v-html="stripHtml(row.content)"></div>
          </template>
        </el-table-column>
        <el-table-column prop="users" label="ID người dùng" width="150" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag v-if="!row.users || row.users === '0'" type="success">Tất cả người dùng</el-tag>
            <span v-else>{{ row.users }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="add_time_text" label="Thời gian thêm" width="180" align="center" sortable />
        <el-table-column label="Thao tác" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="info" @click="handlePreview(row)">Xem trước</el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)">Chỉnh sửa</el-button>
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
      :title="dialogType === 'add' ? 'Thêm thông báo' : 'Chỉnh sửa thông báo'"
      width="800px"
      append-to-body
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="Tiêu đề" prop="title">
          <el-input v-model="form.title" placeholder="Vui lòng nhập tiêu đề thông báo" />
        </el-form-item>
        <el-form-item label="Nội dung" prop="content">
          <ArtWangEditor 
            v-model="form.content" 
            height="300px" 
            placeholder="Vui lòng nhập nội dung thông báo..."
            mode="simple"
          />
        </el-form-item>
        <el-form-item label="ID người dùng" prop="users">
          <el-input v-model="form.users" placeholder="Vui lòng nhập ID người dùng, nhiều ID cách nhau bằng dấu phẩy, để trống hoặc 0 cho tất cả người dùng" />
          <div class="text-gray-400 text-xs mt-1">Lưu ý: Để trống hoặc điền 0 để gửi cho tất cả người dùng</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">Xác nhận</el-button>
        </span>
      </template>
    </el-dialog>

    
    <el-dialog
      v-model="previewVisible"
      title="Xem trước thông báo"
      width="600px"
      append-to-body
    >
      <div class="preview-title">{{ previewData.title }}</div>
      <div class="preview-content" v-html="previewData.content"></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchNoticeList, saveNotice, deleteNotice, type Notice, type NoticeSearchParams } from '@/api/notice'
import ArtWangEditor from '@/components/core/forms/art-wang-editor/index.vue'
import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref<Notice[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = reactive<Partial<Notice>>({
  id: undefined,
  title: '',
  content: '',
  users: ''
})


const previewVisible = ref(false)
const previewData = reactive({
  title: '',
  content: ''
})

const rules = {
  title: [{ required: true, message: 'Vui lòng nhập tiêu đề', trigger: 'blur' }],
  content: [{ required: true, message: 'Vui lòng nhập nội dung', trigger: 'blur' }]
}


const stripHtml = (html: string) => {
  if (!html) return ''
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > 50 ? text.substring(0, 50) + '...' : text
}


const handlePreview = (row: Notice) => {
  previewData.title = row.title
  previewData.content = row.content
  previewVisible.value = true
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await fetchNoticeList({
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
    title: '',
    content: '',
    users: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: Notice) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = (row: Notice) => {
  ElMessageBox.confirm('Xác nhận xóa thông báo này?', 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await deleteNotice(row.id)
    ElMessage.success('Xóa thành công')
    fetchData()
  })
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        await saveNotice(form)
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

<style lang="scss" scoped>
.content-preview {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  font-size: 13px;
}

.preview-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.preview-content {
  line-height: 1.8;
  color: #606266;
  
  :deep(img) {
    max-width: 100%;
    height: auto;
  }
  
  :deep(p) {
    margin: 8px 0;
  }
}
</style>
