<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
  >
  </ArtSearchBar>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: Record<string, any>
  }

  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const searchBarRef = ref()

  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  const rules = {}

  const statusOptions = ref([
    { label: 'Bật', value: true },
    { label: 'Tắt', value: false }
  ])

  const formItems = computed(() => [
    {
      label: 'Tên vai trò',
      key: 'roleName',
      type: 'input',
      placeholder: 'Vui lòng nhập tên vai trò',
      clearable: true
    },
    {
      label: 'Mã vai trò',
      key: 'roleCode',
      type: 'input',
      placeholder: 'Vui lòng nhập mã vai trò',
      clearable: true
    },
    {
      label: 'Mô tả vai trò',
      key: 'description',
      type: 'input',
      placeholder: 'Vui lòng nhập mô tả vai trò',
      clearable: true
    },
    {
      label: 'Trạng thái vai trò',
      key: 'enabled',
      type: 'select',
      props: {
        placeholder: 'Vui lòng chọn trạng thái',
        options: statusOptions.value,
        clearable: true
      }
    },
    {
      label: 'Ngày tạo',
      key: 'daterange',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        placeholder: 'Vui lòng chọn khoảng ngày',
        type: 'daterange',
        rangeSeparator: 'đến',
        startPlaceholder: 'Ngày bắt đầu',
        endPlaceholder: 'Ngày kết thúc',
        valueFormat: 'YYYY-MM-DD',
        shortcuts: [
          { text: 'Hôm nay', value: [new Date(), new Date()] },
          { text: 'Một tuần gần đây', value: [new Date(Date.now() - 604800000), new Date()] },
          { text: 'Một tháng gần đây', value: [new Date(Date.now() - 2592000000), new Date()] }
        ]
      }
    }
  ])

  const handleReset = () => {
    emit('reset')
  }

  const handleSearch = async () => {
    await searchBarRef.value.validate()
    emit('search', formData.value)
  }
</script>
