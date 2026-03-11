import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Shield, Lock, Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function PasswordStrength() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const analyzePassword = (pwd) => {
    if (!pwd) {
      setAnalysis(null)
      return
    }

    let score = 0
    let feedback = []
    let strength = 'Weak'
    let color = 'text-red-600'

    // Length check
    if (pwd.length >= 8) score += 1
    else feedback.push('Password should be at least 8 characters')

    if (pwd.length >= 12) score += 1
    if (pwd.length >= 16) score += 1

    // Character variety
    if (/[a-z]/.test(pwd)) score += 1
    else feedback.push('Include lowercase letters')

    if (/[A-Z]/.test(pwd)) score += 1
    else feedback.push('Include uppercase letters')

    if (/[0-9]/.test(pwd)) score += 1
    else feedback.push('Include numbers')

    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1
    else feedback.push('Include special characters')

    // Common patterns
    if (!/(.)\1{2,}/.test(pwd)) score += 1
    else feedback.push('Avoid repeated characters')

    if (!/123|abc|qwe|password/i.test(pwd)) score += 1
    else feedback.push('Avoid common patterns')

    // Calculate strength
    const totalScore = score
    const percentage = (totalScore / 9) * 100

    if (percentage >= 80) {
      strength = 'Very Strong'
      color = 'text-green-600'
    } else if (percentage >= 60) {
      strength = 'Strong'
      color = 'text-blue-600'
    } else if (percentage >= 40) {
      strength = 'Medium'
      color = 'text-yellow-600'
    } else if (percentage >= 20) {
      strength = 'Weak'
      color = 'text-orange-600'
    } else {
      strength = 'Very Weak'
      color = 'text-red-600'
    }

    // Estimate crack time
    let crackTime = 'Less than a second'
    if (percentage >= 80) crackTime = 'Centuries'
    else if (percentage >= 60) crackTime = 'Years'
    else if (percentage >= 40) crackTime = 'Months'
    else if (percentage >= 20) crackTime = 'Days'
    else crackTime = 'Seconds'

    setAnalysis({
      score: totalScore,
      percentage,
      strength,
      color,
      crackTime,
      feedback,
      entropy: calculateEntropy(pwd)
    })
  }

  const calculateEntropy = (pwd) => {
    let charset = 0
    if (/[a-z]/.test(pwd)) charset += 26
    if (/[A-Z]/.test(pwd)) charset += 26
    if (/[0-9]/.test(pwd)) charset += 10
    if (/[^a-zA-Z0-9]/.test(pwd)) charset += 32
    
    return Math.round(pwd.length * Math.log2(charset))
  }

  const handlePasswordChange = (e) => {
    const pwd = e.target.value
    setPassword(pwd)
    analyzePassword(pwd)
  }

  const generateStrongPassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
    let pwd = ''
    for (let i = 0; i < 16; i++) {
      pwd += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(pwd)
    analyzePassword(pwd)
  }

  return (
    <>
      <Head>
        <title>Password Strength Checker - Log Sentinel</title>
        <meta name="description" content="Check password strength and security" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-sentinel-dark border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <Shield className="h-8 w-8 text-sentinel-blue mr-3" />
                  <span className="text-white font-bold text-xl">Log Sentinel</span>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  <Link href="/" className="sentinel-nav-link text-white hover:text-blue-300">
                    Home
                  </Link>
                  <Link href="/dashboard" className="sentinel-nav-link text-white hover:text-blue-300">
                    Dashboard
                  </Link>
                  <Link href="/analyzer" className="sentinel-nav-link text-white hover:text-blue-300">
                    Log Analyzer
                  </Link>
                  <Link href="/alerts" className="sentinel-nav-link text-white hover:text-blue-300">
                    Alerts
                  </Link>
                  <Link href="/reports" className="sentinel-nav-link text-white hover:text-blue-300">
                    Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Password Strength Checker</h1>
            <p className="text-gray-600 mt-2">Analyze your password strength and get security recommendations</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <div className="sentinel-card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Your Password</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Password:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Enter your password to test..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sentinel-blue focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {analysis && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Strength:</span>
                      <span className={`font-semibold ${analysis.color}`}>{analysis.strength}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          analysis.percentage >= 80 ? 'bg-green-500' :
                          analysis.percentage >= 60 ? 'bg-blue-500' :
                          analysis.percentage >= 40 ? 'bg-yellow-500' :
                          analysis.percentage >= 20 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${analysis.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{analysis.percentage}%</div>
                  </div>
                )}

                <button
                  onClick={generateStrongPassword}
                  className="w-full sentinel-button-secondary mb-4"
                >
                  Generate Strong Password
                </button>

                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>
                      Your password is processed locally in your browser and is never sent to our servers.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Results */}
            <div>
              {analysis ? (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="sentinel-card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Crack Time:</span>
                        <span className="font-medium">{analysis.crackTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Entropy:</span>
                        <span className="font-medium">{analysis.entropy} bits</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Length:</span>
                        <span className="font-medium">{password.length} characters</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  {analysis.feedback.length > 0 && (
                    <div className="sentinel-card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvement Suggestions</h3>
                      <div className="space-y-2">
                        {analysis.feedback.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Character Analysis */}
                  <div className="sentinel-card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Character Analysis</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded mr-2 ${
                          /[a-z]/.test(password) ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm">Lowercase (a-z)</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded mr-2 ${
                          /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm">Uppercase (A-Z)</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded mr-2 ${
                          /[0-9]/.test(password) ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm">Numbers (0-9)</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded mr-2 ${
                          /[^a-zA-Z0-9]/.test(password) ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm">Special (!@#$...)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="sentinel-card">
                  <div className="text-center py-12">
                    <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Enter a Password</h3>
                    <p className="text-gray-600">
                      Type a password above to see its strength analysis
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password Tips */}
          <div className="mt-8 sentinel-card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Password Security Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">Use Long Passwords</div>
                  <div className="text-sm text-gray-600">Aim for at least 12-16 characters</div>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">Mix Character Types</div>
                  <div className="text-sm text-gray-600">Use uppercase, lowercase, numbers, and symbols</div>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">Avoid Common Patterns</div>
                  <div className="text-sm text-gray-600">Don't use birthdays, names, or common words</div>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">Use Unique Passwords</div>
                  <div className="text-sm text-gray-600">Don't reuse passwords across different accounts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
