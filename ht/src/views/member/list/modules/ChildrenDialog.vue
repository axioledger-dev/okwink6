<template>
  <ElDialog
    v-model="visible"
    title="Thành viên cấp dưới"
    width="900px"
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
import { ref, computed, watch, h } from 'vue'
import { useTable } from '@/hooks/core/useTable'
import { fetchChildren, Member } from '@/api/member'
import { ElTag } from 'element-plus'

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
    apiFn: fetchChildren,
    apiParams: {
      parentid: props.memberId
    },
    immediate: false,
    columnsFactory: () => [
      { prop: 'id', label: 'ID', width: 80, align: 'center' },
      {
        prop: 'username',
        label: 'Tên người dùng',
        align: 'center',
        width: 120
      },
      { prop: 'userbankname', label: 'Họ tên', width: 100, align: 'center' },
      {
        prop: 'proxy_text',
        label: 'Loại',
        width: 80,
        align: 'center',
        formatter: (row: Member) => h(ElTag, { type: 'info' }, () => row.proxy_text)
      },
      { prop: 'balance', label: 'Số dư', width: 120, align: 'center',
        formatter: (row: Member) => Number(row.balance || 0).toFixed(3)
      },
      { prop: 'point', label: 'Tích lũy', width: 100, align: 'center' },
      { prop: 'xima', label: 'Số dư hoàn mã', width: 120, align: 'center',
        formatter: (row: Member) => Number(row.xima || 0).toFixed(3)
      },
      { prop: 'logintime_text', label: 'Thời gian đăng nhập', width: 160, align: 'center' },
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
      }
    ]
  }
})

watch(
  () => props.modelValue,
  (val) => {
    if (val && props.memberId) {
      getData({ parentid: props.memberId })
    }
  }
)
</script>
