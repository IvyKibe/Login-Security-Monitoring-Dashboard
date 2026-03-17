import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Shield, Upload, AlertTriangle, CheckCircle, XCircle, FileText, Search, Plus, Flag, Users, TrendingUp } from 'lucide-react'

export default function LogAnalyzer() {
  const [logs, setLogs] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportData, setReportData] = useState({
    activityType: '',
    severity: 'medium',
    title: '',
    description: '',
    ipAddress: '',
    tags: []
  })
  const [publicReports, setPublicReports] = useState([])
  const [userReports, setUserReports] = useState([])
  const [token, setToken] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
    if (storedToken) {
      fetchUserReports()
    }
    fetchPublicReports()
  }, [])

  const fetchPublicReports = async () => {
    try {
      const response = await fetch('/api/suspicious/public')
      if (response.ok) {
        const data = await response.json()
        setPublicReports(data.activities || [])
      }
    } catch (error) {
      console.error('Error fetching public reports:', error)
    }
  }

  const fetchUserReports = async () => {
    try {
      const response = await fetch('/api/suspicious', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUserReports(data.activities || [])
      }
    } catch (error) {
      console.error('Error fetching user reports:', error)
    }
  }

  const analyzeLogs = async () => {
    if (!logs.trim()) return
    
    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ logs: logs.split('\n').filter(line => line.trim()) })
      })

      const data = await response.json()
      
      if (response.ok) {
        setAnalysis(data)
        
        // Auto-fill report form with detected threats
        if (data.threats && data.threats.length > 0) {
          const mainThreat = data.threats[0]
          setReportData({
            activityType: mainThreat.type === 'brute_force' ? 'brute_force' : 'suspicious_login',
            severity: mainThreat.severity === 'high' ? 'high' : 'medium',
            title: mainThreat.message || 'Suspicious activity detected',
            description: `Analysis detected ${data.threats.length} potential threats: ${data.threats.map(t => t.message).join(', ')}`,
            ipAddress: mainThreat.ip || '',
            tags: ['automated-detection', 'log-analysis']
          })
          setShowReportForm(true)
        }
      } else {
        console.error('Analysis failed:', data.error)
      }
    } catch (error) {
      console.error('Error analyzing logs:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const submitReport = async () => {
    if (!token) {
      alert('Please login to submit reports')
      return
    }

    try {
      const response = await fetch('/api/suspicious', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
      })

      const data = await response.json()
      
      if (response.ok) {
        alert('Report submitted successfully!')
        setShowReportForm(false)
        setReportData({
          activityType: '',
          severity: 'medium',
          title: '',
          description: '',
          ipAddress: '',
          tags: []
        })
        fetchUserReports()
      } else {
        alert('Error submitting report: ' + data.error)
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      alert('Error submitting report')
    }
  }

  const upvoteReport = async (reportId) => {
    if (!token) {
      alert('Please login to upvote reports')
      return
    }

    try {
      const response = await fetch(`/api/suspicious/${reportId}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchPublicReports()
      }
    } catch (error) {
      console.error('Error upvoting report:', error)
    }
  }

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

  const getActivityIcon = (type) => {
    switch (type) {
      case 'brute_force': return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'phishing_attempt': return <XCircle className="h-5 w-5 text-orange-500" />
      case 'malware_detected': return <AlertTriangle className="h-5 w-5 text-purple-500" />
      default: return <Flag className="h-5 w-5 text-blue-500" />
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <>
      <Head>
        <title>Log Analyzer - Log Sentinel</title>
        <meta name="description" content="Analyze security logs for threats and report suspicious activities" />
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
                  {token ? (
                    <Link href="/dashboard" className="sentinel-button-primary text-sm px-3 py-1">
                      Dashboard
                    </Link>
                  ) : (
                    <Link href="/login" className="sentinel-button-primary text-sm px-3 py-1">
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Security Activity Center</h1>
            <p className="text-gray-600 mt-2">Analyze security logs and report suspicious activities to the community</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Log Analysis Section */}
            <div className="lg:col-span-2">
              <div className="sentinel-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Log Analysis & Reporting</h2>
                  <button
                    onClick={() => setShowReportForm(!showReportForm)}
                    className="sentinel-button-primary text-sm px-3 py-1 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Quick Report
                  </button>
                </div>

                {/* Quick Report Form */}
                {showReportForm && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Suspicious Activity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                        <select
                          value={reportData.activityType}
                          onChange={(e) => setReportData({...reportData, activityType: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sentinel-blue"
                        >
                          <option value="">Select type</option>
                          <option value="suspicious_login">Suspicious Login</option>
                          <option value="brute_force">Brute Force Attack</option>
                          <option value="phishing_attempt">Phishing Attempt</option>
                          <option value="malware_detected">Malware Detected</option>
                          <option value="unusual_behavior">Unusual Behavior</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                        <select
                          value={reportData.severity}
                          onChange={(e) => setReportData({...reportData, severity: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sentinel-blue"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={reportData.title}
                          onChange={(e) => setReportData({...reportData, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sentinel-blue"
                          placeholder="Brief description of the activity"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={reportData.description}
                          onChange={(e) => setReportData({...reportData, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sentinel-blue"
                          rows={3}
                          placeholder="Detailed description of what happened"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                        <input
                          type="text"
                          value={reportData.ipAddress}
                          onChange={(e) => setReportData({...reportData, ipAddress: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sentinel-blue"
                          placeholder="Optional: Suspicious IP address"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={submitReport}
                          className="sentinel-button-primary w-full"
                        >
                          Submit Report
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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
                    className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sentinel-blue font-mono text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mb-4">
                  <button
                    onClick={analyzeLogs}
                    disabled={!logs.trim() || isAnalyzing}
                    className={`flex-1 sentinel-button-primary py-3 ${
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
                  <button
                    onClick={loadSampleData}
                    className="sentinel-button-secondary"
                  >
                    Load Sample
                  </button>
                  <button
                    onClick={clearData}
                    className="sentinel-button-secondary"
                  >
                    Clear
                  </button>
                </div>

                {/* Analysis Results */}
                {analysis && (
                  <div className="space-y-6">
                    <div className="sentinel-card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-gray-900">{analysis.totalEntries}</div>
                          <div className="text-sm text-gray-600">Total Entries</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-red-500">{analysis.threats}</div>
                          <div className="text-sm text-gray-600">Threats Detected</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-orange-500">{analysis.summary?.suspiciousIPs || 0}</div>
                          <div className="text-sm text-gray-600">Suspicious IPs</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-sentinel-blue">{analysis.summary?.totalIPs || 0}</div>
                          <div className="text-sm text-gray-600">Unique IPs</div>
                        </div>
                      </div>

                      {analysis.threats && analysis.threats.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Detected Threats:</h4>
                          <div className="space-y-2">
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
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Community Reports Section */}
            <div>
              <div className="sentinel-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Community Reports</h2>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {publicReports.length} reports
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {publicReports.length === 0 ? (
                    <div className="text-center py-8">
                      <Flag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No community reports yet</p>
                    </div>
                  ) : (
                    publicReports.slice(0, 5).map((report) => (
                      <div key={report._id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              {getActivityIcon(report.activityType)}
                              <span className="ml-2 font-medium text-gray-900">{report.title}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{report.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(report.severity)}`}>
                                  {report.severity}
                                </span>
                                <span className="text-xs text-gray-500">
                                  by {report.userId?.username || 'Anonymous'}
                                </span>
                              </div>
                              <button
                                onClick={() => upvoteReport(report._id)}
                                className="flex items-center text-xs text-gray-500 hover:text-sentinel-blue"
                              >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {report.upvotes || 0}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {token && userReports.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Reports</h3>
                    <div className="space-y-2">
                      {userReports.slice(0, 3).map((report) => (
                        <div key={report._id} className="text-sm p-2 bg-gray-50 rounded">
                          <div className="font-medium text-gray-900">{report.title}</div>
                          <div className="text-gray-600">{report.status}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
