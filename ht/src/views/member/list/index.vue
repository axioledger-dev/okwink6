<template>
  <div class="member-list-page art-full-height">
    <ElCard class="art-table-card" shadow="never">
      
      <div class="search-form-container" id="art-table-header">
        <ElForm :model="searchParams" inline class="search-form">
          
          <ElFormItem>
            <ElButton type="primary" @click="openDialog('add')">
              <template #icon><ArtSvgIcon icon="ri:add-line" /></template>
              Thêm hội viên
            </ElButton>
          </ElFormItem>

          
          <ElFormItem label="Sắp xếp">
            <ElSelect v-model="searchParams.ordertype" style="width: 150px">
              <ElOption label="Sắp xếp mặc định" :value="0" />
              <ElOption label="Thời gian đăng ký thấp đến cao" :value="1" />
              <ElOption label="Hoàn điểm xổ số cao đến thấp" :value="2" />
              <ElOption label="Hoàn điểm xổ số thấp đến cao" :value="3" />
              <ElOption label="Số dư tài khoản cao đến thấp" :value="4" />
              <ElOption label="Số dư tài khoản thấp đến cao" :value="5" />
              <ElOption label="Số dư hoàn cược cao đến thấp" :value="8" />
              <ElOption label="Số dư hoàn cược thấp đến cao" :value="9" />
              <ElOption label="Thời gian đăng nhập cao đến thấp" :value="16" />
              <ElOption label="Thời gian đăng nhập thấp đến cao" :value="17" />
              <ElOption label="Thời gian online cao đến thấp" :value="18" />
              <ElOption label="Thời gian online thấp đến cao" :value="19" />
            </ElSelect>
          </ElFormItem>

          
          <ElFormItem label="Nhóm hội viên">
            <ElSelect v-model="searchParams.groupid" style="width: 120px">
              <ElOption label="Tất cả" :value="0" />
              <ElOption
                v-for="g in groupList"
                :key="g.groupid"
                :label="g.groupname"
                :value="g.groupid"
              />
            </ElSelect>
          </ElFormItem>

          
          <ElFormItem label="Loại">
            <ElSelect v-model="searchParams.proxy" style="width: 100px">
              <ElOption label="Tất cả" :value="999" />
              <ElOption label="Đại lý" :value="1" />
              <ElOption label="Hội viên" :value="0" />
            </ElSelect>
          </ElFormItem>

          
          <ElFormItem label="Nội bộ">
            <ElSelect v-model="searchParams.isnb" style="width: 100px">
              <ElOption label="Tất cả" :value="999" />
              <ElOption label="Có" :value="1" />
              <ElOption label="Không" :value="0" />
            </ElSelect>
          </ElFormItem>

          
          <ElFormItem label="Tên người dùng">
            <ElInput v-model="searchParams.username" placeholder="Nhập tên người dùng" style="width: 120px" />
          </ElFormItem>
          <ElFormItem label="Họ tên">
            <ElInput v-model="searchParams.userbankname" placeholder="Nhập họ tên" style="width: 120px" />
          </ElFormItem>
          <ElFormItem label="Biệt danh">
            <ElInput v-model="searchParams.nickname" placeholder="Nhập biệt danh" style="width: 120px" />
          </ElFormItem>
          <ElFormItem label="IP đăng nhập">
            <ElInput v-model="searchParams.loginip" placeholder="Nhập IP đăng nhập" style="width: 120px" />
          </ElFormItem>

          
          <ElFormItem>
            <ElCheckbox v-model="searchParams.isonline" :true-label="1" :false-label="0">Trực tuyến</ElCheckbox>
          </ElFormItem>

          
          <ElFormItem label="Thời gian đăng ký">
            <ElDatePicker
              v-model="searchParams.sDate"
              type="date"
              placeholder="Thời gian bắt đầu"
              value-format="YYYYMMDD"
              style="width: 140px"
            />
            <span class="mx-2">-</span>
            <ElDatePicker
              v-model="searchParams.eDate"
              type="date"
              placeholder="Thời gian kết thúc"
              value-format="YYYYMMDD"
              style="width: 140px"
            />
          </ElFormItem>

          
          <ElFormItem label="Số tiền">
            <ElInput v-model="searchParams.sAmount" placeholder="Tối thiểu" style="width: 100px" />
            <span class="mx-2">-</span>
            <ElInput v-model="searchParams.eAmount" placeholder="Tối đa" style="width: 100px" />
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
        </ElForm>
      </div>

      
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>
    </ElCard>

    
    <MemberDialog
      v-model="dialogVisible"
      :type="dialogType"
      :data="currentMember"
      :group-list="groupList"
      @submit="refreshData"
    />

    
    <AdjustDialog
      v-model="adjustDialogVisible"
      :type="adjustType"
      :member-id="currentMember.id!"
      :current-value="adjustCurrentValue"
      @submit="refreshData"
    />

    
    <MemberInfoDialog
      v-model="infoDialogVisible"
      :member="currentMember"
    />

    
    <MemberDevicesDialog
      v-model="devicesDialogVisible"
      :member-id="currentMember.id!"
    />

    
    <BalanceLogDialog
      v-model="logDialogVisible"
      :member-id="currentMember.id!"
    />

    
    <ChildrenDialog
      v-model="childrenDialogVisible"
      :member-id="currentMember.id!"
    />

    
    <WithdrawAccountDialog
      v-model="withdrawAccountDialogVisible"
      :member-id="currentMember.id!"
      :member-username="currentMember.username"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted } from 'vue'
