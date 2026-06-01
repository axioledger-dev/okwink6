/**
 * Validation Schemas for Dynamic Forms
 *
 * Provides validation schemas for different account types
 * used in AddAccountDynamicPopup component.
 *
 * @module utils/validation-schemas
 */

import {
  validateRequired,
  isValidPhone,
  isValidUsdtTrc20,
  isValidUsdtErc20,
  isValidBankCard,
  validateLength
} from './validation'

/**
 * Account validation schemas
 *
 * Each schema defines:
 * - fields: Array of field names required for this account type (Production API field names)
 * - validation: Validation functions for each field (Test compatibility layer)
 * - labels: Display labels for fields (Vietnamese)
 * - placeholders: Placeholder text for fields (Vietnamese)
 */
export const ACCOUNT_SCHEMAS = {
  /**
   * Crypto (USDT) account validation schema
   */
  crypto: {
    // Production API field names
    fields: ['accountName', 'network', 'address'],

    labels: {
      accountName: 'Tên tài khoản',
      network: 'Loại mạng',
      address: 'Địa chỉ ví'
    },

    placeholders: {
      accountName: 'Nhập tên tài khoản của bạn',
      network: 'Chọn loại mạng (TRC20/ERC20)',
      address: 'Nhập địa chỉ ví USDT'
    },

    // Validation functions (Test compatibility layer)
    validation: {
      accountName: (value) => {
        if (!value || !value.trim()) {
          return { isValid: false, error: 'Tên tài khoản là bắt buộc' }
        }
        const lengthResult = validateLength(value, {
          min: 3,
          max: 50,
          fieldName: 'Tên tài khoản'
        })
        return lengthResult
      },
      network: (value) => {
        if (!value) {
          return { isValid: false, error: 'Vui lòng chọn loại mạng' }
        }
        if (!['TRC20', 'ERC20'].includes(value.toUpperCase())) {
          return { isValid: false, error: 'Loại mạng không hợp lệ' }
        }
        return { isValid: true, error: null }
      },
      address: (value, formData) => {
        if (!value) {
          return { isValid: false, error: 'Vui lòng nhập địa chỉ ví' }
        }

        const networkType = formData.network || formData.network_type

        if (networkType && networkType.toUpperCase() === 'TRC20') {
          return isValidUsdtTrc20(value)
        } else if (networkType && networkType.toUpperCase() === 'ERC20') {
          return isValidUsdtErc20(value)
        }

        return { isValid: false, error: 'Vui lòng chọn loại mạng trước' }
      }
    },

    // Legacy rules object for backward compatibility
    rules: {
      network_type: {
        required: true,
        enum: ['TRC20', 'ERC20'],
        validator: (value) => {
          if (!value) {
            return { isValid: false, error: 'Vui lòng chọn loại mạng' }
          }
          if (!['TRC20', 'ERC20'].includes(value)) {
            return { isValid: false, error: 'Loại mạng không hợp lệ' }
          }
          return { isValid: true, error: null }
        }
      },
      wallet_address: {
        required: true,
        validator: (value, formData) => {
          if (!value) {
            return { isValid: false, error: 'Vui lòng nhập địa chỉ ví' }
          }

          const networkType = formData.network_type

          if (networkType === 'TRC20') {
            return isValidUsdtTrc20(value)
          } else if (networkType === 'ERC20') {
            return isValidUsdtErc20(value)
          }

          return { isValid: false, error: 'Vui lòng chọn loại mạng trước' }
        }
      }
    }
  },

  /**
   * Bank account validation schema
   */
  bank: {
    // Production API field names
    fields: ['accountName', 'bankName', 'accountNumber', 'branch'],

    labels: {
      accountName: 'Tên chủ tài khoản',
      bankName: 'Ngân hàng',
      accountNumber: 'Số tài khoản',
      branch: 'Chi nhánh'
    },

    placeholders: {
      accountName: 'Nhập tên chủ tài khoản',
      bankName: 'Chọn ngân hàng',
      accountNumber: 'Nhập số tài khoản',
      branch: 'Nhập chi nhánh (không bắt buộc)'
    },

    // Validation functions (Test compatibility layer)
    validation: {
      accountName: (value) => {
        if (!value || !value.trim()) {
          return { isValid: false, error: 'Tên chủ tài khoản là bắt buộc' }
        }

        const lengthResult = validateLength(value, {
          min: 2,
          max: 100,
          fieldName: 'Tên chủ tài khoản'
        })

        if (!lengthResult.isValid) {
          return lengthResult
        }

        // Check for valid characters (letters, spaces, Vietnamese characters)
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/
        if (!nameRegex.test(value.trim())) {
          return {
            isValid: false,
            error: 'Tên chủ tài khoản chỉ được chứa chữ cái'
          }
        }

        return { isValid: true, error: null }
      },
      bankName: (value) => {
        if (!value) {
          return { isValid: false, error: 'Vui lòng chọn ngân hàng' }
        }
        return { isValid: true, error: null }
      },
      accountNumber: (value) => {
        if (!value) {
          return { isValid: false, error: 'Vui lòng nhập số tài khoản' }
        }
        return isValidBankCard(value)
      },
      branch: (value) => {
        if (!value) {
          return { isValid: true, error: null }
        }

        return validateLength(value, {
          max: 200,
          fieldName: 'Chi nhánh'
        })
      }
    },

    // Legacy rules object for backward compatibility
    rules: {
      bank_id: {
        required: true,
        validator: (value) => {
          if (!value) {
            return { isValid: false, error: 'Vui lòng chọn ngân hàng' }
          }
          return { isValid: true, error: null }
        }
      },
      account_number: {
        required: true,
        validator: (value) => {
          if (!value) {
            return { isValid: false, error: 'Vui lòng nhập số tài khoản' }
          }
          return isValidBankCard(value)
        }
      },
      account_name: {
        required: true,
        minLength: 2,
        maxLength: 100,
        validator: (value) => {
          if (!value) {
            return { isValid: false, error: 'Vui lòng nhập tên chủ tài khoản' }
          }

          const lengthResult = validateLength(value, {
            min: 2,
            max: 100,
            fieldName: 'Tên chủ tài khoản'
          })

          if (!lengthResult.isValid) {
            return lengthResult
          }

          // Check for valid characters (letters, spaces, Vietnamese characters)
          const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/
          if (!nameRegex.test(value.trim())) {
            return {
              isValid: false,
              error: 'Tên chủ tài khoản chỉ được chứa chữ cái'
            }
          }

          return { isValid: true, error: null }
        }
      },
      branch: {
        required: false,
        maxLength: 200,
        validator: (value) => {
          if (!value) {
            return { isValid: true, error: null }
          }

          return validateLength(value, {
            max: 200,
            fieldName: 'Chi nhánh'
          })
        }
      }
    }
  },

  /**
   * Alipay account validation schema
   */
  alipay: {
    // Production API field names
    fields: ['accountName', 'alipayAccount'],

    labels: {
      accountName: 'Tên thật',
      alipayAccount: 'Tài khoản Alipay'
    },

    placeholders: {
      accountName: 'Nhập tên thật của bạn',
      alipayAccount: 'Nhập số điện thoại hoặc email Alipay'
    },

    // Validation functions (Test compatibility layer)
    validation: {
      accountName: (value) => {
        if (!value || !value.trim()) {
          return { isValid: false, error: 'Tên thật là bắt buộc' }
        }

        const lengthResult = validateLength(value, {
          min: 2,
          max: 50,
          fieldName: 'Tên thật'
        })

        if (!lengthResult.isValid) {
          return lengthResult
        }

        // Check for valid characters (Chinese, letters, spaces)
        const nameRegex = /^[\u4e00-\u9fa5a-zA-ZÀ-ỹ\s]+$/
        if (!nameRegex.test(value.trim())) {
          return {
            isValid: false,
            error: 'Tên thật chỉ được chứa chữ cái'
          }
        }

        return { isValid: true, error: null }
      },
      alipayAccount: (value) => {
        if (!value) {
          return { isValid: false, error: 'Vui lòng nhập tài khoản Alipay' }
        }

        // Alipay account can be phone or email
        const phoneResult = isValidPhone(value)
        if (phoneResult.isValid) {
          return { isValid: true, error: null }
        }

        // Check if it's a valid email-like format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (emailRegex.test(value.trim())) {
          return { isValid: true, error: null }
        }

        return {
          isValid: false,
          error: 'Tài khoản Alipay phải là số điện thoại hoặc email'
        }
      }
    },

    // Legacy rules object for backward compatibility
    rules: {
      account: {
        required: true,
        validator: (value) => {
          if (!value) {
            return { isValid: false, error: 'Vui lòng nhập tài khoản Alipay' }
          }

          // Alipay account can be phone or email
          const phoneResult = isValidPhone(value)
          if (phoneResult.isValid) {
            return { isValid: true, error: null }
          }

          // Check if it's a valid email-like format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (emailRegex.test(value.trim())) {
            return { isValid: true, error: null }
          }

          return {
            isValid: false,
            error: 'Tài khoản Alipay phải là số điện thoại hoặc email'
          }
        }
      },
      real_name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        validator: (value) => {
          if (!value) {
            return { isValid: false, error: 'Vui lòng nhập tên thật' }
          }

          const lengthResult = validateLength(value, {
            min: 2,
            max: 50,
            fieldName: 'Tên thật'
          })

          if (!lengthResult.isValid) {
            return lengthResult
          }

          // Check for valid characters (Chinese, letters, spaces)
          const nameRegex = /^[\u4e00-\u9fa5a-zA-ZÀ-ỹ\s]+$/
          if (!nameRegex.test(value.trim())) {
            return {
              isValid: false,
              error: 'Tên thật chỉ được chứa chữ cái'
            }
          }

          return { isValid: true, error: null }
        }
      }
    }
  },

  /**
   * WeChat account validation schema
   */
  wechat: {
    // Production API field names
    fields: ['accountName', 'wechatId'],

    labels: {
      accountName: 'Tên thật',
      wechatId: 'Tài khoản WeChat'
    },

    placeholders: {
      accountName: 'Nhập tên thật của bạn',
      wechatId: 'Nhập ID WeChat (6-20 ký tự)'
    },

    // Validation functions (Test compatibility layer)
    validation: {
      accountName: (value) => {
        if (!value || !value.trim()) {
          return { isValid: false, error: 'Tên thật là bắt buộc' }
        }

        const lengthResult = validateLength(value, {
          min: 2,
          max: 50,
          fieldName: 'Tên thật'
        })

        if (!lengthResult.isValid) {
          return lengthResult
        }

        // Check for valid characters (Chinese, letters, spaces)
        const nameRegex = /^[\u4e00-\u9fa5a-zA-ZÀ-ỹ\s]+$/
        if (!nameRegex.test(value.trim())) {
          return {
            isValid: false,
            error: 'Tên thật chỉ được chứa chữ cái'
          }
        }

        return { isValid: true, error: null }
      },
      wechatId: (value) => {
        if (!value) {
          return { isValid: false, error: 'Vui lòng nhập tài khoản WeChat' }
        }

        const lengthResult = validateLength(value, {
          min: 3,
          max: 20,
          fieldName: 'Tài khoản WeChat'
        })

        if (!lengthResult.isValid) {
          return lengthResult
        }

        // WeChat ID: letters, numbers, underscore, hyphen
        const wechatRegex = /^[a-zA-Z0-9_-]+$/
        if (!wechatRegex.test(value.trim())) {
          return {
            isValid: false,
            error: 'Tài khoản WeChat chỉ được chứa chữ cái, số, gạch dưới và gạch ngang'
          }
        }

        return { isValid: true, error: null }
      }
    },

    // Legacy rules object for backward compatibility
    rules: {
      account: {
        required: true,
        minLength: 6,
        maxLength: 20,
        validator: (value) => {
          if (!value) {
            return { isValid: false, error: 'Vui lòng nhập tài khoản WeChat' }
          }

          const lengthResult = validateLength(value, {
            min: 6,
            max: 20,
            fieldName: 'Tài khoản WeChat'
          })

          if (!lengthResult.isValid) {
            return lengthResult
          }

          // WeChat ID: letters, numbers, underscore, hyphen
          const wechatRegex = /^[a-zA-Z0-9_-]+$/
          if (!wechatRegex.test(value.trim())) {
            return {
              isValid: false,
              error: 'Tài khoản WeChat chỉ được chứa chữ cái, số, gạch dưới và gạch ngang'
            }
          }

          return { isValid: true, error: null }
        }
      },
      real_name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        validator: (value) => {
          if (!value) {
            return { isValid: false, error: 'Vui lòng nhập tên thật' }
          }

          const lengthResult = validateLength(value, {
            min: 2,
            max: 50,
            fieldName: 'Tên thật'
          })

          if (!lengthResult.isValid) {
            return lengthResult
          }

          // Check for valid characters (Chinese, letters, spaces)
          const nameRegex = /^[\u4e00-\u9fa5a-zA-ZÀ-ỹ\s]+$/
          if (!nameRegex.test(value.trim())) {
            return {
              isValid: false,
              error: 'Tên thật chỉ được chứa chữ cái'
            }
          }

          return { isValid: true, error: null }
        }
      }
    }
  }
}

