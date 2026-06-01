<template>
  <div class="space-y-5 mb-5">
    <div class="text-2xl font-medium mt-5 max-sm:text-2xl max-sm:mt-3">Biểu tượng</div>
    <div class="text-g-800">
      Phiên bản v.3.0 đã nâng cấp thư viện biểu tượng lên iconify, có thể tìm kiếm tại
      <a href="https://icones.js.org/" target="_blank" class="text-theme hover:underline"
        >Iconify</a
      >
      , hỗ trợ nhiều thư viện biểu tượng, ví dụ như Remix Icon, Solar, Tabler Icons, v.v.
    </div>
    <div class="text-g-800">
      Để đảm bảo phong cách biểu tượng hệ thống thống nhất, dự án toàn bộ sử dụng thư viện biểu tượng Remix Icon, có thể tìm kiếm tại
      <a
        href="https://icones.js.org/collection/ri"
        target="_blank"
        class="text-theme hover:underline"
        >Iconify</a
      >
      hoặc<a href="https://remixicon.com/" target="_blank" class="text-theme hover:underline">
        Trang web chính thức Remix Icon </a
      > để tìm kiếm và sử dụng.
    </div>

    
    <div class="art-card-sm p-5">
      <div class="text-lg font-semibold mb-4">Iconify</div>
      <div class="flex items-center gap-6">
        <ArtSvgIcon icon="ri:github-fill" class="text-2xl" />
        <ArtSvgIcon icon="ri:copilot-line" class="text-2xl text-theme" />
        <ArtSvgIcon icon="ri:edge-line" class="text-2xl text-secondary" />
        <ArtSvgIcon icon="ri:planet-line" class="text-2xl text-warning" />
        <ArtSvgIcon icon="ri:windows-line" class="text-2xl text-info" />
        <ArtSvgIcon icon="ri:thumb-up-line" class="text-2xl text-danger" />
        <ArtSvgIcon icon="ri:gift-2-line" class="text-2xl text-success" />
        <ArtSvgIcon icon="ri:apple-line" class="text-2xl text-secondary" />
      </div>
    </div>

    
    <div class="art-card-sm p-5">
      <div class="text-lg font-semibold mb-4">Svg Icons</div>
      <div class="flex items-center gap-6">
        <ArtSvgIcon icon="svg-spinners:3-dots-fade" class="text-2xl text-red-400" />
        <ArtSvgIcon icon="svg-spinners:3-dots-bounce" class="text-2xl text-blue-400" />
        <ArtSvgIcon icon="svg-spinners:3-dots-move" class="text-2xl text-orange-400" />
        <ArtSvgIcon icon="svg-spinners:3-dots-rotate" class="text-2xl text-purple-400" />
        <ArtSvgIcon icon="svg-spinners:blocks-shuffle-2" class="text-2xl text-pink-300" />
        <ArtSvgIcon icon="svg-spinners:clock" class="text-2xl text-yellow-500" />
        <ArtSvgIcon icon="svg-spinners:tadpole" class="text-2xl text-orange-500" />
        <ArtSvgIcon icon="svg-spinners:blocks-wave" class="text-2xl text-blue-500" />
      </div>
    </div>

    
    <div class="art-card-sm p-5">
      <div class="text-lg font-semibold mb-4">Material Line Icons</div>
      <div class="flex items-center gap-6">
        <ArtSvgIcon icon="line-md:phone-call-twotone-loop" class="text-2xl text-blue-500" />

        <ArtSvgIcon icon="line-md:switch-off" class="text-2xl text-green-500" />
        <ArtSvgIcon icon="line-md:sun-rising-filled-loop" class="text-2xl text-yellow-400" />
        <ArtSvgIcon icon="line-md:volume-high-filled" class="text-2xl text-purple-500" />
        <ArtSvgIcon icon="line-md:github-twotone" class="text-2xl text-gray-700" />
        <ArtSvgIcon icon="line-md:telegram" class="text-2xl text-sky-500" />
        <ArtSvgIcon icon="line-md:reddit-loop" class="text-2xl text-orange-400" />
        <ArtSvgIcon
          icon="line-md:coffee-half-empty-filled-loop"
          class="text-2xl text-emerald-500"
        />
      </div>
    </div>

    
    <div class="art-card-sm p-5">
      <div class="text-lg font-semibold mb-4">Ví dụ sử dụng</div>
      <div class="space-y-4">
        <div>
          <div class="text-sm text-g-600 mb-2">Sử dụng cơ bản</div>
          <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded font-mono text-sm text-g-800">
            &lt;ArtSvgIcon icon="ri:home-line" /&gt;
          </div>
        </div>
        <div>
          <div class="text-sm text-g-600 mb-2">Tùy chỉnh kích thước</div>
          <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded font-mono text-sm text-g-800">
            &lt;ArtSvgIcon icon="ri:user-line" class="text-2xl" /&gt;
          </div>
        </div>
        <div>
          <div class="text-sm text-g-600 mb-2">Tùy chỉnh màu sắc</div>
          <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded font-mono text-sm text-g-800">
            &lt;ArtSvgIcon icon="ri:heart-fill" class="text-red-500" /&gt;
          </div>
        </div>
        <div>
          <div class="text-sm text-g-600 mb-2">Sử dụng kết hợp</div>
          <div class="bg-g-200 dark:bg-g-300/30 p-4 rounded font-mono text-sm text-g-800">
            &lt;ArtSvgIcon icon="ri:star-fill" class="text-4xl text-yellow-500" /&gt;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'

  defineOptions({ name: 'IconPage' })
</script>
