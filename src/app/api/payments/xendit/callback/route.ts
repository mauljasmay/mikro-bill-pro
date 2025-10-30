import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getXenditInstance } from '@/lib/xendit'
import { getMikrotikConnection } from '@/lib/mikrotik'

export async function POST(request: NextRequest) {
  try {
    const callbackData = await request.json()
    
    // Verify callback token
    const xendit = getXenditInstance()
    const callbackToken = request.headers.get('x-callback-token')
    
    if (!callbackToken || !xendit.verifyCallbackToken(callbackToken)) {
      return NextResponse.json({
        error: 'Invalid callback token'
      }, { status: 401 })
    }

    const { id, external_id, status, paid_amount, payment_method, payment_channel } = callbackData

    // Find the transaction
    const transaction = await db.transaction.findFirst({
      where: {
        externalId: id
      },
      include: {
        user: true,
        subscription: {
          include: {
            package: true
          }
        }
      }
    })

    if (!transaction) {
      console.error('Transaction not found for external_id:', external_id)
      return NextResponse.json({
        error: 'Transaction not found'
      }, { status: 404 })
    }

    // Update transaction status
    const updatedTransaction = await db.transaction.update({
      where: { id: transaction.id },
      data: {
        status: status.toUpperCase() === 'PAID' ? 'SUCCESS' : 'FAILED',
        paymentMethod: payment_method,
        paymentChannel: payment_channel,
        metadata: JSON.stringify(callbackData)
      }
    })

    // If payment is successful, activate subscription and create Mikrotik user
    if (status.toUpperCase() === 'PAID' && transaction.subscription) {
      try {
        const mikrotik = await getMikrotikConnection()
        const subscription = transaction.subscription

        // Create Mikrotik user based on package type
        if (subscription.package.type === 'PPPOE' || subscription.package.type === 'BOTH') {
          await mikrotik.createPPPoEUser({
            name: subscription.mikrotikName!,
            password: subscription.mikrotikPassword!,
            service: 'pppoe',
            profile: subscription.package.mikrotikProfile || 'default',
            comment: `User: ${transaction.user.name} | Package: ${subscription.package.name}`
          })
        }

        if (subscription.package.type === 'HOTSPOT' || subscription.package.type === 'BOTH') {
          await mikrotik.createHotspotUser({
            name: subscription.mikrotikName!,
            password: subscription.mikrotikPassword!,
            profile: subscription.package.mikrotikProfile || 'default',
            comment: `User: ${transaction.user.name} | Package: ${subscription.package.name}`
          })
        }

        // Update subscription status
        await db.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'ACTIVE',
            lastRenewal: new Date()
          }
        })

        // Update user Mikrotik ID
        await db.user.update({
          where: { id: transaction.userId },
          data: {
            mikrotikId: subscription.mikrotikName
          }
        })

        console.log(`Successfully activated subscription ${subscription.id} and created Mikrotik user`)

      } catch (mikrotikError) {
        console.error('Failed to create Mikrotik user:', mikrotikError)
        
        // Don't fail the payment, but log the error for manual intervention
        // You might want to create a notification system here
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Callback processed successfully'
    })

  } catch (error) {
    console.error('Xendit callback error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to process callback'
    }, { status: 500 })
  }
}