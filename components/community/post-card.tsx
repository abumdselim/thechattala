import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PostWithRelations } from "@/types"
import { Clock, CheckCircle } from "lucide-react"
import Image from "next/image"

interface PostCardProps {
  post: PostWithRelations
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }
    if (email) {
      return email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <Link href={`/community/${post.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        {post.images && post.images.length > 0 && (
          <div className="relative aspect-video overflow-hidden bg-gray-100">
            <Image
              src={post.images[0]}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardContent className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {post.category.name}
            </Badge>
            {post.isVerified && (
              <Badge className="bg-green-500 text-white border-0 text-xs">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
          <h3 className="line-clamp-2 font-semibold text-gray-900">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-gray-600">
            {post.content}
          </p>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 px-4 py-3">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.image || undefined} />
                <AvatarFallback style={{ backgroundColor: '#0891B2' }} className="text-white text-xs">
                  {getUserInitials(post.author.name || undefined, post.author.email)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600">
                {post.author.name || 'Anonymous'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Clock className="h-3 w-3" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
