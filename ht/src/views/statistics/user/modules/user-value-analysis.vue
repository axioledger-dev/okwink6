<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4" v-loading="loading">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>Phân tầng giá trị người dùng</h4>
        <p>Phân tích phân bố người dùng theo mô hình RFM</p>
      </div>
    </div>
    <template v-if="chartData && chartData.length > 0">
      <ArtBarChart
        height="calc(100% - 50px)"
        :data="chartData"
        :xAxisData="xAxisData"
        :showLegend="true"
        :showAxisLine="false"
        barWidth="45%"
      />
    </template>
    <ElEmpty v-else-if="!loading" description="Chưa có dữ liệu" :image-size="80" class="h-full flex-cc" />
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<{
    data?: Api.Statistics.ValueAnalysisData | null
    loading?: boolean
  }>(), {
    loading: false
  })

  const chartData = computed(() => {
    if (!props.data?.segments) return []
    return [{
      name: 'Số người dùng',
      data: props.data.segments.map(item => item.value),
      itemStyle: {
        color: (params: any) => {
          const colors = [
            'var(--el-color-danger)',
            'var(--el-color-success)',
            'var(--el-color-primary)',
            'var(--el-color-warning)',
            'var(--el-color-info)'
          ]
          return colors[params.dataIndex % colors.length]
        }
      }
    }]
  })

  const xAxisData = computed(() => {
    if (!props.data?.segments) return []
    return props.data.segments.map(item => item.name)
  })
</script>