import { useTable } from '@/hooks/core/useTable'
import {
  fetchMemberList,
  deleteMember,
  kickMember,
  lockMember,
  fetchMemberGroupList,
  Member,
  MemberGroup
} from '@/api/member'
import { ElButton, ElTag, ElSwitch, ElMessageBox, ElMessage } from 'element-plus'
import MemberDialog from './modules/MemberDialog.vue'
import AdjustDialog from './modules/AdjustDialog.vue'
import MemberInfoDialog from './modules/MemberInfoDialog.vue'
import MemberDevicesDialog from './modules/MemberDevicesDialog.vue'
import BalanceLogDialog from './modules/BalanceLogDialog.vue'
import ChildrenDialog from './modules/ChildrenDialog.vue'
import WithdrawAccountDialog from './modules/WithdrawAccountDialog.vue'
import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'

defineOptions({ name: 'MemberList' })

const searchParams = reactive({
  page: 1,
  limit: 20,
  ordertype: 0,
  groupid: 0,
  proxy: 999,
  isnb: 999,
  username: '',
  userbankname: '',
  nickname: '',
  loginip: '',
  isonline: 0,
  sDate: '',
  eDate: '',
  sAmount: '',
  eAmount: ''
})

const groupList = ref<MemberGroup[]>([])

const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentMember = ref<Partial<Member>>({})

const adjustDialogVisible = ref(false)
const adjustType = ref<'balance' | 'point' | 'xima'>('balance')
const adjustCurrentValue = ref(0)

const infoDialogVisible = ref(false)
const devicesDialogVisible = ref(false)
const logDialogVisible = ref(false)
const childrenDialogVisible = ref(false)
const withdrawAccountDialogVisible = ref(false)

const loadGroups = async () => {
  try {
    const res = await fetchMemberGroupList({ page: 1, limit: 100 })
    if (res && res.list) {
      groupList.value = res.list
    }
  } catch {
  }
}

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
    apiFn: fetchMemberList,
    apiParams: searchParams,
    paginationKey: {
      current: 'page',
      size: 'limit'
    },
    columnsFactory: () => [
      { prop: 'id', label: 'ID', sortable: true, align: 'center' },
      {
        prop: 'groupname',
        label: 'Nhóm hội viên',
        width: 100,
        align: 'center',
        formatter: (row: Member) => h(ElTag, { type: 'info' }, () => row.groupname)
      },
      {
        prop: 'username',
        label: 'Tên người dùng',
        width: 120,
        align: 'center',
        formatter: (row: Member) =>
          h(
            'span',
            {
              class: 'text-primary cursor-pointer hover:underline',
              onClick: () => openDialog('edit', row)
            },
            row.username
          )
      },
      { prop: 'userbankname', label: 'Họ tên', width: 100, align: 'center' },
      { prop: 'parent_username', label: 'Trực tuyến', width: 100, align: 'center' },
      {
        prop: 'proxy_text',
        label: 'Loại',
        width: 80,
        align: 'center',
        formatter: (row: Member) => h(ElTag, { type: 'info' }, () => row.proxy_text)
      },
      {
        prop: 'balance',
        label: 'Số tiền',
        width: 120,
        align: 'center',
        formatter: (row: Member) =>
          h(
            'span',
            {
              class: 'text-primary cursor-pointer hover:underline',
              onClick: () => handleEditBalance(row)
            },
            Number(row.balance || 0).toFixed(3)
          )
      },
      { prop: 'yebmoney', label: 'Số dư tiết kiệm', width: 100, align: 'center' },
      {
        prop: 'xima',
        label: 'Số dư hoàn mã',
        width: 120,
        align: 'center',
        formatter: (row: Member) =>
          h(
            'span',
            {
              class: 'text-primary cursor-pointer hover:underline',
              onClick: () => handleEditXima(row)
            },
            Number(row.xima || 0).toFixed(3)
          )
      },
      { prop: 'logintime_text', label: 'Thời gian đăng nhập', width: 160, align: 'center' },
      { prop: 'loginsource', label: 'Nguồn đăng nhập', width: 100, align: 'center' },
      {
        prop: 'isonline_text',
        label: 'Trạng thái',
        width: 80,
        align: 'center',
        formatter: (row: Member) =>
          h(
            ElTag,
            { type: row.isonline_text === 'Trực tuyến' ? 'success' : 'info' },
            () => row.isonline_text
          )
      },
      {
        prop: 'islock',
        label: 'Cấm',
        width: 80,
        align: 'center',
        formatter: (row: Member) =>
          h(ElSwitch, {
            modelValue: row.islock === 0,
            activeText: '',
            inactiveText: '',
            inlinePrompt: true,
            activeValue: true,
            inactiveValue: false,
            onChange: (val: any) => handleLockChange(row, val)
          })
      },
      {
        prop: 'info',
        label: 'Thông tin',
        minWidth: 360,
        fixed: 'right',
        align: 'center',
        formatter: (row: Member) =>
          h('div', { class: 'flex justify-center gap-2' }, [
            h(ElButton, { size: 'small', onClick: () => handleInfo(row) }, () => 'Thông tin'),
            h(ElButton, { size: 'small', onClick: () => handleDevices(row) }, () => 'Thiết bị'),
            h(ElButton, { size: 'small', onClick: () => handleBalanceLog(row) }, () => 'Biến động'),
            h(ElButton, { size: 'small', onClick: () => handleChildren(row) }, () => 'Cấp dưới'),
            h(ElButton, { size: 'small', onClick: () => handleWithdrawAccount(row) }, () => 'Tài khoản rút tiền')
          ])
      },
      {
        prop: 'action',
        label: 'Thao tác',
        width: 180,
        fixed: 'right',
        align: 'center',
        formatter: (row: Member) =>
          h('div', { class: 'flex justify-center gap-2' }, [
            h(ElButton, { class: 'btn-edit', size: 'small', onClick: () => openDialog('edit', row) }, () => 'Chỉnh sửa'),
            h(ElButton, { class: 'btn-delete', size: 'small', onClick: () => handleDelete(row) }, () => 'Xóa'),
            h(ElButton, { class: 'btn-kick', size: 'small', onClick: () => handleKick(row) }, () => 'Đá')
          ])
      }
    ]
  }
})

