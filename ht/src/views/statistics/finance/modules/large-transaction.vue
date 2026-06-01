<template>
  <div class="art-card h-96 p-5 mb-5 max-sm:mb-4" v-loading="loading">
    <div class="art-card-header mb-4">
      <div class="title">
        <h4>Giám sát giao dịch lớn</h4>
        <p>Ghi chép nạp rút đơn lẻ trên 50,000</p>
      </div>
    </div>
    <div class="h-full overflow-hidden pb-8" v-if="tableData && tableData.length > 0">
      <ElTable :data="tableData" style="width: 100%" height="100%">
        <ElTableColumn prop="type" label="Loại" width="80" align="center">
          <template #default="{ row }">
            <ElTag :type="row.type === 'Nạp tiền' ? 'success' : 'warning'" size="small">
              {{ row.type }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="username" label="Tài khoản người dùng" show-overflow-tooltip />
        <ElTableColumn prop="amount" label="Số tiền" align="right">
          <template #default="{ row }">
            <span class="font-medium">¥{{ row.amount.toLocaleString() }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="time" label="Thời gian" align="right" width="100" />
        <ElTableColumn prop="status" label="Trạng thái" width="80" align="center">
          <template #default="{ row }">
            <span :class="getStatusClass(row.status)">{{ row.status }}</span>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
    <ElEmpty v-else-if="!loading" description="Chưa có dữ liệu" :image-size="80" class="h-full flex-cc" />
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<{
    data?: any[]
    loading?: boolean
  }>(), {
    loading: false
  })

  const tableData = computed(() => props.data || [])

  const getStatusClass = (status: string) => {
    if (status === 'Thành công') return 'text-success'
    if (status === 'Đang duyệt') return 'text-warning'
    return 'text-g-500'
  }
</script>
