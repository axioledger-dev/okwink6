<template>
  <div class="xoso-order-panel">
    <div class="panel-header">
      <h4 class="panel-title">Đơn Cược</h4>
      <button v-if="hasOrder" class="btn-clear-small" @click="emit('clear')">
        <van-icon name="delete-o" size="14" />
        Xóa
      </button>
    </div>

    <div v-if="!hasOrder" class="empty-order">
      <van-icon name="shopping-cart-o" size="48" color="#ccc" />
      <p>Chưa có đơn cược</p>
    </div>

    <div v-else class="order-content">
      <!-- Bet Info -->
      <div class="order-info">
        <div class="info-row">
          <span class="label">Loại cược:</span>
          <span class="value">{{ betTypeName }}</span>
        </div>
        <div class="info-row">
          <span class="label">Số đã chọn:</span>
          <span class="value">{{ selectedNumbers.length }} số</span>
        </div>
        <div class="info-row">
          <span class="label">Số tiền/số:</span>
          <span class="value">{{ formatMoney(betAmount) }}</span>
        </div>
      </div>

      <!-- Selected Numbers -->
      <div class="selected-numbers">
        <div class="numbers-label">Các số đã chọn:</div>
        <div class="numbers-list">
          <span
            v-for="number in selectedNumbers"
            :key="number"
            class="number-chip"
          >
            {{ number }}
          </span>
        </div>
      </div>

      <!-- Total -->
      <div class="order-total">
        <div class="total-row">
          <span class="total-label">Tổng cộng:</span>
          <span class="total-amount">{{ formatMoney(totalAmount) }}</span>
        </div>
      </div>

      <!-- Submit Button -->
      <button class="btn-submit" @click="emit('submit')">
        <van-icon name="checked" />
        Xác Nhận Đặt Cược
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon as VanIcon } from 'vant'

const props = defineProps({
  selectedNumbers: {
    type: Array,
    default: () => []
  },
  betAmount: {
    type: Number,
    default: 0
  },
  betType: {
    type: String,
    default: ''
  },
  betTypeName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'clear'])

const hasOrder = computed(() => {
  return props.selectedNumbers.length > 0 && props.betAmount > 0
})

const totalAmount = computed(() => {
  return props.selectedNumbers.length * props.betAmount
})

const formatMoney = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}
</script>

<style scoped lang="scss">
.xoso-order-panel {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.btn-clear-small {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    background: #f0f0f0;
  }
}

.empty-order {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;

  p {
    margin-top: 12px;
    font-size: 14px;
    color: #999;
  }
}

.order-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-info {
  background: white;
  border-radius: 8px;
  padding: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: 13px;
    color: #666;
  }

  .value {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
}

.selected-numbers {
  background: white;
  border-radius: 8px;
  padding: 12px;
}

.numbers-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.numbers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.number-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  padding: 4px 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
}

.order-total {
  background: white;
  border-radius: 8px;
  padding: 12px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.total-amount {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  }
}
</style>