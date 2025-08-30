"use client";
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

interface UserSyncProps {
  children: React.ReactNode
}

export function UserSync({ children }: UserSyncProps) {
  const { user, isLoaded } = useUser()
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || synced) return

      try {
        const response = await fetch('/api/sync-user', {
          method: 'POST',
        })

        if (response.ok) {
          setSynced(true)
          console.log('User synced successfully')
        } else {
          console.error('Failed to sync user')
        }
      } catch (error) {
        console.error('Error syncing user:', error)
      }
    }

    syncUser()
  }, [isLoaded, user, synced])

  // You can add a loading state here if needed
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <>{children}</>
}

// Alternative: Custom hook for user sync
export function useUserSync() {
  const { user, isLoaded } = useUser()
  const [synced, setSynced] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || synced || loading) return

      setLoading(true)
      try {
        const response = await fetch('/api/sync-user', {
          method: 'POST',
        })

        if (response.ok) {
          setSynced(true)
        }
      } catch (error) {
        console.error('Error syncing user:', error)
      } finally {
        setLoading(false)
      }
    }

    syncUser()
  }, [isLoaded, user, synced, loading])

  return { synced, loading }
}