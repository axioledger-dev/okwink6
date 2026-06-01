<template>
  <div class="p-4">
    <div class="mb-4 bg-box p-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <el-button type="primary" @click="handleAdd">
            <template #icon><ArtSvgIcon icon="ri:add-line" /></template>
            Thêm phương thức nạp tiền
          </el-button>
        </div>
        <el-button @click="loadData">
          <template #icon><ArtSvgIcon icon="ri:refresh-line" /></template>
          Làm mới
        </el-button>
      </div>
    </div>

    <div class="bg-box p-4 rounded-lg shadow-sm">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />
        <el-table-column prop="paytype" label="Mã định danh" min-width="120" align="center" sortable />
        <el-table-column prop="paytypetitle" label="Tên thanh toán" min-width="150" align="center" sortable />
        <el-table-column prop="ftitle" label="Tên phụ" min-width="150" align="center" />
        
        <el-table-column label="Thanh toán online" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.isonline === 1" type="danger">Có</el-tag>
            <el-tag v-else type="info">Không</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="Trạng thái" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.state"
              :active-value="1"
              :inactive-value="0"
              @change="(val) => handleStateChange(row, val as number)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="Thao tác" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="primary" 
              plain
              @click="handleEdit(row)"
            >Sửa</el-button>
            <el-button 
              size="small" 
              type="danger" 
              plain
              @click="handleDelete(row)"
            >Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? 'Thêm phương thức nạp tiền' : 'Sửa phương thức nạp tiền'"
      width="650px"
      destroy-on-close
      top="5vh"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="Mã định danh" prop="paytype">
          <el-input v-model="form.paytype" placeholder="Ví dụ: alipay, weixin, linepay, USDT" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="Tên thanh toán" prop="paytypetitle">
          <el-input v-model="form.paytypetitle" placeholder="Vui lòng nhập tên thanh toán" />
        </el-form-item>
        <el-form-item label="Tên phụ" prop="ftitle">
          <el-input v-model="form.ftitle" placeholder="Vui lòng nhập tên phụ" />
        </el-form-item>
        <el-form-item label="Số tiền tối thiểu">
          <el-input-number v-model="form.minmoney" :min="1" :max="999999" />
        </el-form-item>
        <el-form-item label="Số tiền tối đa">
          <el-input-number v-model="form.maxmoney" :min="1" :max="999999" />
        </el-form-item>
        <el-form-item label="Thanh toán online" prop="isonline">
          <el-radio-group v-model="form.isonline">
            <el-radio :label="1">Có</el-radio>
            <el-radio :label="0">Không</el-radio>
          </el-radio-group>
          <div class="text-xs text-gray-400 mt-1">Thanh toán online là thanh toán qua bên thứ ba, ngược lại là nạp tiền thủ công</div>
        </el-form-item>
        <el-form-item label="Trạng thái" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio :label="1">Bật</el-radio>
            <el-radio :label="0">Tắt</el-radio>
          </el-radio-group>
        </el-form-item>
        
        
        <el-divider content-position="left">Cấu hình thu tiền</el-divider>
        
        
        <template v-if="['alipay', 'weixin'].includes(form.paytype)">
          <el-form-item label="Mã QR thu tiền">
            <el-input v-model="form.configs_data.ewmurl" placeholder="Địa chỉ ảnh mã QR" />
            <div class="text-xs text-gray-400 mt-1">Tải lên ảnh mã QR rồi điền địa chỉ</div>
          </el-form-item>
          <el-form-item label="Tài khoản thu tiền">
            <el-input v-model="form.configs_data.account" placeholder="Tài khoản thu tiền/Số điện thoại" />
          </el-form-item>
          <el-form-item label="Tên người nhận">
            <el-input v-model="form.configs_data.accountname" placeholder="Tên người nhận" />
          </el-form-item>
        </template>
        
        
        <template v-if="form.paytype === 'linepay'">
          <el-form-item label="Tên ngân hàng">
            <el-input v-model="form.configs_data.bankname" placeholder="Ví dụ: Ngân hàng Chiêu Thương" />
          </el-form-item>
          <el-form-item label="Chi nhánh ngân hàng">
            <el-input v-model="form.configs_data.bankbranch" placeholder="Ví dụ: Chi nhánh Thâm Quyến" />
          </el-form-item>
          <el-form-item label="Số thẻ ngân hàng">
            <el-input v-model="form.configs_data.bankcode" placeholder="Số thẻ ngân hàng thu tiền" />
          </el-form-item>
          <el-form-item label="Tên chủ tài khoản">
            <el-input v-model="form.configs_data.accountname" placeholder="Tên thật người nhận" />
          </el-form-item>
        </template>
        
        
        <template v-if="form.paytype === 'USDT'">
          <el-form-item label="Tỷ giá">
            <el-input-number v-model="form.configs_data.rate" :precision="2" :min="1" :max="20" />
            <span class="ml-2 text-gray-400">1 USDT = ? CNY</span>
          </el-form-item>
          <el-form-item label="TRC20Địa chỉ">
            <el-input v-model="form.configs_data.trc20" placeholder="Địa chỉ ví TRC20" />
          </el-form-item>
          <el-form-item label="ERC20Địa chỉ">
            <el-input v-model="form.configs_data.erc20" placeholder="Địa chỉ ví ERC20 (tùy chọn)" />
          </el-form-item>
        </template>
        
        <el-form-item label="Ghi chú">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="Hướng dẫn nạp tiền, sẽ hiển thị ở giao diện người dùng" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            Xác nhận
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import {
  fetchPaySetList,
  createPaySet,
  updatePaySet,
  deletePaySet,
  setPaySetState,
  type PaySet
} from '@/api/finance-payset'
import ArtSvgIcon from '@/components/core/base/art-svg-icon/index.vue'

