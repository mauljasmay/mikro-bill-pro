import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Authentication disabled - direct access to Mikrotik config

export async function GET(request: NextRequest) {
  try {
    const configs = await db.mikrotikConfig.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      configs
    })
  } catch (error) {
    console.error('Get Mikrotik configs error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to get Mikrotik configurations'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, host, port, username, password, useSSL } = await request.json()

    if (!name || !host || !username || !password) {
      return NextResponse.json({
        error: 'Name, host, username, and password are required'
      }, { status: 400 })
    }

    // Check if config with this name already exists
    const existingConfig = await db.mikrotikConfig.findFirst({
      where: { name }
    })

    let config
    if (existingConfig) {
      // Update existing config
      // Deactivate all other configs if this one is set to active
      await db.mikrotikConfig.updateMany({
        where: { 
          isActive: true,
          id: { not: existingConfig.id }
        },
        data: { isActive: false }
      })

      config = await db.mikrotikConfig.update({
        where: { id: existingConfig.id },
        data: {
          host,
          port: parseInt(port) || 8728,
          username,
          password,
          useSSL: useSSL || false,
          isActive: true
        }
      })
    } else {
      // Create new config
      // Deactivate all other configs
      await db.mikrotikConfig.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      })

      config = await db.mikrotikConfig.create({
        data: {
          name,
          host,
          port: parseInt(port) || 8728,
          username,
          password,
          useSSL: useSSL || false,
          isActive: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: existingConfig ? 'Mikrotik configuration updated successfully' : 'Mikrotik configuration created successfully',
      config
    })
  } catch (error) {
    console.error('Create Mikrotik config error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({
      error: errorMessage
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, host, port, username, password, useSSL, isActive } = await request.json()

    if (!id) {
      return NextResponse.json({
        error: 'Configuration ID is required'
      }, { status: 400 })
    }

    // Deactivate all other configs if this one is set to active
    if (isActive) {
      await db.mikrotikConfig.updateMany({
        where: { id: { not: id } },
        data: { isActive: false }
      })
    }

    const config = await db.mikrotikConfig.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(host && { host }),
        ...(port && { port: parseInt(port) }),
        ...(username && { username }),
        ...(password && { password }),
        ...(useSSL !== undefined && { useSSL }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Mikrotik configuration updated successfully',
      config
    })
  } catch (error) {
    console.error('Update Mikrotik config error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({
      error: errorMessage
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        error: 'Configuration ID is required'
      }, { status: 400 })
    }

    await db.mikrotikConfig.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Mikrotik configuration deleted successfully'
    })
  } catch (error) {
    console.error('Delete Mikrotik config error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({
      error: errorMessage
    }, { status: 500 })
  }
}