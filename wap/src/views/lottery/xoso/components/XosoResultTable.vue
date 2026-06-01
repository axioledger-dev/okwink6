<template>
  <div class="xoso-result-table" :class="{ compact }">
    <div v-if="!results || Object.keys(results).length === 0" class="no-results">
      <span>Chưa có kết quả</span>
    </div>
    <div v-else class="result-table">
      <div v-for="(numbers, prize) in results" :key="prize" class="prize-row">
        <div class="prize-label">
          {{ getPrizeLabel(prize) }}
        </div>
        <div class="prize-numbers">
          <span
            v-for="(number, index) in numbers"
            :key="`${prize}-${index}`"
            class="number-ball"
            :class="getPrizeClass(prize)"
          >
            {{ number }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PRIZE_LEVEL_NAMES } from '@/constants/xoso'

defineProps({
  results: {
    type: Object,
    default: () => ({})
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const getPrizeLabel = (prize) => {
  return PRIZE_LEVEL_NAMES[prize] || prize.toUpperCase()
}

const getPrizeClass = (prize) => {
  if (prize === 'gdb') return 'special'
  if (prize === 'g1') return 'first'
  if (prize === 'g2' || prize === 'g3') return 'second'
  return 'normal'
}
</script>

<style scoped lang="scss">
.xoso-result-table {
  width: 100%;

  &.compact {
    .prize-row {
      padding: 6px 0;
    }

    .prize-label {
      font-size: 11px;
      min-width: 60px;
    }

    .number-ball {
      font-size: 11px;
      padding: 4px 8px;
      min-width: 45px;
    }
  }
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

.result-table {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prize-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.prize-label {
  min-width: 80px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  flex-shrink: 0;
}

.prize-numbers {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.number-ball {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  background: #f8f8f8;
  color: #333;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;

  &.special {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    color: white;
    font-size: 15px;
    font-weight: 700;
    box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
  }

  &.first {
    background: linear-gradient(135deg, #ffd93d 0%, #ffb800 100%);
    color: #333;
    font-weight: 700;
    box-shadow: 0 2px 4px rgba(255, 217, 61, 0.3);
  }

  &.second {
    background: linear-gradient(135deg, #6bcf7f 0%, #4caf50 100%);
    color: white;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(107, 207, 127, 0.3);
  }

  &.normal {
    background: #f0f0f0;
    color: #666;
  }
}
</style>