const loading = ref(false)
const tableData = ref<PaySet[]>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})


const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  id: 0,
  paytype: '',
  paytypetitle: '',
  ftitle: '',
  minmoney: 100,
  maxmoney: 50000,
  isonline: 0,
  state: 1,
  remark: '',
  configs_data: {} as Record<string, any>
})

const rules = {
  paytype: [{ required: true, message: 'Vui lòng nhập mã thanh toán', trigger: 'blur' }],
  paytypetitle: [{ required: true, message: 'Vui lòng nhập tên thanh toán', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchPaySetList({
      page: pagination.page,
      limit: pagination.limit
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val: number) => {
  pagination.limit = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadData()
}

const handleStateChange = async (row: PaySet, val: number) => {
  try {
    await setPaySetState(row.id, val)
    ElMessage.success('Cập nhật trạng thái thành công')
  } catch (error) {
    row.state = val === 1 ? 0 : 1
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.id = 0
  form.paytype = ''
  form.paytypetitle = ''
  form.ftitle = ''
  form.minmoney = 100
  form.maxmoney = 50000
  form.isonline = 0
  form.state = 1
  form.remark = ''
  form.configs_data = {}
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.paytype = row.paytype
  form.paytypetitle = row.paytypetitle
  form.ftitle = row.ftitle || ''
  form.minmoney = row.minmoney || 100
  form.maxmoney = row.maxmoney || 50000
  form.isonline = row.isonline
  form.state = row.state
  form.remark = row.remark || ''
  form.configs_data = row.configs_data || {}
  dialogVisible.value = true
}

const handleDelete = (row: PaySet) => {
  ElMessageBox.confirm(`Xác nhận xóa ${row.paytypetitle} không?`, 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await deletePaySet(row.id)
    loadData()
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (dialogType.value === 'add') {
          await createPaySet(form)
        } else {
          await updatePaySet(form)
        }
        dialogVisible.value = false
        loadData()
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  loadData()
})
</script>
