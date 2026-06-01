<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? 'Thêm người dùng' : 'Chỉnh sửa người dùng'"
    width="30%"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <ElFormItem label="Tên người dùng" prop="username">
        <ElInput v-model="formData.username" placeholder="Vui lòng nhập tên người dùng" />
      </ElFormItem>
      <ElFormItem label="Số điện thoại" prop="phone">
        <ElInput v-model="formData.phone" placeholder="Vui lòng nhập số điện thoại" />
      </ElFormItem>
      <ElFormItem label="Giới tính" prop="gender">
        <ElSelect v-model="formData.gender">
          <ElOption label="Nam" value="Nam" />
          <ElOption label="Nữ" value="Nữ" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="Vai trò" prop="role">
        <ElSelect v-model="formData.role" multiple>
          <ElOption
            v-for="role in roleList"
            :key="role.roleCode"
            :value="role.roleCode"
            :label="role.roleName"
          />
        </ElSelect>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">Hủy</ElButton>
        <ElButton type="primary" @click="handleSubmit">Gửi</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { ROLE_LIST_DATA } from '@/mock/temp/formData'
  import type { FormInstance, FormRules } from 'element-plus'

  interface Props {
    visible: boolean
    type: string
    userData?: Partial<Api.SystemManage.UserListItem>
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const roleList = ref(ROLE_LIST_DATA)

  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  const dialogType = computed(() => props.type)

  const formRef = ref<FormInstance>()

  const formData = reactive({
    username: '',
    phone: '',
    gender: 'Nam',
    role: [] as string[]
  })

  const rules: FormRules = {
    username: [
      { required: true, message: 'Vui lòng nhập tên người dùng', trigger: 'blur' },
      { min: 2, max: 20, message: 'Độ dài trong 2 đến 20 ký tự', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: 'Vui lòng nhập đúng định dạng số điện thoại', trigger: 'blur' }
    ],
    gender: [{ required: true, message: 'Vui lòng chọn giới tính', trigger: 'blur' }],
    role: [{ required: true, message: 'Vui lòng chọn vai trò', trigger: 'blur' }]
  }

  const initFormData = () => {
    const isEdit = props.type === 'edit' && props.userData
    const row = props.userData

    Object.assign(formData, {
      username: isEdit && row ? row.userName || '' : '',
      phone: isEdit && row ? row.userPhone || '' : '',
      gender: isEdit && row ? row.userGender || 'Nam' : 'Nam',
      role: isEdit && row ? (Array.isArray(row.userRoles) ? row.userRoles : []) : []
    })
  }

  watch(
    () => [props.visible, props.type, props.userData],
    ([visible]) => {
      if (visible) {
        initFormData()
        nextTick(() => {
          formRef.value?.clearValidate()
        })
      }
    },
    { immediate: true }
  )

  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success(dialogType.value === 'add' ? 'Thêm thành công' : 'Cập nhật thành công')
        dialogVisible.value = false
        emit('submit')
      }
    })
  }
</script>
