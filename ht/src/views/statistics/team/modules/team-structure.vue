<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>Phân bố cấp bậc đại lý</h4>
        <p>Tỷ lệ số lượng đại lý các cấp</p>
      </div>
    </div>
    <ArtRingChart
      height="calc(100% - 50px)"
      :data="pieData"
      :showLegend="true"
      :radius="['20%', '80%']"
      :center="['50%', '50%']"
      roseType="area"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    data?: { name: string; value: number }[]
  }>()

  const pieData = computed(() => props.data || [])
</script>
