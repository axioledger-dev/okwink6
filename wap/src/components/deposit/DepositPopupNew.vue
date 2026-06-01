<template>
  <van-popup 
    v-model:show="showPopup" 
    position="bottom" 
    round 
    :style="{ maxHeight: '92vh' }"
    class="deposit-popup-new"
    @close="handleClose"
  >
    <!-- Header -->
    <div class="popup-header">
      <div class="header-left" @click="handleClose">
        <van-icon name="arrow-left" size="20" />
      </div>
      <div class="header-title">Nạp Tiền</div>
      <div class="header-right">
        <van-icon name="question-o" size="22" color="#ff5662" @click="showHelp" />
        <van-icon name="star-o" size="22" color="#ff5662" @click="showFavorites" />
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="popup-body">
      <!-- Balance Row -->
      <div class="balance-row">
        <span class="balance-label">Phương Thức Thanh Toán</span>
        <div class="balance-info">
          <img src="/assets/deposit/VND.avif" alt="VND" class="currency-icon" />
          <span class="balance-amount">{{ formatBalance(userBalance) }}</span>
          <van-icon name="replay" size="16" color="#999" @click="refreshBalance" />
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-container">
        <div 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="tab-item"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
        >
          {{ tab.label }}
          <span class="tab-badge">{{ tab.bonus }}</span>
        </div>
      </div>

      <!-- Tab Content: Online Payment -->
      <div v-if="activeTab === 0" class="tab-content">
        <!-- Payment Methods Grid -->
        <div class="payment-methods-grid">
          <div 
            v-for="(method, index) in paymentMethods" 
            :key="index"
            class="payment-method-item"
            :class="{ active: selectedMethod === index }"
            @click="selectMethod(index)"
          >
            <img :src="method.img" :alt="method.label" class="method-img" />
            <span class="method-label">{{ method.label }}</span>
            <span class="method-bonus">{{ method.bonus }}</span>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Channels Grid -->
        <div class="channels-grid">
          <div 
            v-for="(channel, index) in channels" 
            :key="index"
            class="channel-item"
            :class="{ active: selectedChannel === index }"
            @click="selectChannel(index)"
          >
            <span class="channel-label">{{ channel.label }}</span>
            <span v-if="channel.hot" class="hot-badge">HOT</span>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Amount Section -->
        <p class="section-title">Số tiền nạp</p>

        <!-- Amount Presets Grid -->
        <div class="amounts-grid">
          <div 
            v-for="(amount, index) in amounts" 
            :key="index"
            class="amount-item"
            :class="{ active: selectedAmount === index }"
            @click="selectAmount(index, amount.value)"
          >
            <div class="amount-value">{{ amount.label }}</div>
            <div class="amount-reward">{{ amount.reward }}</div>
          </div>
        </div>

        <!-- Custom Input -->
        <div class="custom-input-wrapper" :class="{ valid: isAmountValid, focused: inputFocused }">
          <van-icon name="clock-o" size="18" color="#ffaa09" />
          <input 
            ref="amountInput"
            v-model="customAmount" 
            type="number"
            placeholder="Tối thiểu 30~tối đa 300,000"
            class="custom-amount-input"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
            @input="handleCustomInput"
          />
        </div>
        <div class="exchange-rate">1=1,000₫</div>

        <!-- Bonus Panel -->
        <div class="bonus-panel">
          <div class="bonus-header">
            <div class="bonus-title">
              <img
                src="/assets/deposit/img_czjl_mccz.avif"
                alt="bonus"
                class="bonus-icon"
              />
              <span>Ưu đãi nạp</span>
            </div>
            <div class="bonus-timer">
              <span class="timer-badge">LT</span>
              <span class="timer-text">{{ countdown }}</span>
            </div>
          </div>
          
          <div class="bonus-subtitle">
            ----- <span>Tự động tham gia vào các hoạt động sau</span> -----
          </div>

          <div 
            v-for="(bonus, index) in bonuses" 
            :key="index"
            class="bonus-item"
          >
            <div class="bonus-left">
              <img
                src="/assets/deposit/img_czjl_zh.avif"
                alt="bonus"
                class="bonus-item-icon"
              />
              <div class="bonus-info">
                <div class="bonus-label">Tiền thưởng</div>
                <div class="bonus-amount">{{ bonus.give }}</div>
              </div>
            </div>
            <div class="bonus-condition">
              Nạp tiền lần đầu<span class="condition-value">{{ bonus.condition }}</span>
            </div>
          </div>

          <button class="view-more-btn" @click="showMoreBonuses">
            Xem Thêm
            <van-icon name="arrow-down" size="12" />
          </button>
        </div>

        <!-- Tips -->
        <div class="tips-box">
          <span class="tips-label">Mẹo: </span>
          Vui lòng nhập chính xác nội dung chuyển khoản và chọn đúng mệnh giá nạp để được cập nhập điểm nhanh nhất
        </div>

        <!-- Submit Button -->
        <button 
          class="submit-btn"
          :class="{ disabled: !isAmountValid }"
          :disabled="!isAmountValid"
          @click="handleSubmit"
        >
          Nạp Tiền Ngay
        </button>

        <div class="bottom-spacer"></div>
      </div>

      <!-- Tab Content: Digital Currency -->
      <div v-else class="tab-content">
        <CryptoDepositContent @submit="handleCryptoDepositSubmit" />
      </div>
    </div>

    <!-- QR Code Popup -->
    <van-popup 
      v-model:show="showQRPopup" 
      round 
      :style="{ width: '300px', padding: '24px 20px' }"
      class="qr-popup"
    >
      <button class="qr-close-btn" @click="showQRPopup = false">✕</button>
      <p class="qr-title">Quét Mã QR Nạp Tiền</p>
      <p class="qr-amount">Số tiền: <span>{{ customAmount }}k</span></p>
      <div class="qr-code-box">
        <!-- QR Code SVG -->
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
          <rect x="10" y="10" width="50" height="50" rx="4" stroke="#333" stroke-width="4" fill="none"/>
          <rect x="20" y="20" width="30" height="30" rx="2" fill="#333"/>
          <rect x="80" y="10" width="50" height="50" rx="4" stroke="#333" stroke-width="4" fill="none"/>
          <rect x="90" y="20" width="30" height="30" rx="2" fill="#333"/>
          <rect x="10" y="80" width="50" height="50" rx="4" stroke="#333" stroke-width="4" fill="none"/>
          <rect x="20" y="90" width="30" height="30" rx="2" fill="#333"/>
          <rect x="80" y="80" width="10" height="10" fill="#333"/>
          <rect x="95" y="80" width="10" height="10" fill="#333"/>
          <rect x="110" y="80" width="20" height="10" fill="#333"/>
          <rect x="80" y="95" width="25" height="10" fill="#333"/>
          <rect x="110" y="95" width="20" height="10" fill="#333"/>
          <rect x="80" y="110" width="15" height="10" fill="#333"/>
          <rect x="100" y="110" width="30" height="20" fill="#333"/>
        </svg>
      </div>
      <p class="qr-instruction">Vui lòng quét mã QR để nạp tiền</p>
      <p class="qr-expiry">Mã QR có hiệu lực trong 15 phút</p>
      <button class="qr-confirm-btn" @click="showQRPopup = false">Đóng</button>
    </van-popup>

    <!-- PayInfo Popup for Crypto Deposits -->
    <PayInfoPopup
      v-model:show="showPayInfo"
      :order="currentOrder"
    />
  </van-popup>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import CryptoDepositContent from './CryptoDepositContent.vue'
