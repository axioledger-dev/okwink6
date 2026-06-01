import request from './request'

// Danh sách các loại hình xổ số PK10
export const PK10_LOTTERIES = {
  'bjpk10': 'Bắc Kinh PK10',
  'dfpk10': 'Đài Loan PK10',
  'pk101': 'Đua xe 1 phút',
  'pk103': 'Đua xe 3 phút',
  'pk105': 'Đua xe 5 phút',
  'xyft': 'Phi thuyền may mắn'
}

// Bản đồ ánh xạ ID cách chơi
const PLAY_ID_MAP = {
  'gy_da': 'pk10gyhd',
  'gy_xiao': 'pk10gyhx',
  'gy_dan': 'pk10gyhdd',
  'gy_shuang': 'pk10gyhss',

  'gy_3': 'pk10gyhz3',
  'gy_4': 'pk10gyhz4',
  'gy_5': 'pk10gyhz5',
  'gy_6': 'pk10gyhz6',
  'gy_7': 'pk10gyhz7',
  'gy_8': 'pk10gyhz8',
  'gy_9': 'pk10gyhz9',
  'gy_10': 'pk10gyhz10',
  'gy_11': 'pk10gyhz11',
  'gy_12': 'pk10gyhz12',
  'gy_13': 'pk10gyhz13',
  'gy_14': 'pk10gyhz14',
  'gy_15': 'pk10gyhz15',
  'gy_16': 'pk10gyhz16',
  'gy_17': 'pk10gyhz17',
  'gy_18': 'pk10gyhz18',
  'gy_19': 'pk10gyhz19',
}

// Hàm chuyển đổi ID cách chơi từ Frontend sang Backend
function convertPlayId(frontendId) {
  if (PLAY_ID_MAP[frontendId]) {
    return PLAY_ID_MAP[frontendId]
  }

  // Khớp ID tổng số quán quân
  const gyhzMatch = frontendId.match(/^gyhz_(\d+)$/)
  if (gyhzMatch) {
    return `pk10gyhz${gyhzMatch[1]}`
  }

  // Khớp ID so tài (Đại/Tiểu/Đơn/Song/Long/Hổ)
  const mcMatch = frontendId.match(/^(\d+)_(da|xiao|dan|shuang|long|hu)$/)
  if (mcMatch) {
    return `pk10mc${mcMatch[1]}${mcMatch[2]}`
  }

  // Khớp ID con số cụ thể
  const numMatch = frontendId.match(/^(\d+)_(\d+)$/)
  if (numMatch) {
    return `pk10mc${numMatch[1]}hm${numMatch[2]}`
  }

  // Khớp nhóm tiền nhị, tiền tam...
  if (['qian5', 'qian4', 'qian3', 'qian2', 'qian1'].includes(frontendId)) {
    return `bjpk10${frontendId}`
  }

  return frontendId
}

export const pk10Api = {

  // Lấy thông tin kỳ quay thưởng hiện tại
  getInfo(lotteryCode = 'bjpk10') {
    return request({
      url: `/v1/lottery/${lotteryCode}/expect`,
      method: 'get'
    }).then(res => {
      if (res.code === 0 && res.data) {
        return {
          code: 0,
          data: {
            currFullExpect: res.data.currFullExpect,
            lastFullExpect: res.data.lastFullExpect,
            remainTime: Math.floor(res.data.remainMs / 1000),
            closeSeconds: 10
          }
        }
      }
      return res
    })
  },

  // Lấy kết quả kỳ gần nhất
  getLastResult(lotteryCode = 'bjpk10') {
    return request({
      url: `/v1/lottery/${lotteryCode}/last-result`,
      method: 'get'
    })
  },

  // Lấy lịch sử quay thưởng
  getHistory(lotteryCode = 'bjpk10', params = {}) {
    return request({
      url: `/v1/lottery/${lotteryCode}/history`,
      method: 'get',
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        ...params
      }
    }).then(res => {
      if (res.code === 0 && res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.list || res.data.data || []);
        return {
          code: 0,
          data: list.map(item => {
            let opencode = item.opencode || item.openCode || item.kjhm || '';
            if (Array.isArray(opencode)) {
              opencode = opencode.join(',');
            }
            return {
              expect: item.expect || item.qihao || '',
              opencode: opencode,
              opentime_format: item.opentime || item.openTime || item.kaijiang_time || ''
            };
          })
        }
      }
      return res
    })
  },

  // Lấy danh sách cách chơi
  getPlays(lotteryCode = 'bjpk10') {
    return request({
      url: `/v1/lottery/${lotteryCode}/play-types`,
      method: 'get'
    })
  },

  // Gửi đơn cược đơn lẻ
  submitBet(data) {
    const backendPlayId = convertPlayId(data.playId)

    const postData = {
      lotteryname: data.lotteryCode,
      expect: data.expect,
      playid: backendPlayId,
      tzcode: data.tzcode || data.selections?.join(',') || '',
      amount: data.totalAmount || data.amount,
      beishu: data.multiplier || 1,
      mode: 1,
      itemcount: data.betCount || 1,
      yjf: '元',
      ishemai: 0,
      nums: data.betCount || 1
    }

    return request({
      url: '/v1/bet/submit',
      method: 'post',
      data: postData
    })
  },

  // Gửi nhiều đơn cược cùng lúc
  async submitBets(lotteryCode, bets) {
    let expect = ''
    try {
      const expectRes = await this.getInfo(lotteryCode)
      if (expectRes.code === 0 && expectRes.data) {
        expect = expectRes.data.currFullExpect || expectRes.data.expect || ''
      }
    } catch (e) {
      console.error('Lấy kỳ quay thưởng thất bại:', e)
    }

    if (!expect) {
      return { code: 400, msg: 'Không thể lấy kỳ quay hiện tại' }
    }

    const results = []
    let successCount = 0
    let failCount = 0

    for (const bet of bets) {
      try {
        const res = await this.submitBet({
          lotteryCode,
          expect,
          playId: bet.playId,
          tzcode: bet.tzcode,
          totalAmount: bet.amount,
          multiplier: 1,  // Cách chơi tín dụng cố định là 1
          betCount: 1
        })
        if (res.code === 0) {
          successCount++
        } else {
          failCount++
        }
        results.push({ success: res.code === 0, bet, res })
      } catch (err) {
        failCount++
        results.push({ success: false, bet, error: err })
      }
    }

    if (failCount === 0) {
      return { code: 0, msg: `Đặt cược thành công, tổng cộng ${successCount} đơn`, data: results }
    } else if (successCount === 0) {
      return { code: 500, msg: results[0]?.res?.msg || 'Đặt cược thất bại', data: results }
    } else {
      return { code: 200, msg: `Thành công một phần: ${successCount} thành công, ${failCount} thất bại`, data: results }
    }
  },

  // Lấy số dư người dùng
  getUserBalance() {
    return request({
      url: '/v1/user/balance',
      method: 'get'
    })
  }
}

export default pk10Api
