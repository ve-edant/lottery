import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'


export async function GET() {
  try {
    console.log('GET /api/admin/users called')
    
    // Check if user is authenticated and is admin
    const { userId, sessionClaims } = await auth()
    
    console.log('Auth check:', { userId, role: sessionClaims?.metadata?.role })
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role
    if (sessionClaims?.metadata?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    console.log('Fetching users from database...')

    // Fetch all users with their wallet information
    const users = await prisma.user.findMany({
      include: {
        wallet: true,
        _count: {
          select: {
            bets: true,
            transactions: true
          }
        }
      },
      orderBy: {
        createdat: 'desc' // Most recent users first
      }
    })

    console.log(`Found ${users.length} users`)

    // Format the response to match your component's expected structure
    const formattedUsers = users.map(user => ({
      clerkid: user.clerkid,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdat,
      updatedAt: user.updatedat,
      wallet: user.wallet ? {
        id: user.wallet.id,
        balance: user.wallet.balance
      } : null,
      stats: {
        totalBets: user._count.bets,
        totalTransactions: user._count.transactions
      }
    }))

    return NextResponse.json(formattedUsers)

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Get the current user's Clerk ID
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { clerkid: userId },
      include: { wallet: true }
    })

    if (existingUser) {
      return NextResponse.json({ 
        message: 'User already synced', 
        user: {
          id: existingUser.id,
          email: existingUser.email,
          username: existingUser.username,
          role: existingUser.role,
          wallet: existingUser.wallet
        }
      })
    }

    // If user doesn't exist, create with minimal data
    // The webhook will handle full sync when it fires
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          clerkid: userId,
          email: '', // Will be updated by webhook
          username: null, // Will be updated by webhook
        }
      })

      const wallet = await tx.wallet.create({
        data: {
          userid: newUser.id,
          balance: 0,
        }
      })

      return { ...newUser, wallet }
    })

    return NextResponse.json({ 
      message: 'User created successfully (will be synced by webhook)', 
      user: {
        id: result.id,
        email: result.email,
        username: result.username,
        role: result.role,
        wallet: result.wallet
      }
    })

  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json({ 
      error: 'Failed to sync user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}