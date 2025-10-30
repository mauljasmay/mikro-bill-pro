import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get dashboard statistics
    const [
      totalUsers,
      activeUsers,
      totalRevenue,
      activeSubscriptions,
      expiredSubscriptions
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { status: 'ACTIVE' } }),
      db.transaction.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true }
      }),
      db.subscription.count({ where: { status: 'ACTIVE' } }),
      db.subscription.count({ where: { status: 'EXPIRED' } })
    ])

    // Get recent transactions
    const recentTransactions = await db.transaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        subscription: {
          include: {
            package: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    // Get package statistics
    const packageStats = await db.package.findMany({
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE'
          }
        }
      }
    })

    // Get Mikrotik connection status
    let mikrotikStatus = 'disconnected'
    try {
      const { getMikrotikConnection } = await import('@/lib/mikrotik')
      const mikrotik = await getMikrotikConnection()
      await mikrotik.testConnection()
      mikrotikStatus = 'connected'
    } catch (error) {
      mikrotikStatus = 'error'
    }

    // Get current month revenue
    const currentMonth = new Date()
    currentMonth.setDate(1) // First day of current month
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    
    const revenueThisMonth = await db.transaction.aggregate({
      where: {
        status: 'SUCCESS',
        createdAt: {
          gte: currentMonth,
          lt: nextMonth
        }
      },
      _sum: { amount: true }
    })

    // Get new users today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const newUsersToday = await db.user.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    const stats = {
      totalUsers,
      activeUsers,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeSubscriptions,
      expiredSubscriptions,
      systemUptime: mikrotikStatus === 'connected' ? '99.9%' : '0%',
      mikrotikStatus,
      revenueThisMonth: revenueThisMonth._sum.amount || 0,
      newUsersToday
    }

    return NextResponse.json({
      success: true,
      stats,
      recentTransactions,
      packageStats: packageStats.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        type: pkg.type,
        price: pkg.price,
        activeSubscriptions: pkg.subscriptions.length
      }))
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to fetch dashboard data'
    }, { status: 500 })
  }
}