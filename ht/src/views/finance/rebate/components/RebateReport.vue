<template>
  <div class="rebate-report">
    
    <el-card class="mb-4">
      <el-form inline>
        <el-form-item label="Chu kỳ thống kê">
          <el-select v-model="days" @change="loadData">
            <el-option label="Gần 7 ngày" :value="7" />
            <el-option label="Gần 15 ngày" :value="15" />
            <el-option label="Gần 30 ngày" :value="30" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData" :loading="loading">Làm mới</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    
    <el-card class="mb-4">
      <template #header>
        <span>Xu hướng phát hoàn trả</span>
      </template>
      <div ref="trendChartRef" style="height: 300px;"></div>
    </el-card>

    <el-row :gutter="16">
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>Phân bố theo loại</span>
          </template>
          <div ref="categoryChartRef" style="height: 300px;"></div>
        </el-card>
      </el-col>

      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>Phân bố theo cấp VIP</span>
          </template>
          <div ref="vipChartRef" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    
    <el-card class="mt-4">
      <template #header>
        <span>Chi tiết hàng ngày</span>
      </template>
      <el-table :data="trendData" border>
        <el-table-column prop="date" label="Ngày" width="120" />
        <el-table-column prop="count" label="Số lượt" width="100" align="center" />
        <el-table-column prop="amount" label="Số tiền phát" align="right">
          <template #default="{ row }">
            ¥{{ row.amount?.toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchRebateReport, type RebateReportData } from '@/api/rebate'
import * as echarts from 'echarts'

const loading = ref(false)
const days = ref(7)
const trendData = ref<{ date: string; count: number; amount: number }[]>([])

const trendChartRef = ref<HTMLElement | null>(null)
const categoryChartRef = ref<HTMLElement | null>(null)
const vipChartRef = ref<HTMLElement | null>(null)

let trendChart: echarts.ECharts | null = null
let categoryChart: echarts.ECharts | null = null
let vipChart: echarts.ECharts | null = null

const loadData = async () => {
  loading.value = true
  try {
    const data = await fetchRebateReport(days.value)

    if (data) {
      trendData.value = data.trend || []
      renderTrendChart(data.trend || [])
      renderCategoryChart(data.byCategory || [])
      renderVipChart(data.byVip || [])
    }
  } catch (e) {
    ElMessage.error('Tải báo cáo thất bại')
  } finally {
    loading.value = false
  }
}

const renderTrendChart = (data: { date: string; amount: number; count: number }[]) => {
  if (!trendChartRef.value) return

  if (!trendChart) {
    trendChart = echarts.init(trendChartRef.value)
  }

  trendChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['Số tiền phát', 'Số lượt']
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date)
    },
    yAxis: [
      { type: 'value', name: 'Số tiền(đồng)' },
      { type: 'value', name: 'Số lượt' }
    ],
    series: [
      {
        name: 'Số tiền phát',
        type: 'bar',
        data: data.map(d => d.amount),
        itemStyle: { color: '#409eff' }
      },
      {
        name: 'Số lượt',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.count),
        itemStyle: { color: '#67c23a' }
      }
    ]
  })
}

const renderCategoryChart = (data: { category: string; total: number }[]) => {
  if (!categoryChartRef.value) return

  if (!categoryChart) {
    categoryChart = echarts.init(categoryChartRef.value)
  }

  const categoryNames: Record<string, string> = {
    'daily': 'Hoàn trả hàng ngày',
    'realperson': 'Trực tiếp',
    'fish': 'Bắn cá',
    'electron': 'Điện tử',
    'lottery': 'Xổ số',
    'sport': 'Thể thao',
    'chess': 'Cờ bài',
    'esport': 'Thể thao điện tử'
  }

  categoryChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ¥{c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: data.map(d => ({
          name: categoryNames[d.category] || d.category,
          value: parseFloat(d.total as any) || 0
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}

const renderVipChart = (data: { groupname: string; total: number; cnt: number }[]) => {
  if (!vipChartRef.value) return

  if (!vipChart) {
    vipChart = echarts.init(vipChartRef.value)
  }

  vipChart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = params[0]
        return `${p.name}<br/>Số tiền: ¥${p.value}<br/>Số lượt: ${data[p.dataIndex]?.cnt || 0}`
      }
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.groupname)
    },
    yAxis: {
      type: 'value',
      name: 'Số tiền(đồng)'
    },
    series: [
      {
        type: 'bar',
        data: data.map(d => parseFloat(d.total as any) || 0),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        }
      }
    ]
  })
}

const handleResize = () => {
  trendChart?.resize()
  categoryChart?.resize()
  vipChart?.resize()
}

onMounted(async () => {
  await nextTick()
  loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  categoryChart?.dispose()
  vipChart?.dispose()
})
</script>

<style scoped>
.rebate-report {
  padding: 0;
}
.mb-4 {
  margin-bottom: 16px;
}
.mt-4 {
  margin-top: 16px;
}
</style>
