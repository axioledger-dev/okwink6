<template>
  <div class="xoso-loading">
    <van-loading type="spinner" size="48" color="#667eea">
      <template #icon>
        <div class="loading-icon">
          <div class="spinner"></div>
        </div>
      </template>
    </van-loading>
    <p class="loading-text">{{ message }}</p>
  </div>
</template>

<script setup>
import { Loading as VanLoading } from 'vant'

defineProps({
  message: {
    type: String,
    default: 'Đang tải...'
  }
})
</script>

<style scoped lang="scss">
.xoso-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: 200px;
}

.loading-icon {
  width: 48px;
  height: 48px;
  position: relative;
}

.spinner {
  width: 100%;
  height: 100%;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}
</style>