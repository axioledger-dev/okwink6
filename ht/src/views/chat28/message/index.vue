<template>
  <div class="chat28-message-page art-full-height">
    <ElCard class="art-table-card" shadow="never">
      
      <div class="search-form-container" id="art-table-header">
        <ElForm :model="searchParams" inline class="search-form">
          <ElFormItem label="Loại xổ số">
            <ElSelect v-model="searchParams.lottery_code" placeholder="Tất cả" style="width: 150px" clearable>
              <ElOption
                v-for="item in lotteryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="Tên người dùng">
            <ElInput v-model="searchParams.username" placeholder="Vui lòng nhập" style="width: 150px" clearable />
          </ElFormItem>
          <ElFormItem label="Loại tin nhắn">
            <ElSelect v-model="searchParams.message_type" placeholder="Tất cả" style="width: 120px" clearable>
              <ElOption label="Cược" value="bet" />
              <ElOption label="Văn bản" value="text" />
              <ElOption label="Hệ thống" value="system" />
              <ElOption label="Mở thưởng" value="result" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="Ngày">
            <ElDatePicker
              v-model="dateRange"
              type="daterange"
              range-separator="đến"
              start-placeholder="Ngày bắt đầu"
              end-placeholder="Ngày kết thúc"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 240px"
              @change="handleDateChange"
            />
          </ElFormItem>
          
          <ElFormItem>
            <ElButton type="primary" @click="refreshData">
              <template #icon><ArtSvgIcon icon="ri:search-line" /></template>
              Tìm kiếm
            </ElButton>
            <ElButton @click="resetSearch">
              <template #icon><ArtSvgIcon icon="ri:refresh-line" /></template>
              Đặt lại
            </ElButton>
          </ElFormItem>

          <div style="float: right">
            <ElButton type="success" @click="openSendDialog">
              <template #icon><ArtSvgIcon icon="ri:send-plane-line" /></template>
              Gửi tin nhắn hệ thống
            </ElButton>
          </div>
        </ElForm>
      </div>

      
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      />
    </ElCard>

    
    <ElDialog
      v-model="sendDialogVisible"
      title="Gửi tin nhắn hệ thống"
      width="500px"
      destroy-on-close
    >
      <ElForm ref="sendFormRef" :model="sendFormData" :rules="sendRules" label-width="80px">
        <ElFormItem label="Loại xổ số" prop="lottery_code">
          <ElSelect v-model="sendFormData.lottery_code" placeholder="Vui lòng chọn" style="width: 100%">
            <ElOption
              v-for="item in lotteryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="Nội dung" prop="content">
          <ElInput
            v-model="sendFormData.content"
            type="textarea"
            :rows="4"
            placeholder="Vui lòng nhập nội dung tin nhắn"
            maxlength="500"
            show-word-limit
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="sendDialogVisible = false">Hủy</ElButton>
        <ElButton type="primary" @click="handleSend" :loading="sending">Gửi</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import { useTable } from '@/hooks/core/useTable'
import { ElButton, ElMessageBox, ElTag, FormInstance } from 'element-plus'
import {
  fetchMessageList,
  deleteMessage,
  sendSystemMessage,
  fetchLotteryOptions,
  ChatMessage,
  LotteryOption
} from '@/api/chat28'

defineOptions({ name: 'Chat28Message' })

const lotteryOptions = ref<LotteryOption[]>([])

const dateRange = ref<[string, string] | null>(null)

const searchParams = reactive({
  page: 1,
  limit: 20,
  lottery_code: '',
  username: '',
  message_type: '',
  sDate: '',
  eDate: ''
})

const handleDateChange = (val: [string, string] | null) => {
  if (val) {
    searchParams.sDate = val[0]
    searchParams.eDate = val[1]
  } else {
    searchParams.sDate = ''
    searchParams.eDate = ''
  }
}

const getMessageTypeColor = (type: string): 'success' | 'warning' | 'danger' | 'info' | 'primary' => {
  const colors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
    bet: 'success',
    text: 'info',
    system: 'warning',
    result: 'danger'
  }
  return colors[type] || 'info'
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
    apiFn: fetchMessageList,
    apiParams: searchParams,
    paginationKey: {
      current: 'page',
      size: 'limit'
    },
    columnsFactory: () => [
      { prop: 'id', label: 'ID', width: 80, sortable: true, align: 'center' },
      { prop: 'lottery_code', label: 'Loại xổ số', width: 100, align: 'center' },
      { prop: 'issue', label: 'Kỳ số', width: 140, align: 'center' },
      {
        prop: 'user_name',
        label: 'Người dùng',
        width: 120,
        align: 'center',
        formatter: (row: ChatMessage) => {
          if (row.is_system) {
            return h(ElTag, { type: 'warning', size: 'small' }, () => 'Hệ thống')
          }
          return row.user_name
        }
      },
      {
        prop: 'message_type',
        label: 'Loại',
        width: 100,
        align: 'center',
        formatter: (row: ChatMessage) =>
          h(
            ElTag,
            { type: getMessageTypeColor(row.message_type), size: 'small' },
            () => row.message_type_text
          )
      },
      {
        prop: 'content',
        label: 'Nội dung',
        minWidth: 200,
        showOverflowTooltip: true
      },
      { prop: 'created_at', label: 'Thời gian', width: 180, align: 'center' },
      {
        prop: 'action',
        label: 'Thao tác',
        width: 100,
        fixed: 'right',
        align: 'center',
        formatter: (row: ChatMessage) =>
          h(
            ElButton,
            {
              type: 'danger',
              size: 'small',
              onClick: () => handleDelete(row)
            },
            () => 'Xóa'
          )
      }
    ]
  }
})

const loadLotteryOptions = async () => {
  try {
    const res = await fetchLotteryOptions()
    if (res) {
      lotteryOptions.value = res
    }
  } catch (e) {
    console.error(e)
  }
}

const resetSearch = () => {
  searchParams.lottery_code = ''
  searchParams.username = ''
  searchParams.message_type = ''
  searchParams.sDate = ''
  searchParams.eDate = ''
  dateRange.value = null
  refreshData()
}

const handleDelete = (row: ChatMessage) => {
  ElMessageBox.confirm('Xác nhận xóa tin nhắn này không? Sau khi xóa sẽ đồng bộ thu hồi tin nhắn trong phòng chat', 'Thông báo', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteMessage(row.id)
      refreshData()
    } catch (e) {
      console.error(e)
    }
  })
}

const sendDialogVisible = ref(false)
const sending = ref(false)
const sendFormRef = ref<FormInstance>()

const sendFormData = reactive({
  lottery_code: '',
  content: ''
})

const sendRules = {
  lottery_code: [{ required: true, message: 'Vui lòng chọn loại xổ số', trigger: 'change' }],
  content: [{ required: true, message: 'Vui lòng nhập nội dung tin nhắn', trigger: 'blur' }]
}

const openSendDialog = () => {
  sendFormData.lottery_code = lotteryOptions.value[0]?.value || ''
  sendFormData.content = ''
  sendDialogVisible.value = true
}

const handleSend = async () => {
  if (!sendFormRef.value) return

  await sendFormRef.value.validate(async (valid) => {
    if (!valid) return

    sending.value = true
    try {
      await sendSystemMessage(sendFormData)
      sendDialogVisible.value = false
      refreshData()
    } catch (e) {
      console.error(e)
    } finally {
      sending.value = false
    }
  })
}

onMounted(() => {
  loadLotteryOptions()
})
</script>

<style scoped>
.search-form-container {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 16px;
}
</style>


