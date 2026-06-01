<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Refresh, Delete, Edit } from '@element-plus/icons-vue'
import {
  fetchGetActiveLotteryList,
  fetchGetResultList,
  fetchAddResult,
  fetchEditResult,
  fetchDeleteResult,
  fetchResetResult
} from '@/api/lottery'

defineOptions({
  name: 'ResultList'
})

const loading = ref(false)
const lotteryList = ref<any[]>([])
const tableData = ref<any[]>([])
const total = ref(0)

const queryParams = reactive({
  page: 1,
  limit: 20,
  lottery_id: '',
  expect: ''
})


const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const formData = reactive({
  id: 0,
  lottery_id: '',
  expect: '',
  opencode: '',
  opentime: ''
})

const formRules = {
  lottery_id: [{ required: true, message: 'Vui lòng chọn loại xổ số', trigger: 'change' }],
  expect: [{ required: true, message: 'Vui lòng nhập mã kỳ', trigger: 'blur' }],
  opencode: [{ required: true, message: 'Vui lòng nhập số trúng thưởng', trigger: 'blur' }],
  opentime: [{ required: true, message: 'Vui lòng chọn thời gian mở thưởng', trigger: 'change' }]
}


const getLotteryList = async () => {
  try {
    const res = await fetchGetActiveLotteryList()

    if (Array.isArray(res)) {
      lotteryList.value = res
    } else if (res.data && Array.isArray(res.data)) {
      lotteryList.value = res.data
    } else if (res.data) {
        lotteryList.value = Object.values(res.data)
    }
  } catch (error) {
    console.error(error)
  }
}


const getList = async () => {
  loading.value = true
  try {

    const params: Record<string, any> = { ...queryParams }
    if (!params.lottery_id) delete params.lottery_id
    if (!params.expect) delete params.expect

    const res: any = await fetchGetResultList(params)



    if (Array.isArray(res)) {
       tableData.value = res
       total.value = res.length
    } else if (res && Array.isArray(res.list)) {
       tableData.value = res.list
       total.value = res.total || res.list.length || 0
    } else if (res && Array.isArray(res.data)) {
       tableData.value = res.data
       total.value = res.total || 0
    } else {

       tableData.value = []
       total.value = 0
    }
  } catch (error) {
    console.error(error)

  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryParams.page = 1
  getList()
}

const handleResetQuery = () => {
  queryParams.lottery_id = ''
  queryParams.expect = ''
  handleSearch()
}

const handleAdd = () => {
  dialogType.value = 'add'
  formData.id = 0
  formData.lottery_id = ''
  formData.expect = ''
  formData.opencode = ''
  formData.opentime = ''
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'

  formData.id = row.id
  formData.lottery_id = row.lottery_id
  formData.expect = row.expect
  formData.opencode = row.opencode
  formData.opentime = row.opentime
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const api = dialogType.value === 'add' ? fetchAddResult : fetchEditResult
        await api(formData)

        ElMessage.success(dialogType.value === 'add' ? 'Thêm thành công' : 'Sửa thành công')
        dialogVisible.value = false
        getList()
      } catch (error) {
        console.error(error)
      }
    }
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('Xác nhận xóa bản ghi mở thưởng này?', 'Thông báo', {
    type: 'warning',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy'
  }).then(async () => {
    try {
      await fetchDeleteResult({ id: row.id })
      ElMessage.success('Xóa thành công')
      getList()
    } catch (error) {
      console.error(error)
    }
  })
}

const handleResetResult = (row: any) => {
  ElMessageBox.confirm('Đặt lại mở thưởng sẽ mở thưởng lại cho các cược chưa mở thưởng, xác nhận?', 'Cảnh báo', {
    type: 'warning',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy'
  }).then(async () => {
    try {
      await fetchResetResult({ id: row.id })
      ElMessage.success('Đặt lại thành công')
      getList()
    } catch (error) {
      console.error(error)
    }
  })
}

onMounted(() => {
  getLotteryList()
  getList()
})
</script>

<template>
  <div class="p-4">
    
    <el-card shadow="hover" class="mb-4">
      <el-form :inline="true" :model="queryParams" class="flex flex-wrap gap-2">
        <el-form-item label="Loại xổ số">
          <el-select v-model="queryParams.lottery_id" placeholder="Tất cả loại xổ số" clearable class="!w-48" @change="handleSearch">
            <el-option v-for="item in lotteryList" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Kỳ số">
          <el-input v-model="queryParams.expect" placeholder="Nhập mã kỳ" clearable class="!w-48" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">Tìm kiếm</el-button>
          <el-button :icon="Refresh" @click="handleResetQuery">Đặt lại</el-button>
          <el-button type="primary" plain :icon="Plus" @click="handleAdd">Thêm mở thưởng</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    
    <el-card shadow="hover">
      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="lottery_name" label="Loại xổ số" width="150" align="center" />
        <el-table-column prop="expect" label="Kỳ số" width="150" align="center" />
        <el-table-column prop="opencode" label="Số mở thưởng" min-width="280" align="center" />
        <el-table-column prop="opentime" label="Thời gian mở thưởng" width="180" align="center" />
        <el-table-column prop="source_text" label="Nguồn" width="100" align="center" />
        <el-table-column label="Thao tác" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="Edit" @click="handleEdit(row)">Chỉnh sửa</el-button>
            <el-button link type="warning" :icon="Refresh" @click="handleResetResult(row)">Đặt lại</el-button>
            <el-button link type="danger" :icon="Delete" @click="handleDelete(row)">Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @change="getList"
          @size-change="getList"
        />
      </div>
    </el-card>

    
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? 'Thêm mở thưởng' : 'Chỉnh sửa mở thưởng'"
      width="500px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
        <el-form-item label="Loại xổ số" prop="lottery_id">
          <el-select 
            v-model="formData.lottery_id" 
            placeholder="Vui lòng chọn loại xổ số" 
            style="width: 100%" 
            :disabled="dialogType === 'edit'"
            filterable
          >
            <el-option v-for="item in lotteryList" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Kỳ số" prop="expect">
          <el-input v-model="formData.expect" placeholder="Vui lòng nhập mã kỳ" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="Số mở thưởng" prop="opencode">
          <el-input v-model="formData.opencode" placeholder="Vui lòng nhập số mở thưởng" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="Thời gian mở thưởng" prop="opentime">
          <el-date-picker
            v-model="formData.opentime"
            type="datetime"
            placeholder="Chọn thời gian mở thưởng"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">Xác nhận</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
</style>
