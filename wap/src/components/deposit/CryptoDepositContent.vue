<template>
  <div class="crypto-deposit">
    <div class="crypto-header">
      <div>
        <h3>Nạp tiền kỹ thuật số</h3>
        <p>Hỗ trợ USDT qua TRC20/ERC20</p>
      </div>
      <span class="badge">USDT</span>
    </div>

    <div class="section">
      <label>Chọn loại tiền</label>
      <div class="coin-list">
        <button
          v-for="coin in coins"
          :key="coin.value"
          :class="['coin-btn', { active: selectedCoin === coin.value }]"
          @click="selectedCoin = coin.value"
        >
          {{ coin.label }}
        </button>
      </div>
    </div>

    <div class="section">
      <label>Chọn mạng lưới</label>
      <div class="network-list">
        <button
          v-for="network in networks"
          :key="network.value"
          :class="['network-btn', { active: selectedNetwork === network.value }]"
          @click="selectNetwork(network.value)"
        >
          <span>{{ network.label }}</span>
          <small>{{ network.fee }}</small>
        </button>
      </div>
    </div>

    <div class="section">
      <label>Số tiền nạp</label>
      <div class="amount-box">
        <input
          v-model.number="amountVnd"
          type="number"
          min="30000"
          placeholder="Nhập số tiền VND"
        />
        <span>VND</span>
      </div>

      <div class="conversion">
        ≈ {{ usdtAmount }} USDT
      </div>
    </div>

    <div class="wallet-card" v-if="walletAddress">
      <div class="qr-box">
        <img :src="qrCodeUrl" alt="QR Code" />
      </div>

      <div class="wallet-info">
        <label>Địa chỉ ví {{ selectedNetwork }}</label>
        <div class="address-row">
          <span>{{ walletAddress }}</span>
          <button @click="copyAddress">Copy</button>
        </div>
      </div>
    </div>

    <div class="warning">
      Chỉ chuyển {{ selectedCoin }} qua mạng {{ selectedNetwork }}. Chuyển sai mạng có thể mất tài sản.
    </div>

    <button class="submit-btn" :disabled="!canSubmit" @click="submitCryptoDeposit">
      Tôi đã chuyển khoản
    </button>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { rechargeApi } from '@/api/recharge'

const emit = defineEmits(['submit'])

const selectedCoin = ref('USDT')
const selectedNetwork = ref('TRC20')
const amountVnd = ref(30000)

const rate = ref(25000)
const loading = ref(false)
const configLoaded = ref(false)
const minAmount = ref(30000)
const maxAmount = ref(10000000)

const coins = [
  { label: 'USDT', value: 'USDT' }
]

const networks = [
  { label: 'TRC20', value: 'TRC20', fee: 'Phí thấp' },
  { label: 'ERC20', value: 'ERC20', fee: 'Phí cao hơn' }
]

const walletAddresses = ref({
  TRC20: 'TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  ERC20: '0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
})

const walletAddress = computed(() => walletAddresses.value[selectedNetwork.value])

const usdtAmount = computed(() => {
  const value = Number(amountVnd.value || 0) / Number(rate.value || 1)
  return value.toFixed(2)
})

const qrCodeUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(walletAddress.value)}`
})

const canSubmit = computed(() => {
  return amountVnd.value >= minAmount.value &&
         amountVnd.value <= maxAmount.value &&
         walletAddress.value &&
         configLoaded.value &&
         !loading.value
})

// Load config from backend
async function loadConfig() {
  try {
    loading.value = true
    showLoadingToast({
      message: 'Đang tải cấu hình...',
      forbidClick: true,
      duration: 0
    })

    const res = await rechargeApi.getConfig('USDT')
    
    if (res.code === 0 && res.data) {
      // Update wallet addresses
      if (res.data.trc20Address) {
        walletAddresses.value.TRC20 = res.data.trc20Address
      }
      if (res.data.erc20Address) {
        walletAddresses.value.ERC20 = res.data.erc20Address
      }
      
      // Update rate
      if (res.data.rate) {
        rate.value = res.data.rate
      }
      
      // Update limits
      if (res.data.minAmount) {
        minAmount.value = res.data.minAmount
      }
      if (res.data.maxAmount) {
        maxAmount.value = res.data.maxAmount
      }
      
      configLoaded.value = true
      closeToast()
    } else {
      throw new Error(res.msg || 'Không thể tải cấu hình')
    }
  } catch (error) {
    console.error('Load config failed:', error)
    closeToast()
    showToast({
      message: error.message || 'Lỗi tải cấu hình, sử dụng giá trị mặc định',
      duration: 2000
    })
    // Use default values on error
    configLoaded.value = true
  } finally {
    loading.value = false
  }
}

function selectNetwork(network) {
  selectedNetwork.value = network
}

async function copyAddress() {
  try {
    await navigator.clipboard.writeText(walletAddress.value)
    showToast('Đã sao chép địa chỉ')
  } catch (e) {
    showToast('Sao chép thất bại')
  }
}

function submitCryptoDeposit() {
  if (!canSubmit.value) return
  
  // Validate amount
  if (amountVnd.value < minAmount.value) {
    showToast(`Số tiền tối thiểu ${minAmount.value.toLocaleString()} VND`)
    return
  }
  
  if (amountVnd.value > maxAmount.value) {
    showToast(`Số tiền tối đa ${maxAmount.value.toLocaleString()} VND`)
    return
  }

  emit('submit', {
    type: selectedCoin.value,
    network: selectedNetwork.value,
    amount: amountVnd.value,
    usdt_amount: usdtAmount.value,
    address: walletAddress.value
  })
}

// Load config on mount
onMounted(() => {
  loadConfig()
})
</script>

<style scoped>
.crypto-deposit {
  padding: 16px;
}

.crypto-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.crypto-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.crypto-header p {
  margin: 4px 0 0;
  color: #777;
  font-size: 13px;
}

.badge {
  background: #16a34a;
  color: #fff;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
}

.section {
  margin-bottom: 16px;
}

.section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
}

.coin-list,
.network-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.coin-btn,
.network-btn {
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.network-btn {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.network-btn small {
  color: #888;
  font-size: 11px;
}

.coin-btn.active,
.network-btn.active {
  border-color: #16a34a;
  background: #ecfdf5;
  color: #15803d;
}

.amount-box {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 0 12px;
  background: #fff;
}

.amount-box input {
  flex: 1;
  border: 0;
  outline: none;
  height: 44px;
  font-size: 16px;
}

.amount-box span {
  color: #666;
  font-weight: 600;
}

.conversion {
  margin-top: 8px;
  color: #16a34a;
  font-weight: 700;
}

.wallet-card {
  display: flex;
  gap: 14px;
  padding: 14px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  margin-bottom: 14px;
}

.qr-box img {
  width: 110px;
  height: 110px;
  border-radius: 8px;
}

.wallet-info {
  flex: 1;
  min-width: 0;
}

.wallet-info label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.address-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.address-row span {
  flex: 1;
  word-break: break-all;
  font-size: 12px;
  color: #333;
}

.address-row button {
  border: 0;
  background: #16a34a;
  color: #fff;
  border-radius: 8px;
  padding: 6px 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.address-row button:active {
  transform: scale(0.95);
}

.warning {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 14px;
  line-height: 1.5;
}

.submit-btn {
  width: 100%;
  border: 0;
  border-radius: 14px;
  height: 46px;
  background: #16a34a;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:active {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>