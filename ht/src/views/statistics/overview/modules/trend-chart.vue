<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4" v-loading="loading">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>Xu hướng nạp rút</h4>
        <p>Dữ liệu {{ timeRange }} ngày gần đây</p>
      </div>
      <ElRadioGroup v-model="timeRange" size="small">
        <ElRadioButton value="7">7 ngày</ElRadioButton>
        <ElRadioButton value="30">30 ngày</ElRadioButton>
      </ElRadioGroup>
    </div>
    <template v-if="chartData && chartData.length > 0">
      <ArtLineChart
        height="calc(100% - 50px)"
        :data="chartData"
        :xAxisData="xAxisData"
        :showLegend="true"
        :smooth="true"
        :showArea="true"
      />
    </template>
    <ElEmpty v-else-if="!loading" description="Chưa có dữ liệu" :image-size="80" class="h-full flex-cc" />
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<{
    data?: Api.Statistics.TrendData | null
    loading?: boolean
  }>(), {
    loading: false
  })

  const emit = defineEmits(['update:days'])

  const timeRange = ref('7')

  const chartData = computed(() => {
    if (!props.data || !props.data.series) return []
    return props.data.series
  })

  const xAxisData = computed(() => {
    if (!props.data) return []
    return props.data.xAxis
  })

  watch(timeRange, (val) => {
    emit('update:days', Number(val))
  })
</script>
