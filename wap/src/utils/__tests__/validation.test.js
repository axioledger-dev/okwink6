import { describe, it, expect } from 'vitest'
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateAmount,
  validateMinAmount,
  validateMaxAmount,
  validateAmountRange,
  isValidPhone,
  isValidEmail,
  isValidUsdtTrc20,
  isValidUsdtErc20,
  isValidBankAccount,
  isValidAlipayAccount,
  isValidWechatAccount,
  validateBankAccount,
  validateCryptoAddress,
  validateAccountName,
  validateWithSchema
} from '../validation'

describe('validation.js', () => {
  describe('validateRequired', () => {
    it('should pass for non-empty string', () => {
      const result = validateRequired('test')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should fail for empty string', () => {
      const result = validateRequired('')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('bắt buộc')
    })

    it('should fail for whitespace only', () => {
      const result = validateRequired('   ')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('bắt buộc')
    })

    it('should fail for null', () => {
      const result = validateRequired(null)
      expect(result.isValid).toBe(false)
    })

    it('should fail for undefined', () => {
      const result = validateRequired(undefined)
      expect(result.isValid).toBe(false)
    })

    it('should pass for number zero', () => {
      const result = validateRequired(0)
      expect(result.isValid).toBe(true)
    })

    it('should pass for boolean false', () => {
      const result = validateRequired(false)
      expect(result.isValid).toBe(true)
    })

    it('should use custom field name', () => {
      const result = validateRequired('', 'Email')
      expect(result.error).toContain('Email')
    })
  })

  describe('validateEmail', () => {
    it('should pass for valid email', () => {
      const result = validateEmail('test@example.com')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should pass for email with subdomain', () => {
      const result = validateEmail('user@mail.example.com')
      expect(result.isValid).toBe(true)
    })

    it('should pass for email with plus sign', () => {
      const result = validateEmail('user+tag@example.com')
      expect(result.isValid).toBe(true)
    })

    it('should pass for email with numbers', () => {
      const result = validateEmail('user123@example.com')
      expect(result.isValid).toBe(true)
    })

    it('should fail for missing @', () => {
      const result = validateEmail('testexample.com')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('email')
    })

    it('should fail for missing domain', () => {
      const result = validateEmail('test@')
      expect(result.isValid).toBe(false)
    })

    it('should fail for missing username', () => {
      const result = validateEmail('@example.com')
      expect(result.isValid).toBe(false)
    })

    it('should fail for spaces', () => {
      const result = validateEmail('test @example.com')
      expect(result.isValid).toBe(false)
    })

    it('should fail for empty string', () => {
      const result = validateEmail('')
      expect(result.isValid).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should pass for valid Vietnamese phone', () => {
      expect(validatePhone('0912345678').isValid).toBe(true)
      expect(validatePhone('0987654321').isValid).toBe(true)
    })

    it('should pass for phone with country code', () => {
      expect(validatePhone('+84912345678').isValid).toBe(true)
      expect(validatePhone('84912345678').isValid).toBe(true)
    })

    it('should fail for too short', () => {
      const result = validatePhone('091234')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('số điện thoại')
    })

    it('should fail for too long', () => {
      const result = validatePhone('091234567890123')
      expect(result.isValid).toBe(false)
    })

    it('should fail for non-numeric', () => {
      const result = validatePhone('09123abc78')
      expect(result.isValid).toBe(false)
    })

    it('should fail for empty string', () => {
      const result = validatePhone('')
      expect(result.isValid).toBe(false)
    })

    it('should handle spaces and dashes', () => {
      expect(validatePhone('091-234-5678').isValid).toBe(true)
      expect(validatePhone('091 234 5678').isValid).toBe(true)
    })
  })

  describe('validateAmount', () => {
    it('should pass for valid amount', () => {
      const result = validateAmount(1000)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should pass for string number', () => {
      const result = validateAmount('1000')
      expect(result.isValid).toBe(true)
    })

    it('should pass for formatted number', () => {
      const result = validateAmount('1,000')
      expect(result.isValid).toBe(true)
    })

    it('should fail for zero', () => {
      const result = validateAmount(0)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('lớn hơn 0')
    })

    it('should fail for negative', () => {
      const result = validateAmount(-1000)
      expect(result.isValid).toBe(false)
    })

    it('should fail for non-numeric', () => {
      const result = validateAmount('abc')
      expect(result.isValid).toBe(false)
    })

    it('should fail for empty string', () => {
      const result = validateAmount('')
      expect(result.isValid).toBe(false)
    })

    it('should fail for null', () => {
      const result = validateAmount(null)
      expect(result.isValid).toBe(false)
    })
  })

  describe('validateMinAmount', () => {
    it('should pass when amount >= minimum', () => {
      expect(validateMinAmount(1000, 500).isValid).toBe(true)
      expect(validateMinAmount(500, 500).isValid).toBe(true)
    })

    it('should fail when amount < minimum', () => {
      const result = validateMinAmount(400, 500)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('tối thiểu')
      expect(result.error).toContain('500')
    })

    it('should handle string amounts', () => {
      expect(validateMinAmount('1000', 500).isValid).toBe(true)
      expect(validateMinAmount('400', 500).isValid).toBe(false)
    })

    it('should handle formatted amounts', () => {
      expect(validateMinAmount('1,000', 500).isValid).toBe(true)
    })
  })

  describe('validateMaxAmount', () => {
    it('should pass when amount <= maximum', () => {
      expect(validateMaxAmount(500, 1000).isValid).toBe(true)
      expect(validateMaxAmount(1000, 1000).isValid).toBe(true)
    })

    it('should fail when amount > maximum', () => {
      const result = validateMaxAmount(1500, 1000)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('tối đa')
      expect(result.error).toContain('1,000')
    })

    it('should handle string amounts', () => {
      expect(validateMaxAmount('500', 1000).isValid).toBe(true)
      expect(validateMaxAmount('1500', 1000).isValid).toBe(false)
    })
  })

  describe('validateAmountRange', () => {
    it('should pass when amount is within range', () => {
      const result = validateAmountRange(500, 100, 1000)
      expect(result.isValid).toBe(true)
    })

    it('should fail when below minimum', () => {
      const result = validateAmountRange(50, 100, 1000)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('tối thiểu')
    })

    it('should fail when above maximum', () => {
      const result = validateAmountRange(1500, 100, 1000)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('tối đa')
    })

    it('should accept amount equal to boundaries', () => {
      expect(validateAmountRange(100, 100, 1000).isValid).toBe(true)
      expect(validateAmountRange(1000, 100, 1000).isValid).toBe(true)
    })
  })

  describe('isValidPhone', () => {
    it('should return true for valid Vietnamese phones', () => {
      expect(isValidPhone('0912345678')).toBe(true)
      expect(isValidPhone('0987654321')).toBe(true)
      expect(isValidPhone('0123456789')).toBe(true)
    })

    it('should return true for phones with country code', () => {
      expect(isValidPhone('+84912345678')).toBe(true)
      expect(isValidPhone('84912345678')).toBe(true)
    })

    it('should return false for invalid phones', () => {
      expect(isValidPhone('123')).toBe(false)
      expect(isValidPhone('abc')).toBe(false)
      expect(isValidPhone('')).toBe(false)
    })

    it('should handle formatted phones', () => {
      expect(isValidPhone('091-234-5678')).toBe(true)
      expect(isValidPhone('091 234 5678')).toBe(true)
    })
  })

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@example.com')).toBe(true)
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true)
    })

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('isValidUsdtTrc20', () => {
    it('should return true for valid TRC20 address', () => {
      // TRC20 addresses start with 'T' and are 34 characters
      expect(isValidUsdtTrc20('TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9')).toBe(true)
    })

    it('should return false for invalid TRC20 address', () => {
      expect(isValidUsdtTrc20('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(false) // ERC20
      expect(isValidUsdtTrc20('TN3W4H6')).toBe(false) // Too short
      expect(isValidUsdtTrc20('AN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9')).toBe(false) // Wrong prefix
      expect(isValidUsdtTrc20('')).toBe(false)
    })

    it('should handle case sensitivity', () => {
      expect(isValidUsdtTrc20('tn3w4h6rk2ce4vx9ynfqhwkennhjoxb3m9')).toBe(true)
    })
  })

  describe('isValidUsdtErc20', () => {
    it('should return true for valid ERC20 address', () => {
      // ERC20 addresses start with '0x' and are 42 characters
      expect(isValidUsdtErc20('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(true)
    })

    it('should return false for invalid ERC20 address', () => {
      expect(isValidUsdtErc20('TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9')).toBe(false) // TRC20
      expect(isValidUsdtErc20('0x742d35')).toBe(false) // Too short
      expect(isValidUsdtErc20('742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(false) // Missing 0x
      expect(isValidUsdtErc20('')).toBe(false)
    })

    it('should handle case sensitivity', () => {
      expect(isValidUsdtErc20('0x742d35cc6634c0532925a3b844bc9e7595f0beb')).toBe(true)
    })
  })

  describe('isValidBankAccount', () => {
    it('should return true for valid bank account numbers', () => {
      expect(isValidBankAccount('1234567890')).toBe(true)
      expect(isValidBankAccount('123456789012345')).toBe(true)
    })

    it('should return false for invalid bank account numbers', () => {
      expect(isValidBankAccount('123')).toBe(false) // Too short
      expect(isValidBankAccount('12345678901234567890')).toBe(false) // Too long
      expect(isValidBankAccount('12345abc')).toBe(false) // Contains letters
      expect(isValidBankAccount('')).toBe(false)
    })

    it('should handle formatted account numbers', () => {
      expect(isValidBankAccount('1234-5678-90')).toBe(true)
      expect(isValidBankAccount('1234 5678 90')).toBe(true)
    })
  })

  describe('isValidAlipayAccount', () => {
    it('should return true for valid Alipay accounts', () => {
      expect(isValidAlipayAccount('user@example.com')).toBe(true) // Email
      expect(isValidAlipayAccount('13812345678')).toBe(true) // Phone
    })

    it('should return false for invalid Alipay accounts', () => {
      expect(isValidAlipayAccount('123')).toBe(false)
      expect(isValidAlipayAccount('invalid')).toBe(false)
      expect(isValidAlipayAccount('')).toBe(false)
    })
  })

  describe('isValidWechatAccount', () => {
    it('should return true for valid WeChat IDs', () => {
      expect(isValidWechatAccount('wechat123')).toBe(true)
      expect(isValidWechatAccount('user_name')).toBe(true)
      expect(isValidWechatAccount('user-name')).toBe(true)
    })

    it('should return false for invalid WeChat IDs', () => {
      expect(isValidWechatAccount('ab')).toBe(false) // Too short
      expect(isValidWechatAccount('a'.repeat(25))).toBe(false) // Too long
      expect(isValidWechatAccount('user@name')).toBe(false) // Invalid character
      expect(isValidWechatAccount('')).toBe(false)
    })
  })

  describe('validateBankAccount', () => {
    it('should pass for valid bank account', () => {
      const result = validateBankAccount({
        accountName: 'NGUYEN VAN A',
        bankName: 'Vietcombank',
        accountNumber: '1234567890',
        branch: 'HCM'
      })
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should fail for missing required fields', () => {
      const result = validateBankAccount({
        accountName: '',
        bankName: '',
        accountNumber: '',
        branch: ''
      })
      expect(result.isValid).toBe(false)
      expect(result.errors.accountName).toBeTruthy()
      expect(result.errors.bankName).toBeTruthy()
      expect(result.errors.accountNumber).toBeTruthy()
    })

    it('should fail for invalid account number', () => {
      const result = validateBankAccount({
        accountName: 'NGUYEN VAN A',
        bankName: 'Vietcombank',
        accountNumber: '123', // Too short
        branch: 'HCM'
      })
      expect(result.isValid).toBe(false)
      expect(result.errors.accountNumber).toBeTruthy()
    })

    it('should allow optional branch', () => {
      const result = validateBankAccount({
        accountName: 'NGUYEN VAN A',
        bankName: 'Vietcombank',
        accountNumber: '1234567890'
      })
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateCryptoAddress', () => {
    it('should pass for valid TRC20 address', () => {
      const result = validateCryptoAddress({
        accountName: 'My Wallet',
        network: 'TRC20',
        address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9'
      })
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should pass for valid ERC20 address', () => {
      const result = validateCryptoAddress({
        accountName: 'My Wallet',
        network: 'ERC20',
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
      })
      expect(result.isValid).toBe(true)
    })

    it('should fail for missing required fields', () => {
      const result = validateCryptoAddress({
        accountName: '',
        network: '',
        address: ''
      })
      expect(result.isValid).toBe(false)
      expect(result.errors.accountName).toBeTruthy()
      expect(result.errors.network).toBeTruthy()
      expect(result.errors.address).toBeTruthy()
    })

    it('should fail for invalid TRC20 address', () => {
      const result = validateCryptoAddress({
        accountName: 'My Wallet',
        network: 'TRC20',
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' // ERC20 address
      })
      expect(result.isValid).toBe(false)
      expect(result.errors.address).toContain('TRC20')
    })

    it('should fail for invalid ERC20 address', () => {
      const result = validateCryptoAddress({
        accountName: 'My Wallet',
        network: 'ERC20',
        address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9' // TRC20 address
      })
      expect(result.isValid).toBe(false)
      expect(result.errors.address).toContain('ERC20')
    })

    it('should fail for unsupported network', () => {
      const result = validateCryptoAddress({
        accountName: 'My Wallet',
        network: 'BTC',
        address: 'some-address'
      })
      expect(result.isValid).toBe(false)
      expect(result.errors.network).toBeTruthy()
    })
  })

  describe('validateAccountName', () => {
    it('should pass for valid account name', () => {
      const result = validateAccountName('NGUYEN VAN A')
      expect(result.isValid).toBe(true)
    })

    it('should pass for name with spaces', () => {
      const result = validateAccountName('NGUYEN VAN A B C')
      expect(result.isValid).toBe(true)
    })

    it('should fail for empty name', () => {
      const result = validateAccountName('')
      expect(result.isValid).toBe(false)
    })

    it('should fail for too short name', () => {
      const result = validateAccountName('AB')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('ít nhất 3 ký tự')
    })

    it('should fail for too long name', () => {
      const result = validateAccountName('A'.repeat(101))
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('tối đa 100 ký tự')
    })

    it('should handle Vietnamese characters', () => {
      const result = validateAccountName('NGUYỄN VĂN Á')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateWithSchema', () => {
    const schema = {
      fields: ['name', 'email', 'phone'],
      validation: {
        name: (value) => validateRequired(value, 'Tên'),
        email: (value) => validateEmail(value),
        phone: (value) => validatePhone(value)
      }
    }

    it('should pass when all fields are valid', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '0912345678'
      }
      const result = validateWithSchema(data, schema)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should fail when required fields are missing', () => {
      const data = {
        name: '',
        email: '',
        phone: ''
      }
      const result = validateWithSchema(data, schema)
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBeTruthy()
      expect(result.errors.email).toBeTruthy()
      expect(result.errors.phone).toBeTruthy()
    })

    it('should fail when fields are invalid', () => {
      const data = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '123'
      }
      const result = validateWithSchema(data, schema)
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeTruthy()
      expect(result.errors.phone).toBeTruthy()
    })

    it('should handle partial validation', () => {
      const data = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '0912345678'
      }
      const result = validateWithSchema(data, schema)
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBeUndefined()
      expect(result.errors.email).toBeTruthy()
      expect(result.errors.phone).toBeUndefined()
    })

    it('should handle schema without validation functions', () => {
      const simpleSchema = {
        fields: ['name', 'email']
      }
      const data = {
        name: 'John Doe',
        email: 'john@example.com'
      }
      const result = validateWithSchema(data, simpleSchema)
      expect(result.isValid).toBe(true)
    })

    it('should handle empty schema', () => {
      const emptySchema = {
        fields: []
      }
      const data = {}
      const result = validateWithSchema(data, emptySchema)
      expect(result.isValid).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle Unicode characters in validation', () => {
      expect(validateRequired('测试').isValid).toBe(true)
      expect(validateRequired('テスト').isValid).toBe(true)
      expect(validateRequired('🎉').isValid).toBe(true)
    })

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000)
      expect(validateRequired(longString).isValid).toBe(true)
    })

    it('should handle special characters in amounts', () => {
      expect(validateAmount('1,000.50').isValid).toBe(true)
      expect(validateAmount('1.000,50').isValid).toBe(true) // European format
    })

    it('should handle concurrent validations', () => {
      const results = [
        validateEmail('test1@example.com'),
        validateEmail('test2@example.com'),
        validateEmail('test3@example.com')
      ]
      expect(results.every(r => r.isValid)).toBe(true)
    })

    it('should be case-insensitive where appropriate', () => {
      expect(isValidUsdtTrc20('TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9')).toBe(true)
      expect(isValidUsdtTrc20('tn3w4h6rk2ce4vx9ynfqhwkennhjoxb3m9')).toBe(true)
    })
  })
})

// Made with Bob
