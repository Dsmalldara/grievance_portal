/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { user, refreshUser } = useAuth()

  // If already logged in, redirect to submit page
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to submit page")
      router.push("/submit")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting to sign in with email:", email)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      if (!data.success) {
        setError(data.message || "Invalid email or password")
        toast({
          variant: "destructive",
          title: "Login failed",
          description: data.message || "Invalid email or password",
        })
        return
      }

      // Refresh user data
      await refreshUser()

      console.log("Login successful:", email)
      toast({
        title: "Login successful",
        description: "Welcome back! ❤️",
      })

      // Navigate to submit page
      router.push("/submit")
    } catch (err: any) {
      console.error("Unexpected login error:", err)
      setError(err.message || "An unexpected error occurred")
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err.message || "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FF9999] via-[#FFA8A8] to-[#FFBDBD] bg-pattern">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <CardTitle className="text-xl">Tes&apos;s Grievance Portal</CardTitle>
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-visible:ring-[#CCCCFF]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:ring-[#CCCCFF]"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-[#00CC00] hover:bg-[#00B300]" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild className="text-[#FF6666] hover:text-[#FF5555]">
            <Link href="/signup">Don&apos;t have an account? Sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
