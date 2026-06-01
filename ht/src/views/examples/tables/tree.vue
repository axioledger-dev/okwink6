
<template>
  <div class="art-full-height">
    <div class="box-border flex gap-4 h-full max-md:block max-md:gap-0 max-md:h-auto">
      <div class="flex-shrink-0 w-58 h-full max-md:w-full max-md:h-auto max-md:mb-5">
        <ElCard class="tree-card art-card-xs flex flex-col h-full mt-0" shadow="never">
          <template #header>
            <b>phầnloại树</b>
          </template>
          <ElScrollbar>
            <ElTree
              :data="treeData"
              :props="treeProps"
              node-key="id"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
            />
          </ElScrollbar>
        </ElCard>
      </div>

      <div class="flex flex-col flex-grow">
        <UserSearch v-model="defaultFilter" />

        <ElCard class="flex flex-col flex-1 min-h-0 art-table-card" shadow="never">
          <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
            <template #left>
              <ElSpace wrap>
                <ElButton @click="showButtons = !showButtons" v-ripple type="primary" plain
                  >{{ showButtons ? 'Thu gọn' : 'Mở rộng' }}theo钮tổ</ElButton
                >
                <ElButton v-show="showButtons" v-ripple v-for="value in 12" :key="value"
                  >表格tự适nên</ElButton
                >
              </ElSpace>
            </template>
          </ArtTableHeader>

          <ArtTable
            rowKey="id"
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetUserList } from '@/api/system-manage'
  import UserSearch from '@/views/system/user/modules/user-search.vue'

  defineOptions({ name: 'TreeTable' })

  const showButtons = ref(false)

  const treeData = ref([
    {
      id: 1,
      label: '技术bộ',
      children: [
        {
          id: 11,
          label: '前端开发tổ',
          children: [
            { id: 111, label: 'React 团đội' },
            { id: 112, label: 'Vue 团đội' },
            { id: 113, label: '移动端团đội' }
          ]
        },
        {
          id: 12,
          label: '后端开发tổ',
          children: [
            { id: 121, label: 'Java 团đội' },
            { id: 122, label: 'Node.js 团đội' },
            { id: 123, label: 'Python 团đội' }
          ]
        },
        {
          id: 13,
          label: '测试tổ',
          children: [
            { id: 131, label: 'côngcó thể测试' },
            { id: 132, label: 'Tự động化测试' },
            { id: 133, label: '性có thể测试' }
          ]
        },
        {
          id: 14,
          label: '运维tổ',
          children: [
            { id: 141, label: 'hệ统运维' },
            { id: 142, label: 'DevOps' }
          ]
        }
      ]
    },
    {
      id: 2,
      label: 'sảnphẩmbộ',
      children: [
        {
          id: 21,
          label: 'sảnphẩm设计tổ',
          children: [
            { id: 211, label: 'UI 设计' },
            { id: 212, label: 'UX 设计' },
            { id: 213, label: '交lẫn nhau设计' }
          ]
        },
        {
          id: 22,
          label: 'sảnphẩm运营tổ',
          children: [
            { id: 221, label: 'dùnghộ运营' },
            { id: 222, label: '内容运营' },
            { id: 223, label: '活动运营' }
          ]
        },
        { id: 23, label: '数据phần析tổ' }
      ]
    },
    {
      id: 3,
      label: '市sânbộ',
      children: [
        { id: 31, label: 'phẩm牌推广tổ' },
        { id: 32, label: 'cừđạo拓展tổ' },
        {
          id: 33,
          label: '销售tổ',
          children: [
            { id: 331, label: 'doanhnghiệp客hộ' },
            { id: 332, label: '人客hộ' }
          ]
        }
      ]
    },
    {
      id: 4,
      label: '行政bộ',
      children: [
        { id: 41, label: '人力资nguồntổ' },
        { id: 42, label: '财务tổ' },
        { id: 43, label: '行政后勤tổ' }
      ]
    },
    {
      id: 5,
      label: '客服bộ',
      children: [
        { id: 51, label: '售前咨询' },
        { id: 52, label: '售后支持' },
        { id: 53, label: '客hộ成công' }
      ]
    }
  ])

  const treeProps = {
    children: 'children',
    label: 'label'
  }

  const handleNodeClick = (data: any) => {
    console.log('选中tiếtđiểm:', data)

  }

  const defaultFilter = ref({
    name: undefined
  })

  const {
    data,
    columns,
    columnChecks,
    loading,
    pagination,
    refreshData,
    handleSizeChange,
    handleCurrentChange
  } = useTable({
    core: {
      apiFn: fetchGetUserList,
      apiParams: {
        current: 1,
        size: 20,
        userName: '',
        userPhone: '',
        userEmail: ''
      },
      columnsFactory: () => [
        {
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'nickName',
          label: '昵称'
        },
        {
          prop: 'userGender',
          label: '性đừng',
          sortable: true,
          formatter: (row) => row.userGender || 'chưa知'
        },
        {
          prop: 'userPhone',
          label: '手机số'
        },
        {
          prop: 'userEmail',
          label: '邮箱'
        }
      ]
    }
  })
</script>

<style scoped>
  .tree-card :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    padding: 10px 2px 10px 10px;
  }
</style>
