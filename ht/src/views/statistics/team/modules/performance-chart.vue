<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>Xu hướng hiệu suất đội nhóm</h4>
        <p>So sánh nạp tiền và đặt cược đội nhóm 30 ngày gần đây</p>
      </div>
    </div>
    <ArtLineChart
      height="calc(100% - 50px)"
      :data="chartData"
      :xAxisData="xAxisData"
      :showLegend="true"
      :smooth="true"
      :showArea="true"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    data?: Api.Statistics.TrendData | null
  }>()

  const chartData = computed(() => {
    if (!props.data) return []
    return props.data.series
  })

  const xAxisData = computed(() => {
    if (!props.data) return []
    return props.data.xAxis
  })
</script>
