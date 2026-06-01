/**
 * Clipboard Utility Functions
 *
 * Provides cross-browser clipboard operations with fallback support
 * for copying and reading text from clipboard.
 *
 * @module utils/clipboard
 */

import { showToast } from 'vant'

/**
 * Copy text to clipboard using modern Clipboard API with fallback
 *
 * @param {string} text - Text to copy to clipboard
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Callback on successful copy
 * @param {Function} options.onError - Callback on error
 * @param {string} options.successMessage - Custom success message
 * @param {string} options.errorMessage - Custom error message
 * @returns {Promise<boolean>} - True if copy succeeded, false otherwise
 *
 * @example
 * // Basic usage
 * await copyToClipboard('Hello World')
 *
 * // With custom messages
 * await copyToClipboard(walletAddress, {
 *   successMessage: 'Đã sao chép địa chỉ ví',
 *   errorMessage: 'Không thể sao chép'
 * })
 *
 * // With callbacks
 * await copyToClipboard(text, {
 *   onSuccess: () => console.log('Copied!'),
 *   onError: (err) => console.error('Failed:', err)
 * })
 */
export async function copyToClipboard(text, options = {}) {
  const {
    onSuccess,
    onError,
    successMessage = 'Đã sao chép',
    errorMessage = 'Sao chép thất bại'
  } = options

  // Validate input
  if (!text || typeof text !== 'string') {
    const error = new Error('Invalid text to copy')
    if (onError) onError(error)
    showToast(errorMessage)
    return false
  }

  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)

      if (onSuccess) onSuccess()
      showToast(successMessage)
      return true
    }

    // Fallback for older browsers
    return fallbackCopyToClipboard(text, { onSuccess, onError, successMessage, errorMessage })
  } catch (error) {
    console.error('Clipboard copy failed:', error)

    // Try fallback method
    return fallbackCopyToClipboard(text, { onSuccess, onError, successMessage, errorMessage })
  }
}

/**
 * Fallback method for copying text using execCommand
 *
 * @private
 * @param {string} text - Text to copy
 * @param {Object} options - Configuration options
 * @returns {boolean} - True if copy succeeded
 */
function fallbackCopyToClipboard(text, options = {}) {
  const {
    onSuccess,
    onError,
    successMessage = 'Đã sao chép',
    errorMessage = 'Sao chép thất bại'
  } = options

  try {
    // Create temporary textarea
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    textarea.style.left = '0'
    textarea.style.width = '2em'
    textarea.style.height = '2em'
    textarea.style.padding = '0'
    textarea.style.border = 'none'
    textarea.style.outline = 'none'
    textarea.style.boxShadow = 'none'
    textarea.style.background = 'transparent'
    textarea.style.opacity = '0'

    document.body.appendChild(textarea)

    // Select and copy
    textarea.focus()
    textarea.select()

    // For iOS
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      const range = document.createRange()
      range.selectNodeContents(textarea)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      textarea.setSelectionRange(0, 999999)
    }

    const successful = document.execCommand('copy')
    document.body.removeChild(textarea)

    if (successful) {
      if (onSuccess) onSuccess()
      showToast(successMessage)
      return true
    } else {
      throw new Error('execCommand failed')
    }
  } catch (error) {
    console.error('Fallback copy failed:', error)
    if (onError) onError(error)
    showToast(errorMessage)
    return false
  }
}

/**
 * Read text from clipboard
 *
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Callback with clipboard text
 * @param {Function} options.onError - Callback on error
 * @returns {Promise<string|null>} - Clipboard text or null if failed
 *
 * @example
 * const text = await readFromClipboard()
 * if (text) {
 *   console.log('Clipboard content:', text)
 * }
 *
 * // With callbacks
 * await readFromClipboard({
 *   onSuccess: (text) => console.log('Read:', text),
 *   onError: (err) => console.error('Failed:', err)
 * })
 */
export async function readFromClipboard(options = {}) {
  const { onSuccess, onError } = options

  try {
    // Check if Clipboard API is available
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      throw new Error('Clipboard API not supported')
    }

    const text = await navigator.clipboard.readText()

    if (onSuccess) onSuccess(text)
    return text
  } catch (error) {
    console.error('Clipboard read failed:', error)
    if (onError) onError(error)
    return null
  }
}

/**
 * Check if clipboard operations are supported
 *
 * @returns {Object} - Support status for read and write operations
 *
 * @example
 * const support = checkClipboardSupport()
 * if (support.write) {
 *   // Can copy to clipboard
 * }
 * if (support.read) {
 *   // Can read from clipboard
 * }
 */
export function checkClipboardSupport() {
  return {
    write: !!(navigator.clipboard && navigator.clipboard.writeText) || document.queryCommandSupported('copy'),
    read: !!(navigator.clipboard && navigator.clipboard.readText)
  }
}

/**
 * Copy multiple items with a single toast message
 *
 * @param {Array<{text: string, label: string}>} items - Items to copy
 * @param {string} successMessage - Success message template
 * @returns {Promise<boolean>} - True if all copies succeeded
 *
 * @example
 * await copyMultiple([
 *   { text: 'address123', label: 'Địa chỉ' },
 *   { text: '100.50', label: 'Số tiền' }
 * ], 'Đã sao chép {label}')
 */
export async function copyMultiple(items, successMessage = 'Đã sao chép {label}') {
  if (!Array.isArray(items) || items.length === 0) {
    return false
  }

  try {
    const results = await Promise.all(
      items.map(item =>
        copyToClipboard(item.text, {
          successMessage: successMessage.replace('{label}', item.label),
          onSuccess: null, // Suppress individual toasts
          onError: null
        })
      )
    )

    return results.every(result => result === true)
  } catch (error) {
    console.error('Multiple copy failed:', error)
    return false
  }
}

export default {
  copyToClipboard,
  readFromClipboard,
  checkClipboardSupport,
  copyMultiple
}

// Made with Bob
