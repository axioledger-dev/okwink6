<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchSaveLottery, fetchGetLotteryDetail } from '@/api/lottery'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  lotteryId: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(false)
const loading = ref(false)
const formRef = ref()

const form = reactive({
  id: 0,
  title: '',
  name: '',
  typeid: '',
  ftitle: '',
  expecttime: 0,
  ftime: 0,
  qishu: 0,
  issys: 1,
  issd: 0,
  is_hot: 0,
  closetime1: '',
  closetime2: '',
  sort: 0,
  isopen: 1
})

const rules = {
  title: [{ required: true, message: 'Vui lòng nhập tên loại xổ số', trigger: 'blur' }],
  name: [{ required: true, message: 'Vui lòng nhập mã loại xổ số', trigger: 'blur' }],
  typeid: [{ required: true, message: 'Vui lòng chọn hoặc nhập phân loại', trigger: 'change' }],
  expecttime: [{ required: true, message: 'Vui lòng nhập khoảng cách mở thưởng', trigger: 'blur' }],
  ftime: [{ required: true, message: 'Vui lòng nhập thời gian đóng cửa', trigger: 'blur' }]
}


const lotteryTypes = [
  { label: 'Xổ số thời gian', value: 'ssc' },
  { label: 'K3', value: 'k3' },
  { label: '11chọn5', value: 'x5' },
  { label: 'Xổ số nhanh', value: 'keno' },
  { label: 'Lucky28', value: 'xy28' },
  { label: 'PK10', value: 'pk10' },
  { label: 'Xổ số động vật', value: 'dwc' },
  { label: 'Xổ số tần suất thấp', value: 'dpc' },
  { label: 'Lục hợp', value: 'lhc' }
]

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val && props.lotteryId) {
      loadData()
    } else if (val) {

      resetForm()
    }
  }
)

watch(visible, (val) => {
  emit('update:modelValue', val)
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetchGetLotteryDetail(props.lotteryId)
    if (res) {
      Object.assign(form, res)
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  if (formRef.value) {
    formRef.value.resetFields()
  }

  form.id = 0
  form.issys = 1
  form.issd = 0
  form.is_hot = 0
  form.isopen = 1
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        await fetchSaveLottery(form)
        ElMessage.success('Lưu thành công')
        visible.value = false
        emit('success')
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="form.id ? 'Chỉnh sửa loại xổ số' : 'Thêm loại xổ số'"
    width="600px"
    append-to-body
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="Tên loại xổ số" prop="title">
        <el-input v-model="form.title" placeholder="Vui lòng nhập tên loại xổ số" />
      </el-form-item>

      <el-form-item label="Mã loại xổ số" prop="name">
        <el-input v-model="form.name" placeholder="Ví dụ: dwc1, pk101" :disabled="!!form.id" />
        <span v-if="!form.id" class="text-gray-400 text-xs">Không thể sửa đổi sau khi thêm</span>
      </el-form-item>

      <el-form-item label="Phân loại thuộc về" prop="typeid">
        <el-select v-model="form.typeid" placeholder="Chọn hoặc nhập phân loại" style="width: 100%" filterable allow-create default-first-option>
          <el-option
            v-for="item in lotteryTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span class="text-gray-400 text-xs">Có thể tự nhập phân loại mới, ví dụ: dwc</span>
      </el-form-item>

      <el-form-item label="Giới thiệu loại xổ số" prop="ftitle">
        <el-input
          v-model="form.ftitle"
          type="textarea"
          :rows="3"
          placeholder="Vui lòng nhập giới thiệu loại xổ số"
        />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Khoảng cách mở thưởng" prop="expecttime">
            <el-input-number v-model="form.expecttime" :min="0" style="width: 100%" />
            <span class="text-gray-400 text-xs ml-2">phút</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Thời gian đóng cửa" prop="ftime">
            <el-input-number v-model="form.ftime" :min="0" style="width: 100%" />
            <span class="text-gray-400 text-xs ml-2">giây</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Số kỳ mỗi ngày" prop="qishu">
            <el-input-number v-model="form.qishu" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Sắp xếp" prop="sort">
            <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Nguồn dữ liệu">
            <el-switch
              v-model="form.issys"
              :active-value="1"
              :inactive-value="0"
              active-text="Xổ số hệ thống"
              inactive-text="Bên thứ ba"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Mở thưởng thủ công">
            <el-switch
              v-model="form.issd"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Loại xổ số nổi bật">
            <el-switch
              v-model="form.is_hot"
              :active-value="1"
              :inactive-value="0"
              active-text="Có"
              inactive-text="Không"
            />
            <span class="text-gray-400 text-xs ml-2">Sau khi bật sẽ hiển thị trong loại xổ số nổi bật trang chủ</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Thời gian nghỉ 1">
            <el-time-picker
              v-model="form.closetime1"
              value-format="HH:mm:ss"
              placeholder="Thời gian bắt đầu"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Thời gian nghỉ 2">
            <el-time-picker
              v-model="form.closetime2"
              value-format="HH:mm:ss"
              placeholder="Thời gian kết thúc"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <template #footer>
      <el-button @click="visible = false">Hủy</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">Xác nhận</el-button>
    </template>
  </el-dialog>
</template>
