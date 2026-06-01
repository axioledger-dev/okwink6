<template>
  <div class="art-card h-100 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>Mục tiêu và thực tế</h4>
      </div>
    </div>

    <ArtBarChart
      class="p-5"
      height="12rem"
      :data="revenueData"
      :xAxisData="weekDays"
      :showAxisLine="false"
      barWidth="28%"
    />

    <div class="px-5 mt-4">
      <div v-for="item in totalItems" :key="item.label" class="flex-c mb-5 last:mb-0">
        <div class="flex-c justify-start w-3/5 text-sm">
          <div class="w-10 h-10 mr-3 text-lg rounded-md flex-cc" :class="item.iconClass">
            <ArtSvgIcon :icon="item.icon" />
          </div>

          <div class="flex flex-col items-start">
            <span class="text-base text-g-800">{{ item.label }}</span>
            <span class="mt-1 text-xs text-g-500">{{ item.subLabel }}</span>
          </div>
        </div>
        <div class="text-lg font-normal" :class="item.valueClass">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface RevenueDataItem {
    name: string
    data: number[]
  }

  const weekDays = ref(['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'])

  const revenueData = ref<RevenueDataItem[]>([
    {
      name: 'Bán hàng trực tuyến',
      data: [12, 13, 5, 15, 10, 15, 18]
    }
  ])

  const totalItems = [
    {
      icon: 'ri:shopping-bag-line',
      iconClass: 'text-theme bg-theme/12',
      label: 'Doanh số thực tế',
      subLabel: 'Toàn cầu',
      value: '8,823',
      valueClass: 'text-theme'
    },
    {
      icon: 'ri:money-dollar-circle-line',
      iconClass: 'text-theme bg-theme/12',
      label: 'Doanh số mục tiêu',
      subLabel: 'Thương mại',
      value: '12,122',
      valueClass: 'text-theme'
    }
  ]
</script>
