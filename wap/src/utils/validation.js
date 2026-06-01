/**
 * Validation Utility Functions
 *
 * Provides validation helpers for forms, inputs, and data
 * commonly used in the application.
 *
 * @module utils/validation
 */

/**
 * Validate if value is not empty
 *
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {Object} - Validation result
 *
 * @example
 * validateRequired('test', 'Username')
 * // { isValid: true, error: null }
 *
 * validateRequired('', 'Username')
 * // { isValid: false, error: 'Username là bắt buộc' }
 */
export function validateRequired(value, fieldName = 'Trường này') {
  // Fix Bug 1: Check whitespace
  const isEmpty = value === null ||
                  value === undefined ||
                  value === '' ||
                  (typeof value === 'string' && value.trim() === '') ||
                  (Array.isArray(value) && value.length === 0)

  return {
    isValid: !isEmpty,
    error: isEmpty ? `${fieldName} là bắt buộc` : null
  }
}

/**
 * Validate email (wrapper function for tests)
 */
export function validateEmail(email) {
  const result = isValidEmail(email)
  return result
}

/**
 * Validate phone (wrapper function for tests)
 */
export function validatePhone(phone) {
  const result = isValidPhone(phone)
  return result
}

/**
 * Validate Vietnamese phone number
 *
 * @param {string} phone - Phone number to validate
 * @returns {Object} - Validation result
 *
 * @example
 * isValidPhone('0912345678') // { isValid: true, error: null }
 * isValidPhone('123') // { isValid: false, error: '...' }
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return {
      isValid: false,
      error: 'Số điện thoại không hợp lệ'
    }
  }

  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '')

  // Vietnamese phone patterns:
  // - Mobile: 09x, 08x, 07x, 05x, 03x (10 digits)
  // - With country code: +84 or 84
  const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)\d{8}$/

  const isValid = phoneRegex.test(cleaned)

  return {
    isValid,
    error: isValid ? null : 'Số điện thoại không đúng định dạng'
  }
}

/**
 * Validate email address
 *
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result
 *
 * @example
 * isValidEmail('test@example.com') // { isValid: true, error: null }
 * isValidEmail('invalid') // { isValid: false, error: '...' }
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email không hợp lệ'
    }
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const isValid = emailRegex.test(email.trim())

  return {
    isValid,
    error: isValid ? null : 'Email không đúng định dạng'
  }
}

/**
 * Validate USDT TRC20 address
 *
 * @param {string} address - TRC20 address to validate
 * @returns {Object} - Validation result
 *
 * @example
 * isValidUsdtTrc20('TXYZaPdpiekhXRpQD5Uu7JPwqvgEWZNxon')
 * // { isValid: true, error: null }
 */
export function isValidUsdtTrc20(address) {
  if (!address || typeof address !== 'string') {
    return {
      isValid: false,
      error: 'Địa chỉ ví không hợp lệ'
    }
  }

  // Fix Bug 3: Case-insensitive with /i flag
  // TRC20 addresses start with 'T' and are 34 characters long
  const trc20Regex = /^T[A-Za-z1-9]{33}$/i

  const isValid = trc20Regex.test(address.trim())

  return {
    isValid,
    error: isValid ? null : 'Địa chỉ ví TRC20 không đúng định dạng'
  }
}

/**
 * Validate USDT ERC20 address
 *
 * @param {string} address - ERC20 address to validate
 * @returns {Object} - Validation result
 *
 * @example
 * isValidUsdtErc20('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')
 * // { isValid: true, error: null }
 */
export function isValidUsdtErc20(address) {
  if (!address || typeof address !== 'string') {
    return {
      isValid: false,
      error: 'Địa chỉ ví không hợp lệ'
    }
  }

  // Fix Bug 3: Case-insensitive already supported by [a-fA-F]
  // ERC20 addresses start with '0x' and are 42 characters long
  const erc20Regex = /^0x[a-fA-F0-9]{40}$/

  const isValid = erc20Regex.test(address.trim())

  return {
    isValid,
    error: isValid ? null : 'Địa chỉ ví ERC20 không đúng định dạng'
  }
}

/**
 * Validate bank card number (Vietnamese banks)
 *
 * @param {string} cardNumber - Bank card number to validate
 * @returns {Object} - Validation result
 *
 * @example
 * isValidBankCard('1234567890123456')
 * // { isValid: true, error: null }
 */
