"use server";

import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'


export async function updateUserBalance(userId: string, newBalance: number) {
  try {
    // Check authentication and admin role
    const { userId: currentUserId, sessionClaims } = await auth()
    
    if (!currentUserId) {
      return { error: 'Unauthorized' }
    }

    if (sessionClaims?.metadata?.role !== 'ADMIN') {
      return { error: 'Forbidden - Admin access required' }
    }

    // Validate input
    if (!userId || typeof newBalance !== 'number') {
      return { error: 'Invalid input - userId and balance are required' }
    }

    if (newBalance < 0) {
      return { error: 'Balance cannot be negative' }
    }

    // Find the user by clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkid: userId },
      include: { wallet: true }
    })

    if (!user) {
      return { error: 'User not found' }
    }

    if (!user.wallet) {
      return { error: 'User wallet not found' }
    }

    // Get current balance for transaction record
    const currentBalance = user.wallet.balance

    // Update wallet balance and create transaction record
    const result = await prisma.$transaction(async (tx) => {
      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userid: user.id },
        data: { balance: newBalance }
      })

      // Create transaction record for the balance change
      const balanceDifference = newBalance - currentBalance
      const transactionType = balanceDifference > 0 ? 'DEPOSIT' : 'WITHDRAW'

      if (balanceDifference !== 0) {
        await tx.transaction.create({
          data: {
            userid: user.id,
            type: transactionType,
            amount: Math.abs(balanceDifference),
            balanceafter: newBalance,
          }
        })
      }

      return updatedWallet
    })

    // Revalidate the admin dashboard
    revalidatePath('/admin')

    return { 
      success: true, 
      message: 'Balance updated successfully',
      wallet: result
    }

  } catch (error) {
    console.error('Error updating balance:', error)
    return { error: 'Failed to update balance' }
  }
}

export async function deleteUser(userId: string) {
  try {
    // Delete from Clerk
    const client = await clerkClient();
    await client.users.deleteUser(userId);

    // Delete from your DB
    await prisma.user.delete({ where: { clerkid: userId } });

    return { ok: true };
  } catch (err) {
    console.error("Failed to delete user:", err);
    return { error: "Delete failed" };
  }
}
