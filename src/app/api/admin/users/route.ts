import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Fetch users with their active subscriptions and packages
    const users = await db.user.findMany({
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE'
          },
          include: {
            package: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1 // Get the most recent active subscription
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format the response to match dashboard expectations
    const formattedUsers = users.map(user => {
      const activeSubscription = user.subscriptions[0] // Most recent active subscription
      const packageInfo = activeSubscription?.package

      return {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
        balance: user.balance,
        package: packageInfo?.name || 'No Package',
        speed: packageInfo?.speedLimit || 'N/A',
        createdAt: user.createdAt.toISOString(),
        subscriptionEndDate: activeSubscription?.endDate?.toISOString() || null,
        mikrotikId: user.mikrotikId
      }
    })

    return NextResponse.json({
      success: true,
      users: formattedUsers
    })
  } catch (error) {
    console.error('Get users API error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to fetch users'
    }, { status: 500 })
  }
}
