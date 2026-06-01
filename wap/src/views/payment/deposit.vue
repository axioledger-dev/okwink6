<template>
  <div class="deposit-new-view">
    <div class="payment-header">
      <i class="back-arrow-btn" @click="$router.go(-1)">〈</i>
      <h2 class="view-title">Nạp Tiền</h2>
      <div class="header-right-utils">
        <i class="icon-headset">🎧</i>
        <i class="icon-history" @click="$router.push('/payment/history')">Layout</i>
      </div>
    </div>

    <div class="deposit-body-scroller">
      <div class="headline-balance-row">
        <span class="title-txt">Phương Thức Thanh Toán</span>
        <div class="user-balance-chip">
          <span class="orange-dot">🔶</span>
          <span class="num">{{ userBalance.toFixed(2) }}</span>
          <i class="refresh-action" @click="getProfileBalance">🔄</i>
        </div>
      </div>

      <div class="main-channel-tabs">
        <div
          :class="['chan-tab', activeChannel === 'online' ? 'active' : '']"
          @click="changeChannel('online')"
        >
          <span class="icon">📱</span> Nạp tiền trực tuyến
        </div>
        <div
          :class="['chan-tab', activeChannel === 'crypto' ? 'active' : '']"
          @click="changeChannel('crypto')"
        >
          <span class="icon">🪙</span> Tiền Kỹ Thuật Số
          <span class="float-discount-tag">+0.6%</span>
        </div>
      </div>

      <div class="methods-grid-container">
        <div
          v-for="meth in filteredMethods"
          :key="meth.method_code"
          :class="['method-item-card', activeMethod === meth.method_code ? 'active' : '']"
          @click="selectMethod(meth)"
        >
          <div class="crypto-icon-avatar" :class="meth.method_code">
            <span v-if="meth.method_code === 'usdt'">🔲</span>
            <span v-else-if="meth.method_code === 'bitcoin'">₿</span>
            <span v-else-if="meth.method_code === 'eth'">Ξ</span>
            <span v-else-if="meth.method_code === 'bnb'">🔶</span>
            <span v-else-if="meth.method_code === 'ton'">💎</span>
            <span v-else-if="meth.method_code === 'usdc'">💵</span>
            <span v-else>💳</span>
          </div>
          <span class="method-label">{{ meth.name_vi }}</span>
        </div>
      </div>

      <div class="promotion-wrapper-box">
        <div class="promo-header">
          <span class="lbl">🎁 Ưu đãi nạp</span>
          <span class="timer-countdown">LT 11:18:10.9</span>
        </div>
        <div class="promo-options-list">
          <div
            :class="['promo-row', selectedPromoId === 0 ? 'checked' : '']"
            @click="selectedPromoId = 0"
          >
            <div class="radio-dot"></div>
            <div class="meta">
              <span class="main">😔 Không tham gia sự kiện</span>
            </div>
          </div>
          <div
            v-for="promo in promotions"
            :key="promo.id"
            :class="['promo-row', selectedPromoId === promo.id ? 'checked' : '']"
            @click="selectedPromoId = promo.id"
          >
            <div class="radio-dot"></div>
            <div class="meta">
              <span class="main">{{ promo.title }}</span>
              <span class="sub">{{ promo.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="amount-calc-wrapper" v-if="activeGatewayData">
        <div class="title-lbl">Số tiền nạp</div>

        <div class="quick-amounts-grid">
          <div
            v-for="item in quickAmountConfig"
            :key="item.value"
            :class="['amt-grid-pill', depositAmount === item.value ? 'active' : '']"
            @click="depositAmount = item.value"
          >
            <span class="main-val">{{ item.value.toLocaleString() }}</span>
            <span class="sub-fee-text" v-if="activeChannel === 'crypto'">+{{ item.fee }}</span>
          </div>
        </div>

        <div class="input-form-field">
          <input
            type="number"
            v-model.number="depositAmount"
            :placeholder="`Tối thiểu ${activeGatewayData.min_amount.toLocaleString()} ~ Tối đa ${activeGatewayData.max_amount.toLocaleString()}`"
          />
          <span class="clear-btn" v-if="depositAmount" @click="depositAmount = null">✕</span>
        </div>

        <div class="exchange-rate-footer">
          <div class="rate-row">1=1,000₫</div>
          <div class="rate-row text-green" v-if="activeChannel === 'online'">
            ≈ {{ (depositAmount * 1000 || 0).toLocaleString('vi-VN') }}.00₫
          </div>
          <div class="crypto-rate-details" v-else>
            <div class="lbl-crypto">Tỷ giá hối đoái</div>
            <div class="val-crypto">1 : 2,022,671.75953904739 🔄</div>
          </div>
        </div>
      </div>

    </div>

    <footer class="sticky-bottom-action">
      <button class="btn-goto-bottom-helper">⬇ Phía dưới cùng</button>
      <button class="btn-trigger-deposit-now" @click="executeDepositOrder">Nạp Tiền Ngay</button>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const userBalance = ref(0.00);
const activeChannel = ref('online'); // Mặc định mở tab trực tuyến trước
const activeMethod = ref('');
const depositAmount = ref(20227); // Khởi tạo mốc mặc định theo ảnh mẫu
const selectedPromoId = ref(0);

// Khai báo cấu trúc dữ liệu thô (Schema Mapping)
const paymentMethodsData = ref([]);
const promotions = ref([]);

// Lấy thông tin ví số dư tài khoản
const getProfileBalance = async () => {
  const res = await axios.get('/api/profile/getProfileInfo');
  if (res.data.code === 200) userBalance.value = res.data.data.balance;
};

// Khởi chạy lấy dữ liệu Schema nạp từ Backend Webman
const loadDepositSchema = async () => {
  const res = await axios.get('/api/deposit/getDepositSchema');
  if (res.data.code === 200) {
    paymentMethodsData.value = res.data.data.channels;
    promotions.value = res.data.data.promotions.filter(p => p.id !== 0);

    // Đặt cấu hình ban đầu
    changeChannel('online');
  }
};

const changeChannel = (chanCode) => {
  activeChannel.value = chanCode;
  const channel = paymentMethodsData.value.find(c => c.code === chanCode);
  if (channel && channel.methods.length > 0) {
    selectMethod(channel.methods[0]);
  }
};

const selectMethod = (meth) => {
  activeMethod.value = meth.method_code;
};

// Lọc danh sách phương thức dựa trên Tab đang chọn
const filteredMethods = computed(() => {
  const channel = paymentMethodsData.value.find(c => c.code === activeChannel.value);
  return channel ? channel.methods : [];
});

// Lấy dữ liệu Cổng định tuyến API hiện tại của phương thức chọn
const activeGatewayData = computed(() => {
  const methods = filteredMethods.value;
  const currentMethod = methods.find(m => m.method_code === activeMethod.value);
  return currentMethod && currentMethod.gateways.length > 0 ? currentMethod.gateways[0] : null;
});

// Tính toán các mốc hạt nút chọn nhanh kèm phụ phí tỉ giá
const quickAmountConfig = computed(() => {
  if (!activeGatewayData.value) return [];
  const amounts = activeGatewayData.value.quick_amounts.split(',');
  return amounts.map(amt => {
    const val = parseInt(amt);
    return {
      value: val,
      fee: (val * 0.006).toFixed(2) // Giả định phụ phí hiển thị thêm +0.6% tăng độ bắt mắt
    };
  });
});

// Gửi lệnh xử lý tạo hóa đơn sang Backend
const executeDepositOrder = async () => {
  if (!depositAmount.value || depositAmount.value <= 0) {
    alert("Vui lòng nhập định mức tiền gửi hợp lệ!");
    return;
  }
  try {
    const res = await axios.post('/api/deposit/createOrder', {
      amount: depositAmount.value,
      gateway_code: activeGatewayData.value.gateway_code,
      promo_id: selectedPromoId.value
    });
    if (res.data.code === 200) {
      window.open(res.data.data.qr_url, '_blank');
    } else {
      alert(res.data.msg);
    }
  } catch (err) {
    alert("Cổng API thanh toán nghẽn luồng!");
  }
};

onMounted(() => {
  getProfileBalance();
  loadDepositSchema();
});
</script>

<style scoped>
/* THIẾT KẾ BỐ CỤC CHUẨN ĐỒNG BỘ ĐIỆN THOẠI WAP DI ĐỘNG */
.deposit-new-view { width: 100%; min-height: 100vh; display: flex; flex-direction: column; background: #fff; font-family: sans-serif; position: relative; }

.payment-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; border-bottom: 1px solid #f5f5f5; background: #fff; position: sticky; top: 0; z-index: 10; }
.back-arrow-btn { font-size: 18px; color: #666; cursor: pointer; font-weight: bold; }
.view-title { font-size: 16px; font-weight: bold; margin: 0; color: #222; }
.header-right-utils { display: flex; gap: 15px; font-size: 18px; color: #e67e22; cursor: pointer; }

.deposit-body-scroller { flex: 1; overflow-y: auto; padding: 15px; padding-bottom: 120px; background: #fdfdfd; }

.headline-balance-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-size: 13px; font-weight: 500; color: #333; }
.user-balance-chip { background: #fff3e0; color: #e67e22; padding: 4px 12px; border-radius: 20px; font-weight: bold; display: flex; align-items: center; gap: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.02); }

/* Thiết kế Tab phong cách F168 */
.main-channel-tabs { display: flex; gap: 20px; border-bottom: 2px solid #f5f5f5; margin-bottom: 15px; }
.chan-tab { padding: 10px 0; font-size: 14px; color: #666; position: relative; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 4px; }
.chan-tab.active { color: #e67e22; border-bottom: 3px solid #e67e22; margin-bottom: -2px; }
.float-discount-tag { background: #ff3d00; color: white; font-size: 9px; padding: 1px 4px; border-radius: 4px; position: absolute; top: -4px; right: -25px; font-weight: normal; }

/* Grid phương thức 2 cột đều tăm tắp */
.methods-grid-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
.method-item-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px 12px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s; }
.method-item-card.active { border-color: #e67e22; background: #fffde7; }
.crypto-icon-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; background: #f5f5f5; color: #fff; }
.crypto-icon-avatar.usdt { background: #009688; }
.crypto-icon-avatar.bitcoin { background: #ff9800; }
.crypto-icon-avatar.eth { background: #3f51b5; }
.crypto-icon-avatar.bnb { background: #ffc107; }
.method-label { font-size: 13px; font-weight: bold; color: #444; }

/* Thẻ ưu đãi nạp tiền */
.promotion-wrapper-box { background: #fffbe6; border: 1px solid #ffe58f; padding: 12px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
.promo-header { font-weight: bold; font-size: 13px; color: #d46b08; display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center; }
.timer-countdown { background: #ff3d00; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: normal; }
.promo-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; cursor: pointer; border-bottom: 1px dashed #ffe58f; }
.promo-row:last-child { border: none; }
.radio-dot { width: 14px; height: 14px; border: 2px solid #ccc; border-radius: 50%; position: relative; background: #fff; }
.promo-row.checked .radio-dot { border-color: #e67e22; background: #e67e22; }
.promo-row.checked .radio-dot::after { content: ''; position: absolute; width: 6px; height: 6px; background: #fff; border-radius: 50%; top: 4px; left: 4px; }
.promo-text-meta { display: flex; flex-direction: column; }
.promo-text-meta .main { font-size: 12px; font-weight: bold; color: #333; }
.promo-text-meta .sub { font-size: 11px; color: #777; margin-top: 2px; }

/* Khu vực mốc tiền nhanh và tính toán */
.amount-calc-wrapper { background: #fff; border: 1px solid #f1f1f1; border-radius: 8px; padding: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.title-lbl { font-weight: bold; font-size: 13px; color: #222; margin-bottom: 12px; }

.quick-amounts-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 15px; }
.amt-grid-pill { background: #f5f5f5; border: 1px solid transparent; padding: 6px 0; text-align: center; border-radius: 6px; cursor: pointer; display: flex; flex-direction: column; justify-content: center; align-items: center; }
.amt-grid-pill.active { background: #fff3e0; border-color: #e67e22; }
.amt-grid-pill .main-val { font-size: 13px; font-weight: bold; color: #333; }
.amt-grid-pill.active .main-val { color: #e67e22; }
.amt-grid-pill .sub-fee-text { font-size: 9px; color: #e67e22; font-weight: bold; margin-top: 1px; }

.input-form-field { display: flex; align-items: center; background: #f5f5f5; padding: 12px 15px; border-radius: 8px; margin-bottom: 10px; position: relative; }
.input-form-field input { width: 100%; border: none; background: transparent; font-size: 18px; font-weight: bold; outline: none; color: #333; }
.clear-btn { position: absolute; right: 15px; color: #ccc; cursor: pointer; font-size: 14px; }

.exchange-rate-footer { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; align-items: flex-start; }
.text-green { color: #2e7d32; font-size: 14px; }
.crypto-rate-details { text-align: right; }
.lbl-crypto { color: #999; font-size: 11px; margin-bottom: 2px; font-weight: normal; }
.val-crypto { color: #e67e22; }

/* Sticky Footer */
.sticky-bottom-action { position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 15px; background: #fff; border-top: 1px solid #eee; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 -4px 10px rgba(0,0,0,0.04); z-index: 10; }
.btn-goto-bottom-helper { background: #607d8b; color: white; border: none; padding: 6px; border-radius: 4px; font-size: 11px; font-weight: bold; width: fit-content; margin: 0 auto; cursor: pointer; }
.btn-trigger-deposit-now { width: 100%; background: linear-gradient(90deg, #ffb74d, #e67e22); color: white; border: none; padding: 14px; border-radius: 8px; font-size: 15px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(230, 126, 34, 0.25); }
</style>
