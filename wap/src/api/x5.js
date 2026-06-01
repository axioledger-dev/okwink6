import request from './request'

// Danh sách các loại xổ số 11x5
export const X5_LOTTERIES = {
  'gd11x5': 'Quảng Đông 11 chọn 5',
  'jx11x5': 'Giang Tây 11 chọn 5',
  'sd11x5': 'Sơn Đông 11 chọn 5',
  'sh11x5': 'Thượng Hải 11 chọn 5',
  'ah11x5': 'An Huy 11 chọn 5',
  'yf11x5': '11 chọn 5 (1 phút)',
  'sf11x5': '11 chọn 5 (3 phút)',
  'wf11x5': '11 chọn 5 (5 phút)'
}

// Bản đồ ánh xạ ID cách chơi
const PLAY_ID_MAP = {
  'rx1': 'x5rx1z1',
  'rx2': 'x5rx2z2',
  'rx3': 'x5rx3z3',
  'rx4': 'x5rx4z4',
  'rx5': 'x5rx5z5',
  'rx6': 'x5rx6z5',
  'rx7': 'x5rx7z5',
  'rx8': 'x5rx8z5',

  'rx1_ds': 'x5rxds1z1',
  'rx2_ds': 'x5rxds2z2',
  'rx3_ds': 'x5rxds3z3',
  'rx4_ds': 'x5rxds4z4',
  'rx5_ds': 'x5rxds5z5',
  'rx6_ds': 'x5rxds6z5',
  'rx7_ds': 'x5rxds7z5',
  'rx8_ds': 'x5rxds8z5',

  'rx2_dt': 'x5rxdt2z2',
  'rx3_dt': 'x5rxdt3z3',
  'rx4_dt': 'x5rxdt4z4',
  'rx5_dt': 'x5rxdt5z5',
  'rx6_dt': 'x5rxdt6z5',
  'rx7_dt': 'x5rxdt7z5',
  'rx8_dt': 'x5rxdt8z5',

  'niuniu': 'x5niuniu_',
  'dds': 'x5dds_',
  'czw': 'x5czw_',
  'bbc': 'x5bbc_',
  'lh_touwei': 'x5lh_tw_',
  'lh_q2': 'x5lh_q2_',
  'lh_h2': 'x5lh_h2_',

  'q3_zhix': 'x5qsfs',
  'q3_zhix_ds': 'x5qsds',
  'q3_zux': 'x5qszx',
  'q3_zux_ds': 'x5qszxds',
  'q3_zux_dt': 'x5qsdt',
  'q3_zhix_hz': 'x5qszhixhz',
  'q3_zux_hz': 'x5qszuxhz',
  'q3_zhix_hw': 'x5qszhixhw',
  'q3_zux_hw': 'x5qszuxhw',

  'z3_zhix': 'x5zsfs',
  'z3_zhix_ds': 'x5zsds',
  'z3_zux': 'x5zszx',
  'z3_zux_ds': 'x5zszxds',
  'z3_zux_dt': 'x5zsdt',
  'z3_zhix_hz': 'x5zszhixhz',
  'z3_zux_hz': 'x5zszuxhz',

  'h3_zhix': 'x5hsfs',
  'h3_zhix_ds': 'x5hsds',
  'h3_zux': 'x5hszx',
  'h3_zux_ds': 'x5hszxds',
  'h3_zux_dt': 'x5hsdt',
  'h3_zhix_hz': 'x5hszhixhz',
  'h3_zux_hz': 'x5hszuxhz',

  'q2_zhix': 'x5qefs',
  'q2_zhix_ds': 'x5qeds',
  'q2_zux': 'x5qezx',
  'q2_zux_ds': 'x5qezxds',
  'q2_zux_dt': 'x5qedt',
  'q2_zhix_hz': 'x5qezhixhz',
  'q2_zux_hz': 'x5qezuxhz',
  'q2_zhix_hw': 'x5qezhixhw',
  'q2_zux_hw': 'x5qezuxhw',

  'h2_zhix': 'x5hefs',
  'h2_zhix_ds': 'x5heds',
  'h2_zux': 'x5hezx',
  'h2_zux_ds': 'x5hezxds',
  'h2_zux_dt': 'x5hedt',
  'h2_zhix_hz': 'x5hezhixhz',
  'h2_zux_hz': 'x5hezuxhz',

  'bdw': 'x5bdwqs',       // Mặc định không định vị 3 số đầu
  'bdw_q3': 'x5bdwqs',
  'bdw_z3': 'x5bdwzs',
  'bdw_h3': 'x5bdwhs',

  'dwd': 'x5dwd',
}

