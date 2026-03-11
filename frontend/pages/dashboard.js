import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Shield, Activity, AlertTriangle, Map, TrendingUp, Users, Globe, Clock } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    loginAttemptsToday: 245,
    failedLoginsToday: 67,
    suspiciousIPsToday: 4,
    bruteForceAlerts: 2
  })
  
  const [recentActivity, setRecentActivity] = useState([
    { ipAddress: '192.168.1.5', timestamp: '2024-03-11T14:22:00Z', success: false, suspicious: true, country: 'US' },
    { ipAddress: '10.0.0.15', timestamp: '2024-03-11T14:20:00Z', success: true, suspicious: false, country: 'US' },
    { ipAddress: '192.168.1.7', timestamp: '2024-03-11T14:18:00Z', success: false, suspicious: true, country: 'CN' },
    { ipAddress: '172.16.0.3', timestamp: '2024-03-11T14:15:00Z', success: true, suspicious: false, country: 'US' },
  ])

  const [threatDistribution, setThreatDistribution] = useState([
    { _id: 'low', count: 180 },
    { _id: 'medium', count: 45 },
    { _id: 'high', count: 18 },
    { _id: 'critical', count: 2 }
  ])

  const [geoDistribution, setGeoDistribution] = useState([
    { _id: 'US', count: 156 },
    { _id: 'CN', count: 34 },
    { _id: 'RU', count: 28 },
    { _id: 'BR', count: 15 },
    { _id: 'IN', count: 12 }
  ])

  useEffect(() => {
    // In a real app, fetch data from API
    // fetchDashboardData()
  }, [])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-500'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <>
      <Head>
        <title>Dashboard - Log Sentinel</title>
        <meta name="description" content="Security monitoring dashboard" />
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
                  <Link href="/dashboard" className="sentinel-nav-link-active">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time monitoring of login security threats</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="sentinel-stat-card">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-sentinel-blue mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.loginAttemptsToday}</div>
                  <div className="text-sm text-gray-600">Login Attempts Today</div>
                </div>
              </div>
            </div>

            <div className="sentinel-stat-card">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-sentinel-warning mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.failedLoginsToday}</div>
                  <div className="text-sm text-gray-600">Failed Logins</div>
                </div>
              </div>
            </div>

            <div className="sentinel-stat-card">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-sentinel-alert mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.suspiciousIPsToday}</div>
                  <div className="text-sm text-gray-600">Suspicious IPs</div>
                </div>
              </div>
            </div>

            <div className="sentinel-stat-card">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-red-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.bruteForceAlerts}</div>
                  <div className="text-sm text-gray-600">Brute Force Alerts</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="sentinel-card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          activity.success ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <div className="font-medium text-gray-900">{activity.ipAddress}</div>
                          <div className="text-sm text-gray-600">
                            {activity.country} • {formatTime(activity.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {activity.suspicious && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full mr-2">
                            Suspicious
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          activity.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {activity.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Threat Distribution */}
            <div>
              <div className="sentinel-card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Threat Distribution</h2>
                <div className="space-y-3">
                  {threatDistribution.map((threat) => (
                    <div key={threat._id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${getSeverityColor(threat._id)}`}></div>
                        <span className="text-gray-700 capitalize">{threat._id}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{threat.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="sentinel-card mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Countries</h2>
                <div className="space-y-3">
                  {geoDistribution.map((country) => (
                    <div key={country._id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">{country._id}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{country.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <div className="sentinel-card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/analyzer" className="sentinel-button-primary text-center">
                  Analyze New Logs
                </Link>
                <Link href="/alerts" className="sentinel-button-secondary text-center">
                  View All Alerts
                </Link>
                <Link href="/reports" className="sentinel-button-secondary text-center">
                  Generate Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
