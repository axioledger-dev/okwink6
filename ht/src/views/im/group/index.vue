<template>
  <div class="im-group-page art-full-height">
    <ElCard class="art-table-card" shadow="never">
      <div class="search-form-container" id="art-table-header">
        <ElForm :model="searchParams" inline class="search-form">
          <ElFormItem label="Tên nhóm">
            <ElInput v-model="searchParams.name" placeholder="Vui lòng nhập" style="width: 150px" clearable />
          </ElFormItem>
          <ElFormItem label="Chủ nhóm">
            <ElInput v-model="searchParams.owner_name" placeholder="Vui lòng nhập" style="width: 150px" clearable />
          </ElFormItem>
          <ElFormItem label="Trạng thái">
            <ElSelect v-model="searchParams.status" placeholder="Tất cả" style="width: 120px" clearable>
              <ElOption label="Bình thường" :value="1" />
              <ElOption label="Tắt" :value="0" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" @click="refreshData">
              <template #icon><ArtSvgIcon icon="ri:search-line" /></template>
              Tìm kiếm
            </ElButton>
            <ElButton @click="resetSearch">
              <template #icon><ArtSvgIcon icon="ri:refresh-line" /></template>
              Đặt lại
            </ElButton>
          </ElFormItem>
          <div style="float: right">
            <ElButton type="success" @click="openCreateDialog">
              <template #icon><ArtSvgIcon icon="ri:add-line" /></template>
              Tạo chat nhóm
            </ElButton>
          </div>
        </ElForm>
      </div>

      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      />
    </ElCard>

    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="500px" destroy-on-close>
      <ElForm ref="formRef" :model="formData" :rules="formRules" label-width="80px">
        <ElFormItem label="Tên nhóm" prop="name">
          <ElInput v-model="formData.name" placeholder="Vui lòng nhập tên nhóm" maxlength="50" />
        </ElFormItem>
        <ElFormItem label="Ảnh đại diện nhóm" prop="avatar">
          <ElInput v-model="formData.avatar" placeholder="Vui lòng nhập URL ảnh đại diện" />
        </ElFormItem>
        <ElFormItem label="Thông báo nhóm" prop="notice">
          <ElInput v-model="formData.notice" type="textarea" :rows="3" placeholder="Vui lòng nhập thông báo nhóm" maxlength="500" />
        </ElFormItem>
        <ElFormItem label="Số người tối đa" prop="max_members">
          <ElInputNumber v-model="formData.max_members" :min="10" :max="1000" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">Hủy</ElButton>
        <ElButton type="primary" @click="handleSubmit" :loading="submitting">Xác nhận</ElButton>
      </template>
    </ElDialog>

    <ElDialog v-model="membersDialogVisible" title="Thành viên nhóm" width="700px" destroy-on-close>
      <ElTable :data="groupMembers" v-loading="loadingMembers">
        <ElTableColumn prop="username" label="Tên người dùng" width="120" />
        <ElTableColumn prop="nickname" label="Biệt danh" width="120" />
        <ElTableColumn prop="role_text" label="Vai trò" width="80">
          <template #default="{ row }">
            <ElTag :type="row.role === 'owner' ? 'danger' : row.role === 'admin' ? 'warning' : 'info'" size="small">
              {{ row.role_text }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="joined_at" label="Thời gian tham gia" width="180" />
        <ElTableColumn label="Thao tác" width="100" fixed="right">
          <template #default="{ row }">
            <ElButton
              v-if="row.role !== 'owner'"
              type="danger"
              size="small"
              @click="handleRemoveMember(row)"
            >
              Xóa
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import { useTable } from '@/hooks/core/useTable'
import { ElButton, ElMessageBox, ElTag, ElAvatar, FormInstance } from 'element-plus'
import {
  fetchGroupList,
  createGroup,
  updateGroup,
  deleteGroup,
  toggleGroupStatus,
  fetchGroupMembers,
  removeGroupMember,
  ImGroup,
  ImGroupMember
} from '@/api/im'

defineOptions({ name: 'ImGroup' })

const searchParams = reactive({
  page: 1,
  limit: 20,
  name: '',
  owner_name: '',
  status: '' as number | string
})

const {
  columns,
  data,
  loading,
  pagination,
  refreshData,
  handleSizeChange,
  handleCurrentChange
} = useTable({
  core: {
    apiFn: fetchGroupList,
    apiParams: searchParams,
    paginationKey: { current: 'page', size: 'limit' },
    columnsFactory: () => [
      { prop: 'id', label: 'ID', width: 80, sortable: true, align: 'center' },
      {
        prop: 'avatar',
        label: 'Ảnh đại diện',
        width: 80,
        align: 'center',
        formatter: (row: ImGroup) =>
          h(ElAvatar, { src: row.avatar, size: 40 })
      },
      { prop: 'name', label: 'Tên nhóm', width: 150 },
      { prop: 'owner_name', label: 'Chủ nhóm', width: 120, align: 'center' },
      { prop: 'member_count', label: 'Số thành viên', width: 100, align: 'center' },
      { prop: 'max_members', label: 'Số người tối đa', width: 100, align: 'center' },
      {
        prop: 'status',
        label: 'Trạng thái',
        width: 80,
        align: 'center',
        formatter: (row: ImGroup) =>
          h(ElTag, { type: row.status === 1 ? 'success' : 'danger', size: 'small' }, () => row.status_text)
      },
      { prop: 'notice', label: 'Thông báo nhóm', minWidth: 150, showOverflowTooltip: true },
      { prop: 'created_at', label: 'Thời gian tạo', width: 180, align: 'center' },
      {
        prop: 'action',
        label: 'Thao tác',
        width: 220,
        fixed: 'right',
        align: 'center',
        formatter: (row: ImGroup) =>
          h('div', { class: 'table-actions' }, [
            h(ElButton, { type: 'primary', size: 'small', onClick: () => openEditDialog(row) }, () => 'Chỉnh sửa'),
            h(ElButton, { type: 'info', size: 'small', onClick: () => openMembersDialog(row) }, () => 'Thành viên'),
            h(ElButton, { type: row.status === 1 ? 'warning' : 'success', size: 'small', onClick: () => handleToggleStatus(row) }, () => row.status === 1 ? 'Tắt' : 'Bật'),
            h(ElButton, { type: 'danger', size: 'small', onClick: () => handleDelete(row) }, () => 'Xóa')
          ])
      }
    ]
  }
})

const resetSearch = () => {
  searchParams.name = ''
  searchParams.owner_name = ''
  searchParams.status = ''
  refreshData()
}

const dialogVisible = ref(false)
const dialogTitle = ref('Tạo chat nhóm')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const editingId = ref<number | null>(null)

const formData = reactive({
  name: '',
  avatar: '',
  notice: '',
  max_members: 200
})

const formRules = {
  name: [{ required: true, message: 'Vui lòng nhập tên nhóm', trigger: 'blur' }]
}

const openCreateDialog = () => {
  editingId.value = null
  dialogTitle.value = 'Tạo chat nhóm'
  formData.name = ''
  formData.avatar = ''
  formData.notice = ''
  formData.max_members = 200
  dialogVisible.value = true
}

const openEditDialog = (row: ImGroup) => {
  editingId.value = row.id
  dialogTitle.value = 'Chỉnh sửa nhóm chat'
  formData.name = row.name
  formData.avatar = row.avatar
  formData.notice = row.notice
  formData.max_members = row.max_members
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      if (editingId.value) {
        await updateGroup({ id: editingId.value, ...formData })
      } else {
        await createGroup(formData)
      }
      dialogVisible.value = false
      refreshData()
    } finally {
      submitting.value = false
    }
  })
}

