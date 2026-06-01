<template>
  <ElDialog v-model="visible" title="Chi tiết" width="600px">
    <ElDescriptions :column="1" border>
      <ElDescriptionsItem label="Mã đơn">{{ detail.trano }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Tên người dùng">{{ detail.username }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Loại xổ số">{{ detail.cptitle }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Kỳ số">{{ detail.expect }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Cách chơi">{{ detail.playtitle }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Số">
        <div class="break-all">{{ detail.tzcode }}</div>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Số tiền">{{ detail.amount }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Số tiền trúng thưởng">{{ detail.okamount }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Trạng thái">
        <span :style="{ color: getStatusColor(detail.status_raw) }">{{ detail.status }}</span>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Thời gian đặt cược">{{ detail.oddtime }}</ElDescriptionsItem>
      
    </ElDescriptions>
    <template #footer>
      <ElButton @click="visible = false">Đóng</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HeMaiItem } from '@/api/robot-hemai'
import { ElDialog, ElDescriptions, ElDescriptionsItem, ElButton } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  detail: HeMaiItem
}>()

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const getStatusColor = (status: number) => {
  if (status === 1) return 'green'
  if (status === -1) return 'red'
  if (status === -2) return '#666'
  return '#333'
}
</script>

<style scoped>
.break-all {
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
