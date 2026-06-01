<template>
  <div class="page-content space-y-5">
    
    <ArtTextScroll
      text="Art Design Pro là một hệ thống quản trị kết hợp thẩm mỹ thiết kế và phát triển hiệu quả <a target='_blank' href='https://www.artd.pro/docs/'>Nhấp vào đây </a>để truy cập tài liệu chính thức"
      showClose
    />

    
    <ArtTextScroll type="success" text="Đây là một thông báo cuộn loại thành công" />

    <ArtTextScroll type="warning" text="Đây là một thông báo cuộn loại cảnh báo" />

    <ArtTextScroll type="danger" text="Đây là một thông báo cuộn loại nguy hiểm" />

    <ArtTextScroll type="info" text="Đây là một thông báo cuộn loại thông tin" />

    
    <ArtTextScroll text="Đây là một thông báo cuộn có thể đóng" @close="handleClose" />

    
    <ArtTextScroll
      type="warning"
      text="Đây là một thông báo cuộn chậm, cuộn sang phải"
      :speed="30"
      direction="right"
    />

    <ArtTextScroll
      text="Đây là một thông báo chỉ cuộn khi văn bản tràn, khi nội dung văn bản vượt quá chiều rộng container thì mới bắt đầu cuộn hiển thị, nếu không sẽ giữ trạng thái tĩnh"
      @close="handleClose"
      :alwaysScroll="false"
    />

    <ArtTextScroll type="danger" direction="up" :speed="30" text="Đây là một thông báo cuộn lên trên" />

    <ArtTextScroll type="info" direction="down" :speed="30" text="Đây là một thông báo cuộn xuống dưới" />
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'WidgetsTextScroll' })

  const handleClose = () => {
    console.log('Component cuộn văn bản đã đóng')
    ElMessage.info('Đã đóng')
  }
</script>
