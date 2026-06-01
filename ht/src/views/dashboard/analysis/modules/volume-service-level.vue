<template>
  <div class="art-card h-82 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>Khối lượng công việc và mức độ dịch vụ</h4>
      </div>
    </div>

    <ArtBarChart
      class="mt-6"
      height="14.3rem"
      :data="volumeServiceData"
      :xAxisData="serviceCategories"
      :showLegend="true"
      :showAxisLine="false"
      :stack="true"
      barWidth="22%"
    />
  </div>
</template>

<script setup lang="ts">
  interface VolumeServiceDataItem {
    name: string
    data: number[]
    stack: string
  }

  const serviceCategories = ref(['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm D', 'Sản phẩm E'])

  const volumeServiceData = ref<VolumeServiceDataItem[]>([
    {
      name: 'Khối lượng công việc',
      data: [20, 25, 30, 35, 40],
      stack: 'total'
    },
    {
      name: 'Khối lượng dịch vụ',
      data: [30, 35, 40, 45, 50],
      stack: 'total'
    }
  ])
</script>
