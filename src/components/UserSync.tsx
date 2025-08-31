'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

interface UserSyncProps {
  children: React.ReactNode
}

export function UserSync({ children }: UserSyncProps) {
  const { user, isLoaded } = useUser()
  const [synced, setSynced] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

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
          const errorData = await response.json()
          console.error('Failed to sync user:', errorData)
          
          // Retry logic for transient errors
          if (retryCount < maxRetries && response.status >= 500) {
            setRetryCount(prev => prev + 1)
            setTimeout(() => {
              console.log(`Retrying user sync (attempt ${retryCount + 1})`)
            }, 2000 * (retryCount + 1)) // Exponential backoff
          } else {
            console.error('Max retries reached or non-retryable error')
          }
        }
      } catch (error) {
        console.error('Error syncing user:', error)
        
        // Retry for network errors
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1)
          setTimeout(() => {
            console.log(`Retrying user sync after network error (attempt ${retryCount + 1})`)
          }, 2000 * (retryCount + 1))
        }
      }
    }

    syncUser()
  }, [isLoaded, user, synced, retryCount])

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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || synced || loading) return

      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/sync-user', {
          method: 'POST',
        })

        if (response.ok) {
          setSynced(true)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to sync user')
        }
      } catch (error) {
        console.error('Error syncing user:', error)
        setError('Network error during sync')
      } finally {
        setLoading(false)
      }
    }

    syncUser()
  }, [isLoaded, user, synced, loading])

  return { synced, loading, error }
}