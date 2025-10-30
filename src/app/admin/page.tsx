'use client'

import { useState, useEffect } from 'react'
import { 
  Router, Settings, Users, Package, CreditCard, Activity, BarChart3,
  Plus, Edit, Trash2, Eye, Power, PowerOff, RefreshCw, CheckCircle, XCircle,
  Server, Wifi, Globe, Shield, AlertCircle, TrendingUp, Download, Upload
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mikrotikConfig, setMikrotikConfig] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    systemUptime: '0%'
  })

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { id: 'packages', label: 'Packages', icon: <Package className="w-5 h-5" /> },
    { id: 'mikrotik', label: 'Mikrotik', icon: <Router className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transactions', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'monitoring', label: 'Monitoring', icon: <Activity className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ]

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch dashboard stats
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const testMikrotikConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/mikrotik/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mikrotikConfig)
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Connection successful!')
      } else {
        alert('Connection failed: ' + data.message)
      }
    } catch (error) {
      alert('Connection test failed: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
          <p className="text-gray-600">Total Users</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.activeUsers}</h3>
          <p className="text-gray-600">Active Users</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+25%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Rp {stats.totalRevenue.toLocaleString('id-ID')}</h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Server className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">Online</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.systemUptime}</h3>
          <p className="text-gray-600">System Uptime</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">User #{1000 + i}</p>
                    <p className="text-sm text-gray-600">Home Package</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">Rp 100.000</p>
                  <p className="text-sm text-gray-600">2 min ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Router className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Mikrotik Connection</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Payment Gateway</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700">Database</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">SSL Certificate</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Valid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMikrotikConfig = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mikrotik Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Host/IP Address</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="192.168.1.1"
              value={mikrotikConfig?.host || ''}
              onChange={(e) => setMikrotikConfig({...mikrotikConfig, host: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="8728"
              value={mikrotikConfig?.port || ''}
              onChange={(e) => setMikrotikConfig({...mikrotikConfig, port: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin"
              value={mikrotikConfig?.username || ''}
              onChange={(e) => setMikrotikConfig({...mikrotikConfig, username: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="password"
              value={mikrotikConfig?.password || ''}
              onChange={(e) => setMikrotikConfig({...mikrotikConfig, password: e.target.value})}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              checked={mikrotikConfig?.useSSL || false}
              onChange={(e) => setMikrotikConfig({...mikrotikConfig, useSSL: e.target.checked})}
            />
            <span className="text-gray-700">Use SSL/TLS</span>
          </label>
          
          <button
            onClick={testMikrotikConnection}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              'Test Connection'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PPPoE Users</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">user{i}@isp</p>
                    <p className="text-sm text-gray-600">10Mbps • Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <PowerOff className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotspot Users</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">hotspot{i}</p>
                    <p className="text-sm text-gray-600">5Mbps • 2.3GB used</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <PowerOff className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <Router className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">MikroBill Pro</h1>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'packages' && 'Package Management'}
              {activeTab === 'mikrotik' && 'Mikrotik Configuration'}
              {activeTab === 'transactions' && 'Transactions'}
              {activeTab === 'monitoring' && 'System Monitoring'}
              {activeTab === 'settings' && 'System Settings'}
            </h1>
            <p className="text-gray-600 mt-2">
              {activeTab === 'dashboard' && 'Overview of your ISP business'}
              {activeTab === 'users' && 'Manage your customers and their subscriptions'}
              {activeTab === 'packages' && 'Create and manage internet packages'}
              {activeTab === 'mikrotik' && 'Configure Mikrotik RouterOS integration'}
              {activeTab === 'transactions' && 'View payment history and transactions'}
              {activeTab === 'monitoring' && 'Real-time system monitoring and analytics'}
              {activeTab === 'settings' && 'System configuration and preferences'}
            </p>
          </div>

          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'mikrotik' && renderMikrotikConfig()}
          
          {activeTab !== 'dashboard' && activeTab !== 'mikrotik' && (
            <div className="bg-white p-12 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module
              </h3>
              <p className="text-gray-600">
                This module is under development. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}