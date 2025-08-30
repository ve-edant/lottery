import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function PUT(req: Request) {
  try {
    // Check if user is authenticated and is admin
    const { userId, sessionClaims } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role
    if (sessionClaims?.metadata?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const { userId: targetUserId, balance } = body

    // Validate input
    if (!targetUserId || typeof balance !== 'number') {
      return NextResponse.json({ 
        error: 'Invalid input - userId and balance are required' 
      }, { status: 400 })
    }

    if (balance < 0) {
      return NextResponse.json({ 
        error: 'Balance cannot be negative' 
      }, { status: 400 })
    }

    // Find the user by clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkid: targetUserId },
      include: { wallet: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.wallet) {
      return NextResponse.json({ error: 'User wallet not found' }, { status: 404 })
    }

    // Get current balance for transaction record
    const currentBalance = user.wallet.balance

    // Update wallet balance and create transaction record
    const result = await prisma.$transaction(async (tx) => {
      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userid: user.id },
        data: { balance }
      })

      // Create transaction record for the balance change
      const balanceDifference = balance - currentBalance
      const transactionType = balanceDifference > 0 ? 'DEPOSIT' : 'WITHDRAW'

      await tx.transaction.create({
        data: {
          userid: user.id,
          type: transactionType,
          amount: Math.abs(balanceDifference),
          balanceafter: balance,
        }
      })

      return updatedWallet
    })

    // Return updated user data
    const updatedUser = await prisma.user.findUnique({
      where: { clerkid: targetUserId },
      include: { wallet: true }
    })

    return NextResponse.json({
      message: 'Balance updated successfully',
      user: updatedUser,
      wallet: result
    })

  } catch (error) {
    console.error('Error updating balance:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}