/**
 * Get schema for account type
 *
 * @param {string} accountType - Account type
 * @returns {Object|null} - Schema object or null
 */
export function getSchemaForAccountType(accountType) {
  if (!accountType) return null
  const type = accountType.toLowerCase()
  return ACCOUNT_SCHEMAS[type] || null
}

/**
 * Validate with account schema
 *
 * @param {Object} data - Form data to validate
 * @param {string} accountType - Account type
 * @returns {Object} - Validation result with errors object
 */
export function validateWithAccountSchema(data, accountType) {
  // Handle null/undefined data
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: { _form: 'Dữ liệu không hợp lệ' }
    }
  }

  const schema = getSchemaForAccountType(accountType)

  if (!schema) {
    return {
      isValid: false,
      errors: { _schema: 'Loại tài khoản không hợp lệ' }
    }
  }

  const errors = {}
  let isValid = true

  // Validate each field using validation functions
  for (const field of schema.fields) {
    const validator = schema.validation[field]
    const value = data[field]

    if (validator && typeof validator === 'function') {
      const validatorResult = validator(value, data)
      if (validatorResult && !validatorResult.isValid) {
        errors[field] = validatorResult.error
        isValid = false
      }
    }
  }

  return {
    isValid,
    errors
  }
}

/**
 * Validate form data against schema (legacy function name)
 *
 * @param {string} accountType - Account type (crypto, bank, alipay, wechat)
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation result with errors object
 *
 * @example
 * const result = validateAccountForm('crypto', {
 *   network_type: 'TRC20',
 *   wallet_address: 'TXYZaPdpiekhXRpQD5Uu7JPwqvgEWZNxon'
 * })
 * // { isValid: true, errors: {} }
 */
