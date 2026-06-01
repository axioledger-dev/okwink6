import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  formatCurrency,
  parseCurrency,
  normalizeAmount,
  formatCompactCurrency,
  usdtToVnd,
  vndToUsdt,
  validateAmountRange,
  calculatePercentage,
  formatCurrencyWithSymbol,
  roundToDecimal
} from '../currency'

describe('currency.js', () => {
  describe('formatCurrency', () => {
    it('should format number with thousand separators', () => {
      expect(formatCurrency(1000)).toBe('1,000')
      expect(formatCurrency(1000000)).toBe('1,000,000')
      expect(formatCurrency(123456789)).toBe('123,456,789')
    })

    it('should handle decimal places', () => {
      expect(formatCurrency(1000.5, 1)).toBe('1,000.5')
      expect(formatCurrency(1000.55, 2)).toBe('1,000.55')
      expect(formatCurrency(1000.555, 2)).toBe('1,000.56') // Rounds
    })

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('0')
      expect(formatCurrency(0, 2)).toBe('0.00')
    })

    it('should handle negative numbers', () => {
      expect(formatCurrency(-1000)).toBe('-1,000')
      expect(formatCurrency(-1000.5, 1)).toBe('-1,000.5')
    })

    it('should handle very large numbers', () => {
      expect(formatCurrency(999999999999)).toBe('999,999,999,999')
    })

    it('should handle very small numbers', () => {
      expect(formatCurrency(0.01, 2)).toBe('0.01')
      expect(formatCurrency(0.001, 3)).toBe('0.001')
    })

    it('should handle string input', () => {
      expect(formatCurrency('1000')).toBe('1,000')
      expect(formatCurrency('1000.5', 1)).toBe('1,000.5')
    })

    it('should handle invalid input', () => {
      expect(formatCurrency(null)).toBe('0')
      expect(formatCurrency(undefined)).toBe('0')
      expect(formatCurrency('invalid')).toBe('0')
      expect(formatCurrency(NaN)).toBe('0')
    })

    it('should default to 0 decimal places', () => {
      expect(formatCurrency(1000.999)).toBe('1,001')
    })
  })

  describe('parseCurrency', () => {
    it('should parse formatted currency string', () => {
      expect(parseCurrency('1,000')).toBe(1000)
      expect(parseCurrency('1,000,000')).toBe(1000000)
      expect(parseCurrency('123,456,789')).toBe(123456789)
    })

    it('should parse decimal values', () => {
      expect(parseCurrency('1,000.50')).toBe(1000.5)
      expect(parseCurrency('1,000.99')).toBe(1000.99)
    })

    it('should handle currency symbols', () => {
      expect(parseCurrency('₫1,000')).toBe(1000)
      expect(parseCurrency('$1,000')).toBe(1000)
      expect(parseCurrency('1,000₫')).toBe(1000)
    })

    it('should handle spaces', () => {
      expect(parseCurrency('1 000')).toBe(1000)
      expect(parseCurrency('1 000 000')).toBe(1000000)
    })

    it('should handle negative numbers', () => {
      expect(parseCurrency('-1,000')).toBe(-1000)
      expect(parseCurrency('-1,000.50')).toBe(-1000.5)
    })

    it('should handle plain numbers', () => {
      expect(parseCurrency(1000)).toBe(1000)
      expect(parseCurrency(1000.5)).toBe(1000.5)
    })

    it('should handle invalid input', () => {
      expect(parseCurrency(null)).toBe(0)
      expect(parseCurrency(undefined)).toBe(0)
      expect(parseCurrency('')).toBe(0)
      expect(parseCurrency('invalid')).toBe(0)
    })

    it('should handle mixed formats', () => {
      expect(parseCurrency('1,000.50₫')).toBe(1000.5)
      expect(parseCurrency('₫ 1,000.50')).toBe(1000.5)
    })
  })

  describe('normalizeAmount', () => {
    it('should normalize valid amounts', () => {
      expect(normalizeAmount('1000')).toBe(1000)
      expect(normalizeAmount('1,000')).toBe(1000)
      expect(normalizeAmount('1000.50')).toBe(1000.5)
    })

    it('should remove invalid characters', () => {
      expect(normalizeAmount('1000abc')).toBe(1000)
      expect(normalizeAmount('abc1000')).toBe(1000)
      expect(normalizeAmount('1,0a0b0')).toBe(1000)
    })

    it('should handle multiple decimal points', () => {
      expect(normalizeAmount('1000.50.25')).toBe(1000.5)
    })

    it('should handle negative numbers', () => {
      expect(normalizeAmount('-1000')).toBe(-1000)
      expect(normalizeAmount('-1,000.50')).toBe(-1000.5)
    })

    it('should return 0 for invalid input', () => {
      expect(normalizeAmount(null)).toBe(0)
      expect(normalizeAmount(undefined)).toBe(0)
      expect(normalizeAmount('')).toBe(0)
      expect(normalizeAmount('abc')).toBe(0)
    })

    it('should handle number input', () => {
      expect(normalizeAmount(1000)).toBe(1000)
      expect(normalizeAmount(1000.5)).toBe(1000.5)
    })
  })

  describe('formatCompactCurrency', () => {
    it('should format thousands with K', () => {
      expect(formatCompactCurrency(1000)).toBe('1K')
      expect(formatCompactCurrency(1500)).toBe('1.5K')
      expect(formatCompactCurrency(999)).toBe('999')
    })

    it('should format millions with M', () => {
      expect(formatCompactCurrency(1000000)).toBe('1M')
      expect(formatCompactCurrency(1500000)).toBe('1.5M')
      expect(formatCompactCurrency(999999)).toBe('1000K')
    })

    it('should format billions with B', () => {
      expect(formatCompactCurrency(1000000000)).toBe('1B')
      expect(formatCompactCurrency(1500000000)).toBe('1.5B')
    })

    it('should handle decimal precision', () => {
      expect(formatCompactCurrency(1234, 2)).toBe('1.23K')
      expect(formatCompactCurrency(1234567, 2)).toBe('1.23M')
    })

    it('should handle zero', () => {
      expect(formatCompactCurrency(0)).toBe('0')
    })

    it('should handle negative numbers', () => {
      expect(formatCompactCurrency(-1000)).toBe('-1K')
      expect(formatCompactCurrency(-1000000)).toBe('-1M')
    })

    it('should handle small numbers', () => {
      expect(formatCompactCurrency(100)).toBe('100')
      expect(formatCompactCurrency(999)).toBe('999')
    })
  })

  describe('usdtToVnd', () => {
    it('should convert USDT to VND with default rate', () => {
      const result = usdtToVnd(1)
      expect(result).toBeGreaterThan(0)
      expect(typeof result).toBe('number')
    })

    it('should convert USDT to VND with custom rate', () => {
      expect(usdtToVnd(1, 25000)).toBe(25000)
      expect(usdtToVnd(10, 25000)).toBe(250000)
      expect(usdtToVnd(0.5, 25000)).toBe(12500)
    })

    it('should handle zero', () => {
      expect(usdtToVnd(0, 25000)).toBe(0)
    })

    it('should handle negative amounts', () => {
      expect(usdtToVnd(-1, 25000)).toBe(-25000)
    })

    it('should handle decimal USDT amounts', () => {
      expect(usdtToVnd(1.5, 25000)).toBe(37500)
      expect(usdtToVnd(0.1, 25000)).toBe(2500)
    })

    it('should round to 2 decimal places', () => {
      const result = usdtToVnd(1.555, 25000)
      expect(result).toBe(38875)
    })

    it('should handle invalid input', () => {
      expect(usdtToVnd(null, 25000)).toBe(0)
      expect(usdtToVnd(undefined, 25000)).toBe(0)
      expect(usdtToVnd('invalid', 25000)).toBe(0)
    })
  })

  describe('vndToUsdt', () => {
    it('should convert VND to USDT with default rate', () => {
      const result = vndToUsdt(25000)
      expect(result).toBeGreaterThan(0)
      expect(typeof result).toBe('number')
    })

    it('should convert VND to USDT with custom rate', () => {
      expect(vndToUsdt(25000, 25000)).toBe(1)
      expect(vndToUsdt(250000, 25000)).toBe(10)
      expect(vndToUsdt(12500, 25000)).toBe(0.5)
    })

    it('should handle zero', () => {
      expect(vndToUsdt(0, 25000)).toBe(0)
    })

    it('should handle negative amounts', () => {
      expect(vndToUsdt(-25000, 25000)).toBe(-1)
    })

    it('should round to appropriate decimal places', () => {
      const result = vndToUsdt(25555, 25000)
      expect(result).toBeCloseTo(1.02, 2)
    })

    it('should handle invalid input', () => {
      expect(vndToUsdt(null, 25000)).toBe(0)
      expect(vndToUsdt(undefined, 25000)).toBe(0)
      expect(vndToUsdt('invalid', 25000)).toBe(0)
    })

    it('should handle zero rate gracefully', () => {
      expect(vndToUsdt(25000, 0)).toBe(0)
    })
  })

  describe('validateAmountRange', () => {
    it('should validate amount within range', () => {
      const result = validateAmountRange(5000, 1000, 10000)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should reject amount below minimum', () => {
      const result = validateAmountRange(500, 1000, 10000)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('tối thiểu')
      expect(result.error).toContain('1,000')
    })

    it('should reject amount above maximum', () => {
      const result = validateAmountRange(15000, 1000, 10000)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('tối đa')
      expect(result.error).toContain('10,000')
    })

    it('should accept amount equal to minimum', () => {
      const result = validateAmountRange(1000, 1000, 10000)
      expect(result.isValid).toBe(true)
    })

    it('should accept amount equal to maximum', () => {
      const result = validateAmountRange(10000, 1000, 10000)
      expect(result.isValid).toBe(true)
    })

    it('should handle zero minimum', () => {
      const result = validateAmountRange(5000, 0, 10000)
      expect(result.isValid).toBe(true)
    })

    it('should handle no maximum', () => {
      const result = validateAmountRange(999999, 1000)
      expect(result.isValid).toBe(true)
    })

    it('should reject zero when minimum is positive', () => {
      const result = validateAmountRange(0, 1000, 10000)
      expect(result.isValid).toBe(false)
    })

    it('should handle negative amounts', () => {
      const result = validateAmountRange(-1000, 1000, 10000)
      expect(result.isValid).toBe(false)
    })

    it('should handle string amounts', () => {
      const result = validateAmountRange('5000', 1000, 10000)
      expect(result.isValid).toBe(true)
    })

    it('should handle formatted string amounts', () => {
      const result = validateAmountRange('5,000', 1000, 10000)
      expect(result.isValid).toBe(true)
    })

    it('should reject invalid amounts', () => {
      const result = validateAmountRange('invalid', 1000, 10000)
      expect(result.isValid).toBe(false)
    })

    it('should use custom field name in error message', () => {
      const result = validateAmountRange(500, 1000, 10000, 'Số tiền nạp')
      expect(result.error).toContain('Số tiền nạp')
    })
  })

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(50, 100)).toBe(50)
      expect(calculatePercentage(25, 100)).toBe(25)
      expect(calculatePercentage(100, 100)).toBe(100)
    })

    it('should handle decimal results', () => {
      expect(calculatePercentage(33, 100)).toBe(33)
      expect(calculatePercentage(1, 3)).toBeCloseTo(33.33, 2)
    })

    it('should handle zero total', () => {
      expect(calculatePercentage(50, 0)).toBe(0)
    })

    it('should handle zero value', () => {
      expect(calculatePercentage(0, 100)).toBe(0)
    })

    it('should handle values greater than total', () => {
      expect(calculatePercentage(150, 100)).toBe(150)
    })

    it('should handle negative values', () => {
      expect(calculatePercentage(-50, 100)).toBe(-50)
      expect(calculatePercentage(50, -100)).toBe(-50)
    })

    it('should respect decimal places parameter', () => {
      expect(calculatePercentage(1, 3, 0)).toBe(33)
      expect(calculatePercentage(1, 3, 1)).toBe(33.3)
      expect(calculatePercentage(1, 3, 2)).toBe(33.33)
    })

    it('should handle invalid input', () => {
      expect(calculatePercentage(null, 100)).toBe(0)
      expect(calculatePercentage(50, null)).toBe(0)
      expect(calculatePercentage('invalid', 100)).toBe(0)
    })
  })

  describe('formatCurrencyWithSymbol', () => {
    it('should format VND with symbol', () => {
      expect(formatCurrencyWithSymbol(1000, 'VND')).toBe('1,000₫')
      expect(formatCurrencyWithSymbol(1000000, 'VND')).toBe('1,000,000₫')
    })

    it('should format USDT with symbol', () => {
      expect(formatCurrencyWithSymbol(1000, 'USDT')).toBe('1,000 USDT')
      expect(formatCurrencyWithSymbol(1000.5, 'USDT', 1)).toBe('1,000.5 USDT')
    })

    it('should format USD with symbol', () => {
      expect(formatCurrencyWithSymbol(1000, 'USD')).toBe('$1,000')
      expect(formatCurrencyWithSymbol(1000.5, 'USD', 2)).toBe('$1,000.50')
    })

    it('should handle unknown currency', () => {
      expect(formatCurrencyWithSymbol(1000, 'XYZ')).toBe('1,000 XYZ')
    })

    it('should handle zero', () => {
      expect(formatCurrencyWithSymbol(0, 'VND')).toBe('0₫')
      expect(formatCurrencyWithSymbol(0, 'USDT')).toBe('0 USDT')
    })

    it('should handle negative amounts', () => {
      expect(formatCurrencyWithSymbol(-1000, 'VND')).toBe('-1,000₫')
      expect(formatCurrencyWithSymbol(-1000, 'USD')).toBe('-$1,000')
    })

    it('should respect decimal places', () => {
      expect(formatCurrencyWithSymbol(1000.555, 'VND', 2)).toBe('1,000.56₫')
      expect(formatCurrencyWithSymbol(1000.555, 'USDT', 2)).toBe('1,000.56 USDT')
    })

    it('should handle case insensitive currency', () => {
      expect(formatCurrencyWithSymbol(1000, 'vnd')).toBe('1,000₫')
      expect(formatCurrencyWithSymbol(1000, 'usdt')).toBe('1,000 USDT')
    })
  })

  describe('roundToDecimal', () => {
    it('should round to specified decimal places', () => {
      expect(roundToDecimal(1.555, 2)).toBe(1.56)
      expect(roundToDecimal(1.554, 2)).toBe(1.55)
      expect(roundToDecimal(1.5, 2)).toBe(1.5)
    })

    it('should handle zero decimal places', () => {
      expect(roundToDecimal(1.555, 0)).toBe(2)
      expect(roundToDecimal(1.4, 0)).toBe(1)
    })

    it('should handle negative numbers', () => {
      expect(roundToDecimal(-1.555, 2)).toBe(-1.56)
      expect(roundToDecimal(-1.554, 2)).toBe(-1.55)
    })

    it('should handle zero', () => {
      expect(roundToDecimal(0, 2)).toBe(0)
    })

    it('should handle very small numbers', () => {
      expect(roundToDecimal(0.001, 2)).toBe(0)
      expect(roundToDecimal(0.001, 3)).toBe(0.001)
    })

    it('should handle very large numbers', () => {
      expect(roundToDecimal(999999.555, 2)).toBe(999999.56)
    })

    it('should handle invalid input', () => {
      expect(roundToDecimal(null, 2)).toBe(0)
      expect(roundToDecimal(undefined, 2)).toBe(0)
      expect(roundToDecimal('invalid', 2)).toBe(0)
    })

    it('should default to 2 decimal places', () => {
      expect(roundToDecimal(1.555)).toBe(1.56)
    })
  })

  describe('Edge Cases and Integration', () => {
    it('should handle currency conversion round trip', () => {
      const vnd = 25000
      const rate = 25000
      const usdt = vndToUsdt(vnd, rate)
      const backToVnd = usdtToVnd(usdt, rate)
      expect(backToVnd).toBeCloseTo(vnd, 0)
    })

    it('should handle format and parse round trip', () => {
      const original = 1234567.89
      const formatted = formatCurrency(original, 2)
      const parsed = parseCurrency(formatted)
      expect(parsed).toBeCloseTo(original, 2)
    })

    it('should handle very large amounts', () => {
      const large = 999999999999
      expect(formatCurrency(large)).toBe('999,999,999,999')
      expect(parseCurrency('999,999,999,999')).toBe(large)
    })

    it('should handle very small amounts', () => {
      const small = 0.01
      expect(formatCurrency(small, 2)).toBe('0.01')
      expect(parseCurrency('0.01')).toBe(small)
    })

    it('should handle mixed operations', () => {
      const amount = '1,000.50'
      const parsed = parseCurrency(amount)
      const normalized = normalizeAmount(parsed)
      const formatted = formatCurrency(normalized, 2)
      expect(formatted).toBe('1,000.50')
    })
  })
})

// Made with Bob
