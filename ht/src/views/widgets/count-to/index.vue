<template>
  <div class="page-content mb-5">
    <div class="mb-15 text-center">
      <h1 class="my-4 text-2xl font-semibold leading-tight"
        >Component Count-To dựa trên VueUse useTransition</h1
      >
      <p class="m-0 text-base leading-relaxed text-g-700"
        >Component hoạt ảnh cuộn số hiệu suất cao, hỗ trợ điều khiển hoạt ảnh đầy đủ và lắng nghe sự kiện</p
      >
    </div>

    
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">Cách sử dụng cơ bản</h2>
      <div class="count">
        <ArtCountTo :target="1000" :duration="2000" />
      </div>
    </div>

    
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">Với tiền tố và hậu tố</h2>
      <div class="count">
        <ArtCountTo :target="20000" :duration="2500" prefix="¥" suffix="đồng" :decimals="2" />
      </div>
    </div>

    
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">Dấu thập phân và dấu phân cách</h2>
      <div class="count">
        <ArtCountTo :target="2023.45" :duration="3000" :decimals="2" separator="," />
      </div>
    </div>

    
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">So sánh hiệu ứng hoạt ảnh</h2>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 mb-8">
        <div class="text-center" v-for="easing in easingTypes" :key="easing.type">
          <div class="mb-3 text-sm font-medium text-g-700">{{ easing.name }}</div>
          <div class="count">
            <ArtCountTo :target="easingTarget" :duration="3000" :easing="easing.type" />
          </div>
        </div>
      </div>
      <div class="text-center">
        <ElButton @click="triggerEasing">Kích hoạt tất cả hoạt ảnh</ElButton>
      </div>
    </div>

    
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">Nút điều khiển</h2>
      <div class="count">
        <ArtCountTo
          ref="countToRef"
          :target="controlTarget"
          :duration="2000"
          @started="handleAnimationStarted"
          @finished="handleAnimationFinished"
          @paused="handleAnimationPaused"
          @reset="handleAnimationReset"
        />
      </div>

      <div class="flex gap-3 justify-center">
        <ElButton @click="startCount">Bắt đầu</ElButton>
        <ElButton @click="pauseCount">Tạm dừng</ElButton>
        <ElButton @click="resetCount">Đặt lại</ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ArtCountTo from '@/components/core/text-effect/art-count-to/index.vue'

  defineOptions({ name: 'TemplateCountTo' })

  const controlTarget = ref(0)
  const countToRef = ref()
  const easingTarget = ref(0)

  const easingTypes = [
    { name: 'Linear', type: 'linear' },
    { name: 'Ease Out Cubic', type: 'easeOutCubic' },
    { name: 'Ease Out Expo', type: 'easeOutExpo' },
    { name: 'Ease Out Sine', type: 'easeOutSine' },
    { name: 'Ease In Out', type: 'easeInOutCubic' },
    { name: 'Ease In Quad', type: 'easeInQuad' }
  ] as const

  const startCount = () => {
    const newTarget = 5000
    controlTarget.value = newTarget
    countToRef.value?.start(newTarget)
  }

  const pauseCount = () => {
    countToRef.value?.pause()
  }

  const resetCount = () => {
    countToRef.value?.reset()
    controlTarget.value = 0
  }

  const triggerEasing = () => {
    easingTarget.value = easingTarget.value === 0 ? 1000 : 0
  }

  const handleAnimationStarted = (value: number) => {
    console.log('Hoạt ảnh bắt đầu, giá trị mục tiêu:', value)
  }

  const handleAnimationFinished = (value: number) => {
    console.log('Hoạt ảnh hoàn thành, giá trị cuối cùng:', value)
  }

  const handleAnimationPaused = (value: number) => {
    console.log('Hoạt ảnh tạm dừng, giá trị hiện tại:', value)
  }

  const handleAnimationReset = () => {
    console.log('Hoạt ảnh đã được đặt lại')
  }
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';

  .count {
    @apply p-5 
    mb-5 
    text-2xl 
    font-semibold 
    text-center
    bg-g-100
    rounded-lg 
    tabular-nums
    border border-g-300/60;
  }
</style>
