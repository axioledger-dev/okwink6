<template>
  <div class="robot-hemai-page art-full-height">
    <ElCard class="art-table-card" shadow="never">
      
      <div class="search-form-container" id="art-table-header">
        <ElForm :model="searchParams" inline class="search-form">
          <ElFormItem label="Có phải robot không">
            <ElSelect v-model="searchParams.isnb" style="width: 100px">
              <ElOption label="Tất cả" :value="999" />
              <ElOption label="Có" :value="1" />
              <ElOption label="Không" :value="0" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Loại xổ số">
            <ElSelect v-model="searchParams.cpname" style="width: 150px" clearable placeholder="Tất cả">
              <ElOption label="Tất cả" value="" />
              <ElOption
                v-for="item in lotteryList"
                :key="item.name"
                :label="item.title"
                :value="item.name"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Kỳ số">
            <ElInput v-model="searchParams.qihao" placeholder="Nhập mã kỳ" style="width: 150px" />
          </ElFormItem>

          <ElFormItem label="Mã đơn">
            <ElInput v-model="searchParams.trano" placeholder="Nhập mã đơn" style="width: 180px" />
          </ElFormItem>

          <ElFormItem label="Thời gian">
            <ElDatePicker
              v-model="searchParams.sDate"
              type="date"
              placeholder="Thời gian bắt đầu"
              value-format="YYYYMMDD"
              style="width: 140px"
            />
            <span class="mx-2">-</span>
            <ElDatePicker
              v-model="searchParams.eDate"
              type="date"
              placeholder="Thời gian kết thúc"
              value-format="YYYYMMDD"
              style="width: 140px"
            />
          </ElFormItem>

          <ElFormItem label="Tên người dùng">
            <ElInput v-model="searchParams.username" placeholder="Nhập tên người dùng" style="width: 120px" />
          </ElFormItem>

          <ElFormItem label="Trạng thái">
            <ElSelect v-model="searchParams.status" style="width: 100px">
              <ElOption label="Tất cả" :value="999" />
              <ElOption label="Chưa mở thưởng" :value="0" />
              <ElOption label="Trúng thưởng" :value="1" />
              <ElOption label="Không trúng" :value="-1" />
              <ElOption label="Hủy đơn" :value="-2" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Sắp xếp">
            <ElSelect v-model="searchParams.listorder" style="width: 120px">
              <ElOption label="Mặc định" :value="0" />
              <ElOption label="Thời gian giảm dần" :value="1" />
              <ElOption label="Thời gian tăng dần" :value="2" />
              <ElOption label="Số tiền giảm dần" :value="3" />
              <ElOption label="Số tiền tăng dần" :value="4" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem>
            <ElButton type="primary" @click="refreshData">
              <template #icon><ArtSvgIcon icon="ri:search-line" /></template>
              Tìm kiếm
            </ElButton>
            <ElButton @click="resetSearch">
              <template #icon><ArtSvgIcon icon="ri:refresh-line" /></template>
              Đặt lại
            </ElButton>
          </ElFormItem>
        </ElForm>
      </div>

      
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>
    </ElCard>

    
    <HeMaiDetailDialog
      v-model="detailVisible"
      :detail="currentDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import { useTable } from '@/hooks/core/useTable'
import { fetchHeMaiList, HeMaiItem } from '@/api/robot-hemai'
import { fetchGetActiveLotteryList } from '@/api/lottery'
import { ElButton, ElTag } from 'element-plus'
import HeMaiDetailDialog from './modules/HeMaiDetailDialog.vue'

defineOptions({ name: 'RobotHeMai' })

const searchParams = reactive({
  page: 1,
  limit: 20,
  isnb: 999,
  cpname: '',
  qihao: '',
  trano: '',
  sDate: '',
  eDate: '',
  username: '',
  status: 999,
  listorder: 0
})

const lotteryList = ref<any[]>([])
const detailVisible = ref(false)
const currentDetail = ref<HeMaiItem>({} as HeMaiItem)

