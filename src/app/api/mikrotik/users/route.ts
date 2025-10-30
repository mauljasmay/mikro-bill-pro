import { NextRequest, NextResponse } from 'next/server'
import { getMikrotikConnection } from '@/lib/mikrotik'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
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
    return NextResponse.json({
      error: error.message || 'Failed to get users'
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