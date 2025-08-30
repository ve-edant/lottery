import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { DeletedObjectJSON, UserJSON, WebhookEvent } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.text()

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET!)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400
    })
  }

  // Handle the webhook
  const eventType = evt.type

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      case 'user.deleted':
        await handleUserDeleted(evt.data)
        break
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return new Response('Webhook processed successfully', { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Error processing webhook', { status: 500 })
  }
}

async function handleUserCreated(userData: UserJSON) {
  try {
    // Extract user data from Clerk
    const clerkId = userData.id
    const email = userData.email_addresses?.[0]?.email_address
    const username = userData.username || userData.first_name || userData.last_name || null

    console.log('Creating user:', { clerkId, email, username })

    // Create user in database with transaction to ensure wallet is also created
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          clerkid: clerkId,
          email: email,
          username: username,
        }
      })

      // Create associated wallet
      const wallet = await tx.wallet.create({
        data: {
          userid: newUser.id,
          balance: 0, // Starting balance
        }
      })

      return { user: newUser, wallet }
    })

    console.log('User created successfully:', result.user.id)
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

async function handleUserUpdated(userData: UserJSON) {
  try {
    const clerkId = userData.id
    const email = userData.email_addresses?.[0]?.email_address
    const username = userData.username || userData.first_name || userData.last_name || null

    console.log('Updating user:', { clerkId, email, username })

    await prisma.user.update({
      where: { clerkid: clerkId },
      data: {
        email: email,
        username: username,
      }
    })

    console.log('User updated successfully')
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

async function handleUserDeleted(userData: DeletedObjectJSON) {
  try {
    const clerkId = userData.id

    console.log('Deleting user:', clerkId)

    // Delete user (wallet and other related records will be cascade deleted)
    await prisma.user.delete({
      where: { clerkid: clerkId }
    })

    console.log('User deleted successfully')
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}