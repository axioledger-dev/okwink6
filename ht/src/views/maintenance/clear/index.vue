<template>
  <div class="data-clear-page art-full-height">
    <ElCard class="art-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>Dọn dẹp dữ liệu</span>
          <ElTag type="danger" effect="plain" class="ml-2">Thao tác thận trọng: Dữ liệu sau khi dọn dẹp không thể khôi phục</ElTag>
        </div>
      </template>

      <ElTable :data="clearItems" border style="width: 100%">
        <ElTableColumn prop="title" label="Mục dữ liệu" width="200" align="center" />
        
        <ElTableColumn label="Điều kiện dọn dẹp" align="left">
          <template #default="{ row }">
            <div class="condition-wrapper">
              
              <div v-if="row.type === ClearType.USER_INACTIVE" class="flex items-center">
                Số dư tài khoản thấp hơn
                <ElInputNumber 
                  v-model="row.params.amount" 
                  :min="0" 
                  :max="100"
                  controls-position="right"
                  size="small"
                  class="mx-2 w-24"
                />
                đồng, và
                <ElInputNumber 
                  v-model="row.params.days" 
                  :min="30" 
                  controls-position="right"
                  size="small"
                  class="mx-2 w-24"
                />
                ngày chưa đăng nhập
              </div>

              
              <div v-else-if="row.type === ClearType.USER_REGISTER" class="flex items-center">
                Đăng ký
                <ElInputNumber 
                  v-model="row.params.days" 
                  :min="7" 
                  controls-position="right"
                  size="small"
                  class="mx-2 w-24"
                />
                ngày chưa đăng nhập
              </div>

              
              <div v-else-if="row.type === ClearType.USER_TEST" class="flex items-center">
                Tài khoản test nội bộ
                <ElCheckbox v-model="row.params.is_inner" :true-label="1" :false-label="0" class="ml-2">
                  Tất cả
                </ElCheckbox>
              </div>

              
              <div v-else-if="row.type === ClearType.LOTTERY_RESULT" class="flex items-center">
                Dọn dẹp
                <ElInputNumber 
                  v-model="row.params.days" 
                  :min="1" 
                  controls-position="right"
                  size="small"
                  class="mx-2 w-24"
                />
                ngày trước dữ liệu mở thưởng
              </div>

              
              <div v-else-if="row.type === ClearType.BET_RECORD" class="flex items-center">
                Dọn dẹp
                <ElInputNumber 
                  v-model="row.params.days" 
                  :min="30" 
                  controls-position="right"
                  size="small"
                  class="mx-2 w-24"
                />
                ngày trước，loại
                <ElSelect v-model="row.params.state" size="small" class="mx-2 w-32">
                  <ElOption label="Tất cả" :value="999" />
                  <ElOption label="Chưa mở thưởng" :value="0" />
                  <ElOption label="Hủy đơn" :value="-2" />
                </ElSelect>
                dữ liệu đặt cược
              </div>

              
              <div v-else-if="row.type === ClearType.RECHARGE_RECORD" class="flex items-center">
                Dọn dẹp
                <ElInputNumber 
                  v-model="row.params.days" 
                  :min="30" 
                  controls-position="right"
                  size="small"
                  class="mx-2 w-24"
                />
                ngày trước，loại
                <ElSelect v-model="row.params.state" size="small" class="mx-2 w-32">
                  <ElOption label="Tất cả" :value="999" />
                  <ElOption label="Chưa duyệt" :value="0" />
                  <ElOption label="Hủy" :value="-1" />
                </ElSelect>
                dữ liệu nạp tiền
              </div>

              
              <div v-else-if="row.type === ClearType.WITHDRAW_RECORD" class="flex items-center">
                Dọn dẹp
                <ElInputNumber 
                  v-model="row.params.days" 
                  :min="30" 
                  controls-position="right"
                  size="small"
                  class="mx-2 w-24"
                />
                ngày trước，loại
                <ElSelect v-model="row.params.state" size="small" class="mx-2 w-32">
                  <ElOption label="Tất cả" :value="999" />
                  <ElOption label="Chưa duyệt" :value="0" />
                  <ElOption label="Hoàn trả/Hủy" :value="-1" />
                </ElSelect>
                dữ liệu rút tiền
              </div>

              
              <div v-else class="flex items-center">
                Dọn dẹp
                <ElInputNumber 
                  v-model="row.params.days" 
                  :min="7" 
                  controls-position="right"
                  size="small"
                  class="mx-2 w-24"
                />
                ngày trước dữ liệu
              </div>
            </div>
          </template>
        </ElTableColumn>

        <ElTableColumn label="Thao tác" width="150" align="center">
          <template #default="{ row }">
            <ElButton type="danger" :loading="row.loading" @click="handleClear(row)">
              Dọn dẹp
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  ElCard,
  ElTable,
  ElTableColumn,
  ElButton,
  ElTag,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElCheckbox,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { ClearType, clearData, ClearParams } from '@/api/maintenance-clear'

