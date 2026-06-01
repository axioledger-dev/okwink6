<template>
  <el-dialog
    v-model="visible"
    :title="`提现账hộ - ${memberUsername}`"
    width="900px"
    append-to-body
    destroy-on-close
  >
    <el-table v-loading="loading" :data="accountList" border>
      <el-table-column prop="id" label="ID" width="70" align="center" />
      <el-table-column prop="type" label="loạikiểu" width="90" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.type === 'bank'" type="primary" size="small">bạc行卡</el-tag>
          <el-tag v-else-if="row.type === 'usdt'" type="warning" size="small">USDT</el-tag>
          <el-tag v-else-if="row.type === 'alipay'" type="info" size="small">支付宝</el-tag>
          <el-tag v-else-if="row.type === 'wechat'" type="success" size="small">微信</el-tag>
          <span v-else>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账hộ信息" min-width="180">
        <template #default="{ row }">
          <div v-if="row.type === 'bank'">
            <div class="font-medium">{{ row.bank_name }}</div>
            <div class="text-gray-500 text-xs">{{ row.bank_account }}</div>
          </div>
          <div v-else-if="row.type === 'usdt'">
            <div class="font-medium">{{ row.usdt_network }}</div>
            <div class="text-gray-500 text-xs break-all">{{ row.usdt_address }}</div>
          </div>
          <div v-else>
            <div class="font-medium">{{ row.bank_account }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收khoản码" width="80" align="center">
        <template #default="{ row }">
          <el-image 
            v-if="row.qr_code" 
            :src="row.qr_code" 
            :preview-src-list="[row.qr_code]"
            fit="cover"
            style="width: 40px; height: 40px; cursor: pointer;"
            preview-teleported
          />
          <span v-else class="text-gray-400 text-xs">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="account_name" label="hộ名" width="100" />
      <el-table-column prop="is_default" label="默认" width="70" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.is_default === 1" type="success" size="small">là</el-tag>
          <el-tag v-else type="info" size="small">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handleEdit(row)">Chỉnh sửa</el-button>
          <el-button 
            size="small" 
            type="success" 
            @click="handleSetDefault(row)" 
            :disabled="row.is_default === 1"
          >
            设là默认
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="!loading && accountList.length === 0" class="text-center py-8 text-gray-400">
      nênsẽ员Chưachưa绑定提现账hộ
    </div>

    <template #footer>
      <el-button @click="visible = false">Đóng</el-button>
    </template>
  </el-dialog>

  
  <el-dialog
    v-model="editDialogVisible"
    title="Chỉnh sửa提现账hộ"
    width="500px"
    append-to-body
  >
    <el-form ref="formRef" :model="editForm" :rules="rules" label-width="100px">
      <el-form-item label="账hộloạikiểu">
        <el-tag v-if="editForm.type === 'bank'" type="primary">bạc行卡</el-tag>
        <el-tag v-else-if="editForm.type === 'usdt'" type="warning">USDT</el-tag>
        <el-tag v-else-if="editForm.type === 'alipay'" type="info">支付宝</el-tag>
        <el-tag v-else-if="editForm.type === 'wechat'" type="success">微信</el-tag>
      </el-form-item>
      
      
      <template v-if="editForm.type === 'bank'">
        <el-form-item label="bạc行名称" prop="bank_name">
          <el-input v-model="editForm.bank_name" placeholder="Vui lòng nhậpbạc行名称" />
        </el-form-item>
        <el-form-item label="bạc行账số" prop="bank_account">
          <el-input v-model="editForm.bank_account" placeholder="Vui lòng nhậpbạc行卡số" />
        </el-form-item>
        <el-form-item label="开hộ姓名" prop="account_name">
          <el-input v-model="editForm.account_name" placeholder="Vui lòng nhập开hộ人姓名" />
        </el-form-item>
        <el-form-item label="开hộ支行">
          <el-input v-model="editForm.bank_branch" placeholder="Vui lòng nhập开hộ支行（选填）" />
        </el-form-item>
      </template>

      
      <template v-if="editForm.type === 'usdt'">
        <el-form-item label="USDTmạng络" prop="usdt_network">
          <el-select v-model="editForm.usdt_network" placeholder="Vui lòng chọnmạng络" class="w-full">
            <el-option label="TRC20" value="TRC20" />
            <el-option label="ERC20" value="ERC20" />
          </el-select>
        </el-form-item>
        <el-form-item label="USDTđấtchỉ" prop="usdt_address">
          <el-input v-model="editForm.usdt_address" placeholder="Vui lòng nhậpUSDTđấtchỉ" />
        </el-form-item>
      </template>

      
      <template v-if="['alipay', 'wechat'].includes(editForm.type || '')">
        <el-form-item label="账số" prop="bank_account">
          <el-input v-model="editForm.bank_account" placeholder="Vui lòng nhập账số" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="account_name">
          <el-input v-model="editForm.account_name" placeholder="Vui lòng nhập真实姓名" />
        </el-form-item>
        <el-form-item label="收khoản码">
          <div class="flex items-center gap-4">
            <el-upload
              class="qr-uploader"
              :show-file-list="false"
              action="/app/admin/upload/image"
              :on-success="handleQrUploadSuccess"
              accept="image/*"
            >
              <el-image 
                v-if="editForm.qr_code" 
                :src="editForm.qr_code" 
                fit="cover"
                style="width: 80px; height: 80px; cursor: pointer;"
              />
              <div v-else class="upload-placeholder">
                <el-icon><Plus /></el-icon>
                <span>Tải lên</span>
              </div>
            </el-upload>
            <el-button v-if="editForm.qr_code" type="danger" size="small" @click="editForm.qr_code = ''">Xóa</el-button>
          </div>
        </el-form-item>
      </template>

      <el-form-item label="设là默认">
        <el-switch v-model="editForm.is_default" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">Hủy</el-button>
      <el-button type="primary" @click="submitEdit" :loading="submitting">Lưu</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  fetchMemberWithdrawAccounts,
  updateWithdrawAccount,
  setDefaultWithdrawAccount,
  type WithdrawAccount
} from '@/api/withdraw-account'

