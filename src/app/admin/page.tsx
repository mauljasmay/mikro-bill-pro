'use client'

import { useState, useEffect } from 'react'
import { 
  Router, Settings, Users, Package, CreditCard, Activity, BarChart3,
  Plus, Edit, Trash2, Eye, Power, PowerOff, RefreshCw, CheckCircle, XCircle,
  Server, Wifi, Globe, Shield, AlertCircle, TrendingUp, Download, Upload,
  Loader2, Search, Filter, ChevronDown, UserPlus, DollarSign, Clock,
  Menu, X
} from 'lucide-react'
import ErrorBoundary, { useErrorHandler } from '@/components/ErrorBoundary'
import LoadingFallback, { SkeletonCard, SkeletonTable } from '@/components/LoadingFallback'
import NetworkErrorFallback, { ApiErrorFallback } from '@/components/NetworkErrorFallback'
import { ThemeToggle, ThemeToggleMobile } from '@/components/ThemeToggle'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mikrotikConfig, setMikrotikConfig] = useState({
    host: '',
    port: 8728,
    username: '',
    password: '',
    useSSL: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [packages, setPackages] = useState([])
  const [mikrotikUsers, setMikrotikUsers] = useState([])
  const [fetchErrors, setFetchErrors] = useState<{ [key: string]: Error | null }>({})
  const { handleError } = useErrorHandler()
  
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
    const loadInitialData = async () => {
      setIsInitialLoading(true)
      setFetchErrors({})
      
      try {
        await Promise.all([
          fetchDashboardData(),
          fetchUsers(),
          fetchTransactions(),
          fetchPackages(),
          fetchMikrotikUsers()
        ])
      } catch (error) {
        console.error('Failed to load initial data:', error)
      } finally {
        setIsInitialLoading(false)
      }
    }
    
    loadInitialData()
    
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchDashboardData().catch(console.error)
      fetchMikrotikUsers().catch(console.error)
    }, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalUsers: data.stats?.totalUsers ?? 0,
          activeUsers: data.stats?.activeUsers ?? 0,
          totalRevenue: data.stats?.totalRevenue ?? 0,
          systemUptime: data.stats?.systemUptime ?? '0%',
          newUsersToday: data.stats?.newUsersToday ?? 0,
          revenueThisMonth: data.stats?.revenueThisMonth ?? 0
        })
        setFetchErrors(prev => ({ ...prev, dashboard: null }))
      } else {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`)
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setFetchErrors(prev => ({ ...prev, dashboard: err }))
      console.error('Failed to fetch dashboard data:', err)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
        setFetchErrors(prev => ({ ...prev, users: null }))
      } else {
        throw new Error(`Failed to fetch users: ${response.status}`)
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setFetchErrors(prev => ({ ...prev, users: err }))
      console.error('Failed to fetch users:', err)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/admin/transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
        setFetchErrors(prev => ({ ...prev, transactions: null }))
      } else {
        throw new Error(`Failed to fetch transactions: ${response.status}`)
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setFetchErrors(prev => ({ ...prev, transactions: err }))
      console.error('Failed to fetch transactions:', err)
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      if (response.ok) {
        const data = await response.json()
        setPackages(data.packages || [])
        setFetchErrors(prev => ({ ...prev, packages: null }))
      } else {
        throw new Error(`Failed to fetch packages: ${response.status}`)
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setFetchErrors(prev => ({ ...prev, packages: err }))
      console.error('Failed to fetch packages:', err)
    }
  }

  const fetchMikrotikUsers = async () => {
    try {
      const response = await fetch('/api/mikrotik/users')
      if (response.ok) {
        const data = await response.json()
        setMikrotikUsers(data.users || [])
        setFetchErrors(prev => ({ ...prev, mikrotik: null }))
      } else {
        throw new Error(`Failed to fetch Mikrotik users: ${response.status}`)
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setFetchErrors(prev => ({ ...prev, mikrotik: err }))
      console.error('Failed to fetch Mikrotik users:', err)
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  const testMikrotikConnection = async () => {
    setIsLoading(true)
    try {
      // Validate config first
      if (!mikrotikConfig?.host || !mikrotikConfig?.username || !mikrotikConfig?.password) {
        showNotification('Please fill in all required fields (host, username, password)', 'error')
        return
      }

      const response = await fetch('/api/mikrotik/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mikrotikConfig)
      })
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format')
      }
      
      const data = await response.json()
      if (data.success) {
        showNotification(`Connection successful! Connected to ${data.data?.connectionDetails?.host}:${data.data?.connectionDetails?.port}`, 'success')
      } else {
        showNotification('Connection failed: ' + data.message, 'error')
      }
    } catch (error) {
      console.error('Mikrotik connection test error:', error)
      let errorMessage = 'Connection test failed'
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error - check your connection'
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Server error - please try again later'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      showNotification(errorMessage, 'error')
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

  // Filter and paginate users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const renderUsers = () => {
    if (isInitialLoading) {
      return <SkeletonTable rows={5} />
    }

    if (fetchErrors.users) {
      return (
        <ApiErrorFallback 
          error={fetchErrors.users} 
          onRetry={fetchUsers}
          action="load users"
        />
      )
    }

    return (
      <div className="space-y-6">
        {/* Search and Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{user.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.package || 'Basic'}</div>
                      <div className="text-sm text-gray-500">{user.speed || '10Mbps'}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'inactive'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                          className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {user.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 sm:px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm border">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

  const renderTransactions = () => (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.slice(0, 10).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{transaction.id?.slice(0, 8) || 'TXN000000'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.customerName || 'Guest User'}</div>
                      <div className="text-sm text-gray-500">{transaction.customerEmail || 'N/A'}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.packageName || 'Basic Package'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {(Number(transaction.amount) || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status || 'completed'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No transactions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderDashboard = () => {
    if (isInitialLoading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <SkeletonTable rows={3} />
            <SkeletonTable rows={3} />
          </div>
        </div>
      )
    }

    if (fetchErrors.dashboard) {
      return (
        <ApiErrorFallback 
          error={fetchErrors.dashboard} 
          onRetry={fetchDashboardData}
          action="load dashboard data"
        />
      )
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <span className="text-xs sm:text-sm text-green-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                +12%
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
            <p className="text-sm sm:text-base text-gray-600">Total Users</p>
            <div className="mt-2 text-xs sm:text-sm text-gray-500">
              +{stats.newUsersToday} new today
            </div>
          </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <span className="text-xs sm:text-sm text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              +8%
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.activeUsers}</h3>
          <p className="text-sm sm:text-base text-gray-600">Active Users</p>
          <div className="mt-2 text-xs sm:text-sm text-gray-500">
            Online now
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <span className="text-xs sm:text-sm text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              +25%
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Rp {(Number(stats.totalRevenue) || 0).toLocaleString('id-ID')}</h3>
          <p className="text-sm sm:text-base text-gray-600">Total Revenue</p>
          <div className="mt-2 text-xs sm:text-sm text-gray-500">
            Rp {(Number(stats.revenueThisMonth) || 0).toLocaleString('id-ID')} this month
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
              <Server className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <span className="text-xs sm:text-sm text-green-600 font-medium">Online</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.systemUptime}</h3>
          <p className="text-sm sm:text-base text-gray-600">System Uptime</p>
          <div className="mt-2 text-xs sm:text-sm text-gray-500">
            All systems operational
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h3>
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
                    <p className="font-semibold text-gray-900">Rp {(Number(transaction.amount) || 0).toLocaleString('id-ID')}</p>
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
}

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

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Router className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">MikroBill Pro</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggleMobile />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 bg-white dark:bg-gray-900 shadow-lg min-h-screen lg:min-h-0`}>
          <div className="p-4 lg:p-6">
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Router className="w-8 h-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">MikroBill Pro</h1>
              </div>
              <ThemeToggle />
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium text-sm lg:text-base">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 bg-gray-50 dark:bg-gray-800">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white capitalize">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'packages' && 'Package Management'}
              {activeTab === 'mikrotik' && 'Mikrotik Configuration'}
              {activeTab === 'transactions' && 'Transactions'}
              {activeTab === 'monitoring' && 'System Monitoring'}
              {activeTab === 'settings' && 'System Settings'}
            </h1>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mt-2">
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
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'transactions' && renderTransactions()}
          {activeTab === 'mikrotik' && renderMikrotikConfig()}
          
          {activeTab !== 'dashboard' && activeTab !== 'users' && activeTab !== 'transactions' && activeTab !== 'mikrotik' && (
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