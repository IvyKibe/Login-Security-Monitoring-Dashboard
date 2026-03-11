import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Shield, FileText, Download, Calendar, AlertTriangle, TrendingUp, Globe, Lock, Clock } from 'lucide-react'

export default function Reports() {
  const [report, setReport] = useState({
    period: '7d',
    generatedAt: new Date('2024-03-11T14:30:00Z'),
    summary: {
      totalAttempts: 1247,
      successfulLogins: 892,
      failedLogins: 355,
      suspiciousAttempts: 67,
      uniqueIPs: 234,
      alerts: 12,
      criticalAlerts: 2,
      failureRate: 28.5,
      suspiciousRate: 5.4
    },
    riskAssessment: {
      level: 'Medium',
      score: 72,
      factors: {
        failureRate: 28.5,
        suspiciousRate: 5.4,
        criticalAlerts: 2
      }
    },
    topIPs: [
      { _id: '192.168.1.7', attempts: 45, countries: ['CN'] },
      { _id: '192.168.1.5', attempts: 23, countries: ['US'] },
      { _id: '10.0.0.25', attempts: 18, countries: ['RU'] },
      { _id: '172.16.0.3', attempts: 12, countries: ['BR'] },
      { _id: '192.168.1.15', attempts: 8, countries: ['IN'] }
    ],
    attackTimeline: [
      { _id: { date: '2024-03-05' }, total: 156, failed: 42, suspicious: 8 },
      { _id: { date: '2024-03-06' }, total: 189, failed: 58, suspicious: 12 },
      { _id: { date: '2024-03-07' }, total: 145, failed: 35, suspicious: 6 },
      { _id: { date: '2024-03-08' }, total: 198, failed: 67, suspicious: 15 },
      { _id: { date: '2024-03-09' }, total: 167, failed: 45, suspicious: 9 },
      { _id: { date: '2024-03-10' }, total: 234, failed: 78, suspicious: 11 },
      { _id: { date: '2024-03-11' }, total: 158, failed: 30, suspicious: 6 }
    ],
    geoAttacks: [
      { _id: 'US', count: 456 },
      { _id: 'CN', count: 234 },
      { _id: 'RU', count: 189 },
      { _id: 'BR', count: 145 },
      { _id: 'IN', count: 123 },
      { _id: 'DE', count: 98 },
      { _id: 'FR', count: 87 },
      { _id: 'GB', count: 76 },
      { _id: 'JP', count: 65 },
      { _id: 'CA', count: 54 }
    ],
    recommendations: [
      {
        priority: 'high',
        category: 'authentication',
        title: 'Implement Account Lockout',
        description: 'High failure rate detected. Implement account lockout after multiple failed attempts.'
      },
      {
        priority: 'medium',
        category: 'security',
        title: 'Add CAPTCHA Protection',
        description: 'Suspicious activity detected. Add CAPTCHA to prevent automated attacks.'
      },
      {
        priority: 'critical',
        category: 'monitoring',
        title: 'Immediate Security Review Required',
        description: 'Critical alerts detected. Review security logs and implement immediate countermeasures.'
      },
      {
        priority: 'low',
        category: 'general',
        title: 'Enable Multi-Factor Authentication',
        description: 'MFA significantly reduces the risk of successful credential attacks.'
      },
      {
        priority: 'low',
        category: 'monitoring',
        title: 'Regular Security Audits',
        description: 'Schedule regular security audits to identify and address vulnerabilities.'
      }
    ]
  })

  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  const getRiskColor = (level) => {
    switch (level) {
      case 'Critical': return 'text-red-600 bg-red-100'
      case 'High': return 'text-orange-600 bg-orange-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      case 'low': return 'border-blue-500 bg-blue-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  const generateReport = () => {
    // In a real app, this would call the API
    console.log('Generating report for period:', selectedPeriod)
  }

  const downloadReport = () => {
    // In a real app, this would download a PDF/CSV
    console.log('Downloading report...')
  }

  return (
    <>
      <Head>
        <title>Security Reports - Log Sentinel</title>
        <meta name="description" content="Security reports and recommendations" />
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
                  <Link href="/reports" className="sentinel-nav-link-active">
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Security Reports</h1>
                <p className="text-gray-600 mt-2">Comprehensive security analysis and recommendations</p>
              </div>
              <div className="flex space-x-3">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sentinel-blue"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
                <button
                  onClick={generateReport}
                  className="sentinel-button-primary flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </button>
                <button
                  onClick={downloadReport}
                  className="sentinel-button-secondary flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="sentinel-card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getRiskColor(report.riskAssessment.level)}`}>
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {report.riskAssessment.level} Risk
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Risk Score: {report.riskAssessment.score}/100
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Failure Rate:</span>
                  <span className="font-medium">{report.riskAssessment.factors.failureRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Suspicious Rate:</span>
                  <span className="font-medium">{report.riskAssessment.factors.suspiciousRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Critical Alerts:</span>
                  <span className="font-medium">{report.riskAssessment.factors.criticalAlerts}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-semibold mb-2">Report Period:</div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Last 7 Days
                </div>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  Generated: March 11, 2024 at 2:30 PM
                </div>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="sentinel-stat-card">
              <div className="text-2xl font-bold text-gray-900">{report.summary.totalAttempts.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Attempts</div>
            </div>
            <div className="sentinel-stat-card">
              <div className="text-2xl font-bold text-green-500">{report.summary.successfulLogins.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Successful</div>
            </div>
            <div className="sentinel-stat-card">
              <div className="text-2xl font-bold text-red-500">{report.summary.failedLogins.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="sentinel-stat-card">
              <div className="text-2xl font-bold text-orange-500">{report.summary.suspiciousAttempts.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Suspicious</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Attacking IPs */}
            <div className="sentinel-card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Attacking IPs</h2>
              <div className="space-y-3">
                {report.topIPs.map((ip, index) => (
                  <div key={ip._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{ip._id}</div>
                        <div className="text-sm text-gray-600">{ip.countries.join(', ')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{ip.attempts}</div>
                      <div className="text-sm text-gray-600">attempts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="sentinel-card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Attack Sources by Country</h2>
              <div className="space-y-3">
                {report.geoAttacks.map((country, index) => (
                  <div key={country._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">{country._id}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-sentinel-blue h-2 rounded-full" 
                          style={{ width: `${(country.count / report.geoAttacks[0].count) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-gray-900 w-12 text-right">{country.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="sentinel-card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Recommendations</h2>
            <div className="space-y-4">
              {report.recommendations.map((rec, index) => (
                <div key={index} className={`border-l-4 p-4 rounded-r-lg ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start">
                    <Lock className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-gray-900 mr-2">{rec.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {rec.priority.toUpperCase()}
                        </span>
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {rec.category}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
