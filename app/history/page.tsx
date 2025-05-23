/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, User, Calendar } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"
import LogoutButton from "@/components/logout-button"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Grievance {
  id: string
  title: string
  content: string
  mood: string
  severity: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

const moodEmojis = {
  sad: "😔",
  angry: "😠",
  annoyed: "😒",
  disappointed: "😞",
}

const moodLabels = {
  sad: "Sad",
  angry: "Angry",
  annoyed: "Annoyed",
  disappointed: "Disappointed",
}

const severityColors = {
  kitkat: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  extreme: "bg-red-100 text-red-800",
}

export default function HistoryPage() {
  const [allGrievances, setAllGrievances] = useState<Grievance[]>([])
  const [myGrievances, setMyGrievances] = useState<Grievance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchGrievances() {
      try {
        // Fetch all grievances
        const allResponse = await fetch("/api/grievances/all")

        if (!allResponse.ok) {
          throw new Error("Failed to fetch all grievances")
        }

        const allData = await allResponse.json()
        setAllGrievances(allData.grievances || [])

        // Fetch my grievances
        const myResponse = await fetch("/api/grievances")

        if (!myResponse.ok) {
          throw new Error("Failed to fetch your grievances")
        }

        const myData = await myResponse.json()
        setMyGrievances(myData.grievances || [])
      } catch (error: any) {
        console.error("Error fetching grievances:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load grievance history",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrievances()
  }, [toast])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen p-4 bg-gradient-to-br from-[#FF9999] via-[#FFA8A8] to-[#FFBDBD] bg-pattern">
          <LogoutButton />
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl mt-16">
              <CardContent className="p-6">
                <p className="text-center">Loading grievances...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-4 bg-gradient-to-br from-[#FF9999] via-[#FFA8A8] to-[#FFBDBD] bg-pattern">
        <LogoutButton />

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button asChild variant="outline" className="bg-white/80 hover:bg-white">
              <Link href="/submit">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Submit
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white">Grievance History</h1>
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            </div>
          </div>

          {user?.isAdmin && (
            <div className="mb-4">
              <Button asChild variant="outline" className="bg-white/80 hover:bg-white">
                <Link href="/admin/users">
                  <User className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
            </div>
          )}

          <Tabs defaultValue="my-grievances" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="my-grievances">Your Grievances</TabsTrigger>
              <TabsTrigger value="all-grievances">All Grievances</TabsTrigger>
            </TabsList>

            {/* Your Grievances Tab */}
            <TabsContent value="my-grievances">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Grievances You Submitted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {myGrievances.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">You haven't submitted any grievances yet.</p>
                      <Button asChild className="bg-[#FF6666] hover:bg-[#FF5555]">
                        <Link href="/submit">Submit Your First Grievance</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myGrievances.map((grievance) => (
                        <div key={grievance.id} className="bg-white p-4 rounded-lg border">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-lg">{grievance.title}</h3>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <span className="text-2xl mr-1">
                                  {moodEmojis[grievance.mood as keyof typeof moodEmojis]}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {moodLabels[grievance.mood as keyof typeof moodLabels]}
                                </span>
                              </div>
                              <Badge className={severityColors[grievance.severity as keyof typeof severityColors]}>
                                {grievance.severity === "kitkat" && "KitKat Fix"}
                                {grievance.severity === "medium" && "Need Hug"}
                                {grievance.severity === "high" && "Day Ruined"}
                                {grievance.severity === "extreme" && "Never Recover"}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{grievance.content}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(grievance.createdAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* All Grievances Tab */}
            <TabsContent value="all-grievances">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">All Submitted Grievances</CardTitle>
                </CardHeader>
                <CardContent>
                  {allGrievances.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No grievances have been submitted yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {allGrievances.map((grievance) => (
                        <div key={grievance.id} className="bg-white p-4 rounded-lg border">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-lg">{grievance.title}</h3>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <span className="text-2xl mr-1">
                                  {moodEmojis[grievance.mood as keyof typeof moodEmojis]}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {moodLabels[grievance.mood as keyof typeof moodLabels]}
                                </span>
                              </div>
                              <Badge className={severityColors[grievance.severity as keyof typeof severityColors]}>
                                {grievance.severity === "kitkat" && "KitKat Fix"}
                                {grievance.severity === "medium" && "Need Hug"}
                                {grievance.severity === "high" && "Day Ruined"}
                                {grievance.severity === "extreme" && "Never Recover"}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{grievance.content}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(grievance.createdAt)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="h-4 w-4 mr-1" />
                              <span className="font-medium">by {grievance.user.name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
