import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Shield, Upload, AlertTriangle, CheckCircle, XCircle, FileText, Search } from 'lucide-react'

export default function LogAnalyzer() {
  const [logs, setLogs] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const sampleLogs = `192.168.1.5 LOGIN FAILED
192.168.1.5 LOGIN FAILED
192.168.1.5 LOGIN FAILED
192.168.1.7 LOGIN FAILED
192.168.1.7 LOGIN FAILED
10.0.0.15 LOGIN SUCCESS
192.168.1.5 LOGIN FAILED
192.168.1.5 LOGIN FAILED
172.16.0.3 LOGIN SUCCESS
192.168.1.7 LOGIN FAILED
192.168.1.7 LOGIN FAILED
192.168.1.7 LOGIN FAILED`

  const handleAnalyze = async () => {
    if (!logs.trim()) return
    
    setIsAnalyzing(true)
    
    // Simulate API call
    setTimeout(() => {
      const logLines = logs.split('\n').filter(line => line.trim())
      const ipCounts = {}
      const threats = []
      
      logLines.forEach(line => {
        const ipMatch = line.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/)
        const failedMatch = line.match(/LOGIN FAILED/i)
        
        if (ipMatch && failedMatch) {
          const ip = ipMatch[0]
          ipCounts[ip] = (ipCounts[ip] || 0) + 1
        }
      })
      
      // Detect brute force attacks
      for (const [ip, count] of Object.entries(ipCounts)) {
        if (count >= 3) {
          threats.push({
            type: 'brute_force',
            ip,
            attempts: count,
            severity: count >= 5 ? 'high' : 'medium',
            message: `Brute force attack detected from ${ip} with ${count} failed attempts`
          })
        }
      }
      
      const recommendations = []
      if (threats.length > 0) {
        recommendations.push('Enable Multi-Factor Authentication')
        recommendations.push('Implement account lockout after failed attempts')
        recommendations.push('Add CAPTCHA to login forms')
        recommendations.push('Monitor login activity regularly')
      }
      
      setAnalysis({
        totalEntries: logLines.length,
        threats: threats.length,
        threats,
        recommendations,
        summary: {
          totalIPs: Object.keys(ipCounts).length,
          failedAttempts: Object.values(ipCounts).reduce((a, b) => a + b, 0),
          suspiciousIPs: Object.keys(ipCounts).filter(ip => ipCounts[ip] >= 3).length
        }
      })
      
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogs(e.target.result)
      }
      reader.readAsText(files[0])
    }
  }

  const loadSampleData = () => {
    setLogs(sampleLogs)
  }

  const clearData = () => {
    setLogs('')
    setAnalysis(null)
  }

  return (
    <>
      <Head>
        <title>Log Analyzer - Log Sentinel</title>
        <meta name="description" content="Analyze security logs for threats" />
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
                  <Link href="/analyzer" className="sentinel-nav-link-active">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Log Analyzer</h1>
            <p className="text-gray-600 mt-2">Upload or paste your security logs to detect potential threats</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <div className="sentinel-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Input Logs</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={loadSampleData}
                      className="sentinel-button-secondary text-sm px-3 py-1"
                    >
                      Load Sample
                    </button>
                    <button
                      onClick={clearData}
                      className="sentinel-button-secondary text-sm px-3 py-1"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-colors ${
                    dragActive 
                      ? 'border-sentinel-blue bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop log files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports .txt, .log files up to 10MB
                  </p>
                </div>

                {/* Text Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or paste your logs directly:
                  </label>
                  <textarea
                    value={logs}
                    onChange={(e) => setLogs(e.target.value)}
                    placeholder="Enter your security logs here..."
                    className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sentinel-blue focus:border-transparent font-mono text-sm"
                  />
                </div>

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!logs.trim() || isAnalyzing}
                  className={`w-full sentinel-button-primary py-3 ${
                    (!logs.trim() || isAnalyzing) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Search className="h-5 w-5 mr-2" />
                      Analyze Logs
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div>
              {analysis ? (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="sentinel-card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Summary</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{analysis.totalEntries}</div>
                        <div className="text-sm text-gray-600">Total Entries</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-500">{analysis.threats}</div>
                        <div className="text-sm text-gray-600">Threats Detected</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-500">{analysis.summary.suspiciousIPs}</div>
                        <div className="text-sm text-gray-600">Suspicious IPs</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-sentinel-blue">{analysis.summary.totalIPs}</div>
                        <div className="text-sm text-gray-600">Unique IPs</div>
                      </div>
                    </div>
                  </div>

                  {/* Threats */}
                  {analysis.threats.length > 0 && (
                    <div className="sentinel-card">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Detected Threats</h2>
                      <div className="space-y-3">
                        {analysis.threats.map((threat, index) => (
                          <div key={index} className={`sentinel-alert sentinel-alert-${threat.severity}`}>
                            <div className="flex items-start">
                              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="font-semibold">{threat.message}</div>
                                <div className="text-sm mt-1">
                                  IP: {threat.ip} • Attempts: {threat.attempts}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analysis.recommendations.length > 0 && (
                    <div className="sentinel-card">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Recommendations</h2>
                      <div className="space-y-2">
                        {analysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="sentinel-card">
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Yet</h3>
                    <p className="text-gray-600">
                      Upload or paste your security logs to start the analysis
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
