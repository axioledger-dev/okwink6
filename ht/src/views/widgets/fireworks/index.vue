<template>
  <div class="page-content">
    <div class="mb-5">
      <ElSpace wrap>
        <ElButton :disabled="isLaunching" v-ripple @click="handleSingleLaunch"
          >✨ Bắn pháo hoa nhỏ</ElButton
        >
        <ElButton :disabled="isLaunching" v-ripple @click="handleImageLaunch(bp)"
          >🎉 Mở phong bì đỏ may mắn</ElButton
        >
        <ElButton :disabled="isLaunching" v-ripple @click="handleMultipleLaunch('')"
          >🎆 Màn trình diễn pháo hoa rực rỡ</ElButton
        >
        <ElButton :disabled="isLaunching" v-ripple @click="handleImageLaunch(sd)"
          >❄️ Rơi bông tuyết nhỏ</ElButton
        >
        <ElButton :disabled="isLaunching" v-ripple @click="handleMultipleLaunch(sd)"
          >❄️ Bão tuyết lãng mạn</ElButton
        >
      </ElSpace>
    </div>

    <ElDescriptions
      title="Giải thích component pháo hoa"
      direction="vertical"
      :column="1"
      border
      style="margin-top: 50px"
    >
      <ElDescriptionsItem label="Thời điểm hiển thị">
        Component hiệu ứng pháo hoa đã được đăng ký toàn cục, thời điểm kích hoạt được kiểm soát bởi file cấu hình. Ngày trong cấu hình mặc định đã qua, sẽ không kích hoạt lại trong quá trình sử dụng của bạn, không cần lo lắng.
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Kiểu pháo hoa">
        Mặc định hiển thị hình học, có thể cấu hình hình ảnh, hình ảnh cần được định nghĩa trước trong
        file src/components/core/layouts/art-fireworks-effect/index.vue
      </ElDescriptionsItem>
      <ElDescriptionsItem label="File cấu hình">
        Trong file src/config/festival.ts, có thể cấu hình ngày lễ và kiểu pháo hoa tương ứng
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Phím tắt">
        command + shift + p hoặc ctrl + shift + p
      </ElDescriptionsItem>
    </ElDescriptions>
  </div>
</template>

<script setup lang="ts">
  import { mittBus } from '@/utils/sys'
  import bp from '@imgs/ceremony/hb.png'
  import sd from '@imgs/ceremony/sd.png'

  defineOptions({ name: 'WidgetsFireworks' })

  const timerRef = ref<ReturnType<typeof setInterval> | null>(null)
  const isLaunching = ref(false)

  const triggerFireworks = (count: number, src: string) => {

    if (timerRef.value) {
      clearInterval(timerRef.value)
      timerRef.value = null
    }

    isLaunching.value = true

    let fired = 0
    timerRef.value = setInterval(() => {
      mittBus.emit('triggerFireworks', src)
      fired++

      if (fired >= count) {
        clearInterval(timerRef.value!)
        timerRef.value = null
        isLaunching.value = false
      }
    }, 1000)
  }

  const handleSingleLaunch = () => {
    mittBus.emit('triggerFireworks')
  }

  const handleMultipleLaunch = (src: string) => {
    triggerFireworks(10, src)
  }

  const handleImageLaunch = (src: string) => {
    mittBus.emit('triggerFireworks', src)
  }

  onUnmounted(() => {
    if (timerRef.value) {
      clearInterval(timerRef.value)
      timerRef.value = null
    }
  })
</script>