export function validateAccountForm(accountType, formData) {
  return validateWithAccountSchema(formData, accountType)
}

/**
 * Get field labels for account type
 *
 * @param {string} accountType - Account type
 * @returns {Object} - Field labels
 *
 * @example
 * getFieldLabels('crypto')
 * // { network_type: 'Loại mạng', wallet_address: 'Địa chỉ ví' }
 */
export function getFieldLabels(accountType) {
  const schema = getSchemaForAccountType(accountType)
  return schema ? schema.labels : {}
}

/**
 * Get required fields for account type
 *
 * @param {string} accountType - Account type
 * @returns {Array} - Array of required field names
 *
 * @example
 * getRequiredFields('bank')
 * // ['bank_id', 'account_number', 'account_name']
 */
export function getRequiredFields(accountType) {
  const schema = getSchemaForAccountType(accountType)
  if (!schema) return []

  return schema.fields.filter(field => {
    const rule = schema.rules[field]
    return rule && rule.required
  })
}

/**
 * Get all fields for account type
 *
 * @param {string} accountType - Account type
 * @returns {Array} - Array of all field names
 *
 * @example
 * getAllFields('alipay')
 * // ['account', 'real_name']
 */
export function getAllFields(accountType) {
  const schema = getSchemaForAccountType(accountType)
  return schema ? schema.fields : []
}

/**
 * Check if account type is valid
 *
 * @param {string} accountType - Account type to check
 * @returns {boolean} - True if valid account type
 *
 * @example
 * isValidAccountType('crypto') // true
 * isValidAccountType('invalid') // false
 */
export function isValidAccountType(accountType) {
  if (!accountType) return false
  return accountType.toLowerCase() in ACCOUNT_SCHEMAS
}

/**
 * Get all supported account types
 *
 * @returns {Array} - Array of account type names
 *
 * @example
 * getSupportedAccountTypes()
 * // ['crypto', 'bank', 'alipay', 'wechat']
 */
export function getSupportedAccountTypes() {
  return Object.keys(ACCOUNT_SCHEMAS)
}

// Backward compatibility alias
export const accountValidationSchemas = ACCOUNT_SCHEMAS

export default {
  ACCOUNT_SCHEMAS,
  accountValidationSchemas,
  getSchemaForAccountType,
  validateWithAccountSchema,
  validateAccountForm,
  getFieldLabels,
  getRequiredFields,
  getAllFields,
  isValidAccountType,
  getSupportedAccountTypes
}

// Made with Bob
