import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Shield, AlertTriangle, Filter, Search, CheckCircle, Clock, MapPin, User } from 'lucide-react'

export default function Alerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'brute_force',
      severity: 'high',
      title: 'Brute Force Attack Detected',
      description: 'Multiple failed login attempts from IP 192.168.1.7',
      ipAddress: '192.168.1.7',
      timestamp: '2024-03-11T14:22:00Z',
      resolved: false,
      metadata: {
        attempts: 45,
        timeWindow: 300,
        userAgent: 'Mozilla/5.0...',
        country: 'CN'
      }
    },
    {
      id: 2,
      type: 'brute_force',
      severity: 'medium',
      title: 'Brute Force Attack Detected',
      description: 'Multiple failed login attempts from IP 192.168.1.5',
      ipAddress: '192.168.1.5',
      timestamp: '2024-03-11T14:18:00Z',
      resolved: false,
      metadata: {
        attempts: 23,
        timeWindow: 120,
        country: 'US'
      }
    },
    {
      id: 3,
      type: 'suspicious_ip',
      severity: 'medium',
      title: 'Suspicious IP Activity',
      description: 'Unusual login pattern detected from IP 10.0.0.25',
      ipAddress: '10.0.0.25',
      timestamp: '2024-03-11T13:45:00Z',
      resolved: true,
      metadata: {
        attempts: 8,
        country: 'RU'
      }
    },
    {
      id: 4,
      type: 'multiple_failures',
      severity: 'low',
      title: 'Multiple Failed Logins',
      description: 'Multiple failed login attempts for user admin',
      username: 'admin',
      timestamp: '2024-03-11T12:30:00Z',
      resolved: false,
      metadata: {
        attempts: 5,
        timeWindow: 600
      }
    }
  ])

  const [filter, setFilter] = useState({
    severity: '',
    type: '',
    resolved: false,
    search: ''
  })

  const [stats, setStats] = useState({
    totalAlerts: 4,
    criticalAlerts: 0,
    unresolvedAlerts: 3,
    todayAlerts: 4
  })

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'brute_force': return <AlertTriangle className="h-5 w-5" />
      case 'suspicious_ip': return <MapPin className="h-5 w-5" />
      case 'multiple_failures': return <User className="h-5 w-5" />
      default: return <AlertTriangle className="h-5 w-5" />
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const handleResolve = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ))
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter.severity && alert.severity !== filter.severity) return false
    if (filter.type && alert.type !== filter.type) return false
    if (filter.resolved !== undefined && alert.resolved !== filter.resolved) return false
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      return alert.title.toLowerCase().includes(searchLower) ||
             alert.description.toLowerCase().includes(searchLower) ||
             (alert.ipAddress && alert.ipAddress.includes(searchLower))
    }
    return true
  })

  return (
    <>
      <Head>
        <title>Security Alerts - Log Sentinel</title>
        <meta name="description" content="Security alerts and notifications" />
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
                  <Link href="/alerts" className="sentinel-nav-link-active">
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
            <h1 className="text-3xl font-bold text-gray-900">Security Alerts</h1>
            <p className="text-gray-600 mt-2">Real-time security notifications and threat alerts</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="sentinel-stat-card">
              <div className="text-2xl font-bold text-gray-900">{stats.totalAlerts}</div>
              <div className="text-sm text-gray-600">Total Alerts</div>
            </div>
            <div className="sentinel-stat-card">
              <div className="text-2xl font-bold text-red-500">{stats.criticalAlerts}</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
            <div className="sentinel-stat-card">
              <div className="text-2xl font-bold text-orange-500">{stats.unresolvedAlerts}</div>
              <div className="text-sm text-gray-600">Unresolved</div>
            </div>
            <div className="sentinel-stat-card">
              <div className="text-2xl font-bold text-sentinel-blue">{stats.todayAlerts}</div>
              <div className="text-sm text-gray-600">Today</div>
            </div>
          </div>

          {/* Filters */}
          <div className="sentinel-card mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <select
                value={filter.severity}
                onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sentinel-blue"
              >
                <option value="">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sentinel-blue"
              >
                <option value="">All Types</option>
                <option value="brute_force">Brute Force</option>
                <option value="suspicious_ip">Suspicious IP</option>
                <option value="multiple_failures">Multiple Failures</option>
              </select>

              <select
                value={filter.resolved}
                onChange={(e) => setFilter({ ...filter, resolved: e.target.value === '' ? undefined : e.target.value === 'true' })}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sentinel-blue"
              >
                <option value="">All Status</option>
                <option value="false">Unresolved</option>
                <option value="true">Resolved</option>
              </select>

              <div className="flex-1 max-w-xs">
                <div className="relative">
                  <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={filter.search}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    placeholder="Search alerts..."
                    className="w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sentinel-blue"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="sentinel-card">
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts Found</h3>
                  <p className="text-gray-600">
                    {filter.severity || filter.type || filter.search ? 'Try adjusting your filters' : 'No security alerts at this time'}
                  </p>
                </div>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div key={alert.id} className={`sentinel-card ${alert.resolved ? 'opacity-75' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <div className={`p-2 rounded-full mr-4 ${getSeverityColor(alert.severity)}`}>
                        {getTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">
                            {alert.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          {alert.resolved && (
                            <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              RESOLVED
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{alert.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(alert.timestamp)}
                          </div>
                          {alert.ipAddress && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {alert.ipAddress}
                            </div>
                          )}
                          {alert.metadata.country && (
                            <div className="flex items-center">
                              <span className="font-medium">{alert.metadata.country}</span>
                            </div>
                          )}
                          {alert.metadata.attempts && (
                            <div className="flex items-center">
                              <span className="font-medium">{alert.metadata.attempts} attempts</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="ml-4 sentinel-button-secondary flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredAlerts.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-sentinel-blue text-white rounded-md text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