import PayInfoPopup from './PayInfoPopup.vue'
import { rechargeApi } from '@/api/recharge'

const router = useRouter()

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:show'])

// Data
const showPopup = ref(false)
const userBalance = ref(0)
const activeTab = ref(0)
const selectedMethod = ref(0)
const selectedChannel = ref(0)
const selectedAmount = ref(null)
const customAmount = ref('')
const inputFocused = ref(false)
const showQRPopup = ref(false)
const countdownTimer = ref(null)
const countdown = ref('18:46:18')
const showPayInfo = ref(false)
const currentOrder = ref(null)

// Tabs
const tabs = [
  { label: 'Nạp tiền trực tuyến', bonus: '+1%' },
  { label: 'Tiền Kỹ Thuật Số', bonus: '+1%' }
]

// Payment Methods
const paymentMethods = [
  { label: 'Quét Mã QR', bonus: '+0.5-1%', img: '/assets/deposit/qr-code.avif' },
  { label: 'Nạp Nhanh', bonus: '+0.5-1%', img: '/assets/deposit/fast-deposit.avif' },
  { label: 'Thẻ Cào', bonus: '+0.5%', img: '/assets/deposit/card.avif' },
  { label: 'Momo Pay', bonus: '+0.5-1%', img: '/assets/deposit/momo.avif' },
  { label: 'ZaloPay', bonus: '+0.5-1%', img: '/assets/deposit/zalo.avif' },
  { label: 'Viettel Pay', bonus: '+0.5-1%', img: '/assets/deposit/viettel.avif' }
]

