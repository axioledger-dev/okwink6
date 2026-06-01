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

  const rules = {

  }

  const statusOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([])

  function fetchStatusOptions(): Promise<typeof statusOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: 'Trực tuyến', value: '1' },
          { label: 'Ngoại tuyến', value: '2' },
          { label: 'Bất thường', value: '3' },
          { label: 'Đã hủy', value: '4' }
        ])
      }, 1000)
    })
  }

  onMounted(async () => {
    statusOptions.value = await fetchStatusOptions()
  })

  const formItems = computed(() => [
    {
      label: 'Tên người dùng',
      key: 'userName',
      type: 'input',
      placeholder: 'Vui lòng nhập tên người dùng',
      clearable: true
    },
    {
      label: 'Số điện thoại',
      key: 'userPhone',
      type: 'input',
      props: { placeholder: 'Vui lòng nhập số điện thoại', maxlength: '11' }
    },
    {
      label: 'Email',
      key: 'userEmail',
      type: 'input',
      props: { placeholder: 'Vui lòng nhập email' }
    },
    {
      label: 'Trạng thái',
      key: 'status',
      type: 'select',
      props: {
        placeholder: 'Vui lòng chọn trạng thái',
        options: statusOptions.value
      }
    },
    {
      label: 'Giới tính',
      key: 'userGender',
      type: 'radiogroup',
      props: {
        options: [
          { label: 'Nam', value: '1' },
          { label: 'Nữ', value: '2' }
        ]
      }
    }
  ])

  function handleReset() {
    console.log('Đặt lại biểu mẫu')
    emit('reset')
  }

  async function handleSearch() {
    await searchBarRef.value.validate()
    emit('search', formData.value)
    console.log('Dữ liệu biểu mẫu', formData.value)
  }
</script>
