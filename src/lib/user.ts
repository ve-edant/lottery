/* eslint-disable */
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// Get current user from database using Clerk ID
export async function getCurrentUser() {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { clerkid: clerkId },
      include: {
        wallet: true,
      }
    })

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Get user by ID
export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        wallet: true,
        bets: true,
        transactions: true,
      }
    })

    return user
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}

// Get user by Clerk ID
export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkid: clerkId },
      include: {
        wallet: true,
        bets: true,
        transactions: true,
      }
    })

    return user
  } catch (error) {
    console.error('Error getting user by Clerk ID:', error)
    return null
  }
}

// Create or sync user (useful for edge cases where webhook might fail)
export async function createOrSyncUser(clerkUser: any) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkid: clerkUser.id }
    })

    if (existingUser) {
      // Update existing user
      return await prisma.user.update({
        where: { clerkid: clerkUser.id },
        data: {
          email: clerkUser.emailAddresses?.[0]?.emailAddress,
          username: clerkUser.username || clerkUser.firstName || clerkUser.lastName || null,
        },
        include: { wallet: true }
      })
    } else {
      // Create new user with transaction
      const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            clerkid: clerkUser.id,
            email: clerkUser.emailAddresses?.[0]?.emailAddress,
            username: clerkUser.username || clerkUser.firstName || clerkUser.lastName || null,
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

      return result
    }
  } catch (error) {
    console.error('Error creating/syncing user:', error)
    throw error
  }
}

// Update user role (admin function)
export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: { role }
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}