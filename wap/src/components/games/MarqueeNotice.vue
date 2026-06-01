<template>
  <div v-if="announcements.length > 0" class="marquee-notice">
    <div class="marquee-notice__icon">
      <van-icon name="volume-o" size="18" color="#FFD700" />
    </div>
    <div class="marquee-notice__content">
      <van-swipe
        :autoplay="scrollInterval"
        :show-indicators="false"
        vertical
        :touchable="false"
        class="marquee-notice__swipe"
      >
        <van-swipe-item
          v-for="announcement in announcements"
          :key="announcement.announcement_id"
          class="marquee-notice__item"
        >
          <span class="marquee-notice__text">{{ announcement.content }}</span>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Swipe, SwipeItem, Icon } from 'vant'
import { gamesApi } from '@/api/games'

const props = defineProps({
  autoFetch: {
    type: Boolean,
    default: true
  },
  refreshInterval: {
    type: Number,
    default: 60000 // 60 seconds
  },
  scrollInterval: {
    type: Number,
    default: 3000 // 3 seconds per announcement
  }
})

const announcements = ref([])
let refreshTimer = null

const fetchAnnouncements = async () => {
  try {
    const response = await gamesApi.getAnnouncements({ limit: 10 })
    if (response.code === 0 && response.data) {
      announcements.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch announcements:', error)
  }
}

onMounted(() => {
  if (props.autoFetch) {
    fetchAnnouncements()
    
    // Set up periodic refresh
    if (props.refreshInterval > 0) {
      refreshTimer = setInterval(fetchAnnouncements, props.refreshInterval)
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
  refresh: fetchAnnouncements
})
</script>

<style scoped lang="scss">
.marquee-notice {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 16px;

  &__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 215, 0, 0.1);
    border-radius: 50%;
  }

  &__content {
    flex: 1;
    overflow: hidden;
  }

  &__swipe {
    height: 20px;
  }

  &__item {
    display: flex;
    align-items: center;
    height: 20px;
  }

  &__text {
    font-size: 14px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
  }
}

/* Mobile optimization */
@media (max-width: 360px) {
  .marquee-notice {
    padding: 10px 12px;
    gap: 8px;

    &__icon {
      width: 28px;
      height: 28px;
    }

    &__text {
      font-size: 13px;
    }
  }
}
</style>