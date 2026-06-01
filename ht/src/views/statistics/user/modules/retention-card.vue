<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4" v-loading="loading">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>Giữ chân người dùng</h4>
        <p>Tỷ lệ giữ chân ngày thứ 2/3/7</p>
      </div>
    </div>
    <div class="flex flex-col justify-center h-full pb-10 gap-8" v-if="retentionList && retentionList.length > 0">
      <div v-for="(item, index) in retentionList" :key="index" class="relative px-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-g-700">{{ item.label }}</span>
          <span class="font-bold text-xl">{{ item.value }}%</span>
        </div>
        <div class="h-3 bg-g-200 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-1000"
            :class="item.color"
            :style="{ width: item.value + '%' }"
          ></div>
        </div>
      </div>
    </div>
    <ElEmpty v-else-if="!loading" description="Chưa có dữ liệu" :image-size="80" class="h-full flex-cc" />
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<{
    data?: Api.Statistics.RetentionData | null
    loading?: boolean
  }>(), {
    loading: false
  })

  const retentionList = computed(() => {
    if (!props.data?.summary) return []
    const s = props.data.summary
    return [
      { label: 'Tỷ lệ giữ chân ngày thứ 2', value: s.avgDay1Rate, color: 'bg-primary' },
      { label: 'Tỷ lệ giữ chân ngày thứ 3', value: s.avgDay3Rate, color: 'bg-success' },
      { label: 'Tỷ lệ giữ chân ngày thứ 7', value: s.avgDay7Rate, color: 'bg-warning' }
    ]
  })
</script>
