import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Check if packages already exist
    const existingPackages = await db.package.count()
    if (existingPackages > 0) {
      return NextResponse.json({
        success: false,
        message: 'Packages already exist'
      })
    }

    // Create default packages
    const defaultPackages = [
      {
        name: 'Basic Package',
        description: 'Perfect for light internet usage',
        type: 'PPPOE',
        price: 50000,
        duration: 30,
        dataLimit: null,
        speedLimit: '5Mbps/5Mbps',
        mikrotikProfile: 'basic'
      },
      {
        name: 'Home Package',
        description: 'Great for families and regular usage',
        type: 'PPPOE',
        price: 100000,
        duration: 30,
        dataLimit: null,
        speedLimit: '10Mbps/10Mbps',
        mikrotikProfile: 'home'
      },
      {
        name: 'Gaming Package',
        description: 'Low latency for gaming enthusiasts',
        type: 'PPPOE',
        price: 200000,
        duration: 30,
        dataLimit: null,
        speedLimit: '20Mbps/20Mbps',
        mikrotikProfile: 'gaming'
      },
      {
        name: 'Hotspot Package',
        description: 'Flexible hotspot access',
        type: 'HOTSPOT',
        price: 25000,
        duration: 7,
        dataLimit: 5000,
        speedLimit: '5Mbps/5Mbps',
        mikrotikProfile: 'hotspot'
      },
      {
        name: 'Family Package',
        description: 'Multiple users with high speed',
        type: 'BOTH',
        price: 300000,
        duration: 30,
        dataLimit: null,
        speedLimit: '50Mbps/50Mbps',
        mikrotikProfile: 'family'
      },
      {
        name: 'Enterprise Package',
        description: 'Business grade internet solution',
        type: 'PPPOE',
        price: 1000000,
        duration: 30,
        dataLimit: null,
        speedLimit: '100Mbps/100Mbps',
        mikrotikProfile: 'enterprise'
      }
    ]

    const createdPackages = await Promise.all(
      defaultPackages.map(pkg => 
        db.package.create({
          data: pkg
        })
      )
    )

    return NextResponse.json({
      success: true,
      message: 'Default packages created successfully',
      data: createdPackages
    })
  } catch (error) {
    console.error('Setup packages error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to setup packages'
    }, { status: 500 })
  }
}