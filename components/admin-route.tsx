"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function AdminRoute({ children }: { children: ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading) {
      if (!user?.isAdmin) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page",
        })
        router.push("/")
        return
      }
      setIsChecking(false)
    }
  }, [user, loading, router, toast])

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FF9999] via-[#FFA8A8] to-[#FFBDBD]">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-gray-700">Checking admin permissions...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
