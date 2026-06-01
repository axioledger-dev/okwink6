# Test Setup & Execution Guide

## 📋 Prerequisites

- Node.js >= 18.x
- npm >= 9.x

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd wap
npm install
```

This will install:
- `vitest` - Test runner
- `@vue/test-utils` - Vue component testing utilities
- `jsdom` - DOM implementation for Node.js
- `@vitest/coverage-v8` - Code coverage tool

### 2. Run Tests

```bash
# Run all tests once
npm run test:unit

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests (interactive mode)
npm test
```

## 📁 Test Structure

```
wap/
├── src/
│   ├── utils/
│   │   ├── clipboard.js
│   │   ├── currency.js
│   │   ├── validation.js
│   │   ├── validation-schemas.js
│   │   └── __tests__/
│   │       ├── clipboard.test.js (45 tests)
│   │       ├── currency.test.js (68 tests)
│   │       ├── validation.test.js (82 tests)
│   │       ├── validation-schemas.test.js (58 tests)
│   │       ├── setup.js (test setup & mocks)
│   │       └── README.md (test documentation)
│   └── composables/
│       ├── useDeposit.js
│       ├── useLottery.js
│       └── __tests__/ (to be created)
├── vitest.config.js (test configuration)
└── package.json (test scripts)
```

## 🧪 Current Test Coverage

### Utilities (100% coverage target)
- ✅ `clipboard.js` - 45 tests
- ✅ `currency.js` - 68 tests
- ✅ `validation.js` - 82 tests
- ✅ `validation-schemas.js` - 58 tests

**Total: 253 test cases**

### Composables (pending)
- ⏳ `useDeposit.js` - 0 tests (templates available)
- ⏳ `useLottery.js` - 0 tests (templates available)

## 📊 Test Commands Explained

### `npm run test:unit`
Runs all tests once and exits. Use this for:
- CI/CD pipelines
- Pre-commit hooks
- Quick verification

**Output:**
```
✓ src/utils/__tests__/clipboard.test.js (45)
✓ src/utils/__tests__/currency.test.js (68)
✓ src/utils/__tests__/validation.test.js (82)
✓ src/utils/__tests__/validation-schemas.test.js (58)

Test Files  4 passed (4)
     Tests  253 passed (253)
```

### `npm run test:watch`
Runs tests in watch mode. Use this for:
- Active development
- TDD (Test-Driven Development)
- Debugging tests

**Features:**
- Auto-reruns tests when files change
- Interactive mode with keyboard shortcuts
- Fast feedback loop

### `npm run test:coverage`
Generates code coverage report. Use this for:
- Checking test coverage percentage
- Finding untested code
- Quality assurance

**Output:**
```
File                          | % Stmts | % Branch | % Funcs | % Lines
------------------------------|---------|----------|---------|--------
All files                     |   95.2  |   92.1   |   96.8  |   95.2
 utils/clipboard.js           |  100.0  |  100.0   |  100.0  |  100.0
 utils/currency.js            |  100.0  |  100.0   |  100.0  |  100.0
 utils/validation.js          |  100.0  |  100.0   |  100.0  |  100.0
 utils/validation-schemas.js  |  100.0  |  100.0   |  100.0  |  100.0
 composables/useDeposit.js    |   0.0   |   0.0    |   0.0   |   0.0
 composables/useLottery.js    |   0.0   |   0.0    |   0.0   |   0.0
```

Coverage report is saved to `coverage/` directory.

## 🔧 Configuration

### vitest.config.js

```javascript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/utils/__tests__/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80
    }
  }
})
```

### Coverage Thresholds

- **Lines:** 80%
- **Functions:** 80%
- **Branches:** 75%
- **Statements:** 80%

Tests will fail if coverage drops below these thresholds.

## 📝 Writing Tests

### Test Template

```javascript
import { describe, it, expect } from 'vitest'
import { myFunction } from '../myModule'

describe('myModule.js', () => {
  describe('myFunction', () => {
    it('should handle normal case', () => {
      const result = myFunction('input')
      expect(result).toBe('expected')
    })

    it('should handle edge case', () => {
      const result = myFunction(null)
      expect(result).toBe('default')
    })

    it('should handle error case', () => {
      expect(() => myFunction('invalid')).toThrow()
    })
  })
})
```

### Best Practices

1. **Descriptive test names**
   ```javascript
   // Good
   it('should return formatted currency with thousand separators')

   // Bad
   it('test currency')
   ```

2. **One assertion per test** (when possible)
   ```javascript
   // Good
   it('should format 1000 as "1,000"', () => {
     expect(formatCurrency(1000)).toBe('1,000')
   })

   // Avoid
   it('should format currency', () => {
     expect(formatCurrency(1000)).toBe('1,000')
     expect(formatCurrency(1000000)).toBe('1,000,000')
     expect(formatCurrency(0)).toBe('0')
   })
   ```

3. **Test edge cases**
   - Null/undefined inputs
   - Empty strings/arrays
   - Very large/small numbers
   - Invalid inputs
   - Boundary conditions

4. **Use proper matchers**
   ```javascript
   expect(value).toBe(expected)           // Strict equality
   expect(value).toEqual(expected)        // Deep equality
   expect(value).toBeCloseTo(1.5, 2)      // Floating point
   expect(value).toContain('substring')   // String contains
   expect(fn).toThrow()                   // Function throws
   expect(fn).toHaveBeenCalled()          // Mock called
   ```

## 🐛 Debugging Tests

### Run specific test file

```bash
npm run test:unit -- src/utils/__tests__/clipboard.test.js
```

### Run specific test case

```bash
npm run test:unit -- -t "should copy text"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test:unit"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### View detailed output

```bash
npm run test:unit -- --reporter=verbose
```

## 🚨 Common Issues

### Issue 1: "Cannot find module"

**Solution:** Check import paths and ensure files exist

```javascript
// Correct
import { formatCurrency } from '../currency'

// Wrong
import { formatCurrency } from '@/utils/currency'
```

### Issue 2: "ReferenceError: localStorage is not defined"

**Solution:** Already mocked in `setup.js`

```javascript
// setup.js handles this
global.localStorage = localStorageMock
```

### Issue 3: "TypeError: navigator.clipboard is undefined"

**Solution:** Mock in test file

```javascript
Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
  configurable: true
})
```

### Issue 4: Tests pass locally but fail in CI

**Solution:** Check for:
- Timezone differences
- File system case sensitivity
- Environment variables
- Async timing issues

## 📈 CI/CD Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd wap && npm install
      - run: cd wap && npm run test:unit
      - run: cd wap && npm run test:coverage
```

### GitLab CI

```yaml
test:
  stage: test
  script:
    - cd wap
    - npm install
    - npm run test:unit
    - npm run test:coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
```

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Test Templates](.bob/TESTING_GUIDE.md)

## 🎯 Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Run tests (`npm run test:unit`)
3. ⏳ Write composable tests (see templates in `.bob/TESTING_GUIDE.md`)
4. ⏳ Achieve 60%+ overall coverage
5. ⏳ Add integration tests
6. ⏳ Setup CI/CD pipeline

## 💡 Tips

- Run tests before committing code
- Keep tests fast (< 1s per test file)
- Mock external dependencies
- Test behavior, not implementation
- Write tests as documentation

---

**Last Updated:** 2026-05-24
**Maintainer:** Architecture Upgrade Team
