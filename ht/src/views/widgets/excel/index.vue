<template>
  <div class="page-content">
    <ArtExcelImport @import-success="handleImportSuccess" @import-error="handleImportError">
      <template #import-text> Tải lên Excel </template>
    </ArtExcelImport>

    <ArtExcelExport
      style="margin-left: 10px"
      :data="tableData"
      filename="Dữ liệu người dùng-1"
      sheetName="Danh sách người dùng"
      type="success"
      :headers="headers"
      auto-index
      :columns="columnConfig"
      @export-success="handleExportSuccess"
      @export-error="handleExportError"
      @export-progress="handleProgress"
    >
      Xuất Excel
    </ArtExcelExport>

    <ElButton type="danger" @click="handleClear" v-ripple>Xóa dữ liệu</ElButton>

    <ArtTable :data="tableData" style="margin-top: 10px">
      <ElTableColumn
        v-for="key in Object.keys(headers)"
        :key="key"
        :prop="key"
        :label="headers[key as keyof typeof headers]"
      />
    </ArtTable>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'WidgetsExcel' })

  interface TableData {
    name: string
    age: number
    city: string
  }

  const tableData = ref<TableData[]>([
    { name: 'Lý Tứ', age: 20, city: 'Thượng Hải' },
    { name: 'Trương Tam', age: 25, city: 'Bắc Kinh' },
    { name: 'Vương Ngũ', age: 30, city: 'Quảng Châu' },
    { name: 'Triệu Lục', age: 35, city: 'Thâm Quyến' },
    { name: 'Tôn Thất', age: 28, city: 'Hàng Châu' },
    { name: 'Chu Bát', age: 32, city: 'Thành Đô' },
    { name: 'Ngô Cửu', age: 27, city: 'Vũ Hán' },
    { name: 'Trịnh Thập', age: 40, city: 'Nam Kinh' },
    { name: 'Lưu Nhất', age: 22, city: 'Trùng Khánh' },
    { name: 'Trần Nhị', age: 33, city: 'Tây An' }
  ])

  const headers = {
    name: 'Họ tên',
    age: 'Tuổi',
    city: 'Thành phố'
  }

  const columnConfig = {
    name: {
      title: 'Họ tên',
      width: 20,
      formatter: (value: unknown) => (value ? String(value) : 'Không xác định')
    },
    age: {
      title: 'Tuổi',
      width: 10,
      formatter: (value: unknown) => (value ? `${value} tuổi` : '0 tuổi')
    },
    city: {
      title: 'Thành phố',
      width: 12,
      formatter: (value: unknown) => (value ? `${value}` : 'Không xác định')
    }
  }

  const handleImportSuccess = (data: Array<Record<string, unknown>>) => {
    const formattedData: TableData[] = data.map((item) => ({
      name: String(item['Họ tên'] || ''),
      age: Number(item['Tuổi']) || 0,
      city: String(item['Thành phố'] || '')
    }))
    tableData.value = formattedData
    ElMessage.success(`Đã nhập thành công ${formattedData.length} dòng dữ liệu`)
  }

  const handleImportError = (error: Error) => {
    console.error('Nhập thất bại:', error)
    ElMessage.error(`Nhập thất bại: ${error.message}`)
  }

  const handleExportSuccess = () => {
    console.log('Xuất thành công')
    ElMessage.success('Xuất Excel thành công')
  }

  const handleExportError = (error: Error) => {
    ElMessage.error(`Xuất thất bại: ${error.message}`)
  }

  const handleProgress = (progress: number) => {
    console.log('Tiến độ xuất:', progress)
  }

  const handleClear = () => {
    tableData.value = []
    ElMessage.info('Đã xóa dữ liệu')
  }
</script>