const loadLotteryList = async () => {
  try {
    const res = await fetchGetActiveLotteryList()

    if (Array.isArray(res)) {
      lotteryList.value = res
    } else if (res && res.list) {
      lotteryList.value = res.list
    }
  } catch (e) {
    console.error(e)
  }
}

const {
  columns,
  data,
  loading,
  pagination,
  refreshData,
  handleSizeChange,
  handleCurrentChange
} = useTable({
  core: {
    apiFn: fetchHeMaiList,
    apiParams: searchParams,
    paginationKey: {
      current: 'page',
      size: 'limit'
    },
    columnsFactory: () => [
      { prop: 'trano', label: 'Mã đơn', width: 180, align: 'center', fixed: 'left' },
      { prop: 'username', label: 'Tên người dùng', width: 120, align: 'center' },
      { prop: 'cptitle', label: 'Tên xổ số', width: 120, align: 'center' },
      { prop: 'expect', label: 'Kỳ số', width: 150, align: 'center' },
      { prop: 'playtitle', label: 'Cách chơi', width: 120, align: 'center' },
      { prop: 'itemcount', label: 'Số lượng cược', width: 80, align: 'center' },
      { prop: 'mode', label: 'Tiền thưởng/Tỷ lệ cược', width: 100, align: 'center' },
      { prop: 'amount', label: 'Số tiền', width: 100, align: 'center' },
      { prop: 'amountafter', label: 'Số tiền sau khi đặt cược', width: 120, align: 'center' },
      { prop: 'okamount', label: 'Số tiền trúng thưởng', width: 100, align: 'center' },
      { prop: 'okcount', label: 'Số lượng trúng thưởng', width: 80, align: 'center' },
      { prop: 'beishu', label: 'Bội số trúng thưởng', width: 80, align: 'center' },
      { prop: 'yjf', label: 'Đồng/Giác/Phần', width: 100, align: 'center' },
      {
        prop: 'tzcode',
        label: 'Số',
        width: 120,
        align: 'center',
        formatter: (row: HeMaiItem) => {
          const code = row.tzcode || ''
          if (code.length <= 20) {
            return h('span', { class: 'text-primary cursor-pointer', onClick: () => handleDetail(row) }, code)
          }
          return h('u', { class: 'text-primary cursor-pointer', onClick: () => handleDetail(row) }, 'Xem')
        }
      },
      { prop: 'opencode', label: 'Số mở thưởng', width: 120, align: 'center', formatter: (row: HeMaiItem) => row.opencode || '-' },
      { prop: 'type', label: 'Loại', width: 80, align: 'center' },
      {
        prop: 'status',
        label: 'Trạng thái',
        width: 100,
        align: 'center',
        formatter: (row: HeMaiItem) => {

          const raw = Number(row.status_raw)
          let color = '#333'
          if (raw === 1) color = 'green'
          else if (raw === -1) color = 'red'
          else if (raw === -2) color = '#666'

          return h('span', { style: { color } }, row.status)
        }
      },
      { prop: 'oddtime', label: 'Thời gian đặt cược', width: 160, align: 'center' },
      {
        prop: 'action',
        label: 'Thao tác',
        width: 80,
        fixed: 'right',
        align: 'center',
        formatter: (row: HeMaiItem) =>
          h(
            ElButton,
            {
              size: 'small',
              onClick: () => handleDetail(row)
            },
            () => 'Chi tiết'
          )
      }
    ]
  }
})

onMounted(() => {
  loadLotteryList()
  refreshData()
})

const resetSearch = () => {
  Object.assign(searchParams, {
    isnb: 999,
    cpname: '',
    qihao: '',
    trano: '',
    sDate: '',
    eDate: '',
    username: '',
    status: 999,
    listorder: 0
  })
  refreshData()
}

const handleDetail = (row: HeMaiItem) => {
  currentDetail.value = row
  detailVisible.value = true
}
</script>

<style scoped>
.search-form-container {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 16px;
}
.mx-2 {
  margin: 0 0.5rem;
}
</style>
