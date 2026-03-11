import Head from 'next/head'
import Link from 'next/link'
import { Shield, AlertTriangle, Activity, Map, FileText, Upload, BarChart3, Lock } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Head>
        <title>Log Sentinel - Login Security Monitoring Dashboard</title>
        <meta name="description" content="Intelligent Login Security Monitoring and Threat Detection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-sentinel-dark to-gray-900">
        {/* Navigation */}
        <nav className="bg-sentinel-dark/90 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-sentinel-blue mr-3" />
                <span className="text-white font-bold text-xl">Log Sentinel</span>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
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
                  <Link href="/dashboard" className="sentinel-button-primary">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Log Sentinel
                <span className="block text-3xl md:text-4xl text-sentinel-blue mt-2">
                  Protecting Login Systems from Cyber Attacks
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Intelligent Login Security Monitoring and Threat Detection. 
                Think of it as a mini Splunk or Security Onion focused on login security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard" className="sentinel-button-primary text-lg px-8 py-3">
                  View Dashboard
                </Link>
                <Link href="/analyzer" className="sentinel-button-secondary text-lg px-8 py-3 bg-white/10 text-white border-white/20 hover:bg-white/20">
                  Analyze Logs
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Why Login Security Matters</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                In today's threat landscape, login credentials are the primary target for cyber attackers. 
                Real-time monitoring and threat detection are essential for protecting your systems.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="sentinel-card bg-gray-800/90 border-gray-700">
                <div className="flex items-center mb-4">
                  <Activity className="h-8 w-8 text-sentinel-blue mr-3" />
                  <h3 className="text-xl font-semibold text-white">Real-time Monitoring</h3>
                </div>
                <p className="text-gray-300">
                  Track login attempts as they happen, identify suspicious patterns, and respond to threats immediately.
                </p>
              </div>

              <div className="sentinel-card bg-gray-800/90 border-gray-700">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-sentinel-warning mr-3" />
                  <h3 className="text-xl font-semibold text-white">Brute Force Detection</h3>
                </div>
                <p className="text-gray-300">
                  Automatically detect and block brute force attacks with our advanced pattern recognition algorithms.
                </p>
              </div>

              <div className="sentinel-card bg-gray-800/90 border-gray-700">
                <div className="flex items-center mb-4">
                  <Map className="h-8 w-8 text-sentinel-success mr-3" />
                  <h3 className="text-xl font-semibold text-white">Geographic Analysis</h3>
                </div>
                <p className="text-gray-300">
                  Visualize attack sources on a world map and identify geographic patterns in security threats.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-16">Core Features</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="sentinel-card bg-gray-800/90 border-gray-700 text-center">
                <BarChart3 className="h-12 w-12 text-sentinel-blue mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Dashboard Analytics</h3>
                <p className="text-gray-300 text-sm">
                  Real-time statistics and visualizations of login security metrics
                </p>
              </div>

              <div className="sentinel-card bg-gray-800/90 border-gray-700 text-center">
                <Upload className="h-12 w-12 text-sentinel-blue mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Log Analysis</h3>
                <p className="text-gray-300 text-sm">
                  Upload and analyze security logs for threat detection
                </p>
              </div>

              <div className="sentinel-card bg-gray-800/90 border-gray-700 text-center">
                <AlertTriangle className="h-12 w-12 text-sentinel-warning mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Security Alerts</h3>
                <p className="text-gray-300 text-sm">
                  Real-time notifications of potential security threats
                </p>
              </div>

              <div className="sentinel-card bg-gray-800/90 border-gray-700 text-center">
                <FileText className="h-12 w-12 text-sentinel-blue mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Security Reports</h3>
                <p className="text-gray-300 text-sm">
                  Comprehensive reports with security recommendations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Dashboard Preview */}
        <div className="py-20 bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Demo Dashboard Preview</h2>
              <p className="text-gray-300 text-lg">
                Get a glimpse of our powerful security monitoring dashboard
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="sentinel-stat-card bg-gray-800/90 border-gray-700">
                <div className="text-3xl font-bold text-sentinel-blue mb-2">245</div>
                <div className="text-gray-300 text-sm">Login Attempts Today</div>
              </div>
              <div className="sentinel-stat-card bg-gray-800/90 border-gray-700">
                <div className="text-3xl font-bold text-sentinel-warning mb-2">67</div>
                <div className="text-gray-300 text-sm">Failed Logins</div>
              </div>
              <div className="sentinel-stat-card bg-gray-800/90 border-gray-700">
                <div className="text-3xl font-bold text-sentinel-alert mb-2">4</div>
                <div className="text-gray-300 text-sm">Suspicious IPs</div>
              </div>
              <div className="sentinel-stat-card bg-gray-800/90 border-gray-700">
                <div className="text-3xl font-bold text-red-500 mb-2">2</div>
                <div className="text-gray-300 text-sm">Brute Force Alerts</div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/dashboard" className="sentinel-button-primary text-lg px-8 py-3">
                View Full Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Detect. Analyze. Protect.
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start monitoring your login security today and stay ahead of cyber threats.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="sentinel-button-primary text-lg px-8 py-3">
                Start Monitoring
              </Link>
              <Link href="/analyzer" className="sentinel-button-secondary text-lg px-8 py-3 bg-white/10 text-white border-white/20 hover:bg-white/20">
                Try Log Analyzer
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-sentinel-dark border-t border-gray-700 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-400">
              <p>&copy; 2024 Log Sentinel. Intelligent Login Security Monitoring.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
