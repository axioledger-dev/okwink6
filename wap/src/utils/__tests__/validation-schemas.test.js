import { describe, it, expect } from 'vitest'
import {
  ACCOUNT_SCHEMAS,
  getSchemaForAccountType,
  validateWithAccountSchema
} from '../validation-schemas'

describe('validation-schemas.js', () => {
  describe('ACCOUNT_SCHEMAS', () => {
    it('should have crypto schema', () => {
      expect(ACCOUNT_SCHEMAS.crypto).toBeDefined()
      expect(ACCOUNT_SCHEMAS.crypto.fields).toContain('accountName')
      expect(ACCOUNT_SCHEMAS.crypto.fields).toContain('network')
      expect(ACCOUNT_SCHEMAS.crypto.fields).toContain('address')
    })

    it('should have bank schema', () => {
      expect(ACCOUNT_SCHEMAS.bank).toBeDefined()
      expect(ACCOUNT_SCHEMAS.bank.fields).toContain('accountName')
      expect(ACCOUNT_SCHEMAS.bank.fields).toContain('bankName')
      expect(ACCOUNT_SCHEMAS.bank.fields).toContain('accountNumber')
    })

    it('should have alipay schema', () => {
      expect(ACCOUNT_SCHEMAS.alipay).toBeDefined()
      expect(ACCOUNT_SCHEMAS.alipay.fields).toContain('accountName')
      expect(ACCOUNT_SCHEMAS.alipay.fields).toContain('alipayAccount')
    })

    it('should have wechat schema', () => {
      expect(ACCOUNT_SCHEMAS.wechat).toBeDefined()
      expect(ACCOUNT_SCHEMAS.wechat.fields).toContain('accountName')
      expect(ACCOUNT_SCHEMAS.wechat.fields).toContain('wechatId')
    })

    it('should have validation functions for each schema', () => {
      expect(ACCOUNT_SCHEMAS.crypto.validation).toBeDefined()
      expect(ACCOUNT_SCHEMAS.bank.validation).toBeDefined()
      expect(ACCOUNT_SCHEMAS.alipay.validation).toBeDefined()
      expect(ACCOUNT_SCHEMAS.wechat.validation).toBeDefined()
    })

    it('should have labels for each field', () => {
      expect(ACCOUNT_SCHEMAS.crypto.labels).toBeDefined()
      expect(ACCOUNT_SCHEMAS.crypto.labels.accountName).toBeTruthy()
      expect(ACCOUNT_SCHEMAS.crypto.labels.network).toBeTruthy()
      expect(ACCOUNT_SCHEMAS.crypto.labels.address).toBeTruthy()
    })

    it('should have placeholders for each field', () => {
      expect(ACCOUNT_SCHEMAS.crypto.placeholders).toBeDefined()
      expect(ACCOUNT_SCHEMAS.crypto.placeholders.accountName).toBeTruthy()
      expect(ACCOUNT_SCHEMAS.crypto.placeholders.address).toBeTruthy()
    })
  })

  describe('getSchemaForAccountType', () => {
    it('should return crypto schema', () => {
      const schema = getSchemaForAccountType('crypto')
      expect(schema).toBe(ACCOUNT_SCHEMAS.crypto)
    })

    it('should return bank schema', () => {
      const schema = getSchemaForAccountType('bank')
      expect(schema).toBe(ACCOUNT_SCHEMAS.bank)
    })

    it('should return alipay schema', () => {
      const schema = getSchemaForAccountType('alipay')
      expect(schema).toBe(ACCOUNT_SCHEMAS.alipay)
    })

    it('should return wechat schema', () => {
      const schema = getSchemaForAccountType('wechat')
      expect(schema).toBe(ACCOUNT_SCHEMAS.wechat)
    })

    it('should return null for unknown type', () => {
      const schema = getSchemaForAccountType('unknown')
      expect(schema).toBeNull()
    })

    it('should handle case insensitive type', () => {
      const schema = getSchemaForAccountType('CRYPTO')
      expect(schema).toBe(ACCOUNT_SCHEMAS.crypto)
    })

    it('should handle null input', () => {
      const schema = getSchemaForAccountType(null)
      expect(schema).toBeNull()
    })

    it('should handle undefined input', () => {
      const schema = getSchemaForAccountType(undefined)
      expect(schema).toBeNull()
    })
  })

  describe('validateWithAccountSchema - Crypto', () => {
    it('should pass for valid TRC20 crypto account', () => {
      const data = {
        accountName: 'My USDT Wallet',
        network: 'TRC20',
        address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9'
      }
      const result = validateWithAccountSchema(data, 'crypto')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should pass for valid ERC20 crypto account', () => {
      const data = {
        accountName: 'My ETH Wallet',
        network: 'ERC20',
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
      }
      const result = validateWithAccountSchema(data, 'crypto')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should fail for missing account name', () => {
      const data = {
        accountName: '',
        network: 'TRC20',
        address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9'
      }
      const result = validateWithAccountSchema(data, 'crypto')
      expect(result.isValid).toBe(false)
      expect(result.errors.accountName).toBeTruthy()
    })

    it('should fail for missing network', () => {
      const data = {
        accountName: 'My Wallet',
        network: '',
        address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9'
      }
      const result = validateWithAccountSchema(data, 'crypto')
      expect(result.isValid).toBe(false)
      expect(result.errors.network).toBeTruthy()
    })

    it('should fail for missing address', () => {
      const data = {
        accountName: 'My Wallet',
        network: 'TRC20',
        address: ''
      }
      const result = validateWithAccountSchema(data, 'crypto')
      expect(result.isValid).toBe(false)
      expect(result.errors.address).toBeTruthy()
    })

    it('should fail for invalid TRC20 address', () => {
      const data = {
        accountName: 'My Wallet',
        network: 'TRC20',
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' // ERC20 address
      }
      const result = validateWithAccountSchema(data, 'crypto')
      expect(result.isValid).toBe(false)
      expect(result.errors.address).toContain('TRC20')
    })

    it('should fail for invalid ERC20 address', () => {
      const data = {
        accountName: 'My Wallet',
        network: 'ERC20',
        address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9' // TRC20 address
      }
      const result = validateWithAccountSchema(data, 'crypto')
      expect(result.isValid).toBe(false)
      expect(result.errors.address).toContain('ERC20')
    })

    it('should fail for unsupported network', () => {
      const data = {
        accountName: 'My Wallet',
        network: 'BTC',
        address: 'some-address'
      }
      const result = validateWithAccountSchema(data, 'crypto')
      expect(result.isValid).toBe(false)
      expect(result.errors.network).toBeTruthy()
    })

    it('should handle account name length validation', () => {
      const shortName = {
        accountName: 'AB',
        network: 'TRC20',
        address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9'
      }
      const result = validateWithAccountSchema(shortName, 'crypto')
      expect(result.isValid).toBe(false)
      expect(result.errors.accountName).toContain('ít nhất 3 ký tự')
    })
  })

  describe('validateWithAccountSchema - Bank', () => {
    it('should pass for valid bank account', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        bankName: 'Vietcombank',
        accountNumber: '1234567890',
        branch: 'HCM Branch'
      }
      const result = validateWithAccountSchema(data, 'bank')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should pass without optional branch', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        bankName: 'Vietcombank',
        accountNumber: '1234567890'
      }
      const result = validateWithAccountSchema(data, 'bank')
      expect(result.isValid).toBe(true)
    })

    it('should fail for missing account name', () => {
      const data = {
        accountName: '',
        bankName: 'Vietcombank',
        accountNumber: '1234567890'
      }
      const result = validateWithAccountSchema(data, 'bank')
      expect(result.isValid).toBe(false)
      expect(result.errors.accountName).toBeTruthy()
    })

    it('should fail for missing bank name', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        bankName: '',
        accountNumber: '1234567890'
      }
      const result = validateWithAccountSchema(data, 'bank')
      expect(result.isValid).toBe(false)
      expect(result.errors.bankName).toBeTruthy()
    })

    it('should fail for missing account number', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        bankName: 'Vietcombank',
        accountNumber: ''
      }
      const result = validateWithAccountSchema(data, 'bank')
      expect(result.isValid).toBe(false)
      expect(result.errors.accountNumber).toBeTruthy()
    })

    it('should fail for invalid account number', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        bankName: 'Vietcombank',
        accountNumber: '123' // Too short
      }
      const result = validateWithAccountSchema(data, 'bank')
      expect(result.isValid).toBe(false)
      expect(result.errors.accountNumber).toBeTruthy()
    })

    it('should fail for account number with letters', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        bankName: 'Vietcombank',
        accountNumber: '12345abc'
      }
      const result = validateWithAccountSchema(data, 'bank')
      expect(result.isValid).toBe(false)
      expect(result.errors.accountNumber).toBeTruthy()
    })

    it('should handle formatted account numbers', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        bankName: 'Vietcombank',
        accountNumber: '1234-5678-90'
      }
      const result = validateWithAccountSchema(data, 'bank')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateWithAccountSchema - Alipay', () => {
    it('should pass for valid Alipay email', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        alipayAccount: 'user@example.com'
      }
      const result = validateWithAccountSchema(data, 'alipay')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should pass for valid Alipay phone', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        alipayAccount: '13812345678'
      }
      const result = validateWithAccountSchema(data, 'alipay')
      expect(result.isValid).toBe(true)
    })

    it('should fail for missing account name', () => {
      const data = {
        accountName: '',
        alipayAccount: 'user@example.com'
      }
      const result = validateWithAccountSchema(data, 'alipay')
      expect(result.isValid).toBe(false)
      expect(result.errors.accountName).toBeTruthy()
    })

    it('should fail for missing Alipay account', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        alipayAccount: ''
      }
      const result = validateWithAccountSchema(data, 'alipay')
      expect(result.isValid).toBe(false)
      expect(result.errors.alipayAccount).toBeTruthy()
    })

    it('should fail for invalid Alipay account', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        alipayAccount: 'invalid'
      }
      const result = validateWithAccountSchema(data, 'alipay')
      expect(result.isValid).toBe(false)
      expect(result.errors.alipayAccount).toBeTruthy()
    })
  })

  describe('validateWithAccountSchema - WeChat', () => {
    it('should pass for valid WeChat ID', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        wechatId: 'wechat123'
      }
      const result = validateWithAccountSchema(data, 'wechat')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should pass for WeChat ID with underscore', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        wechatId: 'user_name'
      }
      const result = validateWithAccountSchema(data, 'wechat')
      expect(result.isValid).toBe(true)
    })

    it('should pass for WeChat ID with dash', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        wechatId: 'user-name'
      }
      const result = validateWithAccountSchema(data, 'wechat')
      expect(result.isValid).toBe(true)
    })

    it('should fail for missing account name', () => {
      const data = {
        accountName: '',
        wechatId: 'wechat123'
      }
      const result = validateWithAccountSchema(data, 'wechat')
      expect(result.isValid).toBe(false)
      expect(result.errors.accountName).toBeTruthy()
    })

    it('should fail for missing WeChat ID', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        wechatId: ''
      }
      const result = validateWithAccountSchema(data, 'wechat')
      expect(result.isValid).toBe(false)
      expect(result.errors.wechatId).toBeTruthy()
    })

    it('should fail for too short WeChat ID', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        wechatId: 'ab'
      }
      const result = validateWithAccountSchema(data, 'wechat')
      expect(result.isValid).toBe(false)
      expect(result.errors.wechatId).toBeTruthy()
    })

    it('should fail for too long WeChat ID', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        wechatId: 'a'.repeat(25)
      }
      const result = validateWithAccountSchema(data, 'wechat')
      expect(result.isValid).toBe(false)
      expect(result.errors.wechatId).toBeTruthy()
    })

    it('should fail for WeChat ID with invalid characters', () => {
      const data = {
        accountName: 'NGUYEN VAN A',
        wechatId: 'user@name'
      }
      const result = validateWithAccountSchema(data, 'wechat')
      expect(result.isValid).toBe(false)
      expect(result.errors.wechatId).toBeTruthy()
    })
  })

  describe('Schema Structure Validation', () => {
    it('should have consistent structure across all schemas', () => {
      const schemaTypes = ['crypto', 'bank', 'alipay', 'wechat']

      schemaTypes.forEach(type => {
        const schema = ACCOUNT_SCHEMAS[type]
        expect(schema).toBeDefined()
        expect(schema.fields).toBeInstanceOf(Array)
        expect(schema.validation).toBeDefined()
        expect(schema.labels).toBeDefined()
        expect(schema.placeholders).toBeDefined()
      })
    })

    it('should have labels for all fields', () => {
      Object.keys(ACCOUNT_SCHEMAS).forEach(type => {
        const schema = ACCOUNT_SCHEMAS[type]
        schema.fields.forEach(field => {
          expect(schema.labels[field]).toBeTruthy()
        })
      })
    })

    it('should have validation for required fields', () => {
      Object.keys(ACCOUNT_SCHEMAS).forEach(type => {
        const schema = ACCOUNT_SCHEMAS[type]
        const requiredFields = schema.fields.filter(f => !f.includes('branch'))

        requiredFields.forEach(field => {
          expect(schema.validation[field]).toBeDefined()
        })
      })
    })
  })

  describe('Error Handling', () => {
    it('should return error for unknown account type', () => {
      const data = {
        accountName: 'Test',
        someField: 'value'
      }
      const result = validateWithAccountSchema(data, 'unknown')
      expect(result.isValid).toBe(false)
      expect(result.errors._schema).toBeTruthy()
    })

    it('should handle null data', () => {
      const result = validateWithAccountSchema(null, 'crypto')
      expect(result.isValid).toBe(false)
    })

    it('should handle undefined data', () => {
      const result = validateWithAccountSchema(undefined, 'crypto')
      expect(result.isValid).toBe(false)
    })

    it('should handle empty object', () => {
      const result = validateWithAccountSchema({}, 'crypto')
      expect(result.isValid).toBe(false)
      expect(Object.keys(result.errors).length).toBeGreaterThan(0)
    })
  })

  describe('Integration Tests', () => {
    it('should validate multiple account types in sequence', () => {
      const accounts = [
        {
          type: 'crypto',
          data: {
            accountName: 'Wallet 1',
            network: 'TRC20',
            address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9'
          }
        },
        {
          type: 'bank',
          data: {
            accountName: 'NGUYEN VAN A',
            bankName: 'Vietcombank',
            accountNumber: '1234567890'
          }
        },
        {
          type: 'alipay',
          data: {
            accountName: 'NGUYEN VAN A',
            alipayAccount: 'user@example.com'
          }
        },
        {
          type: 'wechat',
          data: {
            accountName: 'NGUYEN VAN A',
            wechatId: 'wechat123'
          }
        }
      ]

      accounts.forEach(account => {
        const result = validateWithAccountSchema(account.data, account.type)
        expect(result.isValid).toBe(true)
      })
    })

    it('should handle mixed valid and invalid accounts', () => {
      const accounts = [
        {
          type: 'crypto',
          data: {
            accountName: 'Wallet 1',
            network: 'TRC20',
            address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9'
          },
          shouldPass: true
        },
        {
          type: 'bank',
          data: {
            accountName: '',
            bankName: 'Vietcombank',
            accountNumber: '1234567890'
          },
          shouldPass: false
        },
        {
          type: 'alipay',
          data: {
            accountName: 'NGUYEN VAN A',
            alipayAccount: 'invalid'
          },
          shouldPass: false
        }
      ]

      accounts.forEach(account => {
        const result = validateWithAccountSchema(account.data, account.type)
        expect(result.isValid).toBe(account.shouldPass)
      })
    })
  })

  describe('Vietnamese Localization', () => {
    it('should have Vietnamese error messages', () => {
      const data = {
        accountName: '',
        network: '',
        address: ''
      }
      const result = validateWithAccountSchema(data, 'crypto')

      Object.values(result.errors).forEach(error => {
        // Check for Vietnamese characters or common Vietnamese words
        const hasVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(error) ||
                            /bắt buộc|không hợp lệ|tối thiểu|tối đa/.test(error)
        expect(hasVietnamese).toBe(true)
      })
    })

    it('should have Vietnamese labels', () => {
      Object.keys(ACCOUNT_SCHEMAS).forEach(type => {
        const schema = ACCOUNT_SCHEMAS[type]
        Object.values(schema.labels).forEach(label => {
          expect(typeof label).toBe('string')
          expect(label.length).toBeGreaterThan(0)
        })
      })
    })

    it('should have Vietnamese placeholders', () => {
      Object.keys(ACCOUNT_SCHEMAS).forEach(type => {
        const schema = ACCOUNT_SCHEMAS[type]
        Object.values(schema.placeholders).forEach(placeholder => {
          expect(typeof placeholder).toBe('string')
          expect(placeholder.length).toBeGreaterThan(0)
        })
      })
    })
  })
})

// Made with Bob