const handleToggleStatus = (row: ImGroup) => {
  const action = row.status === 1 ? 'Tắt' : 'Bật'
  ElMessageBox.confirm(`Xác nhận ${action} nhóm chat này không?`, 'Thông báo', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    type: 'warning'
  }).then(async () => {
    await toggleGroupStatus(row.id)
    refreshData()
  })
}

const handleDelete = (row: ImGroup) => {
  ElMessageBox.confirm('Xác nhận xóa nhóm chat này không? Sau khi xóa, tất cả tin nhắn sẽ bị xóa', 'Thông báo', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    type: 'warning'
  }).then(async () => {
    await deleteGroup(row.id)
    refreshData()
  })
}

const membersDialogVisible = ref(false)
const groupMembers = ref<ImGroupMember[]>([])
const loadingMembers = ref(false)
const currentGroupId = ref<number>(0)

const openMembersDialog = async (row: ImGroup) => {
  currentGroupId.value = row.id
  membersDialogVisible.value = true
  loadingMembers.value = true
  try {
    const res = await fetchGroupMembers(row.id)
    groupMembers.value = res?.list || []
  } finally {
    loadingMembers.value = false
  }
}

const handleRemoveMember = (member: ImGroupMember) => {
  ElMessageBox.confirm(`Xác nhận xóa ${member.username} khỏi nhóm chat không?`, 'Thông báo', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    type: 'warning'
  }).then(async () => {
    await removeGroupMember(currentGroupId.value, member.user_id)
    const res = await fetchGroupMembers(currentGroupId.value)
    groupMembers.value = res?.list || []
    refreshData()
  })
}
</script>

<style scoped>
.search-form-container {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 16px;
}
.table-actions {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
