/**
 * Test validation and quality assurance utilities
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface TestResults {
  passed: number
  failed: number
  total: number
  coverage?: {
    lines: number
    functions: number
    branches: number
    statements: number
  }
}

interface ValidationReport {
  testResults: TestResults
  accessibility: {
    violations: number
    passed: boolean
  }
  responsive: {
    viewportsTested: number
    passed: boolean
  }
  performance: {
    metricsTracked: number
    passed: boolean
  }
  overall: {
    score: number
    passed: boolean
    recommendations: string[]
  }
}

export class TestValidator {
  private projectRoot: string

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot
  }

  /**
   * Run all tests and generate a comprehensive validation report
   */
  async validateTestSuite(): Promise<ValidationReport> {
    console.log('🧪 Running comprehensive test validation...\n')

    const report: ValidationReport = {
      testResults: await this.runAllTests(),
      accessibility: await this.validateAccessibility(),
      responsive: await this.validateResponsiveDesign(),
      performance: await this.validatePerformance(),
      overall: {
        score: 0,
        passed: false,
        recommendations: []
      }
    }

    // Calculate overall score and recommendations
    report.overall = this.calculateOverallScore(report)

    return report
  }

  /**
   * Run all test suites and collect results
   */
  private async runAllTests(): Promise<TestResults> {
    try {
      console.log('📊 Running all tests...')
      const output = execSync('npm test', { 
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      })

      // Parse test results from output
      const results = this.parseTestOutput(output)
      console.log(`✅ Tests completed: ${results.passed}/${results.total} passed\n`)
      
      return results
    } catch (error: any) {
      console.log('❌ Some tests failed, parsing results...')
      const results = this.parseTestOutput(error.stdout || '')
      console.log(`⚠️  Tests completed: ${results.passed}/${results.total} passed\n`)
      
      return results
    }
  }

  /**
   * Validate accessibility compliance
   */
  private async validateAccessibility(): Promise<{ violations: number; passed: boolean }> {
    try {
      console.log('♿ Validating accessibility compliance...')
      const output = execSync('npm run test:accessibility', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      })

      const violations = this.countAccessibilityViolations(output)
      const passed = violations === 0

      console.log(`${passed ? '✅' : '❌'} Accessibility: ${violations} violations found\n`)
      
      return { violations, passed }
    } catch (error: any) {
      console.log('❌ Accessibility tests failed\n')
      return { violations: -1, passed: false }
    }
  }

  /**
   * Validate responsive design implementation
   */
  private async validateResponsiveDesign(): Promise<{ viewportsTested: number; passed: boolean }> {
    try {
      console.log('📱 Validating responsive design...')
      const output = execSync('npm run test:responsive', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      })

      const viewportsTested = this.countViewportTests(output)
      const passed = viewportsTested >= 4 // Mobile, tablet, desktop, large

      console.log(`${passed ? '✅' : '❌'} Responsive: ${viewportsTested} viewports tested\n`)
      
      return { viewportsTested, passed }
    } catch (error: any) {
      console.log('❌ Responsive design tests failed\n')
      return { viewportsTested: 0, passed: false }
    }
  }

  /**
   * Validate performance monitoring
   */
  private async validatePerformance(): Promise<{ metricsTracked: number; passed: boolean }> {
    try {
      console.log('⚡ Validating performance monitoring...')
      const output = execSync('npm run test:utils', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      })

      const metricsTracked = this.countPerformanceMetrics(output)
      const passed = metricsTracked >= 5 // Basic performance metrics

      console.log(`${passed ? '✅' : '❌'} Performance: ${metricsTracked} metrics tracked\n`)
      
      return { metricsTracked, passed }
    } catch (error: any) {
      console.log('❌ Performance tests failed\n')
      return { metricsTracked: 0, passed: false }
    }
  }

  /**
   * Parse test output to extract results
   */
  private parseTestOutput(output: string): TestResults {
    const passedMatch = output.match(/(\d+) passed/)
    const failedMatch = output.match(/(\d+) failed/)
    const totalMatch = output.match(/Tests\s+(\d+)/)

    const passed = passedMatch ? parseInt(passedMatch[1]) : 0
    const failed = failedMatch ? parseInt(failedMatch[1]) : 0
    const total = totalMatch ? parseInt(totalMatch[1]) : passed + failed

    return { passed, failed, total }
  }

  /**
   * Count accessibility violations from test output
   */
  private countAccessibilityViolations(output: string): number {
    const violationMatches = output.match(/(\d+) violations?/g)
    if (!violationMatches) return 0

    return violationMatches.reduce((total, match) => {
      const count = parseInt(match.match(/(\d+)/)?.[1] || '0')
      return total + count
    }, 0)
  }

  /**
   * Count viewport tests from responsive test output
   */
  private countViewportTests(output: string): number {
    const viewportMatches = output.match(/Viewport.*\(/g)
    return viewportMatches ? viewportMatches.length : 0
  }

  /**
   * Count performance metrics from test output
   */
  private countPerformanceMetrics(output: string): number {
    const metricMatches = output.match(/Performance metric/g)
    return metricMatches ? metricMatches.length : 0
  }

  /**
   * Calculate overall quality score and recommendations
   */
  private calculateOverallScore(report: ValidationReport): {
    score: number
    passed: boolean
    recommendations: string[]
  } {
    const recommendations: string[] = []
    let score = 0

    // Test coverage score (40% weight)
    const testScore = (report.testResults.passed / report.testResults.total) * 40
    score += testScore

    if (report.testResults.passed < report.testResults.total) {
      recommendations.push(`Fix ${report.testResults.failed} failing tests`)
    }

    // Accessibility score (25% weight)
    const accessibilityScore = report.accessibility.passed ? 25 : 0
    score += accessibilityScore

    if (!report.accessibility.passed) {
      recommendations.push('Fix accessibility violations for WCAG compliance')
    }

    // Responsive design score (20% weight)
    const responsiveScore = report.responsive.passed ? 20 : 0
    score += responsiveScore

    if (!report.responsive.passed) {
      recommendations.push('Improve responsive design testing coverage')
    }

    // Performance monitoring score (15% weight)
    const performanceScore = report.performance.passed ? 15 : 0
    score += performanceScore

    if (!report.performance.passed) {
      recommendations.push('Enhance performance monitoring and testing')
    }

    const passed = score >= 80 // 80% threshold for passing

    if (score >= 90) {
      recommendations.push('Excellent test coverage! Consider adding integration tests.')
    } else if (score >= 80) {
      recommendations.push('Good test coverage. Consider adding more edge case tests.')
    } else if (score >= 60) {
      recommendations.push('Moderate test coverage. Focus on critical path testing.')
    } else {
      recommendations.push('Low test coverage. Prioritize testing core functionality.')
    }

    return { score: Math.round(score), passed, recommendations }
  }

  /**
   * Generate a formatted report
   */
  generateReport(report: ValidationReport): string {
    const { testResults, accessibility, responsive, performance, overall } = report

    return `
🧪 TEST VALIDATION REPORT
========================

📊 Test Results:
  • Passed: ${testResults.passed}
  • Failed: ${testResults.failed}
  • Total: ${testResults.total}
  • Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%

♿ Accessibility:
  • Status: ${accessibility.passed ? '✅ PASSED' : '❌ FAILED'}
  • Violations: ${accessibility.violations}

📱 Responsive Design:
  • Status: ${responsive.passed ? '✅ PASSED' : '❌ FAILED'}
  • Viewports Tested: ${responsive.viewportsTested}

⚡ Performance:
  • Status: ${performance.passed ? '✅ PASSED' : '❌ FAILED'}
  • Metrics Tracked: ${performance.metricsTracked}

🎯 Overall Quality Score: ${overall.score}/100 ${overall.passed ? '✅' : '❌'}

📝 Recommendations:
${overall.recommendations.map(rec => `  • ${rec}`).join('\n')}

${overall.passed ? '🎉 Great job! Your test suite meets quality standards.' : '⚠️  Consider addressing the recommendations above.'}
`
  }
}

// CLI usage
if (require.main === module) {
  const validator = new TestValidator()
  
  validator.validateTestSuite()
    .then(report => {
      console.log(validator.generateReport(report))
      process.exit(report.overall.passed ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Validation failed:', error.message)
      process.exit(1)
    })
}