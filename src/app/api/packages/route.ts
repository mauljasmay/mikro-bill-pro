import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // pppoe, hotspot, both
    const active = searchParams.get('active') // true, false

    const where: any = {}
    
    if (type && type !== 'all') {
      where.type = type.toUpperCase()
    }
    
    if (active !== null) {
      where.isActive = active === 'true'
    }

    const packages = await db.package.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { price: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: packages,
      count: packages.length
    })
  } catch (error) {
    console.error('Get packages error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to get packages'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      type,
      price,
      duration,
      dataLimit,
      speedLimit,
      mikrotikProfile
    } = await request.json()

    // Validation
    if (!name || !type || !price || !duration) {
      return NextResponse.json({
        error: 'Name, type, price, and duration are required'
      }, { status: 400 })
    }

    if (!['PPPOE', 'HOTSPOT', 'BOTH'].includes(type.toUpperCase())) {
      return NextResponse.json({
        error: 'Type must be PPPOE, HOTSPOT, or BOTH'
      }, { status: 400 })
    }

    const newPackage = await db.package.create({
      data: {
        name,
        description,
        type: type.toUpperCase(),
        price: parseFloat(price),
        duration: parseInt(duration),
        dataLimit: dataLimit ? parseInt(dataLimit) : null,
        speedLimit,
        mikrotikProfile
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Package created successfully',
      data: newPackage
    })
  } catch (error) {
    console.error('Create package error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to create package'
    }, { status: 500 })
  }
}