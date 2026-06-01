/**
 * Currency utility functions for formatting, parsing, and validating amounts
 * Supports VND, USDT, USD and other currencies
 */

/**
 * Format number with thousand separators
 *
 * @param {number|string} amount - Amount to format
 * @param {number} decimals - Decimal places (default: 0)
 * @returns {string} - Formatted string with thousand separators
 *
 * @example
 * formatMoney(1000) // "1,000"
 * formatMoney(1000.5, 1) // "1,000.5"
 */
export function formatMoney(amount, decimals = 0) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(num) || num === null || num === undefined) {
    return decimals > 0 ? '0.' + '0'.repeat(decimals) : '0'
  }

  // Round to specified decimal places
  const factor = Math.pow(10, decimals)
  const rounded = Math.round(num * factor) / factor

  // Split into integer and decimal parts
  const parts = rounded.toFixed(decimals).split('.')

  // Add thousand separators to integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return parts.join('.')
}

/**
 * Format amount as Vietnamese currency (VND)
 *
 * @param {number|string} amount - Amount to format
 * @param {number} decimals - Decimal places (default: 0 for VND)
 * @returns {string} - Formatted currency string
 *
 * @example
 * formatCurrency(1000) // "1,000"
 * formatCurrency(1000.5, 1) // "1,000.5"
 */
export function formatCurrency(amount, decimals = 0) {
  return formatMoney(amount, decimals)
}

/**
 * Format currency with symbol based on currency type
 *
 * @param {number|string} amount - Amount to format
 * @param {string} currency - Currency code (VND, USDT, USD, etc.)
 * @param {number} decimals - Decimal places (default: 0)
 * @returns {string} - Formatted currency with symbol
 *
 * @example
 * formatCurrencyWithSymbol(1000, 'VND') // "1,000₫"
 * formatCurrencyWithSymbol(1000, 'USDT') // "1,000 USDT"
 * formatCurrencyWithSymbol(1000, 'USD') // "$1,000"
 */
export function formatCurrencyWithSymbol(amount, currency = 'VND', decimals = 0) {
  const formatted = formatMoney(amount, decimals)
  const currencyUpper = (currency || 'VND').toUpperCase()

  switch (currencyUpper) {
    case 'VND':
      return `${formatted}₫`
    case 'USD':
      return `$${formatted}`
    case 'USDT':
      return `${formatted} USDT`
    default:
      return `${formatted} ${currency.toUpperCase()}`
  }
}

/**
 * Format USDT amount
 *
 * @param {number|string} amount - USDT amount
 * @param {number} decimals - Decimal places (default: 2)
 * @returns {string} - Formatted USDT string
 *
 * @example
 * formatUsdt(1000) // "1,000.00"
 * formatUsdt(1000.5, 2) // "1,000.50"
 */
export function formatUsdt(amount, decimals = 2) {
  return formatMoney(amount, decimals)
}

/**
 * Parse currency string to number
 *
 * @param {string|number} value - Currency string to parse
 * @returns {number} - Parsed number value
 *
 * @example
 * parseCurrency("1,234,567.89") // 1234567.89
 * parseCurrency("1,000₫") // 1000
 * parseCurrency("$1,000") // 1000
 */
