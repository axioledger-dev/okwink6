<template>
  <div class="art-card h-105 p-4 box-border mb-5 max-sm:mb-4">
    <ArtBarChart
      class="box-border p-2"
      barWidth="50%"
      height="13.7rem"
      :showAxisLine="false"
      :data="chartData"
      :xAxisData="xAxisLabels"
    />
    <div class="ml-1">
      <h3 class="mt-5 text-lg font-medium">Tổng quan người dùng</h3>
      <p class="mt-1 text-sm">So với tuần trước <span class="text-success font-medium">+23%</span></p>
      <p class="mt-1 text-sm">Chúng tôi đã tạo nhiều tùy chọn cho bạn, có thể kết hợp chúng lại và tùy chỉnh thành các trang hoàn hảo</p>
    </div>
    <div class="flex-b mt-2">
      <div class="flex-1" v-for="(item, index) in list" :key="index">
        <p class="text-2xl text-g-900">{{ item.num }}</p>
        <p class="text-xs text-g-500">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface UserStatItem {
    name: string
    num: string
  }

  const xAxisLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9']

  const chartData = [160, 100, 150, 80, 190, 100, 175, 120, 160]

  const list: UserStatItem[] = [
    { name: 'Tổng người dùng', num: '32k' },
    { name: 'Tổng lượt truy cập', num: '128k' },
    { name: 'Lượt truy cập/ngày', num: '1.2k' },
    { name: 'So sánh tuần', num: '+5%' }
  ]
</script>
