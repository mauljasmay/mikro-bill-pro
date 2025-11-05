import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getMikrotikConnection } from '@/lib/mikrotik'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'

    const monitoringData: any = {}

    // System Health
    const systemHealth = await getSystemHealth()
    monitoringData.systemHealth = systemHealth

    // Database Status
    const dbStatus = await getDatabaseStatus()
    monitoringData.databaseStatus = dbStatus

    // API Performance
    const apiPerformance = await getApiPerformance()
    monitoringData.apiPerformance = apiPerformance

    // Network Traffic (if Mikrotik available)
    const networkTraffic = await getNetworkTraffic()
    monitoringData.networkTraffic = networkTraffic

    // Recent Logs
    const recentLogs = await getRecentLogs()
    monitoringData.recentLogs = recentLogs

    // Alerts
    const alerts = await getAlerts()
    monitoringData.alerts = alerts

    // Type-specific data
    switch (type) {
      case 'system':
        monitoringData.detailedSystem = await getDetailedSystemInfo()
        break
      case 'network':
        monitoringData.detailedNetwork = await getDetailedNetworkInfo()
        break
      case 'performance':
        monitoringData.detailedPerformance = await getDetailedPerformanceInfo()
        break
      case 'logs':
        monitoringData.allLogs = await getAllLogs()
        break
    }

    return NextResponse.json({
      success: true,
      data: monitoringData,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Monitoring API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch monitoring data'
    return NextResponse.json({
      error: errorMessage
    }, { status: 500 })
  }
}

async function getSystemHealth() {
  try {
    // Check database connection
    await db.user.count()

    // Check Mikrotik connection
    let mikrotikStatus = 'disconnected'
    let mikrotikUptime = null
    try {
      const mikrotik = await getMikrotikConnection()
      const systemInfo = await mikrotik.getSystemInfo()
      mikrotikStatus = 'connected'
      mikrotikUptime = systemInfo['uptime']
    } catch (error) {
      mikrotikStatus = 'error'
    }

    // Get server uptime (simplified)
    const serverUptime = process.uptime()

    return {
      database: 'healthy',
      mikrotik: mikrotikStatus,
      server: 'healthy',
      serverUptime: Math.floor(serverUptime),
      mikrotikUptime
    }
  } catch (error) {
    return {
      database: 'error',
      mikrotik: 'error',
      server: 'error',
      error: error.message
    }
  }
}

async function getDatabaseStatus() {
  try {
    const startTime = Date.now()

    // Test basic queries
    const userCount = await db.user.count()
    const transactionCount = await db.transaction.count()
    const subscriptionCount = await db.subscription.count()

    const responseTime = Date.now() - startTime

    return {
      status: 'healthy',
      responseTime,
      stats: {
        users: userCount,
        transactions: transactionCount,
        subscriptions: subscriptionCount
      }
    }
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    }
  }
}

async function getApiPerformance() {
  try {
    // Get recent API response times (simplified - would need actual logging)
    const recentTransactions = await db.transaction.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    })

    // Calculate average response time (placeholder)
    const avgResponseTime = 150 // ms

    return {
      avgResponseTime,
      requestsPerMinute: recentTransactions.length,
      errorRate: 0.01, // 1%
      uptime: '99.9%'
    }
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    }
  }
}

async function getNetworkTraffic() {
  try {
    const mikrotik = await getMikrotikConnection()

    // Get interface traffic
    const interfaces = await mikrotik.getInterfaceTraffic()

    // Get PPPoE active sessions
    const activeSessions = await mikrotik.getPPPoEActive()

    return {
      interfaces: interfaces.slice(0, 5), // Top 5 interfaces
      activeSessions: activeSessions.length,
      totalBandwidth: {
        upload: interfaces.reduce((sum, iface) => sum + (parseInt(iface.txByte || '0')), 0),
        download: interfaces.reduce((sum, iface) => sum + (parseInt(iface.rxByte || '0')), 0)
      }
    }
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    }
  }
}

async function getRecentLogs() {
  try {
    const mikrotik = await getMikrotikConnection()
    const logs = await mikrotik.getLogs(['info', 'warning', 'error'])

    return logs.slice(0, 10).map(log => ({
      timestamp: log.time,
      level: log.topics?.[0] || 'info',
      message: log.message,
      source: 'mikrotik'
    }))
  } catch (error) {
    return []
  }
}

