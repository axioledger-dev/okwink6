<template>
  <div class="page-content">
    <ArtCutterImg
      v-model:imgUrl="imageUrl"
      :boxWidth="530"
      :boxHeight="300"
      :cutWidth="360"
      :cutHeight="200"
      :quality="1"
      :tool="true"
      :watermarkText="'My Watermark'"
      watermarkColor="#ff0000"
      :showPreview="true"
      :originalGraph="false"
      :title="'Cắt hình ảnh'"
      :previewTitle="'Xem trước hiệu quả'"
      @error="handleError"
      @imageLoadComplete="handleLoadComplete"
      @imageLoadError="handleLoadError"
    />
  </div>
</template>

<script setup lang="ts">
  import lockImg from '@imgs/lock/bg_dark.webp'

  defineOptions({ name: 'WidgetsImageCrop' })

  const imageUrl = ref(lockImg)

  const handleError = (error: Error) => {
    console.error('Lỗi cắt ảnh:', error)
    ElMessage.error('Cắt hình ảnh thất bại')
  }

  const handleLoadComplete = (result: { url: string; width: number; height: number }) => {
    console.log('Tải hình ảnh hoàn tất:', result)
  }

  const handleLoadError = (error: Error) => {
    console.error('Tải hình ảnh thất bại:', error)
    ElMessage.error('Tải hình ảnh thất bại')
  }
</script>
