"use client"

import { useEffect, useState, useRef, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const [hasRedirected, setHasRedirected] = useState(false)
  const router = useRouter()
  const { user, loading, refreshUser } = useAuth()
  const { toast } = useToast()
  const toastShownRef = useRef(false)

  useEffect(() => {
    const checkAuth = async () => {
      // If still loading, wait
      if (loading) return

      // If already redirected, don't do anything
      if (hasRedirected) return

      // If not loading and no user, try refreshing once more
      if (!user) {
        console.log("No user found, attempting refresh...")
        await refreshUser()

        // Check again after refresh
        setTimeout(() => {
          if (!user && !hasRedirected && !toastShownRef.current) {
            console.log("No user found after refresh, redirecting to login")
            toastShownRef.current = true
            setHasRedirected(true)

            toast({
              variant: "destructive",
              title: "Authentication required",
              description: "Please log in to access this page",
            })

            router.push("/login")
            return
          }
        }, 500)
      } else {
        // User is authenticated
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [user, loading, router, toast, refreshUser, hasRedirected])

  // Reset redirect flag when user changes (e.g., logs in)
  useEffect(() => {
    if (user) {
      setHasRedirected(false)
      toastShownRef.current = false
      setIsChecking(false)
    }
  }, [user])

  if (loading || isChecking || hasRedirected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FF9999] via-[#FFA8A8] to-[#FFBDBD]">
        <div className="text-center">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