// Chuyển đổi ID cách chơi từ frontend sang backend
function convertPlayId(frontendId, lotteryCode = 'gd11x5') {
  if (PLAY_ID_MAP[frontendId]) {
    return PLAY_ID_MAP[frontendId]
  }

  const rxMatch = frontendId.match(/^(?:x5)?rx[_]?(\d+)$/)
  if (rxMatch) {
    const n = parseInt(rxMatch[1])
    const winCount = n <= 4 ? n : 5
    return `x5rx${n}z${winCount}`
  }

  if (frontendId.startsWith('x5')) {
    return frontendId
  }

  return `x5${frontendId}`
}

// Hàm tính tổ hợp
function combination(n, r) {
  if (r > n || r < 0) return 0
  if (r === 0 || r === n) return 1

  let result = 1
  for (let i = 0; i < r; i++) {
    result = result * (n - i) / (i + 1)
  }
  return Math.round(result)
}

export const x5Api = {
  // Lấy thông tin kỳ quay
  getInfo(lotteryCode = 'gd11x5') {
    return request({
      url: `/v1/lottery/${lotteryCode}/expect`,
      method: 'get'
    }).then(res => {
      if (res.code === 0 && res.data) {
        return {
          code: 0,
          data: {
            currFullExpect: res.data.currFullExpect || res.data.expect || '',
            lastFullExpect: res.data.lastFullExpect || '',
            remainTime: Math.floor((res.data.remainMs || res.data.remainTime * 1000 || 0) / 1000),
            closeSeconds: res.data.closeSeconds || 10
          }
        }
      }
      return res
    })
  },

  // Lấy kết quả kỳ gần nhất
  getLastResult(lotteryCode = 'gd11x5') {
    return request({
      url: `/v1/lottery/${lotteryCode}/last-result`,
      method: 'get'
    }).then(res => {
      if (res.code === 0 && res.data) {
        let opencode = res.data.opencode || res.data.openCode || res.data.kjhm || ''
        if (Array.isArray(opencode)) {
          opencode = opencode.join(',')
        }
        return {
          code: 0,
          data: {
            expect: res.data.expect || res.data.qihao || '',
            opencode: opencode,
            opentime: res.data.opentime || res.data.openTime || ''
          }
        }
      }
      return res
    })
  },

  // Lấy lịch sử quay thưởng
  getHistory(lotteryCode = 'gd11x5', params = {}) {
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
        const list = Array.isArray(res.data) ? res.data : (res.data.list || res.data.data || [])
        return {
          code: 0,
          data: {
            list: list.map(item => {
              let opencode = item.opencode || item.openCode || item.kjhm || ''
              if (Array.isArray(opencode)) {
                opencode = opencode.join(',')
              }
              return {
                expect: item.expect || item.qihao || '',
                opencode: opencode,
                opentime: item.opentime || item.openTime || ''
              }
            })
          }
        }
      }
      return res
    })
  },

  // Lấy danh sách các cách chơi
  getPlays(lotteryCode = 'gd11x5') {
    return request({
      url: `/v1/lottery/${lotteryCode}/play-types`,
      method: 'get'
    })
  },

  // Gửi đơn cược
  async submitBet(data) {
    const playId = data.playId
    const tzcode = data.tzcode || data.numbers?.join(',') || ''

    const funPlayPrefixes = ['niuniu', 'dds', 'czw', 'bbc', 'lh_touwei', 'lh_q2', 'lh_h2']
    const isFunPlay = funPlayPrefixes.includes(playId)

    if (isFunPlay && tzcode.includes(',')) {
      const selections = tzcode.split(',')
      const basePlayId = PLAY_ID_MAP[playId] || `x5${playId}_`
      const singleAmount = (data.amount || data.totalAmount) / selections.length

      let successCount = 0
      let failCount = 0
      let lastError = null

      for (const sel of selections) {
        let suffix = sel
        if (sel === '龙') suffix = 'long'
        else if (sel === '虎') suffix = 'hu'

        const finalPlayId = basePlayId + suffix

        const postData = {
          lotteryname: data.lotteryCode,
          expect: data.expect,
          playid: finalPlayId,
          tzcode: sel,
          amount: singleAmount,
          beishu: data.multiplier || 1,
          mode: data.mode || 1,
          itemcount: 1,
          yjf: '元',
          ishemai: data.isHemai ? 1 : 0,
          nums: 1
        }

        try {
          const res = await request({
            url: '/v1/bet/submit',
            method: 'post',
            data: postData
          })
          if (res.code === 0) successCount++
          else {
            failCount++
            lastError = res
          }
        } catch (e) {
          failCount++
          lastError = { code: 500, msg: e.message }
        }
      }

      if (failCount === 0) {
        return { code: 0, msg: `Đặt cược thành công, tổng ${successCount} đơn` }
      } else if (successCount === 0) {
        return lastError || { code: 500, msg: 'Đặt cược thất bại' }
      } else {
        return { code: 0, msg: `Thành công một phần: ${successCount} thành công, ${failCount} thất bại` }
      }
    }

    let backendPlayId = convertPlayId(playId, data.lotteryCode)

    if (isFunPlay) {
      let suffix = tzcode
      if (tzcode === '龙') suffix = 'long'
      else if (tzcode === '虎') suffix = 'hu'
      backendPlayId = backendPlayId + suffix
    }

    const postData = {
      lotteryname: data.lotteryCode,
      expect: data.expect,
      playid: backendPlayId,
      tzcode: tzcode,
      amount: data.amount || data.totalAmount,
      beishu: data.multiplier || 1,
      mode: data.mode || 1,
      itemcount: data.betCount || 1,
      yjf: '元',
      ishemai: data.isHemai ? 1 : 0,
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
        expect = expectRes.data.currFullExpect || ''
      }
    } catch (e) {
      console.error('Lấy kỳ quay thất bại:', e)
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
          amount: bet.amount,
          multiplier: bet.multiplier || 1,
          mode: bet.mode || 1,
          betCount: bet.betCount || 1
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
      return { code: 0, msg: `Đặt cược thành công, tổng ${successCount} đơn`, data: results }
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
  },

  // Tính số lượng đơn cược
  calculateBetCount(playType, selectedNums, options = {}) {
    const count = selectedNums.length

    switch(playType) {
      case 'rx1': return count
      case 'rx2': return combination(count, 2)
      case 'rx3': return combination(count, 3)
      case 'rx4': return combination(count, 4)
      case 'rx5': return combination(count, 5)
      case 'rx6': return combination(count, 6)
      case 'rx7': return combination(count, 7)
      case 'rx8': return combination(count, 8)

      case 'zx_q1': return count
      case 'zx_q2': {
        const w = options.wan?.length || 0
        const q = options.qian?.length || 0
        return w * q
      }
      case 'zx_q3': {
        const w = options.wan?.length || 0
        const q = options.qian?.length || 0
        const b = options.bai?.length || 0
        return w * q * b
      }

      case 'zu_q2': return combination(count, 2)
      case 'zu_q3': return combination(count, 3)

      case 'dt_rx2':
      case 'dt_rx3':
      case 'dt_rx4':
      case 'dt_rx5': {
        const danCount = options.dan?.length || 0
        const tuoCount = options.tuo?.length || 0
        const needTuo = parseInt(playType.slice(-1)) - danCount
        return combination(tuoCount, needTuo)
      }

      default: return count
    }
  },

  // Xây dựng mã cược (tzcode)
  buildTzcode(playType, selectedNums, options = {}) {
    if (['rx1','rx2','rx3','rx4','rx5','rx6','rx7','rx8','zu_q2','zu_q3'].includes(playType)) {
      return selectedNums.map(n => n.toString().padStart(2, '0')).join(',')
    }

    if (playType.startsWith('zx_')) {
      const wan = (options.wan || []).map(n => n.toString().padStart(2, '0')).join(',')
      const qian = (options.qian || []).map(n => n.toString().padStart(2, '0')).join(',')
      const bai = (options.bai || []).map(n => n.toString().padStart(2, '0')).join(',')

      if (playType === 'zx_q2') {
        return `${wan}|${qian}`
      }
      return `${wan}|${qian}|${bai}`
    }

    if (playType.startsWith('dt_')) {
      const dan = (options.dan || []).map(n => n.toString().padStart(2, '0')).join(',')
      const tuo = (options.tuo || []).map(n => n.toString().padStart(2, '0')).join(',')
      return `${dan}$${tuo}`
    }

    return selectedNums.join(',')
  }
}

export default x5Api
