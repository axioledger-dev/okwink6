import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  copyToClipboard,
  readFromClipboard,
  checkClipboardSupport,
  copyMultiple
} from '../clipboard'

describe('clipboard.js', () => {
  let mockClipboard
  let mockExecCommand
  let consoleErrorSpy

  beforeEach(() => {
    // Mock console.error to suppress error logs in tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Mock modern Clipboard API
    mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue('test content'),
      write: vi.fn().mockResolvedValue(undefined)
    }

    // Mock execCommand for fallback
    mockExecCommand = vi.fn().mockReturnValue(true)
    document.execCommand = mockExecCommand

    // Mock document.createElement for textarea fallback
    const mockTextarea = {
      value: '',
      select: vi.fn(),
      setSelectionRange: vi.fn(),
      style: {},
      remove: vi.fn()
    }
    vi.spyOn(document, 'createElement').mockReturnValue(mockTextarea)
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {})
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    consoleErrorSpy.mockRestore()
  })

  describe('copyToClipboard', () => {
    it('should copy text using modern Clipboard API', async () => {
      // Setup
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })

      const onSuccess = vi.fn()
      const text = 'Hello World'

      // Execute
      await copyToClipboard(text, { onSuccess })

      // Assert
      expect(mockClipboard.writeText).toHaveBeenCalledWith(text)
      expect(onSuccess).toHaveBeenCalledWith(text)
    })

    it('should use fallback when Clipboard API is not available', async () => {
      // Setup - Remove Clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true
      })

      const onSuccess = vi.fn()
      const text = 'Fallback Test'

      // Execute
      await copyToClipboard(text, { onSuccess })

      // Assert
      expect(document.createElement).toHaveBeenCalledWith('textarea')
      expect(mockExecCommand).toHaveBeenCalledWith('copy')
      expect(onSuccess).toHaveBeenCalledWith(text)
    })

    it('should handle empty text', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })

      const onSuccess = vi.fn()

      await copyToClipboard('', { onSuccess })

      expect(mockClipboard.writeText).toHaveBeenCalledWith('')
      expect(onSuccess).toHaveBeenCalledWith('')
    })

    it('should call onError when copy fails', async () => {
      // Setup - Make Clipboard API fail
      const error = new Error('Copy failed')
      mockClipboard.writeText.mockRejectedValue(error)

      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })

      const onError = vi.fn()
      const text = 'Test'

      // Execute
      await copyToClipboard(text, { onError })

      // Assert
      expect(onError).toHaveBeenCalledWith(error)
    })

    it('should handle fallback failure', async () => {
      // Setup - No Clipboard API and execCommand fails
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true
      })

      mockExecCommand.mockReturnValue(false)

      const onError = vi.fn()
      const text = 'Test'

      // Execute
      await copyToClipboard(text, { onError })

      // Assert
      expect(onError).toHaveBeenCalled()
      expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
    })

    it('should work without callbacks', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })

      // Should not throw
      await expect(copyToClipboard('Test')).resolves.toBeUndefined()
    })

    it('should handle special characters', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })

      const specialText = '特殊字符 🎉 \n\t\r'
      await copyToClipboard(specialText)

      expect(mockClipboard.writeText).toHaveBeenCalledWith(specialText)
    })
  })

  describe('readFromClipboard', () => {
    it('should read text from clipboard', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })

      const result = await readFromClipboard()

      expect(mockClipboard.readText).toHaveBeenCalled()
      expect(result).toBe('test content')
    })

    it('should return null when Clipboard API is not available', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true
      })

      const result = await readFromClipboard()

      expect(result).toBeNull()
    })

    it('should return null when read fails', async () => {
      mockClipboard.readText.mockRejectedValue(new Error('Read failed'))

      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })

      const result = await readFromClipboard()

      expect(result).toBeNull()
    })

    it('should handle empty clipboard', async () => {
      mockClipboard.readText.mockResolvedValue('')

      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })

      const result = await readFromClipboard()

      expect(result).toBe('')
    })
  })

  describe('checkClipboardSupport', () => {
    it('should return true when Clipboard API is available', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })

      const result = checkClipboardSupport()

      expect(result.hasClipboardAPI).toBe(true)
      expect(result.canWrite).toBe(true)
      expect(result.canRead).toBe(true)
    })

    it('should return false when Clipboard API is not available', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true
      })

      const result = checkClipboardSupport()

      expect(result.hasClipboardAPI).toBe(false)
      expect(result.canWrite).toBe(false)
      expect(result.canRead).toBe(false)
    })

    it('should check individual methods', () => {
      const partialClipboard = {
        writeText: vi.fn()
        // No readText
      }

      Object.defineProperty(navigator, 'clipboard', {
        value: partialClipboard,
        writable: true,
        configurable: true
      })

      const result = checkClipboardSupport()

      expect(result.hasClipboardAPI).toBe(true)
      expect(result.canWrite).toBe(true)
      expect(result.canRead).toBe(false)
    })

    it('should detect execCommand support', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true
      })

      const result = checkClipboardSupport()

      expect(result.hasExecCommand).toBe(true)
    })
  })

  describe('copyMultiple', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })
    })

    it('should copy multiple items sequentially', async () => {
      const items = [
        { label: 'Item 1', value: 'Value 1' },
        { label: 'Item 2', value: 'Value 2' },
        { label: 'Item 3', value: 'Value 3' }
      ]

      const onItemSuccess = vi.fn()

      await copyMultiple(items, { onItemSuccess })

      expect(mockClipboard.writeText).toHaveBeenCalledTimes(3)
      expect(mockClipboard.writeText).toHaveBeenNthCalledWith(1, 'Value 1')
      expect(mockClipboard.writeText).toHaveBeenNthCalledWith(2, 'Value 2')
      expect(mockClipboard.writeText).toHaveBeenNthCalledWith(3, 'Value 3')
      expect(onItemSuccess).toHaveBeenCalledTimes(3)
    })

    it('should handle empty items array', async () => {
      const result = await copyMultiple([])

      expect(mockClipboard.writeText).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: 0,
        failed: 0,
        total: 0
      })
    })

    it('should continue on individual failures', async () => {
      mockClipboard.writeText
        .mockResolvedValueOnce(undefined) // Success
        .mockRejectedValueOnce(new Error('Failed')) // Fail
        .mockResolvedValueOnce(undefined) // Success

      const items = [
        { label: 'Item 1', value: 'Value 1' },
        { label: 'Item 2', value: 'Value 2' },
        { label: 'Item 3', value: 'Value 3' }
      ]

      const onItemError = vi.fn()

      const result = await copyMultiple(items, { onItemError })

      expect(result).toEqual({
        success: 2,
        failed: 1,
        total: 3
      })
      expect(onItemError).toHaveBeenCalledTimes(1)
    })

    it('should respect delay between copies', async () => {
      vi.useFakeTimers()

      const items = [
        { label: 'Item 1', value: 'Value 1' },
        { label: 'Item 2', value: 'Value 2' }
      ]

      const promise = copyMultiple(items, { delay: 100 })

      // Fast-forward time
      await vi.advanceTimersByTimeAsync(100)

      await promise

      expect(mockClipboard.writeText).toHaveBeenCalledTimes(2)

      vi.useRealTimers()
    })

    it('should call onComplete callback', async () => {
      const items = [
        { label: 'Item 1', value: 'Value 1' }
      ]

      const onComplete = vi.fn()

      await copyMultiple(items, { onComplete })

      expect(onComplete).toHaveBeenCalledWith({
        success: 1,
        failed: 0,
        total: 1
      })
    })

    it('should handle items without labels', async () => {
      const items = [
        { value: 'Value 1' },
        { value: 'Value 2' }
      ]

      await copyMultiple(items)

      expect(mockClipboard.writeText).toHaveBeenCalledTimes(2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long text', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })

      const longText = 'a'.repeat(100000)

      await copyToClipboard(longText)

      expect(mockClipboard.writeText).toHaveBeenCalledWith(longText)
    })

    it('should handle null and undefined', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })

      await copyToClipboard(null)
      expect(mockClipboard.writeText).toHaveBeenCalledWith(null)

      await copyToClipboard(undefined)
      expect(mockClipboard.writeText).toHaveBeenCalledWith(undefined)
    })

    it('should handle concurrent copy operations', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })

      const promises = [
        copyToClipboard('Text 1'),
        copyToClipboard('Text 2'),
        copyToClipboard('Text 3')
      ]

      await Promise.all(promises)

      expect(mockClipboard.writeText).toHaveBeenCalledTimes(3)
    })
  })
})

// Made with Bob
