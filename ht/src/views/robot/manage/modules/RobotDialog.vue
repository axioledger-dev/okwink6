<template>
  <ElDialog
    v-model="visible"
    :title="title"
    width="500px"
    @closed="handleClosed"
  >
    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <ElFormItem label="Nhóm hội viên" prop="groupid">
        <ElSelect v-model="form.groupid" placeholder="Vui lòng chọn nhóm hội viên" style="width: 100%">
          <ElOption
            v-for="item in groupList"
            :key="item.groupid"
            :label="item.groupname"
            :value="item.groupid"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="Tên người dùng" prop="username">
        <ElInput v-model="form.username" placeholder="Vui lòng nhập tên người dùng" />
      </ElFormItem>
      <ElFormItem label="Mật khẩu" prop="password">
        <ElInput v-model="form.password" type="password" show-password placeholder="Vui lòng nhập mật khẩu" />
      </ElFormItem>
      <ElFormItem label="Biệt danh" prop="nickname">
        <ElInput v-model="form.nickname" placeholder="Vui lòng nhập biệt danh" />
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
import { ref, computed, reactive, watch } from 'vue'
import { createRobot } from '@/api/robot'
import { MemberGroup } from '@/api/member'

const props = defineProps<{
  modelValue: boolean
  groupList: MemberGroup[]
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const title = 'Thêm robot'
const formRef = ref()
const loading = ref(false)

const form = reactive({
  groupid: undefined,
  username: '',
  password: '',
  nickname: ''
})

const rules = {
  groupid: [{ required: true, message: 'Vui lòng chọn nhóm hội viên', trigger: 'change' }],
  username: [{ required: true, message: 'Vui lòng nhập tên người dùng', trigger: 'blur' }],
  password: [{ required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' }]
}

const handleClosed = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.groupid = undefined
  form.username = ''
  form.password = ''
  form.nickname = ''
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        await createRobot({ ...form })
        emit('submit')
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
