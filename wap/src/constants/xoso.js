/**
 * Xổ Số (Lottery) Constants
 */

// Xổ Số Regions
export const XOSO_REGIONS = {
  MIEN_BAC: 'mien-bac',
  MIEN_TRUNG: 'mien-trung',
  MIEN_NAM: 'mien-nam'
}

// Xổ Số Region Names
export const XOSO_REGION_NAMES = {
  'mien-bac': 'Miền Bắc',
  'mien-trung': 'Miền Trung',
  'mien-nam': 'Miền Nam'
}

// Xổ Số Types (Thể loại)
export const XOSO_TYPES = {
  XSMB: 'xsmb',  // Xổ số miền Bắc
  XSMT: 'xsmt',  // Xổ số miền Trung
  XSMN: 'xsmn'   // Xổ số miền Nam
}

// Bet Types (Loại cược)
export const BET_TYPES = {
  // Bao lô
  DE: 'de',                    // Đề
  LO2: 'lo2',                  // Lô 2 số
  LO3SO: 'lo3so',              // Lô 3 số
  LO4SO: 'lo4so',              // Lô 4 số
  LO2SODAU: 'lo2sodau',        // Lô 2 số đầu
  LO2SO1K: 'lo2so1k',          // Lô 2 số 1k
  DAUDE: 'daude',              // Đầu đuôi
  DAU: 'dau',                  // Đầu
  DUOI: 'duoi',                // Đuôi
  CANG3: '3cang',              // 3 càng
  CANG3G1: '3cangg1',          // 3 càng giải 1
  CANG4: 'cang4',              // 4 càng
  DE7: 'de7',                  // Đề 7
  DE1: 'de1',                  // Đề 1
  DAUDE1: 'daude1',            // Đầu đuôi 1
  
  // Lô xiên
  XIEN2: 'xien2',              // Xiên 2
  XIEN3: 'xien3',              // Xiên 3
  XIEN4: 'xien4',              // Xiên 4
  TRUOTXIEN4: 'truotxien4',    // Trượt xiên 4
  TRUOTXIEN8: 'truotxien8',    // Trượt xiên 8
  TRUOTXIEN10: 'truotxien10',  // Trượt xiên 10
  
  // Đặc sắc
  DS_TONG: 'ds_tong',          // Tổng
  DS_SODAU: 'ds_sodau',        // Số đầu
  DS_SOHAI: 'ds_sohai',        // Số hai
  DS_SOBA: 'ds_soba',          // Số ba
  DS_SOBON: 'ds_sobon',        // Số bốn
  DS_SONAM: 'ds_sonam',        // Số năm
  
  // Thú vị
  THUVI: 'thuvi'               // Thú vị
}

// Bet Type Names (Vietnamese)
export const BET_TYPE_NAMES = {
  de: 'Đề',
  lo2: 'Lô 2 Số',
  lo3so: 'Lô 3 Số',
  lo4so: 'Lô 4 Số',
  lo2sodau: 'Lô 2 Số Đầu',
  lo2so1k: 'Lô 2 Số 1K',
  daude: 'Đầu Đuôi',
  dau: 'Đầu',
  duoi: 'Đuôi',
  '3cang': '3 Càng',
  '3cangg1': '3 Càng Giải 1',
  cang4: '4 Càng',
  de7: 'Đề 7',
  de1: 'Đề 1',
  daude1: 'Đầu Đuôi 1',
  xien2: 'Xiên 2',
  xien3: 'Xiên 3',
  xien4: 'Xiên 4',
  truotxien4: 'Trượt Xiên 4',
  truotxien8: 'Trượt Xiên 8',
  truotxien10: 'Trượt Xiên 10',
  ds_tong: 'Tổng',
  ds_sodau: 'Số Đầu',
  ds_sohai: 'Số Hai',
  ds_soba: 'Số Ba',
  ds_sobon: 'Số Bốn',
  ds_sonam: 'Số Năm',
  thuvi: 'Thú Vị'
}

