import { getPosts } from '@/app/actions/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PostsActions } from './posts-actions'
import { PostsFilters } from './posts-filters'

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  
  const pinned = params.pinned === 'true' ? true : params.pinned === 'false' ? false : undefined
  const search = typeof params.search === 'string' ? params.search : undefined

  const posts = await getPosts({ pinned, search })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Posts Management</h1>
        <p className="text-muted-foreground">
          Manage community posts and discussions
        </p>
      </div>

      <PostsFilters />

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>
            A list of all community posts. Total: {posts.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Pinned</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                      No posts found
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-md">
                        <div className="flex items-center gap-2">
                          {post.pinned && (
                            <span className="text-yellow-500" title="Pinned">📌</span>
                          )}
                          <span className="truncate">{post.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{post.author.name}</span>
                          {post.author.verified && (
                            <Badge variant="success" className="w-fit mt-1">✓ Verified</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.pinned ? (
                          <Badge variant="default">Pinned</Badge>
                        ) : (
                          <Badge variant="outline">Not Pinned</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{post._count.comments}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <PostsActions post={post} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
