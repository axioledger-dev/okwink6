
<template>
  <div class="pb-5">
    <h2 class="mb-1 text-lg font-medium">cơsở示ví dụ（默认Thu gọn）</h2>
    <ArtSearchBar
      ref="searchBarBasicRef"
      v-model="formDataBasic"
      :items="formItemsBasic"
      @reset="handleBasicReset"
      @search="handleBasicSearch"
    >
    </ArtSearchBar>

    <h2 class="mb-1 mt-3.5 text-lg font-medium">完整示ví dụ（默认Mở rộng）</h2>
    <ArtSearchBar
      ref="searchBarAdvancedRef"
      v-model="formDataAdvanced"
      :items="formItemsAdvanced"
      :rules="rulesAdvanced"
      :defaultExpanded="true"
      :labelWidth="labelWidthAdvanced"
      :labelPosition="labelPositionAdvanced"
      :span="spanAdvanced"
      :gutter="gutterAdvanced"
      @reset="handleAdvancedReset"
      @search="handleAdvancedSearch"
    >
      <template #slots>
        <ElInput v-model="formDataAdvanced.slots" placeholder="tôilà插槽渲染出来tổviệc" />
      </template>
    </ArtSearchBar>

    <div class="art-card p-5 !rounded-lg mt-5">
      <pre><code>{{ formDataAdvanced }}</code></pre>
    </div>

    <div class="mt-3.5">
      <ElSpace wrap>
        <ElButton @click="getLevelOptions"> 获取dùnghộv.vcấp数据 </ElButton>
        <ElButton @click="advancedValidate"> 校验表单 </ElButton>
        <ElButton @click="advancedReset"> Đặt lại </ElButton>
        <ElButton v-if="showUserName" @click="updateUserName"> Sửadùnghộ名 </ElButton>
        <ElButton v-if="showUserName" @click="deleteUserName"> Xóadùnghộ名 </ElButton>
        <ElButton @click="labelWidthAdvanced = 120"> Sửa label 宽độ </ElButton>
        <ElButton @click="spanAdvanced = 8"> 设trí一行Hiển thịtổviệc数 </ElButton>
        <ElButton @click="gutterAdvanced = 50"> Sửa gutter </ElButton>
        <ElButton @click="labelPositionAdvanced = 'left'"> label 左với齐 </ElButton>
        <ElButton @click="labelPositionAdvanced = 'right'"> label 右với齐 </ElButton>
        <ElButton @click="labelPositionAdvanced = 'top'"> label đỉnhbộvới齐 </ElButton>
      </ElSpace>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElInput } from 'element-plus'
  import { SearchFormItem } from '@/components/core/forms/art-search-bar/index.vue'

  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }

  interface OptionItem {
    label: string
    value: string
    disabled?: boolean
  }

  interface BasicFormData {
    name?: string
    phone?: string
    level?: string
    address?: string
    date?: string
    daterange?: string[]
    status?: boolean
  }

  interface AdvancedFormData extends BasicFormData {
    slots?: string
    cascader?: string[]
    checkboxgroup?: string[]
    userGender?: string
    iconSelector?: string
    systemName?: string
  }

  const emit = defineEmits<Emits>()

  const FETCH_DELAY = 500

  const searchBarBasicRef = ref()
  const searchBarAdvancedRef = ref()

  const formDataBasic = ref<BasicFormData>({
    name: undefined,
    phone: undefined,
    level: undefined,
    address: undefined,
    date: undefined,
    daterange: undefined,
    status: undefined
  })

  const formDataAdvanced = ref<AdvancedFormData>({
    name: undefined,
    phone: undefined,
    level: undefined,
    address: undefined,
    slots: undefined,
    date: undefined,
    daterange: undefined,
    cascader: undefined,
    checkboxgroup: undefined,
    userGender: undefined,
    iconSelector: undefined,
    status: undefined,
    systemName: undefined
  })

  const rulesAdvanced = {
    name: [{ required: true, message: 'Vui lòng nhậpdùnghộ名', trigger: 'blur' }],
    phone: [
      { required: true, message: 'Vui lòng nhập手机số', trigger: 'blur' },
      { min: 11, max: 11, message: 'Vui lòng nhập11vị手机số', trigger: 'blur' },
      { pattern: /^1[3456789]\d{9}$/, message: 'Vui lòng nhập正确手机số', trigger: 'blur' }
    ],
    level: [{ required: true, message: 'Vui lòng chọnv.vcấp', trigger: 'change' }],
    address: [{ required: true, message: 'Vui lòng nhậpđấtchỉ', trigger: 'blur' }]
  }

  const labelWidthAdvanced = ref(100)
  const labelPositionAdvanced = ref<'right' | 'left' | 'top'>('right')
  const spanAdvanced = ref(6)
  const gutterAdvanced = ref(12)

  const levelOptions = ref<OptionItem[]>([])

  const LEVEL_OPTIONS: OptionItem[] = [
    { label: '普thôngdùnghộ', value: 'normal' },
    { label: 'VIPdùnghộ', value: 'vip' },
    { label: '高cấpVIP', value: 'svip' },
    { label: 'doanhnghiệpdùnghộ', value: 'enterprise', disabled: true }
  ]

  const GENDER_OPTIONS: OptionItem[] = [
    { label: '男', value: '1' },
    { label: '女', value: '2' }
  ]

  const DATE_SHORTCUTS = [
    { text: '今日', value: new Date() },
    { text: '昨日', value: () => new Date(Date.now() - 86400000) },
    { text: '一周前', value: () => new Date(Date.now() - 604800000) }
  ]

  const fetchLevelOptions = (): Promise<OptionItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(LEVEL_OPTIONS)
      }, FETCH_DELAY)
    })
  }

  const getLevelOptions = async (): Promise<void> => {
    levelOptions.value = await fetchLevelOptions()
    if (levelOptions.value.length) {
      ElMessage.success('成công获取đến数据')
    }
  }

  interface FormItemConfig {
    label: string
    key: string
    type: string
    placeholder?: string
    clearable?: boolean
    props?: Record<string, any>
    [key: string]: any
  }

  const createFormItem = (config: FormItemConfig) => config

  const baseFormItems = {
    username: createFormItem({
      label: 'dùnghộ名',
      key: 'name',
      type: 'input',
      placeholder: 'Vui lòng nhậpdùnghộ名',
      clearable: true
    }),
    phone: createFormItem({
      label: '手机số',
      key: 'phone',
      type: 'input',
      props: { placeholder: 'Vui lòng nhập手机số', maxlength: '11' }
    }),
    level: createFormItem({
      label: 'dùnghộv.vcấp',
      key: 'level',
      type: 'select',
      props: {
        placeholder: 'Vui lòng chọnv.vcấp',
        options: LEVEL_OPTIONS
      }
    }),
    address: createFormItem({
      label: 'đấtchỉ',
      key: 'address',
      type: 'input',
      placeholder: 'Vui lòng nhậpđấtchỉ'
    }),
    date: createFormItem({
      label: '日kỳ',
      key: 'date',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        placeholder: 'Vui lòng chọn日kỳ',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        shortcuts: DATE_SHORTCUTS
      }
    }),
    gender: createFormItem({
      label: '性đừng',
      key: 'userGender',
      type: 'radiogroup',
      props: {
        options: GENDER_OPTIONS
      }
    })
  }

  const formItemsBasic = computed(() => [
    baseFormItems.username,
    {
      label: '密码',
      key: 'password',
      type: 'input',
      props: {
        type: 'password',
        placeholder: 'Vui lòng nhập密码',
        clearable: true
      }
    },
    baseFormItems.phone,
    baseFormItems.level,
    baseFormItems.address,
    baseFormItems.date,
    baseFormItems.gender
  ])

  const userItem = ref<SearchFormItem>({
    label: 'dùnghộ名',
    key: 'name',
    type: 'input',
    props: {
      placeholder: 'Vui lòng nhậpdùnghộ名',
      clearable: true
    }
  })

  const showUserName = ref(true)

  const cascaderOptions = [
    {
      value: 'guide',
      label: '指南',
      children: [
        {
          value: 'disciplines',
          label: '规范',
          children: [
            { value: 'consistency', label: '一致性' },
            { value: 'feedback', label: '反馈' },
            { value: 'efficiency', label: '效率' },
            { value: 'controllability', label: 'có thể控性' }
          ]
        }
      ]
    },
    {
      value: 'components',
      label: 'tổviệc',
      children: [
        {
          value: 'basic',
          label: 'cơsởtổviệc',
          children: [
            { value: 'button', label: 'theo钮' },
            { value: 'form', label: '表单' },
            { value: 'table', label: '表格' }
          ]
        }
      ]
    }
  ]

  const treeSelectData = [
    {
      value: '1',
      label: '一cấp 1',
      children: [
        {
          value: '1-1',
          label: '二cấp 1-1',
          children: [{ value: '1-1-1', label: '三cấp 1-1-1' }]
        }
      ]
    },
    {
      value: '2',
      label: '一cấp 2',
      children: [
        {
          value: '2-1',
          label: '二cấp 2-1',
          children: [{ value: '2-1-1', label: '三cấp 2-1-1' }]
        },
        {
          value: '2-2',
          label: '二cấp 2-2',
          children: [{ value: '2-2-1', label: '三cấp 2-2-1' }]
        }
      ]
    }
  ]

  const checkboxOptions = [
    { label: '选mục1', value: 'option1' },
    { label: '选mục2', value: 'option2' },
    { label: '选mục3', value: 'option3' },
    { label: '选mục4', value: 'option4' },
    { label: '选mục5（disabled）', value: 'option5', disabled: true }
  ]

  const formItemsAdvanced = computed(() => [
    ...(showUserName.value ? [userItem.value] : []),
    {
      ...baseFormItems.phone
    },
    {
      ...baseFormItems.level,
      props: { placeholder: 'Vui lòng chọnv.vcấp', options: levelOptions.value }
    },
    baseFormItems.address,
    baseFormItems.date,

    {
      label: '日kỳ时gian',
      key: 'datetime',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        placeholder: 'Vui lòng chọn日kỳ时gian',
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    },
    {
      label: '日kỳ范围',
      key: 'daterange',
      type: 'datetime',
      props: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        rangeSeparator: '至',
        startPlaceholder: '开始日kỳ',
        endPlaceholder: '结束日kỳ'
      }
    },

    {
      label: '日kỳ时gian范围',
      key: 'datetimerange',
      type: 'datetime',
      props: {
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        rangeSeparator: '至',
        startPlaceholder: '开始日kỳ时gian',
        endPlaceholder: '结束日kỳ时gian'
      }
    },

    {
      label: '时gian选择',
      key: 'timeselect',
      type: 'timeselect',
      props: {
        placeholder: 'Vui lòng chọn时gian',
        type: 'time',
        valueFormat: 'HH:mm:ss'
      }
    },

    {
      label: '时gian选择器',
      key: 'timepicker',
      type: 'timepicker',
      props: {
        style: { width: '100%' },
        placeholder: 'Vui lòng chọn时gian',
        type: 'time',
        valueFormat: 'HH:mm:ss'
      }
    },

    {
      label: 'cấp联选择',
      key: 'cascader',
      type: 'cascader',
      props: {
        placeholder: 'Vui lòng chọncấp联选择器',
        clearable: true,
        style: { width: '100%' },
        collapseTags: true,
        maxCollapseTags: 1,
        props: { multiple: true },
        options: cascaderOptions
      }
    },

    {
      label: '树kiểu选择器',
      key: 'treeSelect',
      type: 'treeselect',
      props: {
        showCheckbox: true,
        multiple: true,
        clearable: true,
        data: treeSelectData
      }
    },
    { label: '插槽', key: 'slots', type: 'input', placeholder: 'Vui lòng nhập邮箱' },
    {
      label: '渲染tổviệc',
      key: 'iconSelector',
      render: () => h(ElInput, { placeholder: '渲染tự定义 input' })
    },
    {
      label: 'tự定义tổviệc',
      key: 'customComponent',
      render: () =>
        h(
          'div',
          {
            style:
              'color: var(--art-gray-600); border: 1px solid var(--default-border-dashed); padding: 0px 15px; border-radius: 6px'
          },
          'tôilà一tự定义tổviệc'
        )
    },
    {
      label: '复选框',
      key: 'checkboxgroup',
      type: 'checkboxgroup',
      span: 12,
      props: {
        options: checkboxOptions
      }
    },
    {
      ...baseFormItems.gender
    },

    {
      label: 'là否启dùng',
      key: 'isEnabled',
      type: 'switch',
      props: {
        placeholder: 'Vui lòng chọnlà否启dùng'
      }
    },
    {
      label: '年龄',
      key: 'age',
      type: 'number',
      slots: {
        suffix: () => h('span', { style: 'color: #909399; font-size: 12px' }, '岁')
      }
    },
    {
      label: 'mạngtrạmđấtchỉ',
      key: 'website',
      type: 'input',
      placeholder: 'Vui lòng nhậpmạngtrạm名称',
      slots: {
        prepend: () => h('span', 'https://'),
        append: () => h('span', '.com')
      }
    },
    {
      label: 'sựviệc演示',
      key: 'event',
      type: 'input',
      props: {
        placeholder: 'nhập内容触发sựviệc，控制đàiXem',
        clearable: true,
        prefixIcon: 'Search',

        onInput(val: string) {
          console.log('nhậpsựviệc', val)
        },
        onClear() {
          console.log('Xóa trốngsựviệc')
        }
      }
    },

    {
      label: '多行nhập',
      key: 'remark',
      type: 'input',
      props: {
        placeholder: 'Vui lòng nhập备注',
        type: 'textarea',
        rows: 2
      }
    },
    {
      label: '评phần',
      key: 'rate',
      type: 'rate',
      props: {
        size: 'large',
        placeholder: 'Vui lòng chọn评phần'
      }
    },
    {
      label: '禁dùng',
      key: 'diaabled',
      type: 'input',
      placeholder: 'tôibị禁dùng',
      disabled: true
    },
    {
      label: '滑khối',
      key: 'slider',
      type: 'slider'

    },

    {
      label: '隐藏',
      key: 'email',
      type: 'input',
      hidden: true
    },

    {
      label: '根据điềuviệc隐藏',
      key: 'systemName',
      type: 'input',
      hidden: formDataAdvanced.value.systemName === 'mac',
      placeholder: 'nhập mac tổviệc隐藏'
    },
    {
      label: '栅格布cục',
      key: 'sg1',
      type: 'input',
      span: 12,
      placeholder: '示ví dụ：栅格 span=12 占Container一半宽độ，span=24 占满Container'
    }
  ])

  const createFormHandler = (ref: Ref<any>, formData: Record<string, any>, type: string) => ({
    reset: () => {
      console.log(`Đặt lại${type}表单`)
      emit('reset')
    },
    search: async () => {
      await ref.value.validate()
      emit('search', formData.value)
      console.log(`${type}表单数据`, formData.value)
    },
    validate: () => ref.value.validate()
  })

  const basicFormHandler = computed(() =>
    createFormHandler(searchBarBasicRef, formDataBasic, 'cơsở')
  )

  const advancedFormHandler = computed(() =>
    createFormHandler(searchBarAdvancedRef, formDataAdvanced, '完整')
  )

  const handleBasicReset = () => basicFormHandler.value.reset()

  const handleBasicSearch = () => basicFormHandler.value.search()

  const handleAdvancedReset = () => advancedFormHandler.value.reset()

  const handleAdvancedSearch = () => advancedFormHandler.value.search()

  const advancedValidate = () => advancedFormHandler.value.validate()

  const advancedReset = () => searchBarAdvancedRef.value.reset()

  const updateUserName = (): void => {
    userItem.value = {
      ...userItem.value,
      label: '昵称',
      props: {
        placeholder: 'Vui lòng nhập昵称'
      }
    }
  }

  const deleteUserName = (): void => {
    showUserName.value = false
    formDataAdvanced.value.name = undefined
  }
</script>
