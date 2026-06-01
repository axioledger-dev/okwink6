<template>
  <div class="p-4">
    <div class="mb-4 bg-box p-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <el-button type="primary" @click="handleAdd">
            <template #icon><ArtSvgIcon icon="ri:add-line" /></template>
            Thêm ngân hàng rút tiền
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
      >
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />
        <el-table-column prop="bankcode" label="Mã ngân hàng" min-width="120" align="center" sortable />
        <el-table-column prop="bankname" label="Tên ngân hàng" min-width="150" align="center" sortable />
        <el-table-column label="Logo ngân hàng" min-width="120" align="center">
          <template #default="{ row }">
             <img v-if="row.banklogo" :src="row.banklogo" class="h-8 mx-auto object-contain" />
             <span v-else>-</span>
          </template>
        </el-table-column>
        
        <el-table-column label="Trạng thái" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.state"
              :active-value="1"
              :inactive-value="0"
              @change="(val) => handleStateChange(row, val as number)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="Thao tác" width="180" fixed="right" align="center">
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
      :title="dialogType === 'add' ? 'Thêm ngân hàng rút tiền' : 'Sửa ngân hàng rút tiền'"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="Tên ngân hàng" prop="bankname">
          <el-input v-model="form.bankname" placeholder="Vui lòng nhập tên ngân hàng" />
        </el-form-item>
        <el-form-item label="Mã ngân hàng" prop="bankcode">
          <el-input v-model="form.bankcode" placeholder="Vui lòng nhập mã ngân hàng" />
        </el-form-item>
        <el-form-item label="Logo ngân hàng" prop="banklogo">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeUpload"
            accept=".jpg,.jpeg,.png,.gif,.webp"
          >
            <img v-if="form.banklogo" :src="form.banklogo" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="el-upload__tip">Hỗ trợ jpg, png, gif, webp, dung lượng không quá 5MB</div>
        </el-form-item>
        <el-form-item label="Ảnh nền" prop="imgbg">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleBgSuccess"
            :before-upload="beforeUpload"
            accept=".jpg,.jpeg,.png,.gif,.webp"
          >
            <img v-if="form.imgbg" :src="form.imgbg" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="Trạng thái" prop="state">
          <el-radio-group v-model="form.state">
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
import { ElMessage, ElMessageBox, type FormInstance, type UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import {
  fetchSysBankList,
  createSysBank,
  updateSysBank,
  deleteSysBank,
  setSysBankState,
  type SysBank
} from '@/api/finance-bank'
import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'

const loading = ref(false)
const tableData = ref<SysBank[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})


const userStore = useUserStore()
const uploadUrl = `${import.meta.env.VITE_API_URL}/app/admin/api/common/upload`
const uploadHeaders = { Authorization: userStore.accessToken }


const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  id: 0,
  bankname: '',
  bankcode: '',
  banklogo: '',
  imgbg: '',
  state: 1
})

const rules = {
  bankname: [{ required: true, message: 'Vui lòng nhập tên ngân hàng', trigger: 'blur' }],
  bankcode: [{ required: true, message: 'Vui lòng nhập mã ngân hàng', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchSysBankList({
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

const handleStateChange = async (row: SysBank, val: number) => {
  try {
    await setSysBankState(row.id, val)
    ElMessage.success('Cập nhật trạng thái thành công')
  } catch (error) {
    row.state = val === 1 ? 0 : 1
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.id = 0
  form.bankname = ''
  form.bankcode = ''
  form.banklogo = ''
  form.imgbg = ''
  form.state = 1
  dialogVisible.value = true
}

const handleEdit = (row: SysBank) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.bankname = row.bankname
  form.bankcode = row.bankcode
  form.banklogo = row.banklogo || ''
  form.imgbg = row.imgbg || ''
  form.state = row.state
  dialogVisible.value = true
}

const handleDelete = (row: SysBank) => {
  ElMessageBox.confirm(`Xác nhận xóa ${row.bankname} không?`, 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await deleteSysBank(row.id)

    loadData()
  })
}


const handleLogoSuccess: UploadProps['onSuccess'] = (response) => {

  const url = response.url || (response.data && response.data.url)
  if (url) {
    form.banklogo = url
    ElMessage.success('Tải lên thành công')
  } else {
    ElMessage.error('Tải lên thất bại: Không lấy được địa chỉ ảnh')
    console.error('Upload response:', response)
  }
}

const handleBgSuccess: UploadProps['onSuccess'] = (response) => {
  const url = response.url || (response.data && response.data.url)
  if (url) {
    form.imgbg = url
    ElMessage.success('Tải lên thành công')
  } else {
    ElMessage.error('Tải lên thất bại')
  }
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!types.includes(file.type)) {
    ElMessage.error('Chỉ có thể tải lên định dạng JPG/PNG/GIF/WEBP!')
    return false
  }
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('Dung lượng ảnh không được vượt quá 5MB!')
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (dialogType.value === 'add') {
          await createSysBank(form)
        } else {
          await updateSysBank(form)
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

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 80px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  width: 120px;
  height: 80px;
  display: block;
  object-fit: contain;
}
</style>
