<template>
  <div class="xoso-bet-form">
    <!-- Bet Type Selection -->
    <div class="bet-type-section">
      <h4 class="section-title">Chọn Loại Cược</h4>
      <div class="bet-type-grid">
        <div
          v-for="type in betTypes"
          :key="type.value"
          class="bet-type-item"
          :class="{ active: selectedBetType === type.value }"
          @click="selectBetType(type.value)"
        >
          <span class="type-name">{{ type.title }}</span>
          <span v-if="type.tiLe" class="type-rate">{{ type.tiLe }}x</span>
        </div>
      </div>
    </div>

    <!-- Number Selection -->
    <div class="number-section">
      <h4 class="section-title">Chọn Số</h4>
      <XosoNumberSelect
        v-model="selectedNumbers"
        :maxSelection="maxSelection"
      />
    </div>

    <!-- Bet Amount -->
    <div class="amount-section">
      <h4 class="section-title">Số Tiền Cược</h4>
      <div class="amount-input-group">
        <van-field
          v-model="betAmount"
          type="number"
          placeholder="Nhập số tiền"
          :min="minBet"
        >
          <template #button>
            <span class="currency">VND</span>
          </template>
        </van-field>
      </div>
      <div class="quick-amounts">
        <button
          v-for="amount in quickAmounts"
          :key="amount.value"
          class="quick-btn"
          @click="addAmount(amount.value)"
        >
          {{ amount.label }}
        </button>
      </div>
    </div>

    <!-- Order Panel -->
    <XosoOrderPanel
      :selectedNumbers="selectedNumbers"
      :betAmount="Number(betAmount)"
      :betType="selectedBetType"
      :betTypeName="selectedBetTypeName"
      @submit="submitBet"
      @clear="clearForm"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Field as VanField, showToast } from 'vant'
import XosoNumberSelect from './XosoNumberSelect.vue'
import XosoOrderPanel from './XosoOrderPanel.vue'
import { xosoConfig } from '@/config/xoso'
import { QUICK_BET_AMOUNTS, MAX_SELECTIONS, getBetTypeName } from '@/constants/xoso'

const props = defineProps({
  category: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  minBet: {
    type: Number,
    default: 1000
  }
})

const emit = defineEmits(['submit'])

// State
const selectedBetType = ref('')
const selectedNumbers = ref([])
const betAmount = ref('')

// Computed
const betTypes = computed(() => {
  const category = xosoConfig.betTypeCategories.find(c => c.key === props.category)
  return category?.types || []
})

const selectedBetTypeName = computed(() => {
  return getBetTypeName(selectedBetType.value)
})

const maxSelection = computed(() => {
  return MAX_SELECTIONS[selectedBetType.value] || null
})

const quickAmounts = computed(() => QUICK_BET_AMOUNTS.slice(0, 6))

// Methods
const selectBetType = (type) => {
  selectedBetType.value = type
  selectedNumbers.value = []
}

const addAmount = (amount) => {
  const current = Number(betAmount.value) || 0
  betAmount.value = String(current + amount)
}

const validateBet = () => {
  if (!selectedBetType.value) {
    showToast('Vui lòng chọn loại cược')
    return false
  }

  if (selectedNumbers.value.length === 0) {
    showToast('Vui lòng chọn số')
    return false
  }

  const amount = Number(betAmount.value)
  if (!amount || amount < props.minBet) {
    showToast(`Số tiền tối thiểu ${props.minBet.toLocaleString()} VND`)
    return false
  }

  return true
}

const submitBet = () => {
  if (!validateBet()) return

  // TODO_BACKEND_INTEGRATION: Submit to backend
  const betData = {
    type: selectedBetType.value,
    numbers: selectedNumbers.value,
    amount: Number(betAmount.value),
    province: props.province
  }

  emit('submit', betData)
}

const clearForm = () => {
  selectedNumbers.value = []
  betAmount.value = ''
}

// Watch bet type change
watch(selectedBetType, () => {
  selectedNumbers.value = []
})

// Auto-select first bet type
watch(betTypes, (types) => {
  if (types.length > 0 && !selectedBetType.value) {
    selectedBetType.value = types[0].value
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.xoso-bet-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.bet-type-section {
  .bet-type-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
  }

  .bet-type-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 8px;
    background: #f8f8f8;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.95);
    }

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);

      .type-name,
      .type-rate {
        color: white;
      }
    }

    .type-name {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }

    .type-rate {
      font-size: 11px;
      color: #666;
    }
  }
}

.number-section {
  // Styles handled by XosoNumberSelect
}

.amount-section {
  .amount-input-group {
    margin-bottom: 12px;

    .currency {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
  }

  .quick-amounts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .quick-btn {
    padding: 10px;
    background: #f8f8f8;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #667eea;
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
      background: #e8e8e8;
    }
  }
}
</style>