defineOptions({ name: 'DataClear' })

interface ClearItem {
  type: ClearType
  title: string
  params: Partial<ClearParams>
  loading: boolean
}

const clearItems = ref<ClearItem[]>([
  {
    type: ClearType.USER_INACTIVE,
    title: 'Dọn dẹp tài khoản thành viên',
    params: { amount: 1, days: 60 },
    loading: false
  },
  {
    type: ClearType.USER_REGISTER,
    title: 'Dọn dẹp tài khoản không hoạt động',
    params: { days: 15 },
    loading: false
  },
  {
    type: ClearType.USER_TEST,
    title: 'Dọn dẹp tài khoản nội bộ',
    params: { is_inner: 1 },
    loading: false
  },
  {
    type: ClearType.LOTTERY_RESULT,
    title: 'Dọn dẹp dữ liệu mở thưởng',
    params: { days: 2 },
    loading: false
  },
  {
    type: ClearType.BET_RECORD,
    title: 'Dọn dẹp dữ liệu đặt cược',
    params: { days: 60, state: 999 },
    loading: false
  },
  {
    type: ClearType.RECHARGE_RECORD,
    title: 'Dọn dẹp dữ liệu nạp tiền',
    params: { days: 45, state: 999 },
    loading: false
  },
  {
    type: ClearType.WITHDRAW_RECORD,
    title: 'Dọn dẹp dữ liệu rút tiền',
    params: { days: 45, state: 999 },
    loading: false
  },
  {
    type: ClearType.BALANCE_LOG,
    title: 'Dọn dẹp dữ liệu biến động tài khoản',
    params: { days: 45 },
    loading: false
  },
  {
    type: ClearType.MEMBER_LOG,
    title: 'Dọn dẹp nhật ký thành viên',
    params: { days: 7 },
    loading: false
  },
  {
    type: ClearType.ADMIN_LOG,
    title: 'Dọn dẹp nhật ký quản trị viên',
    params: { days: 7 },
    loading: false
  }
])

const handleClear = (item: ClearItem) => {
  ElMessageBox.confirm(`Xác nhận thực thi【${item.title}】? Thao tác này không thể khôi phục!`, 'Cảnh báo', {
    confirmButtonText: 'Xác nhận dọn dẹp',
    cancelButtonText: 'Hủy',
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  }).then(async () => {
    item.loading = true
    try {
      await clearData({
        type: item.type,
        ...item.params
      })
      ElMessage.success('Tác vụ dọn dẹp đã được gửi')
    } catch (e) {

    } finally {
      item.loading = false
    }
  }).catch(() => {})
}
</script>

<style scoped>
.condition-wrapper {
  font-size: 14px;
  color: var(--el-text-color-regular);
}
.ml-2 { margin-left: 0.5rem; }
.mx-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
.w-24 { width: 6rem; }
.w-32 { width: 8rem; }
</style>
