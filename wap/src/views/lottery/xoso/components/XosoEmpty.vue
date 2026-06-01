<template>
  <div class="xoso-empty">
    <van-empty :image="image" :description="message">
      <template v-if="$slots.action" #default>
        <slot name="action"></slot>
      </template>
    </van-empty>
  </div>
</template>

<script setup>
import { Empty as VanEmpty } from 'vant'

defineProps({
  message: {
    type: String,
    default: 'Không có dữ liệu'
  },
  image: {
    type: String,
    default: 'search'
  }
})
</script>

<style scoped lang="scss">
.xoso-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: 200px;
}
</style>