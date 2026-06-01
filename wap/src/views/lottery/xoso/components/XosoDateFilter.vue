<template>
  <div class="xoso-date-filter">
    <div class="filter-header">
      <h3>Chọn Ngày</h3>
      <van-icon name="cross" @click="emit('close')" />
    </div>
    <div class="filter-content">
      <van-calendar
        v-model:show="showCalendar"
        :default-date="selectedDate"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateSelect"
      />
      <van-date-picker
        v-model="currentDate"
        title="Chọn ngày"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </div>
    <div class="filter-footer">
      <button class="btn-cancel" @click="emit('close')">Hủy</button>
      <button class="btn-confirm" @click="confirmDate">Xác nhận</button>
    </div>
  </div>
</template>
<script setup>

import { ref, computed } from 'vue'
import { Calendar as VanCalendar, DatePicker as VanDatePicker, Icon as VanIcon } from 'vant'

const props = defineProps({
  selectedDate: {
    type: Date,
    default: () => new Date()
  }
})

const emit = defineEmits(['update:selectedDate', 'confirm', 'close'])

const showCalendar = ref(true)
const currentDate = ref(props.selectedDate)

// Min date: 1 year ago
const minDate = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 1)
  return date
})

// Max date: today
const maxDate = computed(() => new Date())

const onDateSelect = (date) => {
  currentDate.value = date
}

const confirmDate = () => {
  emit('update:selectedDate', currentDate.value)
  emit('confirm', currentDate.value)
}
</script>

<style scoped lang="scss">
.xoso-date-filter {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
}

.filter-content {
  flex: 1;
  overflow-y: auto;
}

.filter-footer {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;

  &:active {
    background: #e0e0e0;
  }
}

.btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:active {
    opacity: 0.8;
  }
}
</style>