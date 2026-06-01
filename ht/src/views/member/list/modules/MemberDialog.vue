<template>
  <ElDialog
    v-model="visible"
    :title="title"
    width="600px"
    @closed="handleClosed"
  >
    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <ElFormItem label="Nhóm hội viên" prop="groupid">
        <ElSelect v-model="form.groupid" placeholder="Vui lòng chọn nhóm hội viên">
          <ElOption
            v-for="item in groupList"
            :key="item.groupid"
            :label="item.groupname"
            :value="item.groupid"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="Tên người dùng" prop="username">
        <ElInput v-model="form.username" :disabled="type === 'edit'" />
      </ElFormItem>
      <ElFormItem label="Mật khẩu" prop="password" v-if="type === 'add'">
        <ElInput v-model="form.password" type="password" show-password />
      </ElFormItem>
       <ElFormItem label="Mật khẩu" prop="password" v-else>
        <ElInput v-model="form.password" type="password" placeholder="Để trống nếu không sửa" show-password />
      </ElFormItem>
      <ElFormItem label="Họ tên" prop="userbankname">
        <ElInput v-model="form.userbankname" />
      </ElFormItem>
      <ElFormItem label="Biệt danh" prop="nickname">
        <ElInput v-model="form.nickname" />
      </ElFormItem>
      <ElFormItem label="Loại" prop="proxy">
        <ElRadioGroup v-model="form.proxy">
          <ElRadio :label="0">Hội viên</ElRadio>
          <ElRadio :label="1">Đại lý</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="Mật khẩu tài chính" prop="fundPassword" v-if="type === 'edit'">
        <ElInput v-model="form.fundPassword" type="password" placeholder="Để trống nếu không sửa, xóa trống để xóa mật khẩu tài chính" show-password />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="visible = false">Hủy</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleSubmit">
        Xác nhận
      </ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Member, MemberGroup } from '@/api/member'
import { createMember, updateMember, resetFundPassword } from '@/api/member'


const props = defineProps<{
  modelValue: boolean
  type: 'add' | 'edit'
  data?: Partial<Member>
  groupList: MemberGroup[]
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const title = computed(() => (props.type === 'add' ? 'Thêm thành viên' : 'Chỉnh sửa thành viên'))

const formRef = ref()
const loading = ref(false)
const form = ref<any>({
  groupid: undefined,
  username: '',
  password: '',
  userbankname: '',
  nickname: '',
  proxy: 0,
  fundPassword: ''
})

const rules = computed(() => ({
  groupid: [{ required: true, message: 'Vui lòng chọn nhóm hội viên', trigger: 'change' }],
  username: [{ required: true, message: 'Vui lòng nhập tên người dùng', trigger: 'blur' }],
  password: [{ required: props.type === 'add', message: 'Vui lòng nhập mật khẩu', trigger: 'blur' }]
}))

watch(
  () => props.data,
  (val) => {
    if (val && props.type === 'edit') {
      form.value = { ...val, password: '', fundPassword: '' }
    } else {
      form.value = {
        groupid: undefined,
        username: '',
        password: '',
        userbankname: '',
        nickname: '',
        proxy: 0,
        fundPassword: ''
      }
    }
  },
  { immediate: true }
)

const handleClosed = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const formData = { ...form.value }
        if (props.type === 'add') {
          await createMember(formData)
          emit('submit')
        } else {

          if (formData.fundPassword !== undefined && formData.fundPassword !== '') {
            await resetFundPassword({ id: formData.id, password: formData.fundPassword })
          }

          const { fundPassword, ...editData } = formData
          await updateMember(editData)
          emit('submit')
        }
        visible.value = false
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>