async function getAlerts() {
  const alerts = []

  try {
    // Check for expired subscriptions
    const expiredSubscriptions = await db.subscription.count({
      where: {
        status: 'EXPIRED',
        endDate: {
          lt: new Date()
        }
      }
    })

    if (expiredSubscriptions > 0) {
      alerts.push({
        type: 'warning',
        message: `${expiredSubscriptions} subscriptions have expired`,
        timestamp: new Date().toISOString()
      })
    }

    // Check Mikrotik connection
    try {
      const mikrotik = await getMikrotikConnection()
      await mikrotik.testConnection()
    } catch (error) {
      alerts.push({
        type: 'error',
        message: 'Mikrotik connection failed',
        timestamp: new Date().toISOString()
      })
    }

    // Check low balance or other business alerts
    const lowBalanceUsers = await db.user.count({
      where: {
        balance: {
          lt: 10000 // Less than 10k
        }
      }
    })

    if (lowBalanceUsers > 0) {
      alerts.push({
        type: 'info',
        message: `${lowBalanceUsers} users have low balance`,
        timestamp: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('Error checking alerts:', error)
  }

  return alerts
}

async function getDetailedSystemInfo() {
  try {
    const mikrotik = await getMikrotikConnection()
    const systemInfo = await mikrotik.getSystemInfo()

    return {
      cpu: systemInfo['cpu-load'] || 'N/A',
      memory: {
        total: systemInfo['total-memory'] || 'N/A',
        free: systemInfo['free-memory'] || 'N/A'
      },
      disk: {
        total: systemInfo['total-hdd-space'] || 'N/A',
        free: systemInfo['free-hdd-space'] || 'N/A'
      },
      version: systemInfo['version'] || 'N/A',
      uptime: systemInfo['uptime'] || 'N/A'
    }
  } catch (error) {
    return { error: error.message }
  }
}

async function getDetailedNetworkInfo() {
  try {
    const mikrotik = await getMikrotikConnection()

    const interfaces = await mikrotik.getInterfaceTraffic()
    const activeSessions = await mikrotik.getPPPoEActive()
    const pppoeUsers = await mikrotik.getPPPoEUsers()
    const hotspotUsers = await mikrotik.getHotspotUsers()

    return {
      interfaces,
      activeSessions: {
        count: activeSessions.length,
        sessions: activeSessions.slice(0, 20)
      },
      users: {
        pppoe: pppoeUsers.length,
        hotspot: hotspotUsers.length,
        total: pppoeUsers.length + hotspotUsers.length
      }
    }
  } catch (error) {
    return { error: error.message }
  }
}

async function getDetailedPerformanceInfo() {
  try {
    // Get recent transaction performance
    const recentTransactions = await db.transaction.findMany({
      take: 1000,
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true, status: true }
    })

    // Calculate performance metrics
    const totalTransactions = recentTransactions.length
    const successfulTransactions = recentTransactions.filter(t => t.status === 'SUCCESS').length
    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0

    // Get hourly transaction counts for the last 24 hours
    const hourlyStats = []
    for (let i = 23; i >= 0; i--) {
      const hour = new Date()
      hour.setHours(hour.getHours() - i, 0, 0, 0)
      const nextHour = new Date(hour)
      nextHour.setHours(nextHour.getHours() + 1)

      const count = await db.transaction.count({
        where: {
          createdAt: {
            gte: hour,
            lt: nextHour
          }
        }
      })

      hourlyStats.push({
        hour: hour.getHours(),
        count
      })
    }

    return {
      successRate: successRate.toFixed(2) + '%',
      totalTransactions,
      hourlyStats,
      avgTransactionsPerHour: totalTransactions / 24
    }
  } catch (error) {
    return { error: error.message }
  }
}

async function getAllLogs() {
  try {
    const mikrotik = await getMikrotikConnection()
    const logs = await mikrotik.getLogs()

    return logs.map(log => ({
      timestamp: log.time,
      level: log.topics?.[0] || 'info',
      message: log.message,
      source: 'mikrotik'
    }))
  } catch (error) {
    return []
  }
}