// Kéo đôi options
export const KEO_DOI_OPTIONS = [
  { label: 'Tài', value: 'tai' },
  { label: 'Xỉu', value: 'xiu' },
  { label: 'Chẵn', value: 'chan' },
  { label: 'Lẻ', value: 'le' }
]

// Prize levels (Giải thưởng)
export const PRIZE_LEVELS = {
  GDB: 'gdb',   // Giải đặc biệt
  G1: 'g1',     // Giải nhất
  G2: 'g2',     // Giải nhì
  G3: 'g3',     // Giải ba
  G4: 'g4',     // Giải tư
  G5: 'g5',     // Giải năm
  G6: 'g6',     // Giải sáu
  G7: 'g7',     // Giải bảy
  G8: 'g8'      // Giải tám
}

// Prize level names
export const PRIZE_LEVEL_NAMES = {
  gdb: 'Giải Đặc Biệt',
  g1: 'Giải Nhất',
  g2: 'Giải Nhì',
  g3: 'Giải Ba',
  g4: 'Giải Tư',
  g5: 'Giải Năm',
  g6: 'Giải Sáu',
  g7: 'Giải Bảy',
  g8: 'Giải Tám'
}

// Bet status
export const BET_STATUS = {
  PENDING: 0,      // Chờ mở giải
  SETTLED: 1,      // Đã thanh toán
  WIN: 'win',      // Thắng
  LOSE: 'lose'     // Thua
}

// Input types
export const INPUT_TYPES = {
  SELECT: 0,       // Chọn số
  MANUAL: 1,       // Nhập tay
  QUICK: 2         // Chọn nhanh
}

// Max selections for xiên types
export const MAX_SELECTIONS = {
  xien2: 2,
  xien3: 3,
  xien4: 4,
  truotxien4: 4,
  truotxien8: 8,
  truotxien10: 10
}

// Quick bet amounts (VND)
export const QUICK_BET_AMOUNTS = [
  { label: '+1k', value: 1000 },
  { label: '+5k', value: 5000 },
  { label: '+10k', value: 10000 },
  { label: '+50k', value: 50000 },
  { label: '+100k', value: 100000 },
  { label: '+500k', value: 500000 },
  { label: '+1M', value: 1000000 },
  { label: '+5M', value: 5000000 },
  { label: '+10M', value: 10000000 },
  { label: '+50M', value: 50000000 }
]

// Default minimum bet
export const DEFAULT_MIN_BET = 1000

/**
 * Get bet type name
 * @param {string} type - Bet type code
 * @returns {string} Bet type name
 */
export function getBetTypeName(type) {
  return BET_TYPE_NAMES[type] || type
}

/**
 * Get prize level name
 * @param {string} level - Prize level code
 * @returns {string} Prize level name
 */
export function getPrizeLevelName(level) {
  return PRIZE_LEVEL_NAMES[level] || level
}

/**
 * Get region name
 * @param {string} region - Region code
 * @returns {string} Region name
 */
export function getRegionName(region) {
  return XOSO_REGION_NAMES[region] || region
}

/**
 * Check if bet type is xiên type
 * @param {string} type - Bet type
 * @returns {boolean}
 */
export function isXienType(type) {
  return ['xien2', 'xien3', 'xien4', 'truotxien4', 'truotxien8', 'truotxien10'].includes(type)
}

/**
 * Check if bet type is đặc sắc type
 * @param {string} type - Bet type
 * @returns {boolean}
 */
export function isDacSacType(type) {
  return type.startsWith('ds_')
}

// Default export
export default {
  XOSO_REGIONS,
  XOSO_REGION_NAMES,
  XOSO_TYPES,
  BET_TYPES,
  BET_TYPE_NAMES,
  KEO_DOI_OPTIONS,
  PRIZE_LEVELS,
  PRIZE_LEVEL_NAMES,
  BET_STATUS,
  INPUT_TYPES,
  MAX_SELECTIONS,
  QUICK_BET_AMOUNTS,
  DEFAULT_MIN_BET,
  getBetTypeName,
  getPrizeLevelName,
  getRegionName,
  isXienType,
  isDacSacType
}

// Made with Bob
