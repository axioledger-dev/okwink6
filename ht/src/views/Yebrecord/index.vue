
<template>
  <div class="yeb-holding-page art-full-height">
    <ElCard class="art-table-card" shadow="never">
      
      <div v-if="stats" class="mb-4 p-4 bg-hover-color rounded border-full-d flex gap-8 text-sm">
        <div>
          <span class="text-g-500">Tổng số người dùng:</span>
          <span class="font-bold text-lg">{{ stats.user_count || 0 }}</span>
        </div>
        <div>
          <span class="text-g-500">Số tiền đang chạy:</span>
          <span class="font-bold text-lg">{{ stats.running_amount || 0 }}</span>
        </div>
        <div>
          <span class="text-g-500">Lợi nhuận tích lũy:</span>
          <span class="font-bold text-lg">{{ stats.total_interest || 0 }}</span>
        </div>
        <div>
          <span class="text-g-500">Số lượng sản phẩm:</span>
          <span class="font-bold text-lg">{{ stats.product_count || 0 }}</span>
        </div>
      </div>

      
      <ArtTableHeader
        v-model:columns="columnChecks"
        :loading="loading"
        @refresh="refreshData"
        @search="handleSearch"
      >
        <template #left>
          <ElButton type="primary" @click="openOperationDialog('deposit')">
            <template #icon>
              <ArtSvgIcon icon="ri:add-line" />
            </template>
            Nạp thủ công
          </ElButton>
          <ElButton type="warning" @click="openOperationDialog('withdraw')">
            <template #icon>
              <ArtSvgIcon icon="ri:subtract-line" />
            </template>
            Rút thủ công
          </ElButton>
        </template>
        <template #search>
          <ElInput
            v-model="searchParams.username"
            placeholder="Tên người dùng"
            clearable
            class="w-40"
            @input="handleSearch"
          />
          <ElInput
            v-model="searchParams.order_id"
            placeholder="Mã đơn hàng"
            clearable
            class="w-40"
            @input="handleSearch"
          />
          <ElSelect
            v-model="searchParams.type"
            placeholder="Loại"
            clearable
            class="w-32"
            @change="handleSearch"
          >
            <ElOption label="Nạp/rút linh hoạt" value="current" />
            <ElOption label="Định kỳ" value="fixed" />
          </ElSelect>
          <ElSelect
            v-model="searchParams.status"
            placeholder="Trạng thái"
            clearable
            class="w-32"
            @change="handleSearch"
          >
            <ElOption label="Đang nhận lãi" value="running" />
            <ElOption label="Đã quyết toán" value="settled" />
            <ElOption label="Đã hủy" value="cancelled" />
          </ElSelect>
        </template>
      </ArtTableHeader>

      
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

    
    <AdminOperationDialog
      v-model:visible="operationDialogVisible"
      :type="operationType"
      @submit="refreshData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElTag, ElButton, ElInput, ElSelect, ElOption } from 'element-plus'
import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
import { useTable } from '@/hooks/core/useTable'
import {
  fetchHoldingList,
  fetchOverview,
  settleHolding,
  deleteHolding,
  type YebHolding,
  type YebHoldingSearchParams
} from '@/api/yebao'
import AdminOperationDialog from './modules/AdminOperationDialog.vue'

defineOptions({ name: 'YebHolding' })

const searchParams = reactive<YebHoldingSearchParams>({
  username: '',
  order_id: '',
  type: undefined,
  status: undefined
})

const stats = ref<any>({})

const fetchStats = async () => {
  try {

    stats.value = await fetchOverview()
  } catch (error) {
    console.error(error)
  }
}

