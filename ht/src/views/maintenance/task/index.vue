<template>
  <div class="task-manage-page art-full-height p-4 bg-g-50/50">
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
      
      <div class="xl:col-span-2 flex flex-col gap-6">
        
        <div class="flex items-center justify-between px-1">
          <div>
            <h2 class="text-xl font-bold text-g-800 flex items-center">
              <span class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center mr-3 shadow-md shadow-primary/20">
                <i class="ri-time-line text-lg"></i>
              </span>
              Tác vụ thực thi định kỳ
            </h2>
            <p class="text-g-400 text-sm mt-1 pl-11">Xử lý logic nghiệp vụ tự động thực thi hàng ngày hoặc hàng tháng</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="task in timeTasks" 
            :key="task.name"
            class="group relative bg-box border-full-d rounded-xl p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30"
          >
            
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <i class="ri-gift-2-line text-lg"></i>
                </div>
                <h3 class="font-bold text-g-700">{{ task.name }}</h3>
              </div>
              <ElTag size="small" type="success" effect="light" round class="border-0 bg-success/10 text-success">
                <ArtSvgIcon icon="ri:checkbox-circle-line" class="mr-1" />Đang chạy
              </ElTag>
            </div>

            
            <div class="mb-5 h-10">
              <p class="text-xs text-g-400 line-clamp-2 leading-relaxed" :title="task.remark">
                {{ task.remark }}
              </p>
            </div>

            
            <div class="bg-g-50/80 rounded-lg p-3 flex items-center justify-between group-hover:bg-primary/5 transition-colors">
              <div class="flex items-center gap-3">
                <span class="text-xs font-medium text-g-500">Thời gian kích hoạt</span>
                <div class="flex items-center gap-1.5">
                  <ElSelect v-model="task.time_value_hour" size="small" class="w-18 !text-center">
                    <template #prefix><span class="text-[10px] text-g-400 scale-90">H</span></template>
                    <ElOption v-for="h in 24" :key="h-1" :label="(h-1).toString().padStart(2, '0')" :value="h-1" />
                  </ElSelect>
                  <span class="text-g-300 font-bold">:</span>
                  <ElSelect v-model="task.time_value_minute" size="small" class="w-18">
                    <template #prefix><span class="text-[10px] text-g-400 scale-90">M</span></template>
                    <ElOption v-for="m in 60" :key="m-1" :label="(m-1).toString().padStart(2, '0')" :value="m-1" />
                  </ElSelect>
                </div>
              </div>
              <ElButton type="primary" size="small" plain :loading="task.loading" @click="handleSave(task)">
                Lưu
              </ElButton>
            </div>
          </div>
        </div>
      </div>

      
      <div class="xl:col-span-1 flex flex-col h-full">
        <div class="bg-box rounded-xl border-full-d shadow-sm flex flex-col h-full overflow-hidden max-h-[calc(100vh-120px)]">
          <div class="p-5 border-b border-full-d flex items-center justify-between bg-box sticky top-0 z-10">
            <div class="flex items-center">
              <span class="w-8 h-8 rounded-lg bg-warning text-white flex items-center justify-center mr-3 shadow-md shadow-warning/20">
                <i class="ri-delete-bin-2-line text-lg"></i>
              </span>
              <div>
                <h2 class="font-bold text-g-800 text-base">Chính sách lưu trữ dữ liệu</h2>
                <p class="text-xs text-g-400 mt-0.5">Tự động dọn dẹp dữ liệu hết hạn</p>
              </div>
            </div>
            <ElTooltip content="Thay đổi chiến lược sẽ có hiệu lực khi tác vụ dọn dẹp tiếp theo được thực thi" placement="top">
              <i class="ri-question-line text-g-300 hover:text-g-500 cursor-help"></i>
            </ElTooltip>
          </div>

          <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <div 
              v-for="task in daysTasks" 
              :key="task.name"
              class="group bg-box border-full-d rounded-lg p-3 hover:border-warning/50 transition-all duration-200 hover:bg-warning/5"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <div class="w-1.5 h-1.5 rounded-full bg-warning mr-2"></div>
                  <span class="text-sm font-medium text-g-700">{{ task.name }}</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between pl-3.5">
                <span class="text-xs text-g-400 truncate max-w-[100px]" :title="task.remark">{{ task.remark }}</span>
                <div class="flex items-center gap-2">
                  <div class="flex items-center bg-g-50 rounded px-2 py-1">
                    <span class="text-xs text-g-500 mr-2">Dọn dẹp</span>
                    <ElSelect v-model="task.days_value" size="small" class="w-20 !h-6">
                      <ElOption v-for="d in 90" :key="d" :label="d + ' ngày trước'" :value="d" />
                    </ElSelect>
                  </div>
                  <ElButton type="primary" link size="small" :loading="task.loading" @click="handleSave(task)">
                    Lưu
                  </ElButton>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-3 border-t border-full-d bg-g-50 text-center">
            <span class="text-xs text-g-400">Tổng {{ daysTasks.length }} chiến lược dọn dẹp</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  ElCard,
  ElSelect,
  ElOption,
  ElMessage,
  ElTag,
  ElTooltip,
  ElButton
} from 'element-plus'
import { fetchTaskList, updateTask, Task } from '@/api/maintenance-task'

