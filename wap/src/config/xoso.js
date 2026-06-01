/**
 * Xổ Số Configuration
 */

export const xosoConfig = {
  // WebSocket configuration
  // TODO_CONVERT_TO_VUE: WebSocket URL should come from environment or config
  websocketUrl: process.env.VITE_WS_URL || 'ws://localhost:8787',

  // Betting configuration
  defaultMinBet: 1000,
  defaultMaxBet: 10000000,

  // Time configuration
  countdownWarningSeconds: 5, // Show warning when countdown <= 5 seconds

  // Result history
  defaultHistoryDays: 365, // 1 year
  defaultPageSize: 20,

  // Max winning multipliers by region
  maxWinMultipliers: {
    'mien-bac': {
      lo2: 27,
      lo2so1k: 27,
      lo2sodau: 23,
      lo3so: 23,
      lo4so: 20
    },
    'mien-nam': {
      lo2: 18,
      lo2so1k: 18,
      lo2sodau: 17,
      lo3so: 17,
      lo4so: 16
    },
    'mien-trung': {
      lo2: 18,
      lo2so1k: 18,
      lo2sodau: 17,
      lo3so: 17,
      lo4so: 16
    }
  },

  // Bet type categories
  betTypeCategories: [
    {
      key: 'baolo',
      title: 'Bao Lô',
      types: [
        { value: 'de', title: 'Đề', tiLe: 0, min: 0 },
        { value: 'lo2', title: 'Lô 2 Số', tiLe: 0, min: 0 },
        { value: 'lo3so', title: 'Lô 3 Số', tiLe: 0, min: 0 },
        { value: 'lo4so', title: 'Lô 4 Số', tiLe: 0, min: 0 },
        { value: 'lo2sodau', title: 'Lô 2 Số Đầu', tiLe: 0, min: 0 },
        { value: 'lo2so1k', title: 'Lô 2 Số 1K', tiLe: 0, min: 0 },
        { value: 'daude', title: 'Đầu Đuôi', tiLe: 0, min: 0 },
        { value: 'dau', title: 'Đầu', tiLe: 0, min: 0 },
        { value: 'duoi', title: 'Đuôi', tiLe: 0, min: 0 },
        { value: '3cang', title: '3 Càng', tiLe: 0, min: 0 },
        { value: '3cangg1', title: '3 Càng G1', tiLe: 0, min: 0 },
        { value: 'cang4', title: '4 Càng', tiLe: 0, min: 0 }
      ]
    },
    {
      key: 'loxien',
      title: 'Lô Xiên',
      types: [
        { value: 'xien2', title: 'Xiên 2', tiLe: 0, min: 0 },
        { value: 'xien3', title: 'Xiên 3', tiLe: 0, min: 0 },
        { value: 'xien4', title: 'Xiên 4', tiLe: 0, min: 0 },
        { value: 'truotxien4', title: 'Trượt Xiên 4', tiLe: 0, min: 0 },
        { value: 'truotxien8', title: 'Trượt Xiên 8', tiLe: 0, min: 0 },
        { value: 'truotxien10', title: 'Trượt Xiên 10', tiLe: 0, min: 0 }
      ]
    },
    {
      key: 'dacsac',
      title: 'Đặc Sắc',
      types: [
        { value: 'ds_tong', title: 'Tổng', tiLe: 0, min: 0 },
        { value: 'ds_sodau', title: 'Số Đầu', tiLe: 0, min: 0 },
        { value: 'ds_sohai', title: 'Số Hai', tiLe: 0, min: 0 },
        { value: 'ds_soba', title: 'Số Ba', tiLe: 0, min: 0 },
        { value: 'ds_sobon', title: 'Số Bốn', tiLe: 0, min: 0 },
        { value: 'ds_sonam', title: 'Số Năm', tiLe: 0, min: 0 }
      ]
    },
    {
      key: 'thuvi',
      title: 'Thú Vị',
      types: [
        { value: 'thuvi', title: 'Thú Vị', tiLe: 0, min: 0 }
      ]
    }
  ],

  // Input type options
  typeEnter: {
    baolo: [
      { value: 0, label: 'Chọn Số' },
      { value: 1, label: 'Nhập Tay' },
      { value: 2, label: 'Chọn Nhanh' }
    ],
    loxien: [
      { value: 0, label: 'Chọn Số' },
      { value: 1, label: 'Nhập Tay' }
    ]
  }
}

export default xosoConfig

// Made with Bob
