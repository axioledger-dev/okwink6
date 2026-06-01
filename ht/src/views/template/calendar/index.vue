<template>
  <div class="page-content mb-5">
    
    <ElCalendar v-model="currentDate">
      <template #date-cell="{ data }">
        <div
          class="relative flex flex-col h-full min-h-30 max-h-30 p-1 overflow-hidden c-p"
          :class="{ 'is-selected': data.isSelected }"
          @click="handleCellClick(data.day)"
        >
          
          <p class="absolute top-1 right-1 text-sm">{{ formatDate(data.day) }}</p>

          
          <div class="flex flex-col gap-1 w-full max-h-21 pr-1 mt-6 overflow-y-auto">
            <div
              v-for="event in getEvents(data.day)"
              :key="`${event.date}-${event.content}`"
              @click.stop="handleEventClick(event)"
            >
              <div
                class="min-w-25 px-3 py-1.5 overflow-hidden text-xs/6 font-medium text-ellipsis whitespace-nowrap rounded hover:opacity-80"
                :class="[event.bgClass, event.textClass]"
              >
                {{ event.content }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </ElCalendar>

    
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="600px" @closed="resetForm">
      <ElForm :model="eventForm" label-width="80px">
        <ElFormItem label="活动标题" required>
          <ElInput v-model="eventForm.content" placeholder="Vui lòng nhập活动标题" />
        </ElFormItem>
        <ElFormItem label="sựviệc颜色">
          <ElRadioGroup v-model="eventForm.type">
            <ElRadio v-for="type in eventTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="开始日kỳ" required>
          <ElDatePicker
            style="width: 100%"
            v-model="eventForm.date"
            type="date"
            placeholder="选择日kỳ"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </ElFormItem>
        <ElFormItem label="结束日kỳ">
          <ElDatePicker
            style="width: 100%"
            v-model="eventForm.endDate"
            type="date"
            placeholder="选择结束日kỳ"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :min-date="eventForm.date"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <span class="dialog-footer">
          <ElButton v-if="isEditing" type="danger" @click="handleDeleteEvent"> Xóa </ElButton>
          <ElButton type="primary" @click="handleSaveEvent">
            {{ isEditing ? 'hơn新' : 'Thêm' }}
          </ElButton>
        </span>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'TemplateCalendar' })

  interface CalendarEvent {
    date: string
    endDate?: string
    content: string
    type?: 'primary' | 'success' | 'warning' | 'danger'
    bgClass?: string
    textClass?: string
  }

  const eventTypes = [
    { label: 'cơ本', value: 'primary' },
    { label: '成công', value: 'success' },
    { label: '警告', value: 'warning' },
    { label: '危险', value: 'danger' }
  ] as const

  const currentDate = ref(new Date('2025-02-07'))
  const dialogVisible = ref(false)
  const dialogTitle = ref('Thêmsựviệc')
  const editingEventIndex = ref<number>(-1)

  const events = ref<CalendarEvent[]>([
    { date: '2025-02-01', content: 'sảnphẩmcần求评审', type: 'primary' },
    {
      date: '2025-02-03',
      endDate: '2025-02-05',
      content: 'dự án周报sẽ议（跨日kỳ）',
      type: 'primary'
    },
    { date: '2025-02-10', content: '瑜伽课程', type: 'success' },
    { date: '2025-02-15', content: '团đội建设活动', type: 'primary' },
    { date: '2025-02-20', content: '健身训练', type: 'success' },
    { date: '2025-02-20', content: '代码评审', type: 'danger' },
    { date: '2025-02-20', content: '团đội午餐', type: 'primary' },
    { date: '2025-02-20', content: 'dự án进độ汇报', type: 'warning' },
    { date: '2025-02-28', content: '月độ总结sẽ', type: 'warning' }
  ])

  const eventForm = ref<CalendarEvent>({
    date: '',
    endDate: '',
    content: '',
    type: 'primary'
  })

  const isEditing = computed(() => editingEventIndex.value >= 0)

  const formatDate = (date: string) => date.split('-')[2]

  const getEventClasses = (type: CalendarEvent['type'] = 'primary') => {
    const classMap = {
      primary: { bgClass: 'bg-theme/12', textClass: 'text-theme' },
      success: { bgClass: 'bg-success/12', textClass: 'text-success' },
      warning: { bgClass: 'bg-warning/12', textClass: 'text-warning' },
      danger: { bgClass: 'bg-danger/12', textClass: 'text-danger' }
    }
    return classMap[type]
  }

  const getEvents = (day: string) => {
    return events.value
      .filter((event) => {
        const eventDate = new Date(event.date)
        const currentDate = new Date(day)
        const endDate = event.endDate ? new Date(event.endDate) : new Date(event.date)

        return currentDate >= eventDate && currentDate <= endDate
      })
      .map((event) => {
        const { bgClass, textClass } = getEventClasses(event.type)
        return { ...event, bgClass, textClass }
      })
  }

  const resetForm = () => {
    eventForm.value = {
      date: '',
      endDate: '',
      content: '',
      type: 'primary'
    }
    editingEventIndex.value = -1
  }

  const handleCellClick = (day: string) => {
    dialogTitle.value = 'Thêmsựviệc'
    eventForm.value = {
      date: day,
      content: '',
      type: 'primary'
    }
    editingEventIndex.value = -1
    dialogVisible.value = true
  }

  const handleEventClick = (event: CalendarEvent) => {
    dialogTitle.value = 'Chỉnh sửasựviệc'
    eventForm.value = { ...event }
    editingEventIndex.value = events.value.findIndex(
      (e) => e.date === event.date && e.content === event.content
    )
    dialogVisible.value = true
  }

  const handleSaveEvent = () => {
    if (!eventForm.value.content || !eventForm.value.date) return

    if (isEditing.value) {
      events.value[editingEventIndex.value] = { ...eventForm.value }
    } else {
      events.value.push({ ...eventForm.value })
    }

    dialogVisible.value = false
    resetForm()
  }

  const handleDeleteEvent = () => {
    if (isEditing.value) {
      events.value.splice(editingEventIndex.value, 1)
      dialogVisible.value = false
      resetForm()
    }
  }
</script>

<style scoped>
  :deep(.el-calendar) {
    height: 100%;
  }

  :deep(.el-calendar__body) {
    height: calc(100% - 70px);
  }

  :deep(.el-calendar-table) {
    height: 100%;
  }

  :deep(.is-selected) {
    background-color: var(--el-color-warning-light-9) !important;
  }

  :deep(.el-calendar-day) {
    height: 100%;
  }

  :deep(.el-calendar-day:hover) {
    background-color: transparent !important;
  }

  :deep(.el-dialog__body) {
    padding-top: 20px;
  }
</style>
