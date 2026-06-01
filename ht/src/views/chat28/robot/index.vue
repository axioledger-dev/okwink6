<template>
  <div class="chat28-robot-page art-full-height">
    <ElCard class="art-table-card" shadow="never">
      
      <div class="search-form-container" id="art-table-header">
        <ElForm :model="searchParams" inline class="search-form">
          <ElFormItem label="Tên người dùng/Biệt danh">
            <ElInput v-model="searchParams.username" placeholder="Vui lòng nhập" style="width: 180px" clearable />
          </ElFormItem>
          <ElFormItem label="Trạng thái">
            <ElSelect v-model="searchParams.status" placeholder="Tất cả" style="width: 120px" clearable>
              <ElOption label="Bình thường" value="normal" />
              <ElOption label="Tắt" value="locked" />
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
            <ElButton type="success" @click="openBatchRechargeDialog">
              <template #icon><ArtSvgIcon icon="ri:money-cny-circle-line" /></template>
              Nạp tiền hàng loạt
            </ElButton>
            <ElButton type="warning" @click="openBatchCreateDialog">
              <template #icon><ArtSvgIcon icon="ri:group-line" /></template>
              Tạo hàng loạt
            </ElButton>
            <ElButton type="primary" @click="openAddDialog">
              <template #icon><ArtSvgIcon icon="ri:add-line" /></template>
              Thêm robot
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

    
    <ElDialog
      v-model="dialogVisible"
      :title="isEdit ? 'Chỉnh sửa robot' : 'Thêm robot'"
      width="500px"
      destroy-on-close
    >
      <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <ElFormItem label="Tên người dùng" prop="username" v-if="!isEdit">
          <ElInput v-model="formData.username" placeholder="Vui lòng nhập tên người dùng" />
        </ElFormItem>
        <ElFormItem label="Biệt danh" prop="nickname">
          <ElInput v-model="formData.nickname" placeholder="Vui lòng nhập biệt danh" />
        </ElFormItem>
        <ElFormItem label="Ảnh đại diện" prop="face">
          <ElInput v-model="formData.face" placeholder="Vui lòng nhập URL ảnh đại diện" />
        </ElFormItem>
        <ElFormItem label="Số dư" prop="balance">
          <ElInputNumber v-model="formData.balance" :min="0" :max="999999" style="width: 100%" />
        </ElFormItem>
        <ElFormItem label="Trạng thái">
          <ElRadioGroup v-model="formData.islock">
            <ElRadio :label="0">Bình thường</ElRadio>
            <ElRadio :label="1">Tắt</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">Hủy</ElButton>
        <ElButton type="primary" @click="handleSubmit" :loading="submitting">Xác nhận</ElButton>
      </template>
    </ElDialog>

    
    <ElDialog
      v-model="batchCreateVisible"
      title="Tạo robot hàng loạt"
      width="450px"
      destroy-on-close
    >
      <ElForm ref="batchFormRef" :model="batchFormData" :rules="batchRules" label-width="100px">
        <ElFormItem label="Tiền tố tên người dùng" prop="prefix">
          <ElInput v-model="batchFormData.prefix" placeholder="Ví dụ: robot_" />
        </ElFormItem>
        <ElFormItem label="Số lượng tạo" prop="count">
          <ElInputNumber v-model="batchFormData.count" :min="1" :max="100" style="width: 100%" />
        </ElFormItem>
        <ElFormItem label="Số dư ban đầu" prop="balance">
          <ElInputNumber v-model="batchFormData.balance" :min="0" :max="999999" style="width: 100%" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="batchCreateVisible = false">Hủy</ElButton>
        <ElButton type="primary" @click="handleBatchCreate" :loading="batchCreating">Xác nhận tạo</ElButton>
      </template>
    </ElDialog>

    
    <ElDialog
      v-model="batchRechargeVisible"
      title="Nạp tiền hàng loạt"
      width="450px"
      destroy-on-close
    >
      <ElAlert type="info" :closable="false" style="margin-bottom: 16px">
        Sẽ tự động nạp tiền cho robot có số dư thấp hơn ngưỡng
      </ElAlert>
      <ElForm ref="rechargeFormRef" :model="rechargeFormData" label-width="120px">
        <ElFormItem label="Ngưỡng số dư">
          <ElInputNumber v-model="rechargeFormData.min_balance" :min="0" :max="99999" style="width: 100%" />
          <div class="form-tip">Robot có số dư thấp hơn giá trị này sẽ được nạp tiền</div>
        </ElFormItem>
        <ElFormItem label="Số tiền nạp">
          <ElInputNumber v-model="rechargeFormData.amount" :min="1" :max="999999" style="width: 100%" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="batchRechargeVisible = false">Hủy</ElButton>
        <ElButton type="primary" @click="handleBatchRecharge" :loading="recharging">Xác nhận nạp tiền</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import { useTable } from '@/hooks/core/useTable'
import { ElButton, ElMessageBox, ElTag, FormInstance } from 'element-plus'
import {
  fetchRobotList,
  createRobot,
  updateRobot,
  deleteRobot,
  batchCreateRobot,
  batchRechargeRobot,
  ChatRobot
} from '@/api/chat28'

defineOptions({ name: 'Chat28Robot' })

