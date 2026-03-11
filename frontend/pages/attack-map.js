import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Shield, Globe, Activity, AlertTriangle, TrendingUp, MapPin } from 'lucide-react'

export default function AttackMap() {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [attackData, setAttackData] = useState([
    { country: 'United States', code: 'US', attacks: 456, lat: 37.0902, lng: -95.7129, risk: 'medium' },
    { country: 'China', code: 'CN', attacks: 234, lat: 35.8617, lng: 104.1954, risk: 'high' },
    { country: 'Russia', code: 'RU', attacks: 189, lat: 61.5240, lng: 105.3188, risk: 'high' },
    { country: 'Brazil', code: 'BR', attacks: 145, lat: -14.2350, lng: -51.9253, risk: 'medium' },
    { country: 'India', code: 'IN', attacks: 123, lat: 20.5937, lng: 78.9629, risk: 'medium' },
    { country: 'Germany', code: 'DE', attacks: 98, lat: 51.1657, lng: 10.4515, risk: 'low' },
    { country: 'France', code: 'FR', attacks: 87, lat: 46.2276, lng: 2.2137, risk: 'low' },
    { country: 'United Kingdom', code: 'GB', attacks: 76, lat: 55.3781, lng: -3.4360, risk: 'low' },
    { country: 'Japan', code: 'JP', attacks: 65, lat: 36.2048, lng: 138.2529, risk: 'medium' },
    { country: 'Canada', code: 'CA', attacks: 54, lat: 56.1304, lng: -106.3468, risk: 'low' },
    { country: 'Australia', code: 'AU', attacks: 43, lat: -25.2744, lng: 133.7751, risk: 'low' },
    { country: 'South Korea', code: 'KR', attacks: 38, lat: 35.9078, lng: 127.7669, risk: 'medium' },
    { country: 'Netherlands', code: 'NL', attacks: 32, lat: 52.1326, lng: 5.2913, risk: 'low' },
    { country: 'Turkey', code: 'TR', attacks: 28, lat: 38.9637, lng: 35.2433, risk: 'medium' },
    { country: 'Mexico', code: 'MX', attacks: 25, lat: 23.6345, lng: -102.5528, risk: 'medium' }
  ])

  const [realTimeAttacks, setRealTimeAttacks] = useState([
    { ip: '192.168.1.7', country: 'China', city: 'Beijing', timestamp: '2024-03-11T14:22:00Z', type: 'brute_force' },
    { ip: '10.0.0.25', country: 'Russia', city: 'Moscow', timestamp: '2024-03-11T14:20:00Z', type: 'suspicious_ip' },
    { ip: '172.16.0.3', country: 'Brazil', city: 'São Paulo', timestamp: '2024-03-11T14:18:00Z', type: 'brute_force' },
    { ip: '192.168.1.5', country: 'United States', city: 'New York', timestamp: '2024-03-11T14:15:00Z', type: 'multiple_failures' }
  ])

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-orange-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getRiskTextColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-orange-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getAttackIcon = (type) => {
    switch (type) {
      case 'brute_force': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'suspicious_ip': return <MapPin className="h-4 w-4 text-orange-500" />
      case 'multiple_failures': return <Activity className="h-4 w-4 text-yellow-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const totalAttacks = attackData.reduce((sum, country) => sum + country.attacks, 0)
  const highRiskCountries = attackData.filter(c => c.risk === 'high').length

  return (
    <>
      <Head>
        <title>Attack Map - Log Sentinel</title>
        <meta name="description" content="Geographic attack visualization" />
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Attack Map</h1>
            <p className="text-gray-600 mt-2">Geographic visualization of cyber attack sources</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="sentinel-stat-card">
              <div className="text-2xl font-bold text-gray-900">{totalAttacks.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Attacks</div>
            </div>
            <div className="sentinel-stat-card">
              <div className="text-2xl font-bold text-red-500">{highRiskCountries}</div>
              <div className="text-sm text-gray-600">High Risk Countries</div>
            </div>
            <div className="sentinel-stat-card">
              <div className="text-2xl font-bold text-orange-500">{attackData.length}</div>
              <div className="text-sm text-gray-600">Countries Affected</div>
            </div>
            <div className="sentinel-stat-card">
              <div className="text-2xl font-bold text-sentinel-blue">{realTimeAttacks.length}</div>
              <div className="text-sm text-gray-600">Active Threats</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* World Map Placeholder */}
            <div className="lg:col-span-2">
              <div className="sentinel-card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Global Attack Distribution</h2>
                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                  {/* Simple world map visualization */}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-200 opacity-50"></div>
                  
                  {/* Attack points */}
                  {attackData.map((country, index) => (
                    <div
                      key={country.code}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{
                        left: `${((country.lng + 180) / 360) * 100}%`,
                        top: `${((90 - country.lat) / 180) * 100}%`
                      }}
                      onClick={() => setSelectedCountry(country)}
                    >
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(country.risk)} animate-pulse`}></div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {country.country}: {country.attacks} attacks
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center z-10">
                    <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Interactive Attack Map</p>
                    <p className="text-sm text-gray-500">Click on attack points for details</p>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center space-x-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm text-gray-600">High Risk</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Medium Risk</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Low Risk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Country Details & Real-time Attacks */}
            <div className="space-y-6">
              {/* Selected Country Details */}
              {selectedCountry ? (
                <div className="sentinel-card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedCountry.country}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Attacks:</span>
                      <span className="font-semibold">{selectedCountry.attacks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Level:</span>
                      <span className={`font-semibold ${getRiskTextColor(selectedCountry.risk)}`}>
                        {selectedCountry.risk.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attack Percentage:</span>
                      <span className="font-semibold">
                        {((selectedCountry.attacks / totalAttacks) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="sentinel-card">
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Country</h3>
                    <p className="text-gray-600 text-sm">
                      Click on an attack point on the map to see details
                    </p>
                  </div>
                </div>
              )}

              {/* Real-time Attacks */}
              <div className="sentinel-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Attacks</h3>
                <div className="space-y-3">
                  {realTimeAttacks.map((attack, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getAttackIcon(attack.type)}
                          <span className="ml-2 font-medium text-gray-900">{attack.ip}</span>
                        </div>
                        <span className="text-xs text-gray-500">{formatTime(attack.timestamp)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {attack.city}, {attack.country}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Countries Table */}
          <div className="mt-8 sentinel-card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Attack Sources</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Country</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Attacks</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Percentage</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Risk Level</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {attackData.slice(0, 10).map((country) => (
                    <tr key={country.code} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${getRiskColor(country.risk)}`}></div>
                          {country.country}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{country.attacks}</td>
                      <td className="py-3 px-4">
                        {((country.attacks / totalAttacks) * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskTextColor(country.risk)} bg-opacity-10 ${getRiskColor(country.risk).replace('bg-', 'bg-opacity-10 text-')}`}>
                          {country.risk.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-sm text-red-600">+12%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
