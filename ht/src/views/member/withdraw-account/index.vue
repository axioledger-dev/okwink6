<template>
  <div class="app-container">
    <el-card shadow="never">
      
      <el-form :model="searchParams" inline class="mb-4 search-form">
        <el-form-item label="Tên người dùng">
          <el-input v-model="searchParams.username" placeholder="Vui lòng nhập tên người dùng" clearable @keyup.enter="handleSearch" style="width: 160px" />
        </el-form-item>
        <el-form-item label="Loại tài khoản">
          <el-select v-model="searchParams.type" placeholder="Tất cả" clearable style="width: 160px">
            <el-option label="Tất cả" value="" />
            <el-option label="Thẻ ngân hàng" value="bank" />
            <el-option label="USDT" value="usdt" />
            <el-option label="Alipay" value="alipay" />
            <el-option label="WeChat" value="wechat" />
          </el-select>
        </el-form-item>
        <el-form-item label="Trạng thái">
          <el-select v-model="searchParams.status" placeholder="Tất cả" clearable style="width: 160px">
            <el-option label="Tất cả" value="" />
            <el-option label="Bật" value="1" />
            <el-option label="Tắt" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <ArtSvgIcon icon="ri:search-line" class="mr-1" />Truy vấn
          </el-button>
          <el-button @click="handleReset">
            <template #icon><ArtSvgIcon icon="ri:refresh-line" /></template>
            Đặt lại
          </el-button>
        </el-form-item>
      </el-form>

      
      <div class="mb-4">
        <el-button type="primary" @click="handleAdd">
          <template #icon><ArtSvgIcon icon="ri:add-line" /></template>
            Thêm
        </el-button>
        <el-button type="danger" @click="handleBatchDelete" :disabled="selectedIds.length === 0">
          <ArtSvgIcon icon="ri:delete-bin-line" class="mr-1" />Xóa
        </el-button>
      </div>

      
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="username" label="Tên người dùng" width="120" />
        <el-table-column prop="type" label="Loại tài khoản" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.type === 'bank'" type="primary">Thẻ ngân hàng</el-tag>
            <el-tag v-else-if="row.type === 'usdt'" type="warning">USDT</el-tag>
            <el-tag v-else-if="row.type === 'alipay'" type="info" class="!bg-cyan-500 !text-white !border-cyan-500">Alipay</el-tag>
            <el-tag v-else-if="row.type === 'wechat'" type="success">WeChat</el-tag>
            <span v-else>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thông tin tài khoản" min-width="250">
          <template #default="{ row }">
            <div v-if="row.type === 'bank'">
              <div class="font-medium">{{ row.bank_name }}</div>
              <div class="text-gray-500">{{ row.bank_account }}</div>
            </div>
            <div v-else-if="row.type === 'usdt'">
              <div class="font-medium">{{ row.usdt_network }}</div>
              <div class="text-gray-500 text-xs break-all">{{ row.usdt_address }}</div>
            </div>
            <div v-else>
              <div class="font-medium">{{ row.bank_account }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Mã nhận tiền" width="100" align="center">
          <template #default="{ row }">
            <el-image 
              v-if="row.qr_code" 
              :src="row.qr_code" 
              :preview-src-list="[row.qr_code]"
              fit="cover"
              style="width: 50px; height: 50px; cursor: pointer;"
              preview-teleported
            />
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="account_name" label="Chủ thẻ/Tên tài khoản" width="150" />
        <el-table-column prop="is_default" label="Mặc định" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.is_default === 1" type="success">Có</el-tag>
            <el-tag v-else type="info">Không</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Trạng thái" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">Bật</el-tag>
            <el-tag v-else type="info">Tắt</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at_text" label="Thời gian tạo" width="180" align="center" />
        <el-table-column label="Thao tác" width="250" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleSetDefault(row)" v-if="row.is_default !== 1">Đặt làm mặc định</el-button>
            <el-button size="small" type="warning" @click="handleEdit(row)">Chỉnh sửa</el-button>
            <el-button size="small" type="danger" @click="handleDelete([row.id])">Xóa</el-button>
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
      :title="dialogType === 'add' ? 'Thêm tài khoản' : 'Sửa đổi tài khoản'"
      width="500px"
      append-to-body
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="Tên người dùng" prop="username">
          <el-select
            v-model="form.username"
            filterable
            remote
            reserve-keyword
            placeholder="Vui lòng nhập tên người dùng để tìm kiếm"
            :remote-method="handleUserSearch"
            :loading="userLoading"
            :disabled="dialogType === 'edit'"
            @change="val => {
               const user = userOptions.find(u => u.username === val)
               if (user) handleUserSelect(user)
            }"
            class="w-full"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Loại tài khoản" prop="type">
          <el-select v-model="form.type" placeholder="Vui lòng chọn loại tài khoản" class="w-full">
            <el-option label="Thẻ ngân hàng" value="bank" />
            <el-option label="USDT" value="usdt" />
            <el-option label="Alipay" value="alipay" />
            <el-option label="WeChat" value="wechat" />
          </el-select>
        </el-form-item>
        
        <template v-if="form.type === 'bank'">
          <el-form-item label="Tên ngân hàng" prop="bank_name">
            <el-input v-model="form.bank_name" placeholder="Vui lòng nhập tên ngân hàng (Ví dụ: Vietcombank)" />
          </el-form-item>
          <el-form-item label="Tài khoản ngân hàng" prop="bank_account">
            <el-input v-model="form.bank_account" placeholder="Vui lòng nhập số thẻ ngân hàng" />
          </el-form-item>
          <el-form-item label="Tên chủ tài khoản" prop="account_name">
            <el-input v-model="form.account_name" placeholder="Vui lòng nhập tên chủ tài khoản" />
          </el-form-item>
        </template>

        
        <template v-if="form.type === 'usdt'">
          <el-form-item label="USDTMạng" prop="usdt_network">
            <el-select v-model="form.usdt_network" placeholder="Vui lòng chọn mạng" class="w-full">
              <el-option label="TRC20" value="TRC20" />
              <el-option label="ERC20" value="ERC20" />
            </el-select>
          </el-form-item>
          <el-form-item label="USDTĐịa chỉ" prop="usdt_address">
            <el-input v-model="form.usdt_address" placeholder="Vui lòng nhập địa chỉ USDT" />
          </el-form-item>
        </template>

        
        <template v-if="['alipay', 'wechat'].includes(form.type || '')">
          <el-form-item label="Tài khoản" prop="bank_account">
            <el-input v-model="form.bank_account" placeholder="Vui lòng nhập tài khoản" />
          </el-form-item>
          <el-form-item label="Họ tên thật" prop="account_name">
            <el-input v-model="form.account_name" placeholder="Vui lòng nhập họ tên thật" />
          </el-form-item>
          <el-form-item label="Mã nhận tiền">
            <div class="flex items-center gap-4">
              <el-upload
                class="qr-uploader"
                :show-file-list="false"
                :action="uploadUrl"
                :on-success="handleQrUploadSuccess"
                :on-error="handleQrUploadError"
                accept="image/*"
              >
                <el-image 
                  v-if="form.qr_code" 
                  :src="form.qr_code" 
                  fit="cover"
                  style="width: 100px; height: 100px; cursor: pointer;"
                />
                <div v-else class="upload-placeholder">
                  <el-icon><Plus /></el-icon>
                  <span>Tải lên mã QR nhận tiền</span>
                </div>
              </el-upload>
              <el-button v-if="form.qr_code" type="danger" size="small" @click="form.qr_code = ''">Xóa</el-button>
            </div>
          </el-form-item>
        </template>
        <el-form-item label="Trạng thái" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">Bật</el-radio>
            <el-radio :label="0">Tắt</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Tài khoản mặc định" prop="is_default">
          <el-switch v-model="form.is_default" :active-value="1" :inactive-value="0" />
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
import { Plus } from '@element-plus/icons-vue'
import {
  fetchWithdrawAccountList,
  createWithdrawAccount,
  updateWithdrawAccount,
  deleteWithdrawAccount,
  setDefaultWithdrawAccount,
  type WithdrawAccount,
  type WithdrawAccountSearchParams
} from '@/api/withdraw-account'
import { fetchMemberList, type Member } from '@/api/member'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref<WithdrawAccount[]>([])
const selectedIds = ref<number[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const searchParams = reactive<WithdrawAccountSearchParams>({
  username: '',
  type: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = reactive<Partial<WithdrawAccount>>({
  uid: undefined,
  username: '',
  type: 'bank',
  bank_name: '',
  bank_account: '',
  account_name: '',
  usdt_address: '',
  usdt_network: '',
  qr_code: '',
  status: 1,
  is_default: 0
})

const rules = reactive({
  username: [{ required: true, message: 'Vui lòng chọn người dùng', trigger: 'change' }],
  type: [{ required: true, message: 'Vui lòng chọn loại tài khoản', trigger: 'change' }],


  bank_name: [{ required: true, message: 'Vui lòng nhập tên ngân hàng', trigger: 'blur' }],


  bank_account: [{ required: true, message: 'Vui lòng nhập tài khoản', trigger: 'blur' }],
  account_name: [{ required: true, message: 'Vui lòng nhập họ tên', trigger: 'blur' }],


  usdt_address: [{ required: true, message: 'Vui lòng nhập địa chỉ USDT', trigger: 'blur' }],
  usdt_network: [{ required: true, message: 'Vui lòng chọn mạng USDT', trigger: 'change' }]
})

const userOptions = ref<Member[]>([])
const userLoading = ref(false)

const handleUserSearch = async (query: string) => {
  if (query) {
    userLoading.value = true
    try {
      const res = await fetchMemberList({ username: query, page: 1, limit: 20 })
      userOptions.value = res.list
    } finally {
      userLoading.value = false
    }
  } else {
    userOptions.value = []
  }
}

const handleUserSelect = (item: Member) => {
  form.uid = item.id
  form.username = item.username
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await fetchWithdrawAccountList({
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
  searchParams.type = ''
  searchParams.status = ''
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

const handleSelectionChange = (selection: WithdrawAccount[]) => {
  selectedIds.value = selection.map(item => item.id)
}


const uploadUrl = '/app/admin/upload/image'


const handleQrUploadSuccess = (res: any) => {
  if (res.code === 0 && res.data?.url) {
    form.qr_code = res.data.url
    ElMessage.success('Tải lên thành công')
  } else {
    ElMessage.error(res.msg || 'Tải lên thất bại')
  }
}

const handleQrUploadError = () => {
  ElMessage.error('Tải lên thất bại')
}

const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(form, {
    id: undefined,
    uid: undefined,
    username: '',
    type: 'bank',
    bank_name: '',
    bank_account: '',
    account_name: '',
    usdt_address: '',
    usdt_network: '',
    qr_code: '',
    status: 1,
    is_default: 0
  })
  dialogVisible.value = true
}

const handleEdit = (row: WithdrawAccount) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = (ids: number[]) => {
  ElMessageBox.confirm('Xác nhận xóa?', 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await deleteWithdrawAccount(ids)
    ElMessage.success('Xóa thành công')
    fetchData()
  })
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) return
  handleDelete(selectedIds.value)
}

const handleSetDefault = (row: WithdrawAccount) => {
  ElMessageBox.confirm(`Xác nhận đặt tài khoản này của ${row.username} làm mặc định?`, 'Thông báo', {
    type: 'info'
  }).then(async () => {
    await setDefaultWithdrawAccount(row.id)
    ElMessage.success('Đặt thành công')
    fetchData()
  })
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        if (dialogType.value === 'add') {
          await createWithdrawAccount(form)
          ElMessage.success('Thêm thành công')
        } else {
          await updateWithdrawAccount(form)
          ElMessage.success('Sửa thành công')
        }
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

:deep(.el-tag--info.bg-cyan-500) {
  background-color: var(--art-info);
  border-color: var(--art-info);
  color: #fff;
}

.upload-placeholder {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #8c939d;
  font-size: 12px;
  transition: border-color 0.3s;
}
.upload-placeholder:hover {
  border-color: #409eff;
}
.upload-placeholder .el-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

:deep(.qr-uploader .el-upload) {
  border-radius: 6px;
  overflow: hidden;
}
</style>