export function isValidBankCard(cardNumber) {
  if (!cardNumber || typeof cardNumber !== 'string') {
    return {
      isValid: false,
      error: 'Số thẻ không hợp lệ'
    }
  }

  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '')

  // Vietnamese bank cards are typically 9-19 digits
  const cardRegex = /^\d{9,19}$/

  const isValid = cardRegex.test(cleaned)

  return {
    isValid,
    error: isValid ? null : 'Số thẻ ngân hàng không đúng định dạng'
  }
}

/**
 * Validate amount within range
 *
 * @param {number|string} amount - Amount to validate
 * @param {number} min - Minimum allowed amount
 * @param {number} max - Maximum allowed amount
 * @param {string} fieldName - Field name for error message
 * @returns {Object} - Validation result
 *
 * @example
 * validateAmount(5000, 1000, 10000, 'Số tiền nạp')
 * // { isValid: true, error: null }
 */
export function validateAmount(amount, min, max, fieldName = 'Số tiền') {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount

  // Fix Bug 2: Better error message for zero
  if (isNaN(num)) {
    return {
      isValid: false,
      error: `${fieldName} không hợp lệ`
    }
  }

  if (num <= 0) {
    return {
      isValid: false,
      error: `${fieldName} phải lớn hơn 0`
    }
  }

  if (min !== undefined && num < min) {
    return {
      isValid: false,
      error: `${fieldName} tối thiểu là ${min.toLocaleString('vi-VN')}₫`
    }
  }

  if (max !== undefined && num > max) {
    return {
      isValid: false,
      error: `${fieldName} tối đa là ${max.toLocaleString('vi-VN')}₫`
    }
  }

  return {
    isValid: true,
    error: null
  }
}

/**
 * Validate minimum amount
 */
export function validateMinAmount(amount, min) {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount

  if (isNaN(num)) {
    return {
      isValid: false,
      error: 'Số tiền không hợp lệ'
    }
  }

  const isValid = num >= min
  return {
    isValid,
    error: isValid ? null : `Số tiền tối thiểu là ${min.toLocaleString('vi-VN')}`
  }
}

/**
 * Validate maximum amount
 */
export function validateMaxAmount(amount, max) {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount

  if (isNaN(num)) {
    return {
      isValid: false,
      error: 'Số tiền không hợp lệ'
    }
  }

  const isValid = num <= max
  return {
    isValid,
    error: isValid ? null : `Số tiền tối đa là ${max.toLocaleString('vi-VN')}`
  }
}

/**
 * Validate amount range
 */
export function validateAmountRange(amount, min, max) {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount

  if (isNaN(num)) {
    return {
      isValid: false,
      error: 'Số tiền không hợp lệ'
    }
  }

  if (num < min) {
    return {
      isValid: false,
      error: `Số tiền tối thiểu là ${min.toLocaleString('vi-VN')}`
    }
  }

  if (num > max) {
    return {
      isValid: false,
      error: `Số tiền tối đa là ${max.toLocaleString('vi-VN')}`
    }
  }

  return {
    isValid: true,
    error: null
  }
}

/**
 * Validate bank account number
 */
export function isValidBankAccount(accountNumber) {
  if (!accountNumber || typeof accountNumber !== 'string') {
    return false
  }

  // Remove spaces and dashes
  const cleaned = accountNumber.replace(/[\s-]/g, '')

  // Vietnamese bank accounts are typically 6-20 digits
  const bankRegex = /^\d{6,20}$/

  return bankRegex.test(cleaned)
}

/**
 * Validate Alipay account (email or phone)
 */
export function isValidAlipayAccount(account) {
  if (!account || typeof account !== 'string') {
    return false
  }

  // Check if it's a valid email
  const emailResult = isValidEmail(account)
  if (emailResult.isValid) {
    return true
  }

  // Check if it's a valid phone (Chinese phone pattern)
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(account.replace(/[\s-]/g, ''))
}

/**
 * Validate WeChat account
 */
export function isValidWechatAccount(account) {
  if (!account || typeof account !== 'string') {
    return false
  }

  const trimmed = account.trim()

  // WeChat ID: 6-20 characters, letters, numbers, underscore, hyphen
  // Must start with letter
  const wechatRegex = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/

  return wechatRegex.test(trimmed)
}

/**
 * Validate bank account data
 */
