import { auth, currentUser } from '@clerk/nextjs/server'
import { createOrSyncUser } from '@/lib/user'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Get the current user from Clerk
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get full user data from Clerk
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create or sync the user in your database
    const dbUser = await createOrSyncUser(clerkUser)

    return NextResponse.json({ 
      message: 'User synced successfully', 
      user: {
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
        role: dbUser.role,
        wallet: dbUser.wallet
      }
    })
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 })
  }
}