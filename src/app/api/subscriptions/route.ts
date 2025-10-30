import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getMikrotikConnection } from '@/lib/mikrotik'
import { PaymentProcessor } from '@/lib/xendit'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {}
    
    if (userId) where.userId = userId
    if (status) where.status = status.toUpperCase()
    if (type) {
      where.package = {
        type: type.toUpperCase()
      }
    }

    const subscriptions = await db.subscription.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        package: true,
        transactions: {
          where: {
            status: 'SUCCESS'
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: subscriptions,
      count: subscriptions.length
    })
  } catch (error) {
    console.error('Get subscriptions error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to get subscriptions'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      packageId,
      paymentMethod = 'XENDIT'
    } = await request.json()

    if (!userId || !packageId) {
      return NextResponse.json({
        error: 'User ID and Package ID are required'
      }, { status: 400 })
    }

    // Get user and package details
    const [user, packageData] = await Promise.all([
      db.user.findUnique({
        where: { id: userId }
      }),
      db.package.findUnique({
        where: { id: packageId }
      })
    ])

    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 })
    }

    if (!packageData) {
      return NextResponse.json({
        error: 'Package not found'
      }, { status: 404 })
    }

    // Calculate end date
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + packageData.duration)

    // Generate Mikrotik credentials
    const mikrotikName = `${user.name.replace(/\s+/g, '').toLowerCase()}-${Date.now()}`
    const mikrotikPassword = Math.random().toString(36).substring(2, 12)

    // Create subscription
    const subscription = await db.subscription.create({
      data: {
        userId,
        packageId,
        status: 'PENDING',
        startDate,
        endDate,
        mikrotikName,
        mikrotikPassword
      },
      include: {
        user: true,
        package: true
      }
    })

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        type: 'SUBSCRIPTION',
        amount: packageData.price,
        status: 'PENDING',
        paymentMethod,
        description: `Subscription: ${packageData.name} - ${packageData.duration} days`
      }
    })

    // Create payment with Xendit
    if (paymentMethod === 'XENDIT') {
      try {
        const paymentProcessor = new PaymentProcessor()
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        
        const invoice = await paymentProcessor.createSubscriptionPayment(
          userId,
          subscription.id,
          packageData.price,
          `Subscription: ${packageData.name} - ${packageData.duration} days`,
          {
            name: user.name,
            email: user.email,
            phone: user.phone || undefined
          },
          `${baseUrl}/payment/return`
        )

        // Update transaction with Xendit ID
        await db.transaction.update({
          where: { id: transaction.id },
          data: {
            externalId: invoice.id,
            metadata: JSON.stringify({
              invoiceUrl: invoice.invoiceUrl,
              expiryDate: invoice.expiryDate
            })
          }
        })

        return NextResponse.json({
          success: true,
          message: 'Subscription created successfully',
          data: {
            subscription,
            transaction: {
              ...transaction,
              invoiceUrl: invoice.invoiceUrl,
              expiryDate: invoice.expiryDate
            }
          }
        })
      } catch (paymentError) {
        console.error('Payment creation error:', paymentError)
        
        // Delete subscription and transaction if payment fails
        await db.subscription.delete({
          where: { id: subscription.id }
        })
        await db.transaction.delete({
          where: { id: transaction.id }
        })

        return NextResponse.json({
          error: 'Failed to create payment: ' + paymentError.message
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      data: { subscription, transaction }
    })
  } catch (error) {
    console.error('Create subscription error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to create subscription'
    }, { status: 500 })
  }
}