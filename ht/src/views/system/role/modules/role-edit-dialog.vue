<template>
  <ElDialog
    v-model="visible"
    :title="dialogType === 'add' ? 'Thêm vai trò' : 'Chỉnh sửa vai trò'"
    width="30%"
    align-center
    @close="handleClose"
  >
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem label="Tên vai trò" prop="roleName">
        <ElInput v-model="form.roleName" placeholder="Vui lòng nhập tên vai trò" />
      </ElFormItem>
      <ElFormItem label="Mã vai trò" prop="roleCode">
        <ElInput v-model="form.roleCode" placeholder="Vui lòng nhập mã vai trò" />
      </ElFormItem>
      <ElFormItem label="Mô tả" prop="description">
        <ElInput
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="Vui lòng nhập mô tả vai trò"
        />
      </ElFormItem>
      <ElFormItem label="Bật">
        <ElSwitch v-model="form.enabled" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="handleClose">Hủy</ElButton>
      <ElButton type="primary" @click="handleSubmit">Gửi</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'

  type RoleListItem = Api.SystemManage.RoleListItem

  interface Props {
    modelValue: boolean
    dialogType: 'add' | 'edit'
    roleData?: RoleListItem
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'success'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    dialogType: 'add',
    roleData: undefined
  })

  const emit = defineEmits<Emits>()

  const formRef = ref<FormInstance>()

  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  const rules = reactive<FormRules>({
    roleName: [
      { required: true, message: 'Vui lòng nhập tên vai trò', trigger: 'blur' },
      { min: 2, max: 20, message: 'Độ dài trong 2 đến 20 ký tự', trigger: 'blur' }
    ],
    roleCode: [
      { required: true, message: 'Vui lòng nhập mã vai trò', trigger: 'blur' },
      { min: 2, max: 50, message: 'Độ dài trong 2 đến 50 ký tự', trigger: 'blur' }
    ],
    description: [{ required: true, message: 'Vui lòng nhập mô tả vai trò', trigger: 'blur' }]
  })

  const form = reactive<RoleListItem>({
    roleId: 0,
    roleName: '',
    roleCode: '',
    description: '',
    createTime: '',
    enabled: true
  })

  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal) initForm()
    }
  )

  watch(
    () => props.roleData,
    (newData) => {
      if (newData && props.modelValue) initForm()
    },
    { deep: true }
  )

  const initForm = () => {
    if (props.dialogType === 'edit' && props.roleData) {
      Object.assign(form, props.roleData)
    } else {
      Object.assign(form, {
        roleId: 0,
        roleName: '',
        roleCode: '',
        description: '',
        createTime: '',
        enabled: true
      })
    }
  }

  const handleClose = () => {
    visible.value = false
    formRef.value?.resetFields()
  }

  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()

      const message = props.dialogType === 'add' ? 'Thêm thành công' : 'Sửa thành công'
      ElMessage.success(message)
      emit('success')
      handleClose()
    } catch {

    }
  }
</script>
