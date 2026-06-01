<template>
  <div class="page-content mb-5">
    
    <ElCard class="mb-7.5" shadow="never">
      <template #header>Watermark văn bản cơ bản</template>
      <ElWatermark content="Art Design Pro" :font="{ color: 'rgba(128, 128, 128, 0.2)' }">
        <div style="height: 200px"></div>
      </ElWatermark>
    </ElCard>

    
    <ElCard class="mb-7.5" shadow="never">
      <template #header>Watermark văn bản nhiều dòng</template>
      <ElWatermark
        :content="['Art Design Pro', 'Tập trung vào trải nghiệm người dùng, thiết kế trực quan']"
        :font="{ fontSize: 16, color: 'rgba(128, 128, 128, 0.2)' }"
      >
        <div style="height: 200px"></div>
      </ElWatermark>
    </ElCard>

    
    <ElCard class="mb-7.5" shadow="never">
      <template #header>Watermark hình ảnh</template>
      <ElWatermark :image="watermarkImage" :opacity="0.2" :width="80" :height="20">
        <div style="height: 200px"></div>
      </ElWatermark>
    </ElCard>

    
    <ElCard class="mb-7.5" shadow="never">
      <template #header>Watermark kiểu tùy chỉnh</template>
      <ElWatermark
        content="Art Design Pro"
        :font="{
          fontSize: 20,
          fontFamily: 'Arial',
          color: 'rgba(255, 0, 0, 0.3)'
        }"
        :rotate="-22"
        :gap="[100, 100]"
      >
        <div style="height: 200px"></div>
      </ElWatermark>
    </ElCard>

    <ElButton
      :type="settingStore.watermarkVisible ? 'danger' : 'primary'"
      @click="handleWatermarkVisible"
    >
      {{ settingStore.watermarkVisible ? 'Ẩn watermark toàn cục' : 'Hiển thị watermark toàn cục' }}
    </ElButton>
  </div>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'

  defineOptions({ name: 'Watermark' })

  const settingStore = useSettingStore()

  const watermarkImage = ref('https://element-plus.org/images/element-plus-logo.svg')

  const handleWatermarkVisible = () => {
    useSettingStore().setWatermarkVisible(!settingStore.watermarkVisible)
    ElMessage.success(settingStore.watermarkVisible ? 'Đã hiển thị watermark toàn cục' : 'Đã ẩn watermark toàn cục')
  }
</script>
