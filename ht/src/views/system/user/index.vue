<template>
  <div class="p-4">
    <div class="mb-4 bg-box p-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <el-button type="primary" @click="handleAdd">
            <template #icon><ArtSvgIcon icon="ri:add-line" /></template>
            Thêm quản trị viên
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
        <el-table-column prop="username" label="Tên người dùng" min-width="120" align="center" />
        <el-table-column prop="nickname" label="Biệt danh" min-width="120" align="center" />
        <el-table-column label="Vai trò" min-width="120" align="center">
          <template #default="{ row }">
            {{ row.role_name || row.rolename || row.group_name || getRoleName(row.role_id) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status !== undefined ? row.status : row.state"
              :active-value="1"
              :inactive-value="0"
              @change="(val) => handleStatusChange(row, val as number)"
            />
          </template>
        </el-table-column>
        <el-table-column label="Thời gian đăng nhập cuối" width="180" align="center">
          <template #default="{ row }">
            {{ row.last_login_time || row.logintime || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="Thời gian tạo" width="180" align="center">
          <template #default="{ row }">
            {{ row.created_at || row.createtime || row.create_time || row.add_time || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column label="Thao tác" width="200" fixed="right" align="center">
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
      :title="dialogType === 'add' ? 'Thêm quản trị viên' : 'Chỉnh sửa quản trị viên'"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="Tên người dùng" prop="username">
          <el-input v-model="form.username" placeholder="Vui lòng nhập tên người dùng" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="Biệt danh" prop="nickname">
          <el-input v-model="form.nickname" placeholder="Vui lòng nhập biệt danh" />
        </el-form-item>
        <el-form-item label="Vai trò" prop="role_id">
          <el-select v-model="form.role_id" placeholder="Vui lòng chọn vai trò" class="w-full">
            <el-option
              v-for="role in roleOptions"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Mật khẩu" prop="password">
          <el-input v-model="form.password" type="password" placeholder="Để trống nếu không sửa" show-password />
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
  fetchAdminList,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateAdminStatus,
  fetchRoleOptions,
  type AdminUser,
  type RoleOption
} from '@/api/system-admin'

const loading = ref(false)
const tableData = ref<AdminUser[]>([])
const roleOptions = ref<RoleOption[]>([])
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
  username: '',
  nickname: '',
  role_id: undefined as number | undefined,
  password: '',
  status: 1
})

const rules = {
  username: [{ required: true, message: 'Vui lòng nhập tên người dùng', trigger: 'blur' }],
  nickname: [{ required: true, message: 'Vui lòng nhập biệt danh', trigger: 'blur' }],
  role_id: [{ required: true, message: 'Vui lòng chọn vai trò', trigger: 'change' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchAdminList({
      page: pagination.page,
      limit: pagination.limit
    })
    console.log('Admin User List Response:', res)
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const loadRoles = async () => {
  try {
    const res = await fetchRoleOptions()
    roleOptions.value = res
  } catch (error) {
    console.error(error)
  }
}

const getRoleName = (roleId: number) => {
  if (!roleId) return ''
  const role = roleOptions.value.find(r => r.id === roleId)
  return role ? role.name : ''
}

const handleSizeChange = (val: number) => {
  pagination.limit = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadData()
}

const handleStatusChange = async (row: AdminUser, val: number) => {
  try {
    await updateAdminStatus(row.id, val)
    ElMessage.success('Cập nhật trạng thái thành công')
  } catch (error) {
    row.status = val === 1 ? 0 : 1
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.id = 0
  form.username = ''
  form.nickname = ''
  form.role_id = undefined
  form.password = ''
  form.status = 1
  dialogVisible.value = true
}

const handleEdit = (row: AdminUser) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.username = row.username
  form.nickname = row.nickname
  form.role_id = row.role_id
  form.password = ''
  form.status = row.status
  dialogVisible.value = true
}

const handleDelete = (row: AdminUser) => {
  ElMessageBox.confirm(`Xác nhận xóa quản trị viên ${row.username}?`, 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await deleteAdmin(row.id)
    loadData()
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {

        const data: any = { ...form }
        if (!data.password) delete data.password

        if (dialogType.value === 'add') {
          if (!data.password) {
             ElMessage.warning('Vui lòng nhập mật khẩu')
             submitting.value = false
             return
          }
          await createAdmin(data)
        } else {
          await updateAdmin(data)
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
  loadRoles()
})
</script>