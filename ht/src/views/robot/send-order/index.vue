<template>
  <div class="robot-send-order-page art-full-height">
    <ElCard class="art-table-card" shadow="never">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h, resolveComponent } from 'vue'
import { useTable } from '@/hooks/core/useTable'
import {
  fetchRobotLotteryList,
  updateRobotLotteryValue,
  updateRobotLotteryStatus,
  RobotLottery
} from '@/api/robot-send-order'
import { PLAY_TYPES } from '@/constants/lottery-play-types'
import {
  ElButton,
  ElInput,
  ElSwitch,
  ElSelect,
  ElOption,
  ElCheckbox,
  ElCheckboxGroup,
  ElMessage,
  ElPopover,
  ElTag
} from 'element-plus'

defineOptions({ name: 'RobotSendOrder' })


const searchParams = reactive({
  page: 1,
  limit: 20
})


const handleUpdateValue = async (row: RobotLottery, field: string, value: any) => {
  try {
    await updateRobotLotteryValue({
      cpname: row.name,
      [field]: value
    })
    ElMessage.success('Cài đặt thành công')
  } catch (e) {

  }
}


const handleStatusChange = async (row: RobotLottery, val: boolean) => {
  try {
    await updateRobotLotteryStatus({
      cpname: row.name,
      cp_hemai_status: val ? 1 : 0
    })
    row.hemai_status = val ? 1 : 0
    ElMessage.success('Trạng thái đã cập nhật')
  } catch (e) {

  }
}

const handleBaodiChange = async (row: RobotLottery, val: boolean) => {
  handleUpdateValue(row, 'hemai_baodi_status', val ? 1 : 0)
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
    apiFn: fetchRobotLotteryList,
    apiParams: searchParams,
    paginationKey: {
      current: 'page',
      size: 'limit'
    },
    columnsFactory: () => [
      { prop: 'title', label: 'Loại xổ số', width: 120, align: 'center', fixed: 'left' },
      {
        prop: 'hemai_status',
        label: 'Trạng thái',
        width: 100,
        align: 'center',
        formatter: (row: RobotLottery) =>
          h(ElSwitch, {
            modelValue: row.hemai_status === 1,
            inlinePrompt: true,
            activeText: 'Bật',
            inactiveText: 'Đóng',
            onChange: ((val: boolean) => handleStatusChange(row, val)) as any
          })
      },
      {
        prop: 'hemai_danqi_sum',
        label: 'Số đơn mỗi kỳ',
        width: 180,
        align: 'center',
        formatter: (row: RobotLottery) => {

          return h('div', { class: 'flex gap-1 justify-center' }, [
            h(ElInput, {
              modelValue: row.hemai_danqi_sum,
              style: { width: '80px' },
              onInput: (val: string) => (row.hemai_danqi_sum = val)
            }),
            h(
              ElButton,
              {
                size: 'small',
                onClick: () => handleUpdateValue(row, 'hemai_danqi_sum', row.hemai_danqi_sum)
              },
              () => 'Xác nhận'
            )
          ])
        }
      },
      {
        prop: 'hemai_baomi_type',
        label: 'Loại bảo mật',
        width: 200,
        align: 'center',
        formatter: (row: RobotLottery) => {
          return h('div', { class: 'flex gap-1 justify-center' }, [
            h(
              ElSelect,
              {
                modelValue: row.hemai_baomi_type,
                style: { width: '100px' },
                onChange: (val: number) => (row.hemai_baomi_type = val)
              },
              () => [
                h(ElOption, { label: 'Hoàn toàn công khai', value: 0 }),
                h(ElOption, { label: 'Công khai sau khi mở thưởng', value: 1 }),
                h(ElOption, { label: 'Chỉ người theo đơn xem được', value: 2 }),
                h(ElOption, { label: 'Hoàn toàn bảo mật', value: 3 })
              ]
            ),
            h(
              ElButton,
              {
                size: 'small',
                onClick: () => handleUpdateValue(row, 'hemai_baomi_type', row.hemai_baomi_type)
              },
              () => 'Xác nhận'
            )
          ])
        }
      },
      {
        prop: 'hemai_touzhu_beishu',
        label: 'Bội số đặt cược',
        width: 180,
        align: 'center',
        formatter: (row: RobotLottery) => {
          return h('div', { class: 'flex gap-1 justify-center' }, [
            h(ElInput, {
              modelValue: row.hemai_touzhu_beishu,
              style: { width: '80px' },
              onInput: (val: string) => (row.hemai_touzhu_beishu = val)
            }),
            h(
              ElButton,
              {
                size: 'small',
                onClick: () =>
                  handleUpdateValue(row, 'hemai_touzhu_beishu', row.hemai_touzhu_beishu)
              },
              () => 'Xác nhận'
            )
          ])
        }
      },
      {
        prop: 'hemai_touzhe_bili',
        label: 'Tỷ lệ mua chung',
        width: 180,
        align: 'center',
        formatter: (row: RobotLottery) => {
          return h('div', { class: 'flex gap-1 justify-center items-center' }, [
            h(ElInput, {
              modelValue: row.hemai_touzhe_bili,
              style: { width: '80px' },
              onInput: (val: string) => (row.hemai_touzhe_bili = val)
            }),
            h('span', '%'),
            h(
              ElButton,
              {
                size: 'small',
                onClick: () => handleUpdateValue(row, 'hemai_touzhe_bili', row.hemai_touzhe_bili)
              },
              () => 'Xác nhận'
            )
          ])
        }
      },
      {
        prop: 'hemai_baodi_status',
        label: 'Có bảo đảm không',
        width: 100,
        align: 'center',
        formatter: (row: RobotLottery) =>
          h(ElSwitch, {
            modelValue: row.hemai_baodi_status === 1,
            inlinePrompt: true,
            activeText: 'Bật',
            inactiveText: 'Đóng',
            onChange: ((val: boolean) => handleBaodiChange(row, val)) as any
          })
      },
      {
        prop: 'hemai_wanfa_type',
        label: 'Cách chơi',
        minWidth: 300,
        align: 'left',
        formatter: (row: RobotLottery) => {
          const options = PLAY_TYPES[row.typeid] || []
          if (options.length === 0) return 'Chưa có cấu hình'


          return h('div', { class: 'flex flex-wrap gap-2 items-center' }, [
            h(
              ElCheckboxGroup,
              {
                modelValue: row.hemai_wanfa_type || [],
                onChange: ((val: string[]) => (row.hemai_wanfa_type = val)) as any
              },
              () =>
                options.map((opt) =>
                  h(ElCheckbox, { label: opt.value }, () => opt.label)
                )
            ),
            h(
              ElButton,
              {
                size: 'small',
                type: 'primary',
                plain: true,
                onClick: () => handleUpdateValue(row, 'hemai_wanfa_type', row.hemai_wanfa_type)
              },
              () => 'Xác nhận'
            )
          ])
        }
      }
    ]
  }
})

onMounted(() => {
  refreshData()
})
</script>

<style scoped>
:deep(.el-checkbox) {
  margin-right: 10px;
}
</style>
