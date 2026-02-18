import { getProducts, getCategories } from '@/app/actions/admin'
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
import { ProductsActions } from './products-actions'
import { ProductsFilters } from './products-filters'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  
  const status = params.status === 'PENDING' || params.status === 'APPROVED' || params.status === 'REJECTED' 
    ? params.status 
    : undefined
  const categoryId = typeof params.categoryId === 'string' ? params.categoryId : undefined
  const search = typeof params.search === 'string' ? params.search : undefined

  const [products, categories] = await Promise.all([
    getProducts({ status, categoryId, search }),
    getCategories(),
  ])

  const pendingCount = products.filter(p => p.status === 'PENDING').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
        <p className="text-muted-foreground">
          Review and manage marketplace products
        </p>
      </div>

      {pendingCount > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm font-medium">
              ⚠️ {pendingCount} product{pendingCount !== 1 ? 's' : ''} pending approval
            </p>
          </CardContent>
        </Card>
      )}

      <ProductsFilters categories={categories} />

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            A list of all products in the marketplace. Total: {products.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {product.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{product.seller.name}</span>
                          {product.seller.verified && (
                            <Badge variant="success" className="w-fit mt-1">✓ Verified</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>৳{product.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === 'APPROVED'
                              ? 'success'
                              : product.status === 'REJECTED'
                              ? 'destructive'
                              : 'outline'
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <ProductsActions product={product} />
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
