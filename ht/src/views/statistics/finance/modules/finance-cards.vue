<template>
  <ElRow :gutter="20" class="flex flex-wrap">
    <ElCol v-for="(item, index) in statList" :key="index" :sm="12" :md="8" :lg="4">
      <div class="art-card relative flex flex-col justify-center h-32 px-5 mb-5 max-sm:mb-4">
        <span class="text-g-600 text-sm">{{ item.label }}</span>
        <div class="flex items-baseline mt-2">
          <span v-if="item.prefix" class="text-lg text-g-700 mr-1">{{ item.prefix }}</span>
          <ArtCountTo
            class="text-2xl font-bold"
            :target="item.value"
            :duration="1500"
            :separator="item.separator"
          />
          <span v-if="item.suffix" class="text-sm text-g-600 ml-1">{{ item.suffix }}</span>
        </div>
        <div class="flex items-center mt-2" v-if="item.change !== undefined">
          <span class="text-xs text-g-500">So với kỳ trước</span>
          <span
            class="ml-1 text-xs font-semibold"
            :class="item.change >= 0 ? 'text-success' : 'text-danger'"
          >
            {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
          </span>
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
    data?: Api.Statistics.FinanceStats | null
    loading?: boolean
  }>()

  interface StatItem {
    label: string
    value: number
    prefix?: string
    suffix?: string
    separator?: string
    change?: number
    icon: string
    iconBg: string
    iconClass: string
  }

  const statList = computed<StatItem[]>(() => {
    if (!props.data || !props.data.recharge || !props.data.withdraw) return []
    const cards = props.data.recharge
    const withdraw = props.data.withdraw

    return [
      {
        label: 'Tổng số tiền nạp',
        value: cards.totalAmount,
        prefix: '¥',
        separator: ',',
        change: 15.3,
        icon: 'ri:wallet-3-line',
        iconBg: 'bg-primary/10',
        iconClass: 'text-primary'
      },
      {
        label: 'Số lượng nạp tiền',
        value: cards.totalCount,
        separator: ',',
        change: 12.5,
        icon: 'ri:file-list-3-line',
        iconBg: 'bg-success/10',
        iconClass: 'text-success'
      },
      {
        label: 'Tổng số tiền rút',
        value: withdraw.totalAmount,
        prefix: '¥',
        separator: ',',
        change: -5.2,
        icon: 'ri:bank-card-line',
        iconBg: 'bg-warning/10',
        iconClass: 'text-warning'
      },
      {
        label: 'Số lượng rút tiền',
        value: withdraw.totalCount,
        separator: ',',
        change: -2.3,
        icon: 'ri:file-shred-line',
        iconBg: 'bg-info/10',
        iconClass: 'text-info'
      },
      {
        label: 'Số tiền chờ duyệt',
        value: withdraw.pendingAmount,
        prefix: '¥',
        separator: ',',
        change: 8.6,
        icon: 'ri:time-line',
        iconBg: 'bg-purple-500/10',
        iconClass: 'text-purple-500'
      },
      {
        label: 'Chênh lệch nạp rút',
        value: cards.totalAmount - withdraw.totalAmount,
        prefix: '¥',
        separator: ',',
        change: 22.5,
        icon: 'ri:exchange-line',
        iconBg: 'bg-danger/10',
        iconClass: 'text-danger'
      }
    ]
  })
</script>
