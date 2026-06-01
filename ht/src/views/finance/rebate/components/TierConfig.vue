<template>
  <div class="tier-config">
    
    <el-tabs v-model="activeCategory" type="card" @tab-change="loadCategoryData">
      <el-tab-pane v-for="cat in categoryOptions" :key="cat.code" :label="cat.name" :name="cat.code" />
    </el-tabs>

    
    <div class="config-panel">
      <div class="panel-header">
        <span class="title">{{ currentCategoryName }} - Cấu hình hoàn trả theo bậc</span>
        <el-button type="primary" size="small" @click="saveCurrentConfig" :loading="saving">
          Lưu cấu hình
        </el-button>
      </div>

      <el-table :data="currentTiers" border v-loading="loading">
        <el-table-column type="index" label="#" width="50" align="center" />
        <el-table-column label="Tổng cược tích lũy ≥" min-width="180">
          <template #default="{ row }">
            <el-input-number 
              v-model="row.minBet" 
              :min="0" 
              :precision="0"
              :controls="false"
              style="width: 150px"
            />
          </template>
        </el-table-column>
        <el-table-column label="Tỷ lệ hoàn trả (%)" width="150">
          <template #default="{ row }">
            <el-input-number 
              v-model="row.rate" 
              :min="0" 
              :max="10" 
              :precision="2" 
              :step="0.1"
              :controls="false"
              style="width: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="100" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="80" align="center">
          <template #default="{ $index }">
            <el-button type="danger" :icon="Delete" circle size="small" @click="removeTier($index)" />
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" plain @click="addTier" style="margin-top: 12px;">
        <el-icon><Plus /></el-icon> Thêm bậc
      </el-button>

      <el-alert type="info" :closable="false" style="margin-top: 16px;">
        <template #title>
          Hướng dẫn cấu hình: Mỗi danh mục trò chơi sử dụng tỷ lệ hoàn trả theo bậc thống nhất, người dùng tích lũy cược đạt bậc tương ứng sẽ tự động hưởng hoàn trả cao hơn.
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import { fetchTierConfig, saveTierConfig, type TierItem } from '@/api/rebate'

const loading = ref(false)
const saving = ref(false)
const activeCategory = ref('slot')
const currentTiers = ref<TierItem[]>([])

const categoryOptions = [
  { code: 'slot', name: 'Điện tử' },
  { code: 'live', name: 'Trực tiếp' },
  { code: 'fishing', name: 'Bắn cá' },
  { code: 'chess', name: 'Cờ bài' },
  { code: 'lottery', name: 'Xổ số' },
  { code: 'sport', name: 'Thể thao' },
  { code: 'esport', name: 'Thể thao điện tử' },
]

const currentCategoryName = computed(() => {
  return categoryOptions.find(c => c.code === activeCategory.value)?.name || ''
})

const loadCategoryData = async () => {
  loading.value = true
  try {
    const data = await fetchTierConfig({
      category_code: activeCategory.value,
      vendor_code: '*'
    })

    if (data?.list && data.list.length > 0) {

      const config = data.list.find((c: any) => c.vendorCode === '*')
      if (config && config.tiers) {
        currentTiers.value = config.tiers.map((t: any) => ({
          minBet: t.minBet,
          rate: t.rate,
          status: t.status ?? 1
        }))
      } else {

        currentTiers.value = data.list[0].tiers.map((t: any) => ({
          minBet: t.minBet,
          rate: t.rate,
          status: t.status ?? 1
        }))
      }
    } else {

      currentTiers.value = getDefaultTiers()
    }
  } catch (e) {
    currentTiers.value = getDefaultTiers()
  } finally {
    loading.value = false
  }
}

const getDefaultTiers = () => [
  { minBet: 1, rate: 1.00, status: 1 },
  { minBet: 70000, rate: 1.10, status: 1 },
  { minBet: 700000, rate: 1.20, status: 1 },
  { minBet: 3000000, rate: 1.30, status: 1 },
  { minBet: 15000000, rate: 1.50, status: 1 },
]

const addTier = () => {
  const lastTier = currentTiers.value[currentTiers.value.length - 1]
  currentTiers.value.push({
    minBet: (lastTier?.minBet || 0) * 10,
    rate: Math.round(((lastTier?.rate || 1) + 0.1) * 100) / 100,
    status: 1
  })
}

const removeTier = (index: number) => {
  currentTiers.value.splice(index, 1)
}

const saveCurrentConfig = async () => {
  if (currentTiers.value.length === 0) {
    ElMessage.warning('Vui lòng thêm ít nhất một bậc')
    return
  }

  currentTiers.value.sort((a, b) => a.minBet - b.minBet)

  saving.value = true
  try {
    await saveTierConfig({
      category_code: activeCategory.value,
      vendor_code: '*',
      tiers: currentTiers.value
    })

    ElMessage.success('Lưu thành công')
  } catch (e) {
    ElMessage.error('Lưu thất bại')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadCategoryData()
})
</script>

<style scoped>
.tier-config {
  padding: 0;
}

.config-panel {
  background: #fff;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header .title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-tabs__item) {
  font-size: 14px;
  padding: 0 20px;
}

:deep(.el-tabs__item.is-active) {
  font-weight: 600;
}
</style>
