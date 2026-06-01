<template>
  <div class="p-4">
    <div class="mb-4 bg-box p-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center">
        <el-form :inline="true" :model="searchForm" class="flex-1">
          <el-form-item label="Tiêu đề">
            <el-input v-model="searchForm.title" placeholder="Tiêu đề hoạt động" clearable style="width: 150px" />
          </el-form-item>
          <el-form-item label="Phân loại hoạt động">
            <el-select v-model="searchForm.category" placeholder="Tất cả" clearable style="width: 120px">
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Loại hoạt động">
            <el-select v-model="searchForm.type" placeholder="Tất cả" clearable style="width: 120px">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Trạng thái">
            <el-select v-model="searchForm.status" placeholder="Tất cả" clearable style="width: 100px">
              <el-option label="Bật" :value="1" />
              <el-option label="Tắt" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <template #icon><ArtSvgIcon icon="ri:search-line" /></template>
            Tìm kiếm
            </el-button>
            <el-button @click="resetSearch">Đặt lại</el-button>
          </el-form-item>
        </el-form>
        
        <el-button type="primary" @click="handleAdd">
          <template #icon><ArtSvgIcon icon="ri:add-line" /></template>
            Thêm hoạt động
        </el-button>
      </div>
    </div>

    <div class="bg-box p-4 rounded-lg shadow-sm">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />
        <el-table-column label="Ảnh bìa" width="120" align="center">
          <template #default="{ row }">
            <el-image 
              v-if="row.banner" 
              :src="row.banner" 
              class="h-12 w-20 object-cover rounded bg-hover-color" 
              :preview-src-list="[row.banner]"
              preview-teleported
            />
            <span v-else class="text-g-400">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Tiêu đề" min-width="150" show-overflow-tooltip />
        <el-table-column label="Phân loại hoạt động" width="120" align="center">
          <template #default="{ row }">
            {{ getCategoryNames(row.category) }}
          </template>
        </el-table-column>
        <el-table-column label="Loại hoạt động" width="120" align="center">
          <template #default="{ row }">
            {{ getTypeName(row.type_code || row.type) }}
          </template>
        </el-table-column>
        <el-table-column label="Thời gian hoạt động" width="200" align="center">
          <template #default="{ row }">
            <div class="text-xs">
              <div>{{ row.start_date }}</div>
              <div class="text-g-400">Đến</div>
              <div>{{ row.end_date }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="(val) => handleStatusChange(row, val as number)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="Sắp xếp" width="80" align="center" />
        
        <el-table-column label="Thao tác" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="primary" 
              plain
              @click="handleEdit(row)"
            >Chỉnh sửa</el-button>
            <el-button 
              size="small" 
              type="danger" 
              plain
              @click="handleDelete(row)"
            >Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    
    <el-drawer
      v-model="dialogVisible"
      :title="dialogType === 'add' ? 'Thêm hoạt động' : 'Chỉnh sửa hoạt động'"
      size="600px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        
        <el-tabs v-model="activeTab" class="drawer-tabs">
          
          <el-tab-pane label="Thông tin cơ bản" name="basic">
            <el-form-item label="Tiêu đề" prop="title">
              <el-input v-model="form.title" placeholder="Vui lòng nhập tiêu đề hoạt động" />
            </el-form-item>
            
            <div class="grid grid-cols-2 gap-3">
              <el-form-item label="Phân loại" prop="category">
                <el-select v-model="form.category" placeholder="Chọn phân loại" class="w-full" multiple collapse-tags collapse-tags-tooltip>
                  <el-option
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Loại" prop="type_code">
                <el-select v-model="form.type_code" placeholder="Chọn loại" class="w-full">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>

            <el-form-item label="Thời gian" required>
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                range-separator="Đến"
                start-placeholder="Thời gian bắt đầu"
                end-placeholder="Thời gian kết thúc"
                value-format="YYYY-MM-DD HH:mm:ss"
                class="!w-full"
              />
            </el-form-item>

            <div class="grid grid-cols-2 gap-3">
              <el-form-item label="Sắp xếp">
                <el-input-number v-model="form.sort" :min="0" controls-position="right" class="w-full" />
              </el-form-item>
              <el-form-item label="Trạng thái">
                <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="Bật" inactive-text="Tắt" />
              </el-form-item>
            </div>

            
            <el-divider content-position="left">Cài đặt nhấp để chuyển hướng</el-divider>
            <el-form-item label="Cách chuyển hướng">
              <el-radio-group v-model="form.jump_type">
                <el-radio :value="0">Trang chi tiết mặc định</el-radio>
                <el-radio :value="1">Cửa sổ điểm danh</el-radio>
                <el-radio :value="2">URL tùy chỉnh</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Địa chỉ chuyển hướng" v-if="form.jump_type === 2">
              <el-input v-model="form.jump_url" placeholder="Vui lòng nhập URL chuyển hướng, ví dụ: https://example.com hoặc /page/path" />
            </el-form-item>
            <el-alert v-if="form.jump_type === 1" type="info" :closable="false" class="!mt-[-10px]">
              Nhấp vào ảnh bìa hoạt động này sẽ mở trực tiếp cửa sổ điểm danh
            </el-alert>
          </el-tab-pane>

          
          <el-tab-pane label="Nội dung hoạt động" name="content">
            <el-form-item label="Ảnh bìa" prop="banner">
              <div class="w-full">
                <div class="flex gap-2">
                  <el-input v-model="form.banner" placeholder="URL hình ảnh" class="flex-1" />
                  <el-button type="primary" @click="triggerUpload">Tải lên</el-button>
                </div>
                <div v-if="form.banner" class="mt-2 h-28 bg-hover-color rounded flex items-center justify-center border border-dashed border-g-300 overflow-hidden">
                  <img :src="form.banner" class="h-full object-contain" />
                </div>
              </div>
            </el-form-item>

            
            <input type="file" ref="fileInputRef" style="display: none" accept="image/*" @change="handleFileChange" />

            <el-form-item label="Giới thiệu">
              <el-input v-model="form.desc" type="textarea" :rows="2" placeholder="Giới thiệu hoạt động (tùy chọn)" />
            </el-form-item>

            <el-form-item label="Mô tả hoạt động" class="editor-item">
              <div style="border: 1px solid #dcdfe6; border-radius: 4px; width: 100%;">
                <Toolbar
                  style="border-bottom: 1px solid #dcdfe6"
                  :editor="editorRef"
                  :defaultConfig="toolbarConfig"
                  mode="simple"
                />
                <Editor
                  style="height: 350px; overflow-y: hidden;"
                  v-model="form.content"
                  :defaultConfig="editorConfig"
                  mode="simple"
                  @onCreated="handleCreated"
                />
              </div>
            </el-form-item>

            <el-form-item label="Điều khoản và chi tiết">
              <el-input 
                v-model="form.terms" 
                type="textarea" 
                :rows="6" 
                placeholder="Vui lòng nhập điều khoản và chi tiết (tùy chọn, hỗ trợ xuống dòng)" 
              />
            </el-form-item>
          </el-tab-pane>

          
          <el-tab-pane label="Cấu hình phần thưởng" name="reward" v-if="needsRewardConfig">
            
            <el-alert class="!mb-4" :closable="false" show-icon>
              <template #title>
                <span v-if="form.type_code === 'checkin'">Hoạt động điểm danh: điểm danh liên tục sẽ nhận thưởng theo số ngày tương ứng, gián đoạn sẽ bắt đầu lại từ ngày đầu tiên</span>
                <span v-else-if="form.type_code === 'lucky_order'">Đơn cược may mắn: khớp số cuối mã đơn sẽ nhận thưởng bằng tiền cược × hệ số (không vượt quá giới hạn trên)</span>
                <span v-else-if="form.type_code === 'pg_betting_king'">PG vua cược: tổng cược tích lũy mỗi ngày đạt chuẩn sẽ nhận thưởng, chỉ nhận được bậc cao nhất</span>
                <span v-else-if="form.type_code === 'loss_rescue'">Cứu trợ thua lỗ: thua lỗ hôm qua đạt ngưỡng sẽ nhận mức cứu trợ tương ứng</span>
                <span v-else-if="form.type_code === 'weekly_salary'">Lương tuần: tổng cược tích lũy theo tuần đạt chuẩn sẽ nhận thưởng, có thể nhận tất cả các bậc</span>
                <span v-else-if="form.type_code === 'monthly_salary'">Lương tháng: tổng cược tích lũy theo tháng đạt chuẩn sẽ nhận thưởng, có thể nhận tất cả các bậc</span>
              </template>
            </el-alert>

            
            <div class="mb-4 p-3 bg-gray-50 rounded" v-if="form.type_code === 'checkin'">
              <div class="text-sm font-medium mb-2">Cài đặt điều kiện điểm danh</div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="Nạp yêu cầu" label-width="70px" class="!mb-0">
                    <el-input-number v-model="form.required_deposit" :min="0" controls-position="right" class="w-full" placeholder="Nạp mỗi ngày đạt mức tiền này" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Cược yêu cầu" label-width="70px" class="!mb-0">
                    <el-input-number v-model="form.required_bet" :min="0" controls-position="right" class="w-full" placeholder="Cược mỗi ngày đạt mức tiền này" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            
            <div class="mb-4 p-3 bg-gray-50 rounded">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-600">Giới hạn nhận</span>
                <el-switch v-model="form.enableLimit" :active-value="1" :inactive-value="0" active-text="Bật" inactive-text="Tắt" />
              </div>
              <el-row :gutter="20" v-if="form.enableLimit">
                <el-col :span="8">
                  <el-form-item label="Chu kỳ giới hạn" label-width="70px" class="!mb-0">
                    <el-select v-model="form.limitPeriod" class="w-full">
                      <el-option label="Hàng ngày" value="daily" />
                      <el-option label="Hàng tuần" value="weekly" />
                      <el-option label="Hàng tháng" value="monthly" />
                      <el-option label="Vĩnh viễn" value="once" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Số lần giới hạn" label-width="70px" class="!mb-0">
                    <el-input-number v-model="form.limitTimes" :min="1" controls-position="right" class="w-full" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Cần đăng ký" label-width="70px" class="!mb-0">
                    <el-switch v-model="form.needApply" :active-value="1" :inactive-value="0" />
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="text-xs text-gray-400 mt-2" v-if="!form.enableLimit">Không giới hạn số lần nhận</div>
            </div>

            
            <div class="flex items-center justify-between mb-3">
              <span class="font-medium">Bậc phần thưởng</span>
              <el-button type="primary" size="small" @click="handleAddTier">
                <el-icon><Plus /></el-icon>
                Thêm bậc
              </el-button>
            </div>

            <el-alert
              title="Vui lòng cấu hình ít nhất một bậc phần thưởng"
              type="warning"
              :closable="false"
              show-icon
              class="!mb-3"
              v-if="form.tiers.length === 0"
            />

            
            <el-table :data="form.tiers" border v-if="form.tiers.length > 0" class="tier-table">
              <el-table-column label="Bậc" width="80" align="center">
                <template #default="{ $index }">
                  <el-tag>{{ $index + 1 }}</el-tag>
                </template>
              </el-table-column>
              
              
              <template v-if="form.type_code === 'lucky_order'">
                <el-table-column label="Số cuối mã đơn" min-width="120">
                  <template #default="{ row }">
                    <el-input v-model="row.conditionValue" placeholder="Ví dụ: 888" />
                  </template>
                </el-table-column>
                <el-table-column label="Hệ số thưởng" min-width="150">
                  <template #default="{ row }">
                    <el-input v-model="row.levelName" placeholder="Ví dụ: tiền cược hợp lệ x1" />
                  </template>
                </el-table-column>
                <el-table-column label="Hệ số thực tế" width="100">
                  <template #default="{ row }">
                    <el-input-number v-model="row.rewardRate" :min="0" :precision="0" controls-position="right" class="w-full" />
                  </template>
                </el-table-column>
                <el-table-column label="Giới hạn trên tiền thưởng" width="120">
                  <template #default="{ row }">
                    <el-input-number v-model="row.rewardAmount" :min="0" :precision="2" controls-position="right" class="w-full" />
                  </template>
                </el-table-column>
              </template>

              
              <template v-else-if="form.type_code === 'loss_rescue'">
                <el-table-column label="Ngưỡng thua lỗ (≥)" min-width="150">
                  <template #default="{ row }">
                    <el-input-number v-model="row.conditionMin" :min="0" :precision="0" controls-position="right" class="w-full" />
                  </template>
                </el-table-column>
                <el-table-column label="Tiền cứu trợ" min-width="120">
                  <template #default="{ row }">
                    <el-input-number v-model="row.rewardAmount" :min="0" :precision="2" controls-position="right" class="w-full" />
                  </template>
                </el-table-column>
              </template>

              
              <template v-else-if="form.type_code === 'checkin'">
                <el-table-column label="Số ngày điểm danh" min-width="100">
                  <template #default="{ row }">
                    <el-input v-model="row.levelName" placeholder="Ví dụ: Ngày 1" />
                  </template>
                </el-table-column>
                <el-table-column label="Số tiền thưởng" min-width="120">
                  <template #default="{ row }">
                    <el-input-number v-model="row.rewardAmount" :min="0" :precision="2" controls-position="right" class="w-full" />
                  </template>
                </el-table-column>
              </template>

              
              <template v-else>
                <el-table-column label="Tổng cược tích lũy (≥)" min-width="150">
                  <template #default="{ row }">
                    <el-input-number v-model="row.conditionMin" :min="0" :precision="0" controls-position="right" class="w-full" />
                  </template>
                </el-table-column>
                <el-table-column label="Số tiền thưởng" min-width="120">
                  <template #default="{ row }">
                    <el-input-number v-model="row.rewardAmount" :min="0" :precision="2" controls-position="right" class="w-full" />
                  </template>
                </el-table-column>
              </template>

              <el-table-column label="Thao tác" width="80" align="center">
                <template #default="{ $index }">
                  <el-button type="danger" size="small" text @click="handleRemoveTier($index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">Lưu</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, shallowRef, onBeforeUnmount, computed, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {
  fetchActivityList,
  createActivity,
  updateActivity,
  deleteActivity,
  updateActivityStatus,
  fetchActivityTypeOptions,
  type Activity,
  type ActivityTypeOption
} from '@/api/activity'
import {
  fetchActivityCategoryOptions
} from '@/api/activity-category'
import {
  fetchRewardList,
  createReward,
  updateReward,
  deleteReward
} from '@/api/activity-reward'

import { useUserStore } from '@/store/modules/user'
import { uploadImage } from '@/api/common'

const userStore = useUserStore()
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = {
  placeholder: 'Vui lòng nhập nội dung...',
  MENU_CONF: {
    uploadImage: {
      server: '/app/admin/upload/image',
      fieldName: 'file',
      headers: {
        Authorization: 'Bearer ' + userStore.accessToken
      },
      customInsert(res: any, insertFn: any) {
        if (res.code === 0 || res.code === 200) {
          const url = res.data?.url || res.url || res.data
          insertFn(url)
        } else {
          ElMessage.error(res.msg || 'Tải lên thất bại')
        }
      }
    }
  }
}

const fileInputRef = ref<HTMLInputElement>()
const triggerUpload = () => {
  fileInputRef.value?.click()
}

const handleFileChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  try {
    const res = await uploadImage(files[0])
    const url = res.url || (res as any).data?.url
    form.banner = url
    ElMessage.success('Tải lên thành công')
  } catch (error) {
    console.error(error)
  } finally {
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor
}

const loading = ref(false)
const tableData = ref<Activity[]>([])
const typeOptions = ref<ActivityTypeOption[]>([])
const categoryOptions = ref<Array<{value: string, label: string}>>([])
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const searchForm = reactive({
  title: '',
  category: '',
  type: '',
  status: undefined as number | undefined
})

const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const activeTab = ref('basic')
const dateRange = ref<[string, string] | null>(null)
const form = reactive({
  id: 0,
  title: '',
  category: [] as string[],
  type: '',
  type_code: '',
  desc: '',
  content: '',
  terms: '',
  banner: '',
  start_date: '',
  end_date: '',
  sort: 0,
  status: 1,

  jump_type: 0,
  jump_url: '',

  required_deposit: 0,
  required_bet: 0,

  tiers: [] as any[],
  conditionType: 'amount',
  needApply: 0,
  enableLimit: 0,
  limitTimes: 1,
  limitPeriod: 'daily'
})

const rewardActivityTypes = ['checkin', 'weekly_salary', 'lucky_order', 'loss_rescue', 'pg_betting_king', 'monthly_salary']
const needsRewardConfig = computed(() => rewardActivityTypes.includes(form.type_code))

watch(() => form.type_code, (newType) => {

  if (newType === 'checkin') {
    form.conditionType = 'checkin'
    form.limitPeriod = 'daily'
    form.limitTimes = 1

    if (form.tiers.length === 0) {
      const defaultAmounts = [1, 3, 5, 8, 12, 18, 28]
      form.tiers = defaultAmounts.map((amount, i) => ({
        levelName: `Ngày ${i + 1}`,
        conditionMin: i + 1,
        rewardAmount: amount,
        sort: i + 1,
        status: 1
      }))
    }
  } else if (newType === 'lucky_order') {
    form.conditionType = 'order_tail'
    form.limitPeriod = 'daily'
    form.limitTimes = 3
  } else if (newType === 'loss_rescue') {
    form.conditionType = 'amount'
    form.limitPeriod = 'daily'
    form.limitTimes = 1
  } else if (newType === 'weekly_salary') {
    form.conditionType = 'amount'
    form.limitPeriod = 'weekly'
    form.limitTimes = 0
  } else if (newType === 'monthly_salary') {
    form.conditionType = 'amount'
    form.limitPeriod = 'monthly'
    form.limitTimes = 0
  } else if (newType === 'pg_betting_king') {
    form.conditionType = 'amount'
    form.limitPeriod = 'daily'
    form.limitTimes = 1
  }

  if (needsRewardConfig.value && form.tiers.length === 0) {
    handleAddTier()
  }
})

watch(dateRange, (val) => {
  if (val && val.length === 2) {
    form.start_date = val[0]
    form.end_date = val[1]
  } else {
    form.start_date = ''
    form.end_date = ''
  }
})

const rules = {
  title: [{ required: true, message: 'Vui lòng nhập tiêu đề', trigger: 'blur' }],
  category: [{ required: true, message: 'Vui lòng chọn phân loại', trigger: 'change' }],
  type_code: [{ required: true, message: 'Vui lòng chọn loại', trigger: 'change' }],
  banner: [{ required: true, message: 'Vui lòng nhập ảnh bìa', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchActivityList({
      page: pagination.page,
      limit: pagination.limit,
      title: searchForm.title,
      category: searchForm.category,
      type: searchForm.type,
      status: searchForm.status
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const res = await fetchActivityCategoryOptions()
    categoryOptions.value = res
  } catch (error) {
    console.error('Tải phân loại hoạt động thất bại:', error)
    categoryOptions.value = []
  }
}

const defaultTypeOptions = [
  { value: 'checkin', label: 'Hoạt động điểm danh' },
  { value: 'weekly_salary', label: 'Hoạt động lương tuần' },
  { value: 'monthly_salary', label: 'Hoạt động lương tháng' },
  { value: 'lucky_order', label: 'Đơn cược may mắn' },
  { value: 'loss_rescue', label: 'Cứu trợ thua lỗ' },
  { value: 'pg_betting_king', label: 'Hoạt động vua cược' },
  { value: 'deposit', label: 'Hoạt động nạp tiền' },
  { value: 'rebate', label: 'Hoạt động hoàn cược' },
  { value: 'bonus', label: 'Hoạt động tiền thưởng' },
  { value: 'vip', label: 'Hoạt động VIP' },
  { value: 'other', label: 'Hoạt động khác' }
]

const loadTypes = async () => {
  try {
    const res = await fetchActivityTypeOptions()
    if (Array.isArray(res) && res.length > 0) {
      typeOptions.value = res
    } else {
      typeOptions.value = defaultTypeOptions
    }
  } catch (error) {
    typeOptions.value = defaultTypeOptions
  }
}

const getCategoryName = (code: string) => {
  const option = categoryOptions.value.find(opt => opt.value === code)
  return option ? option.label : code
}

const getCategoryNames = (category: string | string[]) => {
  let cats: string[] = []
  if (Array.isArray(category)) {
    cats = category
  } else if (typeof category === 'string' && category) {
    try {
      const parsed = JSON.parse(category)
      cats = Array.isArray(parsed) ? parsed : [category]
    } catch {
      cats = [category]
    }
  }
  return cats.map(c => getCategoryName(c)).join(', ') || '-'
}

const getTypeName = (value: string) => {
  const option = typeOptions.value.find(opt => opt.value === value)
  return option ? option.label : value
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const resetSearch = () => {
  searchForm.title = ''
  searchForm.category = ''
  searchForm.type = ''
  searchForm.status = undefined
  handleSearch()
}

const handleSizeChange = (val: number) => {
  pagination.limit = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadData()
}

const handleStatusChange = async (row: Activity, val: number) => {
  try {
    await updateActivityStatus(row.id, val)
    ElMessage.success('Cập nhật trạng thái thành công')
  } catch (error) {
    row.status = val === 1 ? 0 : 1
  }
}

const handleAddTier = () => {
  const index = form.tiers.length + 1
  const tier: any = {
    levelName: '',
    conditionMin: 0,
    conditionMax: 0,
    conditionValue: '',
    rewardAmount: 0,
    rewardRate: 0,
    sort: index,
    status: 1
  }

  if (form.type_code === 'checkin') {

    const defaultAmounts = [1, 3, 5, 8, 12, 18, 28]
    tier.levelName = `Ngày ${index}`
    tier.conditionMin = index
    tier.rewardAmount = defaultAmounts[index - 1] || index * 5
  } else if (form.type_code === 'lucky_order') {

    tier.conditionValue = '888'
    tier.levelName = `tiền cược hợp lệ x${index}`
    tier.rewardRate = index
    tier.rewardAmount = 888 * index
  } else if (form.type_code === 'loss_rescue') {

    const thresholds = [1000, 5000, 10000, 50000, 100000]
    tier.conditionMin = thresholds[index - 1] || thresholds[0] * index
    tier.rewardAmount = tier.conditionMin * 0.01
  } else {

    const thresholds = [5000, 50000, 100000, 500000, 1000000, 3000000, 5000000, 10000000]
    tier.conditionMin = thresholds[index - 1] || 10000 * index
    tier.rewardAmount = 8 * index
  }

  form.tiers.push(tier)
}

const handleRemoveTier = (index: number) => {
  form.tiers.splice(index, 1)

  form.tiers.forEach((tier, idx) => {
    tier.sort = idx + 1
  })
}

const handleAdd = () => {
  dialogType.value = 'add'
  activeTab.value = 'basic'
  form.id = 0
  form.title = ''
  form.category = []
  form.type = ''
  form.type_code = ''
  form.desc = ''
  form.content = ''
  form.terms = ''
  form.banner = ''
  form.start_date = ''
  form.end_date = ''
  form.sort = 0
  form.status = 1
  form.jump_type = 0
  form.jump_url = ''
  form.required_deposit = 0
  form.required_bet = 0
  form.tiers = []
  form.conditionType = 'amount'
  form.needApply = 0
  form.enableLimit = 0
  form.limitTimes = 1
  form.limitPeriod = 'daily'
  dateRange.value = null
  dialogVisible.value = true
}

const handleEdit = async (row: Activity) => {
  dialogType.value = 'edit'
  activeTab.value = 'basic'
  form.id = row.id
  form.title = row.title

  const cat = (row as any).category
  if (Array.isArray(cat)) {
    form.category = cat
  } else if (typeof cat === 'string' && cat) {
    try {
      const parsed = JSON.parse(cat)
      form.category = Array.isArray(parsed) ? parsed : [cat]
    } catch {
      form.category = [cat]
    }
  } else {
    form.category = []
  }
  form.type = row.type
  form.type_code = (row as any).type_code || row.type
  form.desc = row.desc
  form.content = row.content
  form.terms = (row as any).terms || ''
  form.banner = row.banner
  form.start_date = row.start_date
  form.end_date = row.end_date
  form.sort = row.sort
  form.status = row.status
  form.jump_type = (row as any).jump_type || 0
  form.jump_url = (row as any).jump_url || ''
  form.required_deposit = (row as any).required_deposit || 0
  form.required_bet = (row as any).required_bet || 0

  if (row.start_date && row.end_date) {
    dateRange.value = [row.start_date, row.end_date]
  } else {
    dateRange.value = null
  }

  form.tiers = []
  if (rewardActivityTypes.includes(form.type_code)) {
    try {
      const res = await fetchRewardList({ activity_id: row.id })
      if (res.list && res.list.length > 0) {
        const firstReward = res.list[0]
        form.conditionType = firstReward.conditionType || 'amount'
        form.needApply = firstReward.needApply || 0
        form.limitTimes = firstReward.limitTimes || 1
        form.limitPeriod = firstReward.limitPeriod || 'daily'
        form.enableLimit = firstReward.limitTimes > 0 ? 1 : 0

        form.tiers = res.list.map((item: any) => ({
          id: item.id,
          levelName: item.levelName,
          conditionMin: item.conditionMin,
          conditionMax: item.conditionMax,
          conditionValue: item.conditionValue,
          rewardAmount: item.rewardAmount,
          rewardRate: item.rewardRate,
          sort: item.sort,
          status: item.status
        }))
      }
    } catch (error) {
      console.error('Tải cấu hình bậc thất bại:', error)
    }
  }

  dialogVisible.value = true
}

const handleDelete = (row: Activity) => {
  ElMessageBox.confirm(`Bạn có chắc muốn xóa hoạt động "${row.title}" không?`, 'Thông báo', {
    type: 'warning'
  }).then(async () => {
    await deleteActivity(row.id)
    loadData()
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return

  if (needsRewardConfig.value && form.tiers.length === 0) {
    ElMessage.warning('Vui lòng cấu hình ít nhất một bậc phần thưởng')
    return
  }

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        let activityId = form.id

        if (dialogType.value === 'add') {
          const res = await createActivity(form) as any
          activityId = res.id || res.data?.id
          ElMessage.success('Tạo hoạt động thành công')
        } else {
          await updateActivity(form)
          ElMessage.success('Cập nhật hoạt động thành công')
        }

        if (needsRewardConfig.value && activityId) {

          if (dialogType.value === 'edit') {
            try {
              const oldRewards = await fetchRewardList({ activity_id: activityId })
              if (oldRewards.list && oldRewards.list.length > 0) {
                await Promise.all(oldRewards.list.map((r: any) => deleteReward(r.id)))
              }
            } catch (error) {
              console.error('Xóa bậc cũ thất bại:', error)
            }
          }

          const actualLimitTimes = form.enableLimit ? form.limitTimes : 0
          await Promise.all(form.tiers.map(tier => {
            return createReward({
              activity_id: activityId,
              reward_type: form.type_code,
              level_name: tier.levelName || `Bậc ${tier.sort}`,
              condition_min: tier.conditionMin || 0,
              condition_max: tier.conditionMax || 0,
              condition_value: tier.conditionValue || '',
              reward_amount: tier.rewardAmount || 0,
              reward_rate: tier.rewardRate || 0,
              condition_type: form.conditionType,
              need_apply: form.needApply,
              limit_times: actualLimitTimes,
              limit_period: form.limitPeriod,
              sort: tier.sort,
              status: tier.status || 1
            } as any)
          }))

          ElMessage.success(`Đã lưu cấu hình bậc (tổng ${form.tiers.length} bậc)`)
        }

        dialogVisible.value = false
        loadData()
      } catch (error: any) {
        ElMessage.error(error.message || 'Thao tác thất bại')
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  loadCategories()
  loadTypes()
  loadData()
})
</script>
