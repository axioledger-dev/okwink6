<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchGetGameCategoryList } from '@/api/lottery'
import { fetchPlatformList, updatePlatformStatus } from '@/api/game-platform'
import request from '@/utils/http'

interface Platform {
  id: number
  code: string
  name: string
  slot_name?: string
  live_name?: string
  chess_name?: string
  fishing_name?: string
  type: string
  status: string
  hot: number
  sort: number
  icon?: string
  banner?: string
  mobile_icon?: string
  mobile_banner?: string
  slot_banner?: string
  live_banner?: string
  chess_banner?: string
  fishing_banner?: string
  gameCount?: number
}

const editDialogVisible = ref(false)
const editForm = ref<Partial<Platform>>({})
const uploadLoading = ref(false)

interface Category {
  id: number
  code: string
  name: string
  status: number
}

const router = useRouter()
const loading = ref(false)
const syncLoading = ref(false)
const activeCategory = ref('')
const filterPlatformCode = ref('')
const categories = ref<Category[]>([])
const platforms = ref<Platform[]>([])

const currentPage = ref(1)
const pageSize = ref(20)

const selectedPlatforms = ref<Platform[]>([])

const searchKeyword = ref('')

const filteredPlatforms = computed(() => {
  return platforms.value
})

const filteredByCode = computed(() => {
  let result = filteredPlatforms.value

  if (filterPlatformCode.value) {
    result = result.filter(p => p.code === filterPlatformCode.value)
  }

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.code.toLowerCase().includes(keyword)
    )
  }

  return result
})

const paginatedTotal = computed(() => filteredByCode.value.length)

const displayPlatforms = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredByCode.value.slice(start, end)
})

const activeCategoryName = computed(() => {
  const cat = categories.value.find(c => c.code === activeCategory.value)
  return cat ? cat.name : ''
})

onMounted(async () => {
  await loadCategories()
  await loadPlatforms()
})

async function loadCategories() {
  try {
    const res = await fetchGetGameCategoryList()
    const list = res?.list || []

    categories.value = list.filter((c: Category) => c.code !== 'hot' && c.status === 1)
    if (categories.value.length > 0) {
      activeCategory.value = categories.value[0].code
    }
  } catch (e) {
    console.error('Tải phân loại thất bại:', e)
  }
}

async function loadPlatforms() {
  loading.value = true
  try {

    const params: any = { page: 1, limit: 100 }
    if (activeCategory.value) {
      params.type = activeCategory.value
    }
    const res = await fetchPlatformList(params)
    platforms.value = res.list || []
    console.log('Danh sách nền tảng:', platforms.value.map(p => ({ code: p.code, type: p.type })))
  } catch (e) {
    console.error('Tải nền tảng thất bại:', e)
  } finally {
    loading.value = false
  }
}

function handleCategoryChange(code: string) {
  activeCategory.value = code
  filterPlatformCode.value = ''
  currentPage.value = 1
  loadPlatforms()
}

function handleSearch() {
  currentPage.value = 1
  ElMessage.success(`Lọc hoàn tất, tổng ${paginatedTotal.value} nền tảng`)
}

function handleReset() {
  if (categories.value.length > 0) {
    activeCategory.value = categories.value[0].code
  }
  filterPlatformCode.value = ''
  searchKeyword.value = ''
  currentPage.value = 1
  loadPlatforms()
}

function handleSizeChange(val: number) {
  pageSize.value = val
  currentPage.value = 1
}

function handlePageChange(val: number) {
  currentPage.value = val
}

async function handleStatusChange(row: Platform, status: string) {
  try {
    await updatePlatformStatus(row.id, status)
    ElMessage.success('Thao tác thành công')
    row.status = status
  } catch (e) {
    console.error(e)
  }
}

function goToGameManage(platform: Platform) {
  router.push(`/lottery/game-list/${platform.code}`)
}

async function handleSyncNGGames() {

  const platform = filterPlatformCode.value || (filteredPlatforms.value.length > 0 ? filteredPlatforms.value[0].code : '')

  if (!platform) {
    return ElMessage.warning('Vui lòng chọn một nền tảng trước')
  }

  ElMessageBox.confirm(
    `Xác nhận đồng bộ dữ liệu trò chơi từ giao diện NG cho nền tảng【${platform}】？`,
    'Xác nhận đồng bộ',
    { type: 'warning' }
  ).then(async () => {
    syncLoading.value = true
    try {
      const res = await request.post<any>({
        url: '/app/admin/api/game/sync-ng-games',
        data: { platType: platform.toLowerCase() }
      })

      if (res?.count) {
        ElMessage.success(`Đồng bộ thành công, tổng ${res.count} trò chơi`)
      } else {
        ElMessage.success('Đồng bộ hoàn tất')
      }
    } catch (e: any) {
      ElMessage.error(e.message || 'Đồng bộ thất bại')
    } finally {
      syncLoading.value = false
    }
  })
}

