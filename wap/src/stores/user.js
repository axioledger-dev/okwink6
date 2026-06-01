import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { lotteryWS } from '@/utils/websocket'
import { showNotify, showToast } from 'vant'

export const useUserStore = defineStore('user', () => {
  const balance = ref(0)  // Số dư mặc định 0
  const unreadCount = ref(0) // Số thông báo chưa đọc
  const recentBets = ref([]) // Lịch sử cược gần đây (WS đẩy về)

  const setBalance = (val) => {
    balance.value = Number(val) || 0
  }

  const updateBalance = (data) => {
    const { balance: newBalance, change, reason } = data
    balance.value = Number(newBalance) || 0


    if (change && change !== 0) {
      const reasonText = {
        bet_win: 'Thắng cược',
        bet_place: 'Đặt cược',
        bet_refund: 'Hoàn trả cược',
        recharge: 'Nạp tiền',
        withdraw: 'Rút tiền',
        withdraw_reject: 'Hủy rút tiền',
        activity: 'Thưởng sự kiện',
        rebate: 'Hoàn trả'
      }[reason] || 'Biến động số dư'

      const changeText = change > 0 ? `+${Number(change).toFixed(2)}` : Number(change).toFixed(2)

      showNotify({
        type: change > 0 ? 'success' : 'warning',
        message: `${reasonText}: ${changeText} VNĐ`,
        duration: 3000
      })
    }
  }

  const handleBetCreated = (data) => {
    const { orderNo, betAmount, balanceAfter } = data


    balance.value = Number(balanceAfter) || balance.value


    recentBets.value.unshift({
      orderNo,
      betAmount,
      time: Date.now()
    })

    if (recentBets.value.length > 10) {
      recentBets.value.pop()
    }


    showToast({
      message: `Đặt cược thành công\nSố tiền: ${betAmount} VNĐ`,
      type: 'success',
      duration: 2000
    })
  }

  let wsCleanups = []


  const initWsListeners = () => {

    const unsubBalance = lotteryWS.on('balance_update', updateBalance)
    wsCleanups.push(unsubBalance)


    const unsubBetCreated = lotteryWS.on('bet_created', handleBetCreated)
    wsCleanups.push(unsubBetCreated)


    const unsubNotification = lotteryWS.on('notification', (data) => {
      const typeConfig = {
        info: { type: 'primary', duration: 5000 },
        warning: { type: 'warning', duration: 8000 },
        error: { type: 'danger', duration: 10000 }
      }
      const config = typeConfig[data.level] || typeConfig.info

      showNotify({
        type: config.type,
        message: `${data.title}\n${data.content}`,
        duration: config.duration
      })

      unreadCount.value++
    })
    wsCleanups.push(unsubNotification)
  }


  const cleanupWsListeners = () => {
    wsCleanups.forEach(cleanup => cleanup())
    wsCleanups = []
  }

  const init = () => {

  }

  return {
    balance,
    unreadCount,
    recentBets,
    setBalance,
    updateBalance,
    handleBetCreated,
    initWsListeners,
    cleanupWsListeners,
    init
  }
})