const searchParams = reactive({
  page: 1,
  limit: 20,
  username: '',
  status: ''
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
    apiFn: fetchRobotList,
    apiParams: searchParams,
    paginationKey: {
      current: 'page',
      size: 'limit'
    },
    columnsFactory: () => [
      { prop: 'id', label: 'ID', width: 80, sortable: true, align: 'center' },
      { prop: 'username', label: 'Tên người dùng', width: 150, align: 'center' },
      { prop: 'nickname', label: 'Biệt danh', width: 150, align: 'center' },
      {
        prop: 'face',
        label: 'Ảnh đại diện',
        width: 80,
        align: 'center',
        formatter: (row: ChatRobot) => {
          if (row.face) {
            return h('img', {
              src: row.face,
              style: { width: '32px', height: '32px', borderRadius: '50%' }
            })
          }
          return h('span', { style: { color: '#999' } }, 'Không có')
        }
      },
      {
        prop: 'balance',
        label: 'Số dư',
        width: 120,
        align: 'center',
        formatter: (row: ChatRobot) => '¥' + parseFloat(String(row.balance)).toFixed(2)
      },
      {
        prop: 'islock',
        label: 'Trạng thái',
        width: 100,
        align: 'center',
        formatter: (row: ChatRobot) =>
          h(
            ElTag,
            { type: row.islock === 0 ? 'success' : 'danger', size: 'small' },
            () => row.islock_text
          )
      },
      { prop: 'regtime', label: 'Thời gian đăng ký', width: 180, align: 'center' },
      { prop: 'logintime', label: 'Đăng nhập lần cuối', width: 180, align: 'center' },
      {
        prop: 'action',
        label: 'Thao tác',
        width: 150,
        fixed: 'right',
        align: 'center',
        formatter: (row: ChatRobot) =>
          h('div', [
            h(
              ElButton,
              { type: 'primary', size: 'small', onClick: () => openEditDialog(row) },
              () => 'Chỉnh sửa'
            ),
            h(
              ElButton,
              { type: 'danger', size: 'small', onClick: () => handleDelete(row) },
              () => 'Xóa'
            )
          ])
      }
    ]
  }
})

const resetSearch = () => {
  searchParams.username = ''
  searchParams.status = ''
  refreshData()
}

const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()

const defaultFormData = {
  id: 0,
  username: '',
  nickname: '',
  face: '',
  balance: 10000,
  islock: 0
}

const formData = reactive({ ...defaultFormData })

const rules = {
  username: [{ required: true, message: 'Vui lòng nhập tên người dùng', trigger: 'blur' }]
}

const openAddDialog = () => {
  isEdit.value = false
  Object.assign(formData, defaultFormData)
  dialogVisible.value = true
}

const openEditDialog = (row: ChatRobot) => {
  isEdit.value = true
  Object.assign(formData, {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    face: row.face,
    balance: row.balance,
    islock: row.islock
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (isEdit.value) {
        await updateRobot(formData)
      } else {
        await createRobot(formData)
      }
      dialogVisible.value = false
      refreshData()
    } catch (e) {
      console.error(e)
    } finally {
      submitting.value = false
    }
  })
}

const handleDelete = (row: ChatRobot) => {
  ElMessageBox.confirm(`Xác nhận xóa robot【${row.nickname || row.username}】không?`, 'Thông báo', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteRobot(row.id)
      refreshData()
    } catch (e) {
      console.error(e)
    }
  })
}

const batchCreateVisible = ref(false)
const batchCreating = ref(false)
const batchFormRef = ref<FormInstance>()

const batchFormData = reactive({
  prefix: 'robot_',
  count: 10,
  balance: 10000
})

const batchRules = {
  prefix: [{ required: true, message: 'Vui lòng nhập tiền tố', trigger: 'blur' }],
  count: [{ required: true, message: 'Vui lòng nhập số lượng', trigger: 'blur' }]
}

const openBatchCreateDialog = () => {
  batchFormData.prefix = 'robot_'
  batchFormData.count = 10
  batchFormData.balance = 10000
  batchCreateVisible.value = true
}

const handleBatchCreate = async () => {
  if (!batchFormRef.value) return

  await batchFormRef.value.validate(async (valid) => {
    if (!valid) return

    batchCreating.value = true
    try {
      await batchCreateRobot(batchFormData)
      batchCreateVisible.value = false
      refreshData()
    } catch (e) {
      console.error(e)
    } finally {
      batchCreating.value = false
    }
  })
}

const batchRechargeVisible = ref(false)
const recharging = ref(false)
const rechargeFormRef = ref<FormInstance>()

const rechargeFormData = reactive({
  min_balance: 1000,
  amount: 10000
})

const openBatchRechargeDialog = () => {
  rechargeFormData.min_balance = 1000
  rechargeFormData.amount = 10000
  batchRechargeVisible.value = true
}

const handleBatchRecharge = async () => {
  recharging.value = true
  try {
    await batchRechargeRobot(rechargeFormData)
    batchRechargeVisible.value = false
    refreshData()
  } catch (e) {
    console.error(e)
  } finally {
    recharging.value = false
  }
}
</script>

<style scoped>
.search-form-container {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 16px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>


