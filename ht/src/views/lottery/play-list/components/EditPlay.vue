<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchSavePlay, fetchGetPlayDetail } from '@/api/lottery'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  playId: {
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
  typeid: '',
  playid: '',
  title: '',
  rate: 0,
  maxprize: 0,
  totalzs: 0,
  minxf: 0,
  maxxf: 0,
  isopen: 1
})

const rules = {
  rate: [{ required: true, message: 'Vui lòng nhập tỷ lệ', trigger: 'blur' }],
  minxf: [{ required: true, message: 'Vui lòng nhập cược tối thiểu', trigger: 'blur' }],
  maxxf: [{ required: true, message: 'Vui lòng nhập cược tối đa', trigger: 'blur' }]
}

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val && props.playId) {
      loadData()
    }
  }
)

watch(visible, (val) => {
  emit('update:modelValue', val)
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetchGetPlayDetail(props.playId)
    if (res) {
      Object.assign(form, res)
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        await fetchSavePlay(form)
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
    title="Chỉnh sửa cách chơi"
    width="550px"
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
      <el-form-item label="ID cách chơi">
        <el-input v-model="form.playid" disabled />
      </el-form-item>

      <el-form-item label="Tên cách chơi">
        <el-input v-model="form.title" disabled />
      </el-form-item>

      <el-form-item label="Tỷ lệ cược" prop="rate">
        <el-input-number v-model="form.rate" :precision="4" :step="0.01" :min="0" style="width: 100%" />
      </el-form-item>

      <el-form-item label="Tiền thưởng cao nhất" prop="maxprize">
        <el-input-number v-model="form.maxprize" :min="0" style="width: 100%" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Cược tối thiểu" prop="minxf">
            <el-input-number v-model="form.minxf" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Cược tối đa" prop="maxxf">
            <el-input-number v-model="form.maxxf" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Tổng số cược">
        <el-input-number v-model="form.totalzs" :min="0" disabled style="width: 100%" />
      </el-form-item>

      <el-form-item label="Trạng thái">
        <el-switch
          v-model="form.isopen"
          :active-value="1"
          :inactive-value="0"
          active-text="Bật"
          inactive-text="Tắt"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="visible = false">Hủy</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">Xác nhận</el-button>
    </template>
  </el-dialog>
</template>
