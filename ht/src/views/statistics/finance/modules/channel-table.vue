<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>Thống kê kênh</h4>
        <p>Dữ liệu nạp tiền các kênh thanh toán</p>
      </div>
    </div>
    <div class="h-full overflow-hidden pb-8">
      <ElTable :data="tableData" style="width: 100%" height="100%">
        <ElTableColumn prop="name" label="Tên kênh" show-overflow-tooltip />
        <ElTableColumn prop="count" label="Số lượng nạp tiền" align="center" />
        <ElTableColumn prop="amount" label="Số tiền nạp tiền" align="right">
          <template #default="{ row }"> ¥{{ row.amount.toLocaleString() }} </template>
        </ElTableColumn>
        <ElTableColumn prop="rate" label="Tỷ lệ thành công" align="right">
          <template #default="{ row }">
            <span :class="row.rate >= 90 ? 'text-success' : 'text-warning'"> {{ row.rate }}% </span>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    data?: Api.Statistics.FinanceStats | null
    loading?: boolean
  }>()

  const tableData = computed(() => {
    if (!props.data) return []

    return props.data.channels.map(item => ({
      ...item,
      rate: item.successRate
    }))
  })
</script>
