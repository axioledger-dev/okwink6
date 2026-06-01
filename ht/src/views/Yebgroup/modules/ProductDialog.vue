<template>
  <ElDialog
    v-model="dialogVisible"
    :title="type === 'add' ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'"
    width="500px"
    @close="handleClose"
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <ElFormItem label="Tên sản phẩm" prop="name">
        <ElInput v-model="formData.name" placeholder="Vui lòng nhập tên sản phẩm" />
      </ElFormItem>
      <ElFormItem label="Loại" prop="type">
        <ElSelect v-model="formData.type" placeholder="Vui lòng chọn loại">
          <ElOption label="Nạp/rút linh hoạt" value="current" />
          <ElOption label="Định kỳ" value="fixed" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="Lãi suất ngày" prop="rate">
        <ElInputNumber v-model="formData.rate" :precision="6" :step="0.0001" :min="0" style="width: 100%" />
        <span class="text-gray-400 text-xs ml-2">Ví dụ 0.0003 tương đương 0.03%</span>
      </ElFormItem>
      <ElFormItem label="Mô tả lãi suất" prop="rate_desc">
        <ElInput v-model="formData.rate_desc" placeholder="Ví dụ 'Lãi suất năm 10.95%'" />
      </ElFormItem>
      <ElFormItem label="Số ngày chu kỳ" prop="duration_days">
        <ElInputNumber v-model="formData.duration_days" :min="0" :step="1" style="width: 100%" />
        <span class="text-gray-400 text-xs ml-2">Nạp/rút linh hoạt là 0, định kỳ lớn hơn 0</span>
      </ElFormItem>
      <ElFormItem label="Chu kỳ quyết toán" prop="settle_cycle_hours">
        <ElInputNumber v-model="formData.settle_cycle_hours" :min="1" :max="24" :step="1" style="width: 100%" />
        <span class="text-gray-400 text-xs ml-2">giờ, mặc định quyết toán 1 lần mỗi giờ</span>
      </ElFormItem>
      <ElFormItem label="Nạp tối thiểu" prop="min_amount">
        <ElInputNumber v-model="formData.min_amount" :min="0" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="Giới hạn lãi suất" prop="max_interest">
        <ElInputNumber v-model="formData.max_interest" :min="0" style="width: 100%" />
        <span class="text-gray-400 text-xs ml-2">0 nghĩa là không giới hạn</span>
      </ElFormItem>
      <ElFormItem label="Hệ số kiểm tra vòng cược" prop="audit_multiple">
        <ElInputNumber v-model="formData.audit_multiple" :min="0" :max="100" :precision="2" :step="0.1" style="width: 100%" />
        <span class="text-gray-400 text-xs ml-2">Yêu cầu dòng tiền rút tiền, 0 nghĩa là không cần dòng tiền</span>
      </ElFormItem>
      <ElFormItem label="Phương thức phát lợi nhuận" prop="auto_claim">
        <ElRadioGroup v-model="formData.auto_claim">
          <ElRadio :label="0">Nhận thủ công</ElRadio>
          <ElRadio :label="1">Tự động phát</ElRadio>
        </ElRadioGroup>
        <span class="text-gray-400 text-xs ml-2">Tự động phát chuyển trực tiếp vào số dư</span>
      </ElFormItem>
      <ElFormItem label="Sắp xếp" prop="sort">
        <ElInputNumber v-model="formData.sort" :min="0" style="width: 100%" />
      </ElFormItem>
      <ElFormItem label="Trạng thái" prop="status">
        <ElSwitch
          v-model="formData.status"
          :active-value="1"
          :inactive-value="0"
          active-text="Bật"
          inactive-text="Tắt"
        />
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
import { createProduct, updateProduct, type YebProduct } from '@/api/yebao'

const props = defineProps<{
  visible: boolean
  type: 'add' | 'edit'
  data: Partial<YebProduct>
}>()

const emit = defineEmits(['update:visible', 'submit'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const formRef = ref<FormInstance>()
const loading = ref(false)
const formData = ref<Partial<YebProduct>>({
  name: '',
  type: 'current',
  rate: 0,
  rate_desc: '',
  duration_days: 0,
  settle_cycle_hours: 1,
  min_amount: 0,
  max_interest: 0,
  audit_multiple: 1,
  auto_claim: 0,
  sort: 0,
  status: 1
})

const rules = {
  name: [{ required: true, message: 'Vui lòng nhập tên sản phẩm', trigger: 'blur' }],
  type: [{ required: true, message: 'Vui lòng chọn loại', trigger: 'change' }],
  rate: [{ required: true, message: 'Vui lòng nhập lãi suất ngày', trigger: 'blur' }],
  rate_desc: [{ required: true, message: 'Vui lòng nhập mô tả lãi suất', trigger: 'blur' }]
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.type === 'edit' && props.data) {
        formData.value = { ...props.data }
      } else {
        formData.value = {
          name: '',
          type: 'current',
          rate: 0,
          rate_desc: '',
          duration_days: 0,
          settle_cycle_hours: 1,
          min_amount: 0,
          max_interest: 0,
          audit_multiple: 1,
          auto_claim: 0,
          sort: 0,
          status: 1
        }
      }
    }
  }
)

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
        if (props.type === 'add') {
          await createProduct(formData.value)
        } else {
          await updateProduct(formData.value)
        }
        ElMessage.success(props.type === 'add' ? 'Thêm thành công' : 'Sửa thành công')
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
