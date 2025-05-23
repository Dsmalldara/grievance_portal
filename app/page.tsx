import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FF9999] via-[#FFA8A8] to-[#FFBDBD] bg-pattern">
      <div className="text-center max-w-md px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to your very own Grievance Portal, mouse</h1>
        <p className="text-lg text-gray-700 mb-8">
          As requested, you can submit your lame made-up grievances for my viewing pleasure
        </p>
        <Button
          asChild
          className="bg-[#FF6666] hover:bg-[#FF5555] text-white px-8 py-6 text-lg rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-105"
        >
          <Link href="/login" className="flex items-center">
            Login
            <Heart className="ml-2 h-5 w-5 fill-white" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
