<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete } from '@element-plus/icons-vue'
import { fetchGetActiveLotteryList } from '@/api/lottery'
import { fetchGameRecordList, fetchCancelBet } from '@/api/game'

defineOptions({
  name: 'GameRecord'
})

const loading = ref(false)
const lotteryList = ref<any[]>([])
const tableData = ref<any[]>([])
const total = ref(0)
const refreshTimer = ref<any>(null)

const queryParams = reactive({
  page: 1,
  limit: 20,
  isnb: '',
  cpname: '',
  expect: '',
  orderno: '',
  username: '',
  status: '',
  start_time: '',
  end_time: '',
  refresh: 0
})

const contentDialogVisible = ref(false)
const currentContent = ref('')
const currentOrderNo = ref('')

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

    const params: any = { ...queryParams }

    Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
            delete params[key]
        }
    })

    delete params.refresh

    const res: any = await fetchGameRecordList(params)

    if (res && Array.isArray(res.data)) {
       tableData.value = res.data
       total.value = res.count || res.total || 0
    } else if (Array.isArray(res)) {
       tableData.value = res
       total.value = res.length
    } else if (res && res.list) {
        tableData.value = res.list
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

const handleRefresh = () => {

    getList()
}

const handleAutoRefreshChange = (val: number) => {
    if (refreshTimer.value) {
        clearInterval(refreshTimer.value)
        refreshTimer.value = null
    }
    if (val > 0) {
        refreshTimer.value = setInterval(() => {
            getList()
        }, val * 1000)
        ElMessage.success(`Đã bật tự động làm mới: ${val} giây`)
    }
}

const handleCancelBet = (row: any) => {
  ElMessageBox.confirm('Xác nhận hủy đơn?', 'Thông báo', {
    type: 'warning',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy'
  }).then(async () => {
    try {
      await fetchCancelBet({ id: row.id })
      ElMessage.success('Hủy đơn thành công')
      getList()
    } catch (error) {
      console.error(error)
    }
  })
}

const showContent = (row: any) => {
    currentOrderNo.value = row.orderno
    currentContent.value = formatBetContent(row)
    contentDialogVisible.value = true
}

const formatBetContent = (row: any) => {
    const content = row.betcontent || ''

    const playId = row.play_id || row.playid || ''

    if (playId === 'xy28_combined' || (content.startsWith('[') && content.includes('playid'))) {
        try {
            const items = JSON.parse(content)
            if (Array.isArray(items)) {
                return items.map((item: any) => `${item.title || item.label || item.playid}${item.amount}`).join(' / ')
            }
        } catch (e) {

        }
    }
    return row.play_name || content
}

const formatAmount = (row: any) => {
    return row.amount ? parseFloat(row.amount).toFixed(2) : '0.00'
}
const formatWinAmount = (row: any) => {
    return row.winamount ? parseFloat(row.winamount).toFixed(2) : '0.00'
}

onMounted(() => {
  getLotteryList()
  getList()
})

onUnmounted(() => {
    if (refreshTimer.value) {
        clearInterval(refreshTimer.value)
    }
})
</script>

<template>
  <div class="p-4">
    
    <el-card shadow="hover" class="mb-4">
      <el-form :inline="true" :model="queryParams" class="flex flex-wrap gap-2">
        <el-form-item label="Nội bộ">
          <el-select v-model="queryParams.isnb" placeholder="Tất cả" clearable class="!w-24" @change="handleSearch">
            <el-option label="Tất cả" value="" />
            <el-option label="Có" value="1" />
            <el-option label="Không" value="0" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Loại xổ số">
          <el-select v-model="queryParams.cpname" placeholder="Tất cả" clearable filterable class="!w-40" @change="handleSearch">
             <el-option label="Tất cả" value="" />
            <el-option v-for="item in lotteryList" :key="item.name" :label="item.title" :value="item.name" />
          </el-select>
        </el-form-item>

        <el-form-item label="Kỳ số">
          <el-input v-model="queryParams.expect" placeholder="Kỳ số" clearable class="!w-32" @keyup.enter="handleSearch" />
        </el-form-item>

        <el-form-item label="Mã đơn">
          <el-input v-model="queryParams.orderno" placeholder="Mã đơn" clearable class="!w-40" @keyup.enter="handleSearch" />
        </el-form-item>
        
        <el-form-item label="Người dùng">
          <el-input v-model="queryParams.username" placeholder="Tên người dùng" clearable class="!w-32" @keyup.enter="handleSearch" />
        </el-form-item>
        
        <el-form-item label="Trạng thái">
          <el-select v-model="queryParams.status" placeholder="Tất cả" clearable class="!w-32" @change="handleSearch">
            <el-option label="Tất cả" value="" />
            <el-option label="Chưa mở thưởng" value="0" />
            <el-option label="Trúng thưởng" value="1" />
            <el-option label="Không trúng" value="-1" />
            <el-option label="Hủy đơn" value="-2" />
          </el-select>
        </el-form-item>

        <el-form-item label="Thời gian">
           <el-date-picker
            v-model="queryParams.start_time"
            type="datetime"
            placeholder="Thời gian bắt đầu"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="!w-44"
          />
          <span class="mx-2">-</span>
          <el-date-picker
            v-model="queryParams.end_time"
            type="datetime"
            placeholder="Thời gian kết thúc"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="!w-44"
          />
        </el-form-item>

        <el-form-item label="Tự động làm mới">
             <el-select v-model="queryParams.refresh" placeholder="Đóng" class="!w-28" @change="handleAutoRefreshChange">
                <el-option label="Đóng" :value="0" />
                <el-option label="5giây" :value="5" />
                <el-option label="10giây" :value="10" />
                <el-option label="30giây" :value="30" />
             </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">Tìm kiếm</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    
    <el-card shadow="hover">
      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="orderno" label="Mã đơn" width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="username" label="Tên người dùng" width="120" align="center" />
        <el-table-column prop="lottery_name" label="Tên xổ số" width="120" align="center" />
        <el-table-column prop="expect" label="Kỳ số" width="120" align="center" />
        <el-table-column prop="play_name" label="Cách chơi" width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="betcount" label="Số lượng cược" width="80" align="center" />
        <el-table-column prop="odds" label="Tiền thưởng/Tỷ lệ" width="100" align="center" />
        <el-table-column prop="amount" label="Số tiền" width="100" align="center" :formatter="formatAmount" />
        <el-table-column prop="after_balance" label="Số dư sau cược" width="120" align="center">
             <template #default="{ row }">
                {{ row.after_balance ? parseFloat(row.after_balance).toFixed(2) : '0.00' }}
             </template>
        </el-table-column>
        <el-table-column prop="winamount" label="Số tiền trúng" width="100" align="center" :formatter="formatWinAmount" />
        <el-table-column prop="wincount" label="Số lượng trúng" width="100" align="center" />
        <el-table-column prop="multiple" label="Bội số trúng" width="100" align="center" />
        <el-table-column prop="mode_text" label="Đồng/Góc/Điểm" width="80" align="center" />
        
        <el-table-column prop="betcontent" label="Số" min-width="150" align="center">
            <template #default="{ row }">
                <span v-if="formatBetContent(row).length > 15" 
                      class="text-primary cursor-pointer" 
                      @click="showContent(row)">
                    {{ formatBetContent(row).substring(0, 15) }}...
                </span>
                <span v-else>{{ formatBetContent(row) }}</span>
            </template>
        </el-table-column>

        <el-table-column prop="opencode" label="Số mở thưởng" width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="type_text" label="Loại" width="80" align="center" />
        
        <el-table-column label="Trạng thái" width="100" align="center">
             <template #default="{ row }">
                <el-tag v-if="row.isdraw == 1" type="success">Trúng thưởng</el-tag>
                <el-tag v-else-if="row.isdraw == -1" type="info">Không trúng</el-tag>
                <el-tag v-else-if="row.isdraw == -2" type="info" class="line-through text-gray-400">Hủy đơn</el-tag>
                <el-tag v-else>Chưa mở thưởng</el-tag>
             </template>
        </el-table-column>

        <el-table-column prop="bettime" label="Thời gian đặt cược" width="160" align="center" />
        
        <el-table-column label="Thao tác" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button 
                v-if="row.isdraw == 0" 
                link 
                type="danger" 
                :icon="Delete" 
                @click="handleCancelBet(row)"
            >
                Hủy đơn
            </el-button>
            <span v-else>---</span>
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
      v-model="contentDialogVisible"
      :title="'Mã đơn: ' + currentOrderNo"
      width="400px"
    >
      <div class="whitespace-pre-wrap break-words">
        {{ currentContent }}
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.text-primary {
    color: var(--el-color-primary);
}
.line-through {
    text-decoration: line-through;
}
.text-gray-400 {
    color: #9ca3af;
}
</style>
