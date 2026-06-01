<template>
  <ArtResultPage
    type="success"
    title="Gửi thành công"
    message="Trang kết quả gửi dùng để phản hồi kết quả xử lý một loạt tác vụ thao tác. Nếu chỉ là thao tác đơn giản, sử dụng Message thông báo toàn cục là đủ. Vùng màu xám có thể hiển thị một số thông tin bổ sung."
    iconCode="ri:check-fill"
  >
    <template #content>
      <p>Đã gửi đơn, đang chờ phòng ban duyệt.</p>
    </template>
    <template #buttons>
      <ElButton type="primary" v-ripple>Quay lại sửa</ElButton>
      <ElButton v-ripple>Xem</ElButton>
      <ElButton v-ripple>In</ElButton>
    </template>
  </ArtResultPage>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ResultSuccess' })
</script>
