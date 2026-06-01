<template>
  <div class="art-card h-128 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>Việc cần làm</h4>
        <p>Chờ xử lý<span class="text-danger">3</span></p>
      </div>
    </div>

    <div class="h-[calc(100%-40px)] overflow-auto">
      <ElScrollbar>
        <div
          class="flex-cb h-17.5 border-b border-g-300 text-sm last:border-b-0"
          v-for="(item, index) in list"
          :key="index"
        >
          <div>
            <p class="text-sm">{{ item.username }}</p>
            <p class="text-g-500 mt-1">{{ item.date }}</p>
          </div>
          <ElCheckbox v-model="item.complate" />
        </div>
      </ElScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface TodoItem {
    username: string
    date: string
    complate: boolean
  }

  const list = reactive<TodoItem[]>([
    {
      username: 'Xem nội dung công việc hôm nay',
      date: 'Sáng 09:30',
      complate: true
    },
    {
      username: 'Trả lời email',
      date: 'Sáng 10:30',
      complate: true
    },
    {
      username: 'Sắp xếp báo cáo công việc',
      date: 'Sáng 11:00',
      complate: true
    },
    {
      username: 'Họp yêu cầu sản phẩm',
      date: 'Chiều 02:00',
      complate: false
    },
    {
      username: 'Sắp xếp nội dung cuộc họp',
      date: 'Chiều 03:30',
      complate: false
    },
    {
      username: 'Kế hoạch công việc ngày mai',
      date: 'Chiều 06:30',
      complate: false
    }
  ])
</script>
