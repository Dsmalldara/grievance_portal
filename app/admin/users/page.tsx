/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Mail, Calendar, Shield } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"
import AdminRoute from "@/components/admin-route"
import LogoutButton from "@/components/logout-button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface UserData {
  id: string
  name: string
  email: string
  isAdmin: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/admin/users")

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()
        setUsers(data.users || [])
      } catch (error: any) {
        console.error("Error fetching users:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users. Admin access required.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <ProtectedRoute>
      <AdminRoute>
        <div className="min-h-screen p-4 bg-gradient-to-br from-[#FF9999] via-[#FFA8A8] to-[#FFBDBD] bg-pattern">
          <LogoutButton />

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Button asChild variant="outline" className="bg-white/80 hover:bg-white">
                <Link href="/history">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Grievances
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <Shield className="h-6 w-6 text-yellow-400" />
              </div>
            </div>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Registered Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No users found.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.isAdmin ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                  Admin
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                  User
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                {formatDate(user.createdAt)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminRoute>
    </ProtectedRoute>
  )
}