onMounted(() => {
  loadGroups()
})

const resetSearch = () => {
    Object.assign(searchParams, {
        ordertype: 0,
        groupid: 0,
        proxy: 999,
        isnb: 999,
        username: '',
        userbankname: '',
        nickname: '',
        loginip: '',
        isonline: 0,
        sDate: '',
        eDate: '',
        sAmount: '',
        eAmount: ''
    })
    refreshData()
}

const openDialog = (type: 'add' | 'edit', row?: Member) => {
  dialogType.value = type
  currentMember.value = row ? { ...row } : {}
  dialogVisible.value = true
}

const handleEditBalance = (row: Member) => {
  currentMember.value = row
  adjustType.value = 'balance'
  adjustCurrentValue.value = Number(row.balance || 0)
  adjustDialogVisible.value = true
}

const handleEditXima = (row: Member) => {
  currentMember.value = row
  adjustType.value = 'xima'
  adjustCurrentValue.value = Number(row.xima || 0)
  adjustDialogVisible.value = true
}

const handleInfo = (row: Member) => {
  currentMember.value = row
  infoDialogVisible.value = true
}

const handleDevices = (row: Member) => {
  currentMember.value = row
  devicesDialogVisible.value = true
}

const handleBalanceLog = (row: Member) => {
  currentMember.value = row
  logDialogVisible.value = true
}

const handleChildren = (row: Member) => {
  currentMember.value = row
  childrenDialogVisible.value = true
}

const handleWithdrawAccount = (row: Member) => {
  currentMember.value = row
  withdrawAccountDialogVisible.value = true
}

const handleDelete = (row: Member) => {
  ElMessageBox.confirm(`Xác nhận xóa thành viên【${row.username}】?`, 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteMember(row.id)
      ElMessage.success('Đã xóa!')
      refreshData()
    } catch (e) {}
  })
}

const handleKick = (row: Member) => {
  ElMessageBox.confirm(`Xác nhận đá thành viên【${row.username}】?`, 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    try {
      await kickMember(row.id)
      ElMessage.success('Đã đá!')
    } catch (e) {}
  })
}

const handleLockChange = async (row: Member, val: boolean) => {
    const newLockState = val ? 0 : 1
    try {
        await lockMember(row.id, newLockState)
        row.islock = newLockState
        ElMessage.success(val ? 'Đã mở khóa' : 'Đã khóa')
    } catch {
        refreshData()
    }
}

</script>

<style scoped>
.search-form-container {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 16px;
}
.search-form .el-form-item {
  margin-bottom: 12px;
  margin-right: 12px;
}

/* Custom Button Styles - Sử dụng biến chủ đề */
:deep(.btn-edit) {
  background-color: var(--art-success) !important;
  border-color: var(--art-success) !important;
  color: #fff !important;
}
:deep(.btn-edit:hover) {
  background-color: var(--el-color-success-dark-2) !important;
  border-color: var(--el-color-success-dark-2) !important;
}

:deep(.btn-delete) {
  background-color: var(--art-error) !important;
  border-color: var(--art-error) !important;
  color: #fff !important;
}
:deep(.btn-delete:hover) {
  background-color: var(--el-color-error-dark-2) !important;
  border-color: var(--el-color-error-dark-2) !important;
}

:deep(.btn-kick) {
  background-color: var(--art-warning) !important;
  border-color: var(--art-warning) !important;
  color: #fff !important;
}
:deep(.btn-kick:hover) {
  background-color: var(--el-color-warning-dark-2) !important;
  border-color: var(--el-color-warning-dark-2) !important;
}
</style>