interface Props {
  modelValue: boolean
  memberId: number
  memberUsername?: string
}

const props = withDefaults(defineProps<Props>(), {
  memberId: 0,
  memberUsername: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = ref(false)
const loading = ref(false)
const accountList = ref<WithdrawAccount[]>([])

const editDialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref()
const editForm = reactive<Partial<WithdrawAccount>>({
  id: undefined,
  type: 'bank',
  bank_name: '',
  bank_account: '',
  account_name: '',
  bank_branch: '',
  usdt_address: '',
  usdt_network: '',
  qr_code: '',
  is_default: 0
})

const rules = {
  bank_name: [{ required: true, message: 'Vui lòng nhậpbạc行名称', trigger: 'blur' }],
  bank_account: [{ required: true, message: 'Vui lòng nhập账số', trigger: 'blur' }],
  account_name: [{ required: true, message: 'Vui lòng nhập姓名', trigger: 'blur' }],
  usdt_address: [{ required: true, message: 'Vui lòng nhậpUSDTđấtchỉ', trigger: 'blur' }],
  usdt_network: [{ required: true, message: 'Vui lòng chọnUSDTmạng络', trigger: 'change' }]
}

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val && props.memberId && props.memberId > 0) {
      fetchData()
    }
  }
)

watch(visible, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    accountList.value = []
  }
})

const fetchData = async () => {
  if (!props.memberId || props.memberId <= 0) {
    accountList.value = []
    return
  }
  loading.value = true
  try {
    console.log('获取sẽ员提现账hộ, uid:', props.memberId)
    const res = await fetchMemberWithdrawAccounts(props.memberId)
    accountList.value = res.list || []
  } catch (e) {
    console.error('获取提现账hộ失败:', e)
    accountList.value = []
  } finally {
    loading.value = false
  }
}

const handleQrUploadSuccess = (res: any) => {
  if (res.code === 0 && res.data?.url) {
    editForm.qr_code = res.data.url
    ElMessage.success('Tải lên成công')
  } else {
    ElMessage.error(res.msg || 'Tải lên失败')
  }
}

const handleEdit = (row: WithdrawAccount) => {
  Object.assign(editForm, {
    id: row.id,
    type: row.type,
    bank_name: row.bank_name || '',
    bank_account: row.bank_account || '',
    account_name: row.account_name || '',
    bank_branch: row.bank_branch || '',
    usdt_address: row.usdt_address || '',
    usdt_network: row.usdt_network || '',
    qr_code: row.qr_code || '',
    is_default: row.is_default
  })
  editDialogVisible.value = true
}

const submitEdit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        await updateWithdrawAccount(editForm)
        ElMessage.success('Sửa成công')
        editDialogVisible.value = false
        fetchData()
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleSetDefault = (row: WithdrawAccount) => {
  ElMessageBox.confirm('确定sẽ此账hộ设là默认提现账hộ？', '提示', {
    type: 'info'
  }).then(async () => {
    try {
      await setDefaultWithdrawAccount(row.id)
      ElMessage.success('设trí成công')
      fetchData()
    } catch (e) {
      console.error('设trí默认失败:', e)
    }
  })
}
</script>

<style scoped>
.upload-placeholder {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #8c939d;
  font-size: 12px;
  transition: border-color 0.3s;
}
.upload-placeholder:hover {
  border-color: #409eff;
}
.upload-placeholder .el-icon {
  font-size: 20px;
  margin-bottom: 4px;
}
:deep(.qr-uploader .el-upload) {
  border-radius: 6px;
  overflow: hidden;
}
</style>
