<template>
  <ElDialog
    v-model="visible"
    :title="title"
    width="400px"
    @closed="handleClosed"
  >
    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <ElFormItem label="Giá trị hiện tại">
        <span class="text-xl font-bold text-primary">{{ currentValue }}</span>
      </ElFormItem>
      <ElFormItem label="Thao tác" prop="type">
        <ElRadioGroup v-model="form.type">
          <ElRadio :label="1">Tăng</ElRadio>
          <ElRadio :label="2">Giảm</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="Số tiền thay đổi" prop="money">
        <ElInput v-model="form.money" type="number" placeholder="Vui lòng nhập số tiền thay đổi" />
      </ElFormItem>
      <ElFormItem label="Ghi chú" prop="remark">
        <ElInput v-model="form.remark" type="textarea" placeholder="Vui lòng nhập ghi chú (tùy chọn)" />
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
import { ref, computed, watch } from 'vue'
import { updateBalance, updateXima } from '@/api/member'

const props = withDefaults(defineProps<{
  modelValue: boolean
  type: 'balance' | 'xima' | 'point'
  memberId: number
  currentValue: number
}>(), {
  memberId: 0,
  currentValue: 0
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const title = computed(() => {
  const map = {
    balance: 'Điều chỉnh số dư',
    point: 'Điều chỉnh tích lũy',
    xima: 'Điều chỉnh số dư hoàn mã'
  }
  return map[props.type]
})

const formRef = ref()
const loading = ref(false)
const form = ref({
  type: 1,
  money: '',
  remark: ''
})

const rules = {
  type: [{ required: true, message: 'Vui lòng chọn loại thao tác', trigger: 'change' }],
  money: [{ required: true, message: 'Vui lòng nhập số tiền thay đổi', trigger: 'blur' }]
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      form.value = { type: 1, money: '', remark: '' }
    }
  }
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

        const typeValue = form.value.type === 1 ? 1 : -1
        const amountValue = Number(form.value.money)

        if (props.type === 'balance') {
          await updateBalance({
            id: props.memberId,
            balance: amountValue,
            type: typeValue,
            remark: form.value.remark
          })
        } else {
          await updateXima({
            id: props.memberId,
            xima: amountValue,
            type: typeValue,
            remark: form.value.remark
          })
        }

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

<style scoped>
.text-primary {
  color: var(--el-color-primary);
}
</style>