export function parseCurrency(value) {
  if (typeof value === 'number') {
    return value
  }

  if (!value || typeof value !== 'string') {
    return 0
  }

  // Remove currency symbols and codes
  let cleaned = value
    .replace(/₫/g, '')
    .replace(/\$/g, '')
    .replace(/VND/gi, '')
    .replace(/USDT/gi, '')
    .replace(/USD/gi, '')
    .trim()

  // Remove all commas (thousand separators)
  cleaned = cleaned.replace(/,/g, '')

  // Remove spaces
  cleaned = cleaned.replace(/\s/g, '')

  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Normalize amount input (remove invalid characters and return number)
 *
 * @param {string|number} value - Input value to normalize
 * @param {Object} options - Normalization options
 * @param {boolean} options.allowDecimals - Allow decimal point (default: true)
 * @param {number} options.maxDecimals - Maximum decimal places (default: 2)
 * @returns {number} - Normalized numeric value
 *
 * @example
 * normalizeAmount("123abc456") // 123456
 * normalizeAmount("12.34.56") // 12.34
 * normalizeAmount("12.345", { maxDecimals: 2 }) // 12.34
 */
export function normalizeAmount(value, options = {}) {
  const {
    allowDecimals = true,
    maxDecimals = 2
  } = options

  // Handle number input
  if (typeof value === 'number') {
    if (!allowDecimals) {
      return Math.floor(Math.abs(value)) * (value < 0 ? -1 : 1)
    }
    return roundToDecimal(value, maxDecimals)
  }

  if (!value || typeof value !== 'string') {
    return 0
  }

  // Check for negative sign
  const isNegative = value.trim().startsWith('-')

  // Remove all non-numeric characters except dot
  let normalized = value.replace(/[^\d.]/g, '')

  if (!normalized) {
    return 0
  }

  if (!allowDecimals) {
    // Remove all dots and parse
    normalized = normalized.replace(/\./g, '')
    const num = parseInt(normalized, 10)
    return isNaN(num) ? 0 : (isNegative ? -num : num)
  } else {
    // Keep only first dot
    const parts = normalized.split('.')
    if (parts.length > 2) {
      normalized = parts[0] + '.' + parts.slice(1).join('')
    }

    // Limit decimal places
    if (parts.length === 2 && parts[1].length > maxDecimals) {
      normalized = parts[0] + '.' + parts[1].substring(0, maxDecimals)
    }

    const num = parseFloat(normalized)
    return isNaN(num) ? 0 : (isNegative ? -num : num)
  }
}

/**
 * Convert USDT to VND
 *
 * @param {number|string} usdt - USDT amount
 * @param {number} rate - Exchange rate (VND per USDT)
 * @returns {number} - VND amount
 *
 * @example
 * usdtToVnd(100, 25000) // 2500000
 * usdtToVnd("50.5", 25000) // 1262500
 */
export function usdtToVnd(usdt, rate) {
  const usdtAmount = typeof usdt === 'string' ? parseCurrency(usdt) : usdt
  const exchangeRate = typeof rate === 'string' ? parseCurrency(rate) : rate

  if (isNaN(usdtAmount) || isNaN(exchangeRate)) {
    return 0
  }

  return Math.round(usdtAmount * exchangeRate)
}

/**
 * Convert VND to USDT
 *
 * @param {number|string} vnd - VND amount
 * @param {number} rate - Exchange rate (VND per USDT)
 * @param {number} decimals - Decimal places for result (default: 2)
 * @returns {number} - USDT amount
 *
 * @example
 * vndToUsdt(2500000, 25000) // 100
 * vndToUsdt(1262500, 25000, 2) // 50.5
 */
export function vndToUsdt(vnd, rate, decimals = 2) {
  const vndAmount = typeof vnd === 'string' ? parseCurrency(vnd) : vnd
  const exchangeRate = typeof rate === 'string' ? parseCurrency(rate) : rate

  if (isNaN(vndAmount) || isNaN(exchangeRate) || exchangeRate === 0) {
    return 0
  }

  const usdt = vndAmount / exchangeRate
  return parseFloat(usdt.toFixed(decimals))
}

/**
 * Format amount with compact notation (K, M, B)
 *
 * @param {number|string} amount - Amount to format
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} - Compact formatted string
 *
 * @example
 * formatCompact(1500) // "1.5K"
 * formatCompact(1500000) // "1.5M"
 * formatCompact(999) // "999"
 */
export function formatCompact(amount, decimals = 1) {
  const num = typeof amount === 'string' ? parseCurrency(amount) : amount

  if (isNaN(num)) {
    return '0'
  }

  const absNum = Math.abs(num)
  const sign = num < 0 ? '-' : ''

  if (absNum >= 1000000000) {
    const value = absNum / 1000000000
    return sign + (value % 1 === 0 ? value.toFixed(0) : value.toFixed(decimals)) + 'B'
  }
  if (absNum >= 1000000) {
    const value = absNum / 1000000
    return sign + (value % 1 === 0 ? value.toFixed(0) : value.toFixed(decimals)) + 'M'
  }
  if (absNum >= 1000) {
    const value = absNum / 1000
    return sign + (value % 1 === 0 ? value.toFixed(0) : value.toFixed(decimals)) + 'K'
  }

  return sign + absNum.toString()
}

/**
 * Format amount with compact notation (alias for formatCompact)
 *
 * @param {number|string} amount - Amount to format
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} - Compact formatted string
 */
export function formatCompactCurrency(amount, decimals = 1) {
  return formatCompact(amount, decimals)
}

/**
 * Validate if amount is within range
 *
 * @param {number|string} amount - Amount to validate
 * @param {number} min - Minimum allowed amount
 * @param {number} max - Maximum allowed amount
 * @param {string} fieldName - Field name for error message (default: 'Số tiền')
 * @returns {Object} - Validation result with isValid and error message
 *
 * @example
 * validateAmountRange(5000, 1000, 10000)
 * // { isValid: true, error: null }
 */
export function validateAmountRange(amount, min, max, fieldName = 'Số tiền') {
  const num = typeof amount === 'string' ? parseCurrency(amount) : amount

  if (isNaN(num) || num <= 0) {
    return {
      isValid: false,
      error: 'Số tiền không hợp lệ'
    }
  }

  if (num < min) {
    return {
      isValid: false,
      error: `${fieldName} tối thiểu là ${formatCurrency(min)}`
    }
  }

  if (max !== undefined && num > max) {
    return {
      isValid: false,
      error: `${fieldName} tối đa là ${formatCurrency(max)}`
    }
  }

  return {
    isValid: true,
    error: null
  }
}

/**
 * Calculate percentage of amount
 *
 * @param {number|string} value - Value to calculate percentage from
 * @param {number} total - Total amount (represents 100%)
 * @param {number} decimals - Decimal places for result (default: 2)
 * @returns {number} - Calculated percentage
 *
 * @example
 * calculatePercentage(50, 100) // 50
 * calculatePercentage(1, 3, 2) // 33.33
 */
export function calculatePercentage(value, total, decimals = 2) {
  const num = typeof value === 'string' ? parseCurrency(value) : value
  const totalNum = typeof total === 'string' ? parseCurrency(total) : total

  if (isNaN(num) || isNaN(totalNum) || totalNum === 0) {
    return 0
  }

  const percentage = (num / totalNum) * 100
  return parseFloat(percentage.toFixed(decimals))
}

/**
 * Round amount to nearest step
 *
 * @param {number|string} amount - Amount to round
 * @param {number} step - Step size (default: 1000)
 * @returns {number} - Rounded amount
 *
 * @example
 * roundToStep(12345, 1000) // 12000
 * roundToStep(12678, 1000) // 13000
 */
export function roundToStep(amount, step = 1000) {
  const num = typeof amount === 'string' ? parseCurrency(amount) : amount

  if (isNaN(num) || step <= 0) {
    return 0
  }

  return Math.round(num / step) * step
}

/**
 * Round number to specified decimal places
 *
 * @param {number|string} amount - Amount to round
 * @param {number} decimals - Decimal places (default: 2)
 * @returns {number} - Rounded number
 *
 * @example
 * roundToDecimal(12.345, 2) // 12.35
 * roundToDecimal(12.345) // 12.35
 */
export function roundToDecimal(amount, decimals = 2) {
  const num = typeof amount === 'string' ? parseCurrency(amount) : amount

  if (isNaN(num)) {
    return 0
  }

  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}

export default {
  formatMoney,
  formatCurrency,
  formatCurrencyWithSymbol,
  formatCompactCurrency,
  formatUsdt,
  parseCurrency,
  normalizeAmount,
  usdtToVnd,
  vndToUsdt,
  formatCompact,
  validateAmountRange,
  calculatePercentage,
  roundToStep,
  roundToDecimal
}

// Made with Bob