const {
  columns,
  columnChecks,
  data,
  loading,
  pagination,
  handleSizeChange,
  handleCurrentChange,
  refreshData
} = useTable({
  core: {
    apiFn: fetchHoldingList,
    apiParams: searchParams,
    columnsFactory: () => [
      { prop: 'id', label: 'ID', width: 80, sortable: true, align: 'center' },
      { prop: 'username', label: 'Tên người dùng', width: 120, align: 'center' },
      { prop: 'order_id', label: 'Mã đơn hàng', width: 180, align: 'center' },
      { prop: 'product_name', label: 'Tên sản phẩm', minWidth: 150, align: 'center' },
      { prop: 'amount', label: 'Số tiền nạp vào', width: 120, align: 'center' },
      {
        prop: 'type',
        label: 'Loại',
        width: 100,
        align: 'center',
        formatter: (row: YebHolding) => {
          return h(
            ElTag,
            { type: row.type === 'current' ? 'success' : 'warning' },
            () => (row.type === 'current' ? 'Nạp/rút linh hoạt' : 'Định kỳ')
          )
        }
      },
      {
        prop: 'status_text',
        label: 'Trạng thái',
        width: 100,
        align: 'center',
        formatter: (row: any) => {

          const val = row.status_text || row.status

          const status = row.status || ''
          let type = 'info'
          if (status === 'running' || val === 'Đang nhận lãi') type = 'primary'
          else if (status === 'settled' || val === 'Đã quyết toán') type = 'success'
          else if (status === 'cancelled' || val === 'Đã hủy') type = 'info'

          return h(ElTag, { type: type as any }, () => val)
        }
      },
      { prop: 'createtime_text', label: 'Thời gian nạp vào', width: 180, align: 'center' },
      {
        prop: 'operation',
        label: 'Thao tác',
        width: 180,
        fixed: 'right',
        align: 'center',
        formatter: (row: YebHolding) =>
          h('div', [
            row.status === 'running' &&
              h(
                ElButton,
                {
                  type: 'warning',
                  size: 'small',
                  link: true,
                  onClick: () => handleSettle(row)
                },
                () => 'Quyết toán bắt buộc'
              ),
            h(ArtButtonTable, {
              type: 'delete',
              onClick: () => handleDelete(row)
            })
          ])
      }
    ]
  }
})

const handleSearch = () => {
  refreshData()

}

const operationDialogVisible = ref(false)
const operationType = ref<'deposit' | 'withdraw'>('deposit')

const openOperationDialog = (type: 'deposit' | 'withdraw') => {
  operationType.value = type
  operationDialogVisible.value = true
}

const handleSettle = (row: YebHolding) => {
  ElMessageBox.confirm('Xác nhận quyết toán bắt buộc vị thế này? Sau khi quyết toán sẽ dừng tính lợi nhuận và hoàn trả tiền gốc.', 'Thông báo', {
    type: 'warning',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy'
  }).then(async () => {
    try {
      await settleHolding(row.id)
      ElMessage.success('Quyết toán thành công')
      handleSearch()
    } catch (error) {
      console.error(error)
    }
  })
}

const handleDelete = (row: YebHolding) => {
  const statusText = row.status === 'running' ? 'Đang nhận lãi' : row.status === 'settled' ? 'Đã quyết toán' : 'Đã hủy'
  ElMessageBox.confirm(
    `Xác nhận xóa bản ghi vị thế này?\n\nMã đơn hàng: ${row.order_id}\nNgười dùng: ${row.username}\nSản phẩm: ${row.product_name}\nSố tiền: ${row.amount}\nTrạng thái: ${statusText}\n\nXóa sau không thể khôi phục!`,
    'Xác nhận xóa',
    {
      type: 'warning',
      confirmButtonText: 'Xác nhận xóa',
      cancelButtonText: 'Hủy',
      dangerouslyUseHTMLString: false
    }
  ).then(async () => {
    try {
      await deleteHolding(row.id)
      ElMessage.success('Xóa thành công')
      handleSearch()
    } catch (error) {
      console.error(error)
    }
  })
}

onMounted(() => {
  fetchStats()
})
</script>
