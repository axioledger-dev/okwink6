
<template>
  <div class="yeb-config-page art-full-height">
    <ElCard class="config-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>Cấu hình quy tắc lãi suất</span>
          <ElButton type="primary" :loading="saving" @click="handleSave">
            <template #icon>
              <ArtSvgIcon icon="ri:save-line" />
            </template>
            Lưu cấu hình
          </ElButton>
        </div>
      </template>

      <ElForm
        ref="formRef"
        :model="configForm"
        :rules="rules"
        label-width="120px"
        v-loading="loading"
      >
        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="Chu kỳ quyết toán" prop="settle_cycle">
              <ElInput v-model="configForm.settle_cycle" placeholder="Ví dụ：1giờ">
                <template #append>
                  <ElInputNumber
                    v-model="configForm.settle_cycle_hours"
                    :min="1"
                    :max="24"
                    controls-position="right"
                    style="width: 100px"
                  />
                  giờ
                </template>
              </ElInput>
            </ElFormItem>
          </ElCol>

          <ElCol :span="12">
            <ElFormItem label="Lãi suất năm" prop="annual_rate">
              <ElInput v-model="configForm.annual_rate" placeholder="Ví dụ：4%">
                <template #append>
                  <ElInputNumber
                    v-model="configForm.annual_rate_value"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    :precision="4"
                    controls-position="right"
                    style="width: 120px"
                  />
                  (thập phân)
                </template>
              </ElInput>
            </ElFormItem>
          </ElCol>

          <ElCol :span="12">
            <ElFormItem label="Số tiền chuyển vào tối thiểu" prop="min_amount">
              <ElInputNumber
                v-model="configForm.min_amount"
                :min="1"
                :max="100000"
                controls-position="right"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>

          <ElCol :span="12">
            <ElFormItem label="Giới hạn lãi suất" prop="max_interest">
              <ElInput v-model="configForm.max_interest" placeholder="Ví dụ: Không giới hạn hoặc 1000" />
            </ElFormItem>
          </ElCol>

          <ElCol :span="12">
            <ElFormItem label="Thời gian nhận" prop="claim_time">
              <ElSelect v-model="configForm.claim_time" style="width: 100%">
                <ElOption label="Nhận theo thời gian thực" value="Nhận theo thời gian thực" />
                <ElOption label="Nhận vào ngày hôm sau" value="Nhận vào ngày hôm sau" />
                <ElOption label="Nhận hàng tuần" value="Nhận hàng tuần" />
              </ElSelect>
            </ElFormItem>
          </ElCol>

          <ElCol :span="12">
            <ElFormItem label="Hệ số kiểm tra vòng cược" prop="audit_multiple">
              <ElInputNumber
                v-model="configForm.audit_multiple"
                :min="0"
                :max="100"
                controls-position="right"
                style="width: 100%"
              />
              <div class="form-tip">Bội số yêu cầu dòng tiền đặt cược, 0 nghĩa là không cần dòng tiền</div>
            </ElFormItem>
          </ElCol>

          <ElCol :span="12">
            <ElFormItem label="Phương thức phát lợi nhuận" prop="auto_claim">
              <ElRadioGroup v-model="configForm.auto_claim">
                <ElRadio :label="0">Nhận thủ công</ElRadio>
                <ElRadio :label="1">Tự động phát</ElRadio>
              </ElRadioGroup>
              <div class="form-tip">Nhận thủ công: Lợi nhuận tích lũy chờ nhận, người dùng nhấp để nhận; Tự động phát: Chuyển trực tiếp vào số dư</div>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
    </ElCard>

    
    <ElCard class="preview-card" shadow="never">
      <template #header>
        <span>Xem trước hiển thị frontend</span>
      </template>
      <div class="rules-preview">
        <div class="rule-item">
          <span class="label">1. Giới thiệu lợi nhuận:</span>
          <span>Số tiền gửi vào lãi suất, ít nhất phải đủ một chu kỳ hoàn chỉnh mới sinh lãi, nếu rút ra giữa chừng thì chu kỳ đó không tính lợi nhuận.</span>
        </div>
        <div class="rule-item">
          <span class="label">2. Chu kỳ quyết toán:</span>
          <span>Chu kỳ quyết toán lãi suất hiện tại là <b>{{ configForm.settle_cycle }}</b>;</span>
        </div>
        <div class="rule-item">
          <span class="label">3. Lãi suất năm:</span>
          <span>Lãi suất năm hiện tại là <b>{{ configForm.annual_rate }}</b>;</span>
        </div>
        <div class="rule-item">
          <span class="label">4. Ngưỡng chuyển vào:</span>
          <span>Mỗi lần chuyển vào số tiền phải ≥ <b>{{ configForm.min_amount }}</b>;</span>
        </div>
        <div class="rule-item">
          <span class="label">5. Giới hạn lãi suất:</span>
          <span>Giới hạn lãi suất hiện tại là <b>{{ configForm.max_interest }}</b>;</span>
        </div>
        <div class="rule-item">
          <span class="label">6. Thời gian nhận:</span>
          <span>Hiện tại là <b>{{ configForm.claim_time }}</b>;</span>
        </div>
        <div class="rule-item">
          <span class="label">7. Hệ số kiểm tra vòng cược:</span>
          <span>Bội số kiểm tra hiện tại là <b>{{ configForm.audit_multiple }} lần</b> (Yêu cầu dòng tiền đặt cược);</span>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { fetchConfig, saveConfig, type YebConfig } from '@/api/yebao'

defineOptions({ name: 'YebConfig' })

const formRef = ref<FormInstance>()
const loading = ref(false)
const saving = ref(false)

const configForm = reactive<YebConfig>({
  settle_cycle: '1giờ',
  settle_cycle_hours: 1,
  annual_rate: '4%',
  annual_rate_value: 0.04,
  min_amount: 20,
  max_interest: 'Không giới hạn',
  claim_time: 'Nhận vào ngày hôm sau',
  audit_multiple: 1,
  auto_claim: 0
})

const rules: FormRules = {
  settle_cycle: [{ required: true, message: 'Vui lòng nhập chu kỳ quyết toán', trigger: 'blur' }],
  annual_rate: [{ required: true, message: 'Vui lòng nhập lãi suất năm', trigger: 'blur' }],
  min_amount: [{ required: true, message: 'Vui lòng nhập số tiền chuyển vào tối thiểu', trigger: 'blur' }],
  max_interest: [{ required: true, message: 'Vui lòng nhập giới hạn lãi suất', trigger: 'blur' }],
  claim_time: [{ required: true, message: 'Vui lòng chọn thời gian nhận', trigger: 'change' }],
  audit_multiple: [{ required: true, message: 'Vui lòng nhập bội số kiểm tra', trigger: 'blur' }]
}

const loadConfig = async () => {
  loading.value = true
  try {
    const res = await fetchConfig()
    if (res && res.data) {
      Object.assign(configForm, res.data)
    }
  } catch (error) {
    console.error('Tải cấu hình thất bại', error)
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    await saveConfig(configForm)
    ElMessage.success('Lưu thành công')
  } catch (error) {
    console.error('Lưu thất bại', error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadConfig()
})
</script>

<style scoped lang="scss">
.yeb-config-page {
  padding: 20px;
}

.config-card {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }
}

.preview-card {
  .rules-preview {
    .rule-item {
      padding: 8px 0;
      border-bottom: 1px dashed #eee;
      font-size: 14px;
      color: #666;

      &:last-child {
        border-bottom: none;
      }

      .label {
        color: #333;
        font-weight: 500;
      }

      b {
        color: #409eff;
      }
    }
  }
}
</style>
