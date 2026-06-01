<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4" v-loading="loading">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>Phân tích cấu trúc chi phí</h4>
        <p>Tỷ lệ chi tiêu nền tảng</p>
      </div>
    </div>
    <template v-if="pieData && pieData.length > 0">
      <ArtRingChart
        height="calc(100% - 50px)"
        :data="pieData"
        :showLegend="true"
        :radius="['40%', '70%']"
        :center="['50%', '50%']"
      />
    </template>
    <ElEmpty v-else-if="!loading" description="Chưa có dữ liệu" :image-size="80" class="h-full flex-cc" />
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<{
    data?: { name: string; value: number }[]
    loading?: boolean
  }>(), {
    loading: false
  })

  const pieData = computed(() => {
    if (!props.data) return []
    const colors = [
      'var(--el-color-warning)',
      'var(--el-color-danger)',
      'var(--el-color-primary)',
      'var(--el-color-info)',
      'var(--el-color-success)'
    ]
    return props.data.map((item, index) => ({
      ...item,
      itemStyle: { color: colors[index % colors.length] }
    }))
  })
</script>
