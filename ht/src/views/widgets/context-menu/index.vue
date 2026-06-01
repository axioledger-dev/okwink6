<template>
  <div class="page-content">
    <ElButton @contextmenu.prevent="showMenu"> Nhấp chuột phải để kích hoạt Menu </ElButton>

    
    <ArtMenuRight
      ref="menuRef"
      :menu-items="menuItems"
      :menu-width="180"
      :submenu-width="140"
      :border-radius="10"
      @select="handleSelect"
      @show="onMenuShow"
      @hide="onMenuHide"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick } from 'vue'
  import ArtMenuRight from '@/components/core/others/art-menu-right/index.vue'
  import type { MenuItemType } from '@/components/core/others/art-menu-right/index.vue'

  defineOptions({ name: 'TemplateContextMenu' })

  const menuRef = ref<InstanceType<typeof ArtMenuRight>>()
  const lastAction = ref('')

  const menuItems = computed((): MenuItemType[] => [
    {
      key: 'copy',
      label: 'Sao chép',
      icon: 'ri:file-copy-line'
    },
    {
      key: 'paste',
      label: 'Dán',
      icon: 'ri:capsule-line'
    },
    {
      key: 'cut',
      label: 'Cắt',
      icon: 'ri:clipboard-line',
      showLine: true
    },
    {
      key: 'export',
      label: 'Tùy chọn xuất',
      icon: 'ri:export-line',
      children: [
        {
          key: 'exportExcel',
          label: 'Xuất Excel',
          icon: 'ri:file-excel-2-line'
        },
        {
          key: 'exportPdf',
          label: 'Xuất PDF',
          icon: 'ri:file-pdf-2-line'
        }
      ]
    },
    {
      key: 'edit',
      label: 'Tùy chọn chỉnh sửa',
      icon: 'ri:edit-2-line',
      children: [
        {
          key: 'rename',
          label: 'Đổi tên'
        },
        {
          key: 'duplicate',
          label: 'Sao chép bản sao'
        }
      ]
    },
    {
      key: 'share',
      label: 'Chia sẻ',
      icon: 'ri:share-forward-line',
      showLine: true
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: 'ri:delete-bin-line'
    },
    {
      key: 'disabled',
      label: 'Tùy chọn vô hiệu hóa',
      icon: 'ri:close-circle-line',
      disabled: true
    }
  ])

  const handleSelect = (item: MenuItemType) => {
    lastAction.value = `${item.label} (${item.key})`
    ElMessage.success(`Đã thực hiện thao tác: ${item.label}`)
    console.log('Đã chọn mục Menu:', item)
  }

  const showMenu = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    nextTick(() => {
      menuRef.value?.show(e)
    })
  }

  const onMenuShow = () => {
    console.log('Menu đã hiển thị')
  }

  const onMenuHide = () => {
    console.log('Menu đã ẩn')
  }
</script>
