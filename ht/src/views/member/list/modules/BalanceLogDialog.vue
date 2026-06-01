<template>
  <ElDialog
    v-model="visible"
    title="Lịch sử biến động tài khoản"
    width="1200px"
    class="art-custom-dialog"
  >
    <div class="h-[500px]">
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      />
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTable } from '@/hooks/core/useTable'
import { fetchBalanceLog } from '@/api/member'

const props = withDefaults(defineProps<{
  modelValue: boolean
  memberId: number
}>(), {
  memberId: 0
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const {
  columns,
  data,
  loading,
  pagination,
  getData,
  handleSizeChange,
  handleCurrentChange
} = useTable({
  core: {
    apiFn: fetchBalanceLog,
    apiParams: {
      uid: props.memberId
    },
    immediate: false,
    columnsFactory: () => [
      { prop: 'id', label: 'ID', width: 70, align: 'center' },
      { prop: 'trano', label: 'Mã đơn', width: 140, align: 'center' },
      { prop: 'username', label: 'Tên người dùng', width: 100, align: 'center' },
      { prop: 'typename', label: 'Loại', width: 100, align: 'center' },
      { prop: 'amount', label: 'Số tiền', width: 100, align: 'center',
        formatter: (row: any) => {
          const amount = parseFloat(row.amount || 0)
          return amount.toFixed(2)
        }
      },
      { prop: 'amountbefor', label: 'Trước biến động', width: 100, align: 'center',
        formatter: (row: any) => parseFloat(row.amountbefor || 0).toFixed(2)
      },
      { prop: 'amountafter', label: 'Sau biến động', width: 100, align: 'center',
        formatter: (row: any) => parseFloat(row.amountafter || 0).toFixed(2)
      },
      { prop: 'remark', label: 'Ghi chú', minWidth: 180, align: 'center' },
      { prop: 'oddtime_text', label: 'Thời gian', width: 150, align: 'center' }
    ]
  }
})

watch(
  () => props.modelValue,
  (val) => {
    if (val && props.memberId) {

        getData({ uid: props.memberId })
    }
  }
)
</script>
