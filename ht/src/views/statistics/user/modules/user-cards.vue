<template>
  <ElRow :gutter="20" class="flex flex-wrap">
    <ElCol v-for="(item, index) in statList" :key="index" :sm="12" :md="8" :lg="4">
      <div class="art-card relative flex flex-col justify-center h-32 px-5 mb-5 max-sm:mb-4">
        <span class="text-g-600 text-sm">{{ item.label }}</span>
        <div class="flex items-baseline mt-2">
          <ArtCountTo
            class="text-2xl font-bold"
            :target="item.value"
            :duration="1500"
            separator=","
          />
          <span class="text-sm text-g-600 ml-1">người</span>
        </div>
        <div class="flex items-center mt-2" v-if="item.change !== undefined">
          <span class="text-xs text-g-500">Hôm nay</span>
          <span class="ml-1 text-xs font-semibold text-success"> +{{ item.change }} </span>
        </div>
        <div
          class="absolute top-0 bottom-0 right-4 m-auto size-11 rounded-xl flex-cc"
          :class="item.iconBg"
        >
          <ArtSvgIcon :icon="item.icon" class="text-lg" :class="item.iconClass" />
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
  const props = defineProps<{
    data?: Api.Statistics.UserStats | null
    loading?: boolean
  }>()

  interface StatItem {
    label: string
    value: number
    change?: number
    icon: string
    iconBg: string
    iconClass: string
  }

  const statList = computed<StatItem[]>(() => {
    if (!props.data?.summary) return []
    const s = props.data.summary

    return [
      {
        label: 'Tổng số người dùng',
        value: s.totalUsers,
        icon: 'ri:group-line',
        iconBg: 'bg-primary/10',
        iconClass: 'text-primary'
      },
      {
        label: 'Người dùng hoạt động',
        value: s.activeUsers,
        icon: 'ri:user-star-line',
        iconBg: 'bg-success/10',
        iconClass: 'text-success'
      },
      {
        label: 'Người dùng nạp tiền',
        value: s.rechargeUsers,
        icon: 'ri:wallet-3-line',
        iconBg: 'bg-warning/10',
        iconClass: 'text-warning'
      },
      {
        label: 'Người dùng đặt cược',
        value: s.betUsers,
        icon: 'ri:game-line',
        iconBg: 'bg-info/10',
        iconClass: 'text-info'
      },
      {
        label: 'Người dùng nạp lần đầu',
        value: s.firstRechargeUsers,
        icon: 'ri:vip-crown-line',
        iconBg: 'bg-purple-500/10',
        iconClass: 'text-purple-500'
      },
      {
        label: 'Thêm người dùng',
        value: s.newUsers,
        icon: 'ri:user-add-line',
        iconBg: 'bg-danger/10',
        iconClass: 'text-danger'
      }
    ]
  })
</script>
