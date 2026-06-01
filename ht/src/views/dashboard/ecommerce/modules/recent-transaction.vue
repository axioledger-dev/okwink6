<template>
  <ArtTimelineListCard
    :list="timelineData"
    title="Giao dịch gần đây"
    subtitle="Động thái đơn hàng hôm nay"
    class="h-[27.8rem] mb-5 max-sm:mb-4"
  />
</template>

<script setup lang="ts">
  interface TimelineItem {
    time: string
    status: string
    content: string
    code?: string
  }

  const timelineData: TimelineItem[] = [
    {
      time: 'Sáng 09:30',
      status: 'rgb(73, 190, 255)',
      content: 'Nhận đơn hàng #38291 thanh toán ¥385.90'
    },
    {
      time: 'Sáng 10:00',
      status: 'rgb(54, 158, 255)',
      content: 'Sản phẩm mới lên kệ',
      code: 'SKU-3467'
    },
    {
      time: 'Sáng 12:00',
      status: 'rgb(103, 232, 207)',
      content: 'Thanh toán cho nhà cung cấp ¥6495.00'
    },
    {
      time: 'Chiều 14:30',
      status: 'rgb(255, 193, 7)',
      content: 'Hoạt động khuyến mãi bắt đầu',
      code: 'PROMO-2023'
    },
    {
      time: 'Chiều 15:45',
      status: 'rgb(255, 105, 105)',
      content: 'Nhắc nhở hủy đơn hàng',
      code: 'ORD-9876'
    },
    {
      time: 'Chiều 17:00',
      status: 'rgb(103, 232, 207)',
      content: 'Hoàn thành báo cáo bán hàng ngày'
    }
  ]
</script>
