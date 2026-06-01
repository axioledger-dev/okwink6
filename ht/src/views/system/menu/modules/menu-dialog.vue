<template>
  <ElDialog
    :title="dialogTitle"
    :model-value="visible"
    @update:model-value="handleCancel"
    width="860px"
    align-center
    class="menu-dialog"
    @closed="handleClosed"
  >
    <ArtForm
      ref="formRef"
      v-model="form"
      :items="formItems"
      :rules="rules"
      :span="width > 640 ? 12 : 24"
      :gutter="20"
      label-width="100px"
      :show-reset="false"
      :show-submit="false"
    >
      <template #menuType>
        <ElRadioGroup v-model="form.menuType" :disabled="disableMenuType">
          <ElRadioButton value="menu" label="menu">Menu</ElRadioButton>
          <ElRadioButton value="button" label="button">Nút</ElRadioButton>
        </ElRadioGroup>
      </template>
    </ArtForm>

    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="handleCancel">Hủy</ElButton>
        <ElButton type="primary" @click="handleSubmit">Xác nhận</ElButton>
      </span>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormRules } from 'element-plus'
  import { ElIcon, ElTooltip } from 'element-plus'
  import { QuestionFilled } from '@element-plus/icons-vue'
  import { formatMenuTitle } from '@/utils/router'
  import type { AppRouteRecord } from '@/types/router'
  import type { FormItem } from '@/components/core/forms/art-form/index.vue'
  import ArtForm from '@/components/core/forms/art-form/index.vue'
  import { useWindowSize } from '@vueuse/core'

  const { width } = useWindowSize()

  const createLabelTooltip = (label: string, tooltip: string) => {
    return () =>
      h('span', { class: 'flex items-center' }, [
        h('span', label),
        h(
          ElTooltip,
          {
            content: tooltip,
            placement: 'top'
          },
          () => h(ElIcon, { class: 'ml-0.5 cursor-help' }, () => h(QuestionFilled))
        )
      ])
  }

  interface MenuFormData {
    id: number
    name: string
    path: string
    label: string
    component: string
    icon: string
    isEnable: boolean
    sort: number
    isMenu: boolean
    keepAlive: boolean
    isHide: boolean
    isHideTab: boolean
    link: string
    isIframe: boolean
    showBadge: boolean
    showTextBadge: string
    fixedTab: boolean
    activePath: string
    roles: string[]
    isFullPage: boolean
    authName: string
    authLabel: string
    authIcon: string
    authSort: number
  }

  interface Props {
    visible: boolean
    editData?: AppRouteRecord | any
    type?: 'menu' | 'button'
    lockType?: boolean
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', data: MenuFormData): void
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    type: 'menu',
    lockType: false
  })

  const emit = defineEmits<Emits>()

  const formRef = ref()
  const isEdit = ref(false)

  const form = reactive<MenuFormData & { menuType: 'menu' | 'button' }>({
    menuType: 'menu',
    id: 0,
    name: '',
    path: '',
    label: '',
    component: '',
    icon: '',
    isEnable: true,
    sort: 1,
    isMenu: true,
    keepAlive: true,
    isHide: false,
    isHideTab: false,
    link: '',
    isIframe: false,
    showBadge: false,
    showTextBadge: '',
    fixedTab: false,
    activePath: '',
    roles: [],
    isFullPage: false,
    authName: '',
    authLabel: '',
    authIcon: '',
    authSort: 1
  })

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: 'Vui lòng nhập tên menu', trigger: 'blur' },
      { min: 2, max: 20, message: 'Độ dài trong 2 đến 20 ký tự', trigger: 'blur' }
    ],
    path: [{ required: true, message: 'Vui lòng nhập địa chỉ định tuyến', trigger: 'blur' }],
    label: [{ required: true, message: 'Vui lòng nhập mã quyền', trigger: 'blur' }],
    authName: [{ required: true, message: 'Vui lòng nhập tên quyền', trigger: 'blur' }],
    authLabel: [{ required: true, message: 'Vui lòng nhập mã quyền', trigger: 'blur' }]
  })

  const formItems = computed<FormItem[]>(() => {
    const baseItems: FormItem[] = [{ label: 'Loại menu', key: 'menuType', span: 24 }]

    const switchSpan = width.value < 640 ? 12 : 6

    if (form.menuType === 'menu') {
      return [
        ...baseItems,
        { label: 'Tên menu', key: 'name', type: 'input', props: { placeholder: 'Tên menu' } },
        {
          label: createLabelTooltip(
            'Địa chỉ định tuyến',
            'Menu cấp 1: Đường dẫn tuyệt đối bắt đầu bằng / (Ví dụ /dashboard)\nCấp 2 trở xuống: Đường dẫn tương đối (Ví dụ console, user)'
          ),
          key: 'path',
          type: 'input',
          props: { placeholder: 'Ví dụ: /dashboard hoặc console' }
        },
        { label: 'Mã quyền', key: 'label', type: 'input', props: { placeholder: 'Ví dụ: User' } },
        {
          label: createLabelTooltip(
            'Đường dẫn component',
            'Menu cha cấp 1: Điền /index/index\nTrang cụ thể: Điền đường dẫn component (Ví dụ /system/user)\nMenu thư mục: Để trống'
          ),
          key: 'component',
          type: 'input',
          props: { placeholder: 'Ví dụ: /system/user hoặc để trống' }
        },
        { label: 'Biểu tượng', key: 'icon', type: 'input', props: { placeholder: 'Ví dụ: ri:user-line' } },
        {
          label: createLabelTooltip(
            'Quyền vai trò',
            'Chỉ dùng cho chế độ quyền frontend: Cấu hình mã vai trò (Ví dụ R_SUPER, R_ADMIN)\nChế độ quyền backend: Không cần cấu hình'
          ),
          key: 'roles',
          type: 'inputtag',
          props: { placeholder: 'Nhập mã vai trò sau đó nhấn Enter, Ví dụ: R_SUPER' }
        },
        {
          label: 'Sắp xếp menu',
          key: 'sort',
          type: 'number',
          props: { min: 1, controlsPosition: 'right', style: { width: '100%' } }
        },
        {
          label: 'Liên kết ngoài',
          key: 'link',
          type: 'input',
          props: { placeholder: 'Ví dụ: https://www.example.com' }
        },
        {
          label: 'Huy hiệu văn bản',
          key: 'showTextBadge',
          type: 'input',
          props: { placeholder: 'Ví dụ: New、Hot' }
        },
        {
          label: createLabelTooltip(
            'Đường dẫn kích hoạt',
            'Dùng cho trang chi tiết và menu ẩn, chỉ định đường dẫn menu cha được làm nổi bật\nVí dụ: Trang chi tiết người dùng làm nổi bật menu "Quản lý người dùng"'
          ),
          key: 'activePath',
          type: 'input',
          props: { placeholder: 'Ví dụ: /system/user' }
        },
        { label: 'Có bật không', key: 'isEnable', type: 'switch', span: switchSpan },
        { label: 'Bộ nhớ cache trang', key: 'keepAlive', type: 'switch', span: switchSpan },
        { label: 'Ẩn menu', key: 'isHide', type: 'switch', span: switchSpan },
        { label: 'Nhúng iframe', key: 'isIframe', type: 'switch', span: switchSpan },
        { label: 'Hiển thị huy hiệu', key: 'showBadge', type: 'switch', span: switchSpan },
        { label: 'Cố định tab', key: 'fixedTab', type: 'switch', span: switchSpan },
        { label: 'Ẩn tab', key: 'isHideTab', type: 'switch', span: switchSpan },
        { label: 'Toàn màn hình', key: 'isFullPage', type: 'switch', span: switchSpan }
      ]
    } else {
      return [
        ...baseItems,
        {
          label: 'Tên quyền',
          key: 'authName',
          type: 'input',
          props: { placeholder: 'Ví dụ: Thêm mới、Chỉnh sửa、Xóa' }
        },
        {
          label: 'Mã quyền',
          key: 'authLabel',
          type: 'input',
          props: { placeholder: 'Ví dụ: add、edit、delete' }
        },
        {
          label: 'Sắp xếp quyền',
          key: 'authSort',
          type: 'number',
          props: { min: 1, controlsPosition: 'right', style: { width: '100%' } }
        }
      ]
    }
  })

  const dialogTitle = computed(() => {
    const type = form.menuType === 'menu' ? 'Menu' : 'Nút'
    return isEdit.value ? `Chỉnh sửa ${type}` : `Tạo mới ${type}`
  })

  const disableMenuType = computed(() => {
    if (isEdit.value) return true
    if (!isEdit.value && form.menuType === 'menu' && props.lockType) return true
    return false
  })

  const resetForm = (): void => {
    formRef.value?.reset()
    form.menuType = 'menu'
  }

  const loadFormData = (): void => {
    if (!props.editData) return

    isEdit.value = true

    if (form.menuType === 'menu') {
      const row = props.editData
      form.id = row.id || 0
      form.name = formatMenuTitle(row.meta?.title || '')
      form.path = row.path || ''
      form.label = row.name || ''
      form.component = row.component || ''
      form.icon = row.meta?.icon || ''
      form.sort = row.meta?.sort || 1
      form.isMenu = row.meta?.isMenu ?? true
      form.keepAlive = row.meta?.keepAlive ?? false
      form.isHide = row.meta?.isHide ?? false
      form.isHideTab = row.meta?.isHideTab ?? false
      form.isEnable = row.meta?.isEnable ?? true
      form.link = row.meta?.link || ''
      form.isIframe = row.meta?.isIframe ?? false
      form.showBadge = row.meta?.showBadge ?? false
      form.showTextBadge = row.meta?.showTextBadge || ''
      form.fixedTab = row.meta?.fixedTab ?? false
      form.activePath = row.meta?.activePath || ''
      form.roles = row.meta?.roles || []
      form.isFullPage = row.meta?.isFullPage ?? false
    } else {
      const row = props.editData
      form.authName = row.title || ''
      form.authLabel = row.authMark || ''
      form.authIcon = row.icon || ''
      form.authSort = row.sort || 1
    }
  }

  const handleSubmit = async (): Promise<void> => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      emit('submit', { ...form })
      ElMessage.success(`${isEdit.value ? 'Chỉnh sửa' : 'Thêm mới'}Thành công`)
      handleCancel()
    } catch {
      ElMessage.error('Xác thực biểu mẫu thất bại, vui lòng kiểm tra dữ liệu nhập')
    }
  }

  const handleCancel = (): void => {
    emit('update:visible', false)
  }

  const handleClosed = (): void => {
    resetForm()
    isEdit.value = false
  }

  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        form.menuType = props.type
        nextTick(() => {
          if (props.editData) {
            loadFormData()
          }
        })
      }
    }
  )

  watch(
    () => props.type,
    (newType) => {
      if (props.visible) {
        form.menuType = newType
      }
    }
  )
</script>
