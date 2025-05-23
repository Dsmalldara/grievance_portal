/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, LollipopIcon as Lipstick, History } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"
import LogoutButton from "@/components/logout-button"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

export default function SubmitGrievancePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [mood, setMood] = useState("")
  const [severity, setSeverity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("Submitting grievance:", { title, content, mood, severity })

      const response = await fetch("/api/grievances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          mood,
          severity,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit grievance")
      }

      console.log("Submission successful:", data)

      // Clear the form
      setTitle("")
      setContent("")
      setMood("")
      setSeverity("")

      toast({
        title: "Grievance submitted",
        description: "Your grievance has been sent to Ishan ❤️",
      })

      router.push("/thank-you")
    } catch (error: any) {
      console.error("Error submitting grievance:", error)
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message || "Failed to submit grievance",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FF9999] via-[#FFA8A8] to-[#FFBDBD] bg-pattern">
        <LogoutButton />

        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <CardTitle className="text-xl">Submit a Grievance</CardTitle>
              <Lipstick className="h-5 w-5 text-red-500" />
            </div>
            {user && (
              <p className="text-sm text-gray-500 mt-1">Hi {user.name || user.email}, what's bothering you today?</p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="focus-visible:ring-[#CCCCFF]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">What&apos;s bothering you?</Label>
                <Textarea
                  id="content"
                  placeholder="What's bothering you?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[100px] focus-visible:ring-[#CCCCFF]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">Mood</Label>
                <Select value={mood} onValueChange={setMood} required>
                  <SelectTrigger id="mood" className="focus-visible:ring-[#CCCCFF]">
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sad">😔 Sad</SelectItem>
                    <SelectItem value="angry">😠 Angry</SelectItem>
                    <SelectItem value="annoyed">😒 Annoyed</SelectItem>
                    <SelectItem value="disappointed">😞 Disappointed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select value={severity} onValueChange={setSeverity} required>
                  <SelectTrigger id="severity" className="focus-visible:ring-[#CCCCFF]">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kitkat">A chunky kitkat would fix this</SelectItem>
                    <SelectItem value="medium">Need a hug to recover</SelectItem>
                    <SelectItem value="high">This ruined my day</SelectItem>
                    <SelectItem value="extreme">I may never recover</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FF6666] hover:bg-[#FF5555] flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                <Heart className="ml-2 h-4 w-4 fill-white" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="outline" className="w-full">
              <Link href="/history" className="flex items-center justify-center">
                <History className="h-4 w-4 mr-2" />
                View All Grievances
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
