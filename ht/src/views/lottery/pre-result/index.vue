<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Clock } from '@element-plus/icons-vue'
import { fetchGetActiveLotteryList, fetchGetPreResultList, fetchSavePreResult } from '@/api/lottery'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'PreResult'
})


interface LotteryItem {
  name: string
  title: string
  typeid: string
  issys: number
}

interface IssueItem {
  expect: string
  opencode: string
  opentime: string
  admin: string

  codes: string[]
}

interface PreResultResponse {
  lottery: {
    name: string
    title: string
    typeid: string
  }
  issues: IssueItem[]
}

const router = useRouter()
const loading = ref(false)
const lotteryList = ref<LotteryItem[]>([])
const currentLottery = ref('')
const tableData = ref<IssueItem[]>([])
const currentLotteryInfo = ref<PreResultResponse['lottery'] | null>(null)


const typeNames: Record<string, string> = {
  'ssc': 'Xổ số thời gian',
  'k3': 'K3',
  '11x5': '11chọn5',
  'x5': '11chọn5',
  'pk10': 'PK10',
  'xy28': 'Lucky28',
  'lhc': 'Lục hợp',
  'dpc': 'Xổ số tần suất thấp',
  'keno': 'Xổ số nhanh'
}


const getBallConfig = (typeid: string) => {
  let count = 5
  let range: string[] = []

  switch (typeid) {
    case 'ssc':
      count = 5
      range = Array.from({ length: 10 }, (_, i) => i.toString())
      break
    case 'k3':
      count = 3
      range = Array.from({ length: 6 }, (_, i) => (i + 1).toString())
      break
    case '11x5':
    case 'x5':
      count = 5
      range = Array.from({ length: 11 }, (_, i) => (i + 1).toString().padStart(2, '0'))
      break
    case 'pk10':
      count = 10
      range = Array.from({ length: 10 }, (_, i) => (i + 1).toString().padStart(2, '0'))
      break
    case 'lhc':
      count = 7
      range = Array.from({ length: 49 }, (_, i) => (i + 1).toString().padStart(2, '0'))
      break
    case 'xy28':
      count = 3
      range = Array.from({ length: 10 }, (_, i) => i.toString())
      break
    default:
      count = 5
      range = Array.from({ length: 10 }, (_, i) => i.toString())
  }
  return { count, range }
}


const groupedLotteries = computed(() => {
  const groups: Record<string, LotteryItem[]> = {}
  lotteryList.value.forEach(item => {

    if (item.issys == 1) {
      const type = item.typeid || 'other'
      if (!groups[type]) {
        groups[type] = []
      }
      groups[type].push(item)
    }
  })
  return groups
})

onMounted(() => {
  loadLotteries()
})

async function loadLotteries() {
  try {
    const res = await fetchGetActiveLotteryList()

    const list = Array.isArray(res) ? res : (res.data || [])
    lotteryList.value = list


    const firstSys = list.find((item: any) => item.issys == 1)
    if (firstSys) {
      currentLottery.value = firstSys.name
      handleLotteryChange()
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('Lấy danh sách loại xổ số thất bại')
  }
}

async function handleLotteryChange() {
  if (!currentLottery.value) return

  loading.value = true
  try {
    const res = await fetchGetPreResultList({ lottery_name: currentLottery.value })

    const data = res.data || (res.lottery ? res : null)

    if (data) {
      currentLotteryInfo.value = data.lottery

      tableData.value = (data.issues || []).map((issue: any) => {
        const config = getBallConfig(data.lottery.typeid)
        let codes: string[] = []
        if (issue.opencode) {
          codes = issue.opencode.split(',')
        }

        if (codes.length < config.count) {
             const diff = config.count - codes.length;
             for(let i=0; i<diff; i++) codes.push('');
        } else if (codes.length > config.count) {
             codes = codes.slice(0, config.count);
        }

        return {
          ...issue,
          codes
        }
      })
    } else {
      tableData.value = []
      currentLotteryInfo.value = null
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('Tải dữ liệu dự mở thưởng thất bại')
    tableData.value = []
  } finally {
    loading.value = false
  }
}

async function handleSave(row: IssueItem) {

  if (row.codes.some(c => !c)) {
    ElMessage.warning('Vui lòng chọn đầy đủ số mở thưởng')
    return
  }

  try {
    await ElMessageBox.confirm(`Xác nhận sửa đổi kết quả mở thưởng kỳ ${row.expect}?`, 'Thông báo', {
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      type: 'warning'
    })


    const opencodeData: Record<string, string> = {}

    for (let i = 0; i < 20; i++) {
        if (i < row.codes.length) {
            opencodeData[`opencode${i + 1}`] = row.codes[i];
        } else {
             opencodeData[`opencode${i + 1}`] = '';
        }
    }

    const postData = {
      expect: row.expect,
      name: currentLotteryInfo.value?.name,
      opentime: row.opentime,
      ...opencodeData
    }

    const res = await fetchSavePreResult(postData)

    if (res.code === 0) {
         ElMessage.success(res.msg || 'Lưu thành công')

        row.admin = 'admin'
    } else {
         ElMessage.error(res.msg || 'Lưu thất bại')
    }

  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

function goToHistory() {
  router.push('/lottery/pre-result-history')
}
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    
    <div class="bg-box rounded-lg p-4 shadow-sm border-full-d flex justify-between items-center">
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-g-700">Loại xổ số:</span>
        <el-select 
          v-model="currentLottery" 
          placeholder="Vui lòng chọn loại xổ số" 
          class="!w-64"
          filterable
          @change="handleLotteryChange"
        >
          <el-option-group
            v-for="(items, type) in groupedLotteries"
            :key="type"
            :label="typeNames[type] || 'Khác'"
          >
            <el-option
              v-for="item in items"
              :key="item.name"
              :label="item.title"
              :value="item.name"
            />
          </el-option-group>
        </el-select>
      </div>

      <div>
        <el-button type="primary" plain @click="goToHistory">
          <el-icon class="mr-1"><Clock /></el-icon> Lịch sử sửa đổi
        </el-button>
      </div>
    </div>

    
    <el-card shadow="hover" :body-style="{ padding: '0' }">
      <el-table 
        v-loading="loading" 
        :data="tableData" 
        border 
        stripe 
        style="width: 100%"
      >
        <el-table-column label="Loại xổ số" width="150" align="center">
          <template #default>
            <span class="font-medium text-g-700">{{ currentLotteryInfo?.title }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="expect" label="Kỳ số" width="150" align="center" />
        
        <el-table-column label="Số mở thưởng" min-width="450">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-2 items-center py-2 px-2">
              <div 
                v-for="(_, index) in row.codes" 
                :key="index"
                class="relative"
              >
                <el-select 
                  v-model="row.codes[index]" 
                  size="small" 
                  class="!w-20"
                  :placeholder="`Quả ${index + 1}`"
                  filterable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="val in getBallConfig(currentLotteryInfo?.typeid || '').range"
                    :key="val"
                    :label="val"
                    :value="val"
                  />
                </el-select>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="opentime" label="Thời gian mở thưởng" width="180" align="center" />
        
        <el-table-column prop="admin" label="Quản trị viên" width="120" align="center">
          <template #default="{ row }">
             <el-tag v-if="row.admin" size="small" effect="plain">{{ row.admin }}</el-tag>
             <span v-else class="text-g-300">-</span>
          </template>
        </el-table-column>
        
        <el-table-column label="Thao tác" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button 
              type="danger" 
              size="small" 
              @click="handleSave(row)"
            >
              Lưu
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.el-select .el-input__wrapper) {
  padding: 0 8px;
}
</style>
