<template>
  <div class="xoso-number-select">
    <div class="number-grid">
      <div
        v-for="n in 100"
        :key="n - 1"
        class="number-cell"
        :class="{ selected: isSelected(n - 1) }"
        @click="toggleNumber(n - 1)"
      >
        {{ String(n - 1).padStart(2, '0') }}
      </div>
    </div>
    <div v-if="selectedNumbers.length > 0" class="selected-info">
      <span class="info-text">Đã chọn: {{ selectedNumbers.length }} số</span>
      <button class="btn-clear" @click="clearAll">Xóa tất cả</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxSelection: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedNumbers = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isSelected = (number) => {
  const numStr = String(number).padStart(2, '0')
  return selectedNumbers.value.includes(numStr)
}

const toggleNumber = (number) => {
  const numStr = String(number).padStart(2, '0')
  const index = selectedNumbers.value.indexOf(numStr)
  
  if (index > -1) {
    // Remove if already selected
    const newValue = [...selectedNumbers.value]
    newValue.splice(index, 1)
    selectedNumbers.value = newValue
  } else {
    // Add if not selected (check max selection)
    if (props.maxSelection && selectedNumbers.value.length >= props.maxSelection) {
      return
    }
    selectedNumbers.value = [...selectedNumbers.value, numStr]
  }
}

const clearAll = () => {
  selectedNumbers.value = []
}
</script>

<style scoped lang="scss">
.xoso-number-select {
  width: 100%;
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  margin-bottom: 16px;
}

.number-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  background: #f8f8f8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;

  &:active {
    transform: scale(0.9);
  }

  &.selected {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  }
}

.selected-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 8px;
}

.info-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.btn-clear {
  padding: 6px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    background: #f0f0f0;
  }
}
</style>