<template>
  <ArtDataListCard
    class="mb-5 max-sm:mb-4"
    :maxCount="4"
    :list="dataList"
    title="Hoạt động gần đây"
    subtitle="Trạng thái xử lý đơn hàng"
    :showMoreButton="true"
    @more="handleMore"
  />
</template>

<script setup lang="ts">
  interface TransactionItem {
    title: string
    status: string
    time: string
    class: string
    icon: string
  }

  const dataList: TransactionItem[] = [
    {
      title: 'Đơn hàng mới #38291',
      status: 'Chờ xử lý',
      time: '5phút',
      class: 'bg-theme/12 text-theme',
      icon: 'ri:shopping-bag-4-line'
    },
    {
      title: 'Yêu cầu hoàn tiền #12845',
      status: 'Đang xử lý',
      time: '10phút',
      class: 'bg-secondary/12 text-secondary',
      icon: 'ri:profile-line'
    },
    {
      title: 'Xử lý khiếu nại khách hàng',
      status: 'Chờ xử lý',
      time: '15phút',
      class: 'bg-warning/12 text-warning',
      icon: 'ri:customer-service-2-line'
    },
    {
      title: 'Nhắc nhở tồn kho không đủ',
      status: 'Khẩn cấp',
      time: '20phút',
      class: 'bg-danger/12 text-danger',
      icon: 'ri:box-1-line'
    },
    {
      title: 'Đơn hàng #29384 đã giao',
      status: 'Đã hoàn tất',
      time: '20phút',
      class: 'bg-success/12 text-success',
      icon: 'ri:shopping-bag-3-line'
    }
  ]

  const handleMore = (): void => {

  }
</script>
