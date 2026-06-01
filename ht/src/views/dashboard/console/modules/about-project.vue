<template>
  <div class="art-card p-5 flex-b mb-5 max-sm:mb-4">
    <div>
      <h2 class="text-2xl font-medium">Về dự án</h2>
      <p class="text-g-700 mt-1">{{ systemName }} là hệ thống quản trị kết hợp thẩm mỹ thiết kế và phát triển hiệu quả</p>
      <p class="text-g-700 mt-1">Sử dụng các công nghệ tiên tiến như Vue3, TypeScript, Vite, Element Plus</p>

      <div class="flex flex-wrap gap-3.5 max-w-150 mt-9">
        <div
          class="w-60 flex-cb h-12.5 px-3.5 border border-g-300 c-p rounded-lg text-sm bg-g-100 duration-300 hover:-translate-y-1 max-sm:w-full"
          v-for="link in linkList"
          :key="link.label"
          @click="goPage(link.url)"
        >
          <span class="text-g-700">{{ link.label }}</span>
          <ArtSvgIcon icon="ri:arrow-right-s-line" class="text-lg text-g-600" />
        </div>
      </div>
    </div>
    <img class="w-75 max-md:!hidden" src="@imgs/draw/draw1.png" alt="draw1" />
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { WEB_LINKS } from '@/utils/constants'

  const systemName = AppConfig.systemInfo.name

  const linkList = [
    { label: 'Website dự án', url: WEB_LINKS.DOCS },
    { label: 'Tài liệu', url: WEB_LINKS.INTRODUCE },
    { label: 'Github', url: WEB_LINKS.GITHUB_HOME },
    { label: 'Bilibili', url: WEB_LINKS.BILIBILI }
  ]

  const goPage = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
</script>
