<template>
  <div class="games-home">
    <!-- Header -->
    <van-nav-bar
      title="Trò Chơi"
      left-arrow
      @click-left="onClickLeft"
      class="games-home__navbar"
    />

    <!-- Marquee Notice -->
    <MarqueeNotice :auto-fetch="true" :refresh-interval="60000" />

    <!-- Win Ticker -->
    <WinTicker
      :auto-fetch="true"
      :refresh-interval="5000"
      :scroll-interval="3000"
      :max-display="50"
    />

    <!-- Category Tabs -->
    <van-tabs
      v-model:active="activeCategory"
      @change="onCategoryChange"
      sticky
      :offset-top="46"
      class="games-home__tabs"
    >
      <van-tab
        v-for="category in categories"
        :key="category.category_id"
        :title="category.category_name_vi || category.category_name"
        :name="category.category_id"
      />
    </van-tabs>

    <!-- Search Bar -->
    <div class="games-home__search">
      <van-search
        v-model="searchKeyword"
        placeholder="Tìm kiếm trò chơi..."
        @search="onSearch"
        @clear="onSearchClear"
      />
    </div>

    <!-- Games Grid -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="Không còn trò chơi nào"
        @load="onLoad"
        class="games-home__list"
      >
        <div class="games-grid">
          <GameCard
            v-for="game in games"
            :key="game.game_id"
            :game="game"
            :show-favorite="isLoggedIn"
            :show-play-count="true"
            @click="handleGameClick"
            @favorite-toggle="handleFavoriteToggle"
          />
        </div>

        <!-- Empty State -->
        <van-empty
          v-if="!loading && games.length === 0"
          description="Không tìm thấy trò chơi"
          image="search"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NavBar, Tabs, Tab, Search, PullRefresh, List, Empty, Toast } from 'vant'
import GameCard from '@/components/games/GameCard.vue'
import MarqueeNotice from '@/components/games/MarqueeNotice.vue'
import WinTicker from '@/components/games/WinTicker.vue'
import { gamesApi } from '@/api/games'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// State
const categories = ref([])
const activeCategory = ref('HOT')
const games = ref([])
const searchKeyword = ref('')
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)
const currentPage = ref(1)
const pageSize = ref(30)

// Computed
const isLoggedIn = computed(() => userStore.isLoggedIn)

// Methods
const fetchCategories = async () => {
  try {
    const response = await gamesApi.getCategories()
    if (response.code === 0 && response.data) {
      categories.value = response.data
      if (categories.value.length > 0) {
        activeCategory.value = categories.value[0].category_id
      }
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    Toast.fail('Không thể tải danh mục')
  }
}

const fetchGames = async (page = 1, append = false) => {
  try {
    loading.value = true
    
    const params = {
      category: activeCategory.value,
      page,
      limit: pageSize.value
    }

    if (searchKeyword.value) {
      const response = await gamesApi.searchGames({
        keyword: searchKeyword.value,
        page,
        limit: pageSize.value
      })
      
      if (response.code === 0 && response.data) {
        if (append) {
          games.value = [...games.value, ...response.data]
        } else {
          games.value = response.data
        }
        finished.value = response.data.length < pageSize.value
      }
    } else {
      const response = await gamesApi.getGames(params)
      
      if (response.code === 0 && response.data) {
        if (append) {
          games.value = [...games.value, ...response.data]
        } else {
          games.value = response.data
        }
        
        // Check if we've reached the end
        const pagination = response.pagination
        if (pagination) {
          finished.value = page >= pagination.pages
        } else {
          finished.value = response.data.length < pageSize.value
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch games:', error)
    Toast.fail('Không thể tải trò chơi')
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const onCategoryChange = () => {
  currentPage.value = 1
  finished.value = false
  games.value = []
  fetchGames(1, false)
}

const onSearch = () => {
  currentPage.value = 1
  finished.value = false
  games.value = []
  fetchGames(1, false)
}

const onSearchClear = () => {
  searchKeyword.value = ''
  currentPage.value = 1
  finished.value = false
  games.value = []
  fetchGames(1, false)
}

const onRefresh = () => {
  currentPage.value = 1
  finished.value = false
  fetchGames(1, false)
}

const onLoad = () => {
  if (!finished.value) {
    currentPage.value++
    fetchGames(currentPage.value, true)
  }
}

const handleGameClick = async (game) => {
  if (!isLoggedIn.value) {
    Toast.fail('Vui lòng đăng nhập để chơi')
    router.push('/login')
    return
  }

  try {
    Toast.loading({
      message: 'Đang khởi động...',
      forbidClick: true,
      duration: 0
    })

    const response = await gamesApi.launchGame({
      game_id: game.game_id,
      game_code: game.game_code
    })

    Toast.clear()

    if (response.code === 0 && response.data?.launch_url) {
      window.location.href = response.data.launch_url
    } else {
      Toast.fail(response.message || 'Không thể khởi động trò chơi')
    }
  } catch (error) {
    Toast.clear()
    console.error('Failed to launch game:', error)
    Toast.fail('Không thể khởi động trò chơi')
  }
}

const handleFavoriteToggle = async ({ gameId, isFavorite }) => {
  if (!isLoggedIn.value) {
    Toast.fail('Vui lòng đăng nhập')
    return
  }

  try {
    const response = await gamesApi.toggleFavorite({
      game_id: gameId,
      is_favorite: isFavorite
    })

    if (response.code === 0) {
      Toast.success(isFavorite ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích')
      
      // Update local game state
      const gameIndex = games.value.findIndex(g => g.game_id === gameId)
      if (gameIndex !== -1) {
        games.value[gameIndex].is_favorite = isFavorite
      }
    } else {
      Toast.fail(response.message || 'Thao tác thất bại')
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
    Toast.fail('Thao tác thất bại')
  }
}

const onClickLeft = () => {
  router.back()
}

// Lifecycle
onMounted(async () => {
  await fetchCategories()
  await fetchGames(1, false)
})
</script>

<style scoped lang="scss">
.games-home {
  min-height: 100vh;
  background: linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  padding-bottom: 20px;

  &__navbar {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    
    :deep(.van-nav-bar__title) {
      color: #fff;
      font-weight: 600;
    }
    
    :deep(.van-icon) {
      color: #fff;
    }
  }

  &__tabs {
    margin-bottom: 16px;
    
    :deep(.van-tabs__wrap) {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }
    
    :deep(.van-tab) {
      color: #999;
      font-weight: 500;
    }
    
    :deep(.van-tab--active) {
      color: #00d4ff;
    }
    
    :deep(.van-tabs__line) {
      background: linear-gradient(90deg, #00d4ff 0%, #4ecdc4 100%);
    }
  }

  &__search {
    padding: 0 16px 16px;
    
    :deep(.van-search) {
      background: transparent;
      padding: 0;
    }
    
    :deep(.van-search__content) {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
    }
    
    :deep(.van-field__control) {
      color: #fff;
    }
    
    :deep(.van-field__control::placeholder) {
      color: #999;
    }
  }

  &__list {
    padding: 0 16px;
  }
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

/* Responsive grid */
@media (max-width: 360px) {
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

@media (min-width: 768px) {
  .games-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

@media (min-width: 1024px) {
  .games-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }
}
</style>