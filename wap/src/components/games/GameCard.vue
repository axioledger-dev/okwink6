<template>
  <div class="game-card" @click="handleClick">
    <div class="game-card__image-wrapper">
      <van-image
        :src="game.image_url"
        :alt="game.game_name"
        fit="cover"
        lazy-load
        :show-loading="true"
        class="game-card__image"
      >
        <template #loading>
          <van-loading type="spinner" size="20" />
        </template>
        <template #error>
          <div class="game-card__error">
            <van-icon name="photo-fail" size="24" />
          </div>
        </template>
      </van-image>
      
      <!-- Badges -->
      <div class="game-card__badges">
        <span v-if="game.is_hot" class="badge badge--hot">🔥 HOT</span>
        <span v-if="game.is_new" class="badge badge--new">✨ NEW</span>
      </div>
      
      <!-- Favorite Button -->
      <button
        v-if="showFavorite"
        class="game-card__favorite"
        @click.stop="handleFavoriteToggle"
      >
        <van-icon
          :name="isFavorite ? 'star' : 'star-o'"
          :color="isFavorite ? '#FFD700' : '#fff'"
          size="20"
        />
      </button>
    </div>
    
    <div class="game-card__content">
      <h3 class="game-card__title">{{ game.game_name }}</h3>
      <div class="game-card__meta">
        <span class="game-card__provider">{{ game.provider }}</span>
        <span v-if="showPlayCount && game.play_count" class="game-card__plays">
          <van-icon name="play-circle-o" size="12" />
          {{ formatPlayCount(game.play_count) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Image as VanImage, Loading, Icon } from 'vant'

const props = defineProps({
  game: {
    type: Object,
    required: true
  },
  showFavorite: {
    type: Boolean,
    default: false
  },
  showPlayCount: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'favorite-toggle'])

const isFavorite = ref(props.game.is_favorite || false)

const handleClick = () => {
  emit('click', props.game)
}

const handleFavoriteToggle = () => {
  isFavorite.value = !isFavorite.value
  emit('favorite-toggle', {
    gameId: props.game.game_id,
    isFavorite: isFavorite.value
  })
}

const formatPlayCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}
</script>

<style scoped lang="scss">
.game-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(-2px);
  }

  &__image-wrapper {
    position: relative;
    width: 100%;
    padding-top: 133.33%; /* 3:4 aspect ratio */
    overflow: hidden;
    background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__error {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #666;
  }

  &__badges {
    position: absolute;
    top: 8px;
    left: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 2;
  }

  .badge {
    display: inline-block;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: bold;
    border-radius: 4px;
    text-transform: uppercase;
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    &--hot {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
      color: #fff;
    }

    &--new {
      background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
      color: #fff;
    }
  }

  &__favorite {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 2;

    &:hover {
      background: rgba(0, 0, 0, 0.7);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &__content {
    padding: 12px;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 6px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #999;
  }

  &__provider {
    font-weight: 500;
    color: #00d4ff;
  }

  &__plays {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #999;
  }
}

/* Mobile optimization */
@media (max-width: 360px) {
  .game-card {
    &__title {
      font-size: 13px;
    }

    &__meta {
      font-size: 11px;
    }

    .badge {
      font-size: 9px;
      padding: 2px 6px;
    }
  }
}
</style>