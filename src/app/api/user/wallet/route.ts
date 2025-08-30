import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get the current user's Clerk ID
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user and their wallet
    const user = await prisma.user.findUnique({
      where: { clerkid: userId },
      include: {
        wallet: true,
        transactions: {
          orderBy: { createdat: 'desc' },
          take: 5 // Get last 5 transactions for additional info if needed
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.wallet) {
      // If wallet doesn't exist, create one
      const newWallet = await prisma.wallet.create({
        data: {
          userid: user.id,
          balance: 0
        }
      })
      
      return NextResponse.json({
        balance: newWallet.balance,
        walletId: newWallet.id,
        message: 'Wallet created'
      })
    }

    return NextResponse.json({
      balance: user.wallet.balance,
      walletId: user.wallet.id,
      recentTransactions: user.transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        balanceAfter: t.balanceafter,
        createdAt: t.createdat
      }))
    })

  } catch (error) {
    console.error('Error fetching wallet:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}