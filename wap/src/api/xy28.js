import request from './request'

// Hàm định dạng mã cược
function formatBetCode(betData) {
  if (!betData || !betData.selections || betData.selections.length === 0) {
    return ''
  }

  return betData.selections.map(s => s.value).join(',')
}

export const xy28Api = {

  // Lấy kỳ quay thưởng hiện tại
  getCurrentExpect(lotteryCode = 'xy28') {
    return request({
      url: `/v1/lottery/${lotteryCode}/expect`,
      method: 'get'
    })
  },

  // Lấy kết quả kỳ gần nhất
  getLastResult(lotteryCode = 'xy28') {
    return request({
      url: `/v1/lottery/${lotteryCode}/last-result`,
      method: 'get'
    })
  },

  // Lấy lịch sử quay thưởng
  getHistory(lotteryCode = 'xy28', params = {}) {
    return request({
      url: `/v1/lottery/${lotteryCode}/history`,
      method: 'get',
      params: {
        page: 1,
        pageSize: 20,
        ...params
      }
    })
  },

  // Lấy danh sách loại hình chơi
  getPlayTypes(lotteryCode = 'xy28') {
    return request({
      url: `/v1/lottery/${lotteryCode}/play-types`,
      method: 'get'
    })
  },

  // Lấy thống kê số nóng/lạnh
  getHotCold(lotteryCode = 'xy28', limit = 100) {
    return request({
      url: `/v1/lottery/${lotteryCode}/hot-cold`,
      method: 'get',
      params: { limit }
    })
  },

  // Lấy cài đặt người dùng
  getUserSettings() {
    return request({
      url: '/v1/user/settings',
      method: 'get'
    })
  },

  // Lưu cài đặt người dùng
  saveUserSetting(key, value) {
    return request({
      url: '/v1/user/settings',
      method: 'post',
      data: { key, value }
    })
  },

  // Lấy cấu hình màu sắc (Bose)
  getBoseConfig(lotteryCode = 'xy28') {
    return request({
      url: `/v1/lottery/${lotteryCode}/bose-config`,
      method: 'get'
    })
  },

  // Gửi đơn cược
  submitBet(data) {
    const selections = data.betData.selections || []

    // Xử lý cược kết hợp (Combined)
    if (data.playType === 'xy28_combined') {
      const betItems = selections.map(s => ({
        playid: s.value,
        label: s.label,
        amount: s.amount || data.unitPrice
      }))

      const postData = {
        lotteryname: data.lotteryCode,
        expect: data.expect,
        playid: 'xy28_combined',
        tzcode: JSON.stringify(betItems),  // Định dạng JSON
        amount: data.totalAmount,
        beishu: 1,
        mode: 1,
        itemcount: selections.length,
        yjf: '元',
        ishemai: 0
      }

      return request({
        url: '/v1/bet/submit',
        method: 'post',
        data: postData
      })
    }

    const firstSelection = selections[0]
    const playId = firstSelection?.value || firstSelection?.playId || data.playType
    const tzcode = formatBetCode(data.betData)

    const postData = {
      lotteryname: data.lotteryCode,          // Tên xổ số
      expect: data.expect,                    // Kỳ quay
      playid: playId,                         // ID cách chơi
      tzcode: tzcode,                         // Mã cược
      amount: data.totalAmount,               // Tổng tiền cược
      beishu: data.multiplier,                // Hệ số nhân
      mode: 1,                                // Chế độ
      itemcount: data.betCount,               // Số lượng đơn
      yjf: '元',                               // Đơn vị tệ
      ishemai: 0,                             // Không hợp tác mua (Hợp mua)
      nums: data.betCount                     // Số con số
    }

    return request({
      url: '/v1/bet/submit',
      method: 'post',
      data: postData
    })
  },

  // Đặt cược đuổi (Chase)
  submitChase(data) {
    const chaseConfig = data.chaseConfig || {}
    const selections = data.betData?.selections || []
    const multipliers = chaseConfig.multipliers || []
    const plans = []
    const startExpect = chaseConfig.startExpect || ''

    for (let i = 0; i < (chaseConfig.periods || 1); i++) {
      const expectNum = parseInt(startExpect) + i
      plans.push({
        expect: String(expectNum),
        beishu: multipliers[i] || data.multiplier || 1
      })
    }

    let tzcode = ''
    let playid = data.playType || ''

    if (selections.length > 0) {
      if (selections.length > 1 || data.playType === 'xy28_combined') {
        playid = 'xy28_combined'
        tzcode = JSON.stringify(selections.map(s => ({
          playid: s.value || s.playId,
          label: s.label,
          amount: s.amount || data.unitPrice
        })))
      } else {
        playid = selections[0]?.value || data.playType
        tzcode = selections[0]?.label || selections[0]?.value || ''
      }
    }

    const postData = {
      lotteryname: data.lotteryCode,
      playid: playid,
      tzcode: tzcode,
      plans: plans,
      mode: 1,
      itemcount: selections.length || 1,
      amount: data.unitPrice || 1,
      yjf: '元',
      stopOnWin: chaseConfig.stopOnWin ? 1 : 0
    }

    return request({
      url: '/v1/bet/chase',
      method: 'post',
      data: postData
    })
  },

  // Cược nhanh
  quickBet(data) {
    return request({
      url: '/v1/bet/quick',
      method: 'post',
      data
    })
  },

  // Lấy lịch sử đặt cược
  getBetRecords(params = {}) {
    return request({
      url: '/v1/bet/records',
      method: 'get',
      params: {
        page: 1,
        pageSize: 20,
        ...params
      }
    })
  },

  // Chi tiết đặt cược
  getBetDetail(orderId) {
    return request({
      url: `/v1/bet/records/${orderId}`,
      method: 'get'
    })
  },

  // Lấy lịch sử cược đuổi
  getChaseRecords(params = {}) {
    return request({
      url: '/v1/chase/records',
      method: 'get',
      params: {
        page: 1,
        pageSize: 20,
        ...params
      }
    })
  },

  // Chi tiết cược đuổi
  getChaseDetail(chaseNo) {
    return request({
      url: `/v1/chase/detail/${chaseNo}`,
      method: 'get'
    })
  },

  // Hủy cược đuổi
  cancelChase(chaseNo) {
    return request({
      url: `/v1/chase/cancel/${chaseNo}`,
      method: 'post'
    })
  },

  // Lấy dữ liệu xu hướng
  getTrendData(lotteryCode = 'xy28', params = {}) {
    return request({
      url: `/v1/lottery/${lotteryCode}/trend`,
      method: 'get',
      params: {
        periods: 30,
        trendType: 'sum',
        ...params
      }
    })
  },

  // Lấy số nóng
  getHotNumbers(lotteryCode = 'xy28', params = {}) {
    return request({
      url: `/v1/lottery/${lotteryCode}/hot-numbers`,
      method: 'get',
      params: {
        periods: 100,
        ...params
      }
    })
  },

  // Lấy dữ liệu số thiếu
  getMissingData(lotteryCode = 'xy28') {
    return request({
      url: `/v1/lottery/${lotteryCode}/missing`,
      method: 'get'
    })
  },

  // Tạo hợp mua
  createHemai(data) {
    return request({
      url: '/v1/hemai/create',
      method: 'post',
      data
    })
  },

  // Lấy danh sách hợp mua
  getHemaiList(params = {}) {
    return request({
      url: '/v1/hemai/list',
      method: 'get',
      params: {
        page: 1,
        pageSize: 20,
        ...params
      }
    })
  },

  // Tham gia hợp mua
  joinHemai(hemaiId, data) {
    return request({
      url: `/v1/hemai/${hemaiId}/join`,
      method: 'post',
      data
    })
  },

  // Chi tiết hợp mua
  getHemaiDetail(hemaiId) {
    return request({
      url: `/v1/hemai/${hemaiId}`,
      method: 'get'
    })
  },

  // Lấy hợp mua do tôi tạo
  getMyCreatedHemai(params = {}) {
    return request({
      url: '/v1/hemai/my-created',
      method: 'get',
      params: {
        page: 1,
        pageSize: 20,
        ...params
      }
    })
  },

  // Lấy hợp mua tôi đã tham gia
  getMyJoinedHemai(params = {}) {
    return request({
      url: '/v1/hemai/my-joined',
      method: 'get',
      params: {
        page: 1,
        pageSize: 20,
        ...params
      }
    })
  },

  // Lấy số dư người dùng
  getUserBalance() {
    return request({
      url: '/v1/user/balance',
      method: 'get'
    })
  },

  // Lấy thống kê cược
  getBetStatistics(params = {}) {
    return request({
      url: '/v1/user/bet-statistics',
      method: 'get',
      params
    })
  },

  // Lấy thông báo
  getAnnouncements(params = {}) {
    return request({
      url: '/v1/lottery/announcements',
      method: 'get',
      params
    })
  },

  // Cược qua khung chat
  submitChatBet(data) {
    return request({
      url: '/v1/lottery/chat-bet',
      method: 'post',
      data
    })
  },

  // Lấy tin nhắn chat
  getChatMessages(lotteryCode, params = {}) {
    return request({
      url: `/v1/lottery/${lotteryCode}/chat-messages`,
      method: 'get',
      params: {
        page: 1,
        pageSize: 50,
        ...params
      }
    })
  },

  // Lấy số lượng người dùng online trong chat
  getChatOnlineCount(lotteryCode) {
    return request({
      url: `/v1/lottery/${lotteryCode}/chat-online`,
      method: 'get'
    })
  },

  // Lấy lịch sử cược
  getBetHistory(params = {}) {
    return request({
      url: `/v1/lottery/${params.lotteryCode || 'xy28'}/bet-history`,
      method: 'get',
      params: {
        timeRange: params.timeRange || 'today',
        page: params.page || 1,
        pageSize: params.pageSize || 50
      }
    })
  },

  // Lấy thống kê cược theo kỳ
  getIssueBetStats(lotteryCode, issue = '') {
    return request({
      url: `/v1/lottery/${lotteryCode}/bet-stats`,
      method: 'get',
      params: { issue }
    })
  },

  // Lấy danh sách cược trong kỳ
  getIssueBets(lotteryCode, issue) {
    return request({
      url: `/v1/lottery/${lotteryCode}/issue-bets`,
      method: 'get',
      params: { issue }
    })
  },

  // Hủy đơn cược
  cancelBet(betId) {
    return request({
      url: `/v1/lottery/bet/${betId}/cancel`,
      method: 'post'
    })
  },

  // Sửa đơn cược
  modifyBet(betId, amount, perAmount) {
    return request({
      url: `/v1/lottery/bet/${betId}/modify`,
      method: 'post',
      data: { amount, perAmount }
    })
  }
}

export default xy28Api