function getStatusType(status: string) {
  return status === 'online' ? 'success' : status === 'maintain' ? 'warning' : 'danger'
}

function getStatusText(status: string) {
  return status === 'online' ? 'Bình thường' : status === 'maintain' ? 'Bảo trì' : 'Ngoại tuyến'
}

function handleEdit(row: Platform) {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

async function handleSave() {
  if (!editForm.value.id) return

  try {
    await request.post({
      url: '/app/admin/api/game/update-platform',
      data: {
        id: editForm.value.id,
        name: editForm.value.name,
        slot_name: editForm.value.slot_name,
        live_name: editForm.value.live_name,
        chess_name: editForm.value.chess_name,
        fishing_name: editForm.value.fishing_name,
        icon: editForm.value.icon,
        banner: editForm.value.banner,
        mobile_icon: editForm.value.mobile_icon,
        mobile_banner: editForm.value.mobile_banner,
        slot_banner: editForm.value.slot_banner,
        live_banner: editForm.value.live_banner,
        chess_banner: editForm.value.chess_banner,
        fishing_banner: editForm.value.fishing_banner,
        sort: editForm.value.sort,
        hot: editForm.value.hot
      }
    })
    ElMessage.success('Lưu thành công')
    editDialogVisible.value = false

    const index = platforms.value.findIndex(p => p.id === editForm.value.id)
    if (index !== -1) {
      platforms.value[index] = { ...platforms.value[index], ...editForm.value }
    }
  } catch (e: any) {
    ElMessage.error(e.message || 'Lưu thất bại')
  }
}

function handleSelectionChange(selection: Platform[]) {
  selectedPlatforms.value = selection
}

async function handleBatchDelete() {
  if (selectedPlatforms.value.length === 0) {
    return ElMessage.warning('Vui lòng chọn nền tảng cần xóa trước')
  }

  ElMessageBox.confirm(
    `Xác nhận xóa ${selectedPlatforms.value.length} nền tảng đã chọn? Thao tác này sẽ đồng thời xóa tất cả trò chơi thuộc các nền tảng này!`,
    'Xác nhận xóa hàng loạt',
    { type: 'warning' }
  ).then(async () => {
    try {
      const ids = selectedPlatforms.value.map(p => p.id)
      for (const id of ids) {
        await request.post({
          url: '/app/admin/api/game/delete-platform',
          data: { id }
        })
      }
      ElMessage.success(`Xóa thành công ${ids.length} nền tảng`)

      platforms.value = platforms.value.filter(p => !ids.includes(p.id))
      selectedPlatforms.value = []
    } catch (e: any) {
      ElMessage.error(e.message || 'Xóa thất bại')
    }
  })
}

async function handleDelete(row: Platform) {
  ElMessageBox.confirm(
    `Xác nhận xóa nền tảng【${row.name}】? Thao tác này sẽ đồng thời xóa tất cả trò chơi thuộc nền tảng này!`,
    'Xác nhận xóa',
    { type: 'warning' }
  ).then(async () => {
    try {
      await request.post({
        url: '/app/admin/api/game/delete-platform',
        data: { id: row.id }
      })
      ElMessage.success('Xóa thành công')

      platforms.value = platforms.value.filter(p => p.id !== row.id)
    } catch (e: any) {
      ElMessage.error(e.message || 'Xóa thất bại')
    }
  })
}

async function handleToggleStatus(row: Platform) {
  const newStatus = row.status === 'online' ? 'offline' : 'online'
  const action = newStatus === 'online' ? 'Bật' : 'Đóng'

  try {
    await request.post({
      url: '/app/admin/api/game/update-platform',
      data: { id: row.id, status: newStatus }
    })
    row.status = newStatus
    ElMessage.success(`${action}Thành công`)
  } catch (e: any) {
    ElMessage.error(e.message || `${action}Thất bại`)
  }
}

function handleIconUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.icon = response.data.url
    ElMessage.success('Tải lên biểu tượng thành công')
  }
}

function handleBannerUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.banner = response.data.url
    ElMessage.success('Tải lên banner PC thành công')
  }
}

function handleMobileIconUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.mobile_icon = response.data.url
    ElMessage.success('Tải lên biểu tượng H5 thành công')
  }
}

function handleMobileBannerUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.mobile_banner = response.data.url
    ElMessage.success('Tải lên banner H5 thành công')
  }
}

function handleSlotBannerUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.slot_banner = response.data.url
    ElMessage.success('Tải lên banner điện tử thành công')
  }
}

function handleLiveBannerUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.live_banner = response.data.url
    ElMessage.success('Tải lên banner trực tiếp thành công')
  }
}

function handleChessBannerUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.chess_banner = response.data.url
    ElMessage.success('Tải lên banner cờ bài thành công')
  }
}

function handleFishingBannerUploadSuccess(response: any) {
  if (response.code === 0 && response.data?.url) {
    editForm.value.fishing_banner = response.data.url
    ElMessage.success('Tải lên banner bắn cá thành công')
  }
}

function handleUploadError() {
  ElMessage.error('Tải lên thất bại')
}
</script>

<template>
  <div class="app-container">
    
    <el-card class="mb-4">
      <el-form :inline="true">
        <el-form-item label="Phân loại trò chơi">
          <el-select v-model="activeCategory" placeholder="Vui lòng chọn phân loại" style="width: 150px" @change="handleCategoryChange">
            <el-option
              v-for="cat in categories"
              :key="cat.code"
              :label="cat.name"
              :value="cat.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Loại nền tảng">
          <el-select v-model="filterPlatformCode" placeholder="Tất cả nền tảng" clearable style="width: 150px">
            <el-option
              v-for="p in filteredPlatforms"
              :key="p.code"
              :label="p.name"
              :value="p.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Tìm kiếm">
          <el-input 
            v-model="searchKeyword" 
            placeholder="Tên/mã nền tảng"
            clearable 
            style="width: 180px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <span class="i-ri:search-line mr-1"></span> Truy vấn
          </el-button>
          <el-button @click="handleReset">
            <span class="i-ri:refresh-line mr-1"></span> Đặt lại
          </el-button>
          <el-button type="warning" :loading="syncLoading" @click="handleSyncNGGames">
            <span class="i-ri:download-cloud-line mr-1"></span> Đồng bộ trò chơi NG
          </el-button>
          <el-button type="success">
            <span class="i-ri:add-line mr-1"></span> Phát hành trò chơi
          </el-button>
          <el-button type="danger" :disabled="selectedPlatforms.length === 0" @click="handleBatchDelete">
            <span class="i-ri:delete-bin-line mr-1"></span> Xóa hàng loạt ({{ selectedPlatforms.length }})
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    
    <el-card>
      <el-table v-loading="loading" :data="displayPlatforms" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="type" label="Loại trò chơi" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="Loại nền tảng" width="120" align="center" />
        <el-table-column prop="name" label="Tên hiển thị" min-width="150" align="center" />
        <el-table-column label="Trạng thái bảo trì" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status === 'maintain'"
              @change="(val) => handleStatusChange(row, val ? 'maintain' : 'online')"
            />
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái nền tảng" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status === 'online'"
              @change="handleToggleStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="Có phải trang chủ" width="100" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.hot === 1" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="Sắp xếp" width="100" align="center">
          <template #default="{ row }">
            <el-input-number v-model="row.sort" :min="0" size="small" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column label="Banner PC" width="120" align="center">
          <template #default="{ row }">
            <el-image v-if="row.banner" :src="row.banner" style="width: 80px; height: 40px" fit="cover" :preview-src-list="[row.banner]" preview-teleported />
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column label="Banner H5/App" width="120" align="center">
          <template #default="{ row }">
            <el-image v-if="row.mobile_banner" :src="row.mobile_banner" style="width: 80px; height: 40px" fit="cover" :preview-src-list="[row.mobile_banner]" preview-teleported />
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="warning" link @click="handleEdit(row)">Chỉnh sửa</el-button>
            <el-button type="primary" link @click="goToGameManage(row)">Quản lý trò chơi</el-button>
            <el-button type="danger" link @click="handleDelete(row)">Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>

      
      <div class="flex justify-between items-center mt-4">
        <span class="text-gray-500">Tổng {{ paginatedTotal }} bản ghi</span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="paginatedTotal"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    
    <el-dialog v-model="editDialogVisible" title="Chỉnh sửa nền tảng" width="600px">
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="Mã nền tảng">
          <el-input v-model="editForm.code" disabled />
        </el-form-item>
        <el-form-item label="Tên hiển thị">
          <el-input v-model="editForm.name" placeholder="Vui lòng nhập tên hiển thị (chung)" />
        </el-form-item>
        <el-divider content-position="left">Tên chuyên dụng theo phân loại (nền tảng tổng hợp có thể đặt tên khác nhau cho các phân loại)</el-divider>
        <el-form-item label="Tên điện tử">
          <el-input v-model="editForm.slot_name" placeholder="Tên hiển thị phân loại điện tử (để trống sẽ dùng tên chung)" />
        </el-form-item>
        <el-form-item label="Tên trực tiếp">
          <el-input v-model="editForm.live_name" placeholder="Tên hiển thị phân loại trực tiếp (để trống sẽ dùng tên chung)" />
        </el-form-item>
        <el-form-item label="Tên cờ bài">
          <el-input v-model="editForm.chess_name" placeholder="Tên hiển thị phân loại cờ bài (để trống sẽ dùng tên chung)" />
        </el-form-item>
        <el-form-item label="Tên bắn cá">
          <el-input v-model="editForm.fishing_name" placeholder="Tên hiển thị phân loại bắn cá (để trống sẽ dùng tên chung)" />
        </el-form-item>
        <el-form-item label="Sắp xếp">
          <el-input-number v-model="editForm.sort" :min="0" />
        </el-form-item>
        <el-form-item label="Đề xuất trang chủ">
          <el-switch v-model="editForm.hot" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-divider content-position="left">Hình ảnh PC</el-divider>
        <el-form-item label="Biểu tượng PC">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.icon" :src="editForm.icon" style="width: 80px; height: 80px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleIconUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">Tải lên</el-button>
            </el-upload>
            <el-input v-model="editForm.icon" placeholder="hoặc nhập URL ảnh" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="Banner PC">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.banner" :src="editForm.banner" style="width: 120px; height: 60px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleBannerUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">Tải lên</el-button>
            </el-upload>
            <el-input v-model="editForm.banner" placeholder="hoặc nhập URL ảnh" style="width: 200px" />
          </div>
        </el-form-item>
        <el-divider content-position="left">Hình ảnh H5/App</el-divider>
        <el-form-item label="Biểu tượng H5">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.mobile_icon" :src="editForm.mobile_icon" style="width: 80px; height: 80px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleMobileIconUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">Tải lên</el-button>
            </el-upload>
            <el-input v-model="editForm.mobile_icon" placeholder="hoặc nhập URL ảnh" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="Banner H5">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.mobile_banner" :src="editForm.mobile_banner" style="width: 120px; height: 60px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleMobileBannerUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">Tải lên</el-button>
            </el-upload>
            <el-input v-model="editForm.mobile_banner" placeholder="hoặc nhập URL ảnh" style="width: 200px" />
          </div>
        </el-form-item>
        <el-divider content-position="left">Banner chuyên dụng theo phân loại (nền tảng tổng hợp có thể đặt banner khác nhau cho các phân loại)</el-divider>
        <el-form-item label="Banner điện tử">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.slot_banner" :src="editForm.slot_banner" style="width: 120px; height: 60px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleSlotBannerUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">Tải lên</el-button>
            </el-upload>
            <el-input v-model="editForm.slot_banner" placeholder="hoặc nhập URL ảnh" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="Banner trực tiếp">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.live_banner" :src="editForm.live_banner" style="width: 120px; height: 60px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleLiveBannerUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">Tải lên</el-button>
            </el-upload>
            <el-input v-model="editForm.live_banner" placeholder="hoặc nhập URL ảnh" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="Banner cờ bài">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.chess_banner" :src="editForm.chess_banner" style="width: 120px; height: 60px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleChessBannerUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">Tải lên</el-button>
            </el-upload>
            <el-input v-model="editForm.chess_banner" placeholder="hoặc nhập URL ảnh" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="Banner bắn cá">
          <div class="flex items-center gap-4">
            <el-image v-if="editForm.fishing_banner" :src="editForm.fishing_banner" style="width: 120px; height: 60px" fit="cover" class="border rounded" />
            <el-upload
              action="/app/admin/upload/image"
              :show-file-list="false"
              :on-success="handleFishingBannerUploadSuccess"
              :on-error="handleUploadError"
              accept="image/*"
            >
              <el-button type="primary" size="small">Tải lên</el-button>
            </el-upload>
            <el-input v-model="editForm.fishing_banner" placeholder="hoặc nhập URL ảnh" style="width: 200px" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="handleSave">Lưu</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-tag {
  margin: 2px;
}
</style>
