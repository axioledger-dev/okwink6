

<template>
  <div class="flex flex-col gap-4 pb-5">
    
    <ElCard shadow="never" class="art-card-xs">
      <template #header>
        <div class="flex-wrap gap-3 flex-cb">
          <h3 class="m-0">高cấp表格完整có thể力展示</h3>
          <div class="flex flex-wrap gap-2">
            <ElTag type="success" effect="light">智có thể缓存</ElTag>
            <ElTag type="primary" effect="light">防抖Tìm kiếm</ElTag>
            <ElTag type="warning" effect="light">多loạiLàm mới</ElTag>
            <ElTag type="info" effect="light">错误xứ理</ElTag>
          </div>
        </div>
      </template>
      <div>
        <p class="m-0 mb-4 leading-[1.6] text-g-700">
          集成Tìm kiếm、Làm mới、全屏、大小控制、dãyHiển thị隐藏、拖拽排序、表格dạngthức控制、并内trí useTable
          tổ合thức函数，提供强大tổ合thức API，集成数据获取、智có thể缓存（LRU算pháp）、
          多loạiLàm mới策略v.v核心côngcó thể，全mặt提升表格开发效率。
        </p>

        
        <div class="my-4" v-if="showDebugPanel">
          <ElCollapse v-model="debugActiveNames">
            <ElCollapseItem name="cache" title="缓存统计và演示">
              <div class="flex flex-col gap-2">
                <div class="flex-cb">
                  <span class="font-medium text-g-700">缓存状态：</span>
                  <ElTag type="success">đã启dùng</ElTag>
                </div>
                <div class="flex-cb">
                  <span class="font-medium text-g-700">缓存điều数：</span>
                  <span class="font-semibold text-theme">{{ cacheInfo.total }}</span>
                </div>
                <div class="flex-cb">
                  <span class="font-medium text-g-700">缓存大小：</span>
                  <span class="font-semibold text-theme">{{ cacheInfo.size }}</span>
                </div>
                <div class="flex-cb">
                  <span class="font-medium text-g-700">命中信息：</span>
                  <span class="font-semibold text-theme">{{ cacheInfo.hitRate }}</span>
                </div>

                <div class="flex gap-2 mt-2">
                  <ElButton size="small" @click="handleClearCache">Xóa trống缓存</ElButton>
                  <ElButton size="small" @click="handleCleanExpiredCache">清理quakỳ缓存</ElButton>
                  <ElButton size="small" @click="handleTestCache">测试缓存</ElButton>
                  <ElButton size="small" @click="forceRefreshCacheInfo">Làm mới缓存信息</ElButton>
                </div>
              </div>
            </ElCollapseItem>
            <ElCollapseItem name="logs" title="缓存日志">
              <div class="flex flex-col gap-2">
                <div class="max-h-50 overflow-y-auto">
                  <div v-if="cacheDebugLogs.length === 0" class="p-5 text-center">
                    <ElEmpty description="ChưaKhông缓存日志" :image-size="60" />
                  </div>
                  <div v-else class="flex flex-col gap-1">
                    <div
                      v-for="(log, index) in cacheDebugLogs"
                      :key="index"
                      class="p-1.5 px-2 text-xs leading-[1.4] bg-g-200 border-l-1 border-g-400 rounded"
                      :class="{
                        'bg-[rgba(103,194,58,0.1)] !border-l-success': log.includes('✅'),
                        'bg-[rgba(64,158,255,0.1)] !border-l-theme': log.includes('🎯'),
                        'bg-[rgba(245,108,108,0.1)] !border-l-danger': log.includes('❌')
                      }"
                    >
                      {{ log }}
                    </div>
                  </div>
                </div>
                <div class="flex gap-2 mt-2">
                  <ElButton size="small" @click="cacheDebugLogs = []">Xóa trống日志</ElButton>
                </div>
              </div>
            </ElCollapseItem>
            <ElCollapseItem name="request" title="Vui lòng求状态">
              <div class="flex flex-col gap-2">
                <div class="flex-cb">
                  <span class="font-medium text-g-700">加载状态：</span>
                  <ElTag :type="loading ? 'warning' : 'success'">
                    {{ loading ? '加载中' : '空闲' }}
                  </ElTag>
                </div>
                <div class="flex-cb">
                  <span class="font-medium text-g-700">数据状态：</span>
                  <ElTag :type="hasData ? 'success' : 'info'">
                    {{ hasData ? `${data.length} điều数据` : 'Không数据' }}
                  </ElTag>
                </div>
                <div class="flex-cb">
                  <span class="font-medium text-g-700">错误状态：</span>
                  <ElTag :type="error ? 'danger' : 'success'">
                    {{ error ? 'Có错误' : '正常' }}
                  </ElTag>
                </div>
                <div class="flex flex-col gap-2">
                  <span class="font-medium text-g-700">当前Vui lòng求参数：</span>
                  <ElText
                    tag="pre"
                    class="max-h-50 p-2 overflow-y-auto text-xs bg-g-200 border border-g-400 rounded-md"
                    >{{ JSON.stringify(requestParams, null, 2) }}</ElText
                  >
                </div>
                <div class="flex gap-2 mt-2">
                  <ElButton size="small" @click="handleCancelRequest">HủyVui lòng求</ElButton>
                  <ElButton size="small" @click="handleClearData">Xóa trống数据</ElButton>
                </div>
              </div>
            </ElCollapseItem>
          </ElCollapse>
        </div>

        
        <div class="flex flex-wrap gap-4 mt-4">
          <ElSwitch v-model="showDebugPanel" active-text="调试mặt板" />
          <ElText type="info" size="small"> 💡 缓存côngcó thểđã启dùng，có thểthôngqua调试mặt板Xem详细信息 </ElText>
        </div>
      </div>
    </ElCard>

    
    <ArtSearchBar
      ref="searchBarRef"
      v-model="searchFormState"
      :items="searchItems"
      :rules="rules"
      :is-expand="false"
      :show-expand="true"
      :show-reset-button="true"
      :show-search-button="true"
      :disabled-search-button="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    
    <ElCard class="flex-1 art-table-card" shadow="never" style="margin-top: 0">
      <template #header>
        <div class="flex-cb">
          <h4 class="m-0">dùnghộ数据表格</h4>
          <div class="flex gap-2">
            <ElTag v-if="error" type="danger">{{ error.message }}</ElTag>
            <ElTag v-else-if="loading" type="warning">加载中...</ElTag>
            <ElTag v-else type="success">{{ data.length }} điều数据</ElTag>
          </div>
        </div>
      </template>

      
      
      <ArtTableHeader
        v-model:columns="columnChecks"
        :loading="loading"
        @refresh="handleRefresh"
        layout="refresh,size,fullscreen,columns,settings"
        fullClass="art-table-card"
      >
        <template #left>
          <ElSpace wrap>
            <ElButton type="primary" @click="handleAdd" v-ripple>
              <ElIcon>
                <Plus />
              </ElIcon>
              Thêm mớidùnghộ
            </ElButton>

            
            <ArtExcelExport
              :data="data as any"
              :columns="exportColumns as any"
              filename="dùnghộ数据"
              :auto-index="true"
              button-text="Xuất"
              @export-success="handleExportSuccess"
            />
            <ArtExcelImport
              @import-success="handleImportSuccess"
              @import-error="handleImportError"
              style="margin: 0 12px"
            />

            <ElButton @click="handleClearData" plain v-ripple> Xóa trống数据 </ElButton>

            <ElButton @click="handleBatchDelete" :disabled="selectedRows.length === 0" v-ripple>
              <ElIcon>
                <Delete />
              </ElIcon>
              lô量Xóa ({{ selectedRows.length }})
            </ElButton>
            
            <ElDropdown @command="handleColumnCommand" style="margin-left: 10px">
              <ElButton type="primary" plain>
                动态hơn新表格dãy
                <ElIcon class="el-icon--right">
                  <ArrowDown />
                </ElIcon>
              </ElButton>
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem command="addColumn">Thêm mớidãy（备注dãy）</ElDropdownItem>
                  <ElDropdownItem command="toggleColumn">Hiển thị隐藏（手机sốdãy）</ElDropdownItem>
                  <ElDropdownItem command="removeColumn">Xóadãy（状态dãy）</ElDropdownItem>
                  <ElDropdownItem command="reorderColumns"
                    >交换dãyvịtrí（性đừng、手机số）</ElDropdownItem
                  >
                  <ElDropdownItem command="updateColumn">hơn新dãy（手机sốdãy）</ElDropdownItem>
                  <ElDropdownItem command="batchUpdate">lô量hơn新（性đừng、手机số）</ElDropdownItem>
                  <ElDropdownItem command="resetColumns" divided>Đặt lạisởCódãy配trí</ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <ArtTable
        ref="tableRef"
        :loading="loading"
        :pagination="pagination"
        :data="data"
        :columns="columns"
        :height="computedTableHeight"
        empty-height="360px"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        @header-click="handleHeaderClick"
        @sort-change="handleSortChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        
        <template #avatar="{ row }">
          <div class="flex gap-3 user-info">
            <ElAvatar :src="row.avatar" :size="40" />
            <div class="flex-1 min-w-0">
              <p class="m-0 overflow-hidden font-medium text-ellipsis whitespace-nowrap">{{
                row.userName
              }}</p>
              <p
                class="m-0 mt-1 overflow-hidden text-xs text-g-700 text-ellipsis whitespace-nowrap"
                >{{ row.userEmail }}</p
              >
            </div>
          </div>
        </template>

        
        <template #avatar-header="{ column }">
          <div class="flex-c gap-1">
            <span>{{ column.label }}</span>
            <ElTooltip content="包含Avatar、姓名và邮箱" placement="top">
              <ElIcon>
                <QuestionFilled />
              </ElIcon>
            </ElTooltip>
          </div>
        </template>

        
        <template #status="{ row }">
          <ElTag :type="getUserStatusConfig(row.status).type" effect="light">
            {{ getUserStatusConfig(row.status).text }}
          </ElTag>
        </template>

        
        <template #score="{ row }">
          <ElRate v-model="row.score" disabled size="small" />
        </template>

        
        <template #operation="{ row }">
          <div class="flex">
            <ArtButtonTable type="view" :row="row" @click="handleView(row)" />
            <ArtButtonTable type="add" :row="row" @click="handleAdd()" />
            <ArtButtonTable type="edit" :row="row" @click="handleEdit(row)" />
            <ArtButtonTable type="delete" :row="row" @click="handleDelete(row)" />
          </div>
        </template>

        
        <template #userPhone-header="{ column }">
          <ElPopover placement="bottom" :width="200" trigger="hover">
            <template #reference>
              <div class="inline-block gap-1 text-theme c-p custom-header">
                <span>{{ column.label }}</span>
                <ElIcon>
                  <Search />
                </ElIcon>
              </div>
            </template>
            <ElInput
              v-model="phoneSearch"
              placeholder="Tìm kiếm手机số"
              size="small"
              @input="handlePhoneSearch"
            >
              <template #prefix>
                <ElIcon>
                  <Search />
                </ElIcon>
              </template>
            </ElInput>
          </ElPopover>
        </template>
      </ArtTable>
    </ElCard>

    
    <ElCard shadow="never" class="art-card-xs">
      <template #header>
        <h4 class="m-0">高cấpcôngcó thể演示</h4>
      </template>
      <div class="flex flex-col gap-6">
        
        <div class="p-4 bg-g-200 border-full-d rounded-lg">
          <h5 class="m-0 mb-4 text-sm font-semibold">sựviệc监听演示</h5>
          <div class="flex flex-wrap gap-2 mb-3 last:mb-0">
            <ElButton @click="toggleEventDemo" :type="eventDemoEnabled ? 'success' : 'primary'">
              {{ eventDemoEnabled ? 'Đóng' : '开启' }}sựviệc监听
            </ElButton>
            <ElButton @click="clearEventLogs" v-if="eventDemoEnabled">Xóa trống日志</ElButton>
          </div>
          <div
            v-if="eventDemoEnabled && eventLogs.length > 0"
            class="p-3 mt-3 bg-g-200 border border-g-400 rounded-md"
          >
            <div class="flex-cb mb-2 font-medium text-g-700">
              <span>nhất近sựviệc日志：</span>
              <ElTag size="small">{{ eventLogs.length }} điều</ElTag>
            </div>
            <div class="flex flex-col gap-1 max-h-50 overflow-y-auto">
              <div
                v-for="(log, index) in eventLogs.slice(0, 20)"
                :key="index"
                class="flex-c gap-2 p-1.5 px-2 text-xs bg-g-300 border-l-1 border-g-400 rounded"
              >
                <ElTag :type="getEventType(log.type)" size="small">{{ log.type }}</ElTag>
                <span class="flex-1 text-g-700">{{ log.message }}</span>
                <span class="text-xs text-g-600">{{ log.time }}</span>
              </div>
            </div>
          </div>
        </div>

        
        <div class="p-4 bg-g-200 border-full-d rounded-lg">
          <h5 class="m-0 mb-4 text-sm font-semibold">表格配trí演示</h5>
          <div class="flex flex-wrap gap-2 mb-3 last:mb-0">
            <ElSwitch
              v-model="tableConfig.fixedHeight"
              active-text="固定高độ (500px)"
              inactive-text="tự适nên高độ"
              class="ml-2"
            />
          </div>
        </div>

        
        <div class="p-4 bg-g-200 border-full-d rounded-lg">
          <h5 class="m-0 mb-4 text-sm font-semibold">tự定义côngcó thể</h5>
          <div class="flex flex-wrap gap-2 mb-3 last:mb-0">
            <ElButton @click="handleScrollToTop">滚动đếnđỉnhbộ</ElButton>
            <ElButton @click="handleScrollToPosition">滚动đến指定vịtrí</ElButton>
            <ElButton @click="handleToggleSelection">切换Chọn tất cả</ElButton>
            <ElButton @click="handleGetTableInfo">获取表格信息</ElButton>
          </div>
        </div>
      </div>
    </ElCard>

    
    <ElCard shadow="never" class="art-card-xs">
      <template #header>
        <h4 class="m-0">缓存Làm mới策略演示</h4>
      </template>
      <div class="flex flex-wrap gap-2 max-md:flex-col">
        <ElButton @click="refreshData" v-ripple>
          <ElIcon>
            <Refresh />
          </ElIcon>
          thôngdùngLàm mới
        </ElButton>
        <ElButton @click="refreshSoft" v-ripple>
          <ElIcon>
            <Refresh />
          </ElIcon>
          软Làm mới
        </ElButton>
        <ElButton @click="refreshCreate" v-ripple>
          <ElIcon>
            <Plus />
          </ElIcon>
          Thêm mới后Làm mới
        </ElButton>
        <ElButton @click="refreshUpdate" v-ripple>
          <ElIcon>
            <Edit />
          </ElIcon>
          Chỉnh sửa后Làm mới
        </ElButton>
        <ElButton @click="refreshRemove" v-ripple>
          <ElIcon>
            <Delete />
          </ElIcon>
          Xóa后Làm mới
        </ElButton>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, nextTick } from 'vue'
  import {
    Plus,
    Delete,
    Edit,
    Search,
    Refresh,
    QuestionFilled,
    ArrowDown
  } from '@element-plus/icons-vue'
  import { ElMessageBox } from 'element-plus'
  import { useTable, CacheInvalidationStrategy } from '@/hooks/core/useTable'
  import { fetchGetUserList } from '@/api/system-manage'
  import { ACCOUNT_TABLE_DATA } from '@/mock/temp/formData'
  import { getColumnKey } from '@/hooks/core/useTableColumns'

  defineOptions({ name: 'AdvancedTableDemo' })

  type UserListItem = Api.SystemManage.UserListItem

  const selectedRows = ref<UserListItem[]>([])

  const tableRef = ref()

  const showDebugPanel = ref(false)
  const debugActiveNames = ref(['cache', 'request', 'logs'])

  const cacheDebugLogs = ref<string[]>([])
  const requestParams = ref<any>({
    current: 1,
    size: 20,
    name: '',
    phone: '',
    status: '',
    department: '',
    daterange: undefined
  })

  const cacheKeys = ref<string[]>([])

  const phoneSearch = ref('')

  const eventDemoEnabled = ref(false)
  const eventLogs = ref<Array<{ type: string; message: string; time: string }>>([])

  const tableConfig = ref({
    height: '100%',
    fixedHeight: false
  })

  const computedTableHeight = computed(() => {
    return tableConfig.value.fixedHeight ? '500px' : ''
  })

  const searchBarRef = ref()

  const rules = {
    name: [{ required: true, message: 'Vui lòng nhậpdùnghộ名', trigger: 'blur' }],
    phone: [
      { required: true, message: 'Vui lòng nhập手机số', trigger: 'blur' },
      { pattern: /^1[3456789]\d{9}$/, message: 'Vui lòng nhập正确手机số', trigger: 'blur' }
    ]
  }

  const searchFormState = ref({
    name: '',
    phone: '',
    status: '1',
    department: '',
    daterange: ['2025-01-01', '2025-02-10']
  })

  const USER_STATUS_CONFIG = {
    '1': { type: 'success' as const, text: 'trongtuyến' },
    '2': { type: 'info' as const, text: '离tuyến' },
    '3': { type: 'warning' as const, text: 'khác常' },
    '4': { type: 'danger' as const, text: '注销' }
  } as const

  const searchItems = computed(() => [
    {
      key: 'name',
      label: 'dùnghộ名',
      type: 'input',
      props: {
        placeholder: 'Vui lòng nhậpdùnghộ名'
      }
    },
    {
      key: 'phone',
      label: '手机số',
      type: 'input',
      props: {
        placeholder: 'Vui lòng nhập手机số',
        maxlength: '11'
      }
    },
    {
      key: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '全bộ', value: '' },
        { label: 'trongtuyến', value: '1' },
        { label: '离tuyến', value: '2' },
        { label: 'khác常', value: '3' },
        { label: '注销', value: '4' }
      ]
    },
    {
      key: 'department',
      label: 'bộcửa',
      type: 'select',
      options: [
        { label: '全bộ', value: '' },
        { label: '技术bộ', value: '技术bộ' },
        { label: 'sảnphẩmbộ', value: 'sảnphẩmbộ' },
        { label: '运营bộ', value: '运营bộ' },
        { label: '市sânbộ', value: '市sânbộ' },
        { label: '设计bộ', value: '设计bộ' }
      ]
    },
    {
      key: 'daterange',
      label: '日kỳ范围',
      type: 'daterange',
      props: {
        type: 'daterange',
        startPlaceholder: '开始日kỳ',
        endPlaceholder: '结束日kỳ',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  ])

  const exportColumns = computed(() => ({
    userName: { title: 'dùnghộ名', width: 15 },
    userEmail: { title: '邮箱', width: 20 },
    userPhone: { title: '手机số', width: 15 },
    userGender: { title: '性đừng', width: 10 },
    department: { title: 'bộcửa', width: 15 },
    status: {
      title: '状态',
      width: 10,
      formatter: (value: string) => getUserStatusConfig(value).text
    }
  }))

  const getUserStatusConfig = (status: string) => {
    return (
      USER_STATUS_CONFIG[status as keyof typeof USER_STATUS_CONFIG] || {
        type: 'info' as const,
        text: 'chưa知'
      }
    )
  }

  const {

    data,
    loading,
    error,
    hasData,

    pagination,

    handleSizeChange,
    handleCurrentChange,

    searchParams,
    resetSearchParams,

    getData,
    getDataDebounced,
    clearData,

    refreshData,
    refreshSoft,
    refreshCreate,
    refreshUpdate,
    refreshRemove,

    cacheInfo,
    clearCache,

    clearExpiredCache,

    cancelRequest,

    columns,
    columnChecks,
    addColumn,
    removeColumn,
    updateColumn,
    toggleColumn,
    resetColumns,
    batchUpdateColumns,
    reorderColumns,
    getColumnConfig,
    getAllColumns
  } = useTable({

    core: {
      apiFn: (params) => {

        const requestKey = JSON.stringify(params)
        console.log('🚀 API Vui lòng求参数:', params)
        addCacheLog(`🚀 API Vui lòng求: current=${params.current}, size=${params.size}`)
        addCacheLog(`🔑 Vui lòng求键: ${requestKey.substring(0, 100)}...`)

        updateCacheKeys(requestKey)

        return fetchGetUserList(params)
      },
      apiParams: {
        current: 1,
        size: 20,
        ...searchFormState.value
      },

      excludeParams: ['daterange'],

      immediate: true,
      columnsFactory: () => [

        { type: 'selection', width: 50 },

        { type: 'globalIndex', width: 60, label: '序số' },
        {
          prop: 'avatar',
          label: 'dùnghộ信息',
          minWidth: 200,
          useSlot: true,
          useHeaderSlot: true,
          sortable: false

        },
        {
          prop: 'userGender',
          label: '性đừng',
          sortable: true,
          formatter: (row) => row.userGender || 'chưa知'
        },
        {
          prop: 'userPhone',
          label: '手机số',
          useHeaderSlot: true,
          sortable: true
        },
        {
          prop: 'department',
          label: 'bộcửa',
          sortable: true
        },
        {
          prop: 'score',
          label: '评phần',
          useSlot: true,
          sortable: true
        },
        {
          prop: 'status',
          label: '状态',
          useSlot: true,
          sortable: true
        },
        {
          prop: 'operation',
          label: '操作',
          width: 190,
          useSlot: true,
          fixed: 'right'
        }
      ]
    },

    transform: {
      dataTransformer: (records) => {
        if (!Array.isArray(records)) return []

        return records.map((item, index: number) => ({
          ...item,
          avatar: ACCOUNT_TABLE_DATA[index % ACCOUNT_TABLE_DATA.length].avatar,
          department: ['技术bộ', 'sảnphẩmbộ', '运营bộ', '市sânbộ', '设计bộ'][
            Math.floor(Math.random() * 5)
          ],
          score: Math.floor(Math.random() * 5) + 1,
          status: ['1', '2', '3', '4'][Math.floor(Math.random() * 4)]
        }))
      }

    },

    performance: {
      enableCache: true,
      cacheTime: 5 * 60 * 1000,
      debounceTime: 300,
      maxCacheSize: 100
    },

    hooks: {
      onSuccess: (data, response) => {
        console.log('📊 响nên详情:', response)
        addCacheLog(`✅ mạng络Vui lòng求成công: ${data.length} điều数据`)
        addCacheLog(
          `📝 响nên信息: total=${response.total}, current=${response.current}, size=${response.size}`
        )
      },
      onError: (error) => {
        console.error('❌ 数据加载失败:', error)
        addCacheLog(`❌ Vui lòng求失败: ${error.message}`)
        ElMessage.error(error.message)
      },
      onCacheHit: (data, response) => {
        console.log('🎯 缓存命中:', data.length, 'điều')
        console.log('🔑 缓存来nguồn:', response)
        addCacheLog(
          `🎯 缓存命中: ${data.length} điều数据 (current=${response.current}, size=${response.size})`
        )
        ElMessage.info('数据来tự缓存')
      },
      resetFormCallback: () => {
        console.log('🔄 表单đãĐặt lại')
        addCacheLog('🔄 表单đãĐặt lại')
      }
    },

    debug: {
      enableLog: true,
      logLevel: 'info'
    }
  })

  const handleSelectionChange = (selection: UserListItem[]) => {
    selectedRows.value = selection
    console.log('选择变hơn:', selection)
  }

  const handleRowClick = (row: UserListItem) => {
    console.log('行điểm击:', row)
    logEvent('行điểm击', `điểm击dùnghộ: ${row.userName}`)
  }

  const handleHeaderClick = (column: { label: string; property: string }) => {
    console.log('表头điểm击:', column)
    logEvent('表头điểm击', `điểm击 ${column.label} dãy表头`)
  }

  interface SortInfo {
    prop: string
    order: 'ascending' | 'descending' | null
  }

  const handleSortChange = (sortInfo: SortInfo) => {
    console.log('排序sựviệc:', sortInfo)
    console.log('排序字đoạn:', sortInfo.prop)
    console.log('排序phươnghướng:', sortInfo.order)
    logEvent('排序变hơn', `字đoạn: ${sortInfo.prop}, phươnghướng: ${sortInfo.order}`)
  }

  const logEvent = (type: string, message: string) => {
    if (!eventDemoEnabled.value) return

    const time = new Date().toLocaleTimeString()
    eventLogs.value.unshift({ type, message, time })

    if (eventLogs.value.length > 20) {
      eventLogs.value = eventLogs.value.slice(0, 20)
    }
  }

  const getEventType = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
    const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
      行điểm击: 'primary',
      行Đôi击: 'success',
      行右键: 'warning',
      单元格điểm击: 'info',
      单元格Đôi击: 'success',
      表头điểm击: 'primary',
      选择变hơn: 'warning',
      排序变hơn: 'success'
    }
    return typeMap[type] || 'info'
  }

  const toggleEventDemo = () => {
    eventDemoEnabled.value = !eventDemoEnabled.value
    if (eventDemoEnabled.value) {
      ElMessage.success('sựviệc监听đã开启，Vui lòngvà表格交lẫn nhauXem效果')
    } else {
      ElMessage.info('sựviệc监听đãĐóng')
    }
  }

  const clearEventLogs = () => {
    eventLogs.value = []
    ElMessage.info('sựviệc日志đãXóa trống')
  }

  const handleScrollToTop = () => {
    tableRef.value?.scrollToTop()
  }

  const handleScrollToPosition = () => {
    tableRef.value?.elTableRef.setScrollTop(200)
  }

  const handleToggleSelection = () => {
    if (selectedRows.value.length === 0) {
      tableRef.value?.elTableRef.toggleAllSelection()
      ElMessage.info('đãChọn tất cả')
    } else {
      tableRef.value?.elTableRef.clearSelection()
      ElMessage.info('đãHủyChọn tất cả')
    }
  }

  const handleGetTableInfo = () => {
    const info = {
      数据điều数: data.value.length,
      选中điều数: selectedRows.value.length,
      dãy数: columns?.value?.length ?? 0,
      当前页: pagination.current,
      mỗi页大小: pagination.size,
      总điều数: pagination.total
    }

    console.log('表格信息:', info)
    ElMessage.info(`表格信息đã输出đến控制đài，当前 ${info.数据điều数} điều数据`)
  }

  const handleSearch = async () => {
    await searchBarRef.value.validate()

    console.log('Tìm kiếm参数:', searchFormState.value)
    const { daterange, ...filtersParams } = searchFormState.value
    const [startTime, endTime] = Array.isArray(daterange) ? daterange : [null, null]

    Object.assign(searchParams, { ...filtersParams, startTime, endTime })
    getData()
  }

  const handleReset = () => {
    addCacheLog('🔄 Đặt lạiTìm kiếm')

    resetSearchParams()
  }

  const handlePhoneSearch = (value: string) => {
    searchFormState.value.phone = value
    searchParams.phone = value
    requestParams.value = { ...searchParams, phone: value }
    addCacheLog(`📱 手机sốTìm kiếm: ${value}`)
    getDataDebounced()
  }

  const handleRefresh = () => {
    addCacheLog('🔄 手动Làm mới')
    refreshData()
  }

  const handleAdd = () => {
    ElMessage.success('Thêm mớidùnghộ成công')
    refreshCreate()
  }

  const handleEdit = (row: UserListItem) => {
    ElMessage.success(`Chỉnh sửadùnghộ ${row.userName} 成công`)
    setTimeout(() => {
      refreshUpdate()
    }, 1000)
  }

  const handleDelete = async (row: UserListItem) => {
    try {
      await ElMessageBox.confirm(`确定cầnXóadùnghộ ${row.userName} ？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: 'Hủy',
        type: 'warning'
      })

      ElMessage.success('Xóa成công')
      setTimeout(() => {
        refreshRemove()
      }, 1000)
    } catch {
      ElMessage.info('đãHủyXóa')
    }
  }

  const handleView = (row: UserListItem) => {
    ElMessage.info(`Xemdùnghộ ${row.userName}`)
  }

  const handleBatchDelete = async () => {
    try {
      await ElMessageBox.confirm(
        `确定cầnXóa选中 ${selectedRows.value.length} dùnghộ？`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: 'Hủy',
          type: 'warning'
        }
      )

      ElMessage.success(`lô量Xóa ${selectedRows.value.length} dùnghộ成công`)
      selectedRows.value = []
      setTimeout(() => {
        refreshRemove()
      }, 1000)
    } catch {
      ElMessage.info('đãHủyXóa')
    }
  }

  const handleExportSuccess = (filename: string, count: number) => {
    ElMessage.success(`Xuất ${count} điều数据成công`)
  }

  const handleImportSuccess = (data: Record<string, any>[]) => {
    ElMessage.success(`Nhập ${data.length} điều数据成công`)
    refreshCreate()
  }

  const handleImportError = (error: Error) => {
    ElMessage.error(`Nhập失败：${error.message}`)
  }

  const handleClearCache = () => {
    clearCache(CacheInvalidationStrategy.CLEAR_ALL, '手动Xóa trống')
    cacheKeys.value = []
    addCacheLog('🗑️ 手动Xóa trốngsởCó缓存')
    ElMessage.success('缓存đãXóa trống')
  }

  const handleCleanExpiredCache = () => {
    const count = clearExpiredCache()
    addCacheLog(`🧹 清理 ${count} điềuquakỳ缓存`)
    ElMessage.info(`清理 ${count} điềuquakỳ缓存`)
  }

  const handleCancelRequest = () => {
    cancelRequest()
    addCacheLog('❌ Hủy当前Vui lòng求')
    ElMessage.info('Vui lòng求đãHủy')
  }

  const handleClearData = () => {
    clearData()
    addCacheLog('🗑️ Xóa trốngsởCó数据')
    ElMessage.info('数据đãXóa trống')
  }

  const handleTestCache = () => {

    const testPages = [1, 2, 3, 2, 1]

    ElMessage.info('开始缓存测试...')
    addCacheLog('🧪 开始缓存测试')

    let index = 0
    const testInterval = setInterval(() => {
      if (index >= testPages.length) {
        clearInterval(testInterval)
        addCacheLog('✅ 缓存测试完成')
        ElMessage.success('缓存测试完成！观察缓存统计变化')
        return
      }

      const page = testPages[index]
      addCacheLog(`📄 测试切换đếnthứ ${page} 页`)

      requestParams.value = { ...requestParams.value, current: page }

      handleCurrentChange(page)
      index++
    }, 1000)
  }

  const addCacheLog = (message: string): void => {
    const timestamp = new Date().toLocaleTimeString()
    cacheDebugLogs.value.unshift(`[${timestamp}] ${message}`)
    if (cacheDebugLogs.value.length > 20) {
      cacheDebugLogs.value = cacheDebugLogs.value.slice(0, 20)
    }
  }

  const updateCacheKeys = (key: string, operation: 'add' | 'remove' = 'add'): void => {
    if (operation === 'add' && !cacheKeys.value.includes(key)) {
      cacheKeys.value.push(key)
      addCacheLog(`Thêm mới缓存键: ${getCacheKeySummary(key)}`)
    } else if (operation === 'remove') {
      const index = cacheKeys.value.indexOf(key)
      if (index > -1) {
        cacheKeys.value.splice(index, 1)
        addCacheLog(`移除缓存键: ${getCacheKeySummary(key)}`)
      }
    }
  }

  const getCacheKeySummary = (key: string): string => {
    try {
      const params = JSON.parse(key)
      return `页码: ${params.current || 1}, 大小: ${params.size || 20}${params.name ? ', 名称: ' + params.name : ''}${params.status ? ', 状态: ' + params.status : ''}`
    } catch {
      return 'Không效缓存键'
    }
  }

  const forceRefreshCacheInfo = (): void => {
    const currentStats = cacheInfo.value
    addCacheLog(`缓存信息Làm mới: ${currentStats.total} điều缓存`)

    if (currentStats.total === 0) {
      cacheKeys.value = []
    }

    nextTick(() => {
      console.log('当前缓存统计:', cacheInfo.value)
    })
  }

  watch(
    () => [pagination.current, pagination.size, searchFormState.value],
    ([current, size, search]) => {
      requestParams.value = {
        ...(search as any),
        current,
        size
      }
    },
    { deep: true, immediate: true }
  )

  const handleColumnCommand = (command: string): void => {
    switch (command) {
      case 'addColumn': {

        addColumn?.({
          prop: 'remark',
          label: '备注',
          width: 150,
          formatter: () => h('span', { style: 'color: #999' }, 'ChưaKhông备注')
        })
        ElMessage.success('đãThêm mới"备注"dãy')
        break
      }

      case 'toggleColumn': {

        if (getColumnConfig?.('userPhone')) {
          toggleColumn?.('userPhone')
        }
        break
      }

      case 'removeColumn': {

        removeColumn?.('status')

        break
      }

      case 'reorderColumns': {

        const allCols = getAllColumns?.()
        if (allCols) {
          const genderIndex = allCols.findIndex((col) => getColumnKey(col) === 'userGender')
          const phoneIndex = allCols.findIndex((col) => getColumnKey(col) === 'userPhone')

          if (genderIndex !== -1 && phoneIndex !== -1) {
            reorderColumns?.(genderIndex, phoneIndex)
            ElMessage.success('đã交换性đừngvà手机sốdãyvịtrí')
          }
        }
        break
      }

      case 'updateColumn': {

        updateColumn?.('userPhone', {
          label: '联hệchớp话',
          width: 140
        })
        ElMessage.success('手机sốdãy标题đãhơn新là"联hệchớp话"')
        break
      }

      case 'batchUpdate': {

        batchUpdateColumns?.([
          { prop: 'userGender', updates: { width: 200, label: '性đừng-update', sortable: false } },
          { prop: 'userPhone', updates: { width: 200, label: '手机số-update', sortable: false } }
        ])
        break
      }

      case 'resetColumns': {

        resetColumns?.()
        ElMessage.success('đãĐặt lạisởCódãy配trí')
        break
      }

      default:
        console.warn('chưa知dãy配trí命令:', command)
    }
  }
</script>

<style scoped>
  .user-info .el-avatar {
    flex-shrink: 0;
    width: 40px !important;
    height: 40px !important;
  }

  .user-info .el-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .custom-header:hover {
    color: var(--el-color-primary-light-3);
  }

  .demo-group .config-toggles .el-switch {
    --el-switch-on-color: var(--el-color-primary);
  }

  .demo-group .performance-info .el-alert {
    --el-alert-padding: 12px;
  }
</style>