// Channels
const channels = [
  { label: '30k~300000k', hot: false },
  { label: '50K~300000K', hot: true },
  { label: '50K~300000K', hot: false },
  { label: '50K~30000K', hot: false },
  { label: '50k~300000k', hot: false }
]

// Amount Options
const amounts = [
  { value: 30, label: '30', reward: '+0.15' },
  { value: 50, label: '50', reward: '+5.25' },
  { value: 100, label: '100', reward: '+10.50' },
  { value: 300, label: '300', reward: '+31.50' },
  { value: 500, label: '500', reward: '+52.50' },
  { value: 1000, label: '1,000', reward: '+105.00' },
  { value: 5000, label: '5,000', reward: '+375.00' },
  { value: 10000, label: '10,000', reward: '+850.00' }
]

// Bonuses
const bonuses = [
  { give: '5.00', condition: '≥50' },
  { give: '10.00', condition: '≥100' },
  { give: '30.00', condition: '≥300' }
]

// Computed
const isAmountValid = computed(() => {
  const amount = parseFloat(customAmount.value) || 0
  return amount >= 30
})

// Watch
watch(() => props.show, (newVal) => {
  showPopup.value = newVal
})

watch(showPopup, (newVal) => {
  emit('update:show', newVal)
  if (newVal) {
    startCountdown()
  } else {
    stopCountdown()
  }
})

// Methods
const formatBalance = (balance) => {
  return balance.toFixed(2)
}

const refreshBalance = () => {
  // TODO: Implement balance refresh
  console.log('Refreshing balance...')
}

const selectMethod = (index) => {
  selectedMethod.value = index
}

const selectChannel = (index) => {
  selectedChannel.value = index
}

const selectAmount = (index, value) => {
  selectedAmount.value = index
  customAmount.value = String(value)
}

const handleCustomInput = () => {
  selectedAmount.value = null
}

const showHelp = () => {
  console.log('Show help')
}

const showFavorites = () => {
  console.log('Show favorites')
}

const showMoreBonuses = () => {
  console.log('Show more bonuses')
}

const handleSubmit = () => {
  if (!isAmountValid.value) return
  showQRPopup.value = true
}

