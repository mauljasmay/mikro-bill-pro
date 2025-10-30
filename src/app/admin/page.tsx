'use client'

import { useState, useEffect } from 'react'
import { 
  Router, Settings, Users, Package, CreditCard, Activity, BarChart3,
  Plus, Edit, Trash2, Eye, Power, PowerOff, RefreshCw, CheckCircle, XCircle,
  Server, Wifi, Globe, Shield, AlertCircle, TrendingUp, Download, Upload,
  Loader2, Search, Filter, ChevronDown, UserPlus, DollarSign, Clock
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mikrotikConfig, setMikrotikConfig] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [packages, setPackages] = useState([])
  const [mikrotikUsers, setMikrotikUsers] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    systemUptime: '0%',
    newUsersToday: 0,
    revenueThisMonth: 0
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
    fetchUsers()
    fetchTransactions()
    fetchPackages()
    fetchMikrotikUsers()
    
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchDashboardData()
      fetchMikrotikUsers()
    }, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/admin/transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      if (response.ok) {
        const data = await response.json()
        setPackages(data.packages || [])
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error)
    }
  }

  const fetchMikrotikUsers = async () => {
    try {
      const response = await fetch('/api/mikrotik/users')
      if (response.ok) {
        const data = await response.json()
        setMikrotikUsers(data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch Mikrotik users:', error)
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
        showNotification('Connection successful!', 'success')
      } else {
        showNotification('Connection failed: ' + data.message, 'error')
      }
    } catch (error) {
      showNotification('Connection test failed: ' + error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        showNotification(`User ${action} successful!`, 'success')
        fetchUsers()
        fetchMikrotikUsers()
      } else {
        showNotification(`Failed to ${action} user`, 'error')
      }
    } catch (error) {
      showNotification(`Action failed: ${error.message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
          <p className="text-gray-600">Total Users</p>
          <div className="mt-2 text-sm text-gray-500">
            +{stats.newUsersToday} new today
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +8%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.activeUsers}</h3>
          <p className="text-gray-600">Active Users</p>
          <div className="mt-2 text-sm text-gray-500">
            Online now
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +25%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Rp {stats.totalRevenue.toLocaleString('id-ID')}</h3>
          <p className="text-gray-600">Total Revenue</p>
          <div className="mt-2 text-sm text-gray-500">
            Rp {stats.revenueThisMonth.toLocaleString('id-ID')} this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Server className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">Online</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.systemUptime}</h3>
          <p className="text-gray-600">System Uptime</p>
          <div className="mt-2 text-sm text-gray-500">
            All systems operational
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button 
              onClick={fetchTransactions}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.slice(0, 5).map((transaction: any, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.status === 'SUCCESS' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {transaction.status === 'SUCCESS' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.customerName || 'User'}</p>
                      <p className="text-sm text-gray-600">{transaction.packageName || 'Package'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">Rp {transaction.amount?.toLocaleString('id-ID') || '0'}</p>
                    <p className="text-sm text-gray-600">{new Date(transaction.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600">Live</span>
            </div>
          </div>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-red-600" />
                <span className="text-gray-700">API Response</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">45ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bandwidth Usage Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Upload className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">2.4 Gbps</span>
            </div>
            <p className="text-gray-600">Total Upload</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Download className="w-8 h-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">8.7 Gbps</span>
            </div>
            <p className="text-gray-600">Total Download</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-8 h-8 text-purple-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">{mikrotikUsers.length}</span>
            </div>
            <p className="text-gray-600">Connected Devices</p>
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
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm animate-pulse ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : notification.type === 'error' ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

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