defineOptions({ name: 'TaskManage' })

interface TaskUI extends Task {
  loading?: boolean
}

const taskList = ref<TaskUI[]>([])

const timeTasks = computed(() => taskList.value.filter(t => !t.type || t.type === 'time'))
const daysTasks = computed(() => taskList.value.filter(t => t.type === 'days'))

const loadData = async () => {
  try {
    const res = await fetchTaskList()
    if (res && res.list) {
      taskList.value = res.list
    } else {

      taskList.value = [
        { name: 'Hoạt động tặng thưởng tiêu dùng hàng ngày', time_key: 'jihua_rixiaofei', time_value_hour: 0, time_value_minute: 30, remark: 'Tặng ngày hôm trước(Cài đặt hệ thống->Hoạt động tặng thưởng)', type: 'time' },
        { name: 'Hoạt động tặng thưởng lỗ hàng ngày', time_key: 'jihua_rikuisun', time_value_hour: 0, time_value_minute: 30, remark: 'Tặng ngày hôm trước(Cài đặt hệ thống->Hoạt động tặng thưởng)', type: 'time' },
        { name: 'Phát hoàn điểm đặt cược thành viên đại lý', time_key: 'jihua_dailifandian', time_value_hour: 0, time_value_minute: 30, remark: 'Phát ngày hôm trước(Cài đặt hệ thống->Hoạt động tặng thưởng)', type: 'time' },
        { name: 'Hoạt động tặng thưởng tiêu dùng hàng tháng', time_key: 'jihua_yuexiaofei', time_value_hour: 0, time_value_minute: 30, remark: 'Tặng tháng trước(Cài đặt hệ thống->Hoạt động tặng thưởng)', type: 'time' },
        { name: 'Hoạt động tặng thưởng lỗ hàng tháng', time_key: 'jihua_yuekuisun', time_value_hour: 0, time_value_minute: 30, remark: 'Tặng tháng trước(Cài đặt hệ thống->Hoạt động tặng thưởng)', type: 'time' },
        { name: 'Dọn dẹp dữ liệu mở thưởng', time_key: 'jihua_kaijiang', days_value: 11, remark: 'Dọn dẹp dữ liệu mở thưởng N ngày trước', type: 'days' },
        { name: 'Dọn dẹp dữ liệu đặt cược', time_key: 'jihua_touzhu', days_value: 45, remark: 'Dọn dẹp ghi chép đặt cược N ngày trước', type: 'days' },
        { name: 'Dọn dẹp dữ liệu biến động tài khoản', time_key: 'jihua_fuddetail', days_value: 47, remark: 'Dọn dẹp ghi chép biến động tài khoản N ngày trước', type: 'days' },
        { name: 'Dọn dẹp nhật ký thành viên', time_key: 'jihua_memlog', days_value: 7, remark: 'Dọn dẹp nhật ký thành viên N ngày trước', type: 'days' },
        { name: 'Dọn dẹp nhật ký quản trị viên', time_key: 'jihua_adminlog', days_value: 7, remark: 'Dọn dẹp nhật ký quản trị viên N ngày trước', type: 'days' },
        { name: 'Dọn dẹp dữ liệu hoàn điểm', time_key: 'jihua_fandian', days_value: 7, remark: 'Dọn dẹp dữ liệu hoàn điểm N ngày trước', type: 'days' },
        { name: 'Dọn dẹp thưởng thăng cấp', time_key: 'jihua_jinji', days_value: 7, remark: 'Dọn dẹp thưởng thăng cấp N ngày trước', type: 'days' },
        { name: 'Dọn dẹp dữ liệu hoàn trả', time_key: 'jihua_fanshui', days_value: 7, remark: 'Dọn dẹp dữ liệu hoàn trả N ngày trước', type: 'days' }
      ]
    }
  } catch (e) {
    console.error(e)
  }
}

const handleSave = async (row: TaskUI) => {
  try {
    row.loading = true
    const params: any = { name: row.time_key }
    if (row.type === 'days') {
      params.days = row.days_value
    } else {
      params.hour = row.time_value_hour
      params.minute = row.time_value_minute
    }
    await updateTask(params)
    ElMessage.success('Cài đặt thành công')
  } catch (e) {

  } finally {
    row.loading = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.w-18 { width: 4.5rem; }
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--art-gray-300);
  border-radius: 20px;
}
</style>
