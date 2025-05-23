/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { refreshUser } = useAuth()

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to log out")
      }

      // Clear user state immediately
      await refreshUser()

      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      })

      // Redirect to login page
      router.push("/login")
    } catch (error: any) {
      console.error("Logout error:", error)
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "Failed to log out",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="absolute top-4 right-4 bg-white/80 hover:bg-white"
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
      <LogOut className="ml-2 h-4 w-4" />
    </Button>
  )
}
