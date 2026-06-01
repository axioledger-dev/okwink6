<template>
  <div v-if="winners.length > 0" class="win-ticker">
    <div class="win-ticker__header">
      <van-icon name="trophy-o" size="20" color="#FFD700" />
      <span class="win-ticker__title">Chiến thắng gần đây</span>
    </div>
    
    <div class="win-ticker__content">
      <van-swipe
        :autoplay="scrollInterval"
        :show-indicators="false"
        vertical
        :touchable="false"
        class="win-ticker__swipe"
      >
        <van-swipe-item
          v-for="winner in displayWinners"
          :key="winner.log_id"
          class="win-ticker__item"
        >
          <div class="win-ticker__user">
            <van-icon name="user-circle-o" size="16" />
            <span class="win-ticker__username">{{ winner.username_masked }}</span>
          </div>
          <div class="win-ticker__game">{{ winner.game_name }}</div>
          <div class="win-ticker__amount">
            <span class="win-ticker__currency">₫</span>
            <span class="win-ticker__value">{{ formatAmount(winner.amount) }}</span>
          </div>
          <div v-if="winner.multiplier" class="win-ticker__multiplier">
            {{ winner.multiplier.toFixed(2) }}x
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Swipe, SwipeItem, Icon } from 'vant'
import { gamesApi } from '@/api/games'

const props = defineProps({
  autoFetch: {
    type: Boolean,
    default: true
  },
  refreshInterval: {
    type: Number,
    default: 5000 // 5 seconds
  },
  scrollInterval: {
    type: Number,
    default: 3000 // 3 seconds per winner
  },
  maxDisplay: {
    type: Number,
    default: 50
  }
})

const winners = ref([])
let refreshTimer = null

const displayWinners = computed(() => {
  return winners.value.slice(0, props.maxDisplay)
})

const fetchWinners = async () => {
  try {
    const response = await gamesApi.getLiveWinners({ limit: props.maxDisplay })
    if (response.code === 0 && response.data) {
      winners.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch live winners:', error)
  }
}

const formatAmount = (amount) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(2) + 'M'
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(2) + 'K'
  }
  return amount.toFixed(2)
}

onMounted(() => {
  if (props.autoFetch) {
    fetchWinners()
    
    // Set up periodic refresh
    if (props.refreshInterval > 0) {
      refreshTimer = setInterval(fetchWinners, props.refreshInterval)
    }
  }
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})

// Expose method for manual refresh
defineExpose({
  refresh: fetchWinners
})
</script>

<style scoped lang="scss">
.win-ticker {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  margin-bottom: 16px;

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }

  &__content {
    overflow: hidden;
  }

  &__swipe {
    height: 40px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 40px;
    padding: 8px 0;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 100px;
    color: #999;
  }

  &__username {
    font-size: 13px;
    font-weight: 500;
  }

  &__game {
    flex: 1;
    font-size: 13px;
    color: #00d4ff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__amount {
    display: flex;
    align-items: baseline;
    gap: 2px;
    font-weight: 600;
    color: #FFD700;
  }

  &__currency {
    font-size: 12px;
  }

  &__value {
    font-size: 16px;
  }

  &__multiplier {
    min-width: 50px;
    text-align: right;
    font-size: 12px;
    font-weight: 600;
    color: #4ecdc4;
    background: rgba(78, 205, 196, 0.1);
    padding: 2px 8px;
    border-radius: 4px;
  }
}

/* Tablet and larger */
@media (min-width: 768px) {
  .win-ticker {
    &__swipe {
      height: 48px;
    }

    &__item {
      height: 48px;
      gap: 16px;
    }

    &__user {
      min-width: 120px;
    }

    &__username {
      font-size: 14px;
    }

    &__game {
      font-size: 14px;
    }

    &__value {
      font-size: 18px;
    }
  }
}

/* Mobile optimization */
@media (max-width: 360px) {
  .win-ticker {
    padding: 12px;

    &__header {
      margin-bottom: 8px;
      padding-bottom: 8px;
    }

    &__title {
      font-size: 14px;
    }

    &__item {
      gap: 8px;
    }

    &__user {
      min-width: 80px;
    }

    &__username {
      font-size: 12px;
    }

    &__game {
      font-size: 12px;
    }

    &__value {
      font-size: 14px;
    }

    &__multiplier {
      min-width: 45px;
      font-size: 11px;
      padding: 2px 6px;
    }
  }
}
</style>