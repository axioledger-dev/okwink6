
<template>
  <div
    class="mt-10 flex gap-8 border-t border-[var(--default-border)] bg-[var(--art-bg-color)] pt-5"
  >
    <ElButton type="primary" class="flex-1 !h-8" @click="handleCopyConfig">
      {{ $t('setting.actions.copyConfig') }}
    </ElButton>
    <ElButton type="danger" plain class="flex-1 !h-8" @click="handleResetConfig">
      {{ $t('setting.actions.resetConfig') }}
    </ElButton>
  </div>
</template>

<script setup lang="ts">
  import { nextTick } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  import { SETTING_DEFAULT_CONFIG } from '@/config/setting'
  import { useClipboard } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import { MenuThemeEnum } from '@/enums/appEnum'
  import { useTheme } from '@/hooks/core/useTheme'

  defineOptions({ name: 'SettingActions' })

  const { t } = useI18n()
  const settingStore = useSettingStore()
  const { copy, copied } = useClipboard()
  const { switchThemeStyles } = useTheme()

  const ENUM_MAPS = {
    menuType: {
      left: 'MenuTypeEnum.LEFT',
      top: 'MenuTypeEnum.TOP',
      'top-left': 'MenuTypeEnum.TOP_LEFT',
      'dual-menu': 'MenuTypeEnum.DUAL_MENU'
    },
    systemTheme: {
      auto: 'SystemThemeEnum.AUTO',
      light: 'SystemThemeEnum.LIGHT',
      dark: 'SystemThemeEnum.DARK'
    },
    menuTheme: {
      design: 'MenuThemeEnum.DESIGN',
      light: 'MenuThemeEnum.LIGHT',
      dark: 'MenuThemeEnum.DARK'
    },
    containerWidth: {
      '100%': 'ContainerWidthEnum.FULL',
      '1200px': 'ContainerWidthEnum.BOXED'
    }
  } as const

  interface ConfigItem {
    comment: string
    key: keyof typeof settingStore
    enumMap?: Record<string, string>
    forceValue?: any
  }

  const CONFIG_ITEMS: ConfigItem[] = [
    { comment: '菜单loạikiểu', key: 'menuType', enumMap: ENUM_MAPS.menuType },
    { comment: '菜单Mở rộng宽độ', key: 'menuOpenWidth' },
    { comment: '菜单là否Mở rộng', key: 'menuOpen' },
    { comment: 'Đôi菜单là否Hiển thị văn bản', key: 'dualMenuShowText' },
    { comment: 'hệ统Chủ đềloạikiểu', key: 'systemThemeType', enumMap: ENUM_MAPS.systemTheme },
    { comment: 'hệ统Chế độ chủ đề', key: 'systemThemeMode', enumMap: ENUM_MAPS.systemTheme },
    { comment: '菜单Phong cách', key: 'menuThemeType', enumMap: ENUM_MAPS.menuTheme },
    { comment: 'hệ统Màu chủ đề', key: 'systemThemeColor' },
    { comment: 'là否Hiển thị菜单theo钮', key: 'showMenuButton' },
    { comment: 'là否Hiển thị快lối vào nhanh', key: 'showFastEnter' },
    { comment: 'là否Hiển thịLàm mớitheo钮', key: 'showRefreshButton' },
    { comment: 'là否Hiển thị breadcrumb', key: 'showCrumbs' },
    { comment: 'là否Hiển thị bảng làm việc标签', key: 'showWorkTab' },
    { comment: 'là否Hiển thị chuyển đổi ngôn ngữ', key: 'showLanguage' },
    { comment: 'là否Hiển thị进độđiều', key: 'showNprogress' },
    { comment: 'là否Hiển thị设tríHướng dẫn', key: 'showSettingGuide' },
    { comment: 'là否Hiển thị văn bản lễ hội', key: 'showFestivalText' },
    { comment: 'là否Hiển thị watermark', key: 'watermarkVisible' },
    { comment: 'là否Tự độngĐóng', key: 'autoClose' },
    { comment: 'là否Duy nhấtMở rộng', key: 'uniqueOpened' },
    { comment: 'là否Chế độ yếu màu', key: 'colorWeak' },
    { comment: 'là否Làm mới', key: 'refresh' },
    { comment: 'là否Tải pháo hoa lễ hội', key: 'holidayFireworksLoaded' },
    { comment: 'Chế độ viền', key: 'boxBorderMode' },
    { comment: '页mặtquahiệu ứng chuyển tiếp', key: 'pageTransition' },
    { comment: '标签kiểu trang', key: 'tabStyle' },
    { comment: 'Tùy chỉnh bo góc', key: 'customRadius' },
    { comment: 'Container宽độ', key: 'containerWidth', enumMap: ENUM_MAPS.containerWidth },
    { comment: 'Lễ hội日kỳ', key: 'festivalDate', forceValue: '' }
  ]

  const valueToCode = (value: any, enumMap?: Record<string, string>): string => {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'

    if (enumMap && typeof value === 'string' && enumMap[value]) {
      return enumMap[value]
    }

    if (typeof value === 'string') return `'${value}'`
    if (typeof value === 'boolean' || typeof value === 'number') return String(value)

    return JSON.stringify(value)
  }

  const generateConfigCode = (): string => {
    const lines = ['export const SETTING_DEFAULT_CONFIG = {']

    CONFIG_ITEMS.forEach((item) => {
      lines.push(`  /** ${item.comment} */`)
      const value = item.forceValue !== undefined ? item.forceValue : settingStore[item.key]
      lines.push(`  ${String(item.key)}: ${valueToCode(value, item.enumMap)},`)
    })

    lines.push('}')
    return lines.join('\n')
  }

  const handleCopyConfig = async () => {
    try {
      const configText = generateConfigCode()
      await copy(configText)

      if (copied.value) {
        ElMessage.success({
          message: t('setting.actions.copySuccess'),
          duration: 3000
        })
      }
    } catch (error) {
      console.error('Sao chép配trí失败:', error)
      ElMessage.error(t('setting.actions.copyFailed'))
    }
  }

  const toggleIfDifferent = (
    currentValue: boolean,
    defaultValue: boolean,
    toggleFn: () => void
  ) => {
    if (currentValue !== defaultValue) {
      toggleFn()
    }
  }

  const handleResetConfig = async () => {
    try {
      const config = SETTING_DEFAULT_CONFIG

      settingStore.switchMenuLayouts(config.menuType)
      settingStore.setMenuOpenWidth(config.menuOpenWidth)
      settingStore.setMenuOpen(config.menuOpen)
      settingStore.setDualMenuShowText(config.dualMenuShowText)

      switchThemeStyles(config.systemThemeMode)

      await nextTick()
      const menuTheme = settingStore.isDark ? MenuThemeEnum.DARK : config.menuThemeType
      settingStore.switchMenuStyles(menuTheme)

      settingStore.setElementTheme(config.systemThemeColor)

      toggleIfDifferent(settingStore.showMenuButton, config.showMenuButton, () =>
        settingStore.setButton()
      )
      toggleIfDifferent(settingStore.showFastEnter, config.showFastEnter, () =>
        settingStore.setFastEnter()
      )
      toggleIfDifferent(settingStore.showRefreshButton, config.showRefreshButton, () =>
        settingStore.setShowRefreshButton()
      )
      toggleIfDifferent(settingStore.showCrumbs, config.showCrumbs, () => settingStore.setCrumbs())
      toggleIfDifferent(settingStore.showLanguage, config.showLanguage, () =>
        settingStore.setLanguage()
      )
      toggleIfDifferent(settingStore.showNprogress, config.showNprogress, () =>
        settingStore.setNprogress()
      )

      settingStore.setWorkTab(config.showWorkTab)
      settingStore.setShowFestivalText(config.showFestivalText)
      settingStore.setWatermarkVisible(config.watermarkVisible)

      toggleIfDifferent(settingStore.autoClose, config.autoClose, () => settingStore.setAutoClose())
      toggleIfDifferent(settingStore.uniqueOpened, config.uniqueOpened, () =>
        settingStore.setUniqueOpened()
      )
      toggleIfDifferent(settingStore.colorWeak, config.colorWeak, () => settingStore.setColorWeak())

      toggleIfDifferent(settingStore.boxBorderMode, config.boxBorderMode, () =>
        settingStore.setBorderMode()
      )
      settingStore.setPageTransition(config.pageTransition)
      settingStore.setTabStyle(config.tabStyle)
      settingStore.setCustomRadius(config.customRadius)
      settingStore.setContainerWidth(config.containerWidth)

      settingStore.setFestivalDate(config.festivalDate)
      settingStore.setholidayFireworksLoaded(config.holidayFireworksLoaded)

      location.reload()
    } catch (error) {
      console.error('Đặt lại配trí失败:', error)
      ElMessage.error(t('setting.actions.resetFailed'))
    }
  }
</script>