const handleCryptoDepositSubmit = async (payload) => {
  try {
    console.log('Crypto deposit submit:', payload)
    
    // Show loading
    showLoadingToast({
      message: 'Đang tạo đơn nạp...',
      forbidClick: true,
      duration: 0
    })
    
    // Submit to backend
    const res = await rechargeApi.submit({
      paytype: payload.type,
      network: payload.network,
      amount: payload.amount,
      usdt_amount: payload.usdt_amount,
      address: payload.address
    })
    
    closeToast()
    
    if (res.code === 0 && res.data) {
      // Success - show order info
      currentOrder.value = {
        trano: res.data.trano,
        amount: payload.usdt_amount,
        paytype: payload.type,
        paytypeName: `${payload.type} (${payload.network})`,
        network: payload.network,
        address: payload.address,
        status: res.data.status || 'pending',
        created_at: res.data.created_at || new Date().toISOString()
      }
      
      showToast({
        message: 'Đã tạo đơn nạp thành công',
        duration: 2000
      })
      
      // Show PayInfoPopup
      showPayInfo.value = true
      
      // Auto confirm after showing popup
      setTimeout(async () => {
        try {
          await rechargeApi.confirm(res.data.trano)
          console.log('Order confirmed:', res.data.trano)
        } catch (error) {
          console.error('Confirm failed:', error)
        }
      }, 1000)
      
    } else {
      throw new Error(res.msg || 'Tạo đơn nạp thất bại')
    }
    
  } catch (error) {
    console.error('Crypto deposit failed:', error)
    closeToast()
    showToast({
      message: error.message || 'Lỗi tạo đơn nạp, vui lòng thử lại',
      duration: 3000
    })
  }
}

const handleClose = () => {
  showPopup.value = false
}

const startCountdown = () => {
  let hours = 18
  let minutes = 46
  let seconds = 18

  countdownTimer.value = setInterval(() => {
    seconds--
    if (seconds < 0) {
      seconds = 59
      minutes--
      if (minutes < 0) {
        minutes = 59
        hours--
        if (hours < 0) {
          stopCountdown()
          return
        }
      }
    }
    countdown.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, 1000)
}

const stopCountdown = () => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
}

onMounted(() => {
  // Load user balance
  userBalance.value = 0
})

onUnmounted(() => {
  stopCountdown()
})
</script>

