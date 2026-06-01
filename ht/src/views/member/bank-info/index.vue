<template>
  <div class="app-container">
    <el-card shadow="never">
      
      <el-form :model="searchParams" inline class="mb-4 search-form">
        <el-form-item label="Trạng thái">
          <el-select v-model="searchParams.state" placeholder="Tất cả" clearable style="width: 160px">
            <el-option label="Tất cả" value="" />
            <el-option label="Đang duyệt" :value="0" />
            <el-option label="Đã duyệt" :value="1" />
            <el-option label="Bác bỏ" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="Tên người dùng">
          <el-input v-model="searchParams.username" placeholder="Nhập tên người dùng" clearable @keyup.enter="handleSearch" style="width: 160px" />
        </el-form-item>
        <el-form-item label="Tên ràng buộc">
          <el-input v-model="searchParams.accountname" placeholder="Nhập tên ràng buộc" clearable @keyup.enter="handleSearch" style="width: 160px" />
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
        </el-form-item>
      </el-form>

      
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column prop="username" label="Tên người dùng" width="120" align="center" sortable />
        <el-table-column prop="accountname" label="Tên chủ tài khoản" width="120" align="center" sortable />
        <el-table-column prop="bankname" label="Ngân hàng mở tài khoản" width="150" align="center" sortable />
        <el-table-column prop="bankbranch" label="Chi nhánh mở tài khoản" width="150" align="center" sortable />
        <el-table-column prop="bankaddress" label="Địa chỉ mở tài khoản" min-width="200" align="center" sortable />
        <el-table-column prop="banknumber" label="Số thẻ ngân hàng" width="180" align="center" sortable />
        <el-table-column prop="state" label="Trạng thái" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.state === 0" type="warning">Đang duyệt</el-tag>
            <el-tag v-else-if="row.state === 1" type="success">Đã duyệt</el-tag>
            <el-tag v-else-if="row.state === 2" type="danger">Bác bỏ</el-tag>
            <span v-else>{{ row.state }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="150" align="center" fixed="right">
          <template #default="{ row }">
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
      title="Chỉnh sửa thông tin ngân hàng"
      width="600px"
      append-to-body
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="Tên người dùng" prop="username">
          <el-input v-model="form.username" disabled />
        </el-form-item>
        <el-form-item label="Tên chủ tài khoản" prop="accountname">
          <el-input v-model="form.accountname" placeholder="Vui lòng nhập tên chủ tài khoản" />
        </el-form-item>
        <el-form-item label="Ngân hàng mở tài khoản" prop="bankname">
          <el-input v-model="form.bankname" placeholder="Vui lòng nhập ngân hàng mở tài khoản" />
        </el-form-item>
        <el-form-item label="Chi nhánh mở tài khoản" prop="bankbranch">
          <el-input v-model="form.bankbranch" placeholder="Vui lòng nhập chi nhánh mở tài khoản" />
        </el-form-item>
        <el-form-item label="Địa chỉ mở tài khoản" prop="bankaddress">
          <el-input v-model="form.bankaddress" placeholder="Vui lòng nhập địa chỉ mở tài khoản" />
        </el-form-item>
        <el-form-item label="Số thẻ ngân hàng" prop="banknumber">
          <el-input v-model="form.banknumber" placeholder="Vui lòng nhập số thẻ ngân hàng" />
        </el-form-item>
        <el-form-item label="Trạng thái" prop="state">
          <el-select v-model="form.state" placeholder="Vui lòng chọn trạng thái">
            <el-option label="Đang duyệt" :value="0" />
            <el-option label="Đã duyệt" :value="1" />
            <el-option label="Bác bỏ" :value="2" />
          </el-select>
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
import { fetchBankList, updateBank, deleteBank, type BankInfo, type BankSearchParams } from '@/api/bank-info'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref<BankInfo[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const searchParams = reactive<BankSearchParams>({
  state: '',
  username: '',
  accountname: ''
})

const dialogVisible = ref(false)
const formRef = ref()
const form = reactive<Partial<BankInfo>>({
  id: undefined,
  username: '',
  accountname: '',
  bankname: '',
  bankbranch: '',
  bankaddress: '',
  banknumber: '',
  state: 0
})

const rules = {
  accountname: [{ required: true, message: 'Vui lòng nhập tên chủ tài khoản', trigger: 'blur' }],
  bankname: [{ required: true, message: 'Vui lòng nhập ngân hàng mở tài khoản', trigger: 'blur' }],
  banknumber: [{ required: true, message: 'Vui lòng nhập số thẻ ngân hàng', trigger: 'blur' }],
  state: [{ required: true, message: 'Vui lòng chọn trạng thái', trigger: 'change' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await fetchBankList({
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
  searchParams.state = ''
  searchParams.username = ''
  searchParams.accountname = ''
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

const handleEdit = (row: BankInfo) => {
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = (row: BankInfo) => {
  ElMessageBox.confirm('Xác nhận xóa thông tin ngân hàng này?', 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await deleteBank(row.id)
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
        await updateBank(form)
        ElMessage.success('Sửa thành công')
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
