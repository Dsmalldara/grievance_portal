"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Heart, Sparkles, List } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"
import LogoutButton from "@/components/logout-button"
import { useAuth } from "@/components/auth-provider"

export default function ThankYouPage() {
  const { user } = useAuth()
  const name = user?.name || user?.email || "there"

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FF9999] via-[#FFA8A8] to-[#FFBDBD] bg-pattern">
        <LogoutButton />

        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <CardTitle className="text-2xl">Thank you, {name}</CardTitle>
              <div className="flex">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
            <CardDescription className="text-base flex items-center justify-center">
              Your grievance has been sent to Ishan
              <Heart className="ml-1 h-3 w-3 text-red-500 fill-red-500" />
            </CardDescription>
            <CardDescription className="text-base">
              He will get back to you very soon! (He will think about it)
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-4">
            <Button asChild className="bg-[#FF6666] hover:bg-[#FF5555]">
              <Link href="/submit">Submit Another</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/history" className="flex items-center">
                <List className="h-4 w-4 mr-2" />
                View History
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