<style scoped>
.deposit-popup-new {
  display: flex;
  flex-direction: column;
  max-height: 92vh;
  overflow: hidden;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.header-left {
  cursor: pointer;
  padding: 4px;
}

.header-title {
  font-weight: 700;
  font-size: 16px;
  color: #333;
}

.header-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.popup-body {
  overflow-y: auto;
  flex: 1;
}

.balance-row {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.balance-label {
  font-size: 13px;
  color: #333;
  font-weight: 600;
}

.balance-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.currency-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.balance-amount {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}

.tabs-container {
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  gap: 0;
}

.tab-item {
  flex: 1;
  padding: 10px 0;
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: #999;
  font-size: 13px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.tab-item.active {
  border-bottom-color: #ff5662;
  color: #ff5662;
  font-weight: 700;
}

.tab-badge {
  font-size: 10px;
  background: #ff5662;
  color: #fff;
  border-radius: 8px;
  padding: 1px 5px;
  margin-left: 2px;
}

.tab-content {
  padding: 12px 16px;
}

.payment-methods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.payment-method-item {
  border: 2px solid transparent;
  background: #f8f8f8;
  border-radius: 8px;
  padding: 10px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.payment-method-item.active {
  border-color: #ff5662;
  background: rgba(255, 86, 98, 0.1);
}

.method-img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: contain;
}

.method-label {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.method-bonus {
  position: absolute;
  top: -6px;
  right: 4px;
  font-size: 10px;
  background: #ff5662;
  color: #fff;
  border-radius: 8px;
  padding: 1px 5px;
}

.divider {
  border-top: 1px solid #f0f0f0;
  margin: 0 0 12px;
}

.channels-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.channel-item {
  border: 2px solid transparent;
  background: #f8f8f8;
  border-radius: 8px;
  padding: 8px 4px;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.channel-item.active {
  border-color: #ff5662;
  background: #ff5662;
}

.channel-label {
  font-size: 11px;
  color: #333;
  font-weight: 400;
}

.channel-item.active .channel-label {
  color: #000;
  font-weight: 700;
}

.hot-badge {
  position: absolute;
  top: -8px;
  right: 2px;
  font-size: 10px;
  background: #ff5662;
  color: #fff;
  border-radius: 8px;
  padding: 1px 5px;
}

.section-title {
  font-size: 13px;
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
}

.amounts-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

.amount-item {
  border: 2px solid #e3e3e3;
  background: #f8f8f8;
  border-radius: 8px;
  padding: 8px 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.amount-item.active {
  border-color: #04be02;
  background: rgba(4, 190, 2, 0.1);
}

.amount-value {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.amount-reward {
  font-size: 10px;
  color: #04be02;
  margin-top: 2px;
}

.custom-input-wrapper {
  border: 2px solid #ff5662;
  border-radius: 8px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  background: #fff;
}

.custom-input-wrapper.valid {
  border-color: #04be02;
  box-shadow: 0 0 8px rgba(4, 190, 2, 0.3);
}

.custom-input-wrapper.focused {
  border-color: #04be02;
  box-shadow: 0 0 8px rgba(4, 190, 2, 0.3);
}

.custom-amount-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 0;
  font-size: 14px;
  background: transparent;
  color: #333;
}

.exchange-rate {
  font-size: 11px;
  color: #999;
  margin-bottom: 12px;
}

.bonus-panel {
  background: #fff8f8;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 86, 98, 0.15);
}

.bonus-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.bonus-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bonus-icon {
  width: 20px;
  height: 20px;
}

.bonus-title span {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.bonus-timer {
  display: flex;
  align-items: center;
  gap: 4px;
}

.timer-badge {
  font-size: 11px;
  color: #fff;
  background: #ff5662;
  padding: 2px 6px;
  border-radius: 4px;
}

.timer-text {
  font-size: 12px;
  color: #ff5662;
  font-weight: 600;
}

.bonus-subtitle {
  font-size: 11px;
  color: #999;
  text-align: center;
  margin-bottom: 8px;
}

.bonus-subtitle span {
  color: #666;
}

.bonus-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
}

.bonus-item:first-of-type {
  border-top: none;
}

.bonus-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bonus-item-icon {
  width: 28px;
  height: 28px;
}

.bonus-label {
  font-size: 11px;
  color: #999;
}

.bonus-amount {
  font-size: 13px;
  font-weight: 700;
  color: #ff5662;
}

.bonus-condition {
  font-size: 12px;
  color: #666;
}

.condition-value {
  color: #ff5662;
  font-weight: 700;
}

.view-more-btn {
  width: 100%;
  background: none;
  border: none;
  color: #ff5662;
  font-size: 12px;
  cursor: pointer;
  padding: 6px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.tips-box {
  background: #fff8f0;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 11px;
  color: #999;
  margin-bottom: 16px;
  line-height: 1.5;
}

.tips-label {
  color: #ffaa09;
  font-weight: 600;
}

.submit-btn {
  width: 100%;
  padding: 14px 0;
  background: linear-gradient(135deg, #ff5662, #ff8a5c);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 86, 98, 0.4);
  transition: all 0.2s ease;
}

.submit-btn.disabled {
  background: #e3e3e3;
  color: #999;
  cursor: not-allowed;
  box-shadow: none;
}

.bottom-spacer {
  height: 16px;
}

.empty-content {
  padding: 40px 16px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.wallet-pending-notice {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
}

.notice-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.notice-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.phase-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #ffaa09, #ff8a5c);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 170, 9, 0.3);
}

.notice-description {
  font-size: 13px;
  color: #999;
  line-height: 1.6;
  text-align: center;
  max-width: 280px;
  margin: 8px 0 0;
}

/* QR Popup Styles */
.qr-popup {
  text-align: center;
  position: relative;
}

.qr-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #999;
}

.qr-title {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 4px;
  color: #333;
}

.qr-amount {
  font-size: 13px;
  color: #999;
  margin-bottom: 16px;
}

.qr-amount span {
  color: #ff5662;
  font-weight: 700;
}

.qr-code-box {
  width: 180px;
  height: 180px;
  margin: 0 auto 16px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ff5662;
}

.qr-instruction {
  font-size: 12px;
  color: #ff5662;
  margin-bottom: 8px;
}

.qr-expiry {
  font-size: 11px;
  color: #999;
}

.qr-confirm-btn {
  margin-top: 16px;
  width: 100%;
  padding: 12px 0;
  background: #ff5662;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
}
</style>