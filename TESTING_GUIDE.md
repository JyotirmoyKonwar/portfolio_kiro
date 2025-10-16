# Testing Guide

This document provides comprehensive information about the testing setup and strategies for the AI Portfolio Website.

## Testing Framework

The project uses **Vitest** as the primary testing framework, along with **React Testing Library** for component testing and **jest-axe** for accessibility testing.

### Key Testing Libraries

- **Vitest**: Fast unit test framework with native ES modules support
- **@testing-library/react**: Simple and complete testing utilities for React components
- **@testing-library/jest-dom**: Custom jest matchers for DOM elements
- **@testing-library/user-event**: Fire events the same way the user does
- **jest-axe**: Accessibility testing with axe-core
- **jsdom**: DOM implementation for Node.js (test environment)

## Test Structure

```
src/
├── __tests__/                 # Application-level tests
│   ├── App.test.tsx          # Main app component tests
│   ├── accessibility.test.tsx # Accessibility compliance tests
│   └── responsive.test.tsx    # Responsive design tests
├── components/
│   └── **/__tests__/         # Component-specific tests
├── utils/
│   └── **/__tests__/         # Utility function tests
├── contexts/
│   └── **/__tests__/         # Context provider tests
├── services/
│   └── **/__tests__/         # Service layer tests
└── test/
    └── setup.ts              # Test environment setup
```

## Available Test Commands

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Specific Test Categories

```bash
# Run accessibility tests only
npm run test:accessibility

# Run responsive design tests only
npm run test:responsive

# Run component tests only
npm run test:components

# Run utility function tests only
npm run test:utils

# Run context provider tests only
npm run test:contexts

# Run service layer tests only
npm run test:services

# Run tests for CI/CD (with coverage and verbose output)
npm run test:ci
```

## Test Categories

### 1. Unit Tests

**Purpose**: Test individual functions and components in isolation.

**Coverage**:
- Utility functions (accessibility, performance, error handling)
- Data validation and loading
- Analytics service
- Individual React components

**Example**:
```typescript
// src/utils/__tests__/accessibility.test.ts
describe('createSkipLink', () => {
  it('creates a skip link with correct attributes', () => {
    const skipLink = createSkipLink('main-content')
    expect(skipLink.href).toContain('#main-content')
    expect(skipLink.textContent).toBe('Skip to main content')
  })
})
```

### 2. Component Tests

**Purpose**: Test React components' rendering, props, and user interactions.

**Coverage**:
- Component rendering with different props
- User interaction handling
- Error boundary behavior
- Context provider functionality

**Example**:
```typescript
// src/components/UI/__tests__/ErrorBoundary.test.tsx
describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })
})
```

### 3. Integration Tests

**Purpose**: Test how different parts of the application work together.

**Coverage**:
- App component with all providers
- Context interactions with components
- Service integration with UI components

**Example**:
```typescript
// src/__tests__/App.test.tsx
describe('App', () => {
  it('renders all main sections', async () => {
    render(<App />)
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('about-section')).toBeInTheDocument()
  })
})
```

### 4. Accessibility Tests

**Purpose**: Ensure the application meets WCAG accessibility standards.

**Coverage**:
- Automated accessibility violations (using axe-core)
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels and roles
- Color contrast compliance
- Semantic HTML structure

**Example**:
```typescript
// src/__tests__/accessibility.test.tsx
it('should not have any accessibility violations', async () => {
  const { container } = render(<App />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### 5. Responsive Design Tests

**Purpose**: Verify the application works correctly across different screen sizes.

**Coverage**:
- Mobile viewport (375px)
- Tablet viewport (768px)
- Desktop viewport (1024px)
- Large desktop viewport (1440px)
- Touch target sizes
- Layout adaptations

**Example**:
```typescript
// src/__tests__/responsive.test.tsx
describe('Mobile Viewport (375px)', () => {
  it('stacks elements vertically on mobile', () => {
    setViewport(375, 667)
    render(<App />)
    const buttonContainer = screen.getByRole('button').parentElement
    expect(buttonContainer).toHaveClass('flex-col')
  })
})
```

## Testing Best Practices

### 1. Test Structure

- **Arrange**: Set up test data and conditions
- **Act**: Execute the code being tested
- **Assert**: Verify the expected outcome

```typescript
it('should track resume downloads', () => {
  // Arrange
  const analyticsService = new AnalyticsService()
  
  // Act
  analyticsService.trackResumeDownload()
  
  // Assert
  const data = analyticsService.getAnalyticsData()
  expect(data.totalDownloads).toBe(1)
})
```

### 2. Mocking Strategy

- Mock external dependencies and APIs
- Mock heavy components in integration tests
- Use real implementations for unit tests when possible

```typescript
// Mock external service
vi.mock('../services/analytics', () => ({
  analyticsService: {
    getAnalyticsData: vi.fn(() => mockData),
    trackResumeDownload: vi.fn(),
  }
}))
```

### 3. Accessibility Testing

- Use semantic queries (`getByRole`, `getByLabelText`)
- Test keyboard navigation
- Verify ARIA attributes
- Check color contrast

```typescript
// Good: Use semantic queries
expect(screen.getByRole('button', { name: /download resume/i })).toBeInTheDocument()

// Avoid: Using implementation details
expect(screen.getByClassName('download-btn')).toBeInTheDocument()
```

### 4. Responsive Testing

- Test multiple viewport sizes
- Verify touch target sizes on mobile
- Check layout adaptations
- Test orientation changes

```typescript
const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { value: width })
  Object.defineProperty(window, 'innerHeight', { value: height })
  window.dispatchEvent(new Event('resize'))
}
```

## Coverage Requirements

The project aims for the following coverage targets:

- **Overall Coverage**: 80%+
- **Critical Components**: 90%+
- **Utility Functions**: 95%+
- **Error Handling**: 100%

### Coverage Reports

Generate coverage reports with:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory and include:
- HTML report (`coverage/index.html`)
- JSON report (`coverage/coverage-final.json`)
- Text summary in terminal

## Continuous Integration

### Pre-commit Hooks

Tests should run automatically before commits:

```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run test:ci"
```

### CI/CD Pipeline

For GitHub Actions or similar CI systems:

```yaml
# .github/workflows/test.yml
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
      - run: npm ci
      - run: npm run test:ci
      - run: npm run build
```

## Debugging Tests

### Common Issues

1. **Component not rendering**: Check if all required props are provided
2. **Async operations**: Use `waitFor` or `findBy` queries
3. **Mock not working**: Verify mock path and implementation
4. **Accessibility violations**: Check ARIA labels and semantic HTML

### Debugging Tools

```typescript
// Debug rendered component
import { screen } from '@testing-library/react'
screen.debug() // Prints current DOM

// Debug specific element
screen.debug(screen.getByRole('button'))

// Check what queries are available
screen.logTestingPlaygroundURL()
```

## Performance Testing

While not included in the current setup, consider adding:

- **Lighthouse CI**: Automated performance audits
- **Bundle size monitoring**: Track JavaScript bundle sizes
- **Load testing**: Test with realistic data volumes

## Maintenance

### Regular Tasks

1. **Update dependencies**: Keep testing libraries up to date
2. **Review coverage**: Identify untested code paths
3. **Accessibility audits**: Regular manual testing with screen readers
4. **Performance monitoring**: Track test execution times

### Adding New Tests

When adding new features:

1. Write tests for new components
2. Update integration tests if needed
3. Add accessibility tests for new UI elements
4. Test responsive behavior for new layouts
5. Update this documentation

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)