<template>
  <div class="art-card h-128 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>Hoạt động</h4>
        <p>Thêm mới<span class="text-success">+6</span></p>
      </div>
    </div>

    <div class="h-9/10 mt-2 overflow-hidden">
      <ElScrollbar>
        <div
          class="h-17.5 leading-17.5 border-b border-g-300 text-sm overflow-hidden last:border-b-0"
          v-for="(item, index) in list"
          :key="index"
        >
          <span class="text-g-800 font-medium">{{ item.username }}</span>
          <span class="mx-2 text-g-600">{{ item.type }}</span>
          <span class="text-theme">{{ item.target }}</span>
        </div>
      </ElScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface DynamicItem {
    username: string
    type: string
    target: string
  }

  const list = reactive<DynamicItem[]>([
    {
      username: 'Trung Tiểu Ngư',
      type: 'đã theo dõi',
      target: 'Chuỗi mẫu'
    },
    {
      username: 'Hà Tiểu Hà',
      type: 'đã đăng bài viết',
      target: 'Ghi chú thực chiến dự án Vue3 + Typescript + Vite'
    },
    {
      username: 'Trung Tiểu Ngư',
      type: 'đã theo dõi',
      target: 'Chuỗi mẫu'
    },
    {
      username: 'Hà Tiểu Hà',
      type: 'đã đăng bài viết',
      target: 'Ghi chú thực chiến dự án Vue3 + Typescript + Vite'
    },
    {
      username: 'Chuỗi mẫu',
      type: 'đã đặt câu hỏi',
      target: 'Chủ đề có thể cấu hình được không'
    },
    {
      username: 'Fa Dai Cao',
      type: 'đã đổi vật phẩm',
      target: '《Cuộc đời kỳ lạ》'
    },
    {
      username: 'Ốc quế',
      type: 'đã đóng vấn đề',
      target: 'Fa Dai Cao'
    },
    {
      username: 'Lãnh Nguyệt Đãi Đãi',
      type: 'đã đổi vật phẩm',
      target: '《Bảy thói quen của người hiệu quả》'
    }
  ])
</script>
