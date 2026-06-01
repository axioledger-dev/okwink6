<template>
  <ArtResultPage
    type="fail"
    title="Gửi thất bại"
    message="Vui lòng kiểm tra và sửa các thông tin sau, sau đó gửi lại."
    iconCode="ri:close-fill"
  >
    <template #content>
      <p>Nội dung bạn gửi có các lỗi sau:</p>
      <p>
        <ArtSvgIcon icon="ri:close-circle-line" class="text-red-500 mr-1" />
        <span>Tài khoản của bạn đã bị đóng băng</span>
      </p>
      <p>
        <ArtSvgIcon icon="ri:close-circle-line" class="text-red-500 mr-1" />
        <span>Tài khoản của bạn chưa đủ điều kiện đăng ký</span>
      </p>
    </template>
    <template #buttons>
      <ElButton type="primary" v-ripple>Quay lại sửa</ElButton>
      <ElButton v-ripple>Xem</ElButton>
    </template>
  </ArtResultPage>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ResultFail' })
</script>
