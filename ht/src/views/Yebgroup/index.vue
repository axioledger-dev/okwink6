
<template>
  <div class="yeb-product-page art-full-height">
    <ElCard class="art-table-card" shadow="never">
      
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElButton type="primary" @click="openDialog('add')">
            <template #icon>
              <ArtSvgIcon icon="ri:add-line" />
            </template>
            Thêm sản phẩm
          </ElButton>
        </template>
      </ArtTableHeader>

      
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

    
    <ProductDialog
      v-model:visible="dialogVisible"
      :type="dialogType"
      :data="currentData"
      @submit="refreshData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { ElMessage, ElMessageBox, ElSwitch, ElTag } from 'element-plus'
import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
import { useTable } from '@/hooks/core/useTable'
import {
  fetchProductList,
  deleteProduct,
  updateProductStatus,
  type YebProduct
} from '@/api/yebao'
import ProductDialog from './modules/ProductDialog.vue'

defineOptions({ name: 'YebProduct' })

const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentData = ref<Partial<YebProduct>>({})

const {
  columns,
  columnChecks,
  data,
  loading,
  pagination,
  handleSizeChange,
  handleCurrentChange,
  refreshData
} = useTable({
  core: {
    apiFn: fetchProductList,
    apiParams: {
      page: 1,
      limit: 20
    },
    columnsFactory: () => [
      { prop: 'id', label: 'ID', width: 80, sortable: true, align: 'center' },
      { prop: 'name', label: 'Tên sản phẩm', minWidth: 150, align: 'center' },
      {
        prop: 'type',
        label: 'Loại',
        width: 120,
        align: 'center',
        formatter: (row: YebProduct) => {
          return h(
            ElTag,
            { type: row.type === 'current' ? 'success' : 'warning' },
            () => (row.type === 'current' ? 'Nạp/rút linh hoạt' : 'Định kỳ')
          )
        }
      },
      { prop: 'rate', label: 'Lãi suất ngày', width: 120, align: 'center' },
      { prop: 'rate_desc', label: 'Mô tả lãi suất', width: 150, align: 'center' },
      { prop: 'duration_days', label: 'Chu kỳ (ngày)', width: 100, align: 'center' },
      { prop: 'min_amount', label: 'Nạp tối thiểu', width: 120, align: 'center' },
      { prop: 'sort', label: 'Sắp xếp', width: 80, align: 'center' },
      {
        prop: 'status',
        label: 'Trạng thái',
        width: 100,
        align: 'center',
        formatter: (row: YebProduct) => {
          return h(ElSwitch, {
            modelValue: row.status,
            activeValue: 1,
            inactiveValue: 0,
            loading: (row as any)._loading,
            onChange: (val: any) => handleStatusChange(row, val)
          })
        }
      },
      {
        prop: 'operation',
        label: 'Thao tác',
        width: 150,
        fixed: 'right',
        align: 'center',
        formatter: (row: YebProduct) =>
          h('div', [
            h(ArtButtonTable, {
              type: 'edit',
              onClick: () => openDialog('edit', row)
            }),
            h(ArtButtonTable, {
              type: 'delete',
              onClick: () => handleDelete(row)
            })
          ])
      }
    ]
  }
})

const openDialog = (type: 'add' | 'edit', row?: YebProduct) => {
  dialogType.value = type
  currentData.value = row ? { ...row } : {}
  dialogVisible.value = true
}

const handleStatusChange = async (row: any, status: 0 | 1) => {
  row._loading = true
  try {
    await updateProductStatus(row.id, status)
    ElMessage.success('Cập nhật trạng thái thành công')
    row.status = status
  } catch (error) {

    refreshData()
  } finally {
    row._loading = false
  }
}

const handleDelete = (row: YebProduct) => {
  const typeText = row.type === 'current' ? 'Nạp/rút linh hoạt' : 'Định kỳ'
  ElMessageBox.confirm(
    `Xác nhận xóa sản phẩm "${row.name}"?\n\nID sản phẩm: ${row.id}\nLoại: ${typeText}\nLãi suất ngày: ${row.rate}\n\nXóa sau không thể khôi phục!`,
    'Xác nhận xóa',
    {
      type: 'warning',
      confirmButtonText: 'Xác nhận xóa',
      cancelButtonText: 'Hủy',
      dangerouslyUseHTMLString: false
    }
  ).then(async () => {
    try {
      await deleteProduct(row.id)
      ElMessage.success('Xóa thành công')
      refreshData()
    } catch (error) {
      console.error(error)
    }
  })
}
</script>
