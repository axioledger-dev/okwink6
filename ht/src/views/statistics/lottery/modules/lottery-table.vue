<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4" v-loading="loading">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>Dữ liệu chi tiết</h4>
        <p>Chi tiết lãi lỗ đặt cược các loại xổ số</p>
      </div>
    </div>
    <div class="h-full overflow-hidden pb-8" v-if="tableData && tableData.length > 0">
      <ElTable :data="tableData" style="width: 100%" height="100%">
        <ElTableColumn prop="lotteryName" label="Tên loại xổ số" />
        <ElTableColumn prop="betCount" label="Số lượng cược" align="center" />
        <ElTableColumn prop="userCount" label="Số người cược" align="center" />
        <ElTableColumn prop="betAmount" label="Số tiền cược" align="right">
          <template #default="{ row }"> ¥{{ row.betAmount.toLocaleString() }} </template>
        </ElTableColumn>
        <ElTableColumn prop="prizeAmount" label="Số tiền trúng thưởng" align="right">
          <template #default="{ row }"> ¥{{ row.prizeAmount.toLocaleString() }} </template>
        </ElTableColumn>
        <ElTableColumn prop="profitAmount" label="Số tiền lãi lỗ" align="right">
          <template #default="{ row }">
            <span :class="row.profitAmount >= 0 ? 'text-success' : 'text-danger'">
              ¥{{ row.profitAmount.toLocaleString() }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="profitRate" label="Tỷ lệ lãi lỗ" align="right">
          <template #default="{ row }"> {{ row.profitRate }}% </template>
        </ElTableColumn>
      </ElTable>
    </div>
    <ElEmpty v-else-if="!loading" description="Chưa có dữ liệu" :image-size="80" class="h-full flex-cc" />
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<{
    data?: Api.Statistics.LotteryStats['list']
    loading?: boolean
  }>(), {
    loading: false
  })

  const tableData = computed(() => props.data || [])
</script>
