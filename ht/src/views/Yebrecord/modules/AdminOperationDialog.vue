<template>
  <ElDialog
    v-model="dialogVisible"
    :title="type === 'deposit' ? 'Nạp thủ công' : 'Rút thủ công'"
    width="500px"
    @close="handleClose"
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <ElFormItem label="Tên người dùng" prop="username">
        <ElInput 
          v-model="formData.username" 
          placeholder="Vui lòng nhập tên người dùng" 
          @blur="handleUserCheck" 
        />
      </ElFormItem>
      
      <ElFormItem v-if="userInfo" label="Số dư hiện tại">
        <div class="text-sm text-gray-600">
          <p>Số dư linh hoạt: {{ userInfo.current_amount || 0 }}</p>
          <p>Số dư định kỳ: {{ userInfo.fixed_amount || 0 }}</p>
          <p>Tổng số dư YeBao: {{ userInfo.total_amount || 0 }}</p>
        </div>
      </ElFormItem>

      <template v-if="type === 'deposit'">
        <ElFormItem label="Sản phẩm" prop="product_id">
          <ElSelect v-model="formData.product_id" placeholder="Vui lòng chọn sản phẩm nạp vào" style="width: 100%">
            <ElOption
              v-for="item in productOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>
      </template>

      <template v-else>
        <ElFormItem label="Loại rút" prop="withdrawType">
          <ElSelect v-model="formData.withdrawType" placeholder="Vui lòng chọn loại" style="width: 100%">
            <ElOption label="Nạp/rút linh hoạt" value="current" />
            
          </ElSelect>
        </ElFormItem>
      </template>

      <ElFormItem label="Số tiền" prop="amount">
        <ElInputNumber 
          v-model="formData.amount" 
          :min="0" 
          :precision="2" 
          style="width: 100%" 
          placeholder="Vui lòng nhập số tiền"
        />
      </ElFormItem>

      <ElFormItem label="Ghi chú" prop="remark">
        <ElInput v-model="formData.remark" type="textarea" placeholder="Vui lòng nhập ghi chú" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="handleClose">Hủy</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleSubmit">Xác nhận</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { adminDeposit, adminWithdraw, fetchUserInfo, fetchProductOptions } from '@/api/yebao'

const props = defineProps<{
  visible: boolean
  type: 'deposit' | 'withdraw'
}>()

const emit = defineEmits(['update:visible', 'submit'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const formRef = ref<FormInstance>()
const loading = ref(false)
const userInfo = ref<any>(null)
const productOptions = ref<any[]>([])

const formData = ref({
  username: '',
  product_id: undefined as number | undefined,
  amount: 0,
  withdrawType: 'current',
  remark: ''
})

const rules = {
  username: [{ required: true, message: 'Vui lòng nhập tên người dùng', trigger: 'blur' }],
  amount: [{ required: true, message: 'Vui lòng nhập số tiền', trigger: 'blur' }],
  product_id: [{ required: true, message: 'Vui lòng chọn sản phẩm', trigger: 'change' }],
  withdrawType: [{ required: true, message: 'Vui lòng chọn loại', trigger: 'change' }]
}

const fetchProducts = async () => {
  try {
    const res = await fetchProductOptions()
    productOptions.value = res || []
  } catch (error) {
    console.error(error)
  }
}

const handleUserCheck = async () => {
  if (!formData.value.username) return
  try {
    const res = await fetchUserInfo(formData.value.username)
    userInfo.value = res
  } catch (error) {

    userInfo.value = null
  }
}


watch(() => props.type, (val) => {
  if (val === 'deposit') {
    fetchProducts()
  }
}, { immediate: true })

watch(() => props.visible, (val) => {
  if (val) {
    formData.value = {
      username: '',
      product_id: undefined,
      amount: 0,
      withdrawType: 'current',
      remark: ''
    }
    userInfo.value = null
    if (props.type === 'deposit') {
      fetchProducts()
    }
  }
})

const handleClose = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (props.type === 'deposit') {
          await adminDeposit({
            username: formData.value.username,
            product_id: formData.value.product_id!,
            amount: formData.value.amount,
            remark: formData.value.remark
          })
        } else {
          await adminWithdraw({
            username: formData.value.username,
            amount: formData.value.amount,
            type: formData.value.withdrawType,
            remark: formData.value.remark
          })
        }
        ElMessage.success('Thao tác thành công')
        emit('submit')
        handleClose()
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>
