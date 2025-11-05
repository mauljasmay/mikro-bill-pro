import { NextRequest, NextResponse } from 'next/server'
import { getMikrotikConnection } from '@/lib/mikrotik'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Check if Mikrotik config exists first
    const config = await db.mikrotikConfig.findFirst({
      where: { isActive: true }
    })

    if (!config) {
      return NextResponse.json({
        success: false,
        error: 'Mikrotik not configured',
        message: 'No active Mikrotik configuration found. Please configure Mikrotik settings in the admin panel.',
        code: 'MIKROTIK_NOT_CONFIGURED'
      }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'pppoe' // pppoe, hotspot, active

    const mikrotik = await getMikrotikConnection()

    let users = []

    switch (type) {
      case 'pppoe':
        users = await mikrotik.getPPPoEUsers()
        break
      case 'hotspot':
        users = await mikrotik.getHotspotUsers()
        break
      case 'active':
        users = await mikrotik.getPPPoEActive()
        break
      default:
        return NextResponse.json({
          error: 'Invalid type. Use pppoe, hotspot, or active'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length
    })
  } catch (error) {
    console.error('Mikrotik get users error:', error)

    // Handle specific error types
    if (error.message?.includes('No active Mikrotik configuration found')) {
      return NextResponse.json({
        success: false,
        error: 'Mikrotik not configured',
        message: 'No active Mikrotik configuration found. Please configure Mikrotik settings in the admin panel.',
        code: 'MIKROTIK_NOT_CONFIGURED'
      }, { status: 400 })
    }

    if (error.message?.includes('Connection refused') ||
        error.message?.includes('Connection timed out') ||
        error.message?.includes('Host/hostname not found') ||
        error.name === 'TimeoutError' ||
        error.name === 'AbortError') {
      return NextResponse.json({
        success: false,
        error: 'Mikrotik connection failed',
        message: 'Unable to connect to Mikrotik device. Please check your configuration and network connectivity.',
        code: 'MIKROTIK_CONNECTION_FAILED'
      }, { status: 503 })
    }

    if (error.message?.includes('Authentication failed')) {
      return NextResponse.json({
        success: false,
        error: 'Mikrotik authentication failed',
        message: 'Invalid Mikrotik credentials. Please check your username and password.',
        code: 'MIKROTIK_AUTH_FAILED'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch Mikrotik users',
      message: error.message || 'An unexpected error occurred while fetching users.',
      code: 'MIKROTIK_ERROR'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      password, 
      service = 'pppoe', 
      profile, 
      comment,
      type = 'pppoe'
    } = await request.json()

    if (!name || !password || !profile) {
      return NextResponse.json({
        error: 'Name, password, and profile are required'
      }, { status: 400 })
    }

    const mikrotik = await getMikrotikConnection()
    
    let user
    switch (type) {
      case 'pppoe':
        user = await mikrotik.createPPPoEUser({
          name,
          password,
          service,
          profile,
          comment
        })
        break
      case 'hotspot':
        user = await mikrotik.createHotspotUser({
          name,
          password,
          profile,
          comment
        })
        break
      default:
        return NextResponse.json({
          error: 'Invalid type. Use pppoe or hotspot'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: user
    })
  } catch (error) {
    console.error('Mikrotik create user error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to create user'
    }, { status: 500 })
  }
}