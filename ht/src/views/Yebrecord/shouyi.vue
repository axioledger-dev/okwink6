
<template>
  <div class="yeb-record-page art-full-height">
    <ElCard class="art-table-card" shadow="never">
      
      <div v-if="stats" class="mb-4 p-4 bg-hover-color rounded border-full-d flex gap-8 text-sm">
        <div>
          <span class="text-g-500">Lợi nhuận tích lũy:</span>
          <span class="font-bold text-lg text-success">+{{ stats.total_interest || 0 }}</span>
        </div>
        <div>
          <span class="text-g-500">Hôm nay nạp vào:</span>
          <span class="font-bold text-lg">{{ stats.today_deposit || 0 }}</span>
        </div>
        <div>
          <span class="text-g-500">Hôm nay rút ra:</span>
          <span class="font-bold text-lg">{{ stats.today_withdraw || 0 }}</span>
        </div>
        <div>
          <span class="text-g-500">Hôm nay lợi nhuận:</span>
          <span class="font-bold text-lg text-warning">{{ stats.today_interest || 0 }}</span>
        </div>
        <div>
          <span class="text-g-500">Số tiền đang chạy:</span>
          <span class="font-bold text-lg">{{ stats.running_amount || 0 }}</span>
        </div>
      </div>

      
      <ArtTableHeader
        v-model:columns="columnChecks"
        :loading="loading"
        @refresh="refreshData"
        @search="handleSearch"
      >
        <template #search>
          <ElInput
            v-model="searchParams.username"
            placeholder="Tên người dùng"
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
            <ElOption label="Nạp vào" value="deposit" />
            <ElOption label="Rút ra" value="withdraw" />
            <ElOption label="Phát lợi nhuận" value="interest" />
            <ElOption label="Nhận lợi nhuận" value="claim" />
            <ElOption label="Quyết toán định kỳ" value="settle" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElTag, ElInput, ElSelect, ElOption } from 'element-plus'
import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
import { useTable } from '@/hooks/core/useTable'
import {
  fetchRecordList,
  fetchOverview,
  deleteRecord,
  type YebRecord,
  type YebRecordSearchParams
} from '@/api/yebao'

defineOptions({ name: 'YebRecord' })

const searchParams = reactive<YebRecordSearchParams>({
  username: '',
  type: undefined
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
    apiFn: fetchRecordList,
    apiParams: searchParams,
    columnsFactory: () => [
      { prop: 'id', label: 'ID', width: 80, sortable: true, align: 'center' },
      { prop: 'username', label: 'Tên người dùng', width: 120, align: 'center' },
      {
        prop: 'type_text',
        label: 'Loại',
        width: 100,
        align: 'center',
        formatter: (row: any) => {

          const val = row.type_text || row.type
          const map: Record<string, { type: string; label: string }> = {
            deposit: { type: 'primary', label: 'Nạp vào' },
            withdraw: { type: 'warning', label: 'Rút ra' },
            interest: { type: 'success', label: 'Lợi nhuận' },
            income: { type: 'success', label: 'Lợi nhuận' },
            claim: { type: 'success', label: 'Nhận' },
            settle: { type: 'info', label: 'Quyết toán' },
            'Nạp vào': { type: 'primary', label: 'Nạp vào' },
            'Rút ra': { type: 'warning', label: 'Rút ra' },
            'Phát lợi nhuận': { type: 'success', label: 'Lợi nhuận' },
            'Nhận lợi nhuận': { type: 'success', label: 'Nhận' },
            'Quyết toán định kỳ': { type: 'info', label: 'Quyết toán' }
          }
          const item = map[val] || { type: 'primary', label: val }
          return h(ElTag, { type: item.type as any }, () => item.label)
        }
      },
      { prop: 'amount', label: 'Số tiền biến động', width: 120, align: 'center' },
      { prop: 'before_yebao', label: 'Trước biến động', width: 120, align: 'center' },
      { prop: 'after_yebao', label: 'Sau biến động', width: 120, align: 'center' },
      { prop: 'createtime_text', label: 'Thời gian', width: 180, align: 'center' },
      { prop: 'remark', label: 'Ghi chú', minWidth: 200, align: 'center' },
      {
        prop: 'operation',
        label: 'Thao tác',
        width: 100,
        fixed: 'right',
        align: 'center',
        formatter: (row: YebRecord) =>
          h('div', [
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

const handleDelete = (row: YebRecord) => {
  ElMessageBox.confirm('Xác nhận xóa bản ghi này?', 'Thông báo', {
    type: 'warning',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy'
  }).then(async () => {
    try {
      await deleteRecord(row.id)
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