export function validateBankAccount(data) {
  const errors = {}
  let isValid = true

  // Validate account name
  if (!data.accountName || data.accountName.trim() === '') {
    errors.accountName = 'Tên chủ tài khoản là bắt buộc'
    isValid = false
  }

  // Validate bank name
  if (!data.bankName || data.bankName.trim() === '') {
    errors.bankName = 'Tên ngân hàng là bắt buộc'
    isValid = false
  }

  // Validate account number
  if (!data.accountNumber || data.accountNumber.trim() === '') {
    errors.accountNumber = 'Số tài khoản là bắt buộc'
    isValid = false
  } else if (!isValidBankAccount(data.accountNumber)) {
    errors.accountNumber = 'Số tài khoản không hợp lệ'
    isValid = false
  }

  return {
    isValid,
    errors
  }
}

/**
 * Validate crypto address data
 */
export function validateCryptoAddress(data) {
  const errors = {}
  let isValid = true

  // Validate account name
  if (!data.accountName || data.accountName.trim() === '') {
    errors.accountName = 'Tên ví là bắt buộc'
    isValid = false
  }

  // Validate network
  if (!data.network || data.network.trim() === '') {
    errors.network = 'Loại mạng là bắt buộc'
    isValid = false
  } else if (!['TRC20', 'ERC20'].includes(data.network.toUpperCase())) {
    errors.network = 'Loại mạng không hợp lệ'
    isValid = false
  }

  // Validate address
  if (!data.address || data.address.trim() === '') {
    errors.address = 'Địa chỉ ví là bắt buộc'
    isValid = false
  } else if (data.network) {
    const network = data.network.toUpperCase()
    if (network === 'TRC20') {
      const result = isValidUsdtTrc20(data.address)
      if (!result.isValid) {
        errors.address = result.error
        isValid = false
      }
    } else if (network === 'ERC20') {
      const result = isValidUsdtErc20(data.address)
      if (!result.isValid) {
        errors.address = result.error
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
 * Validate account name
 */
export function validateAccountName(name) {
  if (!name || typeof name !== 'string') {
    return {
      isValid: false,
      error: 'Tên tài khoản là bắt buộc'
    }
  }

  const trimmed = name.trim()

  if (trimmed.length < 3) {
    return {
      isValid: false,
      error: 'Tên tài khoản phải có ít nhất 3 ký tự'
    }
  }

  if (trimmed.length > 100) {
    return {
      isValid: false,
      error: 'Tên tài khoản không được vượt quá 100 ký tự'
    }
  }

  return {
    isValid: true,
    error: null
  }
}

/**
 * Validate with schema
 */
export function validateWithSchema(data, schema) {
  const errors = {}
  let isValid = true

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]

    // Required check
    if (rules.required) {
      const result = validateRequired(value, rules.label || field)
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
        continue
      }
    }

    // Skip other validations if value is empty and not required
    if (!value && !rules.required) {
      continue
    }

    // Custom validator
    if (rules.validator && typeof rules.validator === 'function') {
      const result = rules.validator(value, data)
      if (result && !result.isValid) {
        errors[field] = result.error
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
 * Validate string length
 *
 * @param {string} value - String to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum length
 * @param {number} options.max - Maximum length
 * @param {string} options.fieldName - Field name for error message
 * @returns {Object} - Validation result
 *
 * @example
 * validateLength('test', { min: 2, max: 10 })
 * // { isValid: true, error: null }
 */
export function validateLength(value, options = {}) {
  const {
    min = 0,
    max = Infinity,
    fieldName = 'Trường này'
  } = options

  if (!value || typeof value !== 'string') {
    return {
      isValid: false,
      error: `${fieldName} không hợp lệ`
    }
  }

  const length = value.trim().length

  if (length < min) {
    return {
      isValid: false,
      error: `${fieldName} phải có ít nhất ${min} ký tự`
    }
  }

  if (length > max) {
    return {
      isValid: false,
      error: `${fieldName} không được vượt quá ${max} ký tự`
    }
  }

  return {
    isValid: true,
    error: null
  }
}

/**
 * Validate password strength
 *
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 6)
 * @param {boolean} options.requireNumber - Require at least one number
 * @param {boolean} options.requireLetter - Require at least one letter
 * @param {boolean} options.requireSpecial - Require special character
 * @returns {Object} - Validation result with strength score
 *
 * @example
 * validatePassword('Test123!', { minLength: 6, requireNumber: true })
 * // { isValid: true, error: null, strength: 'strong' }
 */
export function validatePassword(password, options = {}) {
  const {
    minLength = 6,
    requireNumber = false,
    requireLetter = false,
    requireSpecial = false
  } = options

  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      error: 'Mật khẩu không hợp lệ',
      strength: 'weak'
    }
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Mật khẩu phải có ít nhất ${minLength} ký tự`,
      strength: 'weak'
    }
  }

  if (requireNumber && !/\d/.test(password)) {
    return {
      isValid: false,
      error: 'Mật khẩu phải chứa ít nhất một số',
      strength: 'weak'
    }
  }

  if (requireLetter && !/[a-zA-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Mật khẩu phải chứa ít nhất một chữ cái',
      strength: 'weak'
    }
  }

  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt',
      strength: 'weak'
    }
  }

  // Calculate strength
  let strength = 'weak'
  let score = 0

  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++

  if (score >= 4) strength = 'strong'
  else if (score >= 3) strength = 'medium'

  return {
    isValid: true,
    error: null,
    strength
  }
}

/**
 * Validate username format
 *
 * @param {string} username - Username to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 3)
 * @param {number} options.maxLength - Maximum length (default: 20)
 * @returns {Object} - Validation result
 *
 * @example
 * validateUsername('user123')
 * // { isValid: true, error: null }
 */
export function validateUsername(username, options = {}) {
  const {
    minLength = 3,
    maxLength = 20
  } = options

  if (!username || typeof username !== 'string') {
    return {
      isValid: false,
      error: 'Tên đăng nhập không hợp lệ'
    }
  }

  const trimmed = username.trim()

  if (trimmed.length < minLength || trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `Tên đăng nhập phải từ ${minLength} đến ${maxLength} ký tự`
    }
  }

  // Allow letters, numbers, underscore, hyphen
  const usernameRegex = /^[a-zA-Z0-9_-]+$/

  if (!usernameRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Tên đăng nhập chỉ được chứa chữ cái, số, gạch dưới và gạch ngang'
    }
  }

  return {
    isValid: true,
    error: null
  }
}

/**
 * Validate multiple fields at once
 *
 * @param {Object} data - Data object to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} - Validation results with errors object
 *
 * @example
 * validateFields(
 *   { username: 'test', email: 'test@example.com' },
 *   {
 *     username: { required: true, minLength: 3 },
 *     email: { required: true, type: 'email' }
 *   }
 * )
 * // { isValid: true, errors: {} }
 */
export function validateFields(data, rules) {
  const errors = {}
  let isValid = true

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field]

    // Required check
    if (fieldRules.required) {
      const result = validateRequired(value, fieldRules.label || field)
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
        continue
      }
    }

    // Skip other validations if value is empty and not required
    if (!value && !fieldRules.required) {
      continue
    }

    // Type-specific validation
    if (fieldRules.type === 'email') {
      const result = isValidEmail(value)
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
      }
    } else if (fieldRules.type === 'phone') {
      const result = isValidPhone(value)
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
      }
    } else if (fieldRules.type === 'trc20') {
      const result = isValidUsdtTrc20(value)
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
      }
    } else if (fieldRules.type === 'erc20') {
      const result = isValidUsdtErc20(value)
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
      }
    } else if (fieldRules.type === 'bankCard') {
      const result = isValidBankCard(value)
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
      }
    }

    // Length validation
    if (fieldRules.minLength || fieldRules.maxLength) {
      const result = validateLength(value, {
        min: fieldRules.minLength,
        max: fieldRules.maxLength,
        fieldName: fieldRules.label || field
      })
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
      }
    }

    // Custom validator
    if (fieldRules.validator && typeof fieldRules.validator === 'function') {
      const result = fieldRules.validator(value, data)
      if (result && !result.isValid) {
        errors[field] = result.error
        isValid = false
      }
    }
  }

  return {
    isValid,
    errors
  }
}

export default {
  validateRequired,
  validateEmail,
  validatePhone,
  isValidPhone,
  isValidEmail,
  isValidUsdtTrc20,
  isValidUsdtErc20,
  isValidBankCard,
  isValidBankAccount,
  isValidAlipayAccount,
  isValidWechatAccount,
  validateAmount,
  validateMinAmount,
  validateMaxAmount,
  validateAmountRange,
  validateLength,
  validatePassword,
  validateUsername,
  validateFields,
  validateBankAccount,
  validateCryptoAddress,
  validateAccountName,
  validateWithSchema
}

// Made with